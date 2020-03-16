extern alias opaqueTools;

using Apache.NMS;
using Apache.NMS.ActiveMQ;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.Entities;
using opaqueTools.Intel.Opaque.Tools;
using Intel.MyDeals.DataAccessLib;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System.Linq;
using System.Net;
using System.Net.Mime;
using System.Text;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Intel.Opaque.Utilities.Server;
using Newtonsoft.Json;

namespace Intel.MyDeals.DataLibrary
{
    public class VistexServiceDataLib : IVistexServiceDataLib
    {
        private string _mIdsid;
        private string vistexBaseURL;
        private string vistexUID;
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
        }


        public List<VistexDealOutBound> GetVistexDealOutBoundData(string packetType)
        {
            List<VistexDealOutBound> lstVistex = new List<VistexDealOutBound>();
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
                    lstVistex.Add(new VistexDealOutBound
                    {
                        VistexAttributes = (from result in JsonConvert.DeserializeObject<Dictionary<string, string>>((IDX_JSON_DATA < 0 || rdr.IsDBNull(IDX_JSON_DATA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_JSON_DATA)) select new VistexAttributes { Value = result.Value, VistexAttribute = result.Key }).ToList(),
                        DealId = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                        TransanctionId = (IDX_BTCH_ID < 0 || rdr.IsDBNull(IDX_BTCH_ID)) ? default(Guid) : rdr.GetFieldValue<Guid>(IDX_BTCH_ID)
                    });
                } // while
            }
            return lstVistex;
        }

        public void SetVistexDealOutBoundStage(Guid btchId, string rqstStatus)
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

        public Dictionary<string, string> PublishSapPo(string url)
        {
            // Create a request using a URL that can receive a post.   
            WebRequest request = WebRequest.Create(url);
            request.Credentials = GetCredentials(url);
            // Set the Method property of the request to POST.  
            request.Method = "POST";

            // Create POST data and convert it to a byte array.  
            //string json = "{\"Mydeals\": {	\"Cust_no\": \"9666\",	\"Deal_id\": \"54556\",	\"END_DT\": \"5556\",	\"GEO_COMBINED\": \"556\",	\"MRKT_SEG\": \"5556\",	\"OBJ_SET_TYPE_CD\": \"859\",	\"PAYOUT_BASED_ON\": \"88\",	\"PRODUCT_FILTER\": \"8559\",	\"START_DT\": \"899\",	\"VOLUME\": \"899\"	}}";
            string json = "{" +
                          "\"Customer\": {" +
                          "\"GDM_SLD_TO_ID\": \"23234\"," +
                          "\"SLS_ORG_CD\": \"234\"," +
                          "\"DSTRB_CHNL_CD\": \"34\"," +
                          "\"REBATE_SOLD_TO_CUSTOMER\": \"34\"," +
                          "\"REBATE_CUSTOMER_DIVISION\": \"\"," +
                          "\"GDM_HOSTED_GEO_NM\": \"\"," +
                          "\"NGRP_REV_CUST_NM\": \"\"," +
                          "\"NGRP_REV_SUBCUST_NM\": \"\"" +
                          "}" +
                          "}";

            byte[] byteArray = Encoding.UTF8.GetBytes(json);

            //Set the ContentType property of the WebRequest.
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

        public void OnException(Exception e)
        {
            // print the connection exception status
            OpLogPerf.Log("VISTEX - Connection Exception: " + e.Message);
        }

        public Dictionary<string, string> TestConnection(bool noSAP, string brokerURI,
            string userName,
            string queueName)
        {
            OpLog.Log("Vistex - TestConnection");
            if (string.IsNullOrEmpty(brokerURI))
            {
                userName = vistexUID;
            }
            if (noSAP)
            {
                return vistexEnvs;
            }
            AcknowledgementMode ackMode = AcknowledgementMode.ClientAcknowledge;
            try
            {
                string providerUrl = ModifyURLForCertIgnore(brokerURI);

                ConnectionFactory queueFactory = new ConnectionFactory(providerUrl);

                // create the connection
                connection = queueFactory.CreateConnection(userName, vistexEnvs.ContainsKey("vistexPWD") ? StringEncrypter.StringDecrypt(vistexEnvs["vistexPWD"], "JMS_Password") : "");

                // set the exception listener
                connection.ExceptionListener += new ExceptionListener(OnException);

                // create the session
                ISession session = connection.CreateSession(ackMode);

                IQueue destination = session.GetQueue(queueName);

                IMessageProducer msgProducer = session.CreateProducer(destination);

                msgProducer.Close();

                session.Close();

                connection.Close();

                return vistexEnvs;
            }
            catch (Exception ex)
            {
                connection.Close();
                throw ex;
            }
        }




        #region Private Helpers
        private static CredentialCache GetCredentials(string url)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3;
            CredentialCache credentialCache = new CredentialCache();
            credentialCache.Add(new System.Uri(url), "Basic", new NetworkCredential(ConfigurationManager.AppSettings["vistexUI"],
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

        #region TestItem
        public string GetMaxGroupId()
        {
            OpLog.Log("JMS - GetMaxGroupId");
            PairList<int> ret = new PairList<int>();

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_GET_MAX_GRP_ID_SAP_JMS_MSTR()))
                {
                    int IDX_JMS_GRP_ID = rdr.GetOrdinal("JMS_GRP_ID");
                    int IDX_JMS_ID = rdr.GetOrdinal("JMS_ID");

                    while (rdr.Read())
                    {
                        int grp_id = 0;
                        int jms_id = 0;

                        if (
                            Int32.TryParse(String.Format("{0}", rdr[IDX_JMS_GRP_ID]), out grp_id)
                            &&
                            Int32.TryParse(String.Format("{0}", rdr[IDX_JMS_ID]), out jms_id)
                        )
                        {
                            if (grp_id > 0 && jms_id > 0)
                            {
                                ret.Add(grp_id, jms_id);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return String.Join("|", ret.Select(r => String.Format("{0};{1}", r.First, r.Second)));
        }
        #endregion TestItem

    }
}
