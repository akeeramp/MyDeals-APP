using System;
using NUnit.Framework;
using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestFixture]
    public class ProductDataLibTests
    {
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started ProductData Lib tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed ProductData Lib tests.");
        }


        [TestCase]
        public void PrdDataLib_GetProducts()
        {
            IEnumerable<Product> results = new ProductDataLib().GetProducts();
            Assert.IsTrue(results.Any());
        }

        [TestCase("7001,7002,7004", "INCLUDE")]
        [TestCase("7001,7002,7004", "EXCLUDE")]
        public void PrdDataLib_SetIncludeExclude(string incExcldStr, string mode)
        {
            List<ProductIncExcAttribute> incExcldList = new List<ProductIncExcAttribute>();
            foreach(string item in incExcldStr.Split(','))
            {
                ProductIncExcAttribute newElement = new ProductIncExcAttribute()
                {
                    ATTR_VAL = item
                };
                incExcldList.Add(newElement);
            }

            // TO DO: Proc appears to not return anything, Call might need to remove all of the ret logic since it appears to not be used.
            List<ProductIncExcAttribute> results;
            Assert.DoesNotThrow(() => { results = new ProductDataLib().SetIncludeExclude(incExcldList, mode); });
        }

        [TestCase]
        public void PrdDataLib_GetProductIncludeExcludeAttribute()
        {
            ProductIncExcAttributeSelector results = new ProductDataLib().GetProductIncludeExcludeAttribute();
            Assert.IsTrue(results != null);
            Assert.IsTrue(results.IncExcAttributeMaster.Any()); // Has returned attributes
            Assert.IsTrue(results.ProductIncExcAttributeSelected.FirstOrDefault().ATRB_SID_EXC != ""); // Has excludes
            Assert.IsTrue(results.ProductIncExcAttributeSelected.FirstOrDefault().ATRB_SID_INC != ""); // Has includes
        }

        [TestCase]
        public void PrdDataLib_GetProdDealType()
        {
            List<PrdDealType> results = new ProductDataLib().GetProdDealType();
            Assert.IsTrue(results.Any() && results.Count() == 5); // 5 current known deal types
            Assert.IsTrue(results.FirstOrDefault(dt => dt.OBJ_SET_TYPE_CD == "ECAP").OBJ_SET_TYPE_CD == ObjSetTypeCodes.ECAP.ToString());
        }

        // TO DO: I would have expected different return levels for each deal type!!
        [TestCase(3, "7006,7007,7008")] // ECAP deal prod levels
        [TestCase(4, "7006,7007,7008")] // PROGRAM deal prod levels
        [TestCase(5, "7006,7007,7008")] // VOL TIER deal prod levels
        [TestCase(6, "7006,7007,7008")] // KIT deal prod levels
        public void PrdDataLib_GetProdSelectionLevel(int OBJ_SET_TYPE_SID, string levels)
        {
            List<int> levelsCheck = levels.Split(',').Select(Int32.Parse).ToList(); // Make it an array to make it a fast check
            List<PrdSelLevel> results = new ProductDataLib().GetProdSelectionLevel();
            List<int> returnedLevels = results.Select(r => r.PRD_ATRB_SID).Select(Int32.Parse).ToList();
                //results.Select(r => r.PRD_SELC_LVL).Select(Int32.Parse).ToList();

            var differences = levelsCheck.Except(returnedLevels).Union(returnedLevels.Except(levelsCheck)).ToList();
            Assert.IsFalse(differences.Any());
        }

        [TestCase] 
        public void PrdDataLib_SetProductAlias()
        {
            ProductAlias emptyAlias = new ProductAlias();
            List<ProductAlias> results = new ProductDataLib().SetProductAlias(CrudModes.Select, emptyAlias);
            Assert.IsTrue(results.Any()); // Make sure that select works first

            emptyAlias = results.FirstOrDefault(r => r.PRD_ALS_NM == "DummyAlias");
            if (emptyAlias != null) // Safety check: Need to clean out trash
            {
                results = new ProductDataLib().SetProductAlias(CrudModes.Delete, emptyAlias);
            }

            ProductAlias newAlias = new ProductAlias()
            {
                PRD_ALS_NM = "DummyAlias",
                PRD_NM = "DT",
                PRD_ALS_SID = -1
            };

            // Insert record
            results = new ProductDataLib().SetProductAlias(CrudModes.Insert, newAlias);
            Assert.IsTrue(results.Any(a => a.PRD_ALS_NM == "DummyAlias" && a.PRD_NM == "DT" && a.PRD_ALS_SID > 0));

            // Update record
            newAlias = results.FirstOrDefault(a => a.PRD_ALS_NM == "DummyAlias");
            newAlias.PRD_NM = "SvrWS";
            results = new ProductDataLib().SetProductAlias(CrudModes.Update, newAlias);
            Assert.IsTrue(results.Any(a => a.PRD_ALS_NM == "DummyAlias" && a.PRD_NM == "SvrWS" && a.PRD_ALS_SID == newAlias.PRD_ALS_SID));

            // Delete record
            newAlias = results.FirstOrDefault(a => a.PRD_ALS_NM == "DummyAlias");
            results = new ProductDataLib().SetProductAlias(CrudModes.Delete, newAlias);
            Assert.IsFalse(results.Any()); // We deleted it!

            // Finally
            emptyAlias = new ProductAlias();
            results = new ProductDataLib().SetProductAlias(CrudModes.Select, emptyAlias);
            Assert.IsFalse(results.Any(a => a.PRD_ALS_NM == "DummyAlias")); // Make sure that test is gone from DB
        }

    }
}