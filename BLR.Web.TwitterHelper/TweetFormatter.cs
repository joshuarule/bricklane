using BLR.Configuration;
using LinqToTwitter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace BLR.Web.TwitterHelper
{
    public static class TweetFormatter
    {
        private static Regex urlToAnchors = new Regex("(http[s]*://([^ ]+))");

        public static List<Tweet> FormatTweets(List<Status> statuses)
        {
            List<Tweet> tweets = new List<Tweet>();
            foreach (Status status in statuses)
            {
                tweets.Add(new Tweet()
                {
                    Name = status.User.Name,
                    ScreenName = status.User.ScreenNameResponse,
                    TimeSinceNow = status.CreatedAt.GetTimeSinceNow(),
                    Text = getFormattedText(status.Text, status.Entities),
                    PostedOn = status.CreatedAt,
                    StatusId = status.StatusID
                });
            }

            return tweets.OrderByDescending(t => t.PostedOn).ToList();
        }

        private static string getFormattedText(string tweetText, Entities entities)
        {
            StringBuilder tweetTextBuilder = null;

            tweetTextBuilder = new StringBuilder(tweetText);
            if (entities != null && entities.HashTagEntities != null && entities.HashTagEntities.Count > 0)
            {
                foreach (HashTagEntity hashTag in entities.HashTagEntities)
                {
                    string tagHandle = hashTag.Tag.Contains("#") ? hashTag.Tag : string.Format("#{0}", hashTag.Tag);
                    tweetTextBuilder.Replace(tagHandle, ConfigProvider.HashTagTemplate.Replace("{tag}", tagHandle));
                }
            }

            //if (entities != null && entities.MediaEntities != null && entities.MediaEntities.Count > 0)
            //{
            //    foreach (MediaEntity media in entities.MediaEntities)
            //    {
            //        string mediaUrl = getEntityByPosition(tweetText, media.Start, media.End);
            //        tweetTextBuilder.Replace(mediaUrl, imgTagTemplate.Replace("{mediaUrl}", media.MediaUrl));
            //    }
            //}

            //if (entities != null && entities.SymbolEntities != null && entities.SymbolEntities.Count > 0)
            //{
            //    foreach (SymbolEntity symbol in entities.SymbolEntities)
            //    {
            //        //string mediaUrl = getEntityByPosition(tweetText, symbol.Start, symbol.End);
            //        //tweetTextBuilder.Replace(mediaUrl, imgTagTemplate.Replace("{mediaUrl}", symbol.Text));
            //    }
            //}


            urlToAnchors.Replace(tweetText, new MatchEvaluator((s) =>
            {
                string urlMatch = s.Groups[0].Value.Replace("…", "");
                List<string> fragments = urlMatch.Split('/').Where(f => !string.IsNullOrEmpty(f)).ToList();
                bool isValidShortUrl = fragments[fragments.Count() - 1].Length == 11 - 1;

                UrlEntity urlEntity = entities.UrlEntities.Where(u => u.Url.Contains(urlMatch)).FirstOrDefault();
                if (urlEntity != null)
                    tweetTextBuilder.Replace(urlMatch, ConfigProvider.UrlTemplate.Replace("{url}", urlEntity.ExpandedUrl).Replace("{displayUrl}", urlEntity.DisplayUrl));
                else if (isValidShortUrl)
                    tweetTextBuilder.Replace(urlMatch, ConfigProvider.UrlTemplate.Replace("{url}", urlMatch).Replace("{displayUrl}", string.Join("/", fragments.Skip(1))));
                return "";
            }));

            if (entities != null && entities.UserMentionEntities != null && entities.UserMentionEntities.Count > 0)
            {
                foreach (UserMentionEntity userEntity in entities.UserMentionEntities)
                {
                    string userMention = getEntityByPosition(tweetText, userEntity.Start, userEntity.End);
                    tweetTextBuilder.Replace(userMention, ConfigProvider.UserMentionTemplate.Replace("{screenName}", userEntity.ScreenName));
                }
            }

            return tweetTextBuilder.ToString();
        }

        private static string FixUrl(string url)
        {
            List<string> fragments = url.Split('/').ToList();
            string fixedUrl = string.Join(",", fragments.Skip(1).Take(1));

            return string.Format("{0}/{1}", fixedUrl, string.Join("/", fragments.Skip(2).TakeWhile((s, i) =>
            {
                return string.Join("/", fragments.Skip(2).Take(i - 1)).Length >= 15;
            }))).Take(20).ToString();
        }

        private static string getEntityByPosition(string tweetText, int start, int end, bool applyFix = false)
        {
            return string.Join("", tweetText.Skip(start + (applyFix ? 1 : 0)).Take(end - start));
        }
    }
}
