using System;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
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
        public VistexDFDataResponseObject GetVistexDealOutBoundData() //VTX_OBJ: Deals (Not Used)
        {
            string packetType = "VISTEX_DEALS";
            string runMode = "D";
            return _vistexServiceLib.GetVistexDealOutBoundData(packetType, runMode);
        }

        [Route("GetVistexDealOutBoundData/{packetType}/{runMode}")] //VTX_OBJ: DEALS
        [HttpGet]
        public VistexDFDataResponseObject GetVistexDealOutBoundData(string packetType, string runMode)
        {
            return _vistexServiceLib.GetVistexDealOutBoundData(packetType, runMode);
        }

        [Route("GetVistexDataOutBound/{packetType}")] //VTX_OBJ: VERTICALS
        [HttpGet]
        public VistexDFDataResponseObject GetVistexDataOutBound(string packetType)
        {
            return _vistexServiceLib.GetVistexDataOutBound(packetType);
        }
        
        [Route("GetVistexDFStageData/{runMode}")]
        [HttpGet]
        public VistexDFDataResponseObject GetVistexDFStageData(string runMode) //VTX_OBJ: CUSTOMERS, PRODUCTS
        {
            return _vistexServiceLib.GetVistexStageData(runMode);
        }

        [HttpPost]
        [Route("SaveVistexResponseData")]
        public bool SaveVistexResponseData(VistexResponseMsg jsonDataPacket) //VTX_OBJ: DEALS_RESPONSE
        {
            Boolean saveSuccessful = _vistexServiceLib.SaveVistexResponseData(jsonDataPacket);

            return saveSuccessful;
        }

        [Route("GetMaxGroupId")]
        public string GetMaxGroupId()
        {
            return _vistexServiceLib.GetMaxGroupId();
        }

    }
}