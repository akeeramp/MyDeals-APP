using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.Opaque.Tools;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
	public class SecurityDropdownData
	{
		public SecurityDropdownData(List<Dropdown> securityActions, List<OpDataElementSetTypeItem> dealTypes, List<Dropdown> adminRoleTypes, List<OpPair<int, string>> workFlowStages, List<OpDataElementTypeItem> objType)
		{
			AdminDealTypes = dealTypes;
			AdminRoleTypes = adminRoleTypes;
			SecurityActions = securityActions;
			WorkFlowStages = workFlowStages;
			ObjTypes = objType;
		}
		public List<Dropdown> SecurityActions { get; set; }
		public List<OpDataElementSetTypeItem> AdminDealTypes { get; set; }
		public List<Dropdown> AdminRoleTypes { get; set; }
		public List<OpPair<int, string>> WorkFlowStages { get; set; }
		public List<OpDataElementTypeItem> ObjTypes { get; set; }
	}
}
