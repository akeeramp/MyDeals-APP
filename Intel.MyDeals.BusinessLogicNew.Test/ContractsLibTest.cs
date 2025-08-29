using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class ContractsLibTest
    {
        public Mock<IOpDataCollectorLib> mockDataCollectorLib = new Mock<IOpDataCollectorLib>();
        public Mock<IUiTemplateLib> mockUiTemplateLib = new Mock<IUiTemplateLib>();
        public Mock<IDropdownLib> mockDropdownLib = new Mock<IDropdownLib>();
        public Mock<IPricingStrategiesLib> mockPricingStrategiesLib = new Mock<IPricingStrategiesLib>();
        public Mock<IPricingTablesLib> mockPricingTablesLib = new Mock<IPricingTablesLib>();
        private static readonly object[] _SaveTenderContract_Params =
        {
            new object[] {456,657,new ContractTransferPacket() {Contract = new OpDataCollectorFlattenedList(),PricingStrategy = new OpDataCollectorFlattenedList(),PricingTable = new OpDataCollectorFlattenedList() } }
        };
        private static readonly object[] SaveContract_Params =
        {
            new object[] {new OpDataCollectorFlattenedList() { },new SavePacket()}
        };
        private static readonly object[] SaveFullContract_Params =
       {
            new object[] {new OpDataCollectorFlattenedDictList() { },new SavePacket()}
        };
        private static readonly object[] SaveContract_ParamList =
        {
            new object[] {new OpDataCollectorFlattenedList { new OpDataCollectorFlattenedItem()}, new OpDataCollectorFlattenedList { new OpDataCollectorFlattenedItem() },new OpDataCollectorFlattenedList { new OpDataCollectorFlattenedItem() }, new OpDataCollectorFlattenedList { new OpDataCollectorFlattenedItem() }, new OpDataCollectorFlattenedList { new OpDataCollectorFlattenedItem() }, new SavePacket()}
        };
        private static readonly object[] SaveContract_ParamList_withNullSavePacket =
       {
            new object[] {new OpDataCollectorFlattenedList(),new OpDataCollectorFlattenedList(),new OpDataCollectorFlattenedList(), new OpDataCollectorFlattenedList(), new OpDataCollectorFlattenedList(), null}
        };
        


        [Test,
            TestCaseSource("_SaveTenderContract_Params")]
        public void SaveTenderContract_ReturnsNotNull_withValidInputs(dynamic data)
        {
            var mockMydealsData = new MyDealsData();
            var mockData = new OpDataCollectorFlattenedDictList();
            mockData[OpDataElementType.PRC_ST] = new OpDataCollectorFlattenedList();
            mockData[OpDataElementType.PRC_TBL] = new OpDataCollectorFlattenedList();
            int custId = data[0];
            int contractId = data[1];
            ContractTransferPacket upperContractData = data[2];
            mockDataCollectorLib.Setup(x => x.SavePackets(It.IsAny<OpDataCollectorFlattenedDictList>(), It.IsAny<SavePacket>())).Returns(mockMydealsData);
            mockPricingStrategiesLib.Setup(x => x.SavePricingStrategy(It.IsAny<OpDataCollectorFlattenedList>(), It.IsAny<SavePacket>())).Returns(mockData);
            mockPricingTablesLib.Setup(x => x.SavePricingTable(It.IsAny<OpDataCollectorFlattenedList>(), It.IsAny<SavePacket>())).Returns(mockData);
            var res = new ContractsLib(mockDataCollectorLib.Object, mockUiTemplateLib.Object, mockDropdownLib.Object, mockPricingTablesLib.Object, mockPricingStrategiesLib.Object).SaveTenderContract(custId, contractId, upperContractData);
            Assert.IsNotNull(res);
        }

        [Test,
            TestCase(98, 56, null)]
        public void SaveTenderContract_ThrowsNullReferenceException_withNullUpperContractData(int custId, int contractId, ContractTransferPacket upperContractData)
        {
            var mockMydealsData = new MyDealsData();
            var mockData = new OpDataCollectorFlattenedDictList();
            mockData[OpDataElementType.PRC_ST] = new OpDataCollectorFlattenedList();
            mockData[OpDataElementType.PRC_TBL] = new OpDataCollectorFlattenedList();
            mockDataCollectorLib.Setup(x => x.SavePackets(It.IsAny<OpDataCollectorFlattenedDictList>(), It.IsAny<SavePacket>())).Returns(mockMydealsData);
            mockPricingStrategiesLib.Setup(x => x.SavePricingStrategy(It.IsAny<OpDataCollectorFlattenedList>(), It.IsAny<SavePacket>())).Returns(mockData);
            mockPricingTablesLib.Setup(x => x.SavePricingTable(It.IsAny<OpDataCollectorFlattenedList>(), It.IsAny<SavePacket>())).Returns(mockData);
            Assert.Throws<NullReferenceException>(() => new ContractsLib(mockDataCollectorLib.Object, mockUiTemplateLib.Object, mockDropdownLib.Object, mockPricingTablesLib.Object, mockPricingStrategiesLib.Object).SaveTenderContract(custId, contractId, upperContractData));
        }

        [Test,
            TestCaseSource("SaveContract_Params")]
        public void SaveContract_ReturnsNotNull(dynamic input)
        {
            OpDataCollectorFlattenedList data = input[0];
            SavePacket savePacket = input[1];
            var mockMydealsData = new MyDealsData();
            mockDataCollectorLib.Setup(x => x.SavePackets(It.IsAny<OpDataCollectorFlattenedDictList>(), It.IsAny<SavePacket>())).Returns(mockMydealsData);
            var res = new ContractsLib(mockDataCollectorLib.Object, mockUiTemplateLib.Object, mockDropdownLib.Object, mockPricingTablesLib.Object, mockPricingStrategiesLib.Object).SaveContract(data,savePacket);
            Assert.IsNotNull(res);
        }

        [Test,
           TestCaseSource("SaveContract_ParamList")]
        public void SaveContract_ReturnsNotNull_withValidParams(dynamic input)
        {
            OpDataCollectorFlattenedList contracts = input[0];
            OpDataCollectorFlattenedList pricingStrategies = input[1];
            OpDataCollectorFlattenedList pricingTables = input[2];
            OpDataCollectorFlattenedList pricingTableRows = input[3];
            OpDataCollectorFlattenedList wipDeals = input[4];
            SavePacket savePacket = input[5];
            var mockMydealsData = new MyDealsData();
            mockDataCollectorLib.Setup(x => x.SavePackets(It.IsAny<OpDataCollectorFlattenedDictList>(), It.IsAny<SavePacket>(), It.IsAny < List<int>>(), It.IsAny < List < OpDataElementType >>() , It.IsAny < OpDataElementType>() ,It.IsAny<List<int>>() , It.IsAny<List<OpDataElementType>>() ,It.IsAny < OpDataElementType>() )).Returns(mockMydealsData);
            var res = new ContractsLib(mockDataCollectorLib.Object, mockUiTemplateLib.Object, mockDropdownLib.Object, mockPricingTablesLib.Object, mockPricingStrategiesLib.Object).SaveContract(contracts,pricingStrategies,pricingTables,pricingTableRows,wipDeals,savePacket);
            Assert.IsNotNull(res);
        }

        [Test,
           TestCaseSource("SaveContract_ParamList_withNullSavePacket")]
        public void SaveContract_ThrowsNullReferenceException_withNullSavePacketInput(dynamic input)
        {
            OpDataCollectorFlattenedList contracts = input[0];
            OpDataCollectorFlattenedList pricingStrategies = input[1];
            OpDataCollectorFlattenedList pricingTables = input[2];
            OpDataCollectorFlattenedList pricingTableRows = input[3];
            OpDataCollectorFlattenedList wipDeals = input[4];
            SavePacket savePacket = input[5];
            var mockMydealsData = new MyDealsData();
            Assert.Throws<NullReferenceException>(() => new ContractsLib(mockDataCollectorLib.Object, mockUiTemplateLib.Object, mockDropdownLib.Object, mockPricingTablesLib.Object, mockPricingStrategiesLib.Object).SaveContract(contracts, pricingStrategies, pricingTables, pricingTableRows, wipDeals, savePacket));
        }

        //savefullcontract -> uses nested ToOpDataCollectorFlattenedDictList() on saveContract.Might Need to modify TC
        [Test,
           TestCaseSource("SaveFullContract_Params")]
        public void SaveFullContract_ReturnsNotNull_withValidParams(dynamic input)
        {
            OpDataCollectorFlattenedDictList fullContracts = input[0];
            SavePacket savePacket = input[1];
            var mockMydealsData = new MyDealsData();
            mockDataCollectorLib.Setup(x => x.SavePackets(It.IsAny<OpDataCollectorFlattenedDictList>(), It.IsAny<SavePacket>(), It.IsAny<List<int>>(), It.IsAny<List<OpDataElementType>>(), It.IsAny<OpDataElementType>(), It.IsAny<List<int>>(), It.IsAny<List<OpDataElementType>>(), It.IsAny<OpDataElementType>())).Returns(mockMydealsData);
            var res = new ContractsLib(mockDataCollectorLib.Object, mockUiTemplateLib.Object, mockDropdownLib.Object, mockPricingTablesLib.Object, mockPricingStrategiesLib.Object).SaveFullContract(fullContracts, savePacket);
            Assert.IsNotNull(res);
        }

        [Test,
           TestCase(null,null)]
        public void SaveFullContract_ThrowsNullReferenceException_withNullSavePacketInput(OpDataCollectorFlattenedDictList fullContracts, SavePacket savePacket)
        {
            var mockMydealsData = new MyDealsData();
            Assert.Throws<NullReferenceException>(() => new ContractsLib(mockDataCollectorLib.Object, mockUiTemplateLib.Object, mockDropdownLib.Object, mockPricingTablesLib.Object, mockPricingStrategiesLib.Object).SaveFullContract(fullContracts,savePacket));
        }

        [Test,
            TestCase("<html>Hello World!</html>")]
        public void HtmlToPdf_ReturnsNotNull_withValidHtmlBodyStringInput(string input)
        {
            var res = new ContractsLib(mockDataCollectorLib.Object, mockUiTemplateLib.Object, mockDropdownLib.Object, mockPricingTablesLib.Object, mockPricingStrategiesLib.Object).HtmlToPdf(input);
            Assert.AreEqual(res.Name, "TestMe.pdf");
        }

        [Test,
       
            TestCase("<html></html>"),
            TestCase(null)]
        public void HtmlToPdf_ThrowsInvalidOperationException_withInValidHtmlBodyStringInput(string input)
        {
            Assert.Throws<InvalidOperationException>(() => new ContractsLib(mockDataCollectorLib.Object, mockUiTemplateLib.Object, mockDropdownLib.Object, mockPricingTablesLib.Object, mockPricingStrategiesLib.Object).HtmlToPdf(input));
        }
    }
}
