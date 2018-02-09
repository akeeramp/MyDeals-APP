using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using Intel.Opaque;
using System.Threading.Tasks;

namespace Intel.MyDeals.DataAccessLib
{
    public class DataAccess
    {
        #region Private Members

        private const string DefaultApp = "MyDeals";

        public static string ConnectionString { get; set; }
        public static string Environment { get; set; }
        public static Dictionary<string, string> EnvConfigs { get; set; }

        private static DB Instance => new DB(ConnectionString, CommandTimeout);

        public static string ConnectionDetails => Instance.ToString();

        #endregion Private Members

        #region Public Methods

        public static volatile int CurrentLoggingLevel = (int)LogLevels.Low;

        public static int CommandTimeout
        {
            get
            {
                if (_commandTimeout != null) return (int)_commandTimeout;

                const int defaultTimeout = 240;
                string strDbTo = defaultTimeout.ToString();

                // BJ 5.4: Handle missing/faulty config setting more gracefully...
                try
                {
                    strDbTo = ConfigurationManager.AppSettings["DBTimeoutValue"];
                }
                catch (Exception ex)
                {
                    OpLogPerf.Log(ex);
                    Debug.WriteLine(ex);
                }

                int outVal;
                if (string.IsNullOrEmpty(strDbTo) || !int.TryParse(strDbTo, out outVal))
                {
                    _commandTimeout = defaultTimeout;
                }
                else
                {
                    _commandTimeout = (outVal <= 0)
                        ? defaultTimeout
                        : outVal;
                }
                return (int)_commandTimeout;
            }
            set
            {
                _commandTimeout = value;
            }
        }

        private static int? _commandTimeout;

        public static void ClearCache()
        {
            _commandTimeout = null;
        }

        #endregion Public Methods

        #region Execute SP Methods

        public static SqlDataReader ExecuteReader(SP proc)
        {
            return Instance.ExecuteReader(proc);
        }

        public static Task<SqlDataReader> ExecuteReaderAsync(SP proc)
        {
            return Instance.ExecuteReaderAsync(proc);
        }

        public static object ExecuteScalar(SP proc)
        {
            return Instance.ExecuteScalar(proc);
        }

        public static int ExecuteNonQuery(SP proc)
        {
            return Instance.ExecuteNonQuery(proc);
        }

        public static DataSet ExecuteDataSet(SP proc)
        {
            return Instance.ExecuteDataSet(proc);
        }

        public static DataSet ExecuteDataSet(SP proc, int timeOut)
        {
            return Instance.ExecuteDataSet(proc, timeOut);
        }

        /// <summary>
        /// Used to get data results on a failure.
        /// </summary>
        /// <param name="proc">Command to execute</param>
        /// <param name="timeOut">Timeout</param>
        /// <param name="ds">DataSet with Data, even on error.</param>
        /// <returns>DataSet or thrown exception</returns>
        public static DataSet ExecuteDataSet(SP proc, int? timeOut, out DataSet ds)
        {
            return Instance.ExecuteDataSet(proc, timeOut, out ds);
        }

        public static DataTable ExecuteDataTable(SP proc)
        {
            return Instance.ExecuteDataTable(proc);
        }

        public static string ExecuteXML(SP proc, bool compress)
        {
            return Instance.ExecuteXML(proc, compress);
        }

        #endregion Execute SP Methods

        ///// <summary>
        ///// Write a message to the database logging tables.
        ///// </summary>
        ///// <param name="source">Source function.</param>
        ///// <param name="sMsg">Message.</param>
        //public static void LogToDataBase(string source, string sMsg)
        //{
        //    LogToDataBase(LogLevels.High, source, sMsg);
        //}

        ///// <summary>
        ///// Write a message to the database logging tables.
        ///// </summary>
        ///// <param name="currentRequestedLoggingLevel">Logging limit break even level.</param>
        ///// <param name="source">Source function.</param>
        ///// <param name="sMsg">Message.</param>
        //public static void LogToDataBase(LogLevels currentRequestedLoggingLevel, string source, string sMsg)
        //{
        //    if (CurrentLoggingLevel < (int)currentRequestedLoggingLevel)
        //    {
        //        return;
        //    }

        //    try
        //    {
        //        //var cmd = new Procs.CDMS.admin.PR_MANAGE_UI_LOGS();
        //        //cmd.mode = "Insert";
        //        //cmd.scope = 0;
        //        //cmd.msg = sMsg;
        //        //cmd.uid = Utils.ThreadUser;
        //        //cmd.sysName = Environment.MachineName;
        //        //cmd.source = source;
        //        //cmd.timeStamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.ffff");

        //        //// We want this log to be totally independant of all the other DB connectivity elements to avoid an infinite loop...
        //        //ExecuteNonQuery(cmd);
        //    }
        //    catch (Exception ex)
        //    {
        //        WriteToEventViewer("UI Logging", ex.Message, DefaultApp, EventLogEntryType.Error, DefaultApp);
        //        //throw;
        //    }
        //}

        ///// <summary>
        ///// Write an Error message to the DefaultApp event log
        ///// </summary>
        //public static void WriteToEventViewer(string callingFunction, string message)
        //{
        //    WriteToEventViewer(callingFunction, message, DefaultApp, EventLogEntryType.Error, DefaultApp);
        //}

        ///// <summary>
        ///// Write a message to the windows event log
        ///// </summary>
        //public static void WriteToEventViewer(string callingFunction, string message, string appName, EventLogEntryType eventType, string logName)
        //{
        //    OpEventLogWriter.WriteEvent(eventType, message, callingFunction, appName, logName);
        //}

        ///// <summary>
        ///// Try to handle an exception
        ///// </summary>
        ///// <param name="ex"></param>
        //public static void HandleException(Exception ex)
        //{
        //    OpLogPerf.Log(ex);

        //    try
        //    {
        //        LogToDataBase(ex.Source, ex.ToString());
        //    }
        //    catch (Exception ex1)
        //    {
        //        OpLogPerf.Log(ex1);
        //    }

        //    try
        //    {
        //        WriteToEventViewer("HandleException", ex.ToString());
        //    }
        //    catch (Exception ex1)
        //    {
        //        OpLogPerf.Log(ex1);
        //    }

        //}
    }
}