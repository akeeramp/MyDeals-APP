using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Intel.MyDeals.CacheRecycle.App
{
    public class DataAccessLayer
    {
        private static string APIbaseUrl = AppHelper.GetAppSetting("MyDealsService");
        private static string adminConstantsController = "api/AdminConstants/v1/";
        private static string devTestsController = "api/DevTests/";
        private static string cacheController = "api/Cache/v1/";

        /// <summary>
        /// Get HttpClient
        /// </summary>
        private static HttpClient MyDealsClient
        {
            get
            {
                HttpClientHandler handler = new HttpClientHandler();
                handler.UseDefaultCredentials = true;
                HttpClient client = new HttpClient(handler);
                client.BaseAddress = new Uri(APIbaseUrl);
                client.Timeout = TimeSpan.FromMinutes(6);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                return client;
            }
        }

        public static async Task<AdminConstant> GetConstantsByNameNonCached(string cnstName)
        {
            try
            {
                AdminConstant constant = null;
                var getConstantsByNameUrl = adminConstantsController + "GetConstantsByNameNonCached" + "/" + cnstName;
                HttpResponseMessage response = await MyDealsClient.GetAsync(getConstantsByNameUrl);
                if (response.IsSuccessStatusCode)
                {
                    constant = await response.Content.ReadAsAsync<AdminConstant>();
                }
                else
                {
                    AppHelper.HandleException(new Exception("GetConstantsByName - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }

                return constant;
            }
            catch (Exception ex)
            {
                AppHelper.HandleException(ex);
            }

            return new AdminConstant();
        }

        /// <summary>
        /// Recycles the App Pool
        /// </summary>
        /// <returns></returns>
        public static async Task RecycleAppPool()
        {
            try
            {
                var recycleAppPoolUrl = devTestsController + "RecycleAppPool";
                HttpResponseMessage response = await MyDealsClient.GetAsync(recycleAppPoolUrl);
                if (!response.IsSuccessStatusCode)
                {
                    AppHelper.HandleException(new Exception("RecycleAppPool - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
            }
            catch (Exception ex)
            {
                AppHelper.HandleException(ex);
            }
        }

        /// <summary>
        /// Reloads the cache
        /// </summary>
        /// <returns></returns>
        public static async Task ReloadCache()
        {
            try
            {
                var reloadCacheUrl = cacheController + "GetCacheReload";
                HttpResponseMessage response = await MyDealsClient.GetAsync(reloadCacheUrl);
                if (!response.IsSuccessStatusCode)
                {
                    AppHelper.HandleException(new Exception("ReloadCache - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
            }
            catch (Exception ex)
            {
                AppHelper.HandleException(ex);
            }
        }


        /// <summary>
        /// Update the Recycle_Cache_Count const value
        /// </summary>
        /// <param name="cnstName">The Recycle_Cache_Count constant</param>
        /// <param name="constVal">The Recycle_Cache_Count constant value</param>
        /// <returns></returns>
        public static async Task UpdateRecycleCacheConstant(string cnstName, string constVal)
        {
            try
            {
                var updateRecycleCacheConstantsUrl = adminConstantsController + "UpdateRecycleCacheConstants" + "/" + cnstName + "/" + constVal;
                HttpResponseMessage response = await MyDealsClient.GetAsync(updateRecycleCacheConstantsUrl);
                if (!response.IsSuccessStatusCode)
                {
                    AppHelper.HandleException(new Exception("UpdateRecycleCacheConstant - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
            }
            catch (Exception ex)
            {
                AppHelper.HandleException(ex);
            }
        }


    }
}
