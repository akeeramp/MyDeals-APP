using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.DataLibrary;
using Newtonsoft.Json;
using Intel.Opaque;

namespace Intel.MyDeals.BusinessLogic
{
    internal class MuleServiceLib : IMuleServiceLib
    {
        private readonly IMuleServiceDataLib _muleServiceDataLib;

        public MuleServiceLib(IMuleServiceDataLib muleServiceDataLib)
        {
            _muleServiceDataLib = muleServiceDataLib;
        }

        public VistexDFDataResponseObject GetVistexDealOutBoundData(string packetType, string runMode, VistexDFDataResponseObject responseObj) //VTX_OBJ: DEALS
        {
            List<VistexQueueObject> dataRecords = new List<VistexQueueObject>();
            try
            {
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: Initiated ") + Environment.NewLine);
                dataRecords = _muleServiceDataLib.GetVistexDealOutBoundData(packetType, runMode);
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: Getting Pending Records  - Success ") + Environment.NewLine);

                // Construct the send JSON from the list of bodies we got
                if (dataRecords.Count > 0)
                {
                    string jsonData = "";
                    for (int indx = 0; indx < 1; indx++)
                    {
                        jsonData = jsonData + "," + dataRecords[indx].RqstJsonData;
                    }
                    jsonData = jsonData.Remove(0, 1);

                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: sendDealdataToSapPo - Initiated ") + Environment.NewLine);
                    responseObj = sendDealdataToSapPo(jsonData, responseObj, dataRecords, runMode);
                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: sendDealdataToSapPo - Success ") + Environment.NewLine);


                }
                else
                {
                    responseObj.BatchName = "VISTEX_DEALS";
                    responseObj.BatchId = "0";
                    responseObj.BatchMessage = "No data to be Uploaded";
                    responseObj.BatchStatus = "PROCESSED";
                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: - No Deal Found - Success ") + Environment.NewLine);

                }
            }

            catch (Exception ex)
            {
                responseObj.BatchName =  "DEALS";
                responseObj.BatchId = "-1";
                responseObj.BatchMessage = "Exception: " + ex.Message + "\n" + "Innerexception: " + ex.InnerException;
                responseObj.BatchStatus = "Exception";
                responseObj.MessageLog.Add("Business Layer - GetVistexStageData: Exception Details -- " + String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
                OpLogPerf.Log($"Thrown from: VistexServiceLib - Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
            }

            return responseObj;
        }

        public VistexDFDataResponseObject sendDealdataToSapPo(string jsonData, VistexDFDataResponseObject responseObj, List<VistexQueueObject> dataRecords, string runMode)
        {
            try
            {
                Guid BatchId = dataRecords[0].BatchId;
                string header = "";
                string footer = "";

                //Header Construct
                header = "{\"BatchId\":\"" + BatchId.ToString() + "\"," + "\"Action\":\"Create\",\"SourceSystem\":\"MyDeals\",\"AgreementDetails\":[";
                //Footer item
                footer = "]}";

                var finalJSON = header + jsonData + footer;
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: ConnectSAPPOandResponse - Initiated ") + Environment.NewLine);
                responseObj = ConnectSAPPOandResponse(finalJSON, runMode, BatchId.ToString(), responseObj);
            }

            catch (Exception ex)
            {
                responseObj.MessageLog.Add("Business Layer - sendDealdataToSapPo: Exception Details -- " + String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
                OpLogPerf.Log($"Thrown from: VistexServiceLib - DEALS - Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
            }

            return responseObj;
        }

        public VistexDFDataResponseObject ConnectSAPPOandResponse(string jsonData, string runMode, string BatchId, VistexDFDataResponseObject responseObj)
        {
            Dictionary<string, string> sendResponse = new Dictionary<string, string>();
            sendResponse = _muleServiceDataLib.PublishToVitexViaMule(jsonData, runMode, responseObj);

            if (sendResponse["Status"].ToLower() == "ok" || sendResponse["Status"].ToLower() == "accepted")
            {
                responseObj.RunMode = runMode;
                //Batch ID
                responseObj.BatchId = BatchId;
                //Parsing Response from SAP PO
                VistexDFResponse visResponse = JsonConvert.DeserializeObject<VistexDFResponse>(sendResponse["Data"]);
                //Assigning Message Body to be Tranferred 
                responseObj.BatchMessage = runMode == "D" ? "PO_Send_Complete" : string.Empty;
                //API Type                
                responseObj.BatchName = runMode == "D" ? "VISTEX_DEAL"  : "";
                //Status of the Call
                responseObj.BatchStatus = "PROCESSED";
            }
            else
            {
                responseObj.RunMode = runMode;
                responseObj.BatchId = BatchId;
                responseObj.BatchName =  "VISTEX_DEAL";
                responseObj.BatchMessage = sendResponse["Message"];
                responseObj.BatchStatus = "ERROR";

            }
            responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - ConnectSAPPOandResponse - Done"));

            return responseObj;
        }
    }
}
