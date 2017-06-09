using System.Collections.Generic;
using System.Runtime.Serialization;

/// <summary>
/// TODO: Mahesh Cleanup this file unnecessary classes
/// </summary>
namespace Intel.MyDeals.Entities
{
    internal class MyProductCollections
    {
    }

    [DataContract]
    public partial class ProductAttributeSelected
    {
        [DataMember]
        public System.String ATRB_SID_INC { set; get; }

        [DataMember]
        public System.String ATRB_SID_EXC { set; get; }
    }

    public class ProductIncExcAttributeSelector
    {
        public List<IncExcAttributeMaster> IncExcAttributeMaster { get; set; }
        public List<ProductAttributeSelected> ProductIncExcAttributeSelected { get; set; }
    }

    [DataContract]
    public partial class ProductEntryAttribute
    {
        [DataMember]
        public System.Int32 ROW_NUMBER { set; get; }

        [DataMember]
        public System.String USR_INPUT { set; get; }

        [DataMember]
        public System.String EXCLUDE { set; get; }

        [DataMember]
        public System.String FILTER { set; get; }

        [DataMember]
        public System.String START_DATE { set; get; }

        [DataMember]
        public System.String END_DATE { set; get; }

        [DataMember]
        public System.String GEO_COMBINED { set; get; }

        [DataMember]
        public System.String PROGRAM_PAYMENT { set; get; }
    }

    [DataContract]
    public partial class ProductIEValues
    {
        [DataMember]
        public System.String PROD_NAMES { set; get; }

        [DataMember]
        public System.String SEL_LVL { set; get; }

        [DataMember]
        public System.String EXL_CRT { set; get; }

        [DataMember]
        public System.String FILTER { set; get; }

        [DataMember]
        public System.String START_DATE { set; get; }

        [DataMember]
        public System.String END_DATE { set; get; }
    }

    [DataContract]
    public partial class ProductIncExcAttribute
    {
        [DataMember]
        public System.String ATTR_VAL { set; get; }
    }

    [DataContract]
    public partial class MatchedProductSelector
    {
        [DataMember]
        public System.Int32 PRD_MBR_SID { set; get; }

        public System.String DEAL_PRD_NM { set; get; }

        public System.String PROD_NAMES { set; get; }
    }
}