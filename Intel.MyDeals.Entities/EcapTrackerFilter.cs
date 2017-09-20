using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
	public class EcapTrackerFilterData
	{
		public DateTime DEAL_STRT_DT { get; set; }
		public DateTime DEAL_END_DT { get; set; }
		public string GEO_COMBINED { get; set; }
		public int CUST_MBR_SID { get; set; }
		public int PRD_MBR_SID { get; set; }
	}

	public class EcapTrackerData : EcapTrackerFilterData
	{
		public int ORIG_ECAP_TRKR_NBR { get; set; }
		public int DC_ID { get; set; }
	}
}
