extern alias opaqueTools;

using Intel.MyDeals.DataLibrary;
using System;
using System.Data;
using opaqueTools.Intel.Opaque.Tools;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogic
{
    public class JmsLib : IJmsLib
    {
        private readonly IJmsDataLib _jmsDataLib;

        public JmsLib(IJmsDataLib jmsDataLib)
        {
            _jmsDataLib = jmsDataLib;
        }

        // TODO - Insert Button1 items here
        // TODO - Build XML here

        public void JmsTest()
        {
            //string m_idsid = "mhtippin";

            JmsDataLib jmsConnection = new JmsDataLib();

            //JMSQueue jmsQueue = new JMSQueue(m_strUrl, m_strUserId, m_strPassword, m_strQueueName);
            //jmsQueue.OpenQueueConnection();

            //var blah2 = jmsConnection.ReadMessages();
            //var blah = jmsConnection.GetData();
            //int j = 0;
            //string blah = jmsQueue.GetAllMessgae();

            //Send Data
            //DataTable dt = GetData();
            //string data = MakeXml(dt);

            //string errorMessages = jmsConnection.SendDataToJmsQueue(data);

            //if (errorMessages != string.Empty)
            //{
            //    MessageBox.Show("I have a fatal error - " + errorMessages);
            //}
            //else
            //{
            //    MessageBox.Show("XML seems to have been accepted.");
            //}

            //Close Connection
            //jmsConnection.CloseConnectionToJmsQueue();
        }

        /// <summary>
        /// Checks if the previous run is completed
        /// </summary>
        /// <param name="jobType">The job type</param>
        public void CheckPreviousRunNotComplete(char jobType)
        {
            _jmsDataLib.CheckPreviousRunNotComplete(jobType);
        }

        /// <summary>
        /// Creates the pricing records
        /// </summary>
        /// <param name="jobType">The job type</param>
        /// <returns>The pricing records data table</returns>
        public DataTable CreatePricingRecords(char jobType)
        {
            return _jmsDataLib.CreatePricingRecords(jobType);
        }

        /// <summary>
        /// Gets the pricing records xml
        /// </summary>
        /// <param name="jmsId"></param>
        /// <param name="groupId"></param>
        /// <returns>The pricing records xml</returns>
        public string GetPricingRecordsXml(int jmsId, int groupId)
        {
            return _jmsDataLib.GetPricingRecordsXml(jmsId, groupId);
        }

        /// <summary>
        /// Gets the Group/JMS Id Pairs
        /// </summary>
        /// <returns>First = Group Id, Second = JMS Id</returns>
        public string GetMaxGroupId()
        {
            return _jmsDataLib.GetMaxGroupId();
        }

        /// <summary>
        /// Sends the pricing record XML to JMS Queue
        /// </summary>
        /// <param name="pricingRecordXml">The pricing records XML</param>
        /// <returns>The error messages, if any</returns>
        public string SendPricingRecordsToQueue(string pricingRecords)
        {
            // TO DO : Implement logging for connection to SAP
            string errorMessages = _jmsDataLib.SendDataToJmsQueue(pricingRecords);
            return errorMessages;
        }

        /// <summary>
        /// Deletes the upload errors
        /// </summary>
        public void DeleteUploadErrorTable()
        {
            _jmsDataLib.DeleteUploadErrorTable();
        }

        /// <summary>
        /// Inserts the Upload Errors
        /// </summary>
        /// <param name="groupLineItemPairs">The JMS Id and Group Id pairs</param>
        public void InsertUploadErrorTable(Pair<int, int>[] pair)
        {
            _jmsDataLib.InsertUploadErrorTable(pair);
        }

        /// <summary>
        /// Updates records and notifes the errors
        /// </summary>
        /// <param name="errorFlag">The errorFlag</param>
        /// <param name="jobType">The jobType</param>
        /// <param name="csvFilePath">The csvFilePath</param>
        /// <param name="errorDetail">The error Detail</param>
        public void UpdateRecordStagesAndNotifyErrors(int errorFlag, char jobType, string csvFilePath, string errorDetail)
        {
            _jmsDataLib.UpdateRecordStagesAndNotifyErrors(errorFlag, jobType, csvFilePath, errorDetail);
        }

        /// <summary>
        /// Gets the Schedule Queue
        /// </summary>
        /// <returns>A pair of Schedule</returns>
        public PairList<string, int> GetJMSQSchedule()
        {
            //PairList<string, int> ret = new PairList<string, int>();

            //var sch = null;//_jmsDataLib.GetJMSQSchedule();

            //if (sch != null)
            //{
            //    ret.AddRange(sch);
            //}

            return null;
        }

        /// <summary>
        /// Retries the Schedule
        /// </summary>
        /// <param name="sched_id">The Schedule Id</param>
        public void RetryJMSQSchedule(int sched_id)
        {
        }

        // TO DO : Check if it is required.
        public void InsertExceptionData(
            DateTime exceptionDatetime,
            string exceptionType,
            string exceptionMessage,
            string exceptionSource,
            string exceptionStackTrace)
        {
            _jmsDataLib.InsertExceptionData(exceptionDatetime, exceptionType, exceptionMessage, exceptionSource, exceptionStackTrace);
        }

        public Dictionary<string, string> TestConnection(bool noSAP, string brokerURI, string userName, string queueName)
        {
            return _jmsDataLib.TestConnection(noSAP, brokerURI, userName, queueName);
        }

        public void Publish(string brokerURI, string userName, string queueName, List<string> data)
        {
            _jmsDataLib.Publish(brokerURI, userName, queueName, data);
        }
    }
}