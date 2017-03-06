using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class ContractsLib : IContractsLib
    {
        private readonly IOpDataCollectorLib _dataCollectorLib;

        public ContractsLib(IOpDataCollectorLib dataCollectorLib)
        {
            _dataCollectorLib = dataCollectorLib;
        }

        /// <summary>
        /// Get a Contract by ID
        /// </summary>
        /// <param name="id">Id of the contract</param>
        /// <param name="inclusive">true will get all components of the contract while false will only get the header</param>
        /// <returns>MyDealsData</returns>
        public MyDealsData GetContract(int id, bool inclusive = false)
        {
            List<OpDataElementType> opDataElementTypes = inclusive
                ? new List<OpDataElementType>
                    {
                        OpDataElementType.Contract,
                        OpDataElementType.PricingStrategy,
                        OpDataElementType.PricingTable,
                        OpDataElementType.PricingTableRow,
                        OpDataElementType.WipDeals
                    }
                : new List<OpDataElementType>
                    {
                        OpDataElementType.Contract
                    };

            return GetContract(id, opDataElementTypes);
        }

        /// <summary>
        /// Get Contract By Id and return the levels specified by opDataElementTypes
        /// </summary>
        /// <param name="id">Id of the contract</param>
        /// <param name="opDataElementTypes">List of OpDataElements to return</param>
        /// <returns>MyDealsData</returns>
        public MyDealsData GetContract(int id, List<OpDataElementType> opDataElementTypes = null)
        {
            return OpDataElementType.Contract.GetByIDs(new List<int> {id}, opDataElementTypes ?? new List<OpDataElementType> { OpDataElementType.Contract });
        }

        public OpDataCollectorFlattenedList GetUpperContract(int id)
        {
            return GetContract(id, new List<OpDataElementType>
                {
                    OpDataElementType.Contract,
                    OpDataElementType.PricingStrategy,
                    OpDataElementType.PricingTable
                })
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted)
                .ToHierarchialList(OpDataElementType.Contract);
        }

        public OpDataCollectorFlattenedDictList GetFullContract(int id)
        {
            return GetContract(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }


        /// <summary>
        /// Save a contract header
        /// </summary>
        /// <param name="data"></param>
        /// <param name="custId">Must pass the customer id to prevent blocking</param>
        /// <returns>MyDealsData</returns>
        public MyDealsData SaveContract(OpDataCollectorFlattenedList data, int custId)
        {
            // Save Data Cycle: Point 1
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.Contract] = data
            }, custId);
        }

        /// <summary>
        /// Save a contract and all of it's levels
        /// </summary>
        /// <param name="contracts">Contract collection</param>
        /// <param name="pricingStrategies">Pricing Strategy collection</param>
        /// <param name="pricingTables">Pricing Table collection</param>
        /// <param name="pricingTableRows">Pricing table Row collection</param>
        /// <param name="wipDeals">Wip Deals collection</param>
        /// <param name="custId">Must pass the customer id to prevent blocking</param>
        /// <returns>MyDealsData</returns>
        public MyDealsData SaveContract(
            OpDataCollectorFlattenedList contracts,
            OpDataCollectorFlattenedList pricingStrategies,
            OpDataCollectorFlattenedList pricingTables,
            OpDataCollectorFlattenedList pricingTableRows,
            OpDataCollectorFlattenedList wipDeals,
            int custId)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            if (contracts != null && contracts.Any()) data[OpDataElementType.Contract] = contracts;
            if (pricingStrategies != null && pricingStrategies.Any()) data[OpDataElementType.PricingStrategy] = pricingStrategies;
            if (pricingTables != null && pricingTables.Any()) data[OpDataElementType.PricingTable] = pricingTables;
            if (pricingTableRows != null && pricingTableRows.Any()) data[OpDataElementType.PricingTableRow] = pricingTableRows;
            if (wipDeals != null && wipDeals.Any()) data[OpDataElementType.WipDeals] = wipDeals;

            return _dataCollectorLib.SavePackets(data, custId);
        }

        public MyDealsData SaveFullContract(int custId, OpDataCollectorFlattenedDictList fullContracts)
        {
            return SaveContract(
                fullContracts.ContainsKey(OpDataElementType.Contract) ? fullContracts[OpDataElementType.Contract] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PricingStrategy) ? fullContracts[OpDataElementType.PricingStrategy] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PricingTable) ? fullContracts[OpDataElementType.PricingTable] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PricingTableRow) ? fullContracts[OpDataElementType.PricingTableRow] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.WipDeals) ? fullContracts[OpDataElementType.WipDeals] : new OpDataCollectorFlattenedList(),
                custId);
        }

        public MyDealsData SaveContractAndStrategy(int custId, ContractTransferPacket contractAndStrategy)
        {
            return SaveContract(
                contractAndStrategy.Contract,
                contractAndStrategy.PricingStrategy,
                contractAndStrategy.PricingTable,
                contractAndStrategy.PricingTableRow,
                contractAndStrategy.WipDeals,
                custId);
        }

        public OpMsg DeleteContract(int id)
        {
            // TODO replace with Delete call
            return new OpMsg();
        }

    }
}
