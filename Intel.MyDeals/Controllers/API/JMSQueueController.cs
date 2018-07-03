using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque.Tools;
using Intel.Opaque.Utilities.Server;
using System;
using System.Collections.Generic;
using System.Web.Http;


namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/JMSQueue")]
    public class JMSQueueController : ApiController
    {
        private readonly IJmsLib _jmsLib;

        public JMSQueueController(IJmsLib jmsLib)
        {
            _jmsLib = jmsLib;
        }

        /// <summary>
        /// Checks if the previous run is completed
        /// </summary>
        /// <param name="jobType">The job type</param>

        [Route("CheckPreviousRunNotComplete/{jobType}")]
        [HttpGet]
        public void CheckPreviousRunNotComplete(char jobType)
        {
            _jmsLib.CheckPreviousRunNotComplete(jobType);
        }

        /// <summary>
        /// Creates the pricing records
        /// </summary>
        /// <param name="jobType">The job type</param>
        /// <returns>The pricing records data table</returns>

        [Route("CreatePricingRecords/{jobType}")]
        [HttpGet]
        public int CreatePricingRecords(char jobType)
        {
            var records = _jmsLib.CreatePricingRecords(jobType);
            return records == null ? 0 : records.Rows.Count;
        }

        /// <summary>
        /// Gets the Group/JMS Id Pairs
        /// </summary>
        /// <returns>First = Group Id, Second = JMS Id</returns>

        [Route("GetMaxGroupId")]
        public string GetMaxGroupId()
        {
            return _jmsLib.GetMaxGroupId();
        }

        /// <summary>
        /// Gets the pricing records xml
        /// </summary>
        /// <param name="jmsId">The JMS Id</param>
        /// <param name="groupId">The Group Id</param>
        /// <returns></returns>

        [Route("GetPricingRecordsXml/{jmsId}/{groupId}")]
        public string GetPricingRecordsXml(int jmsId, int groupId)
        {
            return _jmsLib.GetPricingRecordsXml(jmsId, groupId);
        }

        /// <summary>
        /// Sends the pricing record XML to JMS Queue
        /// </summary>
        /// <param name="pricingRecordXml">The pricing records XML</param>
        /// <returns>The error messages, if any</returns>

        [Route("SendPricingRecordsToQueue")]
        [HttpPost]
        public string SendPricingRecordsToQueue([FromBody]string pricingRecordXml)
        {
            return _jmsLib.SendPricingRecordsToQueue(pricingRecordXml);
        }

        /// <summary>
        /// Deletes the upload errors
        /// </summary>

        [Route("DeleteUploadErrorTable")]
        [HttpGet]
        public void DeleteUploadErrorTable()
        {
            _jmsLib.DeleteUploadErrorTable();
        }

        /// <summary>
        /// Inserts the Upload Errors
        /// </summary>
        /// <param name="groupLineItemPairs">The JMS Id and Group Id pairs</param>

        [Route("InsertUploadErrorTable")]
        [HttpPost]
        public void InsertUploadErrorTable([FromBody]PairList<int, int> groupLineItemPairs)
        {
            if (groupLineItemPairs == null || groupLineItemPairs.Count == 0)
            { return; }

            _jmsLib.InsertUploadErrorTable(groupLineItemPairs.ToArray());
        }

        /// <summary>
        /// Updates records and notifes the errors
        /// </summary>
        /// <param name="errorFlag">The errorFlag</param>
        /// <param name="jobType">The jobType</param>
        /// <param name="csvFilePath">The csvFilePath</param>
        /// <param name="errorDetail">The error Detail</param>

        [Route("UpdateRecordStagesAndNotifyErrors")]
        [HttpPost]
        public void UpdateRecordStagesAndNotifyErrors([FromBody]dynamic errorObject)
        {
            _jmsLib.UpdateRecordStagesAndNotifyErrors((int)errorObject.Flag, (char)errorObject.JobType, (string)errorObject.CsvFilePath, (string)errorObject.ErrorDetails);
        }

        [Route("InsertExceptionData")]
        [HttpPost]
        public void InsertExceptionData([FromBody] Exception ex)
        {
            _jmsLib.InsertExceptionData(DateTime.Now, ex.GetType().Name, ex.Message, ex.Source, ex.StackTrace);
        }

        /// <summary>
        /// /
        /// </summary>
        /// <param name="brokerURI"></param>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <param name="queueName"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("TestConnection/{noSAP}")]
        public Dictionary<string, string> TestConnection(bool noSAP, JMS jms)
        {
            if (jms == null) jms = new JMS();
            //return _jmsLib.TestConnection(noSAP, jms.Url, jms.UserName, jms.Password, jms.QueueName);
            return _jmsLib.TestConnection(noSAP, jms.Url, jms.UserName, jms.QueueName);
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="brokerURI"></param>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <param name="queueName"></param>
        /// <param name="data"></param>
        [HttpPost]
        [Route("Publish")]
        public void Publish(JMS jms)
        {
            _jmsLib.Publish(jms.Url, jms.UserName, jms.QueueName, jms.Message);
            //_jmsLib.Publish(jms.Url, jms.UserName, jms.Password, jms.QueueName, jms.Message);
        }

        //[HttpGet]
        //[Route("EncryptString/{password}")]
        //[Authorize]
        //public string EncryptString(string password)
        //{
        //    return StringEncrypter.StringEncrypt(password, "JMS_Password");
        //}

        //[HttpGet]
        //[Route("DecryptString/{password}")]
        //[Authorize]
        //public string DecryptString(string password)
        //{
        //    return StringEncrypter.StringDecrypt(password, "JMS_Password");
        //}

        //[HttpGet]
        //[Route("RunJMSBatch/{mode}")]
        //[Authorize]
        //public string RunJMSBatch(char mode)
        //{
        //    var fileName = string.Empty;
        //    try
        //    {
        //        var useprocess = new System.Diagnostics.Process();
        //        if (mode == 'U')
        //        {
        //            fileName = @"D:\Mydeals_JMS\\RunCommands\JMSQUploadSendandRecieve.cmd";
        //        }
        //        else if (mode == 'E')
        //        {
        //            fileName = @"D:\Mydeals_JMS\RunCommands\JMSQExpireSendandRecieve.cmd";
        //        }
        //        else
        //        {
        //            return $"Invalid mode.";
        //        }
        //        useprocess.StartInfo.FileName = fileName;
        //        useprocess.Start();
        //        return $"JMS Batch started in mode : {mode}";
        //    }
        //    catch (Exception ex)
        //    {
        //        return $"File Name : {fileName} Message :{ex.Message}";
        //    }
        //}
    }
}