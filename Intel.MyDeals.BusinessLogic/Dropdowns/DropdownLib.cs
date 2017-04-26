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
        /// Get All Simple Dropdowns with grouping of atrbCd
        /// </summary>
        /// <returns>list of dropdowns</returns>
        public IEnumerable<BasicDropdown> GetDropdowns(string atrbCd)
        {
            atrbCd = atrbCd.ToUpper();
            return _dataCollectionsDataLib.GetBasicDropdowns().
                Where(d => d.ATRB_CD.ToUpper() == atrbCd && d.ACTV_IND).OrderBy(d => d.ORD);
        }

        /// <summary>
        /// Get All Simple Dropdowns with grouping of atrbCd and obj_set_Type of dealtypeCd
        /// Note: also return those that match "All Deals" type as well as the specified dealtypecd
        /// </summary>
        /// <returns>list of dropdowns</returns>
        public IEnumerable<BasicDropdown> GetDropdowns(string atrbCd, string dealtypeCd)
        {
            atrbCd = atrbCd.ToUpper();
            dealtypeCd = dealtypeCd.ToUpper();
            return _dataCollectionsDataLib.GetBasicDropdowns().
                Where(d => d.ATRB_CD.ToUpper() == atrbCd.ToUpper() && (d.OBJ_SET_TYPE_CD.ToUpper() == dealtypeCd.ToUpper() || d.OBJ_SET_TYPE_CD.ToUpper() == "ALL_DEALS") && d.ACTV_IND).OrderBy(d => d.DROP_DOWN);
        }

        /// <summary>
        /// Returns a dropdown hierarchy object using the provided parent name.
        /// Using the simple dropdown set, it will find the first dropdown with subAtrbCd matching the prnt name.
        /// </summary>
        /// <returns>dropdown hierarchy</returns>
        public DropdownHierarchy[] GetDropdownHierarchy(string prnt)
        {
            Dropdown chldDropdown = _dataCollectionsDataLib.GetDropdowns().FirstOrDefault(dd => dd.subAtrbCd.ToUpper() == prnt.ToUpper());
            string chld = chldDropdown.dropdownName;

            List<DropdownHierarchy> ret = new List<DropdownHierarchy>();
            List<DropdownHierarchy> sub = new List<DropdownHierarchy>();

            IEnumerable<BasicDropdown> mrktSegComb = _dataCollectionsDataLib.GetBasicDropdowns().
                Where(dd => dd.ATRB_CD.ToUpper() == prnt.ToUpper()).OrderBy(dd => dd.DROP_DOWN); ;
            IEnumerable<BasicDropdown> mrktSubSeg = _dataCollectionsDataLib.GetBasicDropdowns().
                Where(dd => dd.ATRB_CD.ToUpper() == chld.ToUpper()).OrderBy(dd => dd.DROP_DOWN);

            foreach (BasicDropdown bd in mrktSubSeg)
            {
                DropdownHierarchy newDH = new DropdownHierarchy(bd);
                sub.Add(newDH);
            }

            foreach (BasicDropdown bd in mrktSegComb)
            {
                DropdownHierarchy newDH = new DropdownHierarchy(bd);
                if (bd.DROP_DOWN.ToUpper() == chldDropdown.subAtrbValue.ToUpper())
                {
                    newDH.items = sub.ToArray();
                    newDH.expanded = true; //this sets dropdown items with children nodes to be expanded/notexpanded by default
                }
                ret.Add(newDH);
            }
            return ret.ToArray();
        }

        /// <summary>
		/// Get All Deal Types Dropdowns
		/// </summary>
		/// <returns>list of Deal Types Dropdowns</returns>
		public List<Dropdown> GetDealTypesDropdown()
        {
            return GetDropdowns().Where(dd => dd.dropdownCategory == "All Deal Types" && dd.active == 1).OrderBy(dd => dd.dropdownName).ToList();
        }

        /// <summary>
        /// Get All Role Types Dropdown
        /// </summary>
        /// <returns>list of Role Types Dropdowns</returns>
        public List<Dropdown> GetRoleTypesDropdown()
        {
            return GetDropdowns().Where(dd => dd.dropdownCategory == "Application Role" && dd.subCategory == "MYDL" && dd.active == 1).ToList();
        }

        /// <summary>
        /// Get Security Action Dropdown
        /// </summary>
        /// <returns>list of Security Action Dropdowns</returns>
        public List<Dropdown> GetSecurityActionsDropdown()
        {
            return GetDropdowns().Where(dd => dd.dropdownCategory == "Action Security" && dd.active == 1).ToList();
        }

        /// <summary>
        /// Get Num Tiers Dropdown
        /// </summary>
        /// <returns>list of Num Tiers Dropdowns</returns>
        public List<Dropdown> GetNumTiersDropdown()
        {
            return GetDropdowns().Where(dd => dd.dropdownCategory == "Num Tiers" && dd.active == 1).OrderBy(dd => dd.dropdownID).ToList();
        }

        /// <summary>
        /// Get Geos Dropdown
        /// </summary>
        /// <returns>list of Num Tiers Dropdowns</returns>
        public List<Dropdown> GetGeosDropdown()
        {
            return GetDropdowns().Where(dd => dd.dropdownCategory == "Geo" && dd.active == 1).OrderBy(dd => dd.dropdownName).ToList();
        }

        /// <summary>
        /// Get All Dropdown Groups
        /// </summary>
        /// <returns>list of Dropdown Groups</returns>
        public List<Dropdown> GetDropdownGroups()
        {
            return GetDropdowns().Where(dd => dd.dropdownCategory == "Basic Dropdowns" && dd.active == 1).OrderBy(dd => dd.dropdownName).ToList();
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