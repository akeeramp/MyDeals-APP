using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
	public class EcapTrackerFilter
	{
		public DateTime DEAL_STRT_DT { get; set; }
		public DateTime DEAL_END_DT { get; set; }
		public int GEO_MBR_SID { get; set; }
		public int CUST_MBR_SID { get; set; }
		public int PRD_MBR_SID { get; set; }

	}
}
