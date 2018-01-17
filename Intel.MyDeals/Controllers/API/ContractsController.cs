using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System.Collections.Generic;
using Intel.MyDeals.Helpers;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Contracts/v1")]
    public class ContractsController : BaseApiController
    {
        private readonly IContractsLib _contractsLib;

        public ContractsController(IContractsLib contractsLib)
        {
            this._contractsLib = contractsLib;
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
        [Route("GetContractStatus/{id}")]
        public OpDataCollectorFlattenedList GetContractStatus(int id)
        {
            return SafeExecutor(() => _contractsLib.GetContractStatus(id)
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
        [Route("SaveContract/{custId}/{contractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList SaveContract(int custId, int contractId, OpDataCollectorFlattenedList contracts)
        {
            SavePacket savePacket = new SavePacket(new ContractToken
            {
                CustId = custId,
                ContractId = contractId
            });

            return SafeExecutor(() => _contractsLib.SaveContract(contracts, savePacket)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
        [Route("CopyContract/{custId}/{contractId}/{srcContractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList CopyContract(int custId, int contractId, int srcContractId, OpDataCollectorFlattenedList contracts)
        {
            SavePacket savePacket = new SavePacket(new ContractToken
            {
                CustId = custId,
                ContractId = contractId,
                CopyFromId = srcContractId,
                CopyFromObjType = OpDataElementType.CNTRCT
            });

            return SafeExecutor(() => _contractsLib.SaveContract(contracts, savePacket)
                , "Unable to copy the Contract"
            );
        }

        [Authorize]
        [Route("SaveFullContract/{custId}/{contractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList SaveFullContract(int custId, int contractId, bool delPtr, OpDataCollectorFlattenedDictList fullContracts)
        {
            SavePacket savePacket = new SavePacket(new ContractToken
            {
                CustId = custId,
                ContractId = contractId,
                DeleteAllPTR = delPtr
            });
            return SafeExecutor(() => _contractsLib.SaveFullContract(fullContracts, savePacket)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
        [Route("SaveContractAndPricingTable/{custId}/{contractId}/{delPtr}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList SaveContractAndPricingTable(int custId, int contractId, bool delPtr, ContractTransferPacket contractAndPricingTable)
        {
            OpDataCollectorFlattenedDictList result = SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(new ContractToken
            {
                CustId = custId,
                ContractId = contractId,
                DeleteAllPTR = delPtr
            }, contractAndPricingTable, forceValidation: false, forcePublish: false)
                , "Unable to save the Contract"
            );

            return result;
        }

        [Authorize]
        [Route("SaveAndValidateContractAndPricingTable/{custId}/{contractId}/{delPtr}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList SaveAndValidateContractAndPricingTable(int custId, int contractId, bool delPtr, ContractTransferPacket contractAndPricingTable)
        {
            OpDataCollectorFlattenedDictList result = SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(new ContractToken
            {
                CustId = custId,
                ContractId = contractId,
                DeleteAllPTR = delPtr
            }, contractAndPricingTable, forceValidation: true, forcePublish: true)
                , "Unable to save the Contract"
            );

            return result;
        }

        [Authorize]
        [Route("SaveAndValidateAndPublishContractAndPricingTable/{custId}/{contractId}/{delPtr}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList SaveAndValidateAndPublishContractAndPricingTable(int custId, int contractId, ContractTransferPacket contractAndPricingTable)
        {
            OpDataCollectorFlattenedDictList result = SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(new ContractToken
            {
                CustId = custId,
                ContractId = contractId
            }, contractAndPricingTable, forceValidation: true, forcePublish: true)
                , "Unable to save the Contract"
            );

            return result;
        }

        [Authorize]
        [Route("DeleteContract/{custId}/{contractId}")]
        [HttpGet]
        public OpMsg DeleteContract(int custId, int contractId)
        {
            return SafeExecutor(() => _contractsLib.DeleteContract(new ContractToken
            {
                CustId = custId,
                ContractId = contractId
            })
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

        [Authorize]
        [Route("GetContractsStatus")]
        [HttpPost]
        [AntiForgeryValidate]
        public dynamic GetContractsStatus([FromBody] DashboardFilter data)
        {
            return SafeExecutor(() => _contractsLib.GetContractsStatus(data)
                , $"Unable to get Contracts Status"
            );
        }

        [Authorize]
        [Route("GetWipFromContract/{id}")]
        public OpDataCollectorFlattenedDictList GetWipFromContract(int id)
        {
            return SafeExecutor(() => _contractsLib.GetWipFromContract(id)
                , $"Unable to get WIP Deals {id}"
            );
        }
    }
}