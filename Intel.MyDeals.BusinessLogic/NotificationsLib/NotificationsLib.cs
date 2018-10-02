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

        /// <summary>
        /// GetUserSubscriptions
        /// </summary>
        /// <param name="wwid"></param>
        /// <returns></returns>
        public IList<UserSubscribedNotification> GetUserSubscriptions(int wwid)
        {
            return _notificationsDataLib.GetUserSubscriptions(wwid);
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