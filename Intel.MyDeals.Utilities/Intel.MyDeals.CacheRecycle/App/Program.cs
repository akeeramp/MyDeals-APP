using Intel.MyDeals.CacheRecycle.App;
using System;
using System.Threading.Tasks;

namespace Intel.MyDeals.CacheRecycle
{
    public class Program
    {
        private static string NODE = AppHelper.GetAppSetting("NODE");

        public static void Main(string[] args)
        {
            // START THE PROCESSING
            Console.WriteLine(Environment.NewLine + "Starting the APP..");
            DoAction().Wait();
        }

        private static async Task DoAction()
        {
            AppHelper.Log("Fetching the RECYCLE_CACHE_COUNT_NODE constant value for NODE - " + NODE);
            Console.WriteLine(Environment.NewLine + "Fetching the RECYCLE_CACHE_COUNT_NODE constant value for NODE - " + NODE);
            AdminConstant constant = await DataAccessLayer.GetConstantsByNameNonCached("RECYCLE_CACHE_COUNT_NODE" + NODE);

            if (constant.CNST_VAL_TXT == "0")
            {
                AppHelper.Log("RECYCLE_CACHE_COUNT_NODE value is 0 for NODE - " + NODE + ", EXITING...");
                Console.WriteLine(Environment.NewLine + "RECYCLE_CACHE_COUNT_NODE value is 0 for NODE - " + NODE + ", EXITING...");
                return;
            }
            else
            {
                AppHelper.Log("Recyling the App Pool for NODE - " + NODE);
                Console.WriteLine(Environment.NewLine + "Recyling the App Pool for NODE - " + NODE);
                await RecycleAppPool();

                AppHelper.Log("Entering sleep mode...");
                Console.WriteLine(Environment.NewLine + "Entering sleep mode...");
                System.Threading.Thread.Sleep(3600);

                Console.WriteLine(Environment.NewLine + "Reloading the cache for NODE - " + NODE);
                AppHelper.Log("Reloading the cache for NODE - " + NODE);
                await ReloadCache();

                Console.WriteLine(Environment.NewLine + "Updating the " + "RECYCLE_CACHE_COUNT_NODE" + NODE + " constant value");
                AppHelper.Log("Updating the " + "RECYCLE_CACHE_COUNT_NODE" + NODE + " constant value");
                await UpdateRecycleCacheConstant(constant.CNST_NM, "0");
            }
        }

        /// <summary>
        /// Recycles the App Pool
        /// </summary>
        /// <returns></returns>
        protected static async Task RecycleAppPool()
        {
            await DataAccessLayer.RecycleAppPool();
        }

        /// <summary>
        /// Reloads the cache
        /// </summary>
        /// <returns></returns>
        protected static async Task ReloadCache()
        {
            await DataAccessLayer.ReloadCache();
        }


        /// <summary>
        /// Updates the Recycle_Cache_Count const value
        /// </summary>
        /// <param name="cnstName">The Recycle_Cache_Count constant name</param>
        /// <param name="constVal">The Recycle_Cache_Count constant value</param>
        /// <returns></returns>
        protected static async Task UpdateRecycleCacheConstant(string cnstName, string constVal)
        {
            await DataAccessLayer.UpdateRecycleCacheConstant(cnstName, constVal);
        }

    }
}
