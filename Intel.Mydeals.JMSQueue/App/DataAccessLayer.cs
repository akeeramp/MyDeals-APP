using System;
using Intel.Opaque.Tools;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace Intel.MyDeals.JMSQueueApp
{
    /// <summary>
    ///  Data access for the JMS Quee
    /// </summary>
    public class DataAccessLayer
    {
        private static string jmsAPIbaseUrl = JmsQCommon.GetAppSetting("MyDealsService");
        private static string jmsController = "/api/JMSQueue/";

        /// <summary>
        /// Get HttpClient
        /// </summary>
        private static HttpClient MyDealsClient
        {
            get
            {
                HttpClientHandler handler = new HttpClientHandler();
                handler.UseDefaultCredentials = true;
                HttpClient client = new HttpClient(handler);
                client.BaseAddress = new Uri(jmsAPIbaseUrl);
                client.Timeout = TimeSpan.FromMinutes(6);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                return client;
            }
        }

        /// <summary>
        /// Insert exception data
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public static async Task InsertExceptionData(Exception ex)
        {
            try
            {
                JmsQCommon.Log("InsertExceptionData");

                JmsQCommon.Log(@"
-- EXCEPTION -----------------------------------------------------------------------------
{0} @ {1}:
{2}
{3}
------------------------------------------------------------------------------------------
",
                    ex.GetType().Name,
                    ex.Message,
                    ex.Source,
                    ex.StackTrace
                    );

                var pricingRecordsUrl = jmsController + "InsertExceptionData";
                await MyDealsClient.PostAsJsonAsync(pricingRecordsUrl, ex);
            }
            catch (Exception exce)
            {
                JmsQCommon.HandleException(exce, false);
            }
        }

        /// <summary>
        /// Get pricing records
        /// </summary>
        /// <param name="jmsId"></param>
        /// <param name="groupId"></param>
        /// <returns></returns>
        public static async Task<string> GetPricingRecordsXml(int jmsId, int groupId)
        {
            var xmlRecords = string.Empty;
            try
            {
                JmsQCommon.Log("GetPricingRecordsXml");

                var pricingRecordsXmlUrl = jmsController + "GetPricingRecordsXml" + "/" + jmsId + "/" + groupId;
                HttpResponseMessage response = await MyDealsClient.GetAsync(pricingRecordsXmlUrl);
                if (response.IsSuccessStatusCode)
                {
                    xmlRecords = await response.Content.ReadAsStringAsync();
                }
                else
                {
                    JmsQCommon.HandleException(new Exception("GetPricingRecordsXml - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
                return xmlRecords = JsonConvert.DeserializeObject<string>(xmlRecords);
            }
            catch (Exception ex)
            {
                JmsQCommon.HandleException(ex);
            }

            return xmlRecords;
        }

        /// <summary>
        /// Get Group/JMS ID Pairs
        /// </summary>
        /// <returns>First = Group ID, Second = JMS ID</returns>
        public static async Task<PairList<int>> GetMaxGroupId()
        {
            try
            {
                JmsQCommon.Log("GetMaxGroupId");
                var pairHash = string.Empty;
                var maxGroupUrl = jmsController + "GetMaxGroupId";

                HttpResponseMessage response = await MyDealsClient.GetAsync(maxGroupUrl);
                if (response.IsSuccessStatusCode)
                {
                    pairHash = await response.Content.ReadAsAsync<string>();
                }
                else
                {
                    JmsQCommon.HandleException(new Exception("GetMaxGroupId - " + response.ReasonPhrase + " Url" + response.RequestMessage));
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
                JmsQCommon.HandleException(ex);
            }

            return new PairList<int>();
        }

        /// <summary>
        ///  Create pricing records
        /// </summary>
        /// <param name="jobType"></param>
        /// <returns></returns>
        public static async Task<int> CreatePricingRecords(char jobType)
        {
            int numberOfRecords = 0;
            try
            {
                JmsQCommon.Log("CreatePricingRecords");
                var createPricingRecords = jmsController + "CreatePricingRecords" + "/" + jobType;

                HttpResponseMessage response = await MyDealsClient.GetAsync(createPricingRecords);
                if (response.IsSuccessStatusCode)
                {
                    numberOfRecords = await response.Content.ReadAsAsync<int>();
                }
                else
                {
                    JmsQCommon.HandleException(new Exception("CreatePricingRecords - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
            }
            catch (Exception ex)
            {
                JmsQCommon.HandleException(ex);
            }

            return numberOfRecords;
        }

        /// <summary>
        /// Send pricing records to queue
        /// </summary>
        /// <param name="pricingRecordXml"></param>
        /// <returns></returns>
        public static async Task SendPricingRecordsToQueue(string pricingRecordXml)
        {
            JmsQCommon.Log("SendPricingRecordsToQueue");
            try
            {
                var pricingRecordsQueueUrl = jmsController + "SendPricingRecordsToQueue";
                HttpResponseMessage response = await MyDealsClient.PostAsJsonAsync(pricingRecordsQueueUrl, pricingRecordXml);
                if (!response.IsSuccessStatusCode)
                {
                    JmsQCommon.HandleException(new Exception("SendPricingRecordsToQueue - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
            }
            catch (Exception ex)
            {
                JmsQCommon.HandleException(ex);
            }
        }

        /// <summary>
        /// Check previous Run not complete
        /// </summary>
        /// <param name="jobType"></param>
        /// <returns></returns>
        public static async Task CheckPreviousRunNotComplete(char jobType)
        {
            try
            {
                JmsQCommon.Log("CheckPreviousRunNotComplete");
                HttpResponseMessage response = await MyDealsClient.GetAsync(jmsController + "CheckPreviousRunNotComplete" + "/" + jobType);
                if (!response.IsSuccessStatusCode)
                {
                    JmsQCommon.HandleException(new Exception("CheckPreviousRunNotComplete - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
            }
            catch (Exception ex)
            {
                JmsQCommon.HandleException(ex);
            }
        }

        /// <summary>
        /// Delete Upload error table
        /// </summary>
        /// <returns></returns>
        public static async Task DeleteUploadErrorTable()
        {
            try
            {
                JmsQCommon.Log("DeleteUploadErrorTable");
                HttpResponseMessage response = await MyDealsClient.GetAsync(jmsController + "DeleteUploadErrorTable");
                if (!response.IsSuccessStatusCode)
                {
                    JmsQCommon.HandleException(new Exception("DeleteUploadErrorTable - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
            }
            catch (Exception ex)
            {
                JmsQCommon.HandleException(ex);
            }
        }

        /// <summary>
        ///Insert error table
        /// </summary>
        /// <param name="groupLineItemPairs"></param>
        /// <returns></returns>
        public static async Task InsertUploadErrorTable(PairList<int, int> groupLineItemPairs)
        {
            if (groupLineItemPairs == null || groupLineItemPairs.Count == 0) { return; }

            try
            {
                JmsQCommon.Log("InsertUploadErrorTable");
                HttpResponseMessage response = await MyDealsClient.PostAsJsonAsync(jmsController + "InsertUploadErrorTable", groupLineItemPairs);
                if (!response.IsSuccessStatusCode)
                {
                    JmsQCommon.HandleException(new Exception("InsertUploadErrorTable - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
            }
            catch (Exception ex)
            {
                JmsQCommon.HandleException(ex);
            }
        }

        /// <summary>
        /// Update and notify errors
        /// </summary>
        /// <param name="errorFlag"></param>
        /// <param name="jobType"></param>
        /// <param name="csvFilePath"></param>
        /// <param name="erroDetails"></param>
        /// <returns></returns>
        public static async Task UpdateRecordStagesAndNotifyErrors(int errorFlag, char jobType, string csvFilePath, string erroDetails)
        {
            try
            {
                var errorObjct = new JMSNotification() { Flag = errorFlag, JobType = jobType, CsvFilePath = csvFilePath, ErrorDetails = erroDetails };

                JmsQCommon.Log("UpdateRecordStagesAndNotifyErrors");
                HttpResponseMessage response = await MyDealsClient.PostAsJsonAsync(jmsController + "UpdateRecordStagesAndNotifyErrors", errorObjct);
                if (!response.IsSuccessStatusCode)
                {
                    JmsQCommon.HandleException(new Exception("UpdateRecordStagesAndNotifyErrors - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
            }
            catch (Exception ex)
            {
                JmsQCommon.HandleException(ex);
            }
        }

        /// <summary>
        ///
        /// </summary>
        /// <returns></returns>
        public static async Task<Dictionary<string, string>> TestConnection(bool noSAP = true)
        {
            var envDetails = new Dictionary<string, string>();
            try
            {
                JmsQCommon.Log("TestConnection");
                var testConnectionUrl = jmsController + "TestConnection/" + noSAP.ToString() + "/";
                HttpResponseMessage response = await MyDealsClient.PostAsync(testConnectionUrl, null);
                if (response.IsSuccessStatusCode)
                {
                    envDetails = await response.Content.ReadAsAsync<Dictionary<string, string>>();
                }
                else
                {
                    JmsQCommon.HandleException(new Exception("TestConnection - " + response.ReasonPhrase + " Url" + response.RequestMessage));
                }
            }
            catch (Exception ex)
            {
                JmsQCommon.HandleException(ex);
            }

            return envDetails;
        }
    }
}