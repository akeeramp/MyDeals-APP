using System;
using System.Collections.Generic;
using System.Linq;
using Force.DeepCloner;
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

        private MyDealsData ComplexContract => _complexContract ?? (_complexContract = UnitTestHelpers.BuildSimpleContract());
        private MyDealsData _complexContract;
        
        
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
            MyDealsData myDealsData = ComplexContract.DeepClone();

            Assert.IsTrue(myDealsData[OpDataElementType.CNTRCT].AllDataCollectors.Any());

            OpDataCollector dc = myDealsData[OpDataElementType.CNTRCT].Data[1];
            Assert.IsTrue(dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD) == "ALL_TYPES");
            Assert.IsTrue(dc.GetDataElementValue(AttributeCodes.WF_STG_CD) == WorkFlowStages.InComplete);
        }

        //[TestCase]
        //public void FlattenedTest()
        //{
        //    MyDealsData myDealsData = ComplexContract.DeepClone();

        //    OpDataCollectorFlattenedDictList data = myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);

        //    Assert.IsTrue(data[OpDataElementType.CNTRCT][0][AttributeCodes.WF_STG_CD].ToString() == WorkFlowStages.Requested);

        //    data[OpDataElementType.CNTRCT][0][AttributeCodes.WF_STG_CD] = StageCodes.Submitted.ToString();

        //    Assert.IsTrue(data[OpDataElementType.CNTRCT][0]["WF_STG_CD"].ToString() == WorkFlowStages.Submitted);
        //}

        //[TestCase]
        //public void HierarchialTest()
        //{
        //    MyDealsData myDealsData = ComplexContract.DeepClone();

        //    OpDataCollectorFlattenedList data = myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted).ToHierarchialList(OpDataElementType.CNTRCT);

        //    var dcId = ((OpDataCollectorFlattenedList)data[0][OpDataElementType.PRC_ST.ToString()])[0][AttributeCodes.DC_ID];

        //    Assert.IsTrue(dcId.ToString() == "1");
        //}

        //[TestCase]
        //public void PeTest()
        //{
        //    MyDealsData myDealsData = ComplexContract.DeepClone();
        //    OpDataCollectorFlattenedDictList data = myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        //    MyDealsData myDealsData2 = data.ToMyDealsData(OpDataElementType.CNTRCT, new List<int> { 1 });
            
        //}
    }

}