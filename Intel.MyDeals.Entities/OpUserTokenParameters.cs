using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class OpUserTokenParameters
    {
        public int roleTypeId { get; set; }
        public int isDeveloper { get; set; }
        public int isTester { get; set; }
        public int isSuper { get; set; }
        public int isAdmin { get; set; }
        public int isFinanceAdmin { get; set; }
    }
}
