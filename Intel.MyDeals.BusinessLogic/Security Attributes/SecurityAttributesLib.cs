using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
	public class SecurityAttributesLib : ISecurityAttributesLib
	{
		private readonly ISecurityAttributesDataLib _securityAttributesDataLib;
		private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

		public SecurityAttributesLib(ISecurityAttributesDataLib _securityAttributesDataLib, IDataCollectionsDataLib _dataCollectionsDataLib)
		{
			this._securityAttributesDataLib = _securityAttributesDataLib;
			this._dataCollectionsDataLib = _dataCollectionsDataLib;
		}

		/// <summary>
		/// TODO: This parameterless constructor is left as a reminder,
		/// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
		/// </summary>
		public SecurityAttributesLib()
		{
			this._securityAttributesDataLib = new SecurityAttributesDataLib();
		}

		#region Security Mapping

		public Dictionary<string, Dictionary<string, Dictionary<string, List<string>>>> GetObjAtrbs()
		{
			List<SecurityAttributesDropDown> attributesList = _dataCollectionsDataLib.GetObjAtrbs();

			Dictionary<string, Dictionary<string, Dictionary<string, List<string>>>> objTypes = new Dictionary<string, Dictionary<string, Dictionary<string, List<string>>>>();
			Dictionary<string, List<string>> objsetTypesOfAttributes = new Dictionary<string, List<string>>();

			List<OpDataElementTypeItem> objTypeList = OpDataElementTypeRepository.OpDetCollection.Items; // attributesList.Select(x => x.OBJ_TYPE).Distinct().ToList();
	
			Dictionary<OpDataElementType, List<OpDataElementSetType>> objDict = OpDataElementSetTypeRepository.OpDestCollection.Heirarchy;

		    var workFlows = DataCollections.GetWorkFlowItems();

            // Create dictionary of ObjTypes and Attributes for easy lookup		
            foreach (KeyValuePair<OpDataElementType, List<OpDataElementSetType>> objKey in objDict)
			{
				OpDataElementTypeItem objTypeKey = objTypeList.Find(x => x.OpDeType == objKey.Key);

				foreach (OpDataElementSetType objsetTypeKey in objKey.Value)
				{
					// TODO: All_Types should not be hard-coded 
					List<string> atrbList = attributesList.Where(x => x.OBJ_TYPE_SID == objTypeKey.Id && (x.OBJ_SET_TYPE == objsetTypeKey.ToString() || x.OBJ_SET_TYPE == "ALL_TYPES")).Select(x => x.ATRB_COL_NM).Distinct().ToList();
					objsetTypesOfAttributes[objsetTypeKey.ToString()] = atrbList;
				}
			    if (!objTypes.ContainsKey(objTypeKey.Alias))
			    {
                    objTypes[objTypeKey.Alias] = new Dictionary<string, Dictionary<string, List<string>>>();
                }
                objTypes[objTypeKey.Alias]["ATTRBS"] = objsetTypesOfAttributes;

			    objTypes[objTypeKey.Alias]["STAGES"] = new Dictionary<string, List<string>>();
                foreach (WorkFlows workFlow in workFlows.Where(w => w.OBJ_TYPE_SID == objTypeKey.Id).Distinct())
                {
                    if (!objTypes[objTypeKey.Alias]["STAGES"].ContainsKey(workFlow.WFSTG_MBR_SID.ToString()))
                    {
                        objTypes[objTypeKey.Alias]["STAGES"][workFlow.WFSTG_MBR_SID.ToString()] = new List<string> { workFlow.WFSTG_CD_SRC };
                    }
                    if (!objTypes[objTypeKey.Alias]["STAGES"].ContainsKey(workFlow.WFSTG_DEST_MBR_SID.ToString()))
                    {
                        objTypes[objTypeKey.Alias]["STAGES"][workFlow.WFSTG_DEST_MBR_SID.ToString()] = new List<string> { workFlow.WFSTG_CD_DEST };
                    }
                }

                // Clear Lists for next iteration
                objsetTypesOfAttributes = new Dictionary<string, List<string>>();
			}

            // Now, we must copy the Pricing Strategy Stages all the way down to WIP Deals
            if (objTypes.ContainsKey(OpDataElementType.PRC_ST.ToString()))
		    {
                if (objTypes.ContainsKey(OpDataElementType.PRC_TBL.ToString()))
                    objTypes[OpDataElementType.PRC_TBL.ToString()]["STAGES"] = objTypes[OpDataElementType.PRC_ST.ToString()]["STAGES"];
                if (objTypes.ContainsKey(OpDataElementType.PRC_TBL_ROW.ToString()))
                    objTypes[OpDataElementType.PRC_TBL_ROW.ToString()]["STAGES"] = objTypes[OpDataElementType.PRC_ST.ToString()]["STAGES"];
                if (objTypes.ContainsKey(OpDataElementType.WIP_DEAL.ToString()))
                    objTypes[OpDataElementType.WIP_DEAL.ToString()]["STAGES"] = objTypes[OpDataElementType.PRC_ST.ToString()]["STAGES"];
            }

            return objTypes;
		}

		public bool SaveSecurityMappings(List<SecurityMapSave> saveMappings)
		{
			return _securityAttributesDataLib.SaveSecurityMappings(saveMappings);
		}
		
		public SecurityWrapper GetSecurityMasks()
		{
			return DataCollections.GetSecurityWrapper();
		}		
		#endregion
		
		#region SecurityActions

		public List<SecurityActions> GetSecurityActions()
		{
			return _dataCollectionsDataLib.GetSecurityActions();
		}

		public SecurityActions ManageSecurityAction(SecurityActions action, CrudModes state)
		{
			return _securityAttributesDataLib.ManageSecurityAction(action, state);
		}

		public bool DeleteSecurityAction(int id)
		{
			return _securityAttributesDataLib.DeleteSecurityAction(id);
		}

		#endregion SecurityActions

		#region Admin Applications

		public List<AdminApplications> GetAdminApplications()
		{
			return _dataCollectionsDataLib.GetAdminApplications();
		}

		public AdminApplications ManageAdminApplication(AdminApplications app, CrudModes state)
		{
			return _securityAttributesDataLib.ManageAdminApplication(app, state);
		}

		public bool DeleteAdminApplication(int id)
		{
			return _securityAttributesDataLib.DeleteAdminApplication(id);
		}

		#endregion Admin Applications

		#region Admin DealTypes

		public List<AdminDealType> GetAdminDealTypes()
		{
			return _dataCollectionsDataLib.GetAdminDealTypes();
		}

		public AdminDealType ManageAdminDealType(AdminDealType dealType, CrudModes state)
		{
			return _securityAttributesDataLib.ManageAdminDealType(dealType, state);
		}

		public bool DeleteAdminDealType(int id)
		{
			return _securityAttributesDataLib.DeleteAdminDealType(id);
		}

		#endregion Admin DealTypes

		#region Admin RoleTypes

		public List<AdminRoleType> GetAdminRoleTypes()
		{
			return _dataCollectionsDataLib.GetAdminRoleTypes();
		}

		public AdminRoleType ManageAdminRoleType(AdminRoleType roleType, CrudModes state)
		{
			return _securityAttributesDataLib.ManageAdminRoleType(roleType, state);
		}

		public bool DeleteAdminRoleType(int id)
		{
			return _securityAttributesDataLib.DeleteAdminRoleType(id);
		}

		#endregion Admin RoleTypes
	}
}