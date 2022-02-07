using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
//using TIBCO.EMS;
using System.Net.Security;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

//using Spring.Messaging.Nms;
//using Spring.Messaging.Nms.Listener;
//using Spring.Messaging.Nms.Core;
using Apache.NMS;
using Apache.NMS.ActiveMQ;
using Apache.NMS.ActiveMQ.Commands;
using Intel.Opaque.Utilities.Server;
using System.Threading.Tasks;
using System.IO;
using System.Configuration;
using System.Threading;

namespace Intel.MyDeals.UCDService
{
    /*  -ackmode   <mode>        Message acknowledge mode. Default is AUTO.
                                Other values: DUPS_OK, CLIENT, EXPLICIT_CLIENT,
                                EXPLICIT_CLIENT_DUPS_OK and NO.
      */
    class Consumer
    {
        //Change Ackmode based on the requirement
        AcknowledgementMode ackMode = AcknowledgementMode.ClientAcknowledge;

        IConnection connection;
        ISession session;
        IQueue destination;
        IMessageConsumer msgConsumer;
        
        public void RetryRequest()
        {
           
            Task<bool> res =RetryUCDRequest();
            res.Wait();
             
        }
        public void Run(string brokerURI, string userName, string password, string queueName)
        {


            try
            {

                string providerUrl = modifyURLForCertIgnore(brokerURI);

                ConnectionFactory queueFactory = new ConnectionFactory(providerUrl);


                // create the connection
                connection = queueFactory.CreateConnection(userName,
                    StringEncrypter.StringDecrypt(password != string.Empty ? password : "", "UCD_Password"));

                // set the exception listener
                connection.ExceptionListener += new ExceptionListener(OnException);

                // create the session
                session = connection.CreateSession(ackMode);

                // create the destination
                destination = session.GetQueue(queueName);

                // create the consumer
                msgConsumer = session.CreateConsumer(destination);

                //// start the connection
                connection.Start();

                string readFromFile = ConfigurationManager.AppSettings["ReadFromFile"];
                if (readFromFile == "1")
                {
                    string text = System.IO.File.ReadAllText(@"D:\MyDeals_UCD\Logs");
                    
                    //string text = "{\"SecondaryAddress\": {\"TypeCode\": \"Shipping\",\"CountryName\": \"Japan\",\"CountryCode\": \"JPN\"},\"RequestedAccountRejectionReason\": \"\",\"RequestedAccountRejectionNotes\": \"\",\"RecordType\": \"Intel Account\",\"PrimaryAddress\": {\"TypeCode\": \"Billing\",\"CountryName\": \"Japan\",\"CountryCode\": \"JPN\"},\"ParentAccount\": {\"BusinessPartyIdentifier\": \"1000674960\",\"AccountName\": \"Jupiter Network limited\",\"AccountId\": \"0012i00000cit60AAA\"},\"MasteredSimplifiedAccountName\": \"Jupiter Network limited\",\"MasteredBusinessPhysicalAddress\": {\"CountryName\": \"Japan\",\"CountryCode\": \"\"},\"CustomerProcessEngagement\": [{\"Name\": \"Direct Price Exception\",\"Code\": \"DIR_PRC_EXCPT\"}],\"CustomerAggregationType\": {\"Name\": \"Unified Country Customer\",\"Code\": \"UNFD_CTRY_CUST\"},\"ComplianceWatchList\": [{\"Name\": \"No Sanction or Embargo\",\"Code\": \"NOSNCTN\"}],\"BusinessPartyIdentifier\": \"1000675018\",\"AccountName\": \"Jupiter Network limited\",\"AccountId\": \"0012i00000cix0vAAA\"}";
                   
                    sendAMCResponse(text);
                }
                else
                {
                    while (true)
                    {
                        //IMessage message = msgConsumer.Receive() as IMessage;
                        //Receives the next message if one is  immediately available at the client side, else return null.
                        IMessage message = msgConsumer.Receive(new TimeSpan(0, 0, 1, 0, 0)) as IMessage;

                        if (message == null)
                        {
                            Disconnect();
                            return;
                        }
                        else
                        {
                            if (message is ITextMessage)
                            {
                                ITextMessage tm = (ITextMessage)message;
                                sendAMCResponse(tm.Text);
                                Thread.Sleep(1000);
                                logReponseMessage(tm.Text);
                            }
                            else
                            {
                                Console.WriteLine("Received message: " + message);
                            }
                            //Needs to be un commented while deploying on the server
                            if (ackMode == AcknowledgementMode.ClientAcknowledge)
                                message.Acknowledge();
                        }
                    }
                }

            }
            catch (Exception e)
            {
                logReponseMessage("Exception in csMsgConsumer: "  + e.Message);
            }

        }

        private static async Task<string> sendAMCResponse(string response)
        {
            string result = "";
            result =await UCDDataAccessLayer.PushUcdAMQResponse(response);

            return result;
        }

        private static async Task<bool> RetryUCDRequest()
        {
            bool result = false;
            
            result = await UCDDataAccessLayer.RetryUCDRequest();

            return result;
        }


        public void OnException(Exception e)
        {
            // print the connection exception status
            Console.Error.WriteLine("Connection Exception: " + e.Message);
        }

        public void Disconnect()
        {
            connection.Close();
        }
        private string modifyURLForCertIgnore(string url)
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

        public static void logReponseMessage(string txt)
        {
            try
            {
                List<string> lstProcessFlow = new List<string>();
                string strLogPath = @"D:\MyDeals_UCD\Logs";
                //string strLogPath = @"C:\Log";
                string strLogFileName = string.Format("{0:dd_MMM_yyyy}", DateTime.Now) + ".txt";
                string strFilePath = strLogPath + (strLogPath.EndsWith("\\") ? strLogFileName : "\\" + strLogFileName);
                //if (!Directory.Exists(strLogPath))
                //{
                //    System.IO.Directory.CreateDirectory(strLogPath);

                //}
                if (!File.Exists(strFilePath))
                {
                    File.Create(strFilePath).Dispose();
                }

                lstProcessFlow.Add(txt.ToString());
                File.AppendAllLines(strFilePath, lstProcessFlow);
            }
            catch (Exception ex)
            {

            }

        }


    }
}
