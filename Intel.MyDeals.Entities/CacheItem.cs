namespace Intel.MyDeals.Entities
{
    public class CacheItem
    {
        public string CacheName { set; get; }
        public int CacheCount { set; get; }

        /// <summary>
        /// Gets or Sets Cache Key value
        /// Used to store api cache keys
        /// </summary>
        public string CacheKey { get; set; }
    }
}