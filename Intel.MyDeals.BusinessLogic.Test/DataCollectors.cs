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
            MyDealsData myDealsData = DataCollectorData.OpDcFlatDictData["test1"].ToMyDealsData(OpDataElementType.Contract, new List<int> { 123 });

            Assert.IsTrue(myDealsData[OpDataElementType.Contract].AllDataCollectors.Any());
            Assert.IsTrue(myDealsData[OpDataElementType.Contract].Data[123].GetDataElement("OBJSET_TYPE") == null);
            Assert.IsTrue(myDealsData[OpDataElementType.Contract].Data[123].GetDataElementValue("DEAL_STG_CD") == "Requested");
            //Assert.IsTrue(myDealsData[OpDataElementType.Contract].Data[123].GetDataElementValue("START_DT") == "6/6/2016 12:00:00 AM");
        }

        [TestCase]
        public void FlattenedTest()
        {
            MyDealsData myDealsData = DataCollectorData.OpDcFlatDictData["test1"].ToMyDealsData(OpDataElementType.Contract, new List<int> { 123 });

            OpDataCollectorFlattenedDictList data = myDealsData.BuildObjSetContainers(ObjSetPivotMode.Pivoted);

            Assert.IsTrue(data[OpDataElementType.Contract][0]["DEAL_STG_CD"].ToString() == "Requested");

            data[OpDataElementType.Contract][0]["DEAL_STG_CD"] = "Submitted";

            Assert.IsTrue(data[OpDataElementType.Contract][0]["DEAL_STG_CD"].ToString() == "Submitted");
        }

        [TestCase]
        public void HierarchialTest()
        {
            MyDealsData myDealsData = DataCollectorData.OpDcFlatDictData["test1"].ToMyDealsData(OpDataElementType.Contract, new List<int> { 123 });

            OpDataCollectorFlattenedList data = myDealsData.BuildObjSetContainers(ObjSetPivotMode.Pivoted).ToHierarchialList(OpDataElementType.Contract);

            var dcId = ((OpDataCollectorFlattenedList)data[0][OpDataElementType.PricingStrategy.ToString()])[0]["dc_id"];

            Assert.IsTrue(dcId.ToString() == "201");
        }

        [TestCase]
        public void PeTest()
        {
            OpDataCollectorFlattenedDictList data = PricingTableData.GetData(123).BuildObjSetContainers(ObjSetPivotMode.Pivoted);

            var y = 1;
        }
    }

}