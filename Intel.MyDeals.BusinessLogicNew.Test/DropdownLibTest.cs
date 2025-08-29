using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.deal;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class DropdownLibTest
    {
        public Mock<IDropdownDataLib> mockDropdownDataLib = new Mock<IDropdownDataLib> ();
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();
        private static readonly object[] _paramList_ManageBasicDropdowns =
        {
            new object[] {  new BasicDropdown{
                ACTV_IND  = true,
                ATRB_CD  = "random_cd",
                ATRB_LKUP_DESC  = "mock_data",
                ATRB_LKUP_SID  = 554335,
                ATRB_LKUP_TTIP  = "mock_data",
                ATRB_SID  = 23,
                CUST_MBR_SID  = 1,
                CUST_NM  = "ALL CUSTOMERS",
                DFLT_FLG  = 1,
                DROP_DOWN  = "mock_data",
                OBJ_SET_TYPE_CD  = "mock_data_cd2",
                OBJ_SET_TYPE_SID  = 07,
                ORD  = 2
            } }
        };
        private static readonly object[] _paramList_GetDealGroupDropdown =
        {
             new object[] { new OpDataElementType(),new List<int> { 1, 2,3, 4, 5,} }
        };
        private static readonly object[] _param_GetSoldToIdDropdown_PassingList =
        {
             new object[] { 45,new List<string>{ "Worldwide","geo2" } ,new List<string> {"hpc","custDivs2" } },
             new object[] { 23,new List<string>{ "APAC","geo2" } ,new List<string> {"gfg", "Amazon 2" } },
             new object[] { 23,null ,null }
        };
        private static readonly object[] _param_GetSoldToIdDropdown_FailingList =
        {
             new object[] { 67,new List<string>{ "Worldwide","geo2" } ,new List<string> {"hpc","custDivs2" } },
             new object[] { 23, new List<string> { "Worldwide", "geo2" }, new List<string> {"hpi","custDivs2"  } }
        };

        [Test]
        public void GetBasicDropdowns_ReturnsNotNull()
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x=>x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetBasicDropdowns();
            Assert.IsNotNull(res);
            Assert.Greater(res.Count, 0);
        }

        [Test]
        public void GetOpDataElements_ReturnsNotNull()
        {
            var mockData = new List<DropDowns>();
            mockDropdownDataLib.Setup(x=>x.GetOpDataElements()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetOpDataElements();
            Assert.IsNotNull(res);
        }

        [Test]
        public void GetDropdowns_ReturnsNotNull()
        {
            var mockData = GetDropdowns_mockData();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdowns();
            Assert.IsNotNull(res);
        }

        [Test,
            TestCase("atr_cd")]
        public void GetDictDropDown(string atrbCd)
        {
            var mockData = new List<DictDropDown>();
            mockDataCollectionsDataLib.Setup(x=>x.GetDictDropDown(It.IsAny<string>())).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object,mockDataCollectionsDataLib.Object).GetDictDropDown(atrbCd);
            Assert.IsNotNull(res);
        }

        [Test,
            TestCase("SETTLEMENT_PARTNER",45),
            TestCase("random_cd",0)]
        public void GetDropdowns_withParams_ReturnsNotNullList_withMatchingAttributes(string atrbCd, int custId)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object,mockDataCollectionsDataLib.Object).GetDropdowns(atrbCd, custId);
            Assert.IsNotNull(res);
        }

        [Test,
            TestCase("SETTLEMENT_PARTNER", 46),
            TestCase("random_atr_cd", 023)]
        public void GetDropdowns_withParams_ReturnsEmptyList_withNonMatchingAttributes(string atrbCd, int custId)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdowns(atrbCd, custId);
            Assert.IsEmpty(res);
        }

        [Test,
            TestCase("SETTLEMENT_PARTNER")]
        public void GetDropdownsWithInactives_ReturnsNotNullList_withMatchingInput(string atrbCd)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownsWithInactives(atrbCd);
            Assert.IsNotNull(res);
        }

        [Test,
           TestCase("random_atr_cd")]
        public void GetDropdownsWithInactives_ReturnsEmptyList_withNonMatchingInput(string atrbCd)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownsWithInactives(atrbCd);
            Assert.IsEmpty(res);
        }

        [Test,
            TestCase("SETTLEMENT_PARTNER")]
        public void GetDistinctDropdownCodes_ReturnsNotNull_And_DistinctList_WithMatchingInput(string atrbCd)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDistinctDropdownCodes(atrbCd);
            var resList = res.ToList();
            Assert.IsNotNull(res);
            Assert.AreEqual(resList.Count, 1);
        }

        [Test,
           TestCase("random_atr_cd")]
        public void GetDistinctDropdownCodes_ReturnsEmptyList_withNonMatchingInput(string atrbCd)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDistinctDropdownCodes(atrbCd);
            Assert.IsEmpty(res);
        }

        [Test,
            TestCase("SETTLEMENT_PARTNER", "mock_data_cd1")]
        public void GetDropdowns_withParams_ReturnsNotNullList_withMatchingInput(string atrbCd, string dealtypeCd)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdowns(atrbCd, dealtypeCd);
            Assert.IsNotNull(res);
        }

        [Test,
            TestCase("random_atr_cd", "ALL_TYPES")]
        public void GetDropdowns_withParams_ReturnsEmptyList_withNonMatchingInput(string atrbCd, string dealtypeCd)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdowns(atrbCd, dealtypeCd);
            Assert.IsEmpty(res);
        }

        [Test,
            TestCase("SETTLEMENT_PARTNER", "random_cust_nm"),
            TestCase("random_cd","cust_nm")]
        public void GetDropdownsWithCustomer_ReturnsNotNullList_withMatchingInput(string atrbCd, string custNm)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownsWithCustomer(atrbCd, custNm);
            Assert.IsNotNull(res);
        }

        [Test,
            TestCase("random_atr_cd", "ALL CUSTOMERS")]
        public void GetDropdownsWithCustomer_ReturnsEmptyList_withNonMatchingInput(string atrbCd, string custNm)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownsWithCustomer(atrbCd, custNm);
            Assert.IsEmpty(res);
        }

        [Test,
            TestCase("SETTLEMENT_PARTNER",45),
            TestCase("random_cd",1)]
        public void GetDropdownsWithCustomerId_ReturnsNotNull_withMatchingInput(string atrbCd, int custId)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownsWithCustomerId(atrbCd, custId);
            Assert.IsNotNull(res);
        }

        [Test,
            TestCase("SETTLEMENT_PARTNER", 5)]
        public void GetDropdownsWithCustomerId_ReturnsEmptyList_withNonMatchingInput(string atrbCd, int custId)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownsWithCustomerId(atrbCd, custId);
            Assert.IsEmpty(res);
        }

        [Test,
            TestCase("SETTLEMENT_PARTNER", "random_cust_nm")]
        public void GetDropdownsByCustomerOnly_ReturnsNotNull_withMatchingInput(string atrbCd, string custNm)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownsByCustomerOnly(atrbCd, custNm);
            Assert.IsNotNull(res);
        }

        [Test,
           TestCase("SETTLEMENT_PARTNER", "random customer name")]
        public void GetDropdownsByCustomerOnly_ReturnsEmptyList_withNonMatchingInput(string atrbCd, string custNm)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownsByCustomerOnly(atrbCd, custNm);
            Assert.IsEmpty(res);
        }

        [Test,
            TestCase("SETTLEMENT_PARTNER", 45)]
        public void GetDropdownsByCustomerOnlyId_ReturnsNotNull_withMatchingInput(string atrbCd, int custId)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownsByCustomerOnlyId(atrbCd, custId);
            Assert.IsNotNull(res);
        }

        [Test,
            TestCase("SETTLEMENT_PARTNER", 5)]
        public void GetDropdownsByCustomerOnlyId_ReturnsEmptyList_withNonMatchingInput(string atrbCd, int custId)
        {
            var mockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownsByCustomerOnlyId(atrbCd, custId);
            Assert.IsEmpty(res);
        }

        [Test]
        public void GetDealTypesDropdown_ReturnsNotNull_AllDealTypesDropdownList_forMatchingAttributes()
        {
            var mockData = GetDropdowns_mockData();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDealTypesDropdown();
            Assert.IsNotNull(res);
        }

        [Test]
        public void GetDealTypesDropdown_ReturnsEmptyList_forNonMatchingAttributes()
        {
            var mockData = new List<Dropdown>();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDealTypesDropdown();
            Assert.IsEmpty(res);
        }

        [Test]
        public void GetRoleTypesDropdown_ReturnsNotNull_AllRoleTypesDropdownList_forMatchingAttributes()
        {
            var mockData = GetDropdowns_mockData();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetRoleTypesDropdown();
            Assert.IsNotNull(res);
        }

        [Test]
        public void GetRoleTypesDropdown_ReturnsEmptyList_forNonMatchingAttributes()
        {
            var mockData = new List<Dropdown>();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetRoleTypesDropdown();
            Assert.IsEmpty(res);
        }

        [Test]
        public void GetSecurityActionsDropdown_ReturnsNotNull_SecurityActionDropdownList_forMatchingAttributes()
        {
            var mockData = GetDropdowns_mockData();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetSecurityActionsDropdown();
            Assert.IsNotNull(res);
        }

        [Test]
        public void GetSecurityActionsDropdown_ReturnsEmptyList_forNonMatchingAttributes()
        {
            var mockData = new List<Dropdown>();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetSecurityActionsDropdown();
            Assert.IsEmpty(res);
        }

        [Test]
        public void GetNumTiersDropdown_ReturnsNotNull_NumTiersDropdownList_forMatchingAttributes()
        {
            var mockData = GetDropdowns_mockData();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetNumTiersDropdown();
            Assert.IsNotNull(res);
        }

        [Test]
        public void GetNumTiersDropdown_ReturnsEmptyList_forNonMatchingAttributes()
        {
            var mockData = new List<Dropdown>();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetNumTiersDropdown();
            Assert.IsEmpty(res);
        }

        [Test]
        public void GetGeosDropdown_ReturnsNotNull_GeosDropdownList_forMatchingAttributes()
        {
            var mockData = GetDropdowns_mockData();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetGeosDropdown();
            Assert.IsNotNull(res);
        }

        [Test]
        public void GetGeosDropdown_ReturnsEmptyList_forNonMatchingAttributes()
        {
            var mockData = new List<Dropdown>();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetGeosDropdown();
            Assert.IsEmpty(res);
        }

        [Test]
        public void GetProductLevelDropdown_ReturnsNotNull_ProductLevelDropdownList_forMatchingAttributes()
        {
            var mockData = GetDropdowns_mockData();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetProductLevelDropdown();
            Assert.IsNotNull(res);
        }

        [Test]
        public void GetProductLevelDropdown_ReturnsEmptyList_forNonMatchingAttributes()
        {
            var mockData = new List<Dropdown>();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetProductLevelDropdown();
            Assert.IsEmpty(res);
        }

        [Test]
        public void GetDropdownGroups_ReturnsNotNull_AllDropdownGroupsList_forMatchingAttributes()
        {
            var mockData = GetDropdowns_mockData();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownGroups();
            Assert.IsNotNull(res);
        }

        [Test]
        public void GetDropdownGroups_ReturnsEmptyList_forNonMatchingAttributes()
        {
            var mockData = new List<Dropdown>();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownGroups();
            Assert.IsEmpty(res);
        }

        [Test,
            TestCaseSource("_paramList_ManageBasicDropdowns")]
        public void ManageBasicDropdowns_ReturnsNotNull(dynamic data)
        {
            var inputDropdown = data;
            var inputCrudMode = CrudModes.Update;
            var mockData = GetBasicDropdowns_mockData().ToList()[0];
            mockDropdownDataLib.Setup(x=>x.ManageBasicDropdowns(It.IsAny<BasicDropdown>(),It.IsAny<CrudModes>())).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).ManageBasicDropdowns(inputDropdown, inputCrudMode);
            Assert.IsNotNull(res);
        }

        [Test,
            TestCase(32)]
        public void DeleteBasicDropdowns_ReturnsTrue(int id)
        {
            mockDropdownDataLib.Setup(x => x.DeleteBasicDropdown(It.IsAny<int>())).Returns(true);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).DeleteBasicDropdowns(id);
            Assert.That(res, Is.True);
        }

        [Test,
            TestCaseSource("_paramList_GetDealGroupDropdown")]
        public void GetDealGroupDropdown_ReturnNotNull(dynamic data)
        {
            var mockData = new List<OverlappingDeal>();
            OpDataElementType inputOpDataElementType = data[0];
            List<int> inputDealIds = data[1];
            mockDropdownDataLib.Setup(x => x.GetDealGroupDropdown(It.IsAny<OpDataElementType>(), It.IsAny<List<int>>(), true)).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDealGroupDropdown(inputOpDataElementType,inputDealIds,true);
            Assert.IsNotNull(res);

        }

        [Test]
        public void GetCustomersDropdown_ReturnsNotNull_andAllCustomersAsFirstDropdownListItem()
        {
            var mockData = new List<SoldToIds>();
            mockDataCollectionsDataLib.Setup(x => x.GetSoldToIdList()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetCustomersDropdown();
            Assert.IsNotNull(res);
            Assert.AreEqual(res[0].dropdownName, "ALL CUSTOMERS");
        }

        [Test,
            TestCaseSource("_param_GetSoldToIdDropdown_PassingList")]
        public void GetSoldToIdDropdown_ReturnNotNull_withMatchingInput(dynamic input)
        {
            int custId = input[0];
            IEnumerable<string> geos = input[1];
            IEnumerable<string> custDivs = input[2];
            var mockData = GetSoldToIds_mockData();
            mockDataCollectionsDataLib.Setup(x => x.GetSoldToIdList()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetSoldToIdDropdown(custId, geos, custDivs);
            Assert.IsNotNull(res);
        }

        [Test,
            TestCaseSource("_param_GetSoldToIdDropdown_FailingList")]
        public void GetSoldToIdDropdown_ReturnEmptyList_withNonMatchingInput(dynamic input)
        {
            int custId = input[0];
            IEnumerable<string> geos = input[1];
            IEnumerable<string> custDivs = input[2];
            var mockData = GetSoldToIds_mockData();
            mockDataCollectionsDataLib.Setup(x => x.GetSoldToIdList()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetSoldToIdDropdown(custId, geos, custDivs);
            Assert.IsEmpty(res);
        }

        [Test]
        public void GetConsumptionCountryHierarchy_ReturnsNotNull()
        {
            var mockData = getConsumptionCountry_mockData();
            mockDropdownDataLib.Setup(x=>x.GetConsumptionCountryHierarchy()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetConsumptionCountryHierarchy("APAC");
            Assert.IsNotNull(res);
        }

        [Test,
            TestCase("SETTLEMENT_PARTNER")]
        public void GetDropdownHierarchy_ReturnsNotNull_withMatchingInput(string prnt)
        {
            var dropdownListMockData = GetDropdowns_mockData();
            var basicDropdownListMockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x=>x.GetDropdowns()).Returns(dropdownListMockData);
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(basicDropdownListMockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownHierarchy(prnt);
            Assert.IsNotNull(res);
        }
        [Test,
            TestCase("xyz")]
        public void GetDropdownHierarchy_ThrowsNullReferenceException_withNonMatchingInput(string prnt)
        {
            var dropdownListMockData = GetDropdowns_mockData();
            var basicDropdownListMockData = GetBasicDropdowns_mockData().ToList();
            mockDataCollectionsDataLib.Setup(x => x.GetDropdowns()).Returns(dropdownListMockData);
            mockDataCollectionsDataLib.Setup(x => x.GetBasicDropdowns()).Returns(basicDropdownListMockData);
            Assert.Throws<NullReferenceException>(()=> new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetDropdownHierarchy(prnt) );
        }

        [Test,
            TestCase("APAC"),
            TestCase("")]
        public void GetGeoDropdownHierarchy_ReturnsNotNull_withValidInput(string prnt)
        {
            var mockData = GetGeoDimensions_mockData();
            mockDataCollectionsDataLib.Setup(x=>x.GetGeoData()).Returns(mockData);
            var res = new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDropdownHierarchy(prnt);
            Assert.IsNotNull(res);
            Assert.Greater(res.Length, 0);
        }

        [Test,
            TestCase(null)]
        public void GetGeoDropdownHierarchy_ThrowsNullReferenceException_withNullInput(string prnt)
        {
            var mockData = GetGeoDimensions_mockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            Assert.Throws<NullReferenceException>(() => new DropdownLib(mockDropdownDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDropdownHierarchy(prnt));
        }

        private IEnumerable<BasicDropdown> GetBasicDropdowns_mockData()
        {
            var mockData = new List<BasicDropdown> { new BasicDropdown
            {
                ACTV_IND  = true,
                ATRB_CD  = "SETTLEMENT_PARTNER",
                ATRB_LKUP_DESC  = "mock_data",
                ATRB_LKUP_SID  = 554335,
                ATRB_LKUP_TTIP  = "mock_data",
                ATRB_SID  = 23,
                CUST_MBR_SID  = 45,
                CUST_NM  = "random_cust_nm",
                DFLT_FLG  = 1,
                DROP_DOWN  = "mock_data",
                OBJ_SET_TYPE_CD  = "mock_data_cd1",
                OBJ_SET_TYPE_SID  = 07,
                ORD  = 2
            },
            new BasicDropdown{
                ACTV_IND  = true,
                ATRB_CD  = "random_cd",
                ATRB_LKUP_DESC  = "mock_data",
                ATRB_LKUP_SID  = 554335,
                ATRB_LKUP_TTIP  = "mock_data",
                ATRB_SID  = 23,
                CUST_MBR_SID  = 1,
                CUST_NM  = "ALL CUSTOMERS",
                DFLT_FLG  = 1,
                DROP_DOWN  = "mock_data",
                OBJ_SET_TYPE_CD  = "mock_data_cd2",
                OBJ_SET_TYPE_SID  = 07,
                ORD  = 2
            },
             new BasicDropdown{
                ACTV_IND  = true,
                ATRB_CD  = "SETTLEMENT_PARTNER",
                ATRB_LKUP_DESC  = "mock_data",
                ATRB_LKUP_SID  = 554335,
                ATRB_LKUP_TTIP  = "mock_data",
                ATRB_SID  = 23,
                CUST_MBR_SID  = 23,
                CUST_NM  = "mock_data",
                DFLT_FLG  = 1,
                DROP_DOWN  = "mock_data",
                OBJ_SET_TYPE_CD  = "ALL_DEALS",
                OBJ_SET_TYPE_SID  = 07,
                ORD  = 2
            }};
            return mockData;
        }

        private List<Dropdown> GetDropdowns_mockData()
        {
            var mockData = new List<Dropdown> { new Dropdown
            {
                active  = 1,
                allDealFlag  = 1,
                dropdownCategory  = "Application Role",
                dropdownID  = 7,
                dropdownName  = "random_cd",
                parntAtrbCd  = "mock_data",
                subAtrbCd  = "SETTLEMENT_PARTNER",
                subAtrbValue  = "mock_data",
                subCategory  = "MYDL",
            },
            new Dropdown{
                active  = 1,
                allDealFlag  = 1,
                dropdownCategory  = "All Deal Types",
                dropdownID  = 7,
                dropdownName  = "mock_data",
                parntAtrbCd  = "mock_data",
                subAtrbCd  = "mock_data",
                subAtrbValue  = "mock_data",
                subCategory  = "mock_data",
            },
            new Dropdown{
                active  = 1,
                allDealFlag  = 1,
                dropdownCategory  = "Action Security",
                dropdownID  = 7,
                dropdownName  = "mock_data",
                parntAtrbCd  = "mock_data",
                subAtrbCd  = "mock_data",
                subAtrbValue  = "mock_data",
                subCategory  = "mock_data",
            },
            new Dropdown{
                active  = 1,
                allDealFlag  = 1,
                dropdownCategory  = "Num Tiers",
                dropdownID  = 7,
                dropdownName  = "mock_data",
                parntAtrbCd  = "mock_data",
                subAtrbCd  = "mock_data",
                subAtrbValue  = "mock_data",
                subCategory  = "mock_data",
            },
            new Dropdown{
                active  = 1,
                allDealFlag  = 1,
                dropdownCategory  = "Geo",
                dropdownID  = 7,
                dropdownName  = "mock_data",
                parntAtrbCd  = "mock_data",
                subAtrbCd  = "mock_data",
                subAtrbValue  = "mock_data",
                subCategory  = "mock_data",
            },
            new Dropdown{
                active  = 1,
                allDealFlag  = 1,
                dropdownCategory  = "Product Level",
                dropdownID  = 7,
                dropdownName  = "mock_data",
                parntAtrbCd  = "mock_data",
                subAtrbCd  = "mock_data",
                subAtrbValue  = "mock_data",
                subCategory  = "mock_data",
            },
            new Dropdown{
                active  = 1,
                allDealFlag  = 1,
                dropdownCategory  = "Security Attributes",
                dropdownID  = 7,
                dropdownName  = "mock_data",
                parntAtrbCd  = "mock_data",
                subAtrbCd  = "mock_data",
                subAtrbValue  = "mock_data",
                subCategory  = "mock_data",
            }};
            return mockData;
        }

        private List<SoldToIds> GetSoldToIds_mockData()
        {
            var mockData = new List<SoldToIds> { new SoldToIds
            {
                ACTV_IND  = true,
                CUST_DIV_NM  = "hpc",
                CUST_DIV_NM_SID  = 23,
                CUST_NM  = "lenovo",
                CUST_NM_SID  = 45,
                GEO_CD  = "geo_cd",
                GEO_NM  = "APAC",
                HOST_GEO  = "host_geo",
                SOLD_TO_ID  = "sold_to_id",
                SOLD_TO_ID_SID  = 223,
            },
            new SoldToIds
            {
                ACTV_IND  = true,
                CUST_DIV_NM  = "Amazon 2",
                CUST_DIV_NM_SID  = 23,
                CUST_NM  = "dell",
                CUST_NM_SID  = 23,
                GEO_CD  = "geo_cd",
                GEO_NM  = "geo_nm",
                HOST_GEO  = "host_geo",
                SOLD_TO_ID  = "sold_to_id",
                SOLD_TO_ID_SID  = 223,
            } };
            return mockData;
        }

        private List<ConsumptionCountry> getConsumptionCountry_mockData()
        {
            var mockData = new List<ConsumptionCountry> { 
                new ConsumptionCountry
                {
                    GEO_NM = "APAC",
                    CNSMPTN_CTRY_NM = "China"
                },
                new ConsumptionCountry{
                    GEO_NM = "EMEA",
                    CNSMPTN_CTRY_NM = "France"
                } 
            };
            return mockData;
        }

        private List<GeoDimension> GetGeoDimensions_mockData()
        {
            var mockData = new List<GeoDimension> { new GeoDimension
            {
                ACTV_IND = true,
                GEO_ATRB_SID= 23,
                GEO_MBR_SID= 23,
                CTRY_NM = "America",
                CTRY_NM_SID= 23,
                GEO_NM_SID= 23,
                GEO_NM = "APAC",
                RGN_NM = "GAR",
                RGN_NM_SID= 23
            },
            new GeoDimension{
                ACTV_IND = true,
                GEO_ATRB_SID= 23,
                GEO_MBR_SID= 23,
                CTRY_NM = "",
                CTRY_NM_SID= 23,
                GEO_NM_SID= 23,
                GEO_NM = "APAC",
                RGN_NM = "GAR",
                RGN_NM_SID= 23
            }};
            return mockData;
        }
    }
}
