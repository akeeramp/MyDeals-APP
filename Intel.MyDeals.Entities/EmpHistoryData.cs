using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    
    public class EmpHistoryData
    {
        public DateTime CHG_DTM { get; set; }
        public DateTime EFF_FR_DTM { get; set; }
        public DateTime EFF_TO_DTM { get; set; }
        public bool ACTV_IND { get; set; }
        public string CHG_CMNTS { get; set; }
    }
}
