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
using Newtonsoft.Json;

namespace Intel.MyDeals.BusinessLogic
{
    public class VistexServiceLib : IVistexServiceLib
    {
        //Connection Master - > Can be moved to App.Config
        public static Dictionary<string, string> conDict = new Dictionary<string, string>()
        {
            {"D", "https://sappodev.intel.com:8215/RESTAdapter/MyDeals"},
            {"C", "http://sappodev.intel.com:8415/RESTAdapter/VistexCustomer"},
            {"P", "http://sappodev.intel.com:8415/RESTAdapter/ProductMain"},
            {"V", "https://sappodev.intel.com:8215/RESTAdapter/ProductVertical"},
        };

        private readonly IVistexServiceDataLib _vistexServiceDataLib;

        public VistexServiceLib(IVistexServiceDataLib vistexServiceDataLib)
        {
            _vistexServiceDataLib = vistexServiceDataLib;
        }

        // Start actual functions here

        public List<VistexDealOutBound> GetVistexDealOutBoundData(string packetType)
        {
            return _vistexServiceDataLib.GetVistexDealOutBoundData(packetType);
        }

        public List<VistexDFDataResponseObject> GetVistexDataOutBound(string packetType)
        {
            List<VistexQueueObject> records = new List<VistexQueueObject>();
            List<VistexDFDataResponseObject> lstResponse = new List<VistexDFDataResponseObject>();
            //for(int i = 0; i < 1000; i++)
            while(true)
            {
                records = _vistexServiceDataLib.GetVistexDataOutBound(packetType);
                if(records.Count == 0)
                {
                    break;
                }
                string jsonData = "";
                Guid batchId = new Guid();

                foreach (VistexQueueObject r in records)
                {
                    jsonData = r.RqstJsonData;
                    batchId = r.BatchId;
                }

                VistexDFDataResponseObject responseObj = ConnectSAPPOandResponse(jsonData, "V", batchId.ToString());
                lstResponse.Add(responseObj);
                //UpDate Status
                SetVistexDealOutBoundStage(batchId, "PO_Processing_Complete"); 
            }
            return lstResponse;            
        }

        public void SetVistexDealOutBoundStage(Guid btchId, string rqstStatus)
        {
            _vistexServiceDataLib.SetVistexDealOutBoundStage(btchId, rqstStatus);
        }

        public VistexDFDataLoadObject GetVistexDFStageData(string runMode)
        {            
            return _vistexServiceDataLib.GetVistexDFStageData(runMode);
        }

        public VistexDFDataResponseObject GetVistexStageData(string runMode)
        {
            VistexDFDataLoadObject dataRecord = new VistexDFDataLoadObject();
            dataRecord = _vistexServiceDataLib.GetVistexDFStageData(runMode);
            string jsonData = dataRecord.JsonData;

            VistexDFDataResponseObject responseObj = ConnectSAPPOandResponse(jsonData, runMode, dataRecord.BatchId.ToString());

            //UpDate Status
            UpdateVistexDFStageData(responseObj);

            return responseObj;

            //return _vistexServiceDataLib.GetVistexDFStageData(runMode);
        }


        public VistexDFDataResponseObject ConnectSAPPOandResponse(string jsonData, string runMode, string BatchId)
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
                responseObj.BatchMessage = visResponse.Message;
                //API Type                
                responseObj.BatchName = runMode == "P" ? "PRODUCT_BRD" : runMode == "V" ? "PRODUCT_VERTICAL" : "CUSTOMER_BRD";
                //Status of the Call
                responseObj.BatchStatus = visResponse.Status == "S" ? "PROCESSED" : "FAILED";
            }           

            return responseObj;
        }
        public void UpdateVistexDFStageData(VistexDFDataResponseObject responseObj)
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
        private static CredentialCache GetCredentials(string url)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3;
            CredentialCache credentialCache = new CredentialCache();
            //TODO: Replace with GetEnvConfigs()
            string vistexUID = "XI_MYDEALS";
            string vistexPWD = "03924400H0F5xF42140j2551632o36239137w22u223219600F041I09v01302d5Z8k52p260R0260301S09302322302i40e7v7sk1S191";
            credentialCache.Add(new System.Uri(url), "Basic", new NetworkCredential(vistexUID,
                StringEncrypter.StringDecrypt(vistexPWD, "Vistex_Password")));
            return credentialCache;
        }
        public static Dictionary<string, string> PublishToSapPo(string jsonData, string mode)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12; // .NET 4.5 -- The client and server cannot communicate, because they do not possess a common algorithm.
            string url = "";

            //URL Setting - Reading from Key Value Pair
            url = @conDict[mode];

            // Create a request using a URL that can receive a post.   
            WebRequest request = WebRequest.Create(url);
            request.Credentials = GetCredentials(url);
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
            WebResponse response = request.GetResponse(); // Get the response.

            try
            {
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
                responseObjectDictionary["Status"] = e.Message;
                //throw;
            }
            finally
            {
                response.Close();
            }

            return responseObjectDictionary;
        }


    }
}
