using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using static Intel.MyDeals.Entities.DuplicateRequest;
using static Intel.MyDeals.Entities.EN;
using Assert = NUnit.Framework.Assert;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class DealMassUpdateLibTest
    {
        public Mock<IDealMassUpdateDataLib> mockDealMassUpdateDataLib = new Mock<IDealMassUpdateDataLib>();
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();

        private static readonly object[] _params =
        {
            new object[] { "1,2,3",1, "UPD_VAL", true}
        };

        [Test,
            TestCaseSource("_params")]
        public void UpdateMassDealAttributes_should_return_notNull(string dealIds, int  attrbSid, string updVal , bool sendVistexFlag)
        {
            List<DealMassUpdateResults> dataList = DealMassUpdateResultsMockData();
            mockDealMassUpdateDataLib.Setup(x => x.UpdateMassDealAttributes(It.IsAny<DealMassUpdateData>())).Returns(dataList);
            DealMassUpdateData data = new DealMassUpdateData
            {
                DEAL_IDS = dealIds,
                ATRB_SID = attrbSid,
                UPD_VAL = updVal,
                SEND_VSTX_FLG = sendVistexFlag
            };
            var result = new DealMassUpdateLib(mockDealMassUpdateDataLib.Object, mockDataCollectionsDataLib.Object).UpdateMassDealAttributes(data);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase(4),
             TestCase(0)]
        public void GetAttributeValues_should_return_notNull(int atrb_sid)
        {
            var data = GetAttributes(atrb_sid);
            mockDealMassUpdateDataLib.Setup(x => x.GetAttributeValues(It.IsAny<int>())).Returns(data);
            var result = new DealMassUpdateLib(mockDealMassUpdateDataLib.Object, mockDataCollectionsDataLib.Object).GetAttributeValues(atrb_sid);
            Assert.NotNull(result);
        }

        private List<DealMassUpdateResults> DealMassUpdateResultsMockData()
        {
            var data = new List<DealMassUpdateResults>
            { new DealMassUpdateResults{
                DEAL_ID = 2,
                ATRB_DESC = "ATRB_DESC",
                UPD_MSG = "UPD_MSG",
                ERR_FLAG = 0
            },
             new DealMassUpdateResults{
                DEAL_ID = 3,
                ATRB_DESC = "ATRB_DESC",
                UPD_MSG = "UPD_MSG",
                ERR_FLAG = 1
            }
            };
            return data;
        }

        private List<AttributeFeildvalues> GetAttributes(int atrb_sid)
        {
            var data = new List<AttributeFeildvalues>();
            if (atrb_sid > 0)
            {
                data.Add(new AttributeFeildvalues
                {
                    ATRB_SID = 4,
                    ATRB_VAL_TXT = "ATRB_VAL_TXT"
                });
            }
            else
            {
                data.Add(new AttributeFeildvalues
                {
                    ATRB_SID = 0,
                    ATRB_LBL = "ATRB_LBL"
                });
            }
            return data;
        }
    }
}