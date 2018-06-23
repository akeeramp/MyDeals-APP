using Intel.MyDeals.Entities;
using NUnit.Framework;
using System;
using Force.DeepCloner;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.DataLibrary.Test;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestFixture]
    public class TranslationsTest
    {
        private string baseDimKeyStandalone = "_____20___0";

        private MyDealsData BasicContract => _basicContract ?? (_basicContract = UnitTestHelpers.BuildSimpleContract());
        private MyDealsData _basicContract;

        private OpDataCollectorFlattenedDictList BasicContractFlattened => _basicContractFlattened ?? (_basicContractFlattened = BasicContract.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested, false));
        private OpDataCollectorFlattenedDictList _basicContractFlattened;

        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Translations tests");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestCase]
        public void TranslateToWip_ECAP_WW()
        {
            OpDataCollectorFlattenedDictList data = BasicContractFlattened.DeepClone();

            // ECAP
            OpDataCollectorFlattenedList items = data[OpDataElementType.PRC_TBL_ROW][0].TranslateToWip();
            Assert.IsTrue(items.Count == 3);

            // test first WW prod
            OpDataCollectorFlattenedItem ecap1 = items[0];
            Assert.IsTrue(ecap1[$"{AttributeCodes.CAP}{baseDimKeyStandalone}"].ToString() == "96.00");
            Assert.IsTrue(ecap1[$"{AttributeCodes.CAP_STRT_DT}{baseDimKeyStandalone}"].ToString() == "2/22/2017");
            Assert.IsTrue(ecap1[$"{AttributeCodes.CAP_END_DT}{baseDimKeyStandalone}"].ToString() == "12/31/9999");
            Assert.IsTrue(ecap1[$"{AttributeCodes.YCS2_PRC_IRBT}{baseDimKeyStandalone}"].ToString() == "No YCS2");
            Assert.IsTrue(ecap1[$"{AttributeCodes.YCS2_START_DT}{baseDimKeyStandalone}"].ToString() == "");
            Assert.IsTrue(ecap1[$"{AttributeCodes.YCS2_END_DT}{baseDimKeyStandalone}"].ToString() == "");
            Assert.IsTrue(ecap1[AttributeCodes.TITLE].ToString() == "29F02T2AOCMG2");
            Assert.IsTrue(ecap1[AttributeCodes.HAS_L1].ToString() == "0");
            Assert.IsTrue(ecap1[AttributeCodes.HAS_L2].ToString() == "0");

            // test second WW prod
            OpDataCollectorFlattenedItem ecap2 = items[1];
            Assert.IsTrue(ecap2[$"{AttributeCodes.CAP}{baseDimKeyStandalone}"].ToString() == "96.00");
            Assert.IsTrue(ecap2[$"{AttributeCodes.CAP_STRT_DT}{baseDimKeyStandalone}"].ToString() == "11/15/2017");
            Assert.IsTrue(ecap2[$"{AttributeCodes.CAP_END_DT}{baseDimKeyStandalone}"].ToString() == "12/31/9999");
            Assert.IsTrue(ecap2[$"{AttributeCodes.YCS2_PRC_IRBT}{baseDimKeyStandalone}"].ToString() == "No YCS2");
            Assert.IsTrue(ecap2[$"{AttributeCodes.YCS2_START_DT}{baseDimKeyStandalone}"].ToString() == "");
            Assert.IsTrue(ecap2[$"{AttributeCodes.YCS2_END_DT}{baseDimKeyStandalone}"].ToString() == "");
            Assert.IsTrue(ecap2[AttributeCodes.TITLE].ToString() == "29F64B2AMCMG4");
            Assert.IsTrue(ecap2[AttributeCodes.HAS_L1].ToString() == "0");
            Assert.IsTrue(ecap2[AttributeCodes.HAS_L2].ToString() == "0");

        }

        [TestCase]
        public void TranslateToWip_ECAP_GEO()
        {
            OpDataCollectorFlattenedDictList data = BasicContractFlattened.DeepClone();

            // ECAP
            OpDataCollectorFlattenedList items = data[OpDataElementType.PRC_TBL_ROW][1].TranslateToWip();
            Assert.IsTrue(items.Count == 6);

            // test first prod - APAC
            OpDataCollectorFlattenedItem ecap1 = items[0];
            Assert.IsTrue(ecap1[AttributeCodes.TITLE].ToString() == "29F02T2AOCMG2");
            Assert.IsTrue(ecap1[AttributeCodes.GEO_COMBINED].ToString() == "APAC");

            // test first prod - EMEA
            OpDataCollectorFlattenedItem ecap2 = items[1];
            Assert.IsTrue(ecap2[AttributeCodes.TITLE].ToString() == "29F02T2AOCMG2");
            Assert.IsTrue(ecap2[AttributeCodes.GEO_COMBINED].ToString() == "EMEA");

            // test second prod - APAC
            OpDataCollectorFlattenedItem ecap3 = items[2];
            Assert.IsTrue(ecap3[AttributeCodes.TITLE].ToString() == "29F64B2AMCMG4");
            Assert.IsTrue(ecap3[AttributeCodes.GEO_COMBINED].ToString() == "APAC");

            // test second prod - EMEA
            OpDataCollectorFlattenedItem ecap4 = items[3];
            Assert.IsTrue(ecap4[AttributeCodes.TITLE].ToString() == "29F64B2AMCMG4");
            Assert.IsTrue(ecap4[AttributeCodes.GEO_COMBINED].ToString() == "EMEA");

            // test third prod - APAC
            OpDataCollectorFlattenedItem ecap5 = items[4];
            Assert.IsTrue(ecap5[AttributeCodes.TITLE].ToString() == "JS29F08G08AANC1");
            Assert.IsTrue(ecap5[AttributeCodes.GEO_COMBINED].ToString() == "APAC");

            // test third prod - EMEA
            OpDataCollectorFlattenedItem ecap6 = items[5];
            Assert.IsTrue(ecap6[AttributeCodes.TITLE].ToString() == "JS29F08G08AANC1");
            Assert.IsTrue(ecap6[AttributeCodes.GEO_COMBINED].ToString() == "EMEA");


            //// Vol Tier
            //data[OpDataElementType.PRC_TBL_ROW][1][AttributeCodes.OBJ_SET_TYPE_CD] = OpDataElementSetType.VOL_TIER;
            //OpDataCollectorFlattenedList volTierItems = data[OpDataElementType.PRC_TBL_ROW][1].TranslateToWip();
            //Assert.IsTrue(volTierItems.Count == 1);
        }

        [TestCase]
        public void TranslateToWip_VOL_TIER_WW()
        {
            OpDataCollectorFlattenedDictList data = BasicContractFlattened.DeepClone();

            OpDataCollectorFlattenedList items = data[OpDataElementType.PRC_TBL_ROW][2].TranslateToWip();
            Assert.IsTrue(items.Count == 1);

            // test first WW prod
            OpDataCollectorFlattenedItem vol1 = items[0];
            Assert.IsTrue(vol1[AttributeCodes.TITLE].ToString() == "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1");
            Assert.IsTrue(vol1[AttributeCodes.HAS_L1].ToString() == "0");
            Assert.IsTrue(vol1[AttributeCodes.HAS_L2].ToString() == "0");

        }

        [TestCase]
        public void TranslateToWip_VOL_TIER_GEO()
        {
            OpDataCollectorFlattenedDictList data = BasicContractFlattened.DeepClone();

            OpDataCollectorFlattenedList items = data[OpDataElementType.PRC_TBL_ROW][3].TranslateToWip();
            Assert.IsTrue(items.Count == 2);

            // test first geo
            OpDataCollectorFlattenedItem vol1 = items[0];
            Assert.IsTrue(vol1[AttributeCodes.TITLE].ToString() == "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1");
            Assert.IsTrue(vol1[AttributeCodes.HAS_L1].ToString() == "0");
            Assert.IsTrue(vol1[AttributeCodes.HAS_L2].ToString() == "0");
            Assert.IsTrue(vol1[AttributeCodes.GEO_COMBINED].ToString() == "APAC");

            // test second geo
            OpDataCollectorFlattenedItem vol2 = items[1];
            Assert.IsTrue(vol2[AttributeCodes.TITLE].ToString() == "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1");
            Assert.IsTrue(vol2[AttributeCodes.HAS_L1].ToString() == "0");
            Assert.IsTrue(vol2[AttributeCodes.HAS_L2].ToString() == "0");
            Assert.IsTrue(vol2[AttributeCodes.GEO_COMBINED].ToString() == "EMEA");

        }

        [TestCase]
        public void TranslateToWip_PROGRAM_WW()
        {
            OpDataCollectorFlattenedDictList data = BasicContractFlattened.DeepClone();

            OpDataCollectorFlattenedList items = data[OpDataElementType.PRC_TBL_ROW][4].TranslateToWip();
            Assert.IsTrue(items.Count == 1);

            // test first WW prod
            OpDataCollectorFlattenedItem vol1 = items[0];
            Assert.IsTrue(vol1[AttributeCodes.TITLE].ToString() == "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1");
            Assert.IsTrue(vol1[AttributeCodes.HAS_L1].ToString() == "0");
            Assert.IsTrue(vol1[AttributeCodes.HAS_L2].ToString() == "0");

        }

        [TestCase]
        public void TranslateToWip_PROGRAM_GEO()
        {
            OpDataCollectorFlattenedDictList data = BasicContractFlattened.DeepClone();

            OpDataCollectorFlattenedList items = data[OpDataElementType.PRC_TBL_ROW][5].TranslateToWip();
            Assert.IsTrue(items.Count == 2);

            // test first geo
            OpDataCollectorFlattenedItem vol1 = items[0];
            Assert.IsTrue(vol1[AttributeCodes.TITLE].ToString() == "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1");
            Assert.IsTrue(vol1[AttributeCodes.HAS_L1].ToString() == "0");
            Assert.IsTrue(vol1[AttributeCodes.HAS_L2].ToString() == "0");
            Assert.IsTrue(vol1[AttributeCodes.GEO_COMBINED].ToString() == "APAC");

            // test second geo
            OpDataCollectorFlattenedItem vol2 = items[1];
            Assert.IsTrue(vol2[AttributeCodes.TITLE].ToString() == "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1");
            Assert.IsTrue(vol2[AttributeCodes.HAS_L1].ToString() == "0");
            Assert.IsTrue(vol2[AttributeCodes.HAS_L2].ToString() == "0");
            Assert.IsTrue(vol2[AttributeCodes.GEO_COMBINED].ToString() == "EMEA");

        }

        [TestCase]
        public void TranslateToWip_KIT_WW()
        {
            OpDataCollectorFlattenedDictList data = BasicContractFlattened.DeepClone();

            // ECAP
            OpDataCollectorFlattenedList items = data[OpDataElementType.PRC_TBL_ROW][6].TranslateToWip();
            Assert.IsTrue(items.Count == 1);

            // test first WW prod
            OpDataCollectorFlattenedItem kit1 = items[0];
            Assert.IsTrue(kit1[$"{AttributeCodes.CAP}{baseDimKeyStandalone}"].ToString() == "96.00");
            Assert.IsTrue(kit1[$"{AttributeCodes.CAP_STRT_DT}{baseDimKeyStandalone}"].ToString() == "2/22/2017");
            Assert.IsTrue(kit1[$"{AttributeCodes.CAP_END_DT}{baseDimKeyStandalone}"].ToString() == "12/31/9999");
            Assert.IsTrue(kit1[$"{AttributeCodes.YCS2_PRC_IRBT}{baseDimKeyStandalone}"].ToString() == "No YCS2");
            Assert.IsTrue(kit1[$"{AttributeCodes.YCS2_START_DT}{baseDimKeyStandalone}"].ToString() == "");
            Assert.IsTrue(kit1[$"{AttributeCodes.YCS2_END_DT}{baseDimKeyStandalone}"].ToString() == "");
            Assert.IsTrue(kit1[AttributeCodes.TITLE].ToString() == "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1");
            Assert.IsTrue(kit1[AttributeCodes.HAS_L1].ToString() == "0");
            Assert.IsTrue(kit1[AttributeCodes.HAS_L2].ToString() == "0");

        }

        [TestCase]
        public void TranslateToWip_KIT_GEO()
        {
            OpDataCollectorFlattenedDictList data = BasicContractFlattened.DeepClone();

            // ECAP
            OpDataCollectorFlattenedList items = data[OpDataElementType.PRC_TBL_ROW][7].TranslateToWip();
            Assert.IsTrue(items.Count == 2);

            // test first prod - APAC
            OpDataCollectorFlattenedItem kit1 = items[0];
            Assert.IsTrue(kit1[AttributeCodes.TITLE].ToString() == "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1");
            Assert.IsTrue(kit1[AttributeCodes.GEO_COMBINED].ToString() == "APAC");

            // test first prod - EMEA
            OpDataCollectorFlattenedItem kit2 = items[1];
            Assert.IsTrue(kit2[AttributeCodes.TITLE].ToString() == "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1");
            Assert.IsTrue(kit2[AttributeCodes.GEO_COMBINED].ToString() == "EMEA");

        }

    }
}