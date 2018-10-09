using Intel.MyDeals.IBusinessLogic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class NotificationsLib : INotificationsLib
    {
        private readonly INotificationsDataLib _notificationsDataLib;

        public NotificationsLib(INotificationsDataLib notificationsDataLib)
        {
            _notificationsDataLib = notificationsDataLib;
        }

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
    }
}