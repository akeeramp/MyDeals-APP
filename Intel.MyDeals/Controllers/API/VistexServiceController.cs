using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque.Tools;
using Intel.Opaque.Utilities.Server;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/VistexService")]
    public class VistexServiceController : ApiController
    {
        private readonly IVistexServiceLib _vistexServiceLib;

        public VistexServiceController(IVistexServiceLib vistexServiceLib)
        {
            _vistexServiceLib = vistexServiceLib;
        }

        [Route("GetVistexDealOutBoundData")]
        [HttpGet]
        public List<VistexDealOutBound> GetVistexDealOutBoundData()
        {
            string packetType = "VISTEX_DEALS";
            return _vistexServiceLib.GetVistexDealOutBoundData(packetType);
        }

        [Route("GetVistexDealOutBoundData/{packetType}")]
        public List<VistexDealOutBound> GetVistexDealOutBoundData(string packetType)
        {
            return _vistexServiceLib.GetVistexDealOutBoundData(packetType);
        }

        [Route("SetVistexDealOutBoundStage/{btchId}/{rqstStatus}")]
        [HttpGet]
        public void SetVistexDealOutBoundStage(string btchId, string rqstStatus)
        {
            _vistexServiceLib.SetVistexDealOutBoundStage(new Guid(btchId), rqstStatus);
        }

        [Route("PublishSapPo")]
        [HttpPost]
        public Dictionary<string, string> PublishSapPo()
        {
            string url = @"http://sappodev.intel.com:8415/RESTAdapter/VistexCustomer";
            string data;
            return _vistexServiceLib.PublishSapPo(url);
        }

        // Testing Items

        [Route("GetMaxGroupId")]
        public string GetMaxGroupId()
        {
            return _vistexServiceLib.GetMaxGroupId();
        }

    }
}