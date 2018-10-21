using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities.Custom
{
    public class DealProducts : Entities.DealProducts
    {
        [DataMember]
        public new System.Decimal? PRD_COST { get; set; }
    }
}