using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class NotificationsLibTest
    {
        public Mock<INotificationsDataLib> mockNotificationsDataLib = new Mock<INotificationsDataLib>();

        private static readonly object[] GetNotificationEmailsParams =
        {
            new object[] {
                new List<int> { 1,2 }
            },
            new object[] {
                null
            }
        };

        [Test, TestCaseSource("GetNotificationEmailsParams")]
        public void GetNotificationEmails_ShouldReturnNotNull(dynamic data)
        {
            var mockData = new List<NotificationEmailTable>();
            mockNotificationsDataLib.Setup(x => x.GetNotificationEmails(It.IsAny<List<int>>())).Returns(mockData);
            var result = new NotificationsLib(mockNotificationsDataLib.Object).GetNotificationEmails(data);
            Assert.IsNotNull(result);
        }

        [Test, TestCase("Insert")]
        public void GetNotifications_ShouldReturnNotNull(string mode)
        {
            var mockData = new List<Notification>();
            mockNotificationsDataLib.Setup(x => x.GetNotifications(It.IsAny<string>())).Returns(mockData);
            var result = new NotificationsLib(mockNotificationsDataLib.Object).GetNotifications(mode);
            Assert.IsNotNull(result);
        }

        [Test]
        public void GetUnreadNotificationCount_ShouldReturnNotNull()
        {
            int count = 10;
            mockNotificationsDataLib.Setup(x => x.GetUnreadNotificationCount()).Returns(count);
            var result = new NotificationsLib(mockNotificationsDataLib.Object).GetUnreadNotificationCount();
            Assert.IsNotNull(result);
        }

        [Test, TestCase("120")]
        public void GetUserSubscriptions_ShouldReturnNotNull(int wwid)
        {
            var mockData = new List<UserSubscribedNotification>();
            mockNotificationsDataLib.Setup(x => x.GetUserSubscriptions(It.IsAny<int>())).Returns(mockData);
            var result = new NotificationsLib(mockNotificationsDataLib.Object).GetUserSubscriptions(wwid);
            Assert.IsNotNull(result);
        }

        private static readonly object[] ManageNotificationsParams =
        {
            new object[]{ "Insert", true, new List<int> () }
        };

        [Test, TestCaseSource("ManageNotificationsParams")]
        public void ManageNotifications_ShouldReturnTrue(dynamic data)
        {
            var mode = data[0];
            var isRead = data[1];
            var notificationIds = data[2];
            mockNotificationsDataLib.Setup(x => x.ManageNotifications(It.IsAny<string>(), It.IsAny<bool>(), It.IsAny<IList<int>>())).Returns(true);
            var result = new NotificationsLib(mockNotificationsDataLib.Object).ManageNotifications(mode, isRead, notificationIds);
            Assert.IsTrue(result);
        }

        private static readonly object[] UpdateUserSubscriptionsParams =
        {
            new object[]{ new List<NotificationSubscriptions>() }
        };

        [Test, TestCaseSource("UpdateUserSubscriptionsParams")]
        public void UpdateUserSubscriptions_ShouldReturnTrue(dynamic notificationSubscriptions)
        {
            mockNotificationsDataLib.Setup(x => x.UpdateUserSubscriptions(It.IsAny<IList<NotificationSubscriptions>>())).Returns(true);
            var result = new NotificationsLib(mockNotificationsDataLib.Object).UpdateUserSubscriptions(notificationSubscriptions);
            Assert.IsTrue(result);
        }        

        private static readonly object[] NotifExtendedPropXMLDeserializeParam =
        {
            new object[]{ new List<NotificationEmailTable>{
                new NotificationEmailTable
                {
                    CHG_EMAIL_ADDR = "email",
                    CNTRCT_NM = "name",
                    CNTRCT_SID = 1,
                    NOTIF_LONG_DSC = "",
                    NOTIF_SHR_DSC = "",
                    PRICING_STRTAEGY_NAME = "name",
                    SUBJECT = "",
                    EXTND_PROP = "name",
                    NLT_ID = "",
                    NOTIFD_EMP_ADDR = "address",
                    NOTIF_ID = 2,
                    OBJ_SID = 3,
                    OBJ_TYPE_SID = 4,
                }
            }
            }
        };

        [Test, TestCaseSource("NotifExtendedPropXMLDeserializeParam")]
        public void NotifExtendedPropXMLDeserialize_ShouldReturnNotNull(dynamic data)
        {
            var result = new NotificationsLib(mockNotificationsDataLib.Object).NotifExtendedPropXMLDeserialize(data);
            Assert.IsNotNull(result);
        }

        private static readonly object[] UpdateNotificationEmailsParams =
        {
            new object[]{ new List<int> { 1, 2, 3 } }
        };

        [Test, TestCaseSource("UpdateNotificationEmailsParams")]
        public void UpdateNotificationEmails_ShouldReturnTrue(List<int> ids)
        {
            mockNotificationsDataLib.Setup(x => x.UpdateNotificationEmails(It.IsAny<List<int>>())).Returns(true);
            var result = new NotificationsLib(mockNotificationsDataLib.Object).UpdateNotificationEmails(ids);
            Assert.IsTrue(result);
        }

        private static readonly object[] SendPayLoadToMsgCenterParams =
        {
            new object[]{ new NotificationEvents(), new MessageCenterPayload() }
        };

        [Test, TestCaseSource("SendPayLoadToMsgCenterParams")]
        public void SendPayLoadToMsgCenter(NotificationEvents notfEvent, MessageCenterPayload payload)
        {
            Task ret = Task.CompletedTask;
            mockNotificationsDataLib.Setup(x => x.SendPayLoadToMsgCenter(It.IsAny<NotificationEvents>(), It.IsAny<MessageCenterPayload>())).Returns(ret);
            var result = new NotificationsLib(mockNotificationsDataLib.Object).SendPayLoadToMsgCenter(notfEvent, payload);
            Assert.NotNull(result);
        }
    }
}
