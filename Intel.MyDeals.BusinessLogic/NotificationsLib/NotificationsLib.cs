using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using RazorEngine;
using RazorEngine.Templating;
using Intel.MyDeals.Entities.Logging;
using Force.DeepCloner;

namespace Intel.MyDeals.BusinessLogic
{
    public class NotificationsLib : INotificationsLib
    {
        private readonly INotificationsDataLib _notificationsDataLib;

        public NotificationsLib(INotificationsDataLib notificationsDataLib)
        {
            _notificationsDataLib = notificationsDataLib;
        }

        /// <summary>
        /// Create Notification logs
        /// </summary>
        /// <param name="logs"></param>
        /// <returns></returns>
        public bool CreateNotificationLog(IList<NotificationLog> logs, int wwid)
        {
            var result = _notificationsDataLib.CreateNotificationLog(logs, wwid);
            if (result)
            {
                // Trigger notification emails after logging into tables
                // SendEmailNotifications();
            }
            return result;
        }

        /// <summary>
        /// Get email content for notification
        /// </summary>
        /// <returns></returns>
        public List<NotificationEmailTable> GetNotificationEmails(List<int> ids = null)
        {
            return _notificationsDataLib.GetNotificationEmails(ids);
        }

        /// <summary>
        /// Get user in tool notifications
        /// </summary>
        /// <param name="mode"></param>
        /// <returns></returns>
        public IList<Notification> GetNotifications(string mode)
        {
            return _notificationsDataLib.GetNotifications(mode);
        }

        public int GetUnreadNotificationCount()
        {
            return _notificationsDataLib.GetUnreadNotificationCount();
        }

        /// <summary>
        /// GetUserSubscriptions
        /// </summary>
        /// <param name="wwid"></param>
        /// <returns></returns>
        public IList<UserSubscribedNotification> GetUserSubscriptions(int wwid)
        {
            return _notificationsDataLib.GetUserSubscriptions(wwid);
        }

        public bool ManageNotifications(string mode, bool isRead, IList<int> notificationIds)
        {
            return _notificationsDataLib.ManageNotifications(mode, isRead, notificationIds);
        }

        /// <summary>
        /// UpdateUserSubscriptions
        /// </summary>
        /// <param name="notificationSubscriptions"></param>
        /// <returns></returns>
        public bool UpdateUserSubscriptions(IList<NotificationSubscriptions> notificationSubscriptions)
        {
            return _notificationsDataLib.UpdateUserSubscriptions(notificationSubscriptions);
        }

        /// <summary>
        /// Send notification to Message center
        /// </summary>
        public async void SendEmailNotifications()
        {
            var emails = GetNotificationEmails();
            var groupNotifications = emails.GroupBy(n => new { n.NOTIF_ID, n.NOTIFD_EMP_ADDR, n.CHG_EMAIL_ADDR, n.SUBJECT })
                                    .Select(x => new NotificationEmailTable()
                                    {
                                        NOTIF_ID = x.Key.NOTIF_ID,
                                        NOTIFD_EMP_ADDR = x.Key.NOTIFD_EMP_ADDR,
                                        CHG_EMAIL_ADDR = x.Key.CHG_EMAIL_ADDR,
                                        SUBJECT = x.Key.SUBJECT
                                    }).ToList();

            foreach (var notification in groupNotifications)
            {
                var payLoad = CreateMessageCenterPayload(emails, notification);

                {
                    await SendPayLoadToMsgCenter((NotificationEvents)notification.NOTIF_ID, payLoad.DeepClone());
                }
            }

            UpdateNotificationsAsProcessed(emails);
        }

        /// <summary>
        /// Update notification emails as processed
        /// </summary>
        /// <param name="emails"></param>
        private void UpdateNotificationsAsProcessed(List<NotificationEmailTable> emails)
        {
            var nltIds = string.Join(",", emails.Select(x => x.NLT_ID).ToArray());
            List<int> idsProcessed = nltIds?.Split(',').Select(int.Parse).ToList();
            UpdateNotificationEmails(idsProcessed);
        }

        /// <summary>
        /// Creates message center payload
        /// </summary>
        /// <param name="email"></param>
        /// <param name="notification"></param>
        private MessageCenterPayload CreateMessageCenterPayload(List<NotificationEmailTable> email, NotificationEmailTable notification)
        {
            var msgPayload = new MessageCenterPayload()
            {
                recipient = notification.NOTIFD_EMP_ADDR,
                sent_test_email = false,
                payload = new List<PayLoad>()
            };

            var payLoad = new PayLoad()
            {
                Language = "English (ENG)",
                Values = new Values()
                {
                    RespondTo = notification.CHG_EMAIL_ADDR,
                    Subject = notification.SUBJECT,
                    table = GetEmailBodyTable(notification, email)
                }
            };

            msgPayload.payload.Add(payLoad);

            return msgPayload;
        }

        /// <summary>
        /// Send payload to message center
        /// </summary>
        /// <param name="notfEvent"></param>
        /// <param name="payload"></param>
        public async Task SendPayLoadToMsgCenter(NotificationEvents notfEvent, MessageCenterPayload payload)
        {
            await _notificationsDataLib.SendPayLoadToMsgCenter(notfEvent, payload);
        }

        /// <summary>
        /// Email template changes
        /// </summary>
        /// <param name="notification"></param>
        /// <param name="email"></param>
        /// <returns></returns>
        public string GetEmailBodyTable(NotificationEmailTable notification, List<NotificationEmailTable> email)
        {
            var emailTable = string.Empty;
            var model = email.Where(x => x.NOTIFD_EMP_ADDR == notification.NOTIFD_EMP_ADDR
            && x.NOTIF_ID == notification.NOTIF_ID && notification.CHG_EMAIL_ADDR == notification.CHG_EMAIL_ADDR).ToList();

            var notificationEvent = (NotificationEvents)notification.NOTIF_ID;

            switch (notificationEvent)
            {
                case NotificationEvents.SubmittedToApproved:
                case NotificationEvents.PSInPendingStage:
                    emailTable = GetContractAndPSTable(model);
                    break;

                case NotificationEvents.CapUpdateToDeal:
                case NotificationEvents.CostUpdateToDeal:
                case NotificationEvents.DealModifiedByOtherUser:
                    emailTable = GetDealAndPSTable(model);
                    break;

                case NotificationEvents.ContractPendingStage:
                    emailTable = GetContractTable(model);
                    break;

                case NotificationEvents.TenderSubmittedToOffer:
                    emailTable = GetContractAndDealTableTender(model);
                    break;

                default:
                    break;
            }

            return emailTable;
        }

        /// <summary>
        /// Get email body for single notification
        /// </summary>
        /// <param name="nltId"></param>
        /// <returns></returns>
        public string GetEmailBodyTemplateUI(int nltId)
        {
            var ids = new List<int>();
            ids.Add(nltId);
            var notifications = GetNotificationEmails(ids);
            return GetEmailBodyTable(notifications.FirstOrDefault(), notifications);
        }

        /// <summary>
        /// GetContractAndPSTable
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public string GetContractAndPSTable(List<NotificationEmailTable> email)
        {
            var url = MyDealsWebApiUrl.ROOT_URL;
            var template = "@{ var rootUrl =\"" + url + "\";}";

            // TODO: Move this to constant, tip: dont edit directly here, copy paste into .cshtml file.
            template += @"<table style='FONT-SIZE: 11pt; BORDER-COLLAPSE: collapse;font-family:Intel Clear' bordercolor='#bbbbbb' cellspacing='0' cellpadding='3' align='left' border='1'>
                                                        <tbody>
                                                            <tr>
                                                                <th style='TEXT-ALIGN: left;padding:8px;'>Contract</th>
                                                                <th style='TEXT-ALIGN: left;padding:8px;'>Strategy #</th>
                                                                <th style='TEXT-ALIGN: left;padding:8px;'>Strategy Name</th>
                                                                <th style='TEXT-ALIGN: left;padding:8px;'>Action</th>
                                                            </tr>
                                                        </tbody>
                                                        <tbody>
                                                            @foreach(var item in Model)
                                                            {
                                                                <tr>
                                                                    <td style='TEXT-ALIGN: left;padding:8px;'>@(item.CNTRCT_SID + "" : "" +item.CNTRCT_NM)</td>
                                                                    <td style='TEXT-ALIGN: left;padding:8px;'>
                                                                        <a href='@(rootUrl +""/advancedSearch#/gotoPs/"" + item.OBJ_SID)'>@item.OBJ_SID</a>*
                                                                    </td>
                                                                    <td style='TEXT-ALIGN: left;padding:8px;'>@item.PRICING_STRTAEGY_NAME</td>
                                                                    <td style='TEXT-ALIGN: left;padding:8px;'>
                                                                        <a href='@(rootUrl +""/advancedSearch#/gotoPs/"" + item.OBJ_SID)'>View Pricing Strategy</a>*
                                                                    </td>
                                                                </tr>
                                                            }
                                                        </tbody>
                                                    </table>";
            var tempKey = "ContractAndPSTable"; // Constant Name
            if (!Engine.Razor.IsTemplateCached(tempKey, typeof(List<NotificationEmailTable>)))
            {
                return Engine.Razor.RunCompile(template, tempKey, typeof(List<NotificationEmailTable>), email);
            }
            else
            {
                return Engine.Razor.Run(tempKey, typeof(List<NotificationEmailTable>), email);
            }
        }

        /// <summary>
        /// Get Contract And PSTable Tender
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public string GetContractAndDealTableTender(List<NotificationEmailTable> email)
        {
            var url = MyDealsWebApiUrl.ROOT_URL;
            var template = "@{ var rootUrl =\"" + url + "\";}";

            // TODO: Move this to constant, tip: dont edit directly here, copy paste into .cshtml file.
            template += @"<table style='FONT-SIZE: 11pt; BORDER-COLLAPSE: collapse;font-family:Intel Clear' bordercolor='#bbbbbb' cellspacing='0' cellpadding='3' align='left' border='1'>
                                                        <tbody>
                                                            <tr>
                                                                <th style='TEXT-ALIGN: left;padding:8px;'>Folio</th>
                                                                <th style='TEXT-ALIGN: left;padding:8px;'>Deal #</th>
                                                                <th style='TEXT-ALIGN: left;padding:8px;'>Action</th>
                                                            </tr>
                                                        </tbody>
                                                        <tbody>
                                                            @foreach(var item in Model)
                                                            {
                                                                <tr>
                                                                    <td style='TEXT-ALIGN: left;padding:8px;'>@(item.CNTRCT_SID + "" : "" +item.CNTRCT_NM)</td>
                                                                    <td style='TEXT-ALIGN: left;padding:8px;'>
                                                                        <a href='@(rootUrl +""/advancedSearch#/gotoDeal/"" + item.OBJ_SID)'>@item.OBJ_SID</a>*
                                                                    </td>
                                                                    <td style='TEXT-ALIGN: left;padding:8px;'>
                                                                        <a href='@(rootUrl +""/advancedSearch#/gotoDeal/"" + item.OBJ_SID)'>View Deals</a>*
                                                                    </td>
                                                                </tr>
                                                            }
                                                        </tbody>
                                                    </table>";
            var tempKey = "ContractAndDealTenderTable"; // Constant Name
            if (!Engine.Razor.IsTemplateCached(tempKey, typeof(List<NotificationEmailTable>)))
            {
                return Engine.Razor.RunCompile(template, tempKey, typeof(List<NotificationEmailTable>), email);
            }
            else
            {
                return Engine.Razor.Run(tempKey, typeof(List<NotificationEmailTable>), email);
            }
        }

        /// <summary>
        /// Get Contract And PSTable Tender
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public string GetDealAndPSTable(List<NotificationEmailTable> email)
        {
            var url = MyDealsWebApiUrl.ROOT_URL;
            var template = "@{ var rootUrl =\"" + url + "\";}";

            // TODO: Move this to constant, tip: dont edit directly here, copy paste into .cshtml file.
            template += @"<table style='FONT-SIZE: 11pt;BORDER-COLLAPSE: collapse;font-family:Intel Clear' bordercolor='#bbbbbb' cellspacing='0' cellpadding='3' align='left' border='1'>
                                                        <tbody>
                                                            <tr>
                                                                <th style='TEXT-ALIGN: left;padding:8px;'>Strategy Name</th>
                                                                <th style='TEXT-ALIGN: left;padding:8px;'>Deal #</th>
                                                                <th style='TEXT-ALIGN: left;padding:8px;'>Action</th>
                                                            </tr>
                                                        </tbody>
                                                        <tbody>
                                                            @foreach(var item in Model)
                                                            {
                                                                <tr>
                                                                    <td style='TEXT-ALIGN: left;padding:8px;'>@item.PRICING_STRTAEGY_NAME</td>
                                                                    <td style='TEXT-ALIGN: left;padding:8px;'>
                                                                        <a href='@(rootUrl +""/advancedSearch#/gotoDeal/"" + item.OBJ_SID)'>@item.OBJ_SID</a>*
                                                                    </td>
                                                                    <td style='TEXT-ALIGN: left;padding:8px;'>
                                                                        <a href='@(rootUrl +""/advancedSearch#/gotoDeal/"" + item.OBJ_SID)'>View Deals</a>*
                                                                    </td>
                                                                </tr>
                                                            }
                                                        </tbody>
                                                    </table>";
            var tempKey = "DealAndPSTable"; // Constant Name
            if (!Engine.Razor.IsTemplateCached(tempKey, typeof(List<NotificationEmailTable>)))
            {
                return Engine.Razor.RunCompile(template, tempKey, typeof(List<NotificationEmailTable>), email);
            }
            else
            {
                return Engine.Razor.Run(tempKey, typeof(List<NotificationEmailTable>), email);
            }
        }

        /// <summary>
        /// Get contract table
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public string GetContractTable(List<NotificationEmailTable> email)
        {
            var url = MyDealsWebApiUrl.ROOT_URL;
            var template = "@{ var rootUrl =\"" + url + "\";}";

            // TODO: Move this to constant, tip: dont edit directly here, copy paste into .cshtml file.
            template += @"<table style='FONT-SIZE: 11pt; BORDER-COLLAPSE: collapse;font-family:Intel Clear' bordercolor='#bbbbbb' cellspacing='0' cellpadding='3' align='left' border='1'>
                                                        <tbody>
                                                            <tr>
                                                                <th style='TEXT-ALIGN: left;padding:8px;'>Contract #</th>
                                                                <th style='TEXT-ALIGN: left;padding:8px;'>Action</th>
                                                            </tr>
                                                        </tbody>
                                                        <tbody>
                                                            @foreach(var item in Model)
                                                            {
                                                                <tr>
                                                                     <td style='TEXT-ALIGN: left;padding:8px;'>@(item.CNTRCT_SID + "" : "" +item.CNTRCT_NM)</td>
                                                                    <td style='TEXT-ALIGN: left;padding:8px;'>
                                                                        <a href='@(rootUrl +""Contract#/manager/"" + item.CNTRCT_SID)'>View Contract</a>*
                                                                    </td>
                                                                </tr>
                                                            }
                                                        </tbody>
                                                    </table>";
            var tempKey = "ContractTable"; // Constant Name
            if (!Engine.Razor.IsTemplateCached(tempKey, typeof(List<NotificationEmailTable>)))
            {
                return Engine.Razor.RunCompile(template, tempKey, typeof(List<NotificationEmailTable>), email);
            }
            else
            {
                return Engine.Razor.Run(tempKey, typeof(List<NotificationEmailTable>), email);
            }
        }

        /// <summary>
        /// Update notification emails as processed after they have been sent it MC
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public bool UpdateNotificationEmails(List<int> ids)
        {
            return _notificationsDataLib.UpdateNotificationEmails(ids);
        }
    }
}