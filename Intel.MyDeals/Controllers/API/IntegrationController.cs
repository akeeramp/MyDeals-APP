using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Integration")]
    [AllowAnonymous]
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
        [AllowAnonymous]
        public string SaveSalesForceTenderData(TenderTransferRootObject jsonDataPacket)
        {
            // User and Password validate here.......
            // 1. With authorise attribute
            Guid saveSuccessful = _integrationLib.SaveSalesForceTenderData(jsonDataPacket);

            return saveSuccessful != Guid.Empty ? saveSuccessful.ToString() : "Tender Data Stage Failed"; ;
        }

        //[Route("ExecuteSalesForceTenderData")]
        //Can't be here since it relies on Contract Controller parts to execute the saves

        [HttpPost]
        [Route("SaveVistexResponseData")]
        public bool SaveVistexResponseData(VistexResponseMsg jsonDataPacket)
        {
            Boolean saveSuccessful = _integrationLib.SaveVistexResponseData(jsonDataPacket);

            return saveSuccessful;
        }


    }
}