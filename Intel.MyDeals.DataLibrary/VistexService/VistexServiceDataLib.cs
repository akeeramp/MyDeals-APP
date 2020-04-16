extern alias opaqueTools;

using Apache.NMS;
using Apache.NMS.ActiveMQ;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.Entities;
using opaqueTools.Intel.Opaque.Tools;
using Intel.MyDeals.DataAccessLib;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System.Linq;
using System.Net;
using System.Text;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Intel.Opaque.Utilities.Server;

namespace Intel.MyDeals.DataLibrary
{
    public class VistexServiceDataLib : IVistexServiceDataLib
    {
        private string _mIdsid;
        private string vistexBaseURL;
        private string vistexUID;
        private string vistexDealApi;
        private string vistexCustApi;
        private string vistexProdApi;
        private string vistexVertApi;
        private Dictionary<string, string> vistexEnvs;

        private IConnection connection;
        private ISession session;
        private IQueue destination;

        // This is all communications to our DB as well as SAP
        public VistexServiceDataLib()
        {
            _mIdsid = OpUserStack.MyOpUserToken.Usr.Idsid;

            vistexEnvs = DataLibrary.GetEnvConfigs();
            vistexBaseURL = vistexEnvs.ContainsKey("vistexBaseURL") ? vistexEnvs["vistexBaseURL"] : "";
            vistexUID = vistexEnvs.ContainsKey("vistexUID") ? vistexEnvs["vistexUID"] : "";
            
            //Getting APi Key            
            vistexBaseURL = ConfigurationManager.AppSettings["vistexBaseURL"];
            vistexDealApi = ConfigurationManager.AppSettings["vistexDealApi"];
            vistexCustApi = ConfigurationManager.AppSettings["vistexCustApi"];
            vistexProdApi = ConfigurationManager.AppSettings["vistexProdApi"];
            vistexVertApi = ConfigurationManager.AppSettings["vistexVertApi"];
        }
        private string GetVistexUrlByMode(string mode)
        {
            if(mode == "D")
            {
                return vistexBaseURL + "/" + vistexDealApi;
            }
            else if(mode == "C")
            {
                return vistexBaseURL + "/" + vistexCustApi;
            }
            else if (mode == "P")
            {
                return vistexBaseURL + "/" + vistexProdApi;
            }
            else if (mode == "V")
            {
                return vistexBaseURL + "/" + vistexVertApi;
            }
            else
            {
                return "";
            }
            
        }

        /// <summary>
        /// Publish JSON data to SAP PO
        /// </summary>
        /// <param name="jsonData"></param>
        /// <param name="mode"></param>
        /// <returns></returns>
        public Dictionary<string, string> PublishToSapPoDCPV(string jsonData, string mode) //VTX_OBJ: CUSTOMER, PRODUCTS, DEALS, VERTICAL
        {
            ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12; // .NET 4.5 -- The client and server cannot communicate, because they do not possess a common algorithm.

            //URL Setting - Reading from Key Value Pair 
            string url = GetVistexUrlByMode(mode);

            // Create a request using a URL that can receive a post.   
            WebRequest request = WebRequest.Create(url);
            request.Credentials = GetVistexCredentials(url);
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
            catch (Exception ex)
            {
                OpLogPerf.Log($"Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace} | Response {responseObjectDictionary["Status"]}", LogCategory.Error);
                responseObjectDictionary.Add("Status", ex.Message);
                responseObjectDictionary.Add("Message", ex.Message);
            }

            return responseObjectDictionary;
        }

        public List<VistexQueueObject> GetVistexDealOutBoundData(string packetType, string runMode) //VTX_OBJ: DEALS
        {
            List<VistexQueueObject> lstVistex = new List<VistexQueueObject>();
            var cmd = new Procs.dbo.PR_MYDL_STG_OUTB_BTCH_DATA
            {
                in_rqst_type = packetType
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

        public List<VistexQueueObject> GetVistexDataOutBound(string packetType) //VTX_OBJ: VERTICALS
        {
            List<VistexQueueObject> lstVistex = new List<VistexQueueObject>();
            var cmd = new Procs.dbo.PR_MYDL_STG_OUTB_BTCH_DATA
            {
                in_rqst_type = packetType
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
                        BatchId = (IDX_BTCH_ID < 0 || rdr.IsDBNull(IDX_BTCH_ID)) ? default(Guid) : rdr.GetFieldValue<Guid>(IDX_BTCH_ID),
                        DealId = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                        RqstJsonData = (IDX_JSON_DATA < 0 || rdr.IsDBNull(IDX_JSON_DATA)) ? string.Empty : rdr.GetFieldValue<string>(IDX_JSON_DATA)
                    });
                } 
            }
            return lstVistex;
        }


        public void SetVistexDealOutBoundStage(Guid btchId, string rqstStatus) //VTX_OBJ: VERTICALS
        {
            // Add type_int_dictionary here later
            OpLog.Log("Vistex - SetVistexDealOutBoundStage");
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_STG_OUTB_BTCH_STS_CHG
                {
                    in_btch_id = btchId,
                    in_rqst_sts = rqstStatus,
                };
                DataAccess.ExecuteNonQuery(cmd);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
            }
        }

        public VistexDFDataLoadObject GetVistexDFStageData(string runMode) //VTX_OBJ: CUSTOMERS, PRODUCTS
        {
            VistexDFDataLoadObject vistexData = new VistexDFDataLoadObject();
            var cmd = new Procs.dbo.PR_MYDL_VISTEX_GET_GEO_DSS_PRD_CUST
            {
                MODE = runMode
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_BTCH_ID = DB.GetReaderOrdinal(rdr, "BATCH_ID");
                int IDX_BATCH_RQST_JSON_DATA = DB.GetReaderOrdinal(rdr, "BATCH_RQST_JSON_DATA");

                // Only 1 record of data for these guys
                while (rdr.Read())
                {
                    vistexData.BatchId = (IDX_BTCH_ID < 0 || rdr.IsDBNull(IDX_BTCH_ID))
                        ? default(System.Int32)
                        : rdr.GetFieldValue<System.Int32>(IDX_BTCH_ID);
                    vistexData.JsonData = (IDX_BATCH_RQST_JSON_DATA < 0 || rdr.IsDBNull(IDX_BATCH_RQST_JSON_DATA))
                        ? string.Empty
                        : rdr.GetFieldValue<string>(IDX_BATCH_RQST_JSON_DATA);
                } 
            }
            return vistexData;
        }
        
        public void UpdateVistexDFStageData(VistexDFDataResponseObject responseObj) //VTX_OBJ: CUSTOMER
        {
            // Add type_int_dictionary here later
            OpLog.Log("Vistex - SetVistexDealOutBoundStage");
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_VISTEX_UPD_GEO_DSS_PRD_CUST
                {
                    MODE = responseObj.RunMode,
                    BATCH_ID = Convert.ToInt32(responseObj.BatchId),
                    BATCH_MESSAGE = responseObj.BatchMessage,
                    BATCH_NAME = responseObj.BatchName,
                    BATCH_STATUS = responseObj.BatchStatus
                };
                DataAccess.ExecuteNonQuery(cmd);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
            }
        }

        public Dictionary<string, string> PublishSapPo(string url, string jsonData) //VTX_OBJ: CUSTOMER, PRODUCTS, VERTICALS, DEALS
        {
            // Create a request using a URL that can receive a post.  All current Vistex channels are post methods.
            WebRequest request = WebRequest.Create(url);
            request.Credentials = GetVistexCredentials(url);
            request.Method = "POST";

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            // Convert POST data as a byte array.  
            byte[] byteArray = Encoding.UTF8.GetBytes(jsonData);
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = byteArray.Length;

            Dictionary<string, string> responseObjectDictionary = new Dictionary<string, string>();

            try
            {
                // Get the request stream, write data, then close the stream
                Stream dataStream = request.GetRequestStream();
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();

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


        public bool SaveVistexResponseData(Guid batchId, Dictionary<int, string> dealsMessages) //VTX_OBJ: DEALS
        {
            type_int_dictionary opDealMessages = new type_int_dictionary();
            opDealMessages.AddRows(dealsMessages.Select(itm => new Opaque.Tools.OpPair<int, string>
            {
                First = itm.Key,
                Second = itm.Value
            }));

            var cmd = new Procs.dbo.PR_MYDL_STG_OUTB_BTCH_STS_CHG()
            {
                in_btch_id = batchId,
                in_rqst_sts = "PO_Processing_Complete", // Default close the 
                in_deal_rspn_err = opDealMessages
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    //Just save the data and move on - only error will report back below
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                return false;
                //throw;
            }

            return true;
        }


        #region Helper Functions
        public void OnException(Exception e)
        {
            // print the connection exception status
            OpLogPerf.Log("VISTEX - Connection Exception: " + e.Message);
        }

        public CredentialCache GetVistexCredentials(string url)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3;
            CredentialCache credentialCache = new CredentialCache();
            credentialCache.Add(new System.Uri(url), "Basic", new NetworkCredential(ConfigurationManager.AppSettings["vistexUID"],
                StringEncrypter.StringDecrypt(ConfigurationManager.AppSettings["vistexPWD"] != string.Empty ? ConfigurationManager.AppSettings["vistexPWD"] : "", "Vistex_Password")));
            return credentialCache;
        }

        private string ModifyURLForCertIgnore(string url)
        {
            string certIgnoreSuffix = "?transport.acceptInvalidBrokerCert=true";
            string modifiedURL = "";
            if (!String.IsNullOrEmpty(url))
            {
                if (url.ToLower().Contains("ssl://"))
                {
                    if (url.ToLower().Contains("failover"))
                    {
                        String serversCSVList = url.Substring(url.IndexOf('('));
                        serversCSVList = serversCSVList.Substring(1, serversCSVList.Length - 2);
                        String[] servers = serversCSVList.Split(',');

                        modifiedURL = "failover:(";
                        foreach (String server in servers)
                        {
                            modifiedURL += server + certIgnoreSuffix + ",";
                        }
                        if (modifiedURL.LastIndexOf(',') == modifiedURL.Length - 1)
                            modifiedURL = modifiedURL.Substring(0, modifiedURL.Length - 1);

                        modifiedURL += ")";
                    }
                    else
                    {
                        //only one server name
                        modifiedURL = url.Insert(url.Length, certIgnoreSuffix);
                    }
                }
                else
                    modifiedURL = url;
            }
            else
            {
                throw new Exception("URI is empty");
            }

            return modifiedURL;
        }
        #endregion Private Helpers

    }
}
