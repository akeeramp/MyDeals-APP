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
    internal class ConsumptionCountryLibTest
    {
        public Mock<IConsumptionCountryDataLib> mockCnsmptnCtryDataLib = new Mock<IConsumptionCountryDataLib>();
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();

        [Test]
        public void GetConsumptionCountry_shouldReturnNotNull()
        {
            var ctryData = getCnsmptnCtryMockData();
            mockCnsmptnCtryDataLib.Setup(x => x.GetConsumptionCountry()).Returns(ctryData);

            var res = new ConsumptionCountryLib(mockCnsmptnCtryDataLib.Object, mockDataCollectionsDataLib.Object).GetConsumptionCountry();
            Assert.IsNotNull(res);
        }

        [Test]
        public void ManageConsumptionCountry_shouldReturnNotNull()
        {
            var ctryData = new ConsumptionCountry() { CNSMPTN_CTRY_NM = "Test_Country_1", GEO_NM = "Test_Geo_1" };

            var crudMode = CrudModes.Insert;
            mockCnsmptnCtryDataLib.Setup(x => x.ManageConsumptionCountry(It.IsAny<ConsumptionCountry>()
                , It.IsAny<CrudModes>())).Returns(ctryData);

            var res = new ConsumptionCountryLib(mockCnsmptnCtryDataLib.Object, mockDataCollectionsDataLib.Object)
                .ManageConsumptionCountry(ctryData, crudMode);
            Assert.IsNotNull(res);
        }

        private List<ConsumptionCountry> getCnsmptnCtryMockData()
        {
            var data = new List<ConsumptionCountry>();
            data.Add(new ConsumptionCountry
            {
                CNSMPTN_CTRY_NM = "Tanzania",
                GEO_NM = "IJKK"
            });
            data.Add(new ConsumptionCountry
            {
                CNSMPTN_CTRY_NM = "Monaco",
                GEO_NM = "EMEA"
            });
            data.Add(new ConsumptionCountry
            {
                CNSMPTN_CTRY_NM = "Angola",
                GEO_NM = "EMEA"
            });
            data.Add(new ConsumptionCountry
            {
                CNSMPTN_CTRY_NM = "St. Vincent",
                GEO_NM = "ASMO"
            });
            data.Add(new ConsumptionCountry
            {
                CNSMPTN_CTRY_NM = "South Korea",
                GEO_NM = "APAC"
            });

            return data;
        }
    }
}
