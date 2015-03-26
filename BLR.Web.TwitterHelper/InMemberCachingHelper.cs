using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;

namespace BLR.Web.TwitterHelper
{
    public class InMemoryCachingHelper<T> where T : class
    {
        private static MemoryCache _memoryCache = MemoryCache.Default;

        public T GetValue(string key)
        {
            return _memoryCache.Get(key) as T;
        }

        public bool Contains(string key)
        {
            return _memoryCache.Contains(key);
        }

        public bool Add(string key, T value, DateTimeOffset absExpiration)
        {
            return _memoryCache.Add(key, value, absExpiration);
        }

        public void Delete(string key)
        {
            if (_memoryCache.Contains(key))
            {
                _memoryCache.Remove(key);
            }
        }
    }
}
