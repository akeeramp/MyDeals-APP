using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class DashboardPacket
    {
        public DashboardPacket()
        {
            SearchDashResults = new List<DashboardContractSummary>();
            SearchDashCount = new List<DashboardContractSummaryCount>();
            CustFltr = new List<string>();
        }

        public List<DashboardContractSummary> SearchDashResults { get; set; }
        public List<DashboardContractSummaryCount> SearchDashCount { get; set; }
        public List<string> CustFltr { get; set; }
    }
}
