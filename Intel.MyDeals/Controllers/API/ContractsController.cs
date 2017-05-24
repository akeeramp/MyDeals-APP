using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System.Net.Http.Formatting;
using System.Net;
using System.Net.Http;
using System.Collections.Generic;

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
        [Route("SaveContract/{custId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SaveContract(int custId, OpDataCollectorFlattenedList contracts)
        {
            return SafeExecutor(() => _contractsLib.SaveContract(contracts, custId, new List<int>(), false, "")
                , "Unable to save the Contract"
            );
        }

        [Authorize]
        [Route("SaveFullContract/{custId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SaveFullContract(int custId, OpDataCollectorFlattenedDictList fullContracts)
        {
            return SafeExecutor(() => _contractsLib.SaveFullContract(custId, fullContracts, new List<int>(), false, "")
                , "Unable to save the Contract"
            );
        }



        [Authorize]
        [Route("SaveContractAndPricingTable/{custId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SaveContractAndPricingTable(int custId, ContractTransferPacket contractAndPricingTable)
        {
            return SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(custId, contractAndPricingTable, false, false)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
		[Route("SaveAndValidateContractAndPricingTable/{custId}")]
		[HttpPost]
		public OpDataCollectorFlattenedDictList SaveAndValidateContractAndPricingTable(int custId, ContractTransferPacket contractAndPricingTable)
		{
            //   if (contractAndPricingTable.EventSource == OpDataElementType.PRC_TBL.ToString())
            //   {
            //    PtrValidationContainer errorList = new PtrValidationContainer();
            //    errorList = ValidatePricingTableRows(contractAndPricingTable);

            //    if (errorList.ColumnErrors.Count > 0)
            //    {
            //	    // Pricing Table Row has errors, so throw an exception
            //	    throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
            //	    {
            //		    Content = new ObjectContent<PtrValidationContainer>(errorList, new JsonMediaTypeFormatter())
            //	    });
            //    }
            //         }

            //         return SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(custId, contractAndPricingTable, true, false)
            //	, "Unable to save the Contract"
            //);

            return SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(custId, contractAndPricingTable, true, false)
                , "Unable to save the Contract"
            );

        }

        [Authorize]
        [Route("SaveAndValidateAndPublishContractAndPricingTable/{custId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SaveAndValidateAndPublishContractAndPricingTable(int custId, ContractTransferPacket contractAndPricingTable)
        {
            return SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(custId, contractAndPricingTable, true, true)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
		[Route("ValidatePricingTableRows")]
		[HttpPost]
		public PtrValidationContainer ValidatePricingTableRows(ContractTransferPacket contractAndPricingTable)
		{
			// TODO: Add save logic here as well?

			return SafeExecutor(() => _contractsLib.ValidatePricingTableRows(contractAndPricingTable)
				, "Unable to validate pricing table "
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

        [Authorize]
        [Route("GetContractsStatus")]
        [HttpPost]
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