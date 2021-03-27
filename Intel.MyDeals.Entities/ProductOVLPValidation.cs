using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class ProductOVLPValidation
    {
        public List<ProductMember> AcrInc { get; set; }
        public List<int> AcrExc { get; set; }
        public List<ProductMember> DrnInc { get; set; }
        public List<int> DrnExc { get; set; }
    }
}
