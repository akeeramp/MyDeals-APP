extern alias opaqueTools;
using Apache.NMS;
using Apache.NMS.ActiveMQ;
using System;
using System.Collections.Generic;
using System.Data;
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
    public class JmsDataLib : IJmsDataLib
    {
        private string _mIdsid;
        private string jmsServer;
        private string jmsQueue;
        private string jmsUID;
        private Dictionary<string, string> jmsEnvs;

        private IConnection _connection;
        private ISession _session;
        private IQueue _destination;

        // This is all communications to our DB as well as SAP
        public JmsDataLib()
        {
            // In case we need it on errors and no token
            //_mIdsid = OpUserStack.MyOpUserToken == null? "dmyGA" : OpUserStack.MyOpUserToken.Usr.Idsid;
            _mIdsid = OpUserStack.MyOpUserToken.Usr.Idsid;

            jmsEnvs = DataLibrary.GetEnvConfigs();
            jmsServer = jmsEnvs.ContainsKey("jmsServer") ? jmsEnvs["jmsServer"] : "";
            jmsQueue = jmsEnvs.ContainsKey("jmsQueue") ? jmsEnvs["jmsQueue"] : "";
            jmsUID = jmsEnvs.ContainsKey("jmsUID") ? jmsEnvs["jmsUID"] : "";
        }

        /// <summary>
        /// Checks if the previous run is completed
        /// </summary>
        /// <param name="jobType">The job type</param>
        public void CheckPreviousRunNotComplete(char jobType)
        {
            OpLog.Log("JMS - CheckPreviousRunNotComplete");
            try
            {
                DataAccess.ExecuteNonQuery(new Procs.dbo.PR_MYDL_SAP_CHK_PENDING_JMS_DATA
                {
                    btch_upload_type = jobType.ToString()
                });
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
        }

        /// <summary>
        /// Creates the pricing records
        /// </summary>
        /// <param name="jobType">The job type</param>
        /// <returns>The pricing records data table</returns>
        public DataTable CreatePricingRecords(char jobType)
        {
            OpLog.Log("JMS - CreatePricingRecords");
            try
            {
                return DataAccess.ExecuteDataTable(new Procs.dbo.PR_MYDL_SAP_INS_JMS_DATA
                {
                    btch_upload_type = jobType.ToString()
                });
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
        }

        /// <summary>
        /// Gets the pricing records xml
        /// </summary>
        /// <param name="jmsId"></param>
        /// <param name="groupId"></param>
        /// <returns>The pricing records xml</returns>
        public string GetPricingRecordsXml(int jmsId, int groupId)
        {
            OpLog.Log("JMS - GetPricingRecordsXml");

            var xmlRecords = string.Empty;
            var cmd = new Procs.dbo.PR_MYDL_SAP_GET_RCDS_XML
            {
                jms_id = jmsId,
                group_id = groupId
            };
            try
            {
                var ret = DataAccess.ExecuteScalar(cmd);
                if (ret == null || ret == DBNull.Value)
                {
                    return String.Empty;
                }
                xmlRecords = ret.ToString();
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            if (!String.IsNullOrEmpty(xmlRecords))
            {
                xmlRecords = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + xmlRecords.Replace("dummytemp", "ns0:PricingData");
            }

            return xmlRecords;
        }

        /// <summary>
        /// Gets the Group/JMS Id Pairs
        /// </summary>
        /// <returns>First = Group Id, Second = JMS Id</returns>
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

        /// <summary>
        /// Sends the pricing records XML to JMS Queue
        /// </summary>
        /// <param name="strData">The pricing records XML</param>
        /// <returns></returns>
        public string SendDataToJmsQueue(string strData)
        {
            OpLog.Log("JMS - SendDataToJmsQueue");
            string strError = "";
            try
            {
                var data = new List<string>();
                data.Add(strData);
                Publish(jmsServer, jmsUID, jmsQueue, data);
            }
            catch (Exception ex)
            {
                strError = ex.Message;
                OpLogPerf.Log(ex);
            }
            return strError;
        }

        /// <summary>
        /// Updates records and notifies the errors
        /// </summary>
        /// <param name="errorFlag">The errorFlag</param>
        /// <param name="jobType">The jobType</param>
        /// <param name="csvFilePath">The csvFilePath</param>
        /// <param name="errorDetail">The error Detail</param>
        public void UpdateRecordStagesAndNotifyErrors(int errorFlag, char jobType, string csvFilePath, string errorDetail)
        {
            OpLog.Log("JMS - UpdateRecordStagesAndNotifyErrors");
            try
            {
                DataAccess.ExecuteNonQuery(new Procs.dbo.PR_MYDL_SAP_UPLOAD_ERR
                {
                    btch_upload_type = jobType.ToString(),
                    error_flag = errorFlag,
                    error_detail = errorDetail
                });
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
        }

        /// <summary>
        /// Inserts the Upload Errors
        /// </summary>
        /// <param name="groupLineItemPairs">The JMS Id and Group Id pairs</param>
        public void InsertUploadErrorTable(Pair<int, int>[] pair)
        {
            OpLog.Log("JMS - InsertUploadErrorTable");
            List<Exception> exes = new List<Exception>();

            try
            {
                foreach (var kvp in pair)
                {
                    try
                    {
                        DataAccess.ExecuteNonQuery(new Procs.dbo.PR_MYDL_SAP_INS_UPLD_ERR
                        {
                            jms_grp_id = kvp.First,
                            jms_grp_ln_itm_id = kvp.Second
                        });
                    }
                    catch (Exception ex)
                    {
                        exes.Add(ex);
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            if (exes != null && exes.Count > 0)
            {
                var ae = new AggregateException(exes.ToArray());
                throw ae;
            }
        }

        /// <summary>
        /// Deletes the upload errors
        /// </summary>
        public void DeleteUploadErrorTable()
        {
            OpLog.Log("JMS - DeleteUploadErrorTable");
            try
            {
                DataAccess.ExecuteNonQuery(new Procs.dbo.PR_MYDL_SAP_DEL_UPLD_ERR());
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
        }

        /// <summary>
        /// /
        /// </summary>
        /// <param name="exceptionDatetime"></param>
        /// <param name="exceptionType"></param>
        /// <param name="exceptionMessage"></param>
        /// <param name="exceptionSource"></param>
        /// <param name="exceptionStackTrace"></param>
        public void InsertExceptionData(
             DateTime exceptionDatetime,
             string exceptionType,
             string exceptionMessage,
             string exceptionSource,
             string exceptionStackTrace)
        {
            OpLog.Log("JMS - InsertExceptionData");
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_SAP_INS_ERR_LOG_JMS_Q_SENDER
                {
                    excptn_stck_trce = (String.IsNullOrEmpty(exceptionStackTrace) ? "No trace information passed" : exceptionStackTrace),
                    excptn_datetime = exceptionDatetime,
                    excptn_typ = exceptionType,
                    excptn_msg = exceptionMessage,
                    excptn_src = exceptionSource
                };
                DataAccess.ExecuteNonQuery(cmd);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
            }
        }

        public class Bearer
        {
            public string access_token { get; set; }
        }

        public bool PublishBackToSfTenders(string data)
        {
            OpLog.Log("JMS - Publish to SF Tenders");

            bool sendSuccess = false;

            // Default to Dev Response Environment, update connection if it falls to another environment.
            string url = jmsEnvs.ContainsKey("tendersResponseURL") ? jmsEnvs["tendersResponseURL"] : ""; 

            if (url == "") return false; // If no URL is defined, bail out of the send

            // APOGEE
            //string consumerKey = "client_id_value"; //"client_id_value";
            //string consumerSecret = "client_secret_value"; //“client_secret_value";
            //string accessToken;

            //byte[] byte1 = Encoding.ASCII.GetBytes("grant_type=client_credentials&client_id=" + consumerKey + "&client_secret=" + consumerSecret);
            ////Console.WriteLine(byte1);
            //HttpWebRequest bearerReq = WebRequest.Create(url) as HttpWebRequest;
            //bearerReq.Accept = "application/json";
            //bearerReq.Method = "POST";
            //bearerReq.ContentType = "application/x-www-form-urlencoded";
            //bearerReq.ContentLength = byte1.Length;
            //bearerReq.KeepAlive = false;
            //Stream newStream = bearerReq.GetRequestStream();


            //newStream.Write(byte1, 0, byte1.Length);

            //WebResponse bearerResp = bearerReq.GetResponse();

            ////Code dies in next block *FIX*
            //using (var reader = new StreamReader(bearerResp.GetResponseStream(), Encoding.UTF8))
            //{
            //    var response = reader.ReadToEnd();
            //    //Console.WriteLine(response);
            //    Bearer bearer = JsonConvert.DeserializeObject<Bearer>(response);
            //    accessToken = bearer.access_token;
            //}

            ////Console.WriteLine(accessToken);

            //HttpWebRequest APIReq = WebRequest.Create("apigee_proxy_url") as HttpWebRequest;


            //APIReq.Method = "GET";
            //APIReq.Headers.Add("Authorization", "Bearer " + accessToken);
            ////Console.WriteLine();
            //using (StreamReader responseReader = new StreamReader(APIReq.GetResponse().GetResponseStream()))
            //{
            //    string result = responseReader.ReadToEnd();
            //    int j = 0;
            //}
            // END APOGEE

            HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
            //request.Credentials = new CredentialCache(); // No auth is needed, so load a blind credential
            request.Credentials = new System.Net.NetworkCredential("myDls2SF", "f@s_dlsYmz");

            request.Method = "POST"; // Set the Method property of the request to POST.  

            request.KeepAlive = false;

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            // Create POST data and convert it to a byte array.  
            byte[] byteArray = Encoding.UTF8.GetBytes(data);

            request.ContentType = "application/json"; // "application/x-www-form-urlencoded"; // Set the ContentType property of the WebRequest.  
            request.ContentLength = byteArray.Length; // Set the ContentLength property of the WebRequest.  

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
                    //Logging
                    if (responseObjectDictionary["Data"] == "Request captured successfully") sendSuccess = true;
                    OpLog.Log("JMS - Publish to SF Tenders Completed: " + responseObjectDictionary["Data"]);
                }

                response.Close();
            }
            catch (Exception ex)
            {
                OpLogPerf.Log("JMS - Publish to SF Tenders ERROR: " + ex);
            }

            return sendSuccess;
        }

        public void Publish(string brokerURI,
                       string userName,
                       string queueName,
                       List<string> data)
        {
            OpLog.Log("JMS - Publish");
            AcknowledgementMode ackMode = AcknowledgementMode.ClientAcknowledge;
            try
            {
                if (data.Count == 0)
                {
                    throw new Exception("Error: must specify at least one message text\n");
                }

                string providerUrl = ModifyURLForCertIgnore(brokerURI);

                ConnectionFactory queueFactory = new ConnectionFactory(providerUrl);

                // create the connection
                _connection = queueFactory.CreateConnection(userName, jmsEnvs.ContainsKey("jmsPWD") ? StringEncrypter.StringDecrypt(jmsEnvs["jmsPWD"], "JMS_Password") : "");

                // set the exception listener
                _connection.ExceptionListener += new ExceptionListener(OnException);

                // create the session
                _session = _connection.CreateSession(ackMode);

                // create the destination
                _destination = _session.GetQueue(queueName);

                // create the producer
                IMessageProducer msgProducer = _session.CreateProducer(_destination);

                ITextMessage msg;

                // publish messages
                for (int i = 0; i < data.Count; i++)
                {
                    // create text message
                    msg = _session.CreateTextMessage();

                    // set message text
                    msg.Text = (String)data[i];

                    // set/modify JMS Headers
                    string correlationId = Guid.NewGuid().ToString();
                    msg.NMSCorrelationID = correlationId;
                    msg.NMSType = "Text";

                    // publish message
                    msgProducer.Send(msg);
                }

                // close the connection
                _connection.Close();
            }
            catch (Exception e)
            {
                OpLogPerf.Log(e);
                throw new Exception("Exception in SAP queue sender: " + e.Message);
            }
        }

        public void OnException(Exception e)
        {
            // print the connection exception status
            OpLogPerf.Log("JMS - Connection Exception: " + e.Message);
        }

        /// <summary>
        /// Test Connections
        /// </summary>
        /// <param name="brokerURI"></param>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <param name="queueName"></param>
        /// <param name="data"></param>
        public Dictionary<string, string> TestConnection(bool noSAP, string brokerURI,
                       string userName,
                       string queueName)
        {
            OpLog.Log("JMS - TestConnection");
            if (string.IsNullOrEmpty(brokerURI))
            {
                brokerURI = jmsServer;
                userName = jmsUID;
                queueName = jmsQueue;
            }
            if (noSAP)
            {
                return jmsEnvs;
            }
            AcknowledgementMode ackMode = AcknowledgementMode.ClientAcknowledge;
            try
            {
                string providerUrl = ModifyURLForCertIgnore(brokerURI);

                ConnectionFactory queueFactory = new ConnectionFactory(providerUrl);

                // create the connection
                _connection = queueFactory.CreateConnection(userName, jmsEnvs.ContainsKey("jmsPWD") ? StringEncrypter.StringDecrypt(jmsEnvs["jmsPWD"], "JMS_Password") : "");

                // set the exception listener
                _connection.ExceptionListener += new ExceptionListener(OnException);

                // create the session
                ISession session = _connection.CreateSession(ackMode);

                IQueue destination = session.GetQueue(queueName);

                IMessageProducer msgProducer = session.CreateProducer(destination);

                msgProducer.Close();

                session.Close();

                _connection.Close();

                return jmsEnvs;
            }
            catch (Exception ex)
            {
                _connection.Close();
                throw ex;
            }
        }

        /// <summary>
        /// Constructs the Fail over url
        /// </summary>
        /// <param name="url"></param>
        /// <returns>Failover url</returns>
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


        #region Tenders Integration Items for IQR
        public Guid SaveTendersDataToStage(string dataType, List<int> dealsList, string jsonDataPacket)
        {
            Guid myGuid = Guid.Empty;

            try
            {
                var cmd = new Procs.dbo.PR_MYDL_INS_DSA_RQST_RSPN_LOG()
                {
                    in_rqst_type = dataType,
                    in_deal_lst = new type_int_list(dealsList.ToArray()),
                    in_json_data = jsonDataPacket
                };

                using (var ret = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_RESULT = DB.GetReaderOrdinal(ret, "RESULT");

                    while (ret.Read())
                    {
                        myGuid = ret.GetFieldValue<System.Guid>(IDX_RESULT);
                    }

                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return myGuid;
        }

        public List<TenderTransferObject> FetchTendersStagedData(string dataType, Guid specificRecord)
        {
            Guid myGuid = Guid.Empty;

            // Uses TenderTransferObjects class
            List<TenderTransferObject> retData = new List<TenderTransferObject>();
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_STG_OUTB_BTCH_DATA()
                {
                    in_rqst_type = dataType
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    if (rdr != null && rdr.HasRows) // ret comes back and has success row = it ran without fail
                    {
                        int IDX_RQST_SID = DB.GetReaderOrdinal(rdr, "RQST_SID");
                        int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
                        int IDX_BTCH_ID = DB.GetReaderOrdinal(rdr, "BTCH_ID");
                        int IDX_RQST_JSON_DATA = DB.GetReaderOrdinal(rdr, "RQST_JSON_DATA");
                        int IDX_RQST_STS = DB.GetReaderOrdinal(rdr, "RQST_STS");

                        while (rdr.Read())
                        {
                            retData.Add(new TenderTransferObject
                            {
                                RqstSid = (IDX_RQST_SID < 0 || rdr.IsDBNull(IDX_RQST_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RQST_SID),
                                DealId = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                                BtchId = (IDX_BTCH_ID < 0 || rdr.IsDBNull(IDX_BTCH_ID)) ? Guid.Empty : rdr.GetFieldValue<System.Guid>(IDX_BTCH_ID),
                                RqstJsonData = (IDX_RQST_JSON_DATA < 0 || rdr.IsDBNull(IDX_RQST_JSON_DATA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_JSON_DATA),
                                RqstSts = (IDX_RQST_STS < 0 || rdr.IsDBNull(IDX_RQST_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_STS)
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            if (specificRecord != Guid.Empty) // if we open up other stages to support this, cull down to pending stage below.
            {
                // Return only the matching item
                return retData.Where(r => r.BtchId == specificRecord).ToList();
            }

            return retData;
        }

        public void UpdateTendersStage(Guid btchId, string rqstStatus) // Update the processing status of in/out bound tender data
        {
            // Add type_int_dictionary here later
            OpLog.Log("Tenders - SetTendersIOBoundStage");
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

        public List<TendersSFIDCheck> FetchDealsFromSfiDs(string salesForceIdCntrct, string salesForceIdDeal)
        {
            bool success = false;
            // TO DO: Fill in with correct passed data after verification

            var cmd = new Procs.dbo.PR_MYDL_CHECK_SF_ID()
            {
                CntrctSFID = salesForceIdCntrct,
                WipSFID = salesForceIdDeal
            };
            var ret = new List<TendersSFIDCheck>();

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_Cntrct_SF_ID = DB.GetReaderOrdinal(rdr, "Cntrct_SF_ID");
                    int IDX_Cntrct_SID = DB.GetReaderOrdinal(rdr, "Cntrct_SID");
                    int IDX_Wip_SF_ID = DB.GetReaderOrdinal(rdr, "Wip_SF_ID");
                    int IDX_Wip_SID = DB.GetReaderOrdinal(rdr, "Wip_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new TendersSFIDCheck
                        {
                            Cntrct_SF_ID = (IDX_Cntrct_SF_ID < 0 || rdr.IsDBNull(IDX_Cntrct_SF_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Cntrct_SF_ID),
                            Cntrct_SID = (IDX_Cntrct_SID < 0 || rdr.IsDBNull(IDX_Cntrct_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Cntrct_SID),
                            Wip_SF_ID = (IDX_Wip_SF_ID < 0 || rdr.IsDBNull(IDX_Wip_SF_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Wip_SF_ID),
                            Wip_SID = (IDX_Wip_SID < 0 || rdr.IsDBNull(IDX_Wip_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Wip_SID)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return ret;
        }

        public int FetchCustFromCimId(string custCimId)
        {
            int retCustId = 0;
            // TO DO: Fill in with correct passed data after verification

            var cmd = new Procs.dbo.PR_MYDL_CUST_CIM_ID_MAP_DTL()
            {
                in_cust_cim_id = custCimId
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    //int IDX_CUST_CIM_ID = DB.GetReaderOrdinal(rdr, "CUST_CIM_ID");
                    int IDX_CUST_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_NM_SID");
                    //int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");

                    while (rdr.Read())
                    {
                        retCustId = (IDX_CUST_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_NM_SID);
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return retCustId;
        }

        public ProductEpmObject FetchProdFromProcessorEpmMap(int epmId)
        {
            ProductEpmObject retObj = new ProductEpmObject();

            var cmd = new Procs.dbo.PR_MYDL_PRD_PCSR_EPM_MAP_DTL()
            {
                in_prd_epm_id = epmId
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    //int IDX_CUST_CIM_ID = DB.GetReaderOrdinal(rdr, "CUST_CIM_ID");
                    int IDX_PRD_GRP_EPM_ID = DB.GetReaderOrdinal(rdr, "PRD_GRP_EPM_ID");
                    int IDX_PCSR_NBR_SID = DB.GetReaderOrdinal(rdr, "PCSR_NBR_SID");
                    int IDX_EDW_PCSR_NBR = DB.GetReaderOrdinal(rdr, "EDW_PCSR_NBR");
                    int IDX_MYDL_PCSR_NBR = DB.GetReaderOrdinal(rdr, "MYDL_PCSR_NBR");
                    //int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");

                    while (rdr.Read())
                    {
                        retObj.PrdGrpEpmId = (IDX_PRD_GRP_EPM_ID < 0 || rdr.IsDBNull(IDX_PRD_GRP_EPM_ID))
                            ? default(System.Int32)
                            : rdr.GetFieldValue<System.Int32>(IDX_PRD_GRP_EPM_ID);
                        retObj.PcsrNbrSid = (IDX_PCSR_NBR_SID < 0 || rdr.IsDBNull(IDX_PCSR_NBR_SID))
                            ? default(System.Int32)
                            : rdr.GetFieldValue<System.Int32>(IDX_PCSR_NBR_SID);
                        retObj.EdwPcsrNbr = (IDX_EDW_PCSR_NBR < 0 || rdr.IsDBNull(IDX_EDW_PCSR_NBR))
                            ? String.Empty
                            : rdr.GetFieldValue<System.String>(IDX_EDW_PCSR_NBR);
                        retObj.MydlPcsrNbr = (IDX_MYDL_PCSR_NBR < 0 || rdr.IsDBNull(IDX_MYDL_PCSR_NBR))
                            ? String.Empty
                            : rdr.GetFieldValue<System.String>(IDX_MYDL_PCSR_NBR);
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return retObj;
        }

        #endregion Tenders Integration Items for IQR

    }
}