using System;
using System.IO;
using System.Net;
using System.Text;
using System.Linq;
using Intel.Opaque;
using Newtonsoft.Json;
using System.Configuration;
using Intel.Opaque.DBAccess;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using static Intel.MyDeals.DataLibrary.JmsDataLib;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class MuleServiceDataLib : IMuleServiceDataLib
    {
        private string muleKey;
        private string muleSecret;
        private string muleTokenUrl;
        private string muleDealApiUrl;

        public MuleServiceDataLib()
        {
            muleKey = ConfigurationManager.AppSettings["muleKey"];
            muleSecret = ConfigurationManager.AppSettings["muleSecret"];
            muleTokenUrl = ConfigurationManager.AppSettings["muleTokenUrl"];
            muleDealApiUrl = ConfigurationManager.AppSettings["muleDealApiUrl"];
        }

        public string GenerateMuletoken()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string consumerKey = muleKey;
            string consumerSecret = muleSecret;
            string apiGeeTokenUrl = muleTokenUrl;
            string accessToken = "";

            byte[] byte1 = Encoding.ASCII.GetBytes("grant_type=client_credentials&client_id=" + consumerKey + "&client_secret=" + consumerSecret);

            HttpWebRequest bearerReq = WebRequest.Create(apiGeeTokenUrl) as HttpWebRequest;
            bearerReq.Accept = "application/json";
            bearerReq.Method = "POST";
            bearerReq.ContentType = "application/x-www-form-urlencoded";
            bearerReq.ContentLength = byte1.Length;
            bearerReq.KeepAlive = false;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            bearerReq.Proxy = new WebProxy("proxy-chain.intel.com", 911);
            try
            {
                Stream newStream = bearerReq.GetRequestStream();
                newStream.Write(byte1, 0, byte1.Length);
                WebResponse bearerResp = bearerReq.GetResponse();

                using (var reader = new StreamReader(bearerResp.GetResponseStream(), Encoding.UTF8))
                {
                    var response = reader.ReadToEnd();
                    Bearer bearer = JsonConvert.DeserializeObject<Bearer>(response);
                    accessToken = bearer.access_token;
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log("ApiGee Token Generation Failure: " + ex);
            }

            return accessToken;
        }

        private string GetVistexUrlByMode(string mode)
        {
            if (mode == "D")
            {
                return muleDealApiUrl;
            }
            else
            {
                return "";
            }
        }

        public List<VistexQueueObject> GetVistexDealOutBoundData(string packetType, string runMode) //VTX_OBJ: DEALS
        {
            List<VistexQueueObject> lstVistex = new List<VistexQueueObject>();
            var cmd = new Procs.dbo.PR_MYDL_STG_OUTB_BTCH_DATA
            {
                in_rqst_type = packetType,
                in_err_mode = (runMode == "E" || runMode == "F") ? true : false
            };
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_BTCH_ID = DB.GetReaderOrdinal(rdr, "BTCH_ID");
                int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
                int IDX_JSON_DATA = DB.GetReaderOrdinal(rdr, "RQST_JSON_DATA");

                while (rdr.Read())
                {
                    lstVistex.Add(new VistexQueueObject
                    {
                        DealId = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                        BatchId = (IDX_BTCH_ID < 0 || rdr.IsDBNull(IDX_BTCH_ID)) ? default(Guid) : rdr.GetFieldValue<Guid>(IDX_BTCH_ID),
                        RqstJsonData = (IDX_JSON_DATA < 0 || rdr.IsDBNull(IDX_JSON_DATA)) ? string.Empty : rdr.GetFieldValue<string>(IDX_JSON_DATA)
                    });
                }
            }
            return lstVistex;
        }

        public Dictionary<string, string> PublishToVitexViaMule(string jsonData, string mode, VistexDFDataResponseObject responseObject)
        {
            Dictionary<string, string> responseObjectDictionary = new Dictionary<string, string>();
            //URL Setting - Reading from Key Value Pair 
            string url = GetVistexUrlByMode(mode);
            responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Data Library Layer - PublishToSapPoDCPV: SAP PO Module Initiated") + Environment.NewLine);
            //Get Mule Token to send Payload
            string accessToken = GenerateMuletoken();
            if (accessToken.Length > 0)
            {
                string muleResponseURL = url;
                HttpWebRequest APIReq = WebRequest.Create(muleResponseURL) as HttpWebRequest;
                APIReq.Method = "POST";
                APIReq.Headers.Add("Authorization", "Bearer " + accessToken);
                APIReq.Method = "POST"; // Set the Method property of the request to POST. 
                APIReq.KeepAlive = false;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                byte[] byteArray = Encoding.UTF8.GetBytes(jsonData);
                APIReq.ContentType = "application/json"; // "application/x-www-form-urlencoded"; // Set the ContentType property of the WebRequest.  
                APIReq.ContentLength = byteArray.Length; // Set the ContentLength property of the WebRequest.  
                APIReq.Proxy = new WebProxy("proxy-chain.intel.com", 911);
                Stream dataStream = APIReq.GetRequestStream();
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                try
                {
                    WebResponse response = APIReq.GetResponse(); // Get the response.
                    //responseObjectDictionary["Status"] = ((HttpWebResponse)response).StatusDescription;
                    responseObjectDictionary["Status"] = ((HttpWebResponse)response).StatusDescription;

                    // The using block ensures the stream is automatically closed.
                    using (dataStream = response.GetResponseStream())
                    {
                        StreamReader responseReader = new StreamReader(APIReq.GetResponse().GetResponseStream());
                        string result = responseReader.ReadToEnd();
                        // Get the stream containing content returned by the server.  
                        SfApiGeeResponseObj ApiGeeResponse = JsonConvert.DeserializeObject<SfApiGeeResponseObj>(result);
                        // Open the stream using a StreamReader for easy access.
                        responseObjectDictionary["Data"] = result;
                        //Logging
                        OpLog.Log("Mule - Publish to Mule Completed: " + result.ToString());
                    }

                    response.Close();
                }
                catch (Exception ex)
                {
                    OpLogPerf.Log("Mule - Publish to SF Tenders ERROR: " + ex);
                }

            }
            return responseObjectDictionary;
        }
    }
}

