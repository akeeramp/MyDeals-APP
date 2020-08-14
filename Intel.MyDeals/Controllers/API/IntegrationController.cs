using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Integration")]
    public class IntegrationController : BaseApiController
    {
        private readonly IIntegrationLib _integrationLib;

        public IntegrationController(IIntegrationLib integrationLib)
        {
            _integrationLib = integrationLib;
        }

        /// <summary>
        /// Checks if the previous run is completed
        /// </summary>
        /// <param name="jsonDataPacket">JSON data to pass</param>

        [HttpPost]
        [Route("SaveSalesForceTenderData")]
        public TenderTransferRootObject SaveSalesForceTenderData(JObject jsonDataPacket)
        {
            Guid saveSuccessful;
            TenderTransferRootObject jsonData;
            try
            {
                jsonData = JsonConvert.DeserializeObject<TenderTransferRootObject>(jsonDataPacket.ToString());
                OpLogPerf.Log(jsonDataPacket.ToString(), LogCategory.Information);
               // TenderTransferRootObject jsonDataPacket
               // User and Password validate here.......
               // 1. With authorize attribute
               saveSuccessful = _integrationLib.SaveSalesForceTenderData(jsonData);
            }
            catch(Exception ex)
            {
                OpLogPerf.Log($"Tenders JSON payload: {jsonDataPacket} | Message: {ex.Message}| Inner Exception: {ex.InnerException}" +
                    $" | Stack Trace{ex.StackTrace}", LogCategory.Error);
                throw ex;
            }

            if(saveSuccessful != Guid.Empty)
            {
                jsonData.header.source_system = "MyDeals";
                jsonData.header.target_system = "Tenders";
                jsonData.header.action = jsonData.header.action + "Response";
            }
            //return saveSuccessful != Guid.Empty ? JsonConvert.SerializeObject(jsonData) : "Tender Data Stage Failed";
            return saveSuccessful != Guid.Empty ? jsonData : null;
        }


        #region TENDERS INTEGRATION ITEMS IN CONTRACTS CONTROLLER

        [Authorize]
        [Route("ExecuteSalesForceTenderData")]
        [HttpGet]
        public string ExecuteSalesForceTenderData()
        {
            // Path to catch all unprocessed items
            Guid workId = Guid.Empty;
            return SafeExecutor(() => _integrationLib.ExecuteSalesForceTenderData(workId)
                , "Unable to process Salesforce Tender deals"
            );
        }

        [Authorize]
        [Route("ExecuteSalesForceTenderData/{workId}/")]
        [HttpGet]
        public string ExecuteSalesForceTenderData(Guid workId)
        {
            // Path to kick off any ad-hoc needed runs via admin page
            return SafeExecutor(() => _integrationLib.ExecuteSalesForceTenderData(workId)
                , "Unable to process Salesforce Tender deals"
            );
        }

        [Authorize]
        [Route("ReturnSalesForceTenderResults")]
        [HttpGet]
        public string ReturnSalesForceTenderResults()
        {
            // Path to catch all unprocessed items
            return SafeExecutor(() => _integrationLib.ReturnSalesForceTenderResults()
                , "Unable to process Salesforce Tender Return results"
            );
        }

        #endregion

    }
}