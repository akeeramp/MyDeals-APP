using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

//using Intel.MyDeals.JMSQueueApp.Classes;

namespace Intel.MyDeals.JMSQueueApp
{
    public partial class Program
    {
        private static int Diagnostics(JMSQParams args, JMSQueueSettings jmsqSettings)
        {
            int ret = SuccessReturn;

            JmsQCommon.Log("Starting Diagnostics");

            try
            {
                #region Argument Checking

                JmsQCommon.Log("Checking command line args and JMS Queue settings...");
                if (args == null)
                {
                    JmsQCommon.Log("Invalid arguments.  Null.");
                    return ErrorReturn;
                }
                if (jmsqSettings == null)
                {
                    JmsQCommon.Log("Invalid JmsQueue settings.  Null.");
                    return ErrorReturn;
                }

                var vmsg = args.ValididationMessages;
                if (!String.IsNullOrEmpty(vmsg))
                {
                    JmsQCommon.Log(vmsg);
                    return ErrorReturn;
                }
                else
                {
                    JmsQCommon.Log("Command line parameters appears valid.");
                }

                var jex = jmsqSettings.AssertValid();
                if (jex != null)
                {
                    JmsQCommon.Log(jex.Message);
                    return ErrorReturn;
                }
                else
                {
                    JmsQCommon.Log("JMS Queue settings appears valid.");
                }

                #endregion Argument Checking

                #region JMS Server Settings

                JmsQCommon.Log("Attempting JMS Server Connection...");
                try
                {
                    var envDetails = DataAccessLayer.TestConnection(false).GetAwaiter().GetResult();
                    if (envDetails.ContainsKey("jmsQueue"))
                    {
                        JmsQCommon.Log("Connected to SAP! SAP diagnostic test successful, closing connection.");
                    }
                    else
                    {
                        JmsQCommon.Log("ERROR: Connection to SAP pipe failed.  One of your configuration settings is not correct (ServerUrl, UserId, Password, or QueueName), or their server is down.");
                        ret = ErrorReturn;
                    }
                }
                catch (Exception ex)
                {
                    JmsQCommon.Log(ex.ToString());
                    ret = ErrorReturn;
                }

                #endregion JMS Server Settings

                #region Logging Folder Checking

                JmsQCommon.Log("Checking Logging Folder...");
                string auditTestFile = Path.Combine(jmsqSettings.FileSharePath, "Test.txt");

                if (String.IsNullOrEmpty(jmsqSettings.FileSharePath))
                {
                    JmsQCommon.Log("Audit logging folder is missing. Ensure FileSharePath setting is correct.");
                    return ErrorReturn;
                }
                else if (!Directory.Exists(jmsqSettings.FileSharePath))
                {
                    if (!JmsQCommon.TryCreateFileFolder(auditTestFile))
                    {
                        JmsQCommon.Log("Audit logging folder is missing and could not be created. Ensure FileSharePath setting is valid: \"{0}\".", jmsqSettings.FileSharePath);
                        return ErrorReturn;
                    }
                }

                if (Directory.Exists(jmsqSettings.FileSharePath))
                {
                    try
                    {
                        File.WriteAllText(auditTestFile, "Testing connection, this file is okay to delete.");
                    }
                    catch (Exception ex)
                    {
                        JmsQCommon.Log(ex.ToString());
                        JmsQCommon.Log("Error writing to logging folder, are permissions set correctly?. Test file: \"{0}\".", auditTestFile);
                        return ErrorReturn;
                    }

                    try
                    {
                        File.Delete(auditTestFile);
                    }
                    catch (Exception ex)
                    {
                        // This is okay, there is no requirement that we can delete from this folder.
                        System.Diagnostics.Debug.WriteLine(ex);
                    }
                }

                if (ret == SuccessReturn)
                {
                    JmsQCommon.Log("Logging folder appears valid.");
                }

                #endregion Logging Folder Checking

                #region Response Folder

                JmsQCommon.Log("Checking response folder...");
                if (String.IsNullOrEmpty(jmsqSettings.JmsUploadDirectory))
                {
                    JmsQCommon.Log("Response folder setting is missing. Ensure JmsUploadDirectory setting is correct.");
                    return ErrorReturn;
                }
                if (!Directory.Exists(jmsqSettings.JmsUploadDirectory))
                {
                    JmsQCommon.Log("Response folder is missing. Ensure JmsUploadDirectory setting is valid: \"{0}\".", jmsqSettings.JmsUploadDirectory);
                    return ErrorReturn;
                }
                try
                {
                    var files = Directory.GetFiles(jmsqSettings.JmsUploadDirectory, "DRQ*.csv");
                    if (files.Length <= 0)
                    {
                        JmsQCommon.Log("No valid files found in response folder, which is unexpected. Files: \"{0}\\DRQ*.csv\".", jmsqSettings.JmsUploadDirectory);
                        ret = ErrorReturn;
                    }
                    else
                    {
                        JmsQCommon.Log("Found {0} response files.", files.Length);
                    }
                }
                catch (Exception ex)
                {
                    JmsQCommon.Log("Error accessing response folder, are permisisons correct. Folder: \"{0}\". Message: {1}", jmsqSettings.JmsUploadDirectory, ex);
                    ret = ErrorReturn;
                }

                if (ret == SuccessReturn)
                {
                    JmsQCommon.Log("Response folder appears valid.");
                }

                #endregion Response Folder

                #region ModeParseTest

                try
                {
                    if (!ModeParseTest())
                    {
                        ret = ErrorReturn;
                    }
                }
                catch (Exception ex)
                {
                    JmsQCommon.Log(ex.ToString());
                    ret = ErrorReturn;
                }

                #endregion ModeParseTest

                JmsQCommon.Log(ret == SuccessReturn
                    ? "SUCCESS: Diagnostics Completed Successfully!"
                    : "ERRORS: Diagnostics Completed with Errors!");

                return ret;
            }
            catch (Exception ex1)
            {
                JmsQCommon.Log(ex1.ToString());
            }

            return ErrorReturn;
        }

        private static bool ModeParseTest()
        {
            JmsQCommon.Log("Mode Parse Test..");

            string[] modes = new string[]
            {
                "U", // Upload Both
                "US", // Upload Send Only
                "UR", // Upload Receive Only
                "E", // Expire Both
                "ES", // Expire Send
                "ER", // Expire Receive
                "Q", // Quote Letter
                "S", // Sleep (30 sec)
                "S10", // Sleep 10 sec
                "S180", // Sleep 3 min
                "D" // Diag
            };

            JMSQParams masterParam = new JMSQParams(null)
            {
                autoMode = true,
                displayHelpOnly = false,
                debugMode = false,
                diagnosticsMode = false,
                noSAP = true,
                outputLogging = true,
                pauseOnEnd = false,
                jobDir = JobDir.UNKNOWN,
                jobMode = JobMode.UNKNOWN,
                jobType = ' ',
                sleepSeconds = 0
            };
            // Not set

            List<JMSQParams> res = new List<JMSQParams>();
            foreach (string mm in modes)
            {
                res.Add(JMSQParams.ParseMode(mm, masterParam));
            }
            if (!res.Any(p => p.jobMode == JobMode.Upload && p.jobDir == JobDir.Both))
            {
                JmsQCommon.Log("Unable to find expected parsed parameter: Upload Both");
                return false;
            }
            if (!res.Any(p => p.jobMode == JobMode.Upload && p.jobDir == JobDir.Sender))
            {
                JmsQCommon.Log("Unable to find expected parsed parameter: Upload Sender");
                return false;
            }
            if (!res.Any(p => p.jobMode == JobMode.Upload && p.jobDir == JobDir.Receiver))
            {
                JmsQCommon.Log("Unable to find expected parsed parameter: Upload Receiver");
                return false;
            }
            if (!res.Any(p => p.jobMode == JobMode.Expire && p.jobDir == JobDir.Both))
            {
                JmsQCommon.Log("Unable to find expected parsed parameter: Expire Both");
                return false;
            }
            if (!res.Any(p => p.jobMode == JobMode.Expire && p.jobDir == JobDir.Sender))
            {
                JmsQCommon.Log("Unable to find expected parsed parameter: Expire Sender");
                return false;
            }
            if (!res.Any(p => p.jobMode == JobMode.Expire && p.jobDir == JobDir.Receiver))
            {
                JmsQCommon.Log("Unable to find expected parsed parameter: Expire Receiver");
                return false;
            }
            if (res.All(p => p.sleepSeconds != JmsQCommon.DefaultSleepSeconds))
            {
                JmsQCommon.Log("Unable to find expected parsed parameter: Sleep (Default)");
                return false;
            }
            if (res.All(p => p.sleepSeconds != 10))
            {
                JmsQCommon.Log("Unable to find expected parsed parameter: Sleep 10");
                return false;
            }
            if (res.All(p => p.sleepSeconds != 180))
            {
                JmsQCommon.Log("Unable to find expected parsed parameter: Sleep 180");
                return false;
            }

            JmsQCommon.Log("Mode Parse Test Completed Successfully.");

            return true;
        }
    }
}