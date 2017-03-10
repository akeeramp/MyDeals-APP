using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
	public class SecurityMapSave
	{
		public int OBJ_TYPE_SID { get; set; }
		public int ROLE_TYPE_SID { get; set; }
		public int WFSTG_MBR_SID { get; set; }
		public int ATRB_SID { get; set; }
		public int SECUR_ACTN_SID { get; set; }
		public int CRE_EMP_WWID { get; set; }
		public DateTime CRE_DTM { get; set; }
		public int CHG_EMP_WWID { get; set; }
		public DateTime CHG_DTM { get; set; }
		public int OBJ_SET_TYPE_SID { get; set; }
	}
}
