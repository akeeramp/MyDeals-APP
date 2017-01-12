using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Contracts/v1")]
    public class ContractsController : BaseApiController
    {

        private readonly IContractsLib _contractsLib;
        public ContractsController(IContractsLib contractsLib)
        {
            _contractsLib = contractsLib;
        }

        [Authorize]
        [Route("GetContract/{id}")]
        public MyDealsData GetContract(int id)
        {
            return SafeExecutor(() => _contractsLib.GetContract(id)
                , $"Unable to get Contract {id}"
            );
        }


        [Authorize]
        [Route("GetFullNestedContract/{id}")]
        public MyDealsData GetFullNestedContract(int id)
        {
            return SafeExecutor(() => _contractsLib.GetContract(id, true)
                , $"Unable to get Contract {id}"
            );
        }


        [Authorize]
        [Route("GetUpperContract/{id}")]
        public OpDataCollectorFlattenedList GetUpperContract(int id)
        {
            return SafeExecutor(() => _contractsLib
                .GetContract(id, new List<OpDataElementType>
                {
                    OpDataElementType.Contract,
                    OpDataElementType.PricingStrategy
                })
                .BuildObjSetContainers(ObjSetPivotMode.Pivoted)
                .ToHierarchialList(OpDataElementType.Contract)
                , $"Unable to get Contract {id}"
            );
        }


        [Authorize]
        [Route("GetFullContract/{id}")]
        public OpDataCollectorFlattenedDictList GetFullContract(int id)
        {
            return SafeExecutor(() => _contractsLib
                .GetContract(id, true)
                .BuildObjSetContainers(ObjSetPivotMode.Pivoted)
                , $"Unable to get Contract {id}"
            );
        }


        [Authorize]
        [Route("SaveContract")]
        [HttpPost]
        public MyDealsData SaveContract(OpDataCollectorFlattenedList contracts)
        {
            return SafeExecutor(() => _contractsLib
                .SaveContract(contracts)
                , "Unable to save the Contract"
            );
        }


        [Authorize]
        [Route("SaveFullContract")]
        [HttpPost]
        public MyDealsData SaveFullContract(OpDataCollectorFlattenedDictList fullContracts)
        {
            return SafeExecutor(() => _contractsLib.SaveContract(
                fullContracts.ContainsKey(OpDataElementType.Contract) ? fullContracts[OpDataElementType.Contract] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PricingStrategy) ? fullContracts[OpDataElementType.PricingStrategy] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PricingTable) ? fullContracts[OpDataElementType.PricingTable] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.WipDeals) ? fullContracts[OpDataElementType.WipDeals] : new OpDataCollectorFlattenedList())
                , "Unable to save the Contract"
            );
        }


        [Authorize]
        [Route("SaveContractAndStrategy")]
        [HttpPost]
        public MyDealsData SaveContractAndStrategy(ContractTransferPacket contractAndStrategy)
        {
            // TODO save the data
            return SafeExecutor(() => new MyDealsData()
                , "Unable to save the Contract"
            );
        }



        [Authorize]
        [Route("DeleteContract/{id}")]
        [HttpGet]
        public OpMsg DeleteContract(int id)
        {
            // TODO delete the data
            return SafeExecutor(() => new OpMsg("Deleted Successfully")
                , "Unable to delete the Contract"
            );
        }

    }
}
