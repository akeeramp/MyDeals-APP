using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
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
        public VistexDFDataResponseObject GetVistexDealOutBoundData() //TC-Deals Not Used
        {
            string packetType = "VISTEX_DEALS";
            string runMode = "D";
            return _vistexServiceLib.GetVistexDealOutBoundData(packetType, runMode);
        }

        [Route("GetVistexDealOutBoundData/{packetType}/{runMode}")] //TC-DEALS
        [HttpGet]
        public VistexDFDataResponseObject GetVistexDealOutBoundData(string packetType, string runMode)
        {
            return _vistexServiceLib.GetVistexDealOutBoundData(packetType, runMode);
        }

        [Route("GetVistexDataOutBound/{packetType}")]
        [HttpGet]
        public VistexDFDataResponseObject GetVistexDataOutBound(string packetType)
        {
            return _vistexServiceLib.GetVistexDataOutBound(packetType);
        }

        [Route("SetVistexDealOutBoundStage/{btchId}/{rqstStatus}")]
        [HttpGet]
        public void SetVistexDealOutBoundStage(string btchId, string rqstStatus)
        {
            _vistexServiceLib.SetVistexDealOutBoundStage(new Guid(btchId), rqstStatus);
        }

        [Route("GetVistexDFStageData/{runMode}")]
        [HttpGet]
        public VistexDFDataResponseObject GetVistexDFStageData(string runMode) //TC-CUSTOMERS, PRODUCTS
        {
            return _vistexServiceLib.GetVistexStageData(runMode);
        }

        [Route("UpdateVistexDFStageData")]
        [HttpPost]
        public void UpdateVistexDFStageData(VistexDFDataResponseObject responseObj)
        {
            _vistexServiceLib.UpdateVistexDFStageData(responseObj);
        }

        [Route("PublishDealsToSapPo")]
        [HttpGet]
        public Dictionary<string, string> PublishDealsToSapPo()
        {
            string url = @"https://sappodev.intel.com:8215/RESTAdapter/MyDeals";
            string jsonData = "{" +
                              "\"Customer\": {" +
                              "\"GDM_SLD_TO_ID\": \"23234\"," +
                              "\"SLS_ORG_CD\": \"234\"," +
                              "\"DSTRB_CHNL_CD\": \"34\"," +
                              "\"REBATE_SOLD_TO_CUSTOMER\": \"34\"," +
                              "\"REBATE_CUSTOMER_DIVISION\": \"\"," +
                              "\"GDM_HOSTED_GEO_NM\": \"\"," +
                              "\"NGRP_REV_CUST_NM\": \"\"," +
                              "\"NGRP_REV_SUBCUST_NM\": \"\"" +
                              "}" +
                              "}";
            return _vistexServiceLib.PublishSapPo(url, jsonData);
        }

        [Route("PublishCustomerToSapPo")]
        [HttpGet]
        public Dictionary<string, string> PublishCustomerToSapPo()
        {
            string url = @"http://sappodev.intel.com:8415/RESTAdapter/VistexCustomer";
            string jsonData = "{" +
                              "\"Customer\": {" +
                              "\"GDM_SLD_TO_ID\": \"23234\"," +
                              "\"SLS_ORG_CD\": \"234\"," +
                              "\"DSTRB_CHNL_CD\": \"34\"," +
                              "\"REBATE_SOLD_TO_CUSTOMER\": \"34\"," +
                              "\"REBATE_CUSTOMER_DIVISION\": \"\"," +
                              "\"GDM_HOSTED_GEO_NM\": \"\"," +
                              "\"NGRP_REV_CUST_NM\": \"\"," +
                              "\"NGRP_REV_SUBCUST_NM\": \"\"" +
                              "}" +
                              "}";
            return _vistexServiceLib.PublishSapPo(url, jsonData);
        }

        [Route("PublishProductToSapPo")]
        [HttpGet]
        public Dictionary<string, string> PublishProductToSapPo()
        {
            string url = @"http://sappodev.intel.com:8415/RESTAdapter/ProductMain";
            string jsonData = "{" +
                              "\"Products\": {" +
                              "\"MTRL_ID\": \"000000000500020337\"," +
                              "\"VALID_FROM\": \"20200202\"," +
                              "\"VALID_TO\": \"99991231\"," +
                              "\"GDM_PRD_TYPE_NM\": \"testing interface9\"," +
                              "\"GDM_VRT_NM\": \"testing interface9\"," +
                              "\"GDM_BRND_NM\": \"testing interface9\"," +
                              "\"GDM_FMLY_NM\": \"testing interface9\"," +
                              "\"CPU_PROCESSOR_NUMBER\": \"testing interface9\"," +
                              "\"FRCST_ALTR_ID\": \"testing interface9\"," +
                              "\"KIT_NM\": \"testing interface9\"," +
                              "\"OPR_BUSNS_UN_CD\": \"testing interface9\"," +
                              "\"DIV_SHRT_NM\": \"testing interface9\"," +
                              "\"CPU_MM_MEDIA\": \"testing interface9\"," +
                              "\"NAND_FAMILY\": \"testing interface9\"," +
                              "\"NAND_DENSITY\": \"testing interface9\"," +
                              "\"NAND_FORM_FACTOR\": \"testing interface9\"" +
                              "}" +
                              "}";
            return _vistexServiceLib.PublishSapPo(url, jsonData);
        }

        [Route("PublishProductVerticalToSapPo")]
        [HttpGet]
        public Dictionary<string, string> PublishProductVerticalToSapPo()
        {
            string url = @"https://sappodev.intel.com:8215/RESTAdapter/ProductVertical";
            string jsonData = "{" +
                              "\"ProductVertical\": [" +
                              "{" +
                              "\"GDM_PRD_TYPE_NM\": \"Product1\"," +
                              "\"GDM_VRT_NM\": \"54556\"," +
                              "\"OPR_BUSNS_UN_CD\": \"5556\"," +
                              "\"VALID_TO\": \"20200304\"," +
                              "\"DIV_SHRT_NM\": \"5556\"," +
                              "\"DEAL_PRD_TYPE_NM\": \"859\"," +
                              "\"DEAL_VRT_NM\": \"88\"," +
                              "\"ACTIVE_IND\": \"1\"" +
                              "}," +
                              "{" +
                              "\"GDM_PRD_TYPE_NM\": \"Product3\"," +
                              "\"GDM_VRT_NM\": \"54556\"," +
                              "\"OPR_BUSNS_UN_CD\": \"5556\"," +
                              "\"VALID_TO\": \"20200304\"," +
                              "\"DIV_SHRT_NM\": \"5556\"," +
                              "\"DEAL_PRD_TYPE_NM\": \"859\"," +
                              "\"DEAL_VRT_NM\": \"88\"," +
                              "\"ACTIVE_IND\": \"0\"" +
                              "}" +
                              "]" +
                              "}";
            return _vistexServiceLib.PublishSapPo(url, jsonData);
        }

        // Testing Items

        [Route("GetMaxGroupId")]
        public string GetMaxGroupId()
        {
            return _vistexServiceLib.GetMaxGroupId();
        }

    }
}