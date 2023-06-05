using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Moq;
using NUnit.Framework;
using System;
using Assert = NUnit.Framework.Assert;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class PricingTablesLibTest
    {

        public Mock<IOpDataCollectorLib> mockIOpDataCollectorLib = new Mock<IOpDataCollectorLib>();

        private static readonly object[] UpdateWipDealsParams =
        {
            new object[] {
                new OpDataCollectorFlattenedList
                {
                    new OpDataCollectorFlattenedItem
                    {
                        [AttributeCodes.DC_ID] = 5
                    }
                }, new SavePacket()
            }
        };

        [Test,
            TestCaseSource("UpdateWipDealsParams")]
        public void UpdateWipDeals_ReturnsNotNull(dynamic param)
        {
            var data = param[0];
            var savePacket = param[1];
            var mockData = new MyDealsData();
            mockIOpDataCollectorLib.Setup(x => x.SavePackets(It.IsAny<OpDataCollectorFlattenedDictList>(), It.IsAny<SavePacket>())).Returns(mockData);
            var result = new PricingTablesLib(mockIOpDataCollectorLib.Object).UpdateWipDeals(data, savePacket);
            Assert.IsNotNull(result);
            Assert.AreEqual(result.Count, 0);
        }

        private static readonly object[] SaveFullPricingTableParams =
        {
            new object[]
            {
                new OpDataCollectorFlattenedDictList()
                {
                    [OpDataElementType.PRC_TBL] = new OpDataCollectorFlattenedList
                    {
                        new OpDataCollectorFlattenedItem
                        {
                            [AttributeCodes.DC_ID] = 2
                        }
                    },[OpDataElementType.PRC_TBL_ROW] = new OpDataCollectorFlattenedList
                    {
                        new OpDataCollectorFlattenedItem
                        {
                            [AttributeCodes.DC_ID] = 3
                        }
                    },[OpDataElementType.WIP_DEAL] = new OpDataCollectorFlattenedList
                    {
                        new OpDataCollectorFlattenedItem
                        {
                            [AttributeCodes.DC_ID] = 4
                        }
                    },
                },
                new ContractToken()
            }
        };

        [Test,
            TestCaseSource("SaveFullPricingTableParams")]
        public void SaveFullPricingTable_ReturnsNotNullWithZeroCount(dynamic param)
        {
            var fullpricingTables = param[0];
            var contractToken = param[1];

            var mockData = new MyDealsData();
            mockIOpDataCollectorLib.Setup(x => x.SavePackets(It.IsAny<OpDataCollectorFlattenedDictList>(), It.IsAny<SavePacket>())).Returns(mockData);
            var result = new PricingTablesLib(mockIOpDataCollectorLib.Object).SaveFullPricingTable(fullpricingTables, contractToken);
            Assert.IsNotNull(result);
            Assert.AreEqual(result.Count, 0);
        }
    }
}
