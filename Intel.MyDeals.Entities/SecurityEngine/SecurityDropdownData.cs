using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.Entities
{
	public class SecurityDropdownData
	{
		public SecurityDropdownData(List<OpPair<int, string>> securityActions, List<OpPair<int, string>> adminDealTypes, List<OpPair<int, string>> adminRoleTypes, List<OpPair<int, string>> workFlowStages)
		{
			AdminDealTypes = adminDealTypes;
			AdminRoleTypes = adminRoleTypes;
			SecurityActions = securityActions;
			WorkFlowStages = workFlowStages;
		}
		public List<OpPair<int, string>> SecurityActions { get; set; }
		public List<OpPair<int, string>> AdminDealTypes { get; set; }
		public List<OpPair<int, string>> AdminRoleTypes { get; set; }
		public List<OpPair<int, string>> WorkFlowStages { get; set; }
	}
}
