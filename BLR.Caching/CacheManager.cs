using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Caching;

namespace BLR.Caching
{
    public class CacheManager<TKey, T> where T : class
    {
        private static CacheManager<TKey, T> _instance;
        private static object _syncLock = new object();
        private static Cache _cache = HttpContext.Current.Cache;

        private Func<TKey, T> _cacheReloadMethod;
        private int _cacheTimeout;
        private List<TKey> _keys;
        private object _writeLock = new object();
        private bool _firstLoadComplete = false;

        private CacheManager(Func<TKey, T> cacheReloadMethod, int cacheTimeout)
        {
            _cacheReloadMethod = cacheReloadMethod;
            _cacheTimeout = cacheTimeout;
            _keys = new List<TKey>();
        }

        public void AddKey(TKey key)
        {
            if (!_keys.Contains(key))
                _keys.Add(key);
        }

        public void StartBuildingCache()
        {
            Task cachingTask = Task.Factory.StartNew(async (state) =>
            {
                DateTime expirationTime = DateTime.Now.AddMinutes(_cacheTimeout);
                lock (_writeLock)
                {
                    Cache cache = (Cache)state;
                    _keys.ForEach((key) =>
                    {
                        cache.Remove(Convert.ToString(key));
                        cache.Insert(Convert.ToString(key), _cacheReloadMethod.Invoke(key), null, expirationTime, Cache.NoSlidingExpiration);
                    });
                }

                _firstLoadComplete = true;

                await Task.Delay(expirationTime.Subtract(DateTime.Now.AddMinutes(2)));
                Debug.WriteLine(DateTime.Now.ToString("hh:mm:ss, Starting Over"));
                StartBuildingCache();
            }, _cache);
        }

        public T Get(TKey key)
        {
            if (_firstLoadComplete)
            {
                return (T)_cache.Get(Convert.ToString(key));
            }
            else
                lock (_writeLock)
                {
                    return (T)_cache.Get(Convert.ToString(key));
                }
        }

        public static CacheManager<TKey, T> GetInstance(Func<TKey, T> cacheReloadMethod, int cacheTimeout)
        {
            lock (_syncLock)
            {
                if (_instance == null)
                    _instance = new CacheManager<TKey, T>(cacheReloadMethod, cacheTimeout);

                return _instance;
            }
        }
    }
}
