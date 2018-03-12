using System.Collections.Generic;
using Intel.Opaque.Tools;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
	public class SecurityDropdownData
	{
		public SecurityDropdownData(Dictionary<string, List<SecurityAttributesDropDown>> attributesByObjType, List<Dropdown> securityActions, List<OpDataElementSetTypeItem> dealTypes, List<Dropdown> adminRoleTypes, List<OpPair<int, string>> workFlowStages, List<OpDataElementTypeItem> objType)
		{
			AttributesByObjType = attributesByObjType;
			AdminDealTypes = dealTypes;
			AdminRoleTypes = adminRoleTypes;
			SecurityActions = securityActions;
			WorkFlowStages = workFlowStages;
			ObjTypes = objType;
		}
		public Dictionary<string, List<SecurityAttributesDropDown>> AttributesByObjType { get; set; }
		public List<Dropdown> SecurityActions { get; set; }
		public List<OpDataElementSetTypeItem> AdminDealTypes { get; set; }
		public List<Dropdown> AdminRoleTypes { get; set; }
		public List<OpPair<int, string>> WorkFlowStages { get; set; }
		public List<OpDataElementTypeItem> ObjTypes { get; set; }
	}
}
