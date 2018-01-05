using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;
using NUnit.Framework;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestFixture]
    public class DataCollectorTests
    {
        /// <summary>
        /// Runs before the current test fixture
        /// </summary>
        [OneTimeSetUp]
        public void SetupDataCollectors()
        {
            Console.WriteLine("Started Data Collector Tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
            DataCollectorData.PopulateData();
        }

        [OneTimeTearDown]
        public void AfterDataCollectors()
        {
            Console.WriteLine("Completed Data Collector Tests.");
        }


        [TestCase]
        public void GetContractTest()
        {
            MyDealsData myDealsData = DataCollectorData.OpDcFlatDictData["test1"].ToMyDealsData(OpDataElementType.CNTRCT, new List<int> { 123 });

            Assert.IsTrue(myDealsData[OpDataElementType.CNTRCT].AllDataCollectors.Any());
            Assert.IsTrue(myDealsData[OpDataElementType.CNTRCT].Data[123].GetDataElement(AttributeCodes.OBJ_SET_TYPE_CD) == null);
            Assert.IsTrue(myDealsData[OpDataElementType.CNTRCT].Data[123].GetDataElementValue(AttributeCodes.WF_STG_CD) == StageCodes.Requested.ToString());
            //Assert.IsTrue(myDealsData[OpDataElementType.Contract].Data[123].GetDataElementValue("START_DT") == "6/6/2016 12:00:00 AM");
        }

        [TestCase]
        public void FlattenedTest()
        {
            MyDealsData myDealsData = DataCollectorData.OpDcFlatDictData["test1"].ToMyDealsData(OpDataElementType.CNTRCT, new List<int> { 123 });

            OpDataCollectorFlattenedDictList data = myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);

            Assert.IsTrue(data[OpDataElementType.CNTRCT][0][AttributeCodes.WF_STG_CD].ToString() == "Requested");

            data[OpDataElementType.CNTRCT][0][AttributeCodes.WF_STG_CD] = StageCodes.Submitted.ToString();

            Assert.IsTrue(data[OpDataElementType.CNTRCT][0]["WF_STG_CD"].ToString() == "Submitted");
        }

        [TestCase]
        public void HierarchialTest()
        {
            MyDealsData myDealsData = DataCollectorData.OpDcFlatDictData["test1"].ToMyDealsData(OpDataElementType.CNTRCT, new List<int> { 123 });

            OpDataCollectorFlattenedList data = myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted).ToHierarchialList(OpDataElementType.CNTRCT);

            var dcId = ((OpDataCollectorFlattenedList)data[0][OpDataElementType.PRC_ST.ToString()])[0][AttributeCodes.DC_ID];

            Assert.IsTrue(dcId.ToString() == "201");
        }

        [TestCase]
        public void PeTest()
        {
            MyDealsData myDealsData = PricingTableData.GetData(123);
            OpDataCollectorFlattenedDictList data = myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
            MyDealsData myDealsData2 = data.ToMyDealsData(OpDataElementType.CNTRCT, new List<int> { 123 });
            
        }
    }

}