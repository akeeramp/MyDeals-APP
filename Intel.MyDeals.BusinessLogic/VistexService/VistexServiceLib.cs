using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System;
using System.Net;
using System.IO;
using System.Text;

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

        public VistexDFDataResponseObject GetVistexDealOutBoundData(string packetType, string runMode) //VTX_OBJ: DEALS
        {
            List<VistexQueueObject> dataRecords = new List<VistexQueueObject>();
            VistexDFDataResponseObject responseObj = new VistexDFDataResponseObject();
            dataRecords = _vistexServiceDataLib.GetVistexDealOutBoundData(packetType, runMode);
            // Construct the send JSON from the list of bodies we got
            if(dataRecords.Count > 0)
            {               
                string jsonData = "";
                int indx = 0;
                for (; indx < dataRecords.Count; indx++)
                {
                    jsonData = jsonData + "," + dataRecords[indx].RqstJsonData;
                    //Checking less the 4MB packet size
                    if(jsonData.Length * sizeof(Char) > 4000000 || indx == dataRecords.Count - 1)
                    {
                        jsonData = jsonData.Remove(0, 1);
                        responseObj = sendDealdataToSapPo(dataRecords[0].BatchId, jsonData);
                        jsonData = "";
                    }
                }                
            }
            else
            {
                responseObj.BatchName = "VISTEX_DEALS";
                responseObj.BatchId = "0";
                responseObj.BatchMessage = "No data to be Uploaded";
            }
            return responseObj;
        }

        public VistexDFDataResponseObject sendDealdataToSapPo(Guid BatchId, string jsonData)
        {
            string header = "{\"VistexDealsSendHeader\":{\"BatchId\":\"" + BatchId.ToString() + "\",\"Action\":\"Create\",\"SourceSystem\":\"MyDeals\",\"TargetSystem\":\"Vistex\",\"Agreements\":{\"AgreementDetails\":[";
            //Footer item
            string footer = "]}}}";
            //Constructing Complete JSON
            var finalJSON = header + jsonData + footer;
            //Sending to SAP PO
            VistexDFDataResponseObject responseObj = new VistexDFDataResponseObject();
            responseObj = ConnectSAPPOandResponse(finalJSON, "D", BatchId.ToString());
            //Update Status
            SetVistexDealOutBoundStage(BatchId, responseObj.BatchStatus == "PROCESSED" ? "PO_Send_Completed" : "PO_Error_Rollback");
            return responseObj;
        }
        public VistexDFDataResponseObject GetVistexDataOutBound(string packetType) //VTX_OBJ: VERTICALS
        {
            List<VistexQueueObject> records = new List<VistexQueueObject>();            
            VistexDFDataResponseObject responseObj = new VistexDFDataResponseObject();
            records = _vistexServiceDataLib.GetVistexDataOutBound(packetType);
            if(records.Count == 0)
            {
                responseObj.BatchName = "PRODUCT_VERTICAL";
                responseObj.BatchId = "0";
                responseObj.BatchMessage = "No Vertical to be Uploaded";
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

                responseObj = ConnectSAPPOandResponse(jsonData, "V", batchId.ToString());
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

        public VistexDFDataResponseObject GetVistexStageData(string runMode) //VTX_OBJ: CUSTOMER, PRODUCTS
        {
            VistexDFDataResponseObject responseObj = new VistexDFDataResponseObject();
            if (runMode == "V")
            {
                responseObj = GetVistexDataOutBound("PROD_VERT_RULES");
            }
            else
            {
                VistexDFDataLoadObject dataRecord = new VistexDFDataLoadObject();
                
                dataRecord = _vistexServiceDataLib.GetVistexDFStageData(runMode);
                if (dataRecord.BatchId <= 0)
                {
                    responseObj.BatchName = runMode == "C" ? "CUSTOMER_BRD" : "PRODUCT_BRD";
                    responseObj.BatchId = "0";
                    responseObj.BatchMessage = "No data to be Uploaded";
                }
                else
                {
                    string jsonData = dataRecord.JsonData;
                    responseObj = ConnectSAPPOandResponse(jsonData, runMode, dataRecord.BatchId.ToString());
                    //UpDate Status
                    UpdateVistexDFStageData(responseObj);
                }                
            }
            return responseObj;
        }


        public VistexDFDataResponseObject ConnectSAPPOandResponse(string jsonData, string runMode, string BatchId) //VTX_OBJ: CUSTOMER, PRODUCTS, DEALS, VERTICAL
        {
            // Step 2: Post Data to SAP PO API
            Dictionary<string, string> sendResponse = new Dictionary<string, string>();
            sendResponse = _vistexServiceDataLib.PublishToSapPoDCPV(jsonData, runMode);
            VistexDFDataResponseObject responseObj = new VistexDFDataResponseObject();
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


    }
}
