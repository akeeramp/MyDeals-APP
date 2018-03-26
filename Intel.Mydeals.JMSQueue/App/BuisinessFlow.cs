using Intel.Opaque.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

//using Intel.MyDeals.JMSQueueApp.Classes;

namespace Intel.MyDeals.JMSQueueApp
{
    public partial class Program
    {
        /// <summary>
        /// JMS Queue Sender
        /// </summary>
        /// <param name="jobType"></param>
        /// <returns></returns>
        private async static Task JmsQSender(char jobType)
        {
            // Create the pricing records in the DQ database
            DebugLog("JmsQSender - Checking Not Complete");

            await DataAccessLayer.CheckPreviousRunNotComplete(jobType);  // Check previous run was completed - send mail if not.

            DebugLog("JmsQSender - Creating Pricing Records");

            var pricingRecords = await DataAccessLayer.CreatePricingRecords(jobType);  // Set up the data for this run.

            if (pricingRecords == 0)
            {
                JmsQCommon.Log("CreatePricingRecords returned null (no data to process). Aborting.");
                return;
            }

            DebugLog("Created {0} Pricing Records.  Writing to audit log file.", pricingRecords);

            // Get the number of groups created for pricing records
            DebugLog("Beginning Get Max Group ID call");
            var grp_jms_id_pairs = await DataAccessLayer.GetMaxGroupId();
            DebugLog("Completed Get Max Group ID call, found {0} group/id pairs.", grp_jms_id_pairs == null ? 0 : grp_jms_id_pairs.Count);

            // Iterate through the groups and send them one at a time to the queue
            if (grp_jms_id_pairs != null && grp_jms_id_pairs.Any())
            {
                foreach (var pp in grp_jms_id_pairs)
                {
                    JmsQCommon.Log("Sending pricing records for Group {0}, JMS ID {1}.", pp.First, pp.Second);
                    await SendPricingRecordsToQueue(pp.Second, pp.First, jobType);
                }
            }
            else
            {
                JmsQCommon.Log("There are no groups to process.  Exiting.");
            }
        }

        /// <summary>
        /// JMS queue receiver
        /// </summary>
        /// <param name="jobType"></param>
        /// <returns></returns>
        private static async Task JmsQReceiver(char jobType)
        {
            string emailErrorOutput = "";
            bool hasErrors = false;
            string csvFilePath = GetCsvFilePath(jobType);
            PairList<int, int> uploadPairs = new PairList<int, int>();

            if (_noSapMode)
            {
                JmsQCommon.Log("Running in NO SAP mode, skipping call to read SAP response file.");
            }
            else
            {
                if (String.IsNullOrEmpty(csvFilePath))
                {
                    JmsQCommon.Log("No JmsQReceiver Found. Aborting action.");
                    return;
                }

                JmsQCommon.Log("Processing JmsQReceiver file \"{0}\".", csvFilePath);

                using (StreamReader input = new StreamReader(csvFilePath))
                {
                    String inputLine;

                    // Skip over the first 8 lines to get to any error messages
                    // Save text to emailErrorOutput for email text if there are errors
                    for (int i = 0; i < 8; i++)
                    {
                        emailErrorOutput += input.ReadLine() + Environment.NewLine;
                    }

                    // Delete the Upload Error table in database in preparation for logging any errors
                    await DataAccessLayer.DeleteUploadErrorTable();

                    while ((inputLine = input.ReadLine()) != null)
                    {
                        emailErrorOutput += inputLine + Environment.NewLine;

                        try
                        {
                            if (String.IsNullOrEmpty(inputLine)) { continue; }

                            string sequenceNo = inputLine.Split(',')[0];
                            int s1;
                            int s2;

                            if (
                                !String.IsNullOrEmpty(sequenceNo)
                                && sequenceNo.Length >= 26
                                && Int32.TryParse(sequenceNo.Substring(13, 3), out s1)
                                && Int32.TryParse(sequenceNo.Substring(16, 10), out s2)
                            )
                            {
                                uploadPairs.Add(s1, s2);
                            }
                        }
                        catch (Exception ex)
                        {
                            JmsQCommon.HandleException(ex);
                        }
                    }

                    input.Close();
                }

                JmsQCommon.Log("File Closed");

                if (uploadPairs.Count > 0)
                {
                    hasErrors = true;

                    JmsQCommon.Log("JmsQReceiver Sending Errors for {0} records.", uploadPairs.Count);

                    await DataAccessLayer.InsertUploadErrorTable(uploadPairs);
                }

                await DataAccessLayer.UpdateRecordStagesAndNotifyErrors(Convert.ToInt32(hasErrors), jobType, csvFilePath, emailErrorOutput);

                if (_debugMode)
                {
                    JmsQCommon.Log(emailErrorOutput);
                }
            }
        }

        /// <summary>
        /// Send pricing records to SAP
        /// </summary>
        /// <param name="jmsId"></param>
        /// <param name="groupId"></param>
        /// <param name="jobType"></param>
        /// <returns></returns>
        protected static async Task SendPricingRecordsToQueue(int jmsId, int groupId, char jobType)
        {
            string pricingRecords = "";

            try
            {
                pricingRecords = await DataAccessLayer.GetPricingRecordsXml(jmsId, groupId);
            }
            catch (Exception ex)
            {
                JmsQCommon.HandleException(ex);
            }

            if (String.IsNullOrEmpty(pricingRecords))
            {
                JmsQCommon.Log("Pricing file is empty.  Aborting pricing upload.");
                return;
            }

            if (_debugMode)
            {
                JmsQCommon.Log("Writing Xml Batch File");
                WriteSapXmlToFile(groupId, jobType, "records: {0}" + pricingRecords);
            }

            if (_noSapMode)
            {
                JmsQCommon.Log("Running in NO SAP mode, skipping call to SAP.");
                return;
            }

            try
            {
                DebugLog(pricingRecords);
                await DataAccessLayer.SendPricingRecordsToQueue(pricingRecords);
            }
            catch (Exception ex)
            {
                JmsQCommon.HandleException(ex);
            }
        }

        protected static void WriteSapXmlToFile(int groupId, char jobType, string xmlDataString)
        {
            // Create a unique filename based on timestamp
            string filePath = Path.Combine(_jmsqConfig.FileSharePath, String.Format("SapGroup_{0}_Group_{1}__{2}.txt",
                (jobType == JobModeCode.Expire)
                    ? "Expire"
                    : "Upload",
                groupId,
                FileSystemSafeTime
                ));

            JmsQCommon.SaveXmlBatchFile(filePath, xmlDataString);
        }

        private static string GetCsvFilePath(char jobType)
        {
            string operationMode = "UPLD";
            if (jobType == 'E') operationMode = "EXP";

            // By virtue of changing timestamp, only the latest file will be selected.
            string jmsUploadDirectory = _jmsqConfig.JmsUploadDirectory;
            string csvFilePath = "";
            string checkPath = Path.Combine(jmsUploadDirectory, String.Format("DRQ_YCS2_{0}_{1}",
                operationMode,
                DateTime.Now.ToString("yyyyMMdd")
                )).ToLower();

            JmsQCommon.TryCreateFileFolder(jmsUploadDirectory);
            var root = new DirectoryInfo(jmsUploadDirectory);

            if (root.Exists)
            {
                var files = root
                    .GetFiles()
                    .Where(fi => fi.FullName.ToLower().StartsWith(checkPath))
                    .OrderByDescending(fi => fi.LastWriteTime);

                // TODO: Is this right? Should we not be getting first or break on find or something?
                foreach (var fi in files)
                {
                    csvFilePath = fi.FullName;
                    break;
                }
            }

            if (String.IsNullOrEmpty(csvFilePath))
            {
                JmsQCommon.Log("No error file found for today's date ({0}).", checkPath);
                csvFilePath = String.Empty;
            }

            return csvFilePath;
        }
    }
}