using System.Collections.Generic;
using System.ComponentModel;
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

        [DataMember]
        public System.Boolean COLUMN_TYPE { set; get; }

        [DataMember]
        public System.String MOD_USR_INPUT { set; get; }
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

    public class SearchString
    {
        /// <summary>
        /// Search string name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Type of search string, EPM name, GDM Family Name etc..
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// Type of search string, EPM name, GDM Family Name etc..
        /// </summary>
        public string DisplayType { get; set; }
    }

    /// <summary>
    /// These enums hold the attributes against which user can do search
    /// </summary>
    public enum ProductHierarchyLevelsEnum
    {
        None = 0,

        [Description("Product Type")]
        DEAL_PRD_TYPE = 7002,

        [Description("Product Category")]
        PRD_CAT_NM = 7003,

        [Description("Brand")]
        BRND_NM = 7004,

        [Description("Family")]
        FMLY_NM = 7005,

        [Description("Processor")]
        PCSR_NBR = 7006,

        [Description("L4")]
        DEAL_PRD_NM = 7007,

        [Description("Material Id")]
        MTRL_ID = 7008,

        [Description("EPM Name")]
        EPM_NM = 1,

        [Description("Family")]
        GDM_FMLY_NM = 2,

        [Description("NAND Family")]
        NAND_FAMILY = 3,

        [Description("NAND Density")]
        NAND_DENSITY = 4
    }
}