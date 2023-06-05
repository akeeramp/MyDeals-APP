using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class SecurityAttributesLibTest
    {
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();
        public Mock<ISecurityAttributesDataLib> mockSecurityAttributesDataLib = new Mock<ISecurityAttributesDataLib>();

        [Test]
        public void GetSecurityAttributesDropDownData_ShouldReturnNotNull()
        {
            var mockData = new List<SecurityAttributesDropDown>();
            mockDataCollectionsDataLib.Setup(x => x.GetSecurityAttributesDropDownData()).Returns(mockData);
            var result = new SecurityAttributesLib(mockSecurityAttributesDataLib.Object, mockDataCollectionsDataLib.Object).GetSecurityAttributesDropDownData();
            Assert.IsNotNull(result);
        }

        private static readonly object[] SaveSecurityMappingsParams =
        {
            new object[] {
                new List<SecurityMapSave>
                {
                    new SecurityMapSave()
                }
            }
        };

        [Test, 
            TestCaseSource("SaveSecurityMappingsParams")]
        public void SaveSecurityMappings_ShouldReturnTrue(dynamic data)
        {
            mockSecurityAttributesDataLib.Setup(x => x.SaveSecurityMappings(It.IsAny<List<SecurityMapSave>>())).Returns(true);
            var result = new SecurityAttributesLib(mockSecurityAttributesDataLib.Object, mockDataCollectionsDataLib.Object).SaveSecurityMappings(data);
            Assert.IsTrue(result);
        }
        
        [Test]
        public void GetAdminDealTypes_ShouldReturnNotNull()
        {
            var mockData = new List<AdminDealType>();
            mockDataCollectionsDataLib.Setup(x => x.GetAdminDealTypes()).Returns(mockData);
            var result = new SecurityAttributesLib(mockSecurityAttributesDataLib.Object, mockDataCollectionsDataLib.Object).GetAdminDealTypes();
            Assert.NotNull(result);
        }

        private static readonly object[] ManageAdminDealTypeParams =
        {
            new object[] { new AdminDealType(), CrudModes.Insert }
        };

        [Test,
            TestCaseSource("ManageAdminDealTypeParams")]
        public void ManageAdminDealType_ShouldReturnNotNull(dynamic data)
        {
            var dealType = data[0];
            var state = data[1];
            var mockData = new AdminDealType();
            mockSecurityAttributesDataLib.Setup(x => x.ManageAdminDealType(It.IsAny<AdminDealType>(), It.IsAny<CrudModes>())).Returns(mockData);
            var result = new SecurityAttributesLib(mockSecurityAttributesDataLib.Object, mockDataCollectionsDataLib.Object).ManageAdminDealType(dealType, state);
            Assert.NotNull(result);
        }

        [Test,
            TestCase(1)]
        public void DeleteAdminDealType_ShouldReturnTrue(int id)
        {
            mockSecurityAttributesDataLib.Setup(x => x.DeleteAdminDealType(It.IsAny<int>())).Returns(true);
            var result = new SecurityAttributesLib(mockSecurityAttributesDataLib.Object, mockDataCollectionsDataLib.Object).DeleteAdminDealType(id);
            Assert.IsTrue(result);
        }
        
    }
}