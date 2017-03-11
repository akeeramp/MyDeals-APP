using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;


namespace Intel.MyDeals.BusinessLogic
{
    public class DropdownLib : IDropdownLib
	{
		private readonly IDropdownDataLib _dropdownDataLib;

		private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

		/// <summary>
		/// TODO: This parameterless constructor is left as a reminder,
		/// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
		/// </summary>
		public DropdownLib()
		{
			_dropdownDataLib = new DropdownDataLib();
		}

		public DropdownLib(IDropdownDataLib dropdownDataLib, IDataCollectionsDataLib dataCollectionsDataLib)
		{
			_dropdownDataLib = dropdownDataLib;
			_dataCollectionsDataLib = dataCollectionsDataLib;
		}


		/// <summary>
		/// Get All Basic Dropdowns
		/// </summary>
		/// <returns>list of Basic Dropdowns</returns>
		public List<BasicDropdown> GetBasicDropdowns()
		{
			return _dataCollectionsDataLib.GetBasicDropdowns();
		}

        /// <summary>
        /// Get All Simple Dropdowns
		/// </summary>
        /// <returns>list of dropdowns</returns>
        public IEnumerable<Dropdown> GetDropdowns()
        {
            return _dataCollectionsDataLib.GetDropdowns();
        }

        /// <summary>
        /// Get All Simple Dropdowns
        /// </summary>
        /// <returns>list of dropdowns</returns>
        public IEnumerable<BasicDropdown> GetDropdowns(string atrbCd)
        {
            atrbCd = atrbCd.ToUpper();
            return _dataCollectionsDataLib.GetBasicDropdowns().Where(d => d.ATRB_CD.ToUpper() == atrbCd);
        }

        /// <summary>
		/// Get All Deal Types Dropdowns
		/// </summary>
		/// <returns>list of Deal Types Dropdowns</returns>
		public List<Dropdown> GetDealTypesDropdown()
        {
            return GetDropdowns().Where(dd => dd.dropdownCategory == "All Deal Types" && dd.active == 1).ToList();
        }

		/// <summary>
		/// Get All Role Types Dropdown
		/// </summary>
		/// <returns>list of Role Types Dropdowns</returns>
		public List<Dropdown> GetRoleTypesDropdown()
		{
			return GetDropdowns().Where(dd => dd.dropdownCategory == "Application Role" && dd.subCategory == "IDMS" && dd.active == 1).ToList();
		}
		
		/// <summary>
		/// Get All Deal Types Dropdown
		/// </summary>
		/// <returns>list of Deal Types Dropdowns</returns>
		public List<Dropdown> GetSecurityActionsDropdown()
		{
			return GetDropdowns().Where(dd => dd.dropdownCategory == "Action Security" && dd.active == 1).ToList();
		}
		
		/// <summary>
		/// Get All Dropdown Groups
		/// </summary>
		/// <returns>list of Dropdown Groups</returns>
		public List<Dropdown> GetDropdownGroups()
        {
            return GetDropdowns().Where(dd => dd.dropdownCategory == "Basic Dropdowns" && dd.active == 1).ToList();
        }

        /// <summary>
        /// Updates/Inserts a Basic Dropdowns
        /// </summary>
        /// <param name="dropdown">The dropdowns to be updated</param>
        /// <param name="type">The specific type of action, i.e. Insert vs Update</param>
        /// <returns>updated dropdown</returns>
        public BasicDropdown ManageBasicDropdowns(BasicDropdown dropdown, CrudModes type)
        {
            return _dropdownDataLib.ManageBasicDropdowns(dropdown, type);
        }

        /// <summary>
        /// Deletes a Basic Dropdown
        /// </summary>
        /// <param name="id">The list of changed dropdowns to be updated</param>
        /// <returns>success/failure boolean</returns>
        public bool DeleteBasicDropdowns(int id)
        {
            return _dropdownDataLib.DeleteBasicDropdown(id);
        }


	}
}
