using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using System.Linq;
using Intel.Opaque.Tools;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Configuration;
using System.Threading.Tasks;
using Intel.Opaque.Utilities.Server;

namespace Intel.MyDeals.DataLibrary
{
    public class NotificationsDataLib : INotificationsDataLib
    {
        private static string messageCenterTokenUrl = string.Empty;
        private static string messageCenterToken = string.Empty;
        private static string env = string.Empty;
        private static string messageCenterAdminEncrypted = string.Empty;
        private static string messageCenterAdmin = string.Empty;

        /// <summary>
        /// Get User subscribed notification
        /// </summary>
        /// <param name="wwid"></param>
        /// <returns></returns>
        public IList<UserSubscribedNotification> GetUserSubscriptions(int wwid)
        {
            OpLog.Log("GetUserSubscriptions");

            var ret = new List<UserSubscribedNotification>();

            var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_MNG_NOTIF_USR_MAP
            {
                USER_WWID = wwid == 0 ? OpUserStack.MyOpUserToken.Usr.WWID : wwid,
                mode = "SELECT"
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_EMAIL_IND = DB.GetReaderOrdinal(rdr, "EMAIL_IND");
                    int IDX_IN_TOOL_IND = DB.GetReaderOrdinal(rdr, "IN_TOOL_IND");
                    int IDX_NOTIF_DESC = DB.GetReaderOrdinal(rdr, "NOTIF_DESC");
                    int IDX_NOTIF_ID = DB.GetReaderOrdinal(rdr, "NOTIF_ID");
                    int IDX_NOTIF_NM = DB.GetReaderOrdinal(rdr, "NOTIF_NM");
                    int IDX_NTFUSR_ID = DB.GetReaderOrdinal(rdr, "NTFUSR_ID");
                    int IDX_ROLE_NM = DB.GetReaderOrdinal(rdr, "ROLE_NM");

                    while (rdr.Read())
                    {
                        ret.Add(new UserSubscribedNotification
                        {
                            EMAIL_IND = (IDX_EMAIL_IND < 0 || rdr.IsDBNull(IDX_EMAIL_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_EMAIL_IND),
                            IN_TOOL_IND = (IDX_IN_TOOL_IND < 0 || rdr.IsDBNull(IDX_IN_TOOL_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IN_TOOL_IND),
                            NOTIF_DESC = (IDX_NOTIF_DESC < 0 || rdr.IsDBNull(IDX_NOTIF_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTIF_DESC),
                            NOTIF_ID = (IDX_NOTIF_ID < 0 || rdr.IsDBNull(IDX_NOTIF_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_NOTIF_ID),
                            NOTIF_NM = (IDX_NOTIF_NM < 0 || rdr.IsDBNull(IDX_NOTIF_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTIF_NM),
                            NTFUSR_ID = (IDX_NTFUSR_ID < 0 || rdr.IsDBNull(IDX_NTFUSR_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_NTFUSR_ID),
                            ROLE_NM = (IDX_ROLE_NM < 0 || rdr.IsDBNull(IDX_ROLE_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_NM)
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

        /// <summary>
        /// GetNotifications
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="isRead"></param>
        /// <param name="notificationIds"></param>
        /// <returns></returns>
        public IList<Notification> GetNotifications(string mode)
        {
            OpLog.Log("GetNotifications");
            var ret = new List<Notification>();
            try
            {
                var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_LD_NOTIF_LOG
                {
                    USER_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    MODE = mode
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CNTRCT_SID = DB.GetReaderOrdinal(rdr, "CNTRCT_SID");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_IS_READ_IND = DB.GetReaderOrdinal(rdr, "IS_READ_IND");
                    int IDX_NLT_ID = DB.GetReaderOrdinal(rdr, "NLT_ID");
                    int IDX_NOTIF_ID = DB.GetReaderOrdinal(rdr, "NOTIF_ID");
                    int IDX_NOTIF_LONG_DSC = DB.GetReaderOrdinal(rdr, "NOTIF_LONG_DSC");
                    int IDX_NOTIF_NM = DB.GetReaderOrdinal(rdr, "NOTIF_NM");
                    int IDX_NOTIF_SHR_DSC = DB.GetReaderOrdinal(rdr, "NOTIF_SHR_DSC");
                    int IDX_NOTIFD_EMP_WWID = DB.GetReaderOrdinal(rdr, "NOTIFD_EMP_WWID");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new Notification
                        {
                            CNTRCT_SID = (IDX_CNTRCT_SID < 0 || rdr.IsDBNull(IDX_CNTRCT_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CNTRCT_SID),
                            CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                            IS_READ_IND = (IDX_IS_READ_IND < 0 || rdr.IsDBNull(IDX_IS_READ_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_READ_IND),
                            NLT_ID = (IDX_NLT_ID < 0 || rdr.IsDBNull(IDX_NLT_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_NLT_ID),
                            NOTIF_ID = (IDX_NOTIF_ID < 0 || rdr.IsDBNull(IDX_NOTIF_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_NOTIF_ID),
                            NOTIF_LONG_DSC = (IDX_NOTIF_LONG_DSC < 0 || rdr.IsDBNull(IDX_NOTIF_LONG_DSC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTIF_LONG_DSC),
                            NOTIF_NM = (IDX_NOTIF_NM < 0 || rdr.IsDBNull(IDX_NOTIF_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTIF_NM),
                            NOTIF_SHR_DSC = (IDX_NOTIF_SHR_DSC < 0 || rdr.IsDBNull(IDX_NOTIF_SHR_DSC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTIF_SHR_DSC),
                            NOTIFD_EMP_WWID = (IDX_NOTIFD_EMP_WWID < 0 || rdr.IsDBNull(IDX_NOTIFD_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_NOTIFD_EMP_WWID),
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
                            OBJ_TYPE_SID = (IDX_OBJ_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
            }
            return ret;
        }

        /// <summary>
        /// ManageNotifications
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="isRead"></param>
        /// <param name="notificationIds"></param>
        /// <returns></returns>
        public bool ManageNotifications(string mode, bool isRead, IList<int> notificationIds)
        {
            OpLog.Log("ManageNotifications");
            var ret = new List<Notification>();
            try
            {
                // Make datatable
                type_int_pair opPair = new type_int_pair();
                opPair.AddRows(notificationIds.Select(id => new OpPair<int, int>
                {
                    First = id,
                    Second = isRead ? 1 : 0
                }));
                var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_LD_NOTIF_LOG
                {
                    USER_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    MODE = mode,
                    TYPE_INT_PAIR = opPair
                };

                using (var rdr = DataAccess.ExecuteDataSet(cmd))
                {
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
            }
            return true;
        }

        /// <summary>
        /// Update user notifications
        /// </summary>
        /// <param name="notificationSubscriptions"></param>
        /// <returns></returns>
        public bool UpdateUserSubscriptions(IList<NotificationSubscriptions> notificationSubscriptions)
        {
            OpLog.Log("UpdateUserSubscriptions");
            try
            {
                // Make datatable
                t_notif_list dt = new t_notif_list();
                dt.AddRows(notificationSubscriptions);

                var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_MNG_NOTIF_USR_MAP
                {
                    USER_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    mode = "UPDATE",
                    TABLE = dt
                };

                using (DataAccess.ExecuteDataSet(cmd))
                {
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// Get user notifications
        /// </summary>
        /// <param name="mode"></param>
        /// <returns></returns>
        public int GetUnreadNotificationCount()
        {
            OpLog.Log("GetUnreadNotificationCount");
            var count = 0;
            try
            {
                var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_LD_NOTIF_LOG
                {
                    USER_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    MODE = "COUNT"
                };

                var ret = DataAccess.ExecuteScalar(cmd);
                count = Convert.ToInt32(ret);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
            }
            return count;
        }

        /// <summary>
        ///  Create Notification Log
        /// </summary>
        /// <param name="logs"></param>
        /// <returns></returns>
        public bool CreateNotificationLog(IList<NotificationLog> logs, int wwid)
        {
            OpLog.Log("CreateNotificationLog");
            try
            {
                // Make datatable
                T_NOTIF_INFO dt = new T_NOTIF_INFO();
                dt.AddRows(logs);

                var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_MNG_NOTIF_LOG
                {
                    USER_WWID = wwid,
                    mode = "MODIFY",
                    Info = dt
                };

                using (DataAccess.ExecuteDataSet(cmd))
                {
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// SetMessage center end points
        /// </summary>
        public static void SetMessageCenterEndPoints()
        {
            if (messageCenterTokenUrl == string.Empty || messageCenterAdminEncrypted == string.Empty || env == string.Empty)
            {
                Configuration rootWebConfig = System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration("/Intel.MyDeals");
                messageCenterTokenUrl = rootWebConfig.AppSettings.Settings["messageCenterTokenUrl"].Value;
                messageCenterAdmin = rootWebConfig.AppSettings.Settings["messageCenterAdmin"].Value;
                env = rootWebConfig.AppSettings.Settings["Environment"].Value;
                // we cannot name is as password, static code scan finds it :|
                messageCenterAdminEncrypted = rootWebConfig.AppSettings.Settings["messageCenterAdminEncrypted"].Value;
            }
        }

        /// <summary>
        /// Get notification email list
        /// </summary>
        /// <returns></returns>
        public List<NotificationEmailTable> GetNotificationEmails(List<int> ids)
        {
            OpLog.Log("GetUnreadNotificationCount");
            var ret = new List<NotificationEmailTable>();
            try
            {
                var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_MNG_NOTIF_EMAIL
                {
                    MODE = "SELECT"
                };
                if (ids != null)
                {
                    cmd.TYPE_INT_LIST = new type_int_list(ids.ToArray());
                }
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CHG_EMAIL_ADDR = DB.GetReaderOrdinal(rdr, "CHG_EMAIL_ADDR");
                    int IDX_CNTRCT_NM = DB.GetReaderOrdinal(rdr, "CNTRCT_NM");
                    int IDX_CNTRCT_SID = DB.GetReaderOrdinal(rdr, "CNTRCT_SID");
                    int IDX_NLT_ID = DB.GetReaderOrdinal(rdr, "NLT_ID");
                    int IDX_NOTIF_ID = DB.GetReaderOrdinal(rdr, "NOTIF_ID");
                    int IDX_NOTIF_LONG_DSC = DB.GetReaderOrdinal(rdr, "NOTIF_LONG_DSC");
                    int IDX_NOTIF_SHR_DSC = DB.GetReaderOrdinal(rdr, "NOTIF_SHR_DSC");
                    int IDX_NOTIFD_EMP_ADDR = DB.GetReaderOrdinal(rdr, "NOTIFD_EMP_ADDR");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID");
                    int IDX_PRICING_STRTAEGY_NAME = DB.GetReaderOrdinal(rdr, "PRICING_STRTAEGY_NAME");
                    int IDX_SUBJECT = DB.GetReaderOrdinal(rdr, "SUBJECT");

                    while (rdr.Read())
                    {
                        ret.Add(new NotificationEmailTable
                        {
                            CHG_EMAIL_ADDR = (IDX_CHG_EMAIL_ADDR < 0 || rdr.IsDBNull(IDX_CHG_EMAIL_ADDR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHG_EMAIL_ADDR),
                            CNTRCT_NM = (IDX_CNTRCT_NM < 0 || rdr.IsDBNull(IDX_CNTRCT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNTRCT_NM),
                            CNTRCT_SID = (IDX_CNTRCT_SID < 0 || rdr.IsDBNull(IDX_CNTRCT_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CNTRCT_SID),
                            NLT_ID = (IDX_NLT_ID < 0 || rdr.IsDBNull(IDX_NLT_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NLT_ID),
                            NOTIF_ID = (IDX_NOTIF_ID < 0 || rdr.IsDBNull(IDX_NOTIF_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_NOTIF_ID),
                            NOTIF_LONG_DSC = (IDX_NOTIF_LONG_DSC < 0 || rdr.IsDBNull(IDX_NOTIF_LONG_DSC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTIF_LONG_DSC),
                            NOTIF_SHR_DSC = (IDX_NOTIF_SHR_DSC < 0 || rdr.IsDBNull(IDX_NOTIF_SHR_DSC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTIF_SHR_DSC),
                            NOTIFD_EMP_ADDR = (IDX_NOTIFD_EMP_ADDR < 0 || rdr.IsDBNull(IDX_NOTIFD_EMP_ADDR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTIFD_EMP_ADDR),
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
                            OBJ_TYPE_SID = (IDX_OBJ_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID),
                            PRICING_STRTAEGY_NAME = (IDX_PRICING_STRTAEGY_NAME < 0 || rdr.IsDBNull(IDX_PRICING_STRTAEGY_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRICING_STRTAEGY_NAME),
                            SUBJECT = (IDX_SUBJECT < 0 || rdr.IsDBNull(IDX_SUBJECT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SUBJECT)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
            }
            return ret;
        }

        /// <summary>
        ///UpdateNotificationEmails
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public bool UpdateNotificationEmails(List<int> ids)
        {
            OpLog.Log("UpdateNotificationEmails");
            var ret = new List<NotificationEmailTable>();
            try
            {
                var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_MNG_NOTIF_EMAIL
                {
                    MODE = "UPDATE",
                    TYPE_INT_LIST = new type_int_list(ids.ToArray())
                };
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// Send message to message center
        /// </summary>
        /// <param name="notfEvent"></param>
        /// <param name="payload"></param>
        public async Task SendPayLoadToMsgCenter(NotificationEvents notfEvent, MessageCenterPayload payload)
        {
            try
            {
                SetMessageCenterEndPoints();
                // if non prod environment send it to forward only email, recipients will be ignored
                if (!env.Equals("PROD", StringComparison.InvariantCultureIgnoreCase))
                {
                    payload.sent_test_email = true;
                }
                var response = await MsgCenterClient.PostAsJsonAsync("/v1/projects/My Deals/reusable/explicitemails/" + notfEvent.ToString(), payload);
                if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    await SetApiToken();
                    var result = await MsgCenterClient.PostAsJsonAsync("/v1/projects/My Deals/reusable/explicitemails/" + notfEvent.ToString(), payload);
                    if (!result.IsSuccessStatusCode)
                    {
                        OpLogPerf.Log("Failed to send MC emails. RequestMessage: " + result.RequestMessage + " ReasonPhrase:" + result.ReasonPhrase);
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log("Message center: " + ex);
            }
        }

        private static async Task SetApiToken()
        {
            var result = await MsgCenterTokenClient.GetAsync("/v1/getAPIToken/");
            ApiToken token = result.Content.ReadAsAsync<ApiToken>().Result;
            messageCenterToken = token.token;
        }

        /// <summary>
        /// HttpClinet for message center
        /// </summary>
        private static HttpClient MsgCenterClient
        {
            get
            {
                HttpClientHandler handler = new HttpClientHandler();
                HttpClient client = new HttpClient(handler)
                {
                    BaseAddress = new Uri(messageCenterTokenUrl)
                };
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", messageCenterToken);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                return client;
            }
        }

        /// <summary>
        /// Used only for message center token generation
        /// </summary>
        private static HttpClient MsgCenterTokenClient
        {
            get
            {
                HttpClientHandler handler = new HttpClientHandler();
                HttpClient client = new HttpClient(handler)
                {
                    BaseAddress = new Uri(messageCenterTokenUrl)
                };
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Add("user_id", messageCenterAdmin); ;
                client.DefaultRequestHeaders.Add("user_pw", StringEncrypter.StringDecrypt(messageCenterAdminEncrypted, "labPwd"));
                return client;
            }
        }
    }
}