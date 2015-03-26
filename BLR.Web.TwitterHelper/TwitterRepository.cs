using BLR.Configuration;
using LinqToTwitter;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BLR.Web.TwitterHelper
{
    public enum TweetType
    {
        Timeline = 0,
        List = 1
    }

    public class TwitterRepository
    {
        private static TwitterRepository _instance;
        private TwitterContext _context;
        private InMemberCachingHelper<List<Tweet>> _cachingHelper;

        public List<Tweet> GetList(string listName)
        {
            return GetLatestListOf(listName, ConfigProvider.NumberOfMaxTweetsAtFirst);
        }

        public List<Tweet> GetTimeline(string screenName)
        {
            return GetLatestTimelineOf(screenName, ConfigProvider.NumberOfMaxTweetsAtFirst);
        }

        private List<Tweet> GetLatestTimelineOf(string screenName, int numberOfTweets = 0)
        {
            List<Tweet> result = null;

            if (!_cachingHelper.Contains(screenName))
            {
                result = TweetFormatter.FormatTweets(FetchTimeline(screenName, true, numberOfTweets));
                InitiateCache(screenName, TweetType.Timeline);
                return result;
            }

            ulong maxRepoId = _cachingHelper.GetValue(screenName).Max(t => t.StatusId);

            if (result == null)
                return _cachingHelper.GetValue(screenName);

            return result;
        }

        private void InitiateCache(string key, TweetType type)
        {
            Task.Factory.StartNew((repo) =>
            {
                InMemberCachingHelper<List<Tweet>> repository = repo as InMemberCachingHelper<List<Tweet>>;

                if (type == TweetType.Timeline)
                    repository.Add(key, TweetFormatter.FormatTweets(FetchTimeline(key, true)), new DateTimeOffset(DateTime.Now.AddMinutes(ConfigProvider.CacheExpiration)));
                else
                    repository.Add(key, TweetFormatter.FormatTweets(FetchList(key, true)), new DateTimeOffset(DateTime.Now.AddMinutes(ConfigProvider.CacheExpiration)));

            }, _cachingHelper);
        }

        private List<Status> FetchTimeline(string screenName, bool all = false, int numberOfTweets = 0)
        {
            if (all)
            {
                return (from tweet in _context.Status
                        where tweet.Type == StatusType.User &&
                              tweet.ScreenName == screenName &&
                              tweet.SinceID == 1 &&
                              tweet.Count == (numberOfTweets == 0 ? ConfigProvider.CacheSize : numberOfTweets)
                        select tweet).ToList();
            }
            else
            {
                return (from tweet in _context.Status
                        where tweet.Type == StatusType.User &&
                              tweet.ScreenName == screenName &&
                              tweet.Count == 1
                        select tweet).ToList();
            }
        }

        private List<Tweet> GetLatestListOf(string listName, int numberOfRecords)
        {
            List<Tweet> tweets = null;

            if (!_cachingHelper.Contains(listName))
            {
                tweets = TweetFormatter.FormatTweets(FetchList(listName, true, numberOfRecords));
                InitiateCache(listName, TweetType.List);

                return tweets;
            }

            if (tweets == null)
            {
                return _cachingHelper.GetValue(listName);
            }

            return tweets;
        }

        private List<Status> FetchList(string listName, bool all = false, int numberOfTweets = 0)
        {
            if (all)
            {
                return (from tweet in _context.List
                        where tweet.Type == ListType.Statuses &&
                                tweet.OwnerScreenName == ConfigProvider.TwitterOwnerScreenName &&
                                tweet.Slug == listName &&
                                tweet.SinceID == 1 &&
                                tweet.Count == (numberOfTweets == 0 ? ConfigProvider.CacheSize : numberOfTweets)
                        select tweet).First().Statuses;
            }
            else
            {
                return (from tweet in _context.List
                        where tweet.Type == ListType.Statuses &&
                                tweet.OwnerScreenName == ConfigProvider.TwitterOwnerScreenName &&
                                tweet.Slug == listName &&
                                tweet.Count == 1
                        select tweet).First().Statuses;
            }
        }

        private TwitterRepository()
        {
            MvcAuthorizer auth = new MvcAuthorizer()
             {
                 CredentialStore = new InMemoryCredentialStore()
                 {
                     ConsumerKey = ConfigProvider.TwitterConsumerKey,
                     ConsumerSecret = ConfigProvider.TwitterConsumerSecret
                 }
             };

            _context = new TwitterContext(auth);
            _cachingHelper = new InMemberCachingHelper<List<Tweet>>();
        }

        public static TwitterRepository getInstance()
        {
            if (_instance == null)
            {
                _instance = new TwitterRepository();
            }

            return _instance;
        }
    }
}
