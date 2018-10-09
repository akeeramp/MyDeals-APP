using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface INotificationsLib
    {
        IList<UserSubscribedNotification> GetUserSubscriptions(int wwid);

        bool UpdateUserSubscriptions(IList<NotificationSubscriptions> notificationSubscriptions);

        int GetUnreadNotificationCount();

        IList<Notification> GetNotifications(string mode);

        bool ManageNotifications(string mode, bool isRead, IList<int> notificationIds);
    }
}