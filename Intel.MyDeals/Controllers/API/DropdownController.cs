using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Dropdown")]
    public class DropdownController : BaseApiController
	{
		private readonly IDropdownLib _dropdownLib;

		public DropdownController(IDropdownLib dropdownLib)
		{
			_dropdownLib = dropdownLib;
		}

        [Authorize]
        [Route("GetBasicDropdowns")]
        public IEnumerable<BasicDropdown> GetBasicDropdowns()
        {
            return SafeExecutor(() => _dropdownLib.GetBasicDropdowns()
                , $"Unable to get Basic Dropdowns"
            );
        }

        [Authorize]
        [Route("GetDropdowns/{atrbCd}")]
        public IEnumerable<BasicDropdown> GetDropdowns(string atrbCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdowns(atrbCd)
                , $"Unable to get Dropdowns for {atrbCd}"
            );
        }

        [Authorize]
        [Route("GetDropdowns/{atrbCd}/{dealtypeCd}")]
        public IEnumerable<BasicDropdown> GetDropdowns(string atrbCd, string dealtypeCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdowns(atrbCd, dealtypeCd)
                , $"Unable to get Dropdowns for {atrbCd} and {dealtypeCd}"
            );
        }

        [Authorize]
        [Route("GetDealTypesDropdowns")]
        public IEnumerable<Dropdown> GetDealTypesDropdowns()
        {
            return SafeExecutor(() => _dropdownLib.GetDealTypesDropdown()
                , $"Unable to get DealTypes Dropdowns"
            );
        }

        [Authorize]
        [Route("GetDropdownGroups")]
        public IEnumerable<Dropdown> GetDropdownGroups()
        {
            return SafeExecutor(() => _dropdownLib.GetDropdownGroups()
                , $"Unable to get Dropdowns Groups"
            );
        }

        [Authorize]
        [Route("GetNumTiersDropdowns")]
        public IEnumerable<Dropdown> GetNumTiersDropdowns()
        {
            return SafeExecutor(() => _dropdownLib.GetNumTiersDropdown()
                , $"Unable to get NumTiers Dropdowns"
            );
        }

        [Authorize]
        [Route("GetGeosDropdowns")]
        public IEnumerable<Dropdown> GetGeosDropdowns()
        {
            return SafeExecutor(() => _dropdownLib.GetGeosDropdown()
                , $"Unable to get Geos Dropdowns"
            );
        }

		[Authorize]
		[Route("GetProductLevelDropdowns")]
		public IEnumerable<Dropdown> GetProductLevelDropdowns()
		{
			return SafeExecutor(() => _dropdownLib.GetProductLevelDropdown()
				, $"Unable to get Geos Dropdowns"
			);
		}

		[Authorize]
        [Route("GetDropdownHierarchy/{prnt}")]
        public DropdownHierarchy[] GetDropdownHierarchy(string prnt)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdownHierarchy(prnt)
                , $"Unable to get Dropdown Hierarchy for {prnt}"
            );
        }

        [Authorize]
        [Route("GetGeoDropdownHierarchy/{prnt}")]
        public DropdownHierarchy[] GetGeoDropdownHierarchy(string prnt)
        {
            return SafeExecutor(() => _dropdownLib.GetGeoDropdownHierarchy(prnt)
                , $"Unable to get Dropdown Hierarchy for {prnt}"
            );
        }

        [HttpPut]
        [Route("UpdateBasicDropdowns")]
        public BasicDropdown UpdateBasicDropdowns(BasicDropdown data)
        {
            return SafeExecutor(() => _dropdownLib.ManageBasicDropdowns(data, CrudModes.Update)
                , $"Unable to update basic dropdown"
            );
        }

        //[Authorize]
        [HttpPost]
        [Route("InsertBasicDropdowns")]
        public BasicDropdown InsertBasicDropdowns(BasicDropdown data)
        {
            return SafeExecutor(() => _dropdownLib.ManageBasicDropdowns(data, CrudModes.Insert)
                , $"Unable to insert basic dropdown"
            );
        }

        [HttpDelete]
        [Route("DeleteBasicDropdowns/{id}")]
        public bool DeleteBasicDropdowns(int id)
        {
            return SafeExecutor(() => _dropdownLib.DeleteBasicDropdowns(id)
                , $"Unable to delete basic dropdown"
            );
		}

		//// TODO: Either uncomment the below out or remove it once we re-add Retail Cycle in
		//[Authorize]
		//[Route("GetRetailPull")]
		//[HttpPost]
		//public List<Dropdown> GetRetailPullFromSDM(RetailPullParams filterData)
		//{
		//	return SafeExecutor(() => _dropdownLib.GetRetailPullSDMDropdown(filterData)
		//		, $"Unable to get Retail Pull for product"
		//	);
		//}

		[Authorize]
		[Route("GetSoldToIds/{custId}")]
		public List<Dropdown> GetSoldToIds(int custId)
		{
			return SafeExecutor(() => _dropdownLib.GetSoldToIdDropdown(custId)
				, $"Unable to get Sold To Ids for the contract's customer"
			);
		}


		/// <summary>
		/// Gets a list of deal groups given a dealId
		/// </summary>
		/// <param name="id">A dealId</param>
		/// <returns>a list of deal groups</returns>
		[Authorize]
		[Route("GetDealGroupDropdown/{dealId}")]
		public List<OverlappingDeal> GetDealGroupDropdown(int dealId)
		{
			return SafeExecutor(() => _dropdownLib.GetDealGroupDropdown(dealId)
				, $"Unable to get deal groups"
			);
		}
	}
}
