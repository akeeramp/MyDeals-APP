using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    class MyProductCollections
    {

    }
        
    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on SAURAVKU-MOBL
    /// by sauravku
    /// at 3/21/2017 3:02:38 PM
    ///</summary>

    [DataContract]
    public partial class ProductIncAttributeSelected
    {
        [DataMember]
        public System.String ATRB_SID_INC { set; get; }
    }

    [DataContract]
    public partial class ProductExcAttributeSelected
    {
        [DataMember]
        public System.String ATRB_SID_EXC { set; get; }
    }

    public class ProductIncExcAttributeSelector
    {
        public List<IncExcAttributeMaster> IncExcAttributeMaster { get; set; }
        public List<ProductIncAttributeSelected> ProductIncAttributeSelected { get; set; }
        public List<ProductExcAttributeSelected> ProductExcAttributeSelected { get; set; }

    }

    [DataContract]
    public partial class ProductEntryAttribute
    {
        [DataMember]
        public System.String USR_INPUT { set; get; }

        [DataMember]
        public System.Int32 PRD_ATRB_SID { set; get; }

        [DataMember]
        public System.String PRD_SELC_LVL { set; get; }

        [DataMember]
        public System.String EXCLUDE { set; get; }

        [DataMember]
        public System.String FILTER { set; get; }

        [DataMember]
        public System.String START_DATE { set; get; }


        [DataMember]
        public System.String END_DATE { set; get; }


        /*
        private static List<WorkFlowAttribute> WorkFlowAttributeFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<WorkFlowAttribute>();
        int IDX_COL_NM = DB.GetReaderOrdinal(rdr, "COL_NM");
        int IDX_Key = DB.GetReaderOrdinal(rdr, "Key");
        int IDX_Value = DB.GetReaderOrdinal(rdr, "Value");

        while (rdr.Read()){
        ret.Add(new WorkFlowAttribute {
        COL_NM = (IDX_COL_NM < 0 || rdr.IsDBNull(IDX_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COL_NM),
        Key = (IDX_Key < 0 || rdr.IsDBNull(IDX_Key)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Key),
        Value = (IDX_Value < 0 || rdr.IsDBNull(IDX_Value)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Value)
        });
        } // while
        return ret;
        }
        */

    } // End of class WorkFlowAttribute

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


        /*
        private static List<WorkFlowAttribute> WorkFlowAttributeFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<WorkFlowAttribute>();
        int IDX_COL_NM = DB.GetReaderOrdinal(rdr, "COL_NM");
        int IDX_Key = DB.GetReaderOrdinal(rdr, "Key");
        int IDX_Value = DB.GetReaderOrdinal(rdr, "Value");

        while (rdr.Read()){
        ret.Add(new WorkFlowAttribute {
        COL_NM = (IDX_COL_NM < 0 || rdr.IsDBNull(IDX_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COL_NM),
        Key = (IDX_Key < 0 || rdr.IsDBNull(IDX_Key)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Key),
        Value = (IDX_Value < 0 || rdr.IsDBNull(IDX_Value)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Value)
        });
        } // while
        return ret;
        }
        */

    } // End of class WorkFlowAttribute

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
