using Intel.MyDeals.Entities;
using NUnit.Framework;
using System;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.DataLibrary.Test;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestFixture]
    public class TranslationsTest
    {
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Translations tests");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestCase]
        public void TranslateToWip()
        {
            OpDataCollectorFlattenedItem item = new OpDataCollectorFlattenedItem
            {
                [AttributeCodes.DC_ID] = 123,
                [AttributeCodes.DC_PARENT_ID] = 1234,
                [AttributeCodes.dc_type] = OpDataElementType.PRC_TBL_ROW.ToString(),
                [AttributeCodes.dc_parent_type] = OpDataElementType.PRC_TBL.ToString(),
                [AttributeCodes.OBJ_SET_TYPE_CD] = OpDataElementSetType.ECAP,
                [AttributeCodes.PTR_SYS_PRD] = "[{\"Prod 1\": 123},{\"Prod 2\": 234}]",
                [AttributeCodes.ECAP_TYPE] = "MCP",
                [AttributeCodes.START_DT] = "1/1/2015",
                [AttributeCodes.END_DT] = "1/1/2018",
                [AttributeCodes.CUST_ACCNT_DIV] = "div1,div2,div3",
                [AttributeCodes.GEO_NM] = "WW"
            };

            // ECAP
            OpDataCollectorFlattenedList ecapItems = item.TranslateToWip();
            Assert.IsTrue(ecapItems.Count == 2);

            // Vol Tier
            item[AttributeCodes.OBJ_SET_TYPE_CD] = OpDataElementSetType.VOL_TIER;
            OpDataCollectorFlattenedList volTierItems = item.TranslateToWip();
            Assert.IsTrue(volTierItems.Count == 1);

        }

    }
}
