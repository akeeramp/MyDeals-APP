using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;

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
            return SafeExecutor(() => _contractsLib.GetUpperContract(id)
                , $"Unable to get Contract {id}"
            );
        }

        [Authorize]
        [Route("GetFullContract/{id}")]
        public OpDataCollectorFlattenedDictList GetFullContract(int id)
        {
            return SafeExecutor(() => _contractsLib.GetFullContract(id)
                , $"Unable to get Contract {id}"
            );
        }

        [Authorize]
        [Route("SaveContract/{custId}")]
        [HttpPost]
        public MyDealsData SaveContract(int custId, OpDataCollectorFlattenedList contracts)
        {
            return SafeExecutor(() => _contractsLib.SaveContract(contracts, custId)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
        [Route("SaveFullContract/{custId}")]
        [HttpPost]
        public MyDealsData SaveFullContract(int custId, OpDataCollectorFlattenedDictList fullContracts)
        {
            return SafeExecutor(() => _contractsLib.SaveFullContract(custId, fullContracts)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
        [Route("SaveContractAndPricingTable/{custId}")]
        [HttpPost]
        public MyDealsData SaveContractAndPricingTable(int custId, ContractTransferPacket contractAndPricingTable)
        {
            return SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(custId, contractAndPricingTable)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
        [Route("DeleteContract/{id}")]
        [HttpGet]
        public OpMsg DeleteContract(int id)
        {
            return SafeExecutor(() => _contractsLib.DeleteContract(id)
                , "Unable to delete the Contract {id}"
            );
        }

        [Authorize]
        [Route("IsDuplicateContractTitle/{dcId}/{title}")]
        [HttpGet]
        public bool IsDuplicateContractTitle(int dcId, string title)
        {
            return SafeExecutor(() => _contractsLib.IsDuplicateContractTitle(dcId, title)
                , "Unable to validate contract name {title}"
            );
        }
    }
}