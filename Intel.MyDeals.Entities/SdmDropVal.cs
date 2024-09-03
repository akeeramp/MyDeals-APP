using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class SdmDropVal
    {
        public string filter { get; set; }
        public string colNm { get; set; }
        public string tblNm { get; set; }
        public string addlFilter { get; set; }
        public bool addRow { get; set; }
    }
}
