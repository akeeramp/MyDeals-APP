using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class ContractToken
    {
        public int ContractId { get; set; }
        public int CustId { get; set; }
        public bool DelPtr { get; set; }
    }
}
