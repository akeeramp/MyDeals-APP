extern alias opaqueTools;

using Apache.NMS;
using Apache.NMS.ActiveMQ;
using System;
using System.Collections.Generic;
using System.Data;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.Entities;
using opaqueTools.Intel.Opaque.Tools;
using Intel.MyDeals.DataAccessLib;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System.Linq;
using Intel.Opaque;
using Intel.Opaque.Utilities.Server;

namespace Intel.MyDeals.DataLibrary
{
    public class JmsDataLib : IJmsDataLib
    {
        private string _mIdsid;
        private string jmsServer;
        private string jmsQueue;
        private string jmsUID;
        private string jmsPWD;
        private Dictionary<string, string> jmsEnvs;

        private IConnection connection;
        private ISession session;
        private IQueue destination;

        // This is all communications to our DB as well as SAP
        public JmsDataLib()
        {
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
                connection = queueFactory.CreateConnection(userName, jmsEnvs.ContainsKey("jmsPWD") ? StringEncrypter.StringDecrypt(jmsEnvs["jmsPWD"], "JMS_Password") : "");

                // set the exception listener
                connection.ExceptionListener += new ExceptionListener(OnException);

                // create the session
                session = connection.CreateSession(ackMode);

                // create the destination
                destination = session.GetQueue(queueName);

                // create the producer
                IMessageProducer msgProducer = session.CreateProducer(destination);

                ITextMessage msg;

                // publish messages
                for (int i = 0; i < data.Count; i++)
                {
                    // create text message
                    msg = session.CreateTextMessage();

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
                connection.Close();
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
                connection = queueFactory.CreateConnection(userName, jmsEnvs.ContainsKey("jmsPWD") ? StringEncrypter.StringDecrypt(jmsEnvs["jmsPWD"], "JMS_Password") : "");

                // set the exception listener
                connection.ExceptionListener += new ExceptionListener(OnException);

                // create the session
                ISession session = connection.CreateSession(ackMode);

                IQueue destination = session.GetQueue(queueName);

                IMessageProducer msgProducer = session.CreateProducer(destination);

                msgProducer.Close();

                session.Close();

                connection.Close();

                return jmsEnvs;
            }
            catch (Exception ex)
            {
                connection.Close();
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
    }
}