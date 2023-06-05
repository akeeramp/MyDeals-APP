using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque.Data;
using Moq;
using NUnit.Framework;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class PricingStrategiesLibTest
    {
        public Mock<IOpDataCollectorLib> mockIOpDataCollectorLib = new Mock<IOpDataCollectorLib>();
        public Mock<INotificationsLib> mockINotificationsLib = new Mock<INotificationsLib>();

        private static readonly object[] SavePricingStrategyParams =
        {
            new object[] {
                new OpDataCollectorFlattenedList(), new SavePacket()
            }
        };

        [Test,
            TestCaseSource("SavePricingStrategyParams")]
        public void SavePricingStrategy_ReturnsNotNullWithZeroCount(dynamic param)
        {
            var data = param[0];
            var savePacket = param[1];
            var mockData = new MyDealsData();
            mockIOpDataCollectorLib.Setup(x => x.SavePackets(It.IsAny<OpDataCollectorFlattenedDictList>(), It.IsAny<SavePacket>())).Returns(mockData);
            var result1 = mockData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
            var result2 = new PricingStrategiesLib(mockIOpDataCollectorLib.Object, mockINotificationsLib.Object).SavePricingStrategy(data, savePacket);
            Assert.AreEqual(result1, result2);
            Assert.IsNotNull(result1);
            Assert.AreEqual(result1.Count, 0);
        }

        private static readonly object[] SaveFullPricingStrategyParams =
        {
            new object[]
            {
                new ContractToken(),
                new OpDataCollectorFlattenedDictList()
                {
                    [OpDataElementType.PRC_ST] = new OpDataCollectorFlattenedList
                    {
                        new OpDataCollectorFlattenedItem
                        {
                            [AttributeCodes.DC_ID] = 1
                        }
                    },[OpDataElementType.PRC_TBL] = new OpDataCollectorFlattenedList
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
                }
            }
        };

        [Test,
            TestCaseSource("SaveFullPricingStrategyParams")]
        public void SaveFullPricingStrategy_ReturnsNotNullWithZeroCount(dynamic param)
        {
            var contractToken = param[0];
            var fullpricingStrategies = param[1];

            var mockData = new MyDealsData();
            mockIOpDataCollectorLib.Setup(x => x.SavePackets(It.IsAny<OpDataCollectorFlattenedDictList>(), It.IsAny<SavePacket>())).Returns(mockData);
            var result = new PricingStrategiesLib(mockIOpDataCollectorLib.Object, mockINotificationsLib.Object).SaveFullPricingStrategy(contractToken, fullpricingStrategies);
            Assert.IsNotNull(result);
            Assert.AreEqual(result.Count, 0);
        }
    }
}