using System;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Web.Http;
using Intel.Opaque;
using Intel.MyDeals.Helpers;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Collections.Generic;

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
            return _vistexServiceLib.GetVistexDealOutBoundData(packetType, runMode, new VistexDFDataResponseObject());
        }

        [Route("GetVistexDealOutBoundData/{packetType}/{runMode}")] //VTX_OBJ: DEALS
        [HttpGet]
        public VistexDFDataResponseObject GetVistexDealOutBoundData(string packetType, string runMode)
        {
            VistexDFDataResponseObject responseObject = new VistexDFDataResponseObject();
            responseObject.MessageLog = new List<string>();
            try
            {
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Controller - GetVistexDealOutBoundData - Called") + Environment.NewLine);
                responseObject = _vistexServiceLib.GetVistexDealOutBoundData(packetType, runMode, responseObject);
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Controller - GetVistexDealOutBoundData - Success") + Environment.NewLine);
            }
            catch (Exception ex)
            {
                responseObject.BatchMessage = "Exception: " + ex.Message + "\n" + "Innerexception: " + ex.InnerException;
                responseObject.BatchStatus = "Exception";
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
                OpLogPerf.Log($"Thrown from: VistexServiceController - DEALS - Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
            }
            return responseObject;
        }

        [Route("GetVistexDataOutBound/{packetType}")] //VTX_OBJ: VERTICALS
        [HttpPost]
        public VistexDFDataResponseObject GetVistexDataOutBound(string packetType, VistexDFDataResponseObject responseObj)
        {
            return _vistexServiceLib.GetVistexDataOutBound(packetType, responseObj);
        }

        [Route("GetVistexDFStageData/{runMode}")]
        [HttpGet]
        public VistexDFDataResponseObject GetVistexDFStageData(string runMode) //VTX_OBJ: CUSTOMERS, PRODUCTS, VERTICAL
        {
            VistexDFDataResponseObject responseObject = new VistexDFDataResponseObject();
            responseObject.MessageLog = new List<string>();         
            try
            {
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Controller - GetVistexDFStageData - Called") + Environment.NewLine);
                responseObject = _vistexServiceLib.GetVistexStageData(runMode, responseObject);
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Controller - GetVistexDFStageData - Success") + Environment.NewLine);
            }
            catch (Exception ex)
            {
                responseObject.BatchMessage = "Exception: " + ex.Message + "\n" + "Innerexception: " + ex.InnerException;
                responseObject.BatchStatus = "Exception";
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine); 
                OpLogPerf.Log($"Thrown from: VistexServiceController - Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
            }            
            return responseObject;
        }

        [HttpPost]
        [Route("SaveVistexResponseData")]
        public bool SaveVistexResponseData(JObject jsonDataPacket) //VTX_OBJ: DEALS_RESPONSE
        {
            bool saveSuccessful = false;
            var vistextResponseMessage = JsonConvert.DeserializeObject<VistexResponseMsg>(jsonDataPacket.ToString());
            try
            {
                saveSuccessful = _vistexServiceLib.SaveVistexResponseData(vistextResponseMessage);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log($"Vistex JSON payload: {jsonDataPacket.ToString()} | Message: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
                throw ex;
            }
            return saveSuccessful;
        }

        [Route("PublishSapPo/{url}")]
        [HttpPost]
        public Dictionary<string, string> PublishSapPo(JObject jsonDatab, string url)
        {
            return _vistexServiceLib.PublishSapPo(url, jsonDatab.ToString());
        }

    }
}