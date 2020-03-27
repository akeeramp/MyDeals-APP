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
            dataRecords = _vistexServiceDataLib.GetVistexDealOutBoundData(packetType, runMode);
            // Construct the send JSON from the list of bodies we got

            VistexDealsDataLoadObject tempObj = new VistexDealsDataLoadObject();
            tempObj.SourceSystem = "My Deals";
            tempObj.TargetSystem = "Vistex";
            tempObj.Action = "create";
            tempObj.BatchId = dataRecords[0].BatchId;
            tempObj.DealObjectsJson = "[" + string.Join(",", dataRecords.Select(d => d.RqstJsonData)) + "]"; ;

            string jsonData = JsonConvert.SerializeObject(tempObj);

            VistexDFDataResponseObject responseObj = ConnectSAPPOandResponse(jsonData, runMode, dataRecords[0].BatchId.ToString());

            //UpDate Status
            UpdateVistexDFStageData(responseObj);

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
                SetVistexDealOutBoundStage(batchId, "PO_Processing_Complete");//For testing i am removing it

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
                responseObj.BatchMessage = visResponse.Message ?? string.Empty;
                //API Type                
                responseObj.BatchName = runMode == "P" ? "PRODUCT_BRD" : runMode == "V" ? "PRODUCT_VERTICAL" : "CUSTOMER_BRD";
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

        // Testing helpers

        public Dictionary<string, string> TestConnection(bool noSAP, string brokerURI, string userName, string queueName) // used to have password in it
        {
            return _vistexServiceDataLib.TestConnection(noSAP, brokerURI, userName, queueName);
        }

        public string GetMaxGroupId()
        {
            return _vistexServiceDataLib.GetMaxGroupId();
        }

        //MyDeals -> SAP PO push
        //private static CredentialCache GetCredentials(string url) //TC-COSTOMER
        //{
        //    ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3;
        //    CredentialCache credentialCache = new CredentialCache();
        //    //TODO: Replace with GetEnvConfigs()
        //    string vistexUID = "XI_MYDEALS";
        //    string vistexPWD = "03924400H0F5xF42140j2551632o36239137w22u223219600F041I09v01302d5Z8k52p260R0260301S09302322302i40e7v7sk1S191";

        //    credentialCache.Add(new System.Uri(url), "Basic", new NetworkCredential(ConfigurationManager.AppSettings["vistexUID"],
        //        StringEncrypter.StringDecrypt(ConfigurationManager.AppSettings["vistexPWD"] != string.Empty ? ConfigurationManager.AppSettings["vistexPWD"] : "", "Vistex_Password")));
        //    return credentialCache;

        //    credentialCache.Add(new System.Uri(url), "Basic", new NetworkCredential(vistexUID,
        //        StringEncrypter.StringDecrypt(vistexPWD, "Vistex_Password")));
        //    return credentialCache;
        //}
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


    }
}
