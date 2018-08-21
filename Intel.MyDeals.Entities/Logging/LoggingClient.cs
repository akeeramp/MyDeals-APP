using System;
using System.Collections.Generic;
using System.Reflection;
using Intel.Opaque;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Configuration;
using System.Threading.Tasks;
using System.Diagnostics;

namespace Intel.MyDeals.Entities.Logging
{
    public class LoggingClient
    {
        private static object LOCK_OBJECT = new object();
        private static LoggingClient _InstanceOptimal = null;
        private static string _cLFUrl = string.Empty;
        private static string _cLFToken = string.Empty;
        private static string _env = string.Empty;

        private static LoggingClient Instance
        {
            get
            {
                return new LoggingClient();
            }
        }

        /// <summary>
        /// Try to get a Server-Side Instance first, if we can't, the try to get the client-side
        /// instance.  In either case, once we get one, we will cache it, which may cause some issues
        /// for mult-threaded/multi-user calls, so use carefully.
        /// </summary>
        public static LoggingClient InstanceOptimal()
        {
            return InstanceOptimal(true);
        }

        /// <summary>
        /// Try to get a Server-Side Instance first, if we can't, the try to get the client-side
        /// instance.
        /// </summary>
        /// <param name="cached">When true check to see if we have a cached instance to return, else always create new.</param>
        public static LoggingClient InstanceOptimal(bool cached)
        {
            if (_InstanceOptimal != null && cached)
            {
                return _InstanceOptimal;
            }

            try
            {
                OpLogPerf.Log("InstanceOptimal: CLIENT ACCESS MODE");

                if (cached)
                {
                    _InstanceOptimal = LoggingClient.Instance;
                }
                else
                {
                    return LoggingClient.Instance;
                }
            }
            catch (Exception ex)
            {
#if DEBUG
                System.Diagnostics.Debug.WriteLine(ex);
#endif
            }

            return _InstanceOptimal;
        }

        private static HttpClient MyDealsClient
        {
            get
            {
                HttpClientHandler handler = new HttpClientHandler();
                handler.UseDefaultCredentials = true;
                HttpClient client = new HttpClient(handler)
                {
                    BaseAddress = new Uri(MyDealsWebApiUrl.ROOT_URL)
                };
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                return client;
            }
        }

        public static void SetCLFLogs()
        {
            if (_cLFUrl == string.Empty || _cLFToken == string.Empty || _env == string.Empty)
            {
                Configuration rootWebConfig = System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration("/Intel.MyDeals");
                _cLFUrl = rootWebConfig.AppSettings.Settings["CLFUrl"].Value;
                _cLFToken = rootWebConfig.AppSettings.Settings["CLFToken"].Value;
                _env = rootWebConfig.AppSettings.Settings["Environment"].Value;
            }
        }

        /// <summary>
        /// Construct CLF client
        /// </summary>
        private static HttpClient CLFClient
        {
            get
            {
                HttpClientHandler handler = new HttpClientHandler();
                HttpClient client = new HttpClient(handler)
                {
                    BaseAddress = new Uri(_cLFUrl)
                };
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _cLFToken);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                return client;
            }
        }

        /// <summary>
        /// Upload to CLF
        /// </summary>
        /// <param name="messages"></param>
        public void UploadLogPerfLogs(IEnumerable<DbLogPerfMessage> messages)
        {
            MyDealsClient.PostAsJsonAsync(MyDealsWebApiUrl.UploadLogPerfLogs, new
            {
                Messages = OpSerializeHelper.ToJsonString(messages, true),
            });

            Task.Run(() => UploadToCLF(messages));
        }

        /// <summary>
        ///Convert DbPerfLog to CLF
        /// </summary>
        /// <param name="messages"></param>
        /// <returns></returns>
        public static List<CLFLogItem> ConvertToCLFEntity(IEnumerable<DbLogPerfMessage> messages)
        {
            SetCLFLogs();
            var clfLogItem = new List<CLFLogItem>();
            var sessionId = Guid.NewGuid().ToString();
            foreach (var message in messages)
            {
                var clf = new CLFLogItem();
                clf.DBName = "MyDeals";
                clf.StartTime = message.STRT_DTM;
                clf.EndTime = message.END_DTM;
                clf.LogCategory = message.MSG_SRC;
                clf.LogType = message.ERR_MSG ? "ERROR" : "INFO";
                clf.ServerMachineName = message.CLNT_MCHN_NM;
                clf.ServerMachineIP = message.CLNT_MCHN_NM;
                clf.MachineAccount = "rdmscdms";
                clf.SessionId = sessionId;
                clf.StepName = message.MTHD;
                clf.SchemaName = string.Empty;
                clf.StepDetail = message.MSG;
                clf.Custom = new CustomLog
                {
                    str_MyDeals_Step = message.STEP,
                    str_MyDeals_Environment = _env,
                    int_MyDeals_RecordCount = message.REC_CNT,
                    str_MyDeals_LogDateTime = DateTime.Now,
                    int_MyDeals_ThreadId = message.THRD_ID,
                    str_MyDeals_UserName = message.LGN_NM,
                };
                clfLogItem.Add(clf);
            }
            return clfLogItem;
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="messages"></param>
        public static void UploadToCLF(IEnumerable<DbLogPerfMessage> messages)
        {
            try
            {
                var clf = ConvertToCLFEntity(messages);
                // Do not log for local env
                if (_env.Equals("local", StringComparison.InvariantCultureIgnoreCase)) return;
                CLFClient.PostAsJsonAsync("/Logger/SaveLogs", clf);
            }
            catch (Exception ex)
            {
                //eat the exception if CLF is failing..
                Debug.WriteLine("CLF error " + ex.Message);
            }
        }
    }
}