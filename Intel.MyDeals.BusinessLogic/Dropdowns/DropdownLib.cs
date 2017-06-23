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
                    //newDH.expanded = true; //this sets dropdown items with children nodes to be expanded/notexpanded by default
                }
                ret.Add(newDH);
            }
            return ret.ToArray();
        }

        /// <summary>
        /// Returns a dropdown hierarchy object for GEOs using the provided parent(s) name.
        /// </summary>
        /// <returns>dropdown hierarchy</returns>
        public DropdownHierarchy[] GetGeoDropdownHierarchy(string prnt)
        {
            IEnumerable<GeoDimension> geodim = _dataCollectionsDataLib.GetGeoData().Where(geo => geo.ACTV_IND == true);

            List<DropdownHierarchy> ret = new List<DropdownHierarchy>();

            //check if comma exists in provided string
            string[] geoCombined = prnt.Split(',');

            //for each parent geo, build a dropdown hierarchy
            for (int i = 0; i < geoCombined.Length; i++)
            {
                //create basic dropdown from provided geo
                BasicDropdown newBD_Geo = new BasicDropdown();
                newBD_Geo.DROP_DOWN = geoCombined[i];
                newBD_Geo.ATRB_LKUP_DESC = "GEO";

                //using created basic dropdown, use that to seed a new dropdownhierarchy
                DropdownHierarchy newDH_Geo = new DropdownHierarchy(newBD_Geo);
                //newDH_Geo.expanded = true;

                //create this geo's regions/country hierarchies
                List<DropdownHierarchy> regions = new List<DropdownHierarchy>();
                IEnumerable<GeoDimension> geo_regions = geodim.Where(geo => geo.GEO_NM.ToUpper() == newDH_Geo.DROP_DOWN.ToUpper() && (geo.RGN_NM != null && geo.RGN_NM != "") && (geo.CTRY_NM == null || geo.CTRY_NM == ""));
                foreach (GeoDimension region in geo_regions)
                {
                    //rinse and repeat like above, but for regions instead of geos
                    BasicDropdown newBD_Region = new BasicDropdown();
                    newBD_Region.DROP_DOWN = region.RGN_NM;
                    newBD_Region.ATRB_LKUP_DESC = "REGION";

                    DropdownHierarchy newDH_Region = new DropdownHierarchy(newBD_Region);
                    //newDH_Region.expanded = true;

                    List<DropdownHierarchy> countries = new List<DropdownHierarchy>();
                    IEnumerable<GeoDimension> region_countries = geodim.Where(geo => geo.GEO_NM.ToUpper() == geoCombined[i].ToUpper() && geo.RGN_NM == newDH_Region.DROP_DOWN && (geo.CTRY_NM != null && geo.CTRY_NM != ""));
                    foreach (GeoDimension country in region_countries)
                    {
                        //rinse and repeat like above, but for countries instead of regions
                        BasicDropdown newBD_Country = new BasicDropdown();
                        newBD_Country.DROP_DOWN = country.CTRY_NM;
                        newBD_Country.ATRB_LKUP_DESC = "COUNTRY";

                        DropdownHierarchy newDH_Country = new DropdownHierarchy(newBD_Country);
                        //newDH_Country.expanded = true;

                        countries.Add(newDH_Country);
                    }
                    newDH_Region.items = countries.ToArray();

                    regions.Add(newDH_Region);
                }
                newDH_Geo.items = regions.ToArray();

                ret.Add(newDH_Geo);
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
		/// Get Num Tiers Dropdown
		/// </summary>
		/// <returns>list of Num Tiers Dropdowns</returns>
		public List<Dropdown> GetProductLevelDropdown()
		{
			return GetDropdowns().Where(dd => dd.dropdownCategory == "Product Level" && dd.active == 1).OrderBy(dd => dd.dropdownID).ToList();
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
				
		//// TODO: Either uncomment the below out or remove it once we re-add Retail Cycle in
		//public List<Dropdown> GetRetailPullSDMDropdown(RetailPullParams filterData)
		//{
		//	List<Dropdown> result = new List<Dropdown>();
		//	List<RetailPull> retailPullSDMList = _dataCollectionsDataLib.GetRetailPullSDMList();
						
		//	List<Dropdown> myList = retailPullSDMList.Where(r =>
		//		r.PRD_MBR_SID == filterData.PRD_MBR_SID // TODO: we need this to be replaced with DEAL_PRD_NM because users might enter 7008 instead of 7007
		//		&& (filterData.DealStartDate < r.CURR_END_DT)
		//		&& filterData.DealEndDate > r.CURR_STRT_DT 
		//	)
		//	.OrderBy(dd => dd.PRD_MBR_SID)
		//	.Select(x => new Dropdown { dropdownName = x.CYCLE_NM }).ToList<Dropdown>();
			
		//	return myList;
		//}
		
		public List<Dropdown> GetSoldToIdDropdown(int custId)
		{
			List<Dropdown> result = new List<Dropdown>();
			List<SoldToIds> soldToIdList = _dataCollectionsDataLib.GetSoldToIdList();

			List<Dropdown> myList = soldToIdList.Where(r =>
				r.CUST_NM_SID == custId
				&& r.ACTV_IND
			)
			.OrderBy(dd => dd.SOLD_TO_ID)
			.Select(x => new Dropdown { dropdownName = x.SOLD_TO_ID }).ToList<Dropdown>();

			return myList;
		}
	}
}