using BLR.Configuration;
using LinqToTwitter;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using BLR.Caching;

namespace BLR.Web.TwitterHelper
{
    public class TwitterRepository
    {
        private static TwitterRepository _instance;
        private TwitterContext _context;
        public CacheManager<string, List<Tweet>> CacheManager;

        public List<Tweet> GetList(string listName)
        {
            return CacheManager.Get(listName.ToLowerInvariant());
        }

        public List<Tweet> GetTimeline(string screenName)
        {
            return CacheManager.Get(screenName.ToLowerInvariant());
        }

        private List<Tweet> InitiateCache(string key)
        {
            return InitiateCache(key, 0);
        }

        private List<Tweet> InitiateCache(string key, int numberOfRetry = 0)
        {
            try
            {
                if (ConfigProvider.TwitterNames.Contains(key))
                    return TweetFormatter.FormatTweets(FetchTimeline(key, true));
                else if (ConfigProvider.ListNames.Contains(key))
                    return TweetFormatter.FormatTweets(FetchList(key, true));
                else
                    return null;
            }
            catch (Exception ex)
            {
                if (numberOfRetry < 3)
                    return InitiateCache(key, ++numberOfRetry);
                else
                    return null;
            }
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
            CacheManager = CacheManager<string, List<Tweet>>.GetInstance(InitiateCache, ConfigProvider.CacheExpiration);
            ConfigProvider.TwitterNames.ForEach(CacheManager.AddKey);
            ConfigProvider.ListNames.ForEach(CacheManager.AddKey);
            CacheManager.StartBuildingCache();
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
