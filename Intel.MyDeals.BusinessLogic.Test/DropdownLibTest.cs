using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestClass]
    public class DropdownLibTest
    {
        public DropdownLibTest()
        {
            Console.WriteLine("Started Dropdown Library Tests");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestMethod]
        public void DropDnLib_GetDropdowns()
        {
            // Check Basic get call
            List<BasicDropdown> basicDropDownList = new DropdownLib().GetBasicDropdowns();
            Assert.IsTrue(basicDropDownList.Any());

            string atrbCd = "REBATE_TYPE";
            IEnumerable<BasicDropdown> basicDropDownIEnum = new DropdownLib().GetDropdowns(atrbCd);
            Assert.IsTrue(basicDropDownIEnum.Any());
            Assert.IsFalse(basicDropDownIEnum.Where(d => d.ATRB_CD != atrbCd).Any());

            basicDropDownIEnum = new DropdownLib().GetDistinctDropdownCodes(atrbCd);
            Assert.IsTrue(basicDropDownIEnum.Any());

            string dealType = "ECAP";
            basicDropDownIEnum = new DropdownLib().GetDropdowns(atrbCd, dealType);
            Assert.IsTrue(basicDropDownIEnum.Any());
            Assert.IsFalse(basicDropDownIEnum.Where(d => d.ATRB_CD != atrbCd && (d.OBJ_SET_TYPE_CD != dealType || d.OBJ_SET_TYPE_CD != "ALL_DEALS")).Any());


            // Check Get Specific Dropdown list calls
            List<Dropdown> dropDownList = new DropdownLib().GetDealTypesDropdown();
            Assert.IsTrue(dropDownList.Any()); // Nothing that you can really specifically target other then one match
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == "ECAP").Any()); // Find one deal type match = ECAP

            dropDownList = new DropdownLib().GetRoleTypesDropdown();
            Assert.IsTrue(dropDownList.Any());
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == "GA").Any()); // Find one role match = GA

            dropDownList = new DropdownLib().GetSecurityActionsDropdown();
            Assert.IsTrue(dropDownList.Any());
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == "C_VIEW_ATTACHMENTS").Any()); // Find one security action match = C_VIEW_ATTACHMENTS

            dropDownList = new DropdownLib().GetNumTiersDropdown();
            Assert.IsTrue(dropDownList.Any());
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == "5").Any()); // Find one tier match = 5
            Assert.IsTrue(dropDownList.Count() == 10); // Expect 10 tiers

            dropDownList = new DropdownLib().GetGeosDropdown();
            Assert.IsTrue(dropDownList.Any());
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == "APAC").Any()); // Find one Geo match = APAC

            dropDownList = new DropdownLib().GetProductLevelDropdown();
            Assert.IsTrue(dropDownList.Any());
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == "Deal Product name" && d.dropdownID == 7007).Any()); // Find one product level match = 7007, Deal Product name

            dropDownList = new DropdownLib().GetDropdownGroups();
            Assert.IsTrue(dropDownList.Any());
            Assert.IsTrue(dropDownList.Where(d => d.dropdownName == "COST_TEST_RESULT").Any()); // Find one dropdown group match = COST_TEST_RESULT


            // Check GetSoldToIdDropdown variations
            int custId = 2982; // HPI
            IEnumerable<string> geos = new string[] { "APAC", "ASMO" };
            IEnumerable<string> custDivs = new string[] { "HPI IPG", "HPI CPC" };
            dropDownList = new DropdownLib().GetSoldToIdDropdown(custId, geos, custDivs);
            Assert.IsTrue(dropDownList.Any());

            dropDownList = new DropdownLib().GetSoldToIdDropdown(custId, null, custDivs);
            Assert.IsTrue(dropDownList.Any());

            dropDownList = new DropdownLib().GetSoldToIdDropdown(custId, geos, null);
            Assert.IsTrue(dropDownList.Any());

            dropDownList = new DropdownLib().GetSoldToIdDropdown(custId, null, null);
            Assert.IsTrue(dropDownList.Any());

            geos = new string[] { "Worldwide" };
            dropDownList = new DropdownLib().GetSoldToIdDropdown(custId, geos, custDivs);
            Assert.IsTrue(dropDownList.Any());


            // Check GetDropdowns returns list as expected
            IEnumerable<Dropdown> dropDownIEnum = new DropdownLib().GetDropdowns();
            Assert.IsTrue(dropDownIEnum.Any());


            // Check Hierarchy calls
            string prnt = "MRKT_SEG";
            DropdownHierarchy[] dropDownHierarchy = new DropdownLib().GetDropdownHierarchy(prnt);
            Assert.IsTrue(dropDownHierarchy.Any());

            prnt = "ASMO";
            dropDownHierarchy = new DropdownLib().GetGeoDropdownHierarchy(prnt);
            Assert.IsTrue(dropDownHierarchy.Any());
            if (dropDownHierarchy.Length > 0)
            {
                Assert.IsTrue(dropDownHierarchy[0].items.Any());
                // Check that only ASMO items came down.
                Assert.IsFalse(dropDownHierarchy[0].items.Where(g => g.DROP_DOWN.Contains(prnt)).Count() != dropDownHierarchy[0].items.Count());
            }
        }

        [TestMethod]
        public void DropDnLib_AdminItems()
        {
            string atrbCd = "COMP_MISSING_FLG";
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

        [TestMethod]
        public void DropDnLib_GetDropdownOverlapping()
        {
            // Check GetDealGroupDropdown variations
            List<int> deals = new List<int> { 232605 }; // Old DCS deal with many overlaps
            List<OverlappingDeal> overlappingList = new DropdownLib().GetDealGroupDropdown(OpDataElementType.WIP_DEAL, deals);
            Assert.IsTrue(overlappingList.Any());
        }

    }
}
