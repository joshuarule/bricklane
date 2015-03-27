using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Caching;

namespace BLR.Caching
{
    public class CachingHelper<T> where T : class
    {
        private Cache Cache
        {
            get
            {
                return HttpContext.Current.Cache;
            }
        }

        public T GetValue(string key)
        {
            return Cache.Get(key) as T;
        }

        public void Add(string key, T value, DateTime absoluteExpirationTime)
        {
            Cache.Insert(key, value, null, absoluteExpirationTime, Cache.NoSlidingExpiration);
        }
    }
}
