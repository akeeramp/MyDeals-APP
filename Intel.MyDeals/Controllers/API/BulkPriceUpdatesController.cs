using System;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/BulkPriceUpdate")]
    public class BulkPriceUpdatesController : BaseApiController
    {
        private readonly IBulkPriceUpdateLib _bulkPriceUpdateLib;

        public BulkPriceUpdatesController(IBulkPriceUpdateLib bulkPriceUpdateLib)
        {
            _bulkPriceUpdateLib = bulkPriceUpdateLib;
        }

        [Route("UpdatePriceRecord")]
        [HttpPost]
        [AntiForgeryValidate]
        public BulkPriceUpdateRecordsList UpdatePriceRecord(JObject jsonData)
        {
            BulkPriceUpdateRecordsList myPriceUpdateList;
            try
            {
                myPriceUpdateList = JsonConvert.DeserializeObject<BulkPriceUpdateRecordsList>(jsonData.ToString());
                return SafeExecutor(() => _bulkPriceUpdateLib.TestMyGuid(myPriceUpdateList));
            }
            catch (Exception ex)
            {
                OpLogPerf.Log($"BulkPriceUpdates JSON payload: {jsonData} | Message: {ex.Message}| Inner Exception: {ex.InnerException}" +
                    $" | Stack Trace{ex.StackTrace}", LogCategory.Error);
                throw ex;
            }
        }

    }
}