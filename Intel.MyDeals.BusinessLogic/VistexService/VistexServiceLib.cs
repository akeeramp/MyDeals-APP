using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System;
using System.Net;
using System.IO;
using System.Text;
using Intel.Opaque.Utilities.Server;
using System.Configuration;
using System.Linq;
using Newtonsoft.Json;
using System.Diagnostics;

namespace Intel.MyDeals.BusinessLogic
{
    public class VistexServiceLib : IVistexServiceLib
    {
        //Connection Master - > Can be moved to App.Config
        public static Dictionary<string, string> conDict = new Dictionary<string, string>()
        {
            {"D", "http://sappodev.intel.com:8415/RESTAdapter/MyDeals"},
            {"C", "http://sappodev.intel.com:8415/RESTAdapter/VistexCustomer"},
            {"P", "http://sappodev.intel.com:8415/RESTAdapter/ProductMain"},
            {"V", "http://sappodev.intel.com:8415/RESTAdapter/ProductVertical"},
        };

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
                string header = "{\"VistexDealsSendHeader\":{\"BatchId\":\""+ dataRecords[0].BatchId+"\",\"Action\":\"Create\",\"SourceSystem\":\"MyDeals\",\"TargetSystem\":\"Vistex\",\"Agreements\":{\"AgreementDetails\":[";
                string jsonData = "";

                foreach (VistexQueueObject r in dataRecords)
                {
                    jsonData = jsonData + "," + r.RqstJsonData;
                }
                //Removing first comma
                jsonData = jsonData.Remove(0, 1);                
                //Footer item
                string footer = "]}}}";
                //Constructing Complete JSON
                var finalJSON = header + jsonData + footer;                
                //Sending to SAP PO
                responseObj = ConnectSAPPOandResponse(finalJSON, runMode, dataRecords[0].BatchId.ToString());
                //Update Status
                SetVistexDealOutBoundStage(dataRecords[0].BatchId, responseObj.BatchStatus == "PROCESSED" ? "PO_Send_Completed" : "PO_Error_Rollback");


            }

            return responseObj;


            //return _vistexServiceDataLib.GetVistexDealOutBoundData(packetType, runMode);
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
            sendResponse = PublishToSapPo(jsonData, runMode);
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

        public Dictionary<string, string> PublishSapPo(string url, string jsonData)
        {
            return _vistexServiceDataLib.PublishSapPo(url, jsonData);
        }


        public Dictionary<string, string> PublishToSapPo(string jsonData, string mode) //VTX_OBJ: CUSTOMER, PRODUCTS, DEALS, VERTICAL
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12; // .NET 4.5 -- The client and server cannot communicate, because they do not possess a common algorithm.
            string url = "";

            jsonData = jsonData.Replace("CustomerBRD", "Customer");
            //URL Setting - Reading from Key Value Pair
            url = @conDict[mode];

            // Create a request using a URL that can receive a post.   
            WebRequest request = WebRequest.Create(url);
            request.Credentials = _vistexServiceDataLib.GetVistexCredentials(url);
            // Set the Method property of the request to POST.  
            request.Method = "POST";

            // Create POST data and convert it to a byte array.  
            byte[] byteArray = Encoding.UTF8.GetBytes(jsonData);

            // Set the ContentType property of the WebRequest.  
            request.ContentType = "application/x-www-form-urlencoded";
            // Set the ContentLength property of the WebRequest.  
            request.ContentLength = byteArray.Length;

            // Get the request stream, write data, then close the stream
            Stream dataStream = request.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();

            Dictionary<string, string> responseObjectDictionary = new Dictionary<string, string>();
                        
            try
            {
                WebResponse response = request.GetResponse(); // Get the response.
                responseObjectDictionary["Status"] = ((HttpWebResponse)response).StatusDescription;
                
                // Get the stream containing content returned by the server.  
                // The using block ensures the stream is automatically closed.
                using (dataStream = response.GetResponseStream())
                {
                    // Open the stream using a StreamReader for easy access.  
                    StreamReader reader = new StreamReader(dataStream);
                    // Read the content.  
                    string responseFromServer = reader.ReadToEnd();
                    // Display the content.  
                    responseObjectDictionary["Data"] = responseFromServer;
                }
                
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                
                responseObjectDictionary.Add("Status", e.Message );
                responseObjectDictionary.Add("Message", e.Message);
                
            }            

            return responseObjectDictionary;
        }

        public Boolean SaveVistexResponseData(VistexResponseMsg jsonDataPacket) //VTX_OBJ: DEALS
        {
            // Vistex returned response processing - if it saves data to DB, return true, else return false.
            Guid batchId = new Guid(jsonDataPacket.vistexResponseHeader.BatchId);
            Dictionary<int, string> dealsMessages = new Dictionary<int, string>();

            foreach (VistexResponseMsg.VistexResponseHeader.DealResponse response in jsonDataPacket.vistexResponseHeader.DealResponses)
            {
                dealsMessages.Add(response.DealId, response.ErrMessage);
            }

            return _vistexServiceDataLib.SaveVistexResponseData(batchId, dealsMessages);
        }


    }
}
