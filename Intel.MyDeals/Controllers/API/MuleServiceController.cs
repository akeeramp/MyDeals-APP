using System;
using System.Web;
using System.Linq;
using System.Web.Http;
using System.Collections.Generic;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

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

        [Route("pushdelastovitexvisMule/{packetType}/{runMode}")]
        [HttpGet]
        public VistexDFDataResponseObject pushDelasToVitexViaMule(string packetType, string runMode)
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
    }
}