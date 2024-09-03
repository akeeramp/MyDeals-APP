using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class RpdValidation
    {
        public string CYCLE_NM { get; set; }

        public DateTime CURR_STRT_DT { get; set; }

        public DateTime CURR_END_DT { get; set; }

        public string CPU_VRT_NM { get; set; }

        public string CPU_SKU_NM { get; set; }

        public string CPU_PROCESSOR_NUMBER { get; set; }

        public int CPU_FLR { get; set; }

        public int APAC_PD { get; set; }

        public int IJKK_PD { get; set; }

        public int PRC_PD { get; set; }

        public int EMEA_PD { get; set; }

        public int ASMO_PD { get; set; }

        public string IS_DELETE { get; set; }

        public object ERROR { get; set; }
    }
}
