using System;
using Intel.Opaque.Tools;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using Intel.MyDeals.Entities;
using Intel.Opaque.Utilities.Server;

namespace Intel.MyDeals.VistexService
{
    public class DataAccessLayer
    {
        private static string vistexAPIbaseUrl = GetAppSetting("MyDealsService");
        private static string vistexController = "/api/VistexService/";
        //Connection Master - > Can be moved to App.Config
        public static Dictionary<string, string> conDict = new Dictionary<string, string>()
        {
            {"D", "https://sappodev.intel.com:8215/RESTAdapter/MyDeals"},
            {"C", "http://sappodev.intel.com:8415/RESTAdapter/VistexCustomer"},
            {"P", "http://sappodev.intel.com:8415/RESTAdapter/ProductMain"},
            {"V", "https://sappodev.intel.com:8215/RESTAdapter/ProductVertical"},
        };

        private static HttpClient MyDealsClient
        {
            get
            {
                HttpClientHandler handler = new HttpClientHandler()
                {
                    Credentials = CredentialCache.DefaultNetworkCredentials
                };
                HttpClient client = new HttpClient(handler);
                client.BaseAddress = new Uri(vistexAPIbaseUrl);
                client.Timeout = TimeSpan.FromMinutes(6);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                return client;
            }
        }

        #region Common Settings

        public static string GetAppSetting(string appSettingName)
        {
            if (String.IsNullOrEmpty(ConfigurationManager.AppSettings[appSettingName]))
            {
                throw new Exception(appSettingName + " is missing!");
            }
            return ConfigurationManager.AppSettings[appSettingName];
        }

        public static int GetAppSettingInt(string app_setting, int error_default)
        {
            int ts;
            if (!Int32.TryParse(GetAppSetting(app_setting), out ts))
            {
                return ts;
            }

            return error_default;
        }
        #endregion




        #region MyDeals Data Fetch Calls
        public static async Task<List<VistexDealOutBound>> GetVistexDealOutBoundData()
        {
            List<VistexDealOutBound> records = new List<VistexDealOutBound>();
            var xmlRecords = string.Empty;
            try
            {
                //JmsQCommon.Log("GetPricingRecordsXml");

                var dealsRecordsXmlUrl = vistexController + "GetVistexDealOutBoundData";
                HttpResponseMessage response = await MyDealsClient.GetAsync(dealsRecordsXmlUrl);
                if (response.IsSuccessStatusCode)
                {
                    xmlRecords = await response.Content.ReadAsStringAsync();
                }
                else
                {
                    //JmsQCommon.HandleException(new Exception("GetPricingRecordsXml - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
                return records = JsonConvert.DeserializeObject<List<VistexDealOutBound>>(xmlRecords);
            }
            catch (Exception ex)
            {
                //JmsQCommon.HandleException(ex);
            }

            return records;
        }


        public static async Task<VistexDFDataResponseObject> GetVistexDataOutBound(string dataType, string runMode) // TC-DEALS
        {
            List<VistexDFDataResponseObject> records = new List<VistexDFDataResponseObject>();
            var xmlRecords = string.Empty;
            try
            {
                //JmsQCommon.Log("GetPricingRecordsXml");

                var dealsRecordsXmlUrl = vistexController + "GetVistexDealOutBoundData/" + dataType + "/" + runMode;
                HttpResponseMessage response = await MyDealsClient.GetAsync(dealsRecordsXmlUrl);
                if (response.IsSuccessStatusCode)
                {
                    xmlRecords = await response.Content.ReadAsStringAsync();
                }
                else
                {
                    //JmsQCommon.HandleException(new Exception("GetPricingRecordsXml - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
                List<VistexDFDataResponseObject> blah = JsonConvert.DeserializeObject<List<VistexDFDataResponseObject>>(xmlRecords);
                VistexDFDataResponseObject arg = blah.FirstOrDefault();
                //return records = JsonConvert.DeserializeObject<List<VistexDFDataResponseObject>>(xmlRecords);
                return arg;
            }
            catch (Exception ex)
            {
                //JmsQCommon.HandleException(ex);
            }

            return records.FirstOrDefault();
        }

        public static async Task SetVistexDealOutBoundStage(string btchId, string rqstStatus)
        {
            try
            {
                var dealsStatusUpdateUrl = vistexController + "SetVistexDealOutBoundStage/" + btchId + "/" + rqstStatus;
                                
                HttpResponseMessage response = await MyDealsClient.GetAsync(dealsStatusUpdateUrl);
                if (!response.IsSuccessStatusCode)
                {
                    //JmsQCommon.HandleException(new Exception("UpdateRecordStagesAndNotifyErrors - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
            }
            catch (Exception ex)
            {
                //JmsQCommon.HandleException(ex);
            }
        }
        //GetVistexDFStageData
        public static async Task<VistexDFDataResponseObject> GetVistexDFStageData(string runMode)//TC-CUSTOMER
        {
            VistexDFDataResponseObject retRecord = new VistexDFDataResponseObject();
            var xmlRecords = string.Empty;
            try
            {
                var fetchVistexDFData = vistexController + "GetVistexDFStageData/" + runMode;
                HttpResponseMessage response = await MyDealsClient.GetAsync(fetchVistexDFData);
                if (response.IsSuccessStatusCode)
                {
                    xmlRecords = await response.Content.ReadAsStringAsync();
                }
                else
                {
                    //JmsQCommon.HandleException(new Exception("GetPricingRecordsXml - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
                retRecord = JsonConvert.DeserializeObject<VistexDFDataResponseObject>(xmlRecords);
            }
            catch (Exception ex)
            {
                //JmsQCommon.HandleException(ex);
            }

            return retRecord;
        }

        public static async Task UpdateVistexDFStageData(VistexDFDataResponseObject responseObj)
        {
            try
            {
                var updatehVistexDFData = vistexController + "UpdateVistexDFStageData";

                HttpResponseMessage response = await MyDealsClient.PostAsJsonAsync(updatehVistexDFData, responseObj);
                if (!response.IsSuccessStatusCode)
                {
                    //JmsQCommon.HandleException(new Exception("UpdateRecordStagesAndNotifyErrors - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
            }
            catch (Exception ex)
            {
                //JmsQCommon.HandleException(ex);
            }
        }
        #endregion MyDeals Data Fetch Calls

        #region Outbound API Calls (In MyDeals Datalibraries)
        public static async Task<Dictionary<string, string>> PublishDealsToSapPo()
        {
            Dictionary<string, string> responseObjectDictionary = new Dictionary<string, string>();
            var xmlRecords = string.Empty;
            try
            {
                //JmsQCommon.Log("GetPricingRecordsXml");
                string jsonData = "{" +
                                "\"Mydeals\": {" +
                                "\"Cust_no\": \"9666\"," +
                                "\"Deal_id\": \"54556\"," +
                                "\"END_DT\": \"5556\"," +
                                "\"GEO_COMBINED\": \"556\"," +
                                "\"MRKT_SEG\": \"5556\"," +
                                "\"OBJ_SET_TYPE_CD\": \"859\"," +
                                "\"PAYOUT_BASED_ON\": \"88\"," +
                                "\"PRODUCT_FILTER\": \"8559\"," +
                                "\"START_DT\": \"899\"," +
                                "\"VOLUME\": \"899\"" +
                                "}" +
                                "}";

                var publishSapPoUrl = vistexController + "PublishDealsToSapPo";
                //HttpResponseMessage response = await MyDealsClient.GetAsync(publishSapPoUrl);
                HttpResponseMessage response = await MyDealsClient.PostAsJsonAsync(publishSapPoUrl, jsonData);
                if (response.IsSuccessStatusCode)
                {
                    xmlRecords = await response.Content.ReadAsStringAsync();
                }
                else
                {
                    //JmsQCommon.HandleException(new Exception("GetPricingRecordsXml - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
                return responseObjectDictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(xmlRecords);
            }
            catch (Exception ex)
            {
                //JmsQCommon.HandleException(ex);
            }

            return responseObjectDictionary;
        }
        #endregion Outbound API Calls (In MyDeals Datalibraries)

        //Bring this in later to push SAP connection up into layers
        #region Outbound API Calls Local (To Be Removed once POST is fixed)
        private static CredentialCache GetCredentials(string url)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3;
            CredentialCache credentialCache = new CredentialCache();
            credentialCache.Add(new System.Uri(url), "Basic", new NetworkCredential(ConfigurationManager.AppSettings["vistexUID"],
                StringEncrypter.StringDecrypt(ConfigurationManager.AppSettings["vistexPWD"] != string.Empty ? ConfigurationManager.AppSettings["vistexPWD"] : "", "Vistex_Password")));
            return credentialCache;
        }

        //TODO: Remove after Testing -- Saurav
        public static Dictionary<string, string> PublishDealsToSapPo_Local(string jsonData)
        {
            string url = @"https://sappodev.intel.com:8215/RESTAdapter/MyDeals";

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

                response.Close();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                responseObjectDictionary["Status"] = e.Message;
                //throw;
            }

            return responseObjectDictionary;
        }

        //TODO: Remove after Testing -- Saurav
        public static Dictionary<string, string> PublishCustomersToSapPo_Local(string jsonData)
        {
            string url = @"";

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

                response.Close();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                responseObjectDictionary["Status"] = e.Message;
                //throw;
            }

            return responseObjectDictionary;
        }

        //TODO: Remove after Testing -- Saurav
        public static Dictionary<string, string> PublishProductsToSapPo_Local(string jsonData)
        {
            string url = "";// @vistexProductConnection;

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

                response.Close();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                responseObjectDictionary["Status"] = e.Message;
                //throw;
            }

            return responseObjectDictionary;
        }

        //TODO: Remove after Testing -- Saurav
        public static Dictionary<string, string> PublishVerticalsToSapPo_Local(string jsonData)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12; // .NET 4.5 -- The client and server cannot communicate, because they do not possess a common algorithm.
            string url = "";// @vistexProductVerticalConnection;
            
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

        //For Deal - Product - Customer - Product Vertical
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
        #endregion Outbound API Calls Local (To Be Removed once POST is fixed)


        // Test routine
        public static async Task<PairList<int>> GetMaxGroupId()
        {
            try
            {
                //JmsQCommon.Log("GetMaxGroupId");
                var pairHash = string.Empty;
                var maxGroupUrl = vistexController + "GetMaxGroupId";

                HttpResponseMessage response = await MyDealsClient.GetAsync(maxGroupUrl);
                if (response.IsSuccessStatusCode)
                {
                    pairHash = await response.Content.ReadAsAsync<string>();
                }
                else
                {
                    //JmsQCommon.HandleException(new Exception("GetMaxGroupId - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }

                if (!String.IsNullOrEmpty(pairHash))
                {
                    PairList<int> ret = new PairList<int>();

                    // This string hash stuff was me being too lazy to deal with WCF class serialization issues...
                    foreach (var str in pairHash.Split('|'))
                    {
                        var asp = str.Split(';');
                        if (asp.Length == 2)
                        {
                            int grp_id = 0;
                            int jms_id = 0;

                            if (Int32.TryParse(asp[0], out grp_id) && Int32.TryParse(asp[1], out jms_id))
                            {
                                ret.Add(grp_id, jms_id);
                            }
                        }
                    }

                    return ret;
                }
            }
            catch (Exception ex)
            {
                //JmsQCommon.HandleException(ex);
            }

            return new PairList<int>();
        }


    }
}