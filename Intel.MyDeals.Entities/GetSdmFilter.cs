using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class GetSdmFilter
    {
        public int take { get; set; }
        public int skip { get; set; }
        public string orderBy { get; set; }
        public string whereStg { get; set; }
        public bool pageChange { get; set; }
    }
}
