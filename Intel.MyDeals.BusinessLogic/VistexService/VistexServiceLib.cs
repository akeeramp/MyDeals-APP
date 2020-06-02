using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System;
using System.Net;
using System.IO;
using System.Text;
using Intel.Opaque;
using System.Configuration;
using System.Linq;
using Newtonsoft.Json;
using System.Diagnostics;

namespace Intel.MyDeals.BusinessLogic
{
    public class VistexServiceLib : IVistexServiceLib
    {
        private readonly IVistexServiceDataLib _vistexServiceDataLib;

        public VistexServiceLib(IVistexServiceDataLib vistexServiceDataLib)
        {
            _vistexServiceDataLib = vistexServiceDataLib;
        }

        // Start actual functions here

        public VistexDFDataResponseObject GetVistexDealOutBoundData(string packetType, string runMode, VistexDFDataResponseObject responseObj) //VTX_OBJ: DEALS
        {
            List<VistexQueueObject> dataRecords = new List<VistexQueueObject>();
            responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: Initiated ") + Environment.NewLine);

            try
            {
                dataRecords = _vistexServiceDataLib.GetVistexDealOutBoundData(packetType, runMode);
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: _vistexServiceDataLib.GetVistexDealOutBoundData - Success ") + Environment.NewLine);

                // Construct the send JSON from the list of bodies we got
                if (dataRecords.Count > 0)
                {
                    string jsonData = "";
                    int indx = 0;
                    for (; indx < dataRecords.Count; indx++)
                    {
                        jsonData = jsonData + "," + dataRecords[indx].RqstJsonData;
                        //Checking less the 4MB packet size
                        if (jsonData.Length * sizeof(Char) > 400 || indx == dataRecords.Count - 1)
                        {
                            jsonData = jsonData.Remove(0, 1);
                            responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: sendDealdataToSapPo - Initiated ") + Environment.NewLine);
                            responseObj = sendDealdataToSapPo(dataRecords[0].BatchId, jsonData, responseObj);
                            responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: sendDealdataToSapPo - Success ") + Environment.NewLine);

                            jsonData = "";
                        }
                    }
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
                responseObj.BatchName = "DEALS";
                responseObj.BatchId = "-1";
                responseObj.BatchMessage = "Exception: " + ex.Message + "\n" + "Innerexception: " + ex.InnerException;
                responseObj.BatchStatus = "Exception";
                responseObj.MessageLog.Add("Business Layer - GetVistexStageData: Exception Details -- " + String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
                OpLogPerf.Log($"Thrown from: VistexServiceLib - Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
            }

            return responseObj;
        }

        public VistexDFDataResponseObject sendDealdataToSapPo(Guid BatchId, string jsonData, VistexDFDataResponseObject responseObj)
        {
            try
            {
                string header = "{\"VistexDealsSendHeader\":{\"BatchId\":\"" + BatchId.ToString() + "\",\"Action\":\"Create\",\"SourceSystem\":\"MyDeals\",\"TargetSystem\":\"Vistex\",\"Agreements\":{\"AgreementDetails\":[";
                //Footer item
                string footer = "]}}}";
                //Constructing Complete JSON
                var finalJSON = header + jsonData + footer;
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: ConnectSAPPOandResponse - Initiated ") + Environment.NewLine);
                //Sending to SAP PO                
                responseObj = ConnectSAPPOandResponse(finalJSON, "D", BatchId.ToString(), responseObj);
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexDealOutBoundData: ConnectSAPPOandResponse - Success ") + Environment.NewLine);

                //Update Status
                SetVistexDealOutBoundStage(BatchId, responseObj.BatchStatus == "PROCESSED" ? "PO_Send_Completed" : "PO_Error_Rollback");
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - SetVistexDealOutBoundStage - Status Update Successful") + Environment.NewLine);

            }
            catch (Exception ex)
            {
                responseObj.MessageLog.Add("Business Layer - sendDealdataToSapPo: Exception Details -- " + String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
                OpLogPerf.Log($"Thrown from: VistexServiceLib - DEALS - Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
            }
            return responseObj;
        }
        public VistexDFDataResponseObject GetVistexDataOutBound(string packetType, VistexDFDataResponseObject responseObj) //VTX_OBJ: VERTICALS
        {
            List<VistexQueueObject> records = new List<VistexQueueObject>();            
            //VistexDFDataResponseObject responseObj = new VistexDFDataResponseObject();
            records = _vistexServiceDataLib.GetVistexDataOutBound(packetType);
            if(records.Count == 0)
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
                SetVistexDealOutBoundStage(batchId, responseObj.BatchStatus == "PROCESSED" ? "PO_Processing_Complete" : "PO_Error_Rollback");

            }

            return responseObj;            
        }

        public void SetVistexDealOutBoundStage(Guid btchId, string rqstStatus) //VTX_OBJ: VERTICALS
        {
            _vistexServiceDataLib.SetVistexDealOutBoundStage(btchId, rqstStatus);
        }

        
        public VistexDFDataLoadObject GetVistexDFStageData(string runMode)
        {
            return _vistexServiceDataLib.GetVistexDFStageData(runMode);
        }

        public VistexDFDataResponseObject GetVistexStageData(string runMode, VistexDFDataResponseObject responseObj) //VTX_OBJ: CUSTOMER, PRODUCTS, VERTICAL
        {
            //VistexDFDataResponseObject responseObj = new VistexDFDataResponseObject();
            //List<string> logMsg = new List<string>();
            responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexStageData: Initiated ") + Environment.NewLine);
            try
            {
                if (runMode == "V")
                {
                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexStageData: GetVistexDataOutBound - PROD_VERT_RULES: Initiated ") + Environment.NewLine);
                    responseObj = GetVistexDataOutBound("PROD_VERT_RULES", responseObj);
                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexStageData: GetVistexDataOutBound - PROD_VERT_RULES: Done ") + Environment.NewLine);
                }
                else
                {
                    VistexDFDataLoadObject dataRecord = new VistexDFDataLoadObject();
                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexStageData: " + "_vistexServiceDataLib.GetVistexDFStageData(" + runMode + ") - " + runMode == "C" ? "CUSTOMER_BRD" : "PRODUCT_BRD" + ": Initiated ") + Environment.NewLine);
                    dataRecord = _vistexServiceDataLib.GetVistexDFStageData(runMode);
                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexStageData: " + "_vistexServiceDataLib.GetVistexDFStageData(" + runMode + ") -" + runMode == "C" ? "CUSTOMER_BRD" : "PRODUCT_BRD" + ": Done ") + Environment.NewLine);

                    if (dataRecord.BatchId <= 0)
                    {
                        responseObj.BatchName = runMode == "C" ? "CUSTOMER_BRD" : "PRODUCT_BRD";
                        responseObj.BatchId = "0";
                        responseObj.BatchMessage = "No data to be Uploaded";
                        responseObj.BatchStatus = "PROCESSED";
                    }
                    else
                    {
                        string jsonData = dataRecord.JsonData;
                        responseObj = ConnectSAPPOandResponse(jsonData, runMode, dataRecord.BatchId.ToString(), responseObj);
                        //UpDate Status
                        UpdateVistexDFStageData(responseObj);

                    }
                    responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - GetVistexStageData: Status - Done") + Environment.NewLine);
                }
            }
            catch (Exception ex)
            {
                responseObj.BatchName = runMode == "C" ? "CUSTOMER_BRD" : runMode == "V" ? "PRODUCT_VERTICAL" : "PRODUCT_BRD";
                responseObj.BatchId = "-1";
                responseObj.BatchMessage = "Exception: " + ex.Message + "\n" + "Innerexception: " + ex.InnerException;
                responseObj.BatchStatus = "Exception";
                responseObj.MessageLog.Add("Business Layer - GetVistexStageData: Exception Details -- " + String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
                OpLogPerf.Log($"Thrown from: VistexServiceLib - Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
            }
            
            return responseObj;
        }


        public VistexDFDataResponseObject ConnectSAPPOandResponse(string jsonData, string runMode, string BatchId, VistexDFDataResponseObject responseObj) //VTX_OBJ: CUSTOMER, PRODUCTS, DEALS, VERTICAL
        {
            
            try
            {
                // Step 2: Post Data to SAP PO API
                Dictionary<string, string> sendResponse = new Dictionary<string, string>();
                sendResponse = _vistexServiceDataLib.PublishToSapPoDCPV(jsonData, runMode, responseObj);
                //VistexDFDataResponseObject responseObj = new VistexDFDataResponseObject();
                if (sendResponse["Status"].ToLower() == "ok" || sendResponse["Status"].ToLower() == "accepted")
                {
                    responseObj.RunMode = runMode;
                    //Batch ID
                    responseObj.BatchId = BatchId;
                    //Parsing Response from SAP PO
                    VistexDFResponse visResponse = JsonConvert.DeserializeObject<VistexDFResponse>(sendResponse["Data"]);
                    //Assigning Message Body to be Tranferred 
                    responseObj.BatchMessage = runMode == "D" ? "PO_Send_Complete" : visResponse.Message ?? string.Empty;
                    //API Type                
                    responseObj.BatchName = runMode == "D" ? "VISTEX_DEAL" : runMode == "P" ? "PRODUCT_BRD" : runMode == "V" ? "PRODUCT_VERTICAL" : "CUSTOMER_BRD";
                    //Status of the Call
                    responseObj.BatchStatus = "PROCESSED";
                }
                else
                {
                    responseObj.RunMode = runMode;
                    //Batch ID
                    responseObj.BatchId = BatchId;
                    //VistexDFResponse visResponse = JsonConvert.DeserializeObject<VistexDFResponse>(sendResponse);
                    responseObj.BatchName = runMode == "P" ? "PRODUCT_BRD" : runMode == "V" ? "PRODUCT_VERTICAL" : "CUSTOMER_BRD";
                    responseObj.BatchMessage = sendResponse["Message"];
                    responseObj.BatchStatus = "ERROR";

                }
                responseObj.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Business Layer - ConnectSAPPOandResponse - Done"));
            }
            catch(Exception ex)
            {
                responseObj.RunMode = runMode;
                //Batch ID
                responseObj.BatchId = "-1";
                //VistexDFResponse visResponse = JsonConvert.DeserializeObject<VistexDFResponse>(sendResponse);
                responseObj.BatchName = runMode == "P" ? "PRODUCT_BRD" : runMode == "V" ? "PRODUCT_VERTICAL" : "CUSTOMER_BRD";
                responseObj.BatchMessage = "Exception: " + ex.Message + "\n" + "Innerexception: " + ex.InnerException;
                responseObj.BatchStatus = "Exception";
                responseObj.MessageLog.Add("Business Layer - ConnectSAPPOandResponse: Exception Deatils -- " + String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
            }
            
            return responseObj;
        }
        public void UpdateVistexDFStageData(VistexDFDataResponseObject responseObj) //VTX_OBJ: CUSTOMER
        {
            _vistexServiceDataLib.UpdateVistexDFStageData(responseObj);
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

            return _vistexServiceDataLib.SaveVistexResponseData(batchId, dealsMessages);
        }

        public Dictionary<string, string> PublishSapPo(string url, string jsonDatab)
        {
            return _vistexServiceDataLib.PublishSapPo(url, jsonDatab.ToString());
        }

    }
}
