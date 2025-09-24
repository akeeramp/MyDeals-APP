using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class ComplexStacking
    {
        public List<ComplexStackingDealGroup> GroupItems { get; set; }
        public List<ComplexStackingDealInfo> DealInfos { get; set; }
    }

    public class ComplexStackingDealGroup
    {
        public int ObjID { get; set; }
        public int ObjType { get; set; }
        public int PickedDeal { get; set; }
        public int Group { get; set; }
        public string AssociatedDeals { get; set; }
    }

    public class ComplexStackingDealInfo
    {
        public int WIP_DEAL_OBJ_SID { get; set; }
        public string WF_STG_CD { get; set; }
        public decimal MAX_RPU { get; set; }
        public string START_DT { get; set; }
        public string END_DT { get; set; }
        public string GEO_COMBINED { get; set; }
        public string ECAP_TYPE { get; set; }
        public string PRODUCT_NM { get; set; }
        public decimal ECAP_PRICE { get; set; }
        public string CUST_ACCNT_DIV { get; set; }
        public string CONTRACT_NM { get; set; }
        public string DealType { get; set; }
        public string PCSR_NBR { get; set; }
    }

    public class OvlpComplexObj
    {
        public int ObjID { get; set; }
        public int ObjType { get; set; }
    }

    public class OvlpComplexUpdateObj
    {
        public int ObjID { get; set; }
        public int ObjType { get; set; }
    }

    public class SkipPCTMCTFailureObj
    {
        public int ObjID { get; set; }
        public int ObjType { get; set; }
    }
}
