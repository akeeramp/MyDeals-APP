using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class TenderTransferObject
    {
        public int Rqst_Sid { get; set; }
        public int Deal_Id { get; set; }
        public Guid Btch_Id { get; set; }
        public string Rqst_Json_Data { get; set; }
        public string Rqst_Sts { get; set; }
    }

}
