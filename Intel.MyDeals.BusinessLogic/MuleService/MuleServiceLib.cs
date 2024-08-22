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
            responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: Initiated ") + Environment.NewLine);
            try
            {
                dataRecords = _muleServiceDataLib.GetVistexDealOutBoundData(packetType, runMode);
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: Getting Pending Records  - Success ") + Environment.NewLine);

                // Construct the send JSON from the list of bodies we got
                if (dataRecords.Count > 0)
                {
                    Guid BatchId = Guid.Empty;
                    string jsonData = "";
                    for (int indx = 0; indx < dataRecords.Count; indx++)
                    {
                        BatchId = dataRecords[indx].BatchId;
                        string AppendBatchid = dataRecords[indx].RqstJsonData.Remove(0, 1);
                        AppendBatchid = "{\"BatchId\":\"" + BatchId.ToString() + "\"," + AppendBatchid;
                        jsonData = jsonData + "," + AppendBatchid;
                    }
                    jsonData = jsonData.Remove(0, 1);

                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: sendDealdataToSapPo - Initiated ") + Environment.NewLine);
                    responseObj = sendDealdataToSapPo(jsonData, responseObj, dataRecords, runMode);
                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: sendDealdataToSapPo - Success ") + Environment.NewLine);

                    responseObj.BatchName = runMode == "M" ? "CNSMPTN_LD" : responseObj.BatchName;
                    jsonData = "";
                }
                else
                {
                    responseObj.BatchName = runMode == "M" ? "CNSMPTN_LD" : "VISTEX_DEALS";
                    responseObj.BatchId = "0";
                    responseObj.BatchMessage = "No data to be Uploaded";
                    responseObj.BatchStatus = "PROCESSED";
                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: - No Deal Found - Success ") + Environment.NewLine);
                }
            }
            catch (Exception ex)
            {
                responseObj.BatchName = runMode == "M" ? "CNSMPTN_LD" : "DEALS";
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
                if (runMode == "M")
                {
                    //Header Construct
                    header = "{\"VistexConsumptionParameters\":{\"SourceSystem\":\"MyDeals\",\"TargetSystem\":\"SAP\",\"Action\":\"POST\",\"BatchId\":\"" + BatchId.ToString() + "\",";
                    //Footer item
                    footer = "}}";
                }
                else
                {
                    //Header Construct
                    header = "{\"BatchId\":\"" + BatchId.ToString() + "\"," + "\"Action\":\"Create\",\"SourceSystem\":\"MyDeals\",\"AgreementDetails\":[";
                    //Footer item
                    footer = "]}";
                }
                //Constructing Complete JSON
                var finalJSON = header + jsonData + footer;
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: ConnectSAPPOandResponse - Initiated ") + Environment.NewLine);
                //Sending to SAP PO
                responseObj = ConnectSAPPOandResponse(finalJSON, runMode, BatchId.ToString(), responseObj);
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: ConnectSAPPOandResponse - Success ") + Environment.NewLine);

                //Update Status
                if (runMode == "M")
                {
                    SetVistexDealOutBoundStageV(BatchId, responseObj.BatchStatus == "PROCESSED" ? "PO_Processing_Complete" : "PO_Error_Rollback", responseObj.BatchMessage);
                }
                else
                {
                    SetVistexDealOutBoundStageD(BatchId, responseObj.BatchStatus == "PROCESSED" ? runMode == "M" ? "PO_Processing_Complete" : "PO_Send_Completed" : "PO_Error_Rollback", dataRecords);
                }
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - SetVistexDealOutBoundStage - Status Update Successful") + Environment.NewLine);
            }
            catch (Exception ex)
            {
                responseObj.MessageLog.Add("Business Layer - sendDealdataToSapPo: Exception Details -- " + String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
                OpLogPerf.Log($"Thrown from: VistexServiceLib - DEALS - Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
            }
            return responseObj;
        }

        public void SetVistexDealOutBoundStageV(Guid btchId, string rqstStatus, string BatchMessage) //VTX_OBJ: Customer, Product, Vertical
        {
            _muleServiceDataLib.SetVistexDealOutBoundStageV(btchId, rqstStatus, BatchMessage);
        }

        public void SetVistexDealOutBoundStageD(Guid btchId, string rqstStatus, List<VistexQueueObject> dataRecords) //VTX_OBJ: Deals
        {
            _muleServiceDataLib.SetVistexDealOutBoundStageD(btchId, rqstStatus, dataRecords);
        }

        public VistexDFDataResponseObject ConnectSAPPOandResponse(string jsonData, string runMode, string BatchId, VistexDFDataResponseObject responseObj)
        {
            try
            {
                Dictionary<string, string> sendResponse = new Dictionary<string, string>();
                sendResponse = _muleServiceDataLib.PublishToVistexViaMule(jsonData, runMode, responseObj);

                if (sendResponse["Status"].ToLower() == "ok" || sendResponse["Status"].ToLower() == "accepted")
                {
                    responseObj.RunMode = runMode;
                    //Batch ID
                    responseObj.BatchId = BatchId;
                    //Parsing Response from SAP PO
                    VistexDFResponse visResponse = JsonConvert.DeserializeObject<VistexDFResponse>(sendResponse["Data"]);
                    //Assigning Message Body to be Tranferred
                    responseObj.BatchMessage = runMode == "D" ? "PO_Send_Complete" : runMode == "V" ? visResponse.Status + ": " + visResponse.Message ?? string.Empty : visResponse.Message ?? string.Empty;
                    //API Type
                    responseObj.BatchName = runMode == "D" ? "VISTEX_DEAL" : runMode == "M" ? "CNSMPTN_LD" : runMode == "V" ? "PRODUCT_VERTICAL" : "" ;
                    //Status of the Call
                    responseObj.BatchStatus = "PROCESSED";
                }
                else
                {
                    responseObj.RunMode = runMode;
                    responseObj.BatchId = BatchId;
                    responseObj.BatchName = runMode == "M" ? "CNSMPTN_LD" : runMode == "V" ? "PRODUCT_VERTICAL" : "VISTEX_DEAL";
                    responseObj.BatchMessage = sendResponse["Message"];
                    responseObj.BatchStatus = "ERROR";
                }
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - ConnectSAPPOandResponse - Done"));
            }
            catch (Exception ex)
            {
                responseObj.RunMode = runMode;
                //Batch ID
                responseObj.BatchId = "-1";
                responseObj.BatchName = runMode == "M" ? "CNSMPTN_LD" : runMode == "V" ? "PRODUCT_VERTICAL" : "VISTEX_DEAL";
                responseObj.BatchMessage = "Exception: " + ex.Message + "\n" + "Innerexception: " + ex.InnerException;
                responseObj.BatchStatus = "Exception";
                responseObj.MessageLog.Add("Business Layer - ConnectSAPPOandResponse: Exception Deatils -- " + String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
            }
            return responseObj;
        }

        public VistexDFDataResponseObject GetVistexStageData(string runMode, VistexDFDataResponseObject responseObj) //VTX_OBJ: CUSTOMER, PRODUCTS, VERTICAL
        {
            responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexStageData: Initiated ") + Environment.NewLine);
            try
            {
                if (runMode == "V")
                {
                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexStageData: GetVistexDataOutBound - PROD_VERT_RULES: Initiated ") + Environment.NewLine);
                    responseObj = GetVistexDataOutBound("PROD_VERT_RULES", responseObj);
                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexStageData: GetVistexDataOutBound - PROD_VERT_RULES: Done ") + Environment.NewLine);
                }
            }
            catch (Exception ex)
            {
                responseObj.BatchName = "PRODUCT_VERTICAL";
                responseObj.BatchId = "-1";
                responseObj.BatchMessage = "Exception: " + ex.Message + "\n" + "Innerexception: " + ex.InnerException;
                responseObj.BatchStatus = "Exception";
                responseObj.MessageLog.Add("Business Layer - GetVistexStageData: Exception Details -- " + String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
                OpLogPerf.Log($"Thrown from: MuleServiceLib - Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
            }
            return responseObj;
        }

        public VistexDFDataResponseObject GetVistexDataOutBound(string packetType, VistexDFDataResponseObject responseObj) //VTX_OBJ: VERTICALS
        {
            List<VistexQueueObject> records = new List<VistexQueueObject>();
            //VistexDFDataResponseObject responseObj = new VistexDFDataResponseObject();
            records = _muleServiceDataLib.GetVistexDataOutBound(packetType);
            if (records.Count == 0)
            {
                responseObj.BatchName = "PRODUCT_VERTICAL";
                responseObj.BatchId = "0";
                responseObj.BatchMessage = "No Vertical to be Uploaded";
                responseObj.BatchStatus = "PROCESSED";
            }
            else
            {
                string jsonData = "";
                Guid batchId = new Guid();

                foreach (VistexQueueObject r in records)
                {
                    jsonData = r.RqstJsonData;
                    batchId = r.BatchId;
                }

                responseObj = ConnectSAPPOandResponse(jsonData, "V", batchId.ToString(), responseObj);
                responseObj.BatchName = "PRODUCT_VERTICAL";

                //UpDate Status                
                SetVistexDealOutBoundStageV(batchId, responseObj.BatchStatus == "PROCESSED" ? "PO_Processing_Complete" : "PO_Error_Rollback", responseObj.BatchMessage);

            }
            return responseObj;
        }

        public Boolean SaveVistexResponseData(VistexResponseMsg jsonDataPacket) //VTX_OBJ: DEALS
        {
            // Vistex returned response processing - if it saves data to DB, return true, else return false.
            Guid batchId = new Guid(jsonDataPacket.vistexResponseHeader.BatchId);
            Dictionary<int, string> dealsMessages = new Dictionary<int, string>();

            // Decide if we want to capture the AgreementId and DealType as part of ErrMessage
            foreach (VistexResponseMsg.VistexResponseHeader.DealResponse response in jsonDataPacket.vistexResponseHeader.DealResponses)
            {
                dealsMessages.Add(response.DealId, response.Status + ": " + response.ErrMessage);
            }

            return _muleServiceDataLib.SaveVistexResponseData(batchId, dealsMessages);
        }

    }
}

