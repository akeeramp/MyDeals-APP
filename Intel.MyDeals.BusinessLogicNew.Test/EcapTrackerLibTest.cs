using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class EcapTrackerLibTest
    {
        public Mock<IEcapTrackerDataLib> mockEcapTrackerDataLib = new Mock<IEcapTrackerDataLib>();

        private static readonly object[] _paramLists =
        {
            new object[] {new List<string> {"1","2","abc"},5}
        };

        [Test,
            TestCaseSource("_paramLists")]
        public void GetDealDetailsBasedOnTrackerNumbers_Returns_NotNull(List<string> trackerNumbers, int custId)
        {
            var dealData = GetDealMockDetailsBasedOnTrackerNumbers();
            mockEcapTrackerDataLib.Setup(x => x.GetDealDetailsBasedOnTrackerNumbers(It.IsAny<List<string>>(),It.IsAny<int>())).Returns(dealData);
            var result = new EcapTrackerLib(mockEcapTrackerDataLib.Object).GetDealDetailsBasedOnTrackerNumbers(trackerNumbers, custId);
            Assert.IsNotNull(result);
        }

        private IEnumerable<EcapTrackerData> GetDealMockDetailsBasedOnTrackerNumbers()
        {
            var data = new List<EcapTrackerData>{new EcapTrackerData
            {
                OBJ_SID = 1,
                TRKR_NBR = "nbr",
                STRT_DT = "st_dt",
                END_DT = "end_dt",
                PTR_SYS_PRD = "prd",
                GEO_COMBINED = "geo",
                MRKT_SEG = "mrkt_seg",
                MEET_COMP_PRICE_QSTN ="mcpq",
                PAYOUT_BASED_ON = "pbo",
                PROD_INCLDS = "prd_inclds",
                PROGRAM_PAYMENT ="prgm_pymnt",
                TERMS = "terms"
            } };

            return data;
        }
    }
}
