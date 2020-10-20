using System;
using NUnit.Framework;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestFixture]
    public class DropdownLibTest
    {
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Dropdown Library Tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed Dropdown Library Tests.");
        }


        [TestCase]
        public void DropDnLib_GetBasicDropdowns()
        {
            List<BasicDropdown> basicDropDownList = new DropdownLib().GetBasicDropdowns();
            Assert.IsTrue(basicDropDownList.Any());
        }
        
        [TestCase]
        public void DropDnLib_GetDropdowns()
        {
            IEnumerable<Dropdown> dropDownIEnum = new DropdownLib().GetDropdowns();
            Assert.IsTrue(dropDownIEnum.Any());
        }

        [TestCase("REBATE_TYPE")]
        public void DropDnLib_GetDropdowns(string atrbCd)
        {
            IEnumerable<BasicDropdown> basicDropDownIEnum = new DropdownLib().GetDropdowns(atrbCd);
            Assert.IsTrue(basicDropDownIEnum.Any());
            Assert.IsFalse(basicDropDownIEnum.Where(d => d.ATRB_CD != atrbCd).Any());
        }

        [TestCase("REBATE_TYPE", "ECAP")]
        public void DropDnLib_GetDropdowns(string atrbCd, string dealType)
        {
            IEnumerable<BasicDropdown> basicDropDownIEnum = new DropdownLib().GetDropdowns(atrbCd, dealType);
            Assert.IsTrue(basicDropDownIEnum.Any());
            Assert.IsFalse(basicDropDownIEnum.Where(d => d.ATRB_CD != atrbCd && (d.OBJ_SET_TYPE_CD != dealType || d.OBJ_SET_TYPE_CD != "ALL_DEALS")).Any());

        }

        // These are driven through the normal drop down items at Dropdown data Lib, so no need here
        //[TestCase("REBATE_TYPE", "Acer")]
        //public void DropDnLib_GetDropdownsPerCustomer(string atrbCd, string custNm)
        //{
        //    IEnumerable<BasicDropdown> basicDropDownIEnum = new DropdownLib().GetDropdownsPerCustomer(atrbCd, custNm);
        //    Assert.IsTrue(basicDropDownIEnum.Any());
        //    Assert.IsFalse(basicDropDownIEnum.Where(d => d.ATRB_CD != atrbCd && (d.CUST_NM != custNm || d.CUST_NM != "ALL CUSTOMERS")).Any());

        //}

        //[TestCase("REBATE_TYPE", "ECAP")]
        //public void DropDnLib_GetDropdowns(string atrbCd, int custId)
        //{
        //    IEnumerable<BasicDropdown> basicDropDownIEnum = new DropdownLib().GetDropdownsPerCustomerId(atrbCd, custId);
        //    Assert.IsTrue(basicDropDownIEnum.Any());
        //    Assert.IsFalse(basicDropDownIEnum.Where(d => d.ATRB_CD != atrbCd && (d.CUST_MBR_SID != custId || d.CUST_MBR_SID != 1)).Any());

        //}

        [TestCase("REBATE_TYPE")]
        public void DropDnLib_GetDistinctDropdownCodes(string atrbCd)
        {
            IEnumerable<BasicDropdown> basicDropDownIEnum = new DropdownLib().GetDistinctDropdownCodes(atrbCd);
            Assert.IsTrue(basicDropDownIEnum.Any());
        }

        [TestCase("ECAP")]
        public void DropDnLib_GetDealTypesDropdown(string testValue)
        {
            List<Dropdown> dropDownList = new DropdownLib().GetDealTypesDropdown();
            Assert.IsTrue(dropDownList.Any()); // Nothing that you can really specifically target other then one match
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == testValue).Any()); // Find one deal type match = ECAP
        }

        [TestCase("GA")]
        public void DropDnLib_GetRoleTypesDropdown(string testValue)
        {
            List<Dropdown> dropDownList = new DropdownLib().GetRoleTypesDropdown();
            Assert.IsTrue(dropDownList.Any());
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == testValue).Any()); // Find one role match = GA
        }

        [TestCase("C_VIEW_ATTACHMENTS")]
        public void DropDnLib_GetSecurityActionsDropdown(string testValue)
        {
            List<Dropdown> dropDownList = new DropdownLib().GetSecurityActionsDropdown();
            Assert.IsTrue(dropDownList.Any());
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == testValue).Any()); // Find one security action match = C_VIEW_ATTACHMENTS
        }

        [TestCase("5")]
        public void DropDnLib_GetNumTiersDropdown(string testValue)
        {
            List<Dropdown> dropDownList = new DropdownLib().GetNumTiersDropdown();
            Assert.IsTrue(dropDownList.Any());
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == testValue).Any()); // Find one tier match = 5
            Assert.IsTrue(dropDownList.Count() == 10); // Expect 10 tiers
        }

        [TestCase("APAC")]
        public void DropDnLib_GetGeosDropdown(string testValue)
        {
            List<Dropdown> dropDownList = new DropdownLib().GetGeosDropdown();
            Assert.IsTrue(dropDownList.Any());
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == testValue).Any()); // Find one Geo match = APAC
        }

        [TestCase("COST_TEST_RESULT")]
        public void DropDnLib_GetDropdownGroups(string testValue)
        {
            List<Dropdown> dropDownList = new DropdownLib().GetDropdownGroups();
            Assert.IsTrue(dropDownList.Any());
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == testValue).Any()); // Find one dropdown group match = COST_TEST_RESULT
        }

        [TestCase("Deal Product name", 7007)]
        public void DropDnLib_GetDropdownGroups(string testValue, int level)
        {
            List<Dropdown> dropDownList = new DropdownLib().GetProductLevelDropdown();
            Assert.IsTrue(dropDownList.Any());
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == testValue && d.dropdownID == level).Any()); // Find one product level match = 7007, Deal Product name
        }

        [TestCase(2982, new string[] { "APAC", "ASMO" }, new string[] { "HPI IPG", "HPI CPC" })]
        [TestCase(2982, null, new string[] { "HPI IPG", "HPI CPC" })]
        [TestCase(2982, new string[] { "APAC", "ASMO" }, null)]
        [TestCase(2982, null, null)]
        [TestCase(2982, new string[] { "Worldwide" }, new string[] { "HPI IPG", "HPI CPC" })]
        public void DropDnLib_GetDropdownGroups(int custId, string[] geos, string[] custDivs)
        {
            List<Dropdown> dropDownList = new DropdownLib().GetSoldToIdDropdown(custId, geos, custDivs);
            Assert.IsTrue(dropDownList.Any());
        }

        [TestCase("MRKT_SEG")]
        public void DropDnLib_GetDropdownHierarchy(string prnt)
        {
            DropdownHierarchy[] dropDownHierarchy = new DropdownLib().GetDropdownHierarchy(prnt);
            Assert.IsTrue(dropDownHierarchy.Any());
        }

        [TestCase("ASMO")]
        public void DropDnLib_GetGeoDropdownHierarchy(string prnt)
        {
            DropdownHierarchy[] dropDownHierarchy = new DropdownLib().GetGeoDropdownHierarchy(prnt);
            Assert.IsTrue(dropDownHierarchy.Any());
            if (dropDownHierarchy.Length > 0)
            {
                Assert.IsTrue(dropDownHierarchy[0].items.Any());
                Assert.IsFalse(dropDownHierarchy[0].items.Where(g => g.DROP_DOWN.Contains(prnt)).Count() != dropDownHierarchy[0].items.Count());
            }
        }

        [TestCase("COMP_MISSING_FLG")]
        public void DropDnLib_ManageBasicDropdowns(string atrbCd)
        {
            IEnumerable<BasicDropdown> basicDropDowns = new DropdownLib().GetDropdowns(atrbCd);
            if (basicDropDowns.Where(d => d.DROP_DOWN == "TestingComp").Any())
            {
                int itemId = basicDropDowns.FirstOrDefault(d => d.DROP_DOWN == "TestingComp").ATRB_LKUP_SID;
                new DropdownLib().DeleteBasicDropdowns(itemId);
            }

            // Check Administrative calls for dropdowns
            BasicDropdown newItem = new BasicDropdown()
            {
                ACTV_IND = false,
                ATRB_LKUP_DESC = "Test value for comp missing drop down",
                ATRB_LKUP_TTIP = "Some tool tip",
                ATRB_SID = 34,
                DROP_DOWN = "TestingComp",
                OBJ_SET_TYPE_SID = 9,
                ATRB_LKUP_SID = 0
            };

            BasicDropdown createdItem = new DropdownLib().ManageBasicDropdowns(newItem, CrudModes.Insert);
            Assert.IsNotNull(createdItem);
            Assert.IsTrue(createdItem.ATRB_LKUP_TTIP == "Some tool tip");

            // TO DO: Cannot do next check since it is locked in cache and there isn't a flush call in this library
            // Check that the value is in the DB for sure
            //basicDropDowns = new DropdownLib().GetDropdowns(atrbCd);
            //Assert.IsTrue(basicDropDowns.Where(d => d.DROP_DOWN == "TestingComp").Any());

            createdItem.ATRB_LKUP_TTIP = "Some tool tip UPDATED";
            BasicDropdown updatedItem = new DropdownLib().ManageBasicDropdowns(createdItem, CrudModes.Update);
            Assert.IsNotNull(updatedItem);
            Assert.IsTrue(updatedItem.ATRB_LKUP_TTIP == "Some tool tip UPDATED");

            new DropdownLib().DeleteBasicDropdowns(updatedItem.ATRB_LKUP_SID);
            // Check that the value is removed from the DB for sure
            basicDropDowns = new DropdownLib().GetDropdowns(atrbCd);
            // TO DO: Cannot do next check since it is locked in cache and there isn't a flush call in this library
            //Assert.IsFalse(basicDropDowns.Where(d => d.DROP_DOWN == "TestingComp").Any());
        }

        private static object[] _sourceLists = { new object[] { new List<int> { 232605 } } };

        [Test, TestCaseSource("_sourceLists")] // Old DCS deal with many overlaps
        public void DropDnLib_GetDealGroupDropdown(List<int> deals)
        {
            List<OverlappingDeal> overlappingList = new DropdownLib().GetDealGroupDropdown(OpDataElementType.WIP_DEAL, deals);
            Assert.IsTrue(overlappingList.Any());
        }

    }
}
