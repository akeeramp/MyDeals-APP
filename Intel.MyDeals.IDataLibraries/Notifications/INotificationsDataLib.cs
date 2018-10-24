using System.Collections.Generic;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface INotificationsDataLib
    {
        IList<UserSubscribedNotification> GetUserSubscriptions(int wwid);

        bool UpdateUserSubscriptions(IList<NotificationSubscriptions> notificationSubscriptions);

        IList<Notification> GetNotifications(string mode);

        bool ManageNotifications(string mode, bool isRead, IList<int> notificationIds);

        int GetUnreadNotificationCount();

        bool CreateNotificationLog(IList<NotificationLog> logs, int wwid);

        List<NotificationEmailTable> GetNotificationEmails(List<int> ids);

        Task SendPayLoadToMsgCenter(NotificationEvents notfEvent, MessageCenterPayload payload);

        bool UpdateNotificationEmails(List<int> ids);
    }
}