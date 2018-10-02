using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;

namespace Intel.MyDeals.DataLibrary
{
    public class NotificationsDataLib : INotificationsDataLib
    {
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
    }
}