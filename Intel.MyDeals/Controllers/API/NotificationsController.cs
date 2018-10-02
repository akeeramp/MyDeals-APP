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
    }
}