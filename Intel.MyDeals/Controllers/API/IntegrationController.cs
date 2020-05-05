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
    public class IntegrationController : ApiController
    {
        private readonly IIntegrationLib _integrationLib;

        public IntegrationController(IIntegrationLib integrationLib)
        {
            _integrationLib = integrationLib;
        }

        /// <summary>
        /// Checks if the previous run is completed
        /// </summary>
        /// <param name="jobType">The job type</param>

        [HttpPost]
        [Route("SaveSalesForceTenderData")]
        public string SaveSalesForceTenderData(JObject jsonDataPacket)
        {
            Guid saveSuccessful;
            try
            {
                var jsonData = JsonConvert.DeserializeObject<TenderTransferRootObject>(jsonDataPacket.ToString());
                OpLogPerf.Log(jsonDataPacket.ToString(), LogCategory.Information);
               //TenderTransferRootObject jsonDataPacket
               // User and Password validate here.......
               // 1. With authorise attribute
               saveSuccessful = _integrationLib.SaveSalesForceTenderData(jsonData);
            }
            catch(Exception ex)
            {
                OpLogPerf.Log($"Tenders JSON payload: {jsonDataPacket.ToString()} | Message: {ex.Message}| Innerexception: {ex.InnerException}" +
                    $" | Stack Trace{ex.StackTrace}", LogCategory.Error);
                throw ex;
            }
            return saveSuccessful != Guid.Empty ? saveSuccessful.ToString() : "Tender Data Stage Failed"; 
        }

        //[Route("ExecuteSalesForceTenderData")]
        //Can't be here since it relies on Contract Controller parts to execute the saves

        //[HttpPost]
        //[Route("SaveVistexResponseData")]
        //public bool SaveVistexResponseData(VistexResponseMsg jsonDataPacket)
        //{
        //    Boolean saveSuccessful = _integrationLib.SaveVistexResponseData(jsonDataPacket);

        //    return saveSuccessful;
        //}


    }
}