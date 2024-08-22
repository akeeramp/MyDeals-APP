using System;
using System.Web;
using System.Linq;
using System.Web.Http;
using System.Collections.Generic;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.MyDeals.BusinessLogic;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/MuleService")]
    public class MuleServiceController : ApiController
    {
        private readonly IMuleServiceLib _muleServiceLib;

        public MuleServiceController(IMuleServiceLib muleServiceLib)
        {
            _muleServiceLib = muleServiceLib;
        }

        [Route("PushDealsToVistexViaMule/{packetType}/{runMode}")]
        [HttpGet]
        public VistexDFDataResponseObject PushDealsToVistexViaMule(string packetType, string runMode)
        {
            VistexDFDataResponseObject responseObject = new VistexDFDataResponseObject();
            responseObject.MessageLog = new List<string>();
            try
            {
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Controller - GetVistexDealOutBoundData - Called") + Environment.NewLine);
                responseObject = _muleServiceLib.GetVistexDealOutBoundData(packetType, runMode, responseObject);
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Controller - GetVistexDealOutBoundData - Success") + Environment.NewLine);
            }
            catch (Exception ex)
            {
                responseObject.BatchMessage = "Exception: " + ex.Message + "\n" + "Innerexception: " + ex.InnerException;
                responseObject.BatchStatus = "Exception";
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
                OpLogPerf.Log($"Thrown from: MuleServiceController - DEALS - Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
            }

            return responseObject;
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
                responseObject = _muleServiceLib.GetVistexStageData(runMode, responseObject);
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
                saveSuccessful = _muleServiceLib.SaveVistexResponseData(vistextResponseMessage);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log($"Vistex JSON payload: {jsonDataPacket.ToString()} | Message: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
                throw ex;
            }
            return saveSuccessful;
        }
    }
}