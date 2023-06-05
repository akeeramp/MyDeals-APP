using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class CustomerVendorsLibTest
    {
        public Mock<ICustomerVendorsDataLib> mockCustomerVendorsDataLib = new Mock<ICustomerVendorsDataLib>();
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();

        [Test,
            TestCase(38),
            TestCase(-38)]
        public void GetCustomerVendors_ShouldReturn_NotNull(int custID)
        {
            List<CustomerVendors> mockData = GetCustomerVendorsMockData(custID);

            mockCustomerVendorsDataLib.Setup(x => x.GetCustomerVendors(It.IsAny<int>())).Returns(mockData);

            List<CustomerVendors> custVendorDetails = new CustomerVendorsLib(mockCustomerVendorsDataLib.Object, mockDataCollectionsDataLib.Object).GetCustomerVendors(custID);
            Assert.IsNotNull(custVendorDetails);
            Assert.Greater(custVendorDetails.Count, 0);
        }


        [Test]
        public void GetVendorsData_ShouldReturn_NotNull()
        {
            var vendorData = GetVendorsMockData();
            mockCustomerVendorsDataLib.Setup(x => x.GetVendorsData()).Returns(vendorData);
            var vendorDataLib = new CustomerVendorsLib(mockCustomerVendorsDataLib.Object, mockDataCollectionsDataLib.Object).GetVendorsData();
            Assert.IsNotNull(vendorDataLib);
            Assert.Greater(vendorDataLib.Count, 0);
        }

        private static readonly object[] ManageCustomerVendorsWithParams =
        {
            new object[] 
            { 
                new CustomerVendors
                {
                    ACTV_IND = false,
                    ATRB_LKUP_DESC = "",
                    ATRB_LKUP_SID = 1,
                    ATRB_SID = 2,
                    BUSNS_ORG_NM = "name",
                    CTRY_CD = "cd",
                    CTRY_NM = "name",
                    CUST_MBR_SID = 3,
                    CUST_NM = "name",
                    DROP_DOWN = "dropdown",
                    OBJ_SET_TYPE_SID = 4,
                    VNDR_ID = 5
                },
                CrudModes.Insert
            }    
        };


        [Test,
            TestCaseSource("ManageCustomerVendorsWithParams")
            ]
        public void ManageCustomerVendors_ShouldReturn_NotNull(dynamic data)
        {
            var CustVendor = data[0];
            var type = data[1];
            var vendorData = ManageCustomerVendorsMockData();
            mockCustomerVendorsDataLib.Setup(x => x.ManageCustomerVendors(It.IsAny<CustomerVendors>(), It.IsAny<CrudModes>())).Returns(vendorData);
            var vendorDataLib = new CustomerVendorsLib(mockCustomerVendorsDataLib.Object, mockDataCollectionsDataLib.Object).ManageCustomerVendors(CustVendor, type);
            Assert.IsNotNull(vendorDataLib);
        }

        private List<CustomerVendors> GetCustomerVendorsMockData(int custID)
        {
            var vendorObj = new List<CustomerVendors>();
            vendorObj.Add(new CustomerVendors
            {
                ACTV_IND = true,
                ATRB_LKUP_DESC = "",
                ATRB_LKUP_SID = 2341,
                ATRB_SID = 3353,
                BUSNS_ORG_NM = "NIVEUS MEDIA INC - 1000016015",
                CTRY_CD = "US ",
                CTRY_NM = "United States",
                CUST_MBR_SID = 38,
                CUST_NM = "Aquarius",
                DROP_DOWN = "1000016015",
                OBJ_SET_TYPE_SID = 1,
                VNDR_ID = 1000016015
            });            
            vendorObj.Add(new CustomerVendors
            {
                ACTV_IND = false,
                ATRB_LKUP_DESC = "",
                ATRB_LKUP_SID = 2451,
                ATRB_SID = 3353,
                BUSNS_ORG_NM = "MICROSOFT CORPORATION",
                CTRY_CD = "US ",
                CTRY_NM = "United States",
                CUST_MBR_SID = 2,
                CUST_NM = "Acer",
                DROP_DOWN = "1000004403",
                OBJ_SET_TYPE_SID = 1,
                VNDR_ID = 1000004403
            });
            if (custID > 0)
            {
                vendorObj = vendorObj.Where(c => c.CUST_MBR_SID == custID).ToList();
            }
            return vendorObj;
        }

        private List<VendorsInfo> GetVendorsMockData()
        {
            var vendorData = new List<VendorsInfo>();
            vendorData.Add(new VendorsInfo
            {
                BUSNS_ORG_NM = "ALTAFLEX INC.",
                CTRY_CD = "US ",
                CTRY_NM = "United States",
                VNDR_ID = 1000000004
            });
            return vendorData;
        }

        private CustomerVendors ManageCustomerVendorsMockData()
        {
            var data = new CustomerVendors
            {
                ACTV_IND = true,
                ATRB_LKUP_DESC = "",
                ATRB_LKUP_SID = 1,
                ATRB_SID = 2,
                BUSNS_ORG_NM = "name",
                CTRY_CD = "cd",
                CTRY_NM = "name",
                CUST_MBR_SID = 3,
                CUST_NM = "name",
                DROP_DOWN = "dropdown",
                OBJ_SET_TYPE_SID = 4,
                VNDR_ID = 5
            };
            return data;
        }
    }
}
