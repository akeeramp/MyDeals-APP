using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class TimelineLibTest
    {
        public Mock<ITimelineDataLib> mockTimelineDataLib = new Mock<ITimelineDataLib>();
        private static readonly object[] _paramLists =
        {
            new object[] {5,6,new List<int> {1}}
        };

        [Test,
            TestCaseSource("_paramLists")]

        public void GetObjTimelineDetails_Returns_NotNull(int objSid,int objTypeSid,List<int> objTypeIds)
        {
            var objTimelineData = GetObjTimelineMockData();
            mockTimelineDataLib.Setup(x => x.GetObjTimelineDetails(It.IsAny<TimelinePacket>())).Returns(objTimelineData);
            TimelinePacket timelinePacket = new TimelinePacket();
            timelinePacket.ObjSid = objSid;
            timelinePacket.ObjTypeSid = objTypeSid;
            timelinePacket.ObjTypeIds = objTypeIds;
            var result = new TimelineLib(mockTimelineDataLib.Object).GetObjTimelineDetails(timelinePacket);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        private List<TimelineItem> GetObjTimelineMockData()
        {
            var data = new List<TimelineItem> {new TimelineItem {
                    ATRB_DESC = "desc",
                    ATRB_SID = 1,
                    ATRB_VAL = "val" ,
                    CHG_EMP_WWID = 1,
                    FLAG = "flag",
                    FRST_NM = "nm",
                    HIST_EFF_FR_DTM =  new DateTime(2023, 01, 23, 20, 15, 00, 277),
                    HIST_EFF_TO_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                    LST_NM = "nm",
                    OBJ_DESC = "desc",
                    OBJ_SID = 1,
                    OBJ_TYPE_SID = 1,
                    PARNT_OBJ_SID = 1,
                    rownum = 1,
                    USR_ROLES = "role"
            }   };
            return data;
        }
    }


}
