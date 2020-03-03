using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
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
        public string SaveSalesForceTenderData(TenderTransferRootObject jsonDataPacket)
        {
            Guid saveSuccessful = _integrationLib.SaveSalesForceTenderData(jsonDataPacket);

            return saveSuccessful != Guid.Empty ? saveSuccessful.ToString() : "Tender Data Stage Failed"; ;
        }

    }
}