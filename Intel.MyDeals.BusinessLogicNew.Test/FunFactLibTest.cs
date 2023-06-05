using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class FunFactLibTest
    {
        public Mock<IFunfactDataLib> mockFunFactDataLib = new Mock<IFunfactDataLib>();
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();

        [Test]
        public void GetFunfactItems_should_return_notNull()
        {
            var funfactData = GetFunfactMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetFunfactList()).Returns(funfactData);
            var result = new FunfactLib(mockFunFactDataLib.Object, mockDataCollectionsDataLib.Object).GetFunfactItems();
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        private static readonly object[] _params =
        {
            new object[] { true, "HDR", "ICON", 4, "SRC", "TXT"}
        };

        [Test,
            TestCaseSource("_params")]
        public void SetFunfacts_should_return_notNull(bool actvInd, string factHdr, string factIcon, int factSid, string factSrc, string factTxt)
        {
            Funfact data = new Funfact
            {
                ACTV_IND = actvInd,
                FACT_HDR = factHdr,
                FACT_ICON = factIcon,
                FACT_SID = factSid,
                FACT_SRC = factSrc,
                FACT_TXT = factTxt
            };
            var dataList = new List<Funfact>
            {
                data
            };
            var crudMode = CrudModes.Insert;
            mockFunFactDataLib.Setup(x => x.SetFunfacts(It.IsAny<CrudModes>(), It.IsAny<Funfact>())).Returns(dataList);
            var result = new FunfactLib(mockFunFactDataLib.Object, mockDataCollectionsDataLib.Object).SetFunfacts(crudMode, data);
            Assert.NotNull(result);
        }

        [Test]
        public void GetActiveFunfacts_should_return_FunFactList_With_TrueActiveIndicator()
        {
            var funfactData = GetFunfactMockData().Where(ff => ff.ACTV_IND).ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetFunfactList()).Returns(funfactData);
            var result = new FunfactLib(mockFunFactDataLib.Object, mockDataCollectionsDataLib.Object).GetActiveFunfacts();
            Assert.AreEqual(result[0].ACTV_IND, true);
        }

        private List <Funfact> GetFunfactMockData()
        {
            var data = new List<Funfact>
            {
                new Funfact
                {
                    ACTV_IND = true,
                    FACT_HDR = "FACT_HDR",
                    FACT_ICON = "FACT_ICON",
                    FACT_SID = 1,
                    FACT_SRC = "FACT_SRC",
                    FACT_TXT = "FACT_TXT"
                },  
                new Funfact
                {
                    ACTV_IND = false,
                    FACT_HDR = "FACT_HDR",
                    FACT_ICON = "FACT_ICON",
                    FACT_SID = 2,
                    FACT_SRC = "FACT_SRC",
                    FACT_TXT = "FACT_TXT"
                }
            };
            return data;
        }
    }
}