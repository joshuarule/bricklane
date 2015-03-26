using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BLR.Configuration
{
    public static class ConfigProvider
    {
        public static string HashTagTemplate = string.Empty;
        public static string UserMentionTemplate = string.Empty;
        public static string UrlTemplate = string.Empty;
        public static string TwitterConsumerKey = string.Empty;
        public static string TwitterConsumerSecret = string.Empty;
        public static string TwitterOwnerScreenName = string.Empty;
        public static int NumberOfMaxTweetsAtFirst = 10;
        public static int CacheSize = 200;
        public static int CacheExpiration = 10;

        static ConfigProvider()
        {
            HashTagTemplate = ReadTemplateFromFile("HashTagTemplate.html");
            UserMentionTemplate = ReadTemplateFromFile("UserMentionTemplate.html");
            UrlTemplate = ReadTemplateFromFile("UrlTemplate.html");
            TwitterConsumerKey = getConfigValue<string>("TwitterConsumerKey");
            TwitterConsumerSecret = getConfigValue<string>("TwitterConsumerSecret");
            TwitterOwnerScreenName = getConfigValue<string>("TwitterOwnerScreenName");
            NumberOfMaxTweetsAtFirst = getConfigValue<int>("NumberOfMaxTweetsAtFirst");
            CacheSize = getConfigValue<int>("CacheSize");
            CacheExpiration = getConfigValue<int>("CacheExpiration");
        }

        private static string ReadTemplateFromFile(string templateName)
        {
            return File.ReadAllText(Path.Combine(HttpContext.Current.Request.PhysicalApplicationPath, "TwitterTemplates", templateName));
        }

        private static T getConfigValue<T>(string key)
        {
            if (ConfigurationManager.AppSettings.AllKeys.Contains(key))
            {
                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings[key]))
                {
                    return (T)Convert.ChangeType(ConfigurationManager.AppSettings[key], typeof(T));
                }
                else
                {
                    throw new Exception(string.Format("{0} key missing!", key));
                }
            }
            else
            {
                throw new Exception(string.Format("{0} key missing!", key));
            }
        }
    }
}
