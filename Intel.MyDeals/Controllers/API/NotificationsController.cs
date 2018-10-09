using Intel.MyDeals.Entities;
using Intel.MyDeals.Helpers;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Notifications")]
    public class NotificationsController : BaseApiController
    {
        private readonly INotificationsLib _notificationsLib;

        public NotificationsController(INotificationsLib notificationsLib)
        {
            _notificationsLib = notificationsLib;
        }

        // GET api/<controller>
        [Authorize]
        [Route("GetUserSubscriptions/{wwid:int?}")]
        public IList<UserSubscribedNotification> GetUserSubscriptions(int wwid = 0)
        {
            return SafeExecutor(() => _notificationsLib.GetUserSubscriptions(wwid)
                , "Unable to get lookup values"
            );
        }

        // GET api/<controller>
        [Authorize]
        [HttpPost]
        [AntiForgeryValidate]
        [Route("UpdateUserSubscriptions")]
        public bool UpdateUserSubscriptions([FromBody] IList<NotificationSubscriptions> notificationSubscriptions)
        {
            return SafeExecutor(() => _notificationsLib.UpdateUserSubscriptions(notificationSubscriptions)
                , "Unable to update subscription values"
            );
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="mode"></param>
        /// <returns></returns>
        [Route("GetNotification/{mode}")]
        public IList<Notification> GetNotification(string mode)
        {
            return SafeExecutor(() => _notificationsLib.GetNotifications(mode)
                , "Unable to GetNotification"
            );
        }

        /// <summary>
        /// Get unread notification count
        /// </summary>
        /// <param name="mode"></param>
        /// <returns></returns>
        [Route("GetUnreadNotificationCount")]
        public int GetUnreadNotificationCount()
        {
            return SafeExecutor(() => _notificationsLib.GetUnreadNotificationCount()
                , "Unable to Get Unread Notification Count"
            );
        }

        /// <summary>
        /// Manage Notifications
        /// </summary>
        /// <param name="mode"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost]
        [AntiForgeryValidate]
        [Route("ManageNotifications/{mode}/{isRead}")]
        public bool ManageNotifications(string mode, bool isRead, [FromBody] IList<int> notificatIds)
        {
            return SafeExecutor(() => _notificationsLib.ManageNotifications(mode, isRead, notificatIds)
                , $"Unable to {mode} notifications"
            );
        }
    }
}