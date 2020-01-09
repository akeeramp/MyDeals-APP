using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Intel.Opaque.DBAccess;

namespace Intel.MyDeals.Entities
{
    //[DataContract]
    //public partial class PRD_LOOKUP_RESULTS_tempWithCAP : PRD_TRANSLATION_RESULTS
    //{
    //    //[DataMember]
    //    //public System.Int32 PRD_MBR_SID { get; set; }
    //    //[DataMember]
    //    //public System.DateTime DEAL_START_DATE { get; set; }
    //    //[DataMember]
    //    //public System.DateTime DEAL_END_DATE { get; set; }

    //    [DataMember]
    //    public System.Int32 CUST_MBR_SID { get; set; }

    //    //[DataMember]
    //    //public System.Int32 RowNumber { set; get; }
    //    //[DataMember]
    //    //public System.Int32 PRD_MBR_SID { set; get; }
    //    //[DataMember]
    //    //public System.String HIER_VAL_NM { set; get; }
    //    [DataMember]
    //    public System.String GEO_MBR_SID { set; get; }

    //    //[DataMember]
    //    //public System.Int32 CUST_MBR_SID { set; get; }
    //    [DataMember]
    //    public System.Decimal CAP { set; get; }

    //    [DataMember]
    //    public System.DateTime CAP_START_DATE { set; get; }

    //    [DataMember]
    //    public System.DateTime CAP_END_DATE { set; get; }

    //    [DataMember]
    //    public System.String CAP_PRC_COND { set; get; }

    //    [DataMember]
    //    public System.String Flag_pick { set; get; }

    //    [DataMember]
    //    public System.Decimal YCS2 { set; get; }

    //    [DataMember]
    //    public System.DateTime YCS2_Start_Date { set; get; }

    //    [DataMember]
    //    public System.DateTime YCS2_End_Date { set; get; }
    //}

    [DataContract]
    public partial class EmployeeGeo
    {
        [DataMember]
        public System.Boolean ACTV_IND { set; get; }

        [DataMember]
        public System.Int32 EMP_WWID { set; get; }

        [DataMember]
        public System.Int32 GEO_MBR_SID { set; get; }

        [DataMember]
        public System.String GEO_NM { set; get; }

        /*
        private static List<EmployeeGeo> EmployeeGeoFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<EmployeeGeo>();
        int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
        int IDX_GEO_MBR_SID = DB.GetReaderOrdinal(rdr, "GEO_MBR_SID");
        int IDX_GEO_NM = DB.GetReaderOrdinal(rdr, "GEO_NM");

        while (rdr.Read()){
        ret.Add(new EmployeeGeo {
        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACTV_IND] == 1),
        EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
        GEO_MBR_SID = (IDX_GEO_MBR_SID < 0 || rdr.IsDBNull(IDX_GEO_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GEO_MBR_SID),
        GEO_NM = (IDX_GEO_NM < 0 || rdr.IsDBNull(IDX_GEO_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO_NM)
        });
        } // while
        return ret;
        }
        */
    } // End of class EmployeeGeo

    [DataContract]
    public partial class EmployeeRole
    {
        [DataMember]
        public System.Boolean ACTV_IND { set; get; }

        [DataMember]
        public System.Int32 EMP_WWID { set; get; }

        [DataMember]
        public System.String ROLE_TYPE_CD { set; get; }

        [DataMember]
        public System.Int32 ROLE_TYPE_SID { set; get; }

        /*
        private static List<EmployeeRole> EmployeeRoleFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<EmployeeRole>();
        int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
        int IDX_ROLE_TYPE_CD = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_CD");
        int IDX_ROLE_TYPE_SID = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_SID");

        while (rdr.Read()){
        ret.Add(new EmployeeRole {
        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACTV_IND] == 1),
        EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
        ROLE_TYPE_CD = (IDX_ROLE_TYPE_CD < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_CD),
        ROLE_TYPE_SID = (IDX_ROLE_TYPE_SID < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TYPE_SID)
        });
        } // while
        return ret;
        }
        */
    } // End of class EmployeeRole

    [DataContract]
    public partial class EmployeeVertical
    {
        [DataMember]
        public System.Boolean ACTV_IND { set; get; }

        [DataMember]
        public System.Int32 EMP_WWID { set; get; }

        [DataMember]
        public System.String PRD_CATEGORY_NAME { set; get; }

        [DataMember]
        public System.Int32 PRD_MBR_SID { set; get; }

        /*
        private static List<EmployeeVertical> EmployeeVerticalFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<EmployeeVertical>();
        int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
        int IDX_PRD_CATEGORY_NAME = DB.GetReaderOrdinal(rdr, "PRD_CATEGORY_NAME");
        int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");

        while (rdr.Read()){
        ret.Add(new EmployeeVertical {
        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACTV_IND] == 1),
        EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
        PRD_CATEGORY_NAME = (IDX_PRD_CATEGORY_NAME < 0 || rdr.IsDBNull(IDX_PRD_CATEGORY_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CATEGORY_NAME),
        PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID)
        });
        } // while
        return ret;
        }
        */
    } // End of class EmployeeVertical

    [DataContract]
    public partial class EmployeeBasicData
    {
        [DataMember]
        public System.Boolean ACTV_IND { set; get; }

        [DataMember]
        public System.String EMAIL_ADDR { set; get; }

        [DataMember]
        public System.Int32 EMP_WWID { set; get; }

        [DataMember]
        public System.String FIRST_NAME { set; get; }

        [DataMember]
        public System.String IDSID { set; get; }

        [DataMember]
        public System.String LAST_NAME { set; get; }

        [DataMember]
        public System.String MIDDLE_NAME { set; get; }

        [DataMember]
        public System.String PHONE_NUMBER { set; get; }

        /*
        private static List<EmployeeBasicData> EmployeeBasicDataFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<EmployeeBasicData>();
        int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        int IDX_EMAIL_ADDR = DB.GetReaderOrdinal(rdr, "EMAIL_ADDR");
        int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
        int IDX_FIRST_NAME = DB.GetReaderOrdinal(rdr, "FIRST_NAME");
        int IDX_IDSID = DB.GetReaderOrdinal(rdr, "IDSID");
        int IDX_LAST_NAME = DB.GetReaderOrdinal(rdr, "LAST_NAME");
        int IDX_MIDDLE_NAME = DB.GetReaderOrdinal(rdr, "MIDDLE_NAME");
        int IDX_PHONE_NUMBER = DB.GetReaderOrdinal(rdr, "PHONE_NUMBER");

        while (rdr.Read()){
        ret.Add(new EmployeeBasicData {
        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACTV_IND] == 1),
        EMAIL_ADDR = (IDX_EMAIL_ADDR < 0 || rdr.IsDBNull(IDX_EMAIL_ADDR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EMAIL_ADDR),
        EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
        FIRST_NAME = (IDX_FIRST_NAME < 0 || rdr.IsDBNull(IDX_FIRST_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FIRST_NAME),
        IDSID = (IDX_IDSID < 0 || rdr.IsDBNull(IDX_IDSID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_IDSID),
        LAST_NAME = (IDX_LAST_NAME < 0 || rdr.IsDBNull(IDX_LAST_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LAST_NAME),
        MIDDLE_NAME = (IDX_MIDDLE_NAME < 0 || rdr.IsDBNull(IDX_MIDDLE_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MIDDLE_NAME),
        PHONE_NUMBER = (IDX_PHONE_NUMBER < 0 || rdr.IsDBNull(IDX_PHONE_NUMBER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PHONE_NUMBER)
        });
        } // while
        return ret;
        }
        */
    } // End of class EmployeeBasicData

    [DataContract]
    public partial class ApplicationRoleLookup
    {
        [DataMember]
        public System.String APPL_CD { set; get; }

        [DataMember]
        public System.Byte APPL_SID { set; get; }

        [DataMember]
        public System.String APPL_SUITE { set; get; }

        [DataMember]
        public System.Boolean IS_SINGLE_SELECT { set; get; }

        [DataMember]
        public System.String ROLE_SCOPE { set; get; }

        [DataMember]
        public System.String ROLE_TYPE_CD { set; get; }

        [DataMember]
        public System.Int32 ROLE_TYPE_SID { set; get; }

        /*
        private static List<ApplicationRoleLookup> ApplicationRoleLookupFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<ApplicationRoleLookup>();
        int IDX_APPL_CD = DB.GetReaderOrdinal(rdr, "APPL_CD");
        int IDX_APPL_SID = DB.GetReaderOrdinal(rdr, "APPL_SID");
        int IDX_APPL_SUITE = DB.GetReaderOrdinal(rdr, "APPL_SUITE");
        int IDX_IS_SINGLE_SELECT = DB.GetReaderOrdinal(rdr, "IS_SINGLE_SELECT");
        int IDX_ROLE_SCOPE = DB.GetReaderOrdinal(rdr, "ROLE_SCOPE");
        int IDX_ROLE_TYPE_CD = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_CD");
        int IDX_ROLE_TYPE_SID = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_SID");

        while (rdr.Read()){
        ret.Add(new ApplicationRoleLookup {
        APPL_CD = (IDX_APPL_CD < 0 || rdr.IsDBNull(IDX_APPL_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APPL_CD),
        APPL_SID = (IDX_APPL_SID < 0 || rdr.IsDBNull(IDX_APPL_SID)) ? default(System.Byte) : rdr.GetFieldValue<System.Byte>(IDX_APPL_SID),
        APPL_SUITE = (IDX_APPL_SUITE < 0 || rdr.IsDBNull(IDX_APPL_SUITE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APPL_SUITE),
        IS_SINGLE_SELECT = (IDX_IS_SINGLE_SELECT < 0 || rdr.IsDBNull(IDX_IS_SINGLE_SELECT)) ? default(System.Boolean) : ((int)rdr[IDX_IS_SINGLE_SELECT] == 1),
        ROLE_SCOPE = (IDX_ROLE_SCOPE < 0 || rdr.IsDBNull(IDX_ROLE_SCOPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_SCOPE),
        ROLE_TYPE_CD = (IDX_ROLE_TYPE_CD < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_CD),
        ROLE_TYPE_SID = (IDX_ROLE_TYPE_SID < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TYPE_SID)
        });
        } // while
        return ret;
        }
        */
    } // End of class ApplicationRoleLookup

    //[DataContract]
    //public partial class CustomerItem
    //{
    //    [DataMember]
    //    public System.Int32 access_type { set; get; }

    //    [DataMember]
    //    public System.Boolean actv_ind { set; get; }

    //    [DataMember]
    //    public System.Int32 cdms_cust_div_id { set; get; }

    //    [DataMember]
    //    public System.Int32 cdms_cust_id { set; get; }

    //    [DataMember]
    //    public System.String cust_chnl { set; get; }

    //    [DataMember]
    //    public System.String cust_div_nm { set; get; }

    //    [DataMember]
    //    public System.Int32 cust_lvl_id { set; get; }

    //    [DataMember]
    //    public System.String cust_nm { set; get; }

    //    [DataMember]
    //    public System.String cust_type { set; get; }

    //    [DataMember]
    //    public System.String CustCategory { set; get; }

    //    [DataMember]
    //    public System.Int32 DEAL_FLG { set; get; }

    //    [DataMember]
    //    public System.String deal_type_cd { set; get; }

    //    [DataMember]
    //    public System.String disp_nm { set; get; }

    //    [DataMember]
    //    public System.String hosted_geo { set; get; }

    //    [DataMember]
    //    public System.Boolean IS_CORP_ACCNT { set; get; }

    //    [DataMember]
    //    public System.Int32 mail_notification { set; get; }

    //    /*
    //    private static List<CustomerItem> CustomerItemFromReader(SqlDataReader rdr){
    //    // This helper method is template generated.
    //    // Refer to that template for details to modify this code.

    //    var ret = new List<CustomerItem>();
    //    int IDX_access_type = DB.GetReaderOrdinal(rdr, "access_type");
    //    int IDX_actv_ind = DB.GetReaderOrdinal(rdr, "actv_ind");
    //    int IDX_cdms_cust_div_id = DB.GetReaderOrdinal(rdr, "cdms_cust_div_id");
    //    int IDX_cdms_cust_id = DB.GetReaderOrdinal(rdr, "cdms_cust_id");
    //    int IDX_cust_chnl = DB.GetReaderOrdinal(rdr, "cust_chnl");
    //    int IDX_cust_div_nm = DB.GetReaderOrdinal(rdr, "cust_div_nm");
    //    int IDX_cust_lvl_id = DB.GetReaderOrdinal(rdr, "cust_lvl_id");
    //    int IDX_cust_nm = DB.GetReaderOrdinal(rdr, "cust_nm");
    //    int IDX_cust_type = DB.GetReaderOrdinal(rdr, "cust_type");
    //    int IDX_CustCategory = DB.GetReaderOrdinal(rdr, "CustCategory");
    //    int IDX_DEAL_FLG = DB.GetReaderOrdinal(rdr, "DEAL_FLG");
    //    int IDX_deal_type_cd = DB.GetReaderOrdinal(rdr, "deal_type_cd");
    //    int IDX_disp_nm = DB.GetReaderOrdinal(rdr, "disp_nm");
    //    int IDX_hosted_geo = DB.GetReaderOrdinal(rdr, "hosted_geo");
    //    int IDX_IS_CORP_ACCNT = DB.GetReaderOrdinal(rdr, "IS_CORP_ACCNT");
    //    int IDX_mail_notification = DB.GetReaderOrdinal(rdr, "mail_notification");

    //    while (rdr.Read()){
    //    ret.Add(new CustomerItem {
    //    access_type = (IDX_access_type < 0 || rdr.IsDBNull(IDX_access_type)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_access_type),
    //    actv_ind = (IDX_actv_ind < 0 || rdr.IsDBNull(IDX_actv_ind)) ? default(System.Boolean) : ((int)rdr[IDX_actv_ind] == 1),
    //    cdms_cust_div_id = (IDX_cdms_cust_div_id < 0 || rdr.IsDBNull(IDX_cdms_cust_div_id)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cdms_cust_div_id),
    //    cdms_cust_id = (IDX_cdms_cust_id < 0 || rdr.IsDBNull(IDX_cdms_cust_id)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cdms_cust_id),
    //    cust_chnl = (IDX_cust_chnl < 0 || rdr.IsDBNull(IDX_cust_chnl)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_chnl),
    //    cust_div_nm = (IDX_cust_div_nm < 0 || rdr.IsDBNull(IDX_cust_div_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_div_nm),
    //    cust_lvl_id = (IDX_cust_lvl_id < 0 || rdr.IsDBNull(IDX_cust_lvl_id)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cust_lvl_id),
    //    cust_nm = (IDX_cust_nm < 0 || rdr.IsDBNull(IDX_cust_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_nm),
    //    cust_type = (IDX_cust_type < 0 || rdr.IsDBNull(IDX_cust_type)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_type),
    //    CustCategory = (IDX_CustCategory < 0 || rdr.IsDBNull(IDX_CustCategory)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CustCategory),
    //    DEAL_FLG = (IDX_DEAL_FLG < 0 || rdr.IsDBNull(IDX_DEAL_FLG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_FLG),
    //    deal_type_cd = (IDX_deal_type_cd < 0 || rdr.IsDBNull(IDX_deal_type_cd)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_deal_type_cd),
    //    disp_nm = (IDX_disp_nm < 0 || rdr.IsDBNull(IDX_disp_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_disp_nm),
    //    hosted_geo = (IDX_hosted_geo < 0 || rdr.IsDBNull(IDX_hosted_geo)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_hosted_geo),
    //    IS_CORP_ACCNT = (IDX_IS_CORP_ACCNT < 0 || rdr.IsDBNull(IDX_IS_CORP_ACCNT)) ? default(System.Boolean) : ((int)rdr[IDX_IS_CORP_ACCNT] == 1),
    //    mail_notification = (IDX_mail_notification < 0 || rdr.IsDBNull(IDX_mail_notification)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_mail_notification)
    //    });
    //    } // while
    //    return ret;
    //    }
    //    */
    //} // End of class CustomerItem

    [DataContract]
    public partial class UserPreference
    {
        [DataMember]
        public System.Int32 ID { set; get; }

        [DataMember]
        public System.String Preference { set; get; }

        [DataMember]
        public System.String Value { set; get; }

        [DataMember]
        public System.Int32 WWID { set; get; }

        /*
        private static List<UserPreference> UserPreferenceFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<UserPreference>();
        int IDX_ID = DB.GetReaderOrdinal(rdr, "ID");
        int IDX_Preference = DB.GetReaderOrdinal(rdr, "Preference");
        int IDX_Value = DB.GetReaderOrdinal(rdr, "Value");
        int IDX_WWID = DB.GetReaderOrdinal(rdr, "WWID");

        while (rdr.Read()){
        ret.Add(new UserPreference {
        ID = (IDX_ID < 0 || rdr.IsDBNull(IDX_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ID),
        Preference = (IDX_Preference < 0 || rdr.IsDBNull(IDX_Preference)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Preference),
        Value = (IDX_Value < 0 || rdr.IsDBNull(IDX_Value)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Value),
        WWID = (IDX_WWID < 0 || rdr.IsDBNull(IDX_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WWID)
        });
        } // while
        return ret;
        }
        */
    } // End of class UserPreference

    //[DataContract]
    //public partial class AppRoleTier
    //{
    //    [DataMember]
    //    public System.Boolean ACTV_IND { set; get; }

    //    [DataMember]
    //    public System.Boolean APPL_ACTV_IND { set; get; }

    //    [DataMember]
    //    public System.String APPL_CD { set; get; }

    //    [DataMember]
    //    public System.String APPL_DESC { set; get; }

    //    [DataMember]
    //    public System.Byte APPL_SID { set; get; }

    //    [DataMember]
    //    public System.String APPL_SUITE { set; get; }

    //    [DataMember]
    //    public System.DateTime CHG_DTM { set; get; }

    //    [DataMember]
    //    public System.Boolean IS_SINGLE_SELECT { set; get; }

    //    [DataMember]
    //    public System.Boolean ROLE_ACTV_IND { set; get; }

    //    [DataMember]
    //    public System.String ROLE_TIER_CD { set; get; }

    //    [DataMember]
    //    public System.Int32 ROLE_TIER_SID { set; get; }

    //    [DataMember]
    //    public System.Int32 ROLE_TIER_SRT_ORD { set; get; }

    //    [DataMember]
    //    public System.String ROLE_TYPE_CD { set; get; }

    //    [DataMember]
    //    public System.String ROLE_TYPE_DESC { set; get; }

    //    [DataMember]
    //    public System.String ROLE_TYPE_DSPLY_CD { set; get; }

    //    [DataMember]
    //    public System.Int32 ROLE_TYPE_SID { set; get; }

    //    /*
    //    private static List<AppRoleTier> AppRoleTierFromReader(SqlDataReader rdr){
    //    // This helper method is template generated.
    //    // Refer to that template for details to modify this code.

    //    var ret = new List<AppRoleTier>();
    //    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
    //    int IDX_APPL_ACTV_IND = DB.GetReaderOrdinal(rdr, "APPL_ACTV_IND");
    //    int IDX_APPL_CD = DB.GetReaderOrdinal(rdr, "APPL_CD");
    //    int IDX_APPL_DESC = DB.GetReaderOrdinal(rdr, "APPL_DESC");
    //    int IDX_APPL_SID = DB.GetReaderOrdinal(rdr, "APPL_SID");
    //    int IDX_APPL_SUITE = DB.GetReaderOrdinal(rdr, "APPL_SUITE");
    //    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
    //    int IDX_IS_SINGLE_SELECT = DB.GetReaderOrdinal(rdr, "IS_SINGLE_SELECT");
    //    int IDX_ROLE_ACTV_IND = DB.GetReaderOrdinal(rdr, "ROLE_ACTV_IND");
    //    int IDX_ROLE_TIER_CD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_CD");
    //    int IDX_ROLE_TIER_SID = DB.GetReaderOrdinal(rdr, "ROLE_TIER_SID");
    //    int IDX_ROLE_TIER_SRT_ORD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_SRT_ORD");
    //    int IDX_ROLE_TYPE_CD = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_CD");
    //    int IDX_ROLE_TYPE_DESC = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_DESC");
    //    int IDX_ROLE_TYPE_DSPLY_CD = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_DSPLY_CD");
    //    int IDX_ROLE_TYPE_SID = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_SID");

    //    while (rdr.Read()){
    //    ret.Add(new AppRoleTier {
    //    ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACTV_IND] == 1),
    //    APPL_ACTV_IND = (IDX_APPL_ACTV_IND < 0 || rdr.IsDBNull(IDX_APPL_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_APPL_ACTV_IND] == 1),
    //    APPL_CD = (IDX_APPL_CD < 0 || rdr.IsDBNull(IDX_APPL_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APPL_CD),
    //    APPL_DESC = (IDX_APPL_DESC < 0 || rdr.IsDBNull(IDX_APPL_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APPL_DESC),
    //    APPL_SID = (IDX_APPL_SID < 0 || rdr.IsDBNull(IDX_APPL_SID)) ? default(System.Byte) : rdr.GetFieldValue<System.Byte>(IDX_APPL_SID),
    //    APPL_SUITE = (IDX_APPL_SUITE < 0 || rdr.IsDBNull(IDX_APPL_SUITE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APPL_SUITE),
    //    CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
    //    IS_SINGLE_SELECT = (IDX_IS_SINGLE_SELECT < 0 || rdr.IsDBNull(IDX_IS_SINGLE_SELECT)) ? default(System.Boolean) : ((int)rdr[IDX_IS_SINGLE_SELECT] == 1),
    //    ROLE_ACTV_IND = (IDX_ROLE_ACTV_IND < 0 || rdr.IsDBNull(IDX_ROLE_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ROLE_ACTV_IND] == 1),
    //    ROLE_TIER_CD = (IDX_ROLE_TIER_CD < 0 || rdr.IsDBNull(IDX_ROLE_TIER_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_CD),
    //    ROLE_TIER_SID = (IDX_ROLE_TIER_SID < 0 || rdr.IsDBNull(IDX_ROLE_TIER_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TIER_SID),
    //    ROLE_TIER_SRT_ORD = (IDX_ROLE_TIER_SRT_ORD < 0 || rdr.IsDBNull(IDX_ROLE_TIER_SRT_ORD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TIER_SRT_ORD),
    //    ROLE_TYPE_CD = (IDX_ROLE_TYPE_CD < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_CD),
    //    ROLE_TYPE_DESC = (IDX_ROLE_TYPE_DESC < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_DESC),
    //    ROLE_TYPE_DSPLY_CD = (IDX_ROLE_TYPE_DSPLY_CD < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_DSPLY_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_DSPLY_CD),
    //    ROLE_TYPE_SID = (IDX_ROLE_TYPE_SID < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TYPE_SID)
    //    });
    //    } // while
    //    return ret;
    //    }
    //    */
    //} // End of class AppRoleTier

    // TODO create T4 template to generate these
    public enum ActionCodes
    {
        CanViewQuoteLetter,
        CanCreateContract
    };

    // TODO create T4 template to generate these
    public enum StageCodes
    {
        ALL,
        Requested,
        Submitted,
        Active
    };

    // TODO create T4 template to generate these
    public enum ObjSetTypeCodes
    {
        ALL,
        ECAP,
        VOL_TIER,
        CONTRACT
    };

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:27:47 PM
    ///</summary>

    /*
[DataContract]
public partial class DealTemplateDataGram
{
    [DataMember]
    public Nullable<System.Int32> ATRB_ORDER { set; get; }

    [DataMember]
    public System.String ATRB_SCTN_CD { set; get; }

    [DataMember]
    public System.String ATRB_SCTN_DESC { set; get; }

    [DataMember]
    public Nullable<System.Int32> ATRB_SCTN_ORDER { set; get; }

    [DataMember]
    public Nullable<System.Int32> ATRB_SID { set; get; }

    [DataMember]
    public System.String ATRB_VAL_CHAR { set; get; }

    [DataMember]
    public System.String ATRB_VAL_CHAR_MAX { set; get; }

    [DataMember]
    public Nullable<System.DateTime> ATRB_VAL_DTM { set; get; }

    [DataMember]
    public Nullable<System.Int32> ATRB_VAL_INT { set; get; }

    [DataMember]
    public Nullable<System.Decimal> ATRB_VAL_MONEY { set; get; }

    [DataMember]
    public string ATRB_VAL { set; get; }

    [DataMember]
    public System.String OBJ_ATRB_MTX_HASH { set; get; }

    [DataMember]
    public Nullable<System.Int32> DEAL_ID { set; get; }

    [DataMember]
    public Nullable<System.Int32> DEAL_NBR { set; get; }

    [DataMember]
    public System.String OJB_TYPE { set; get; }

    public static List<DealTemplateDataGram> DealTemplateDataGramFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<DealTemplateDataGram>();
        int IDX_ATRB_ORDER = DB.GetReaderOrdinal(rdr, "ATRB_ORDER");
        int IDX_ATRB_SCTN_CD = DB.GetReaderOrdinal(rdr, "ATRB_SCTN_CD");
        int IDX_ATRB_SCTN_DESC = DB.GetReaderOrdinal(rdr, "ATRB_SCTN_DESC");
        int IDX_ATRB_SCTN_ORDER = DB.GetReaderOrdinal(rdr, "ATRB_SCTN_ORDER");
        int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
        int IDX_ATRB_VAL_CHAR = DB.GetReaderOrdinal(rdr, "ATRB_VAL_CHAR");
        int IDX_ATRB_VAL_CHAR_MAX = DB.GetReaderOrdinal(rdr, "ATRB_VAL_CHAR_MAX");
        int IDX_ATRB_VAL_DTM = DB.GetReaderOrdinal(rdr, "ATRB_VAL_DTM");
        int IDX_ATRB_VAL_INT = DB.GetReaderOrdinal(rdr, "ATRB_VAL_INT");
        int IDX_ATRB_VAL_MONEY = DB.GetReaderOrdinal(rdr, "ATRB_VAL_MONEY");
        int IDX_ATRB_VAL = DB.GetReaderOrdinal(rdr, "ATRB_VAL");
        int IDX_OBJ_ATRB_MTX_HASH = DB.GetReaderOrdinal(rdr, "OBJ_ATRB_MTX_HASH");
        int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
        int IDX_DEAL_NBR = DB.GetReaderOrdinal(rdr, "DEAL_NBR");
        int IDX_OBJ_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_TYPE");

        while (rdr.Read()){
            ret.Add(new DealTemplateDataGram {
            ATRB_ORDER = (IDX_ATRB_ORDER < 0 || rdr.IsDBNull(IDX_ATRB_ORDER)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_ATRB_ORDER),
            ATRB_SCTN_CD = (IDX_ATRB_SCTN_CD < 0 || rdr.IsDBNull(IDX_ATRB_SCTN_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_SCTN_CD),
            ATRB_SCTN_DESC = (IDX_ATRB_SCTN_DESC < 0 || rdr.IsDBNull(IDX_ATRB_SCTN_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_SCTN_DESC),
            ATRB_SCTN_ORDER = (IDX_ATRB_SCTN_ORDER < 0 || rdr.IsDBNull(IDX_ATRB_SCTN_ORDER)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_ATRB_SCTN_ORDER),
            ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_ATRB_SID),
            ATRB_VAL_CHAR = (IDX_ATRB_VAL_CHAR < 0 || rdr.IsDBNull(IDX_ATRB_VAL_CHAR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_VAL_CHAR),
            ATRB_VAL_CHAR_MAX = (IDX_ATRB_VAL_CHAR_MAX < 0 || rdr.IsDBNull(IDX_ATRB_VAL_CHAR_MAX)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_VAL_CHAR_MAX),
            ATRB_VAL_DTM = (IDX_ATRB_VAL_DTM < 0 || rdr.IsDBNull(IDX_ATRB_VAL_DTM)) ? default(Nullable<System.DateTime>) : rdr.GetFieldValue<Nullable<System.DateTime>>(IDX_ATRB_VAL_DTM),
            ATRB_VAL_INT = (IDX_ATRB_VAL_INT < 0 || rdr.IsDBNull(IDX_ATRB_VAL_INT)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_ATRB_VAL_INT),
            ATRB_VAL_MONEY = (IDX_ATRB_VAL_MONEY < 0 || rdr.IsDBNull(IDX_ATRB_VAL_MONEY)) ? default(Nullable<System.Decimal>) : rdr.GetFieldValue<Nullable<System.Decimal>>(IDX_ATRB_VAL_MONEY),
            ATRB_VAL = (IDX_ATRB_VAL < 0 || rdr.IsDBNull(IDX_ATRB_VAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_VAL),
            OBJ_ATRB_MTX_HASH = (IDX_OBJ_ATRB_MTX_HASH < 0 || rdr.IsDBNull(IDX_OBJ_ATRB_MTX_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_ATRB_MTX_HASH),
            DEAL_ID = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_DEAL_ID),
            DEAL_NBR = (IDX_DEAL_NBR < 0 || rdr.IsDBNull(IDX_DEAL_NBR)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_DEAL_NBR),
            OJB_TYPE = (IDX_OBJ_TYPE < 0 || rdr.IsDBNull(IDX_OBJ_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_TYPE)
            });
        } // while
        return ret;
    }
} // End of class DealTemplateDataGram
*/

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:27:47 PM
    ///</summary>

    [DataContract]
    public partial class CustomerCalendar
    {
        [DataMember]
        public System.Int32 CUST_MBR_SID { set; get; }

        [DataMember]
        public System.String CUST_NM { set; get; }

        [DataMember]
        public System.DateTime END_DT { set; get; }

        [DataMember]
        public System.DateTime PREV_END_DT { set; get; }

        [DataMember]
        public System.Int16 PREV_QTR_NBR { set; get; }

        [DataMember]
        public System.DateTime PREV_START_DT { set; get; }

        [DataMember]
        public System.Int16 PREV_YR_NBR { set; get; }

        [DataMember]
        public System.Int16 QTR_NBR { set; get; }

        [DataMember]
        public System.DateTime START_DT { set; get; }

        [DataMember]
        public System.Int16 YR_NBR { set; get; }

        public static List<CustomerCalendar> CustomerCalendarFromReader(SqlDataReader rdr)
        {
            // This helper method is template generated.
            // Refer to that template for details to modify this code.

            var ret = new List<CustomerCalendar>();
            int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
            int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
            int IDX_END_DT = DB.GetReaderOrdinal(rdr, "END_DT");
            int IDX_PREV_END_DT = DB.GetReaderOrdinal(rdr, "PREV_END_DT");
            int IDX_PREV_QTR_NBR = DB.GetReaderOrdinal(rdr, "PREV_QTR_NBR");
            int IDX_PREV_START_DT = DB.GetReaderOrdinal(rdr, "PREV_START_DT");
            int IDX_PREV_YR_NBR = DB.GetReaderOrdinal(rdr, "PREV_YR_NBR");
            int IDX_QTR_NBR = DB.GetReaderOrdinal(rdr, "QTR_NBR");
            int IDX_START_DT = DB.GetReaderOrdinal(rdr, "START_DT");
            int IDX_YR_NBR = DB.GetReaderOrdinal(rdr, "YR_NBR");

            while (rdr.Read())
            {
                ret.Add(new CustomerCalendar
                {
                    CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                    CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                    END_DT = (IDX_END_DT < 0 || rdr.IsDBNull(IDX_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_END_DT),
                    PREV_END_DT = (IDX_PREV_END_DT < 0 || rdr.IsDBNull(IDX_PREV_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PREV_END_DT),
                    PREV_QTR_NBR = (IDX_PREV_QTR_NBR < 0 || rdr.IsDBNull(IDX_PREV_QTR_NBR)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_PREV_QTR_NBR),
                    PREV_START_DT = (IDX_PREV_START_DT < 0 || rdr.IsDBNull(IDX_PREV_START_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PREV_START_DT),
                    PREV_YR_NBR = (IDX_PREV_YR_NBR < 0 || rdr.IsDBNull(IDX_PREV_YR_NBR)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_PREV_YR_NBR),
                    QTR_NBR = (IDX_QTR_NBR < 0 || rdr.IsDBNull(IDX_QTR_NBR)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_QTR_NBR),
                    START_DT = (IDX_START_DT < 0 || rdr.IsDBNull(IDX_START_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_START_DT),
                    YR_NBR = (IDX_YR_NBR < 0 || rdr.IsDBNull(IDX_YR_NBR)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_YR_NBR)
                });
            } // while
            return ret;
        }
    } // End of class CustomerCalendar

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:27:47 PM
    ///</summary>

    //[DataContract]
    //public partial class DealType
    //{
    //    [DataMember]
    //    public System.String DEAL_TYPE_CD { set; get; }

    //    [DataMember]
    //    public System.String DEAL_TYPE_DESC { set; get; }

    //    [DataMember]
    //    public System.Int32 DEAL_TYPE_SID { set; get; }

    //    [DataMember]
    //    public System.Boolean PERFORM_CTST { set; get; }

    //    [DataMember]
    //    public System.Int32 TEMPLT_DEAL_NBR { set; get; }

    //    [DataMember]
    //    public System.Int32 TEMPLT_DEAL_SID { set; get; }

    //    [DataMember]
    //    public System.String TRKR_NBR_DT_LTR { set; get; }

    //    /*
    //    private static List<DealType> DealTypeFromReader(SqlDataReader rdr){
    //    // This helper method is template generated.
    //    // Refer to that template for details to modify this code.

    //    var ret = new List<DealType>();
    //    int IDX_DEAL_TYPE_CD = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_CD");
    //    int IDX_DEAL_TYPE_DESC = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_DESC");
    //    int IDX_DEAL_TYPE_SID = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_SID");
    //    int IDX_PERFORM_CTST = DB.GetReaderOrdinal(rdr, "PERFORM_CTST");
    //    int IDX_TEMPLT_DEAL_NBR = DB.GetReaderOrdinal(rdr, "TEMPLT_DEAL_NBR");
    //    int IDX_TEMPLT_DEAL_SID = DB.GetReaderOrdinal(rdr, "TEMPLT_DEAL_SID");
    //    int IDX_TRKR_NBR_DT_LTR = DB.GetReaderOrdinal(rdr, "TRKR_NBR_DT_LTR");

    //    while (rdr.Read()){
    //    ret.Add(new DealType {
    //    DEAL_TYPE_CD = (IDX_DEAL_TYPE_CD < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_CD),
    //    DEAL_TYPE_DESC = (IDX_DEAL_TYPE_DESC < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_DESC),
    //    DEAL_TYPE_SID = (IDX_DEAL_TYPE_SID < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_TYPE_SID),
    //    PERFORM_CTST = (IDX_PERFORM_CTST < 0 || rdr.IsDBNull(IDX_PERFORM_CTST)) ? default(System.Boolean) : ((int)rdr[IDX_PERFORM_CTST] == 1),
    //    TEMPLT_DEAL_NBR = (IDX_TEMPLT_DEAL_NBR < 0 || rdr.IsDBNull(IDX_TEMPLT_DEAL_NBR)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TEMPLT_DEAL_NBR),
    //    TEMPLT_DEAL_SID = (IDX_TEMPLT_DEAL_SID < 0 || rdr.IsDBNull(IDX_TEMPLT_DEAL_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TEMPLT_DEAL_SID),
    //    TRKR_NBR_DT_LTR = (IDX_TRKR_NBR_DT_LTR < 0 || rdr.IsDBNull(IDX_TRKR_NBR_DT_LTR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_TRKR_NBR_DT_LTR)
    //    });
    //    } // while
    //    return ret;
    //    }
    //    */
    //} // End of class DealType

    /////<summary>
    ///// Class created via template - Do Not Modify!
    ///// To modify this code, re-execute the template, or extend as partial.
    ///// on MHTIPPIN-MOBL3
    ///// by mhtippin
    ///// at 9/19/2016 4:27:47 PM
    /////</summary>

    //[DataContract]
    //public partial class CustomerQuarter
    //{
    //    [DataMember]
    //    public Nullable<System.Int32> CUST_MBR_SID { set; get; }

    //    [DataMember]
    //    public Nullable<System.DateTime> QTR_END { set; get; }

    //    [DataMember]
    //    public Nullable<System.Int16> QTR_NBR { set; get; }

    //    [DataMember]
    //    public Nullable<System.DateTime> QTR_STRT { set; get; }

    //    [DataMember]
    //    public Nullable<System.Int16> YR_NBR { set; get; }

    //    /*
    //    private static List<CustomerQuarter> CustomerQuarterFromReader(SqlDataReader rdr){
    //    // This helper method is template generated.
    //    // Refer to that template for details to modify this code.

    //    var ret = new List<CustomerQuarter>();
    //    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
    //    int IDX_QTR_END = DB.GetReaderOrdinal(rdr, "QTR_END");
    //    int IDX_QTR_NBR = DB.GetReaderOrdinal(rdr, "QTR_NBR");
    //    int IDX_QTR_STRT = DB.GetReaderOrdinal(rdr, "QTR_STRT");
    //    int IDX_YR_NBR = DB.GetReaderOrdinal(rdr, "YR_NBR");

    //    while (rdr.Read()){
    //    ret.Add(new CustomerQuarter {
    //    CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_CUST_MBR_SID),
    //    QTR_END = (IDX_QTR_END < 0 || rdr.IsDBNull(IDX_QTR_END)) ? default(Nullable<System.DateTime>) : rdr.GetFieldValue<Nullable<System.DateTime>>(IDX_QTR_END),
    //    QTR_NBR = (IDX_QTR_NBR < 0 || rdr.IsDBNull(IDX_QTR_NBR)) ? default(Nullable<System.Int16>) : rdr.GetFieldValue<Nullable<System.Int16>>(IDX_QTR_NBR),
    //    QTR_STRT = (IDX_QTR_STRT < 0 || rdr.IsDBNull(IDX_QTR_STRT)) ? default(Nullable<System.DateTime>) : rdr.GetFieldValue<Nullable<System.DateTime>>(IDX_QTR_STRT),
    //    YR_NBR = (IDX_YR_NBR < 0 || rdr.IsDBNull(IDX_YR_NBR)) ? default(Nullable<System.Int16>) : rdr.GetFieldValue<Nullable<System.Int16>>(IDX_YR_NBR)
    //    });
    //    } // while
    //    return ret;
    //    }
    //    */
    //} // End of class CustomerQuarter

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:27:51 PM
    ///</summary>

    [DataContract]
    public partial class DcsProduct
    {
        [DataMember]
        public System.Boolean ACTV_IND { set; get; }

        [DataMember]
        public System.String ALL_PRD_NM { set; get; }

        [DataMember]
        public System.String BRND_NM { set; get; }

        [DataMember]
        public System.Int32 BRND_NM_SID { set; get; }

        [DataMember]
        public System.String CHLD_NM_HASH { set; get; }

        [DataMember]
        public System.String CHLD_SID_HASH { set; get; }

        [DataMember]
        public System.String CPU_MKT_SEGMENT { set; get; }

        [DataMember]
        public System.String CPU_PACKAGE { set; get; }

        [DataMember]
        public System.String CPU_PSLV { set; get; }

        [DataMember]
        public System.String CPU_SPEED { set; get; }

        [DataMember]
        public System.String CPU_VOLTAGE_SEGMENT { set; get; }

        [DataMember]
        public System.String DEAL_PRD_NM { set; get; }

        [DataMember]
        public System.Int32 DEAL_PRD_NM_SID { set; get; }

        [DataMember]
        public System.String DEAL_PRD_TYPE { set; get; }

        [DataMember]
        public System.Int32 DEAL_PRD_TYPE_SID { set; get; }

        [DataMember]
        public System.String DEVICE_TYPE { set; get; }

        [DataMember]
        public System.Int16 DIM_SID { set; get; }

        [DataMember]
        public System.String DIV_NM { set; get; }

        [DataMember]
        public System.String FMLY_NM { set; get; }

        [DataMember]
        public System.String FMLY_NM_MM { set; get; }

        [DataMember]
        public System.Int32 FMLY_NM_SID { set; get; }

        [DataMember]
        public System.String GDM_VRT_NM { set; get; }

        [DataMember]
        public Microsoft.SqlServer.Types.SqlHierarchyId HIER_ID { set; get; }

        [DataMember]
        public System.String HIER_SID_HASH { set; get; }

        [DataMember]
        public System.String HIER_VAL_NM { set; get; }

        [DataMember]
        public System.String MM_MEDIA_CD { set; get; }

        [DataMember]
        public System.Int32 MM_MEDIA_CD_MSK { set; get; }

        [DataMember]
        public System.String MTRL_ID { set; get; }

        [DataMember]
        public System.Int32 MTRL_ID_SID { set; get; }

        [DataMember]
        public System.String MTRL_TYPE_CD { set; get; }

        [DataMember]
        public System.String OP_CD { set; get; }

        [DataMember]
        public System.String PRCSSR_NBR { set; get; }

        [DataMember]
        public System.Int32 PRCSSR_NBR_SID { set; get; }

        [DataMember]
        public System.String PRD_ATRB { set; get; }

        [DataMember]
        public System.Int32 PRD_ATRB_SID { set; get; }

        [DataMember]
        public System.String PRD_CATGRY_NM { set; get; }

        [DataMember]
        public System.Int32 PRD_CATGRY_NM_SID { set; get; }

        [DataMember]
        public System.DateTime PRD_END_DTM { set; get; }

        [DataMember]
        public System.String PRD_HIER_NM { set; get; }

        [DataMember]
        public System.Int32 PRD_MBR_SID { set; get; }

        [DataMember]
        public System.DateTime PRD_STRT_DTM { set; get; }

        [DataMember]
        public System.String PRODUCT_STATUS { set; get; }

        [DataMember]
        public System.String SKU_NM { set; get; }

        [DataMember]
        public System.String SUB_VERTICAL { set; get; }

        [DataMember]
        public System.Boolean USER_ACCESS { set; get; }

        /*
        private static List<DcsProduct> DcsProductFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<DcsProduct>();
        int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        int IDX_ALL_PRD_NM = DB.GetReaderOrdinal(rdr, "ALL_PRD_NM");
        int IDX_BRND_NM = DB.GetReaderOrdinal(rdr, "BRND_NM");
        int IDX_BRND_NM_SID = DB.GetReaderOrdinal(rdr, "BRND_NM_SID");
        int IDX_CHLD_NM_HASH = DB.GetReaderOrdinal(rdr, "CHLD_NM_HASH");
        int IDX_CHLD_SID_HASH = DB.GetReaderOrdinal(rdr, "CHLD_SID_HASH");
        int IDX_CPU_MKT_SEGMENT = DB.GetReaderOrdinal(rdr, "CPU_MKT_SEGMENT");
        int IDX_CPU_PACKAGE = DB.GetReaderOrdinal(rdr, "CPU_PACKAGE");
        int IDX_CPU_PSLV = DB.GetReaderOrdinal(rdr, "CPU_PSLV");
        int IDX_CPU_SPEED = DB.GetReaderOrdinal(rdr, "CPU_SPEED");
        int IDX_CPU_VOLTAGE_SEGMENT = DB.GetReaderOrdinal(rdr, "CPU_VOLTAGE_SEGMENT");
        int IDX_DEAL_PRD_NM = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM");
        int IDX_DEAL_PRD_NM_SID = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM_SID");
        int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
        int IDX_DEAL_PRD_TYPE_SID = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE_SID");
        int IDX_DEVICE_TYPE = DB.GetReaderOrdinal(rdr, "DEVICE_TYPE");
        int IDX_DIM_SID = DB.GetReaderOrdinal(rdr, "DIM_SID");
        int IDX_DIV_NM = DB.GetReaderOrdinal(rdr, "DIV_NM");
        int IDX_FMLY_NM = DB.GetReaderOrdinal(rdr, "FMLY_NM");
        int IDX_FMLY_NM_MM = DB.GetReaderOrdinal(rdr, "FMLY_NM_MM");
        int IDX_FMLY_NM_SID = DB.GetReaderOrdinal(rdr, "FMLY_NM_SID");
        int IDX_GDM_VRT_NM = DB.GetReaderOrdinal(rdr, "GDM_VRT_NM");
        int IDX_HIER_ID = DB.GetReaderOrdinal(rdr, "HIER_ID");
        int IDX_HIER_SID_HASH = DB.GetReaderOrdinal(rdr, "HIER_SID_HASH");
        int IDX_HIER_VAL_NM = DB.GetReaderOrdinal(rdr, "HIER_VAL_NM");
        int IDX_MM_MEDIA_CD = DB.GetReaderOrdinal(rdr, "MM_MEDIA_CD");
        int IDX_MM_MEDIA_CD_MSK = DB.GetReaderOrdinal(rdr, "MM_MEDIA_CD_MSK");
        int IDX_MTRL_ID = DB.GetReaderOrdinal(rdr, "MTRL_ID");
        int IDX_MTRL_ID_SID = DB.GetReaderOrdinal(rdr, "MTRL_ID_SID");
        int IDX_MTRL_TYPE_CD = DB.GetReaderOrdinal(rdr, "MTRL_TYPE_CD");
        int IDX_OP_CD = DB.GetReaderOrdinal(rdr, "OP_CD");
        int IDX_PRCSSR_NBR = DB.GetReaderOrdinal(rdr, "PRCSSR_NBR");
        int IDX_PRCSSR_NBR_SID = DB.GetReaderOrdinal(rdr, "PRCSSR_NBR_SID");
        int IDX_PRD_ATRB = DB.GetReaderOrdinal(rdr, "PRD_ATRB");
        int IDX_PRD_ATRB_SID = DB.GetReaderOrdinal(rdr, "PRD_ATRB_SID");
        int IDX_PRD_CATGRY_NM = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM");
        int IDX_PRD_CATGRY_NM_SID = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM_SID");
        int IDX_PRD_END_DTM = DB.GetReaderOrdinal(rdr, "PRD_END_DTM");
        int IDX_PRD_HIER_NM = DB.GetReaderOrdinal(rdr, "PRD_HIER_NM");
        int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
        int IDX_PRD_STRT_DTM = DB.GetReaderOrdinal(rdr, "PRD_STRT_DTM");
        int IDX_PRODUCT_STATUS = DB.GetReaderOrdinal(rdr, "PRODUCT_STATUS");
        int IDX_SKU_NM = DB.GetReaderOrdinal(rdr, "SKU_NM");
        int IDX_SUB_VERTICAL = DB.GetReaderOrdinal(rdr, "SUB_VERTICAL");
        int IDX_USER_ACCESS = DB.GetReaderOrdinal(rdr, "USER_ACCESS");

        while (rdr.Read()){
        ret.Add(new DcsProduct {
        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACTV_IND] == 1),
        ALL_PRD_NM = (IDX_ALL_PRD_NM < 0 || rdr.IsDBNull(IDX_ALL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ALL_PRD_NM),
        BRND_NM = (IDX_BRND_NM < 0 || rdr.IsDBNull(IDX_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRND_NM),
        BRND_NM_SID = (IDX_BRND_NM_SID < 0 || rdr.IsDBNull(IDX_BRND_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_BRND_NM_SID),
        CHLD_NM_HASH = (IDX_CHLD_NM_HASH < 0 || rdr.IsDBNull(IDX_CHLD_NM_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHLD_NM_HASH),
        CHLD_SID_HASH = (IDX_CHLD_SID_HASH < 0 || rdr.IsDBNull(IDX_CHLD_SID_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHLD_SID_HASH),
        CPU_MKT_SEGMENT = (IDX_CPU_MKT_SEGMENT < 0 || rdr.IsDBNull(IDX_CPU_MKT_SEGMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_MKT_SEGMENT),
        CPU_PACKAGE = (IDX_CPU_PACKAGE < 0 || rdr.IsDBNull(IDX_CPU_PACKAGE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_PACKAGE),
        CPU_PSLV = (IDX_CPU_PSLV < 0 || rdr.IsDBNull(IDX_CPU_PSLV)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_PSLV),
        CPU_SPEED = (IDX_CPU_SPEED < 0 || rdr.IsDBNull(IDX_CPU_SPEED)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_SPEED),
        CPU_VOLTAGE_SEGMENT = (IDX_CPU_VOLTAGE_SEGMENT < 0 || rdr.IsDBNull(IDX_CPU_VOLTAGE_SEGMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_VOLTAGE_SEGMENT),
        DEAL_PRD_NM = (IDX_DEAL_PRD_NM < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_NM),
        DEAL_PRD_NM_SID = (IDX_DEAL_PRD_NM_SID < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_PRD_NM_SID),
        DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
        DEAL_PRD_TYPE_SID = (IDX_DEAL_PRD_TYPE_SID < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_PRD_TYPE_SID),
        DEVICE_TYPE = (IDX_DEVICE_TYPE < 0 || rdr.IsDBNull(IDX_DEVICE_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEVICE_TYPE),
        DIM_SID = (IDX_DIM_SID < 0 || rdr.IsDBNull(IDX_DIM_SID)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_DIM_SID),
        DIV_NM = (IDX_DIV_NM < 0 || rdr.IsDBNull(IDX_DIV_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIV_NM),
        FMLY_NM = (IDX_FMLY_NM < 0 || rdr.IsDBNull(IDX_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMLY_NM),
        FMLY_NM_MM = (IDX_FMLY_NM_MM < 0 || rdr.IsDBNull(IDX_FMLY_NM_MM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMLY_NM_MM),
        FMLY_NM_SID = (IDX_FMLY_NM_SID < 0 || rdr.IsDBNull(IDX_FMLY_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_FMLY_NM_SID),
        GDM_VRT_NM = (IDX_GDM_VRT_NM < 0 || rdr.IsDBNull(IDX_GDM_VRT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GDM_VRT_NM),
        HIER_ID = (IDX_HIER_ID < 0 || rdr.IsDBNull(IDX_HIER_ID)) ? default(Microsoft.SqlServer.Types.SqlHierarchyId) : rdr.GetFieldValue<Microsoft.SqlServer.Types.SqlHierarchyId>(IDX_HIER_ID),
        HIER_SID_HASH = (IDX_HIER_SID_HASH < 0 || rdr.IsDBNull(IDX_HIER_SID_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_SID_HASH),
        HIER_VAL_NM = (IDX_HIER_VAL_NM < 0 || rdr.IsDBNull(IDX_HIER_VAL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_VAL_NM),
        MM_MEDIA_CD = (IDX_MM_MEDIA_CD < 0 || rdr.IsDBNull(IDX_MM_MEDIA_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MM_MEDIA_CD),
        MM_MEDIA_CD_MSK = (IDX_MM_MEDIA_CD_MSK < 0 || rdr.IsDBNull(IDX_MM_MEDIA_CD_MSK)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MM_MEDIA_CD_MSK),
        MTRL_ID = (IDX_MTRL_ID < 0 || rdr.IsDBNull(IDX_MTRL_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MTRL_ID),
        MTRL_ID_SID = (IDX_MTRL_ID_SID < 0 || rdr.IsDBNull(IDX_MTRL_ID_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MTRL_ID_SID),
        MTRL_TYPE_CD = (IDX_MTRL_TYPE_CD < 0 || rdr.IsDBNull(IDX_MTRL_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MTRL_TYPE_CD),
        OP_CD = (IDX_OP_CD < 0 || rdr.IsDBNull(IDX_OP_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OP_CD),
        PRCSSR_NBR = (IDX_PRCSSR_NBR < 0 || rdr.IsDBNull(IDX_PRCSSR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRCSSR_NBR),
        PRCSSR_NBR_SID = (IDX_PRCSSR_NBR_SID < 0 || rdr.IsDBNull(IDX_PRCSSR_NBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRCSSR_NBR_SID),
        PRD_ATRB = (IDX_PRD_ATRB < 0 || rdr.IsDBNull(IDX_PRD_ATRB)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_ATRB),
        PRD_ATRB_SID = (IDX_PRD_ATRB_SID < 0 || rdr.IsDBNull(IDX_PRD_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_ATRB_SID),
        PRD_CATGRY_NM = (IDX_PRD_CATGRY_NM < 0 || rdr.IsDBNull(IDX_PRD_CATGRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CATGRY_NM),
        PRD_CATGRY_NM_SID = (IDX_PRD_CATGRY_NM_SID < 0 || rdr.IsDBNull(IDX_PRD_CATGRY_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_CATGRY_NM_SID),
        PRD_END_DTM = (IDX_PRD_END_DTM < 0 || rdr.IsDBNull(IDX_PRD_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_END_DTM),
        PRD_HIER_NM = (IDX_PRD_HIER_NM < 0 || rdr.IsDBNull(IDX_PRD_HIER_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_HIER_NM),
        PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
        PRD_STRT_DTM = (IDX_PRD_STRT_DTM < 0 || rdr.IsDBNull(IDX_PRD_STRT_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_STRT_DTM),
        PRODUCT_STATUS = (IDX_PRODUCT_STATUS < 0 || rdr.IsDBNull(IDX_PRODUCT_STATUS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRODUCT_STATUS),
        SKU_NM = (IDX_SKU_NM < 0 || rdr.IsDBNull(IDX_SKU_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SKU_NM),
        SUB_VERTICAL = (IDX_SUB_VERTICAL < 0 || rdr.IsDBNull(IDX_SUB_VERTICAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SUB_VERTICAL),
        USER_ACCESS = (IDX_USER_ACCESS < 0 || rdr.IsDBNull(IDX_USER_ACCESS)) ? default(System.Boolean) : ((int)rdr[IDX_USER_ACCESS] == 1)
        });
        } // while
        return ret;
        }
        */
    } // End of class DcsProduct

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:27:51 PM
    ///</summary>

    [DataContract]
    public partial class DcsDealProduct
    {
        [DataMember]
        public System.Boolean ACTV_IND { set; get; }

        [DataMember]
        public System.String ALL_PRD_NM { set; get; }

        [DataMember]
        public System.String BRND_NM { set; get; }

        [DataMember]
        public System.String CHLD_NM_HASH { set; get; }

        [DataMember]
        public System.String CHLD_SID_HASH { set; get; }

        [DataMember]
        public System.String CPU_PACKAGE { set; get; }

        [DataMember]
        public System.String CPU_PSLV { set; get; }

        [DataMember]
        public System.Int32 DEAL_NBR { set; get; }

        [DataMember]
        public System.String DEAL_PRD_NM { set; get; }

        [DataMember]
        public System.String DEAL_PRD_TYPE { set; get; }

        [DataMember]
        public System.Int32 DEAL_PRD_TYPE_SID { set; get; }

        [DataMember]
        public System.String DEAL_TYPE_CD { set; get; }

        [DataMember]
        public System.Int16 DIM_SID { set; get; }

        [DataMember]
        public System.String DIV_NM { set; get; }

        [DataMember]
        public System.Int32 FLTR_LVL { set; get; }

        [DataMember]
        public System.String FMLY_NM { set; get; }

        [DataMember]
        public System.String FMLY_NM_MM { set; get; }

        [DataMember]
        public System.Int32 LAYER1_SID { set; get; }

        [DataMember]
        public System.Int32 LAYER2_SID { set; get; }

        [DataMember]
        public System.String MM_MEDIA_CD { set; get; }

        [DataMember]
        public System.String MTRL_ID { set; get; }

        [DataMember]
        public System.String OP_CD { set; get; }

        [DataMember]
        public System.String PRCSSR_NBR { set; get; }

        [DataMember]
        public System.String PRD_ATRB { set; get; }

        [DataMember]
        public System.Int32 PRD_ATRB_SID { set; get; }

        [DataMember]
        public System.String PRD_CATGRY_NM { set; get; }

        [DataMember]
        public System.Int32 PRD_CATGRY_NM_SID { set; get; }

        [DataMember]
        public System.DateTime PRD_END_DTM { set; get; }

        [DataMember]
        public System.Int32 PRD_MBR_SID { set; get; }

        [DataMember]
        public System.DateTime PRD_STRT_DTM { set; get; }

        [DataMember]
        public System.String SKU_NM { set; get; }

        [DataMember]
        public System.String SUB_VERTICAL { set; get; }

        /*
        private static List<DcsDealProduct> DcsDealProductFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<DcsDealProduct>();
        int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        int IDX_ALL_PRD_NM = DB.GetReaderOrdinal(rdr, "ALL_PRD_NM");
        int IDX_BRND_NM = DB.GetReaderOrdinal(rdr, "BRND_NM");
        int IDX_CHLD_NM_HASH = DB.GetReaderOrdinal(rdr, "CHLD_NM_HASH");
        int IDX_CHLD_SID_HASH = DB.GetReaderOrdinal(rdr, "CHLD_SID_HASH");
        int IDX_CPU_PACKAGE = DB.GetReaderOrdinal(rdr, "CPU_PACKAGE");
        int IDX_CPU_PSLV = DB.GetReaderOrdinal(rdr, "CPU_PSLV");
        int IDX_DEAL_NBR = DB.GetReaderOrdinal(rdr, "DEAL_NBR");
        int IDX_DEAL_PRD_NM = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM");
        int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
        int IDX_DEAL_PRD_TYPE_SID = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE_SID");
        int IDX_DEAL_TYPE_CD = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_CD");
        int IDX_DIM_SID = DB.GetReaderOrdinal(rdr, "DIM_SID");
        int IDX_DIV_NM = DB.GetReaderOrdinal(rdr, "DIV_NM");
        int IDX_FLTR_LVL = DB.GetReaderOrdinal(rdr, "FLTR_LVL");
        int IDX_FMLY_NM = DB.GetReaderOrdinal(rdr, "FMLY_NM");
        int IDX_FMLY_NM_MM = DB.GetReaderOrdinal(rdr, "FMLY_NM_MM");
        int IDX_LAYER1_SID = DB.GetReaderOrdinal(rdr, "LAYER1_SID");
        int IDX_LAYER2_SID = DB.GetReaderOrdinal(rdr, "LAYER2_SID");
        int IDX_MM_MEDIA_CD = DB.GetReaderOrdinal(rdr, "MM_MEDIA_CD");
        int IDX_MTRL_ID = DB.GetReaderOrdinal(rdr, "MTRL_ID");
        int IDX_OP_CD = DB.GetReaderOrdinal(rdr, "OP_CD");
        int IDX_PRCSSR_NBR = DB.GetReaderOrdinal(rdr, "PRCSSR_NBR");
        int IDX_PRD_ATRB = DB.GetReaderOrdinal(rdr, "PRD_ATRB");
        int IDX_PRD_ATRB_SID = DB.GetReaderOrdinal(rdr, "PRD_ATRB_SID");
        int IDX_PRD_CATGRY_NM = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM");
        int IDX_PRD_CATGRY_NM_SID = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM_SID");
        int IDX_PRD_END_DTM = DB.GetReaderOrdinal(rdr, "PRD_END_DTM");
        int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
        int IDX_PRD_STRT_DTM = DB.GetReaderOrdinal(rdr, "PRD_STRT_DTM");
        int IDX_SKU_NM = DB.GetReaderOrdinal(rdr, "SKU_NM");
        int IDX_SUB_VERTICAL = DB.GetReaderOrdinal(rdr, "SUB_VERTICAL");

        while (rdr.Read()){
        ret.Add(new DcsDealProduct {
        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACTV_IND] == 1),
        ALL_PRD_NM = (IDX_ALL_PRD_NM < 0 || rdr.IsDBNull(IDX_ALL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ALL_PRD_NM),
        BRND_NM = (IDX_BRND_NM < 0 || rdr.IsDBNull(IDX_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRND_NM),
        CHLD_NM_HASH = (IDX_CHLD_NM_HASH < 0 || rdr.IsDBNull(IDX_CHLD_NM_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHLD_NM_HASH),
        CHLD_SID_HASH = (IDX_CHLD_SID_HASH < 0 || rdr.IsDBNull(IDX_CHLD_SID_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHLD_SID_HASH),
        CPU_PACKAGE = (IDX_CPU_PACKAGE < 0 || rdr.IsDBNull(IDX_CPU_PACKAGE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_PACKAGE),
        CPU_PSLV = (IDX_CPU_PSLV < 0 || rdr.IsDBNull(IDX_CPU_PSLV)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_PSLV),
        DEAL_NBR = (IDX_DEAL_NBR < 0 || rdr.IsDBNull(IDX_DEAL_NBR)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_NBR),
        DEAL_PRD_NM = (IDX_DEAL_PRD_NM < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_NM),
        DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
        DEAL_PRD_TYPE_SID = (IDX_DEAL_PRD_TYPE_SID < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_PRD_TYPE_SID),
        DEAL_TYPE_CD = (IDX_DEAL_TYPE_CD < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_CD),
        DIM_SID = (IDX_DIM_SID < 0 || rdr.IsDBNull(IDX_DIM_SID)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_DIM_SID),
        DIV_NM = (IDX_DIV_NM < 0 || rdr.IsDBNull(IDX_DIV_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIV_NM),
        FLTR_LVL = (IDX_FLTR_LVL < 0 || rdr.IsDBNull(IDX_FLTR_LVL)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_FLTR_LVL),
        FMLY_NM = (IDX_FMLY_NM < 0 || rdr.IsDBNull(IDX_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMLY_NM),
        FMLY_NM_MM = (IDX_FMLY_NM_MM < 0 || rdr.IsDBNull(IDX_FMLY_NM_MM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMLY_NM_MM),
        LAYER1_SID = (IDX_LAYER1_SID < 0 || rdr.IsDBNull(IDX_LAYER1_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_LAYER1_SID),
        LAYER2_SID = (IDX_LAYER2_SID < 0 || rdr.IsDBNull(IDX_LAYER2_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_LAYER2_SID),
        MM_MEDIA_CD = (IDX_MM_MEDIA_CD < 0 || rdr.IsDBNull(IDX_MM_MEDIA_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MM_MEDIA_CD),
        MTRL_ID = (IDX_MTRL_ID < 0 || rdr.IsDBNull(IDX_MTRL_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MTRL_ID),
        OP_CD = (IDX_OP_CD < 0 || rdr.IsDBNull(IDX_OP_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OP_CD),
        PRCSSR_NBR = (IDX_PRCSSR_NBR < 0 || rdr.IsDBNull(IDX_PRCSSR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRCSSR_NBR),
        PRD_ATRB = (IDX_PRD_ATRB < 0 || rdr.IsDBNull(IDX_PRD_ATRB)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_ATRB),
        PRD_ATRB_SID = (IDX_PRD_ATRB_SID < 0 || rdr.IsDBNull(IDX_PRD_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_ATRB_SID),
        PRD_CATGRY_NM = (IDX_PRD_CATGRY_NM < 0 || rdr.IsDBNull(IDX_PRD_CATGRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CATGRY_NM),
        PRD_CATGRY_NM_SID = (IDX_PRD_CATGRY_NM_SID < 0 || rdr.IsDBNull(IDX_PRD_CATGRY_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_CATGRY_NM_SID),
        PRD_END_DTM = (IDX_PRD_END_DTM < 0 || rdr.IsDBNull(IDX_PRD_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_END_DTM),
        PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
        PRD_STRT_DTM = (IDX_PRD_STRT_DTM < 0 || rdr.IsDBNull(IDX_PRD_STRT_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_STRT_DTM),
        SKU_NM = (IDX_SKU_NM < 0 || rdr.IsDBNull(IDX_SKU_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SKU_NM),
        SUB_VERTICAL = (IDX_SUB_VERTICAL < 0 || rdr.IsDBNull(IDX_SUB_VERTICAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SUB_VERTICAL)
        });
        } // while
        return ret;
        }
        */
    } // End of class DcsDealProduct

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:28:02 PM
    ///</summary>

    [DataContract]
    public partial class LookupItem
    {
        [DataMember]
        public System.String ATRB_CD { set; get; }

        [DataMember]
        public System.String ATRB_COL_NM { set; get; }

        [DataMember]
        public System.String DEAL_TYPE_CD { set; get; }

        [DataMember]
        public System.String DROP_DOWN { set; get; }

        [DataMember]
        public System.String DROP_DOWN_DB { set; get; }

        [DataMember]
        public System.Int32 ORD { set; get; }

        /*
        private static List<LookupItem> LookupItemFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<LookupItem>();
        int IDX_ATRB_CD = DB.GetReaderOrdinal(rdr, "ATRB_CD");
        int IDX_ATRB_COL_NM = DB.GetReaderOrdinal(rdr, "ATRB_COL_NM");
        int IDX_DEAL_TYPE_CD = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_CD");
        int IDX_DROP_DOWN = DB.GetReaderOrdinal(rdr, "DROP_DOWN");
        int IDX_DROP_DOWN_DB = DB.GetReaderOrdinal(rdr, "DROP_DOWN_DB");
        int IDX_ORD = DB.GetReaderOrdinal(rdr, "ORD");

        while (rdr.Read()){
        ret.Add(new LookupItem {
        ATRB_CD = (IDX_ATRB_CD < 0 || rdr.IsDBNull(IDX_ATRB_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_CD),
        ATRB_COL_NM = (IDX_ATRB_COL_NM < 0 || rdr.IsDBNull(IDX_ATRB_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_COL_NM),
        DEAL_TYPE_CD = (IDX_DEAL_TYPE_CD < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_CD),
        DROP_DOWN = (IDX_DROP_DOWN < 0 || rdr.IsDBNull(IDX_DROP_DOWN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN),
        DROP_DOWN_DB = (IDX_DROP_DOWN_DB < 0 || rdr.IsDBNull(IDX_DROP_DOWN_DB)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN_DB),
        ORD = (IDX_ORD < 0 || rdr.IsDBNull(IDX_ORD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ORD)
        });
        } // while
        return ret;
        }
        */
    } // End of class LookupItem

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:28:02 PM
    ///</summary>

    //[DataContract]
    //public partial class GeoItem
    //{
    //    [DataMember]
    //    public System.Int32 atrb_srt_ord { set; get; }

    //    [DataMember]
    //    public System.String ctry_nm { set; get; }

    //    [DataMember]
    //    public System.Int32 geo_mbr_sid { set; get; }

    //    [DataMember]
    //    public System.String geo_nm { set; get; }

    //    [DataMember]
    //    public System.String rgn_nm { set; get; }

    //    /*
    //    private static List<GeoItem> GeoItemFromReader(SqlDataReader rdr){
    //    // This helper method is template generated.
    //    // Refer to that template for details to modify this code.

    //    var ret = new List<GeoItem>();
    //    int IDX_atrb_srt_ord = DB.GetReaderOrdinal(rdr, "atrb_srt_ord");
    //    int IDX_ctry_nm = DB.GetReaderOrdinal(rdr, "ctry_nm");
    //    int IDX_geo_mbr_sid = DB.GetReaderOrdinal(rdr, "geo_mbr_sid");
    //    int IDX_geo_nm = DB.GetReaderOrdinal(rdr, "geo_nm");
    //    int IDX_rgn_nm = DB.GetReaderOrdinal(rdr, "rgn_nm");

    //    while (rdr.Read()){
    //    ret.Add(new GeoItem {
    //    atrb_srt_ord = (IDX_atrb_srt_ord < 0 || rdr.IsDBNull(IDX_atrb_srt_ord)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_atrb_srt_ord),
    //    ctry_nm = (IDX_ctry_nm < 0 || rdr.IsDBNull(IDX_ctry_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ctry_nm),
    //    geo_mbr_sid = (IDX_geo_mbr_sid < 0 || rdr.IsDBNull(IDX_geo_mbr_sid)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_geo_mbr_sid),
    //    geo_nm = (IDX_geo_nm < 0 || rdr.IsDBNull(IDX_geo_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_geo_nm),
    //    rgn_nm = (IDX_rgn_nm < 0 || rdr.IsDBNull(IDX_rgn_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_rgn_nm)
    //    });
    //    } // while
    //    return ret;
    //    }
    //    */
    //} // End of class GeoItem

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:27:52 PM
    ///</summary>

    [DataContract]
    public partial class DcsSoldTo
    {
        [DataMember]
        public System.String CUST_DIV_NM { set; get; }

        [DataMember]
        public System.Int32 CUST_MBR_SID { set; get; }

        [DataMember]
        public System.String CUST_NM { set; get; }

        [DataMember]
        public System.Int32 CUST_NM_SID { set; get; }

        [DataMember]
        public System.String GEO_NM { set; get; }

        [DataMember]
        public System.String SOLD_TO_ID { set; get; }

        /*
        private static List<DcsSoldTo> DcsSoldToFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<DcsSoldTo>();
        int IDX_CUST_DIV_NM = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM");
        int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
        int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
        int IDX_CUST_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_NM_SID");
        int IDX_GEO_NM = DB.GetReaderOrdinal(rdr, "GEO_NM");
        int IDX_SOLD_TO_ID = DB.GetReaderOrdinal(rdr, "SOLD_TO_ID");

        while (rdr.Read()){
        ret.Add(new DcsSoldTo {
        CUST_DIV_NM = (IDX_CUST_DIV_NM < 0 || rdr.IsDBNull(IDX_CUST_DIV_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_DIV_NM),
        CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
        CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
        CUST_NM_SID = (IDX_CUST_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_NM_SID),
        GEO_NM = (IDX_GEO_NM < 0 || rdr.IsDBNull(IDX_GEO_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO_NM),
        SOLD_TO_ID = (IDX_SOLD_TO_ID < 0 || rdr.IsDBNull(IDX_SOLD_TO_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SOLD_TO_ID)
        });
        } // while
        return ret;
        }
        */
    } // End of class DcsSoldTo

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:27:54 PM
    ///</summary>

    [DataContract]
    public partial class WorkFlow
    {
        [DataMember]
        public System.Boolean ACTV_IND { set; get; }

        [DataMember]
        public System.Int32 DEAL_MBR_SID { set; get; }

        [DataMember]
        public System.Int32 PRD_MBR_SID { set; get; }

        [DataMember]
        public System.String ROLE_TIER_CD { set; get; }

        [DataMember]
        public System.Boolean TRKR_NBR_UPD { set; get; }

        [DataMember]
        public System.String WF_NAME { set; get; }

        [DataMember]
        public System.Int32 WF_SID { set; get; }

        [DataMember]
        public System.String WFSTG_ACTN_CD { set; get; }

        [DataMember]
        public System.Int32 WFSTG_DEST_MBR_SID { set; get; }

        [DataMember]
        public System.Int32 WFSTG_MBR_SID { set; get; }

        /*
        private static List<WorkFlow> WorkFlowFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<WorkFlow>();
        int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        int IDX_DEAL_MBR_SID = DB.GetReaderOrdinal(rdr, "DEAL_MBR_SID");
        int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
        int IDX_ROLE_TIER_CD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_CD");
        int IDX_TRKR_NBR_UPD = DB.GetReaderOrdinal(rdr, "TRKR_NBR_UPD");
        int IDX_WF_NAME = DB.GetReaderOrdinal(rdr, "WF_NAME");
        int IDX_WF_SID = DB.GetReaderOrdinal(rdr, "WF_SID");
        int IDX_WFSTG_ACTN_CD = DB.GetReaderOrdinal(rdr, "WFSTG_ACTN_CD");
        int IDX_WFSTG_DEST_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_MBR_SID");
        int IDX_WFSTG_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_MBR_SID");

        while (rdr.Read()){
        ret.Add(new WorkFlow {
        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACTV_IND] == 1),
        DEAL_MBR_SID = (IDX_DEAL_MBR_SID < 0 || rdr.IsDBNull(IDX_DEAL_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_MBR_SID),
        PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
        ROLE_TIER_CD = (IDX_ROLE_TIER_CD < 0 || rdr.IsDBNull(IDX_ROLE_TIER_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_CD),
        TRKR_NBR_UPD = (IDX_TRKR_NBR_UPD < 0 || rdr.IsDBNull(IDX_TRKR_NBR_UPD)) ? default(System.Boolean) : ((int)rdr[IDX_TRKR_NBR_UPD] == 1),
        WF_NAME = (IDX_WF_NAME < 0 || rdr.IsDBNull(IDX_WF_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WF_NAME),
        WF_SID = (IDX_WF_SID < 0 || rdr.IsDBNull(IDX_WF_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WF_SID),
        WFSTG_ACTN_CD = (IDX_WFSTG_ACTN_CD < 0 || rdr.IsDBNull(IDX_WFSTG_ACTN_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_ACTN_CD),
        WFSTG_DEST_MBR_SID = (IDX_WFSTG_DEST_MBR_SID < 0 || rdr.IsDBNull(IDX_WFSTG_DEST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_DEST_MBR_SID),
        WFSTG_MBR_SID = (IDX_WFSTG_MBR_SID < 0 || rdr.IsDBNull(IDX_WFSTG_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID)
        });
        } // while
        return ret;
        }
        */
    } // End of class WorkFlow

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:27:54 PM
    ///</summary>

    [DataContract]
    public partial class WorkFlowStage
    {
        [DataMember]
        public System.Boolean ACTV_IND { set; get; }

        [DataMember]
        public System.String ALL_WF_STG { set; get; }

        [DataMember]
        public System.String ALLOW_REDEAL { set; get; }

        [DataMember]
        public System.Int16 DIM_SID { set; get; }

        [DataMember]
        public System.Int32 WFSTG_ATRB_SID { set; get; }

        [DataMember]
        public System.String WFSTG_CD { set; get; }

        [DataMember]
        public System.String WFSTG_DESC { set; get; }

        [DataMember]
        public System.String WFSTG_LOC { set; get; }

        [DataMember]
        public System.Int32 WFSTG_MBR_SID { set; get; }

        [DataMember]
        public System.String WFSTG_ORD { set; get; }

        [DataMember]
        public System.String WFSTG_STS { set; get; }

        [DataMember]
        public System.String WFSTG_TIER { set; get; }

        /*
        private static List<WorkFlowStage> WorkFlowStageFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<WorkFlowStage>();
        int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        int IDX_ALL_WF_STG = DB.GetReaderOrdinal(rdr, "ALL_WF_STG");
        int IDX_ALLOW_REDEAL = DB.GetReaderOrdinal(rdr, "ALLOW_REDEAL");
        int IDX_DIM_SID = DB.GetReaderOrdinal(rdr, "DIM_SID");
        int IDX_WFSTG_ATRB_SID = DB.GetReaderOrdinal(rdr, "WFSTG_ATRB_SID");
        int IDX_WFSTG_CD = DB.GetReaderOrdinal(rdr, "WFSTG_CD");
        int IDX_WFSTG_DESC = DB.GetReaderOrdinal(rdr, "WFSTG_DESC");
        int IDX_WFSTG_LOC = DB.GetReaderOrdinal(rdr, "WFSTG_LOC");
        int IDX_WFSTG_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_MBR_SID");
        int IDX_WFSTG_ORD = DB.GetReaderOrdinal(rdr, "WFSTG_ORD");
        int IDX_WFSTG_STS = DB.GetReaderOrdinal(rdr, "WFSTG_STS");
        int IDX_WFSTG_TIER = DB.GetReaderOrdinal(rdr, "WFSTG_TIER");

        while (rdr.Read()){
        ret.Add(new WorkFlowStage {
        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACTV_IND] == 1),
        ALL_WF_STG = (IDX_ALL_WF_STG < 0 || rdr.IsDBNull(IDX_ALL_WF_STG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ALL_WF_STG),
        ALLOW_REDEAL = (IDX_ALLOW_REDEAL < 0 || rdr.IsDBNull(IDX_ALLOW_REDEAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ALLOW_REDEAL),
        DIM_SID = (IDX_DIM_SID < 0 || rdr.IsDBNull(IDX_DIM_SID)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_DIM_SID),
        WFSTG_ATRB_SID = (IDX_WFSTG_ATRB_SID < 0 || rdr.IsDBNull(IDX_WFSTG_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_ATRB_SID),
        WFSTG_CD = (IDX_WFSTG_CD < 0 || rdr.IsDBNull(IDX_WFSTG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD),
        WFSTG_DESC = (IDX_WFSTG_DESC < 0 || rdr.IsDBNull(IDX_WFSTG_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_DESC),
        WFSTG_LOC = (IDX_WFSTG_LOC < 0 || rdr.IsDBNull(IDX_WFSTG_LOC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_LOC),
        WFSTG_MBR_SID = (IDX_WFSTG_MBR_SID < 0 || rdr.IsDBNull(IDX_WFSTG_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID),
        WFSTG_ORD = (IDX_WFSTG_ORD < 0 || rdr.IsDBNull(IDX_WFSTG_ORD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_ORD),
        WFSTG_STS = (IDX_WFSTG_STS < 0 || rdr.IsDBNull(IDX_WFSTG_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_STS),
        WFSTG_TIER = (IDX_WFSTG_TIER < 0 || rdr.IsDBNull(IDX_WFSTG_TIER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_TIER)
        });
        } // while
        return ret;
        }
        */
    } // End of class WorkFlowStage

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:28:04 PM
    ///</summary>

    [DataContract]
    public partial class WorkFlowItem
    {
        [DataMember]
        public System.Boolean ACT_ACTV_IND { set; get; }

        [DataMember]
        public System.Boolean ACTV_IND { set; get; }

        [DataMember]
        public System.String ALLOW_REDEAL { set; get; }

        [DataMember]
        public System.Int32 DEAL_MBR_SID { set; get; }

        [DataMember]
        public System.String DEAL_TYPE_CD { set; get; }

        [DataMember]
        public System.Int32 DEAL_TYPE_SID { set; get; }

        [DataMember]
        public System.String ROLE_TIER_CD { set; get; }

        [DataMember]
        public System.Boolean TRKR_NBR_UPD { set; get; }

        [DataMember]
        public System.String WF_NAME { set; get; }

        [DataMember]
        public System.Int32 WF_SID { set; get; }

        [DataMember]
        public System.String WFSTG_ACTN_CD { set; get; }

        [DataMember]
        public System.Boolean WFSTG_ACTV_IND { set; get; }

        [DataMember]
        public System.String WFSTG_CD { set; get; }

        [DataMember]
        public System.Boolean WFSTG_DEST_ACTV_IND { set; get; }

        [DataMember]
        public System.String WFSTG_DEST_ALLOW_REDEAL { set; get; }

        [DataMember]
        public System.String WFSTG_DEST_CD { set; get; }

        [DataMember]
        public System.Int32 WFSTG_DEST_MBR_SID { set; get; }

        [DataMember]
        public System.String WFSTG_DEST_WFSTG_LOC { set; get; }

        [DataMember]
        public System.String WFSTG_DEST_WFSTG_ORD { set; get; }

        [DataMember]
        public System.String WFSTG_DEST_WFSTG_STS { set; get; }

        [DataMember]
        public System.String WFSTG_LOC { set; get; }

        [DataMember]
        public System.Int32 WFSTG_MBR_SID { set; get; }

        [DataMember]
        public System.String WFSTG_ORD { set; get; }

        [DataMember]
        public System.String WFSTG_STS { set; get; }

        [DataMember]
        public System.String WFSTG_TIER { set; get; }

        [DataMember]
        public System.Boolean WORK_FLOW_ACTV_IND { set; get; }

        /*
        private static List<WorkFlowItem> WorkFlowItemFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<WorkFlowItem>();
        int IDX_ACT_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACT_ACTV_IND");
        int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        int IDX_ALLOW_REDEAL = DB.GetReaderOrdinal(rdr, "ALLOW_REDEAL");
        int IDX_DEAL_MBR_SID = DB.GetReaderOrdinal(rdr, "DEAL_MBR_SID");
        int IDX_DEAL_TYPE_CD = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_CD");
        int IDX_DEAL_TYPE_SID = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_SID");
        int IDX_ROLE_TIER_CD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_CD");
        int IDX_TRKR_NBR_UPD = DB.GetReaderOrdinal(rdr, "TRKR_NBR_UPD");
        int IDX_WF_NAME = DB.GetReaderOrdinal(rdr, "WF_NAME");
        int IDX_WF_SID = DB.GetReaderOrdinal(rdr, "WF_SID");
        int IDX_WFSTG_ACTN_CD = DB.GetReaderOrdinal(rdr, "WFSTG_ACTN_CD");
        int IDX_WFSTG_ACTV_IND = DB.GetReaderOrdinal(rdr, "WFSTG_ACTV_IND");
        int IDX_WFSTG_CD = DB.GetReaderOrdinal(rdr, "WFSTG_CD");
        int IDX_WFSTG_DEST_ACTV_IND = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_ACTV_IND");
        int IDX_WFSTG_DEST_ALLOW_REDEAL = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_ALLOW_REDEAL");
        int IDX_WFSTG_DEST_CD = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_CD");
        int IDX_WFSTG_DEST_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_MBR_SID");
        int IDX_WFSTG_DEST_WFSTG_LOC = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_WFSTG_LOC");
        int IDX_WFSTG_DEST_WFSTG_ORD = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_WFSTG_ORD");
        int IDX_WFSTG_DEST_WFSTG_STS = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_WFSTG_STS");
        int IDX_WFSTG_LOC = DB.GetReaderOrdinal(rdr, "WFSTG_LOC");
        int IDX_WFSTG_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_MBR_SID");
        int IDX_WFSTG_ORD = DB.GetReaderOrdinal(rdr, "WFSTG_ORD");
        int IDX_WFSTG_STS = DB.GetReaderOrdinal(rdr, "WFSTG_STS");
        int IDX_WFSTG_TIER = DB.GetReaderOrdinal(rdr, "WFSTG_TIER");
        int IDX_WORK_FLOW_ACTV_IND = DB.GetReaderOrdinal(rdr, "WORK_FLOW_ACTV_IND");

        while (rdr.Read()){
        ret.Add(new WorkFlowItem {
        ACT_ACTV_IND = (IDX_ACT_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACT_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACT_ACTV_IND] == 1),
        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACTV_IND] == 1),
        ALLOW_REDEAL = (IDX_ALLOW_REDEAL < 0 || rdr.IsDBNull(IDX_ALLOW_REDEAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ALLOW_REDEAL),
        DEAL_MBR_SID = (IDX_DEAL_MBR_SID < 0 || rdr.IsDBNull(IDX_DEAL_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_MBR_SID),
        DEAL_TYPE_CD = (IDX_DEAL_TYPE_CD < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_CD),
        DEAL_TYPE_SID = (IDX_DEAL_TYPE_SID < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_TYPE_SID),
        ROLE_TIER_CD = (IDX_ROLE_TIER_CD < 0 || rdr.IsDBNull(IDX_ROLE_TIER_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_CD),
        TRKR_NBR_UPD = (IDX_TRKR_NBR_UPD < 0 || rdr.IsDBNull(IDX_TRKR_NBR_UPD)) ? default(System.Boolean) : ((int)rdr[IDX_TRKR_NBR_UPD] == 1),
        WF_NAME = (IDX_WF_NAME < 0 || rdr.IsDBNull(IDX_WF_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WF_NAME),
        WF_SID = (IDX_WF_SID < 0 || rdr.IsDBNull(IDX_WF_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WF_SID),
        WFSTG_ACTN_CD = (IDX_WFSTG_ACTN_CD < 0 || rdr.IsDBNull(IDX_WFSTG_ACTN_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_ACTN_CD),
        WFSTG_ACTV_IND = (IDX_WFSTG_ACTV_IND < 0 || rdr.IsDBNull(IDX_WFSTG_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_WFSTG_ACTV_IND] == 1),
        WFSTG_CD = (IDX_WFSTG_CD < 0 || rdr.IsDBNull(IDX_WFSTG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD),
        WFSTG_DEST_ACTV_IND = (IDX_WFSTG_DEST_ACTV_IND < 0 || rdr.IsDBNull(IDX_WFSTG_DEST_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_WFSTG_DEST_ACTV_IND] == 1),
        WFSTG_DEST_ALLOW_REDEAL = (IDX_WFSTG_DEST_ALLOW_REDEAL < 0 || rdr.IsDBNull(IDX_WFSTG_DEST_ALLOW_REDEAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_DEST_ALLOW_REDEAL),
        WFSTG_DEST_CD = (IDX_WFSTG_DEST_CD < 0 || rdr.IsDBNull(IDX_WFSTG_DEST_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_DEST_CD),
        WFSTG_DEST_MBR_SID = (IDX_WFSTG_DEST_MBR_SID < 0 || rdr.IsDBNull(IDX_WFSTG_DEST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_DEST_MBR_SID),
        WFSTG_DEST_WFSTG_LOC = (IDX_WFSTG_DEST_WFSTG_LOC < 0 || rdr.IsDBNull(IDX_WFSTG_DEST_WFSTG_LOC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_DEST_WFSTG_LOC),
        WFSTG_DEST_WFSTG_ORD = (IDX_WFSTG_DEST_WFSTG_ORD < 0 || rdr.IsDBNull(IDX_WFSTG_DEST_WFSTG_ORD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_DEST_WFSTG_ORD),
        WFSTG_DEST_WFSTG_STS = (IDX_WFSTG_DEST_WFSTG_STS < 0 || rdr.IsDBNull(IDX_WFSTG_DEST_WFSTG_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_DEST_WFSTG_STS),
        WFSTG_LOC = (IDX_WFSTG_LOC < 0 || rdr.IsDBNull(IDX_WFSTG_LOC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_LOC),
        WFSTG_MBR_SID = (IDX_WFSTG_MBR_SID < 0 || rdr.IsDBNull(IDX_WFSTG_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID),
        WFSTG_ORD = (IDX_WFSTG_ORD < 0 || rdr.IsDBNull(IDX_WFSTG_ORD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_ORD),
        WFSTG_STS = (IDX_WFSTG_STS < 0 || rdr.IsDBNull(IDX_WFSTG_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_STS),
        WFSTG_TIER = (IDX_WFSTG_TIER < 0 || rdr.IsDBNull(IDX_WFSTG_TIER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_TIER),
        WORK_FLOW_ACTV_IND = (IDX_WORK_FLOW_ACTV_IND < 0 || rdr.IsDBNull(IDX_WORK_FLOW_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_WORK_FLOW_ACTV_IND] == 1)
        });
        } // while
        return ret;
        }
        */
    } // End of class WorkFlowItem

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:28:06 PM
    ///</summary>

    [DataContract]
    public partial class FilterAttribute
    {
        [DataMember]
        public System.Boolean Active { set; get; }

        [DataMember]
        public System.String AtrbColNm { set; get; }

        [DataMember]
        public System.String AtrbGroup { set; get; }

        [DataMember]
        public System.Int32 AtrbGroupOrder { set; get; }

        [DataMember]
        public System.Int32 AtrbId { set; get; }

        [DataMember]
        public System.String AtrbLabel { set; get; }

        [DataMember]
        public System.String DataType { set; get; }

        [DataMember]
        public System.Boolean DimKey { set; get; }

        [DataMember]
        public System.String Editor { set; get; }

        [DataMember]
        public System.Boolean Encoded { set; get; }

        [DataMember]
        public System.Boolean Filterable { set; get; }

        [DataMember]
        public System.String Format { set; get; }

        [DataMember]
        public System.Int32 GridTypeID { set; get; }

        [DataMember]
        public System.String HeaderTemplate { set; get; }

        [DataMember]
        public System.String HelpText { set; get; }

        [DataMember]
        public System.Boolean Hidden { set; get; }

        [DataMember]
        public System.Int32 ID { set; get; }

        [DataMember]
        public System.Boolean Lockable { set; get; }

        [DataMember]
        public System.Boolean Locked { set; get; }

        [DataMember]
        public System.String LookupText { set; get; }

        [DataMember]
        public System.String LookupUrl { set; get; }

        [DataMember]
        public System.String LookupValue { set; get; }

        [DataMember]
        public System.Int32 Order { set; get; }

        [DataMember]
        public System.Boolean ReadOnly_class { set; get; }

        [DataMember]
        public System.Boolean Sortable { set; get; }

        [DataMember]
        public System.String Template { set; get; }

        [DataMember]
        public System.Int32 UITypeID { set; get; }

        [DataMember]
        public System.Double Width { set; get; }

        /*
        private static List<FilterAttribute> FilterAttributeFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<FilterAttribute>();
        int IDX_Active = DB.GetReaderOrdinal(rdr, "Active");
        int IDX_AtrbColNm = DB.GetReaderOrdinal(rdr, "AtrbColNm");
        int IDX_AtrbGroup = DB.GetReaderOrdinal(rdr, "AtrbGroup");
        int IDX_AtrbGroupOrder = DB.GetReaderOrdinal(rdr, "AtrbGroupOrder");
        int IDX_AtrbId = DB.GetReaderOrdinal(rdr, "AtrbId");
        int IDX_AtrbLabel = DB.GetReaderOrdinal(rdr, "AtrbLabel");
        int IDX_DataType = DB.GetReaderOrdinal(rdr, "DataType");
        int IDX_DimKey = DB.GetReaderOrdinal(rdr, "DimKey");
        int IDX_Editor = DB.GetReaderOrdinal(rdr, "Editor");
        int IDX_Encoded = DB.GetReaderOrdinal(rdr, "Encoded");
        int IDX_Filterable = DB.GetReaderOrdinal(rdr, "Filterable");
        int IDX_Format = DB.GetReaderOrdinal(rdr, "Format");
        int IDX_GridTypeID = DB.GetReaderOrdinal(rdr, "GridTypeID");
        int IDX_HeaderTemplate = DB.GetReaderOrdinal(rdr, "HeaderTemplate");
        int IDX_HelpText = DB.GetReaderOrdinal(rdr, "HelpText");
        int IDX_Hidden = DB.GetReaderOrdinal(rdr, "Hidden");
        int IDX_ID = DB.GetReaderOrdinal(rdr, "ID");
        int IDX_Lockable = DB.GetReaderOrdinal(rdr, "Lockable");
        int IDX_Locked = DB.GetReaderOrdinal(rdr, "Locked");
        int IDX_LookupText = DB.GetReaderOrdinal(rdr, "LookupText");
        int IDX_LookupUrl = DB.GetReaderOrdinal(rdr, "LookupUrl");
        int IDX_LookupValue = DB.GetReaderOrdinal(rdr, "LookupValue");
        int IDX_Order = DB.GetReaderOrdinal(rdr, "Order");
        int IDX_ReadOnly_class = DB.GetReaderOrdinal(rdr, "ReadOnly");
        int IDX_Sortable = DB.GetReaderOrdinal(rdr, "Sortable");
        int IDX_Template = DB.GetReaderOrdinal(rdr, "Template");
        int IDX_UITypeID = DB.GetReaderOrdinal(rdr, "UITypeID");
        int IDX_Width = DB.GetReaderOrdinal(rdr, "Width");

        while (rdr.Read()){
        ret.Add(new FilterAttribute {
        Active = (IDX_Active < 0 || rdr.IsDBNull(IDX_Active)) ? default(System.Boolean) : ((int)rdr[IDX_Active] == 1),
        AtrbColNm = (IDX_AtrbColNm < 0 || rdr.IsDBNull(IDX_AtrbColNm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_AtrbColNm),
        AtrbGroup = (IDX_AtrbGroup < 0 || rdr.IsDBNull(IDX_AtrbGroup)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_AtrbGroup),
        AtrbGroupOrder = (IDX_AtrbGroupOrder < 0 || rdr.IsDBNull(IDX_AtrbGroupOrder)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_AtrbGroupOrder),
        AtrbId = (IDX_AtrbId < 0 || rdr.IsDBNull(IDX_AtrbId)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_AtrbId),
        AtrbLabel = (IDX_AtrbLabel < 0 || rdr.IsDBNull(IDX_AtrbLabel)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_AtrbLabel),
        DataType = (IDX_DataType < 0 || rdr.IsDBNull(IDX_DataType)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DataType),
        DimKey = (IDX_DimKey < 0 || rdr.IsDBNull(IDX_DimKey)) ? default(System.Boolean) : ((int)rdr[IDX_DimKey] == 1),
        Editor = (IDX_Editor < 0 || rdr.IsDBNull(IDX_Editor)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Editor),
        Encoded = (IDX_Encoded < 0 || rdr.IsDBNull(IDX_Encoded)) ? default(System.Boolean) : ((int)rdr[IDX_Encoded] == 1),
        Filterable = (IDX_Filterable < 0 || rdr.IsDBNull(IDX_Filterable)) ? default(System.Boolean) : ((int)rdr[IDX_Filterable] == 1),
        Format = (IDX_Format < 0 || rdr.IsDBNull(IDX_Format)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Format),
        GridTypeID = (IDX_GridTypeID < 0 || rdr.IsDBNull(IDX_GridTypeID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GridTypeID),
        HeaderTemplate = (IDX_HeaderTemplate < 0 || rdr.IsDBNull(IDX_HeaderTemplate)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HeaderTemplate),
        HelpText = (IDX_HelpText < 0 || rdr.IsDBNull(IDX_HelpText)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HelpText),
        Hidden = (IDX_Hidden < 0 || rdr.IsDBNull(IDX_Hidden)) ? default(System.Boolean) : ((int)rdr[IDX_Hidden] == 1),
        ID = (IDX_ID < 0 || rdr.IsDBNull(IDX_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ID),
        Lockable = (IDX_Lockable < 0 || rdr.IsDBNull(IDX_Lockable)) ? default(System.Boolean) : ((int)rdr[IDX_Lockable] == 1),
        Locked = (IDX_Locked < 0 || rdr.IsDBNull(IDX_Locked)) ? default(System.Boolean) : ((int)rdr[IDX_Locked] == 1),
        LookupText = (IDX_LookupText < 0 || rdr.IsDBNull(IDX_LookupText)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LookupText),
        LookupUrl = (IDX_LookupUrl < 0 || rdr.IsDBNull(IDX_LookupUrl)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LookupUrl),
        LookupValue = (IDX_LookupValue < 0 || rdr.IsDBNull(IDX_LookupValue)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LookupValue),
        Order = (IDX_Order < 0 || rdr.IsDBNull(IDX_Order)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Order),
        ReadOnly_class = (IDX_ReadOnly_class < 0 || rdr.IsDBNull(IDX_ReadOnly_class)) ? default(System.Boolean) : ((int)rdr[IDX_ReadOnly_class] == 1),
        Sortable = (IDX_Sortable < 0 || rdr.IsDBNull(IDX_Sortable)) ? default(System.Boolean) : ((int)rdr[IDX_Sortable] == 1),
        Template = (IDX_Template < 0 || rdr.IsDBNull(IDX_Template)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Template),
        UITypeID = (IDX_UITypeID < 0 || rdr.IsDBNull(IDX_UITypeID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_UITypeID),
        Width = (IDX_Width < 0 || rdr.IsDBNull(IDX_Width)) ? default(System.Double) : rdr.GetFieldValue<System.Double>(IDX_Width)
        });
        } // while
        return ret;
        }
        */
    } // End of class FilterAttribute

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:28:06 PM
    ///</summary>

    [DataContract]
    public partial class GridType
    {
        [DataMember]
        public System.Int32 GridTypeID { set; get; }

        [DataMember]
        public System.String GridTypeName { set; get; }

        /*
        private static List<GridType> GridTypeFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<GridType>();
        int IDX_GridTypeID = DB.GetReaderOrdinal(rdr, "GridTypeID");
        int IDX_GridTypeName = DB.GetReaderOrdinal(rdr, "GridTypeName");

        while (rdr.Read()){
        ret.Add(new GridType {
        GridTypeID = (IDX_GridTypeID < 0 || rdr.IsDBNull(IDX_GridTypeID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GridTypeID),
        GridTypeName = (IDX_GridTypeName < 0 || rdr.IsDBNull(IDX_GridTypeName)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GridTypeName)
        });
        } // while
        return ret;
        }
        */
    } // End of class GridType

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:28:06 PM
    ///</summary>

    [DataContract]
    public partial class UIType
    {
        [DataMember]
        public System.String UITypeCd { set; get; }

        [DataMember]
        public System.Int32 UITypeID { set; get; }

        [DataMember]
        public System.String UITypeName { set; get; }

        /*
        private static List<UIType> UITypeFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<UIType>();
        int IDX_UITypeCd = DB.GetReaderOrdinal(rdr, "UITypeCd");
        int IDX_UITypeID = DB.GetReaderOrdinal(rdr, "UITypeID");
        int IDX_UITypeName = DB.GetReaderOrdinal(rdr, "UITypeName");

        while (rdr.Read()){
        ret.Add(new UIType {
        UITypeCd = (IDX_UITypeCd < 0 || rdr.IsDBNull(IDX_UITypeCd)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_UITypeCd),
        UITypeID = (IDX_UITypeID < 0 || rdr.IsDBNull(IDX_UITypeID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_UITypeID),
        UITypeName = (IDX_UITypeName < 0 || rdr.IsDBNull(IDX_UITypeName)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_UITypeName)
        });
        } // while
        return ret;
        }
        */
    } // End of class UIType

    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on MHTIPPIN-MOBL3
    /// by mhtippin
    /// at 9/19/2016 4:28:06 PM
    ///</summary>

    [DataContract]
    public partial class Operator_class
    {
        [DataMember]
        public System.Boolean Active { set; get; }

        [DataMember]
        public System.String DisplayName { set; get; }

        [DataMember]
        public System.Int32 ID { set; get; }

        [DataMember]
        public System.Int32 UITypeID { set; get; }

        [DataMember]
        public System.String Value { set; get; }

        /*
        private static List<Operator_class> Operator_classFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<Operator_class>();
        int IDX_Active = DB.GetReaderOrdinal(rdr, "Active");
        int IDX_DisplayName = DB.GetReaderOrdinal(rdr, "DisplayName");
        int IDX_ID = DB.GetReaderOrdinal(rdr, "ID");
        int IDX_UITypeID = DB.GetReaderOrdinal(rdr, "UITypeID");
        int IDX_Value = DB.GetReaderOrdinal(rdr, "Value");

        while (rdr.Read()){
        ret.Add(new Operator_class {
        Active = (IDX_Active < 0 || rdr.IsDBNull(IDX_Active)) ? default(System.Boolean) : ((int)rdr[IDX_Active] == 1),
        DisplayName = (IDX_DisplayName < 0 || rdr.IsDBNull(IDX_DisplayName)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DisplayName),
        ID = (IDX_ID < 0 || rdr.IsDBNull(IDX_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ID),
        UITypeID = (IDX_UITypeID < 0 || rdr.IsDBNull(IDX_UITypeID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_UITypeID),
        Value = (IDX_Value < 0 || rdr.IsDBNull(IDX_Value)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Value)
        });
        } // while
        return ret;
        }
        */
    } // End of class Operator

    //[DataContract]
    //public partial class WorkFlowAttribute
    //{
    //    [DataMember]
    //    public System.String ColumnName { set; get; }

    //    [DataMember]
    //    public System.String Key { set; get; }

    //    [DataMember]
    //    public System.String Value { set; get; }
    //}

    public partial class PRD_TRANSLATION_RESULTS
    {
        [DataMember]
        public System.Int32 ROW_NM { set; get; }

        [DataMember]
        public System.String BRND_NM { set; get; }

        [DataMember]
        public System.String CAP { set; get; }

        [DataMember]
        public System.DateTime CAP_END { set; get; }

        [DataMember]
        public System.String CAP_PRC_COND { set; get; }

        [DataMember]
        public System.DateTime CAP_START { set; get; }

        [DataMember]
        public System.String CPU_CACHE { set; get; }

        [DataMember]
        public System.String CPU_PACKAGE { set; get; }

        [DataMember]
        public System.String CPU_PROCESSOR_NUMBER { set; get; }

        [DataMember]
        public System.String CPU_VOLTAGE_SEGMENT { set; get; }

        [DataMember]
        public System.String CPU_WATTAGE { set; get; }

        [DataMember]
        public System.DateTime DEAL_END_DT { set; get; }

        [DataMember]
        public System.String DEAL_PRD_NM { set; get; }

        [DataMember]
        public System.String DEAL_PRD_TYPE { set; get; }

        [DataMember]
        public System.DateTime DEAL_STRT_DT { set; get; }

        [DataMember]
        public System.String DERIVED_USR_INPUT { set; get; }

        [DataMember]
        public System.String EPM_NM { set; get; }

        [DataMember]
        public System.Boolean EXACT_MATCH { set; get; }

        [DataMember]
        public System.Boolean EXCLUDE { set; get; }

        [DataMember]
        public System.String FMLY_NM { set; get; }

        [DataMember]
        public System.String FMLY_NM_MM { set; get; }

        [DataMember]
        public System.String GDM_BRND_NM { set; get; }

        [DataMember]
        public System.String GDM_FMLY_NM { set; get; }

        [DataMember]
        public System.Int32 HAS_L1 { set; get; }

        [DataMember]
        public System.Int32 HAS_L2 { set; get; }

        [DataMember]
        public System.String HIER_NM_HASH { set; get; }

        [DataMember]
        public System.String HIER_VAL_NM { set; get; }

        [DataMember]
        public System.String MM_CUST_CUSTOMER { set; get; }

        [DataMember]
        public System.String MM_MEDIA_CD { set; get; }

        [DataMember]
        public System.String MTRL_ID { set; get; }

        [DataMember]
        public System.String NAND_Density { set; get; }

        [DataMember]
        public System.String NAND_FAMILY { set; get; }

        [DataMember]
        public System.String PCSR_NBR { set; get; }

        [DataMember]
        public System.Int32 PRD_ATRB_SID { set; get; }

        [DataMember]
        public System.String PRD_CAT_NM { set; get; }

        [DataMember]
        public System.DateTime PRD_END_DTM { set; get; }

        [DataMember]
        public System.Int32 PRD_MBR_SID { set; get; }

        [DataMember]
        public System.DateTime PRD_STRT_DTM { set; get; }

        [DataMember]
        public System.String PRICE_SEGMENT { set; get; }

        [DataMember]
        public System.String SBS_NM { set; get; }

        [DataMember]
        public System.String SKU_MARKET_SEGMENT { set; get; }

        [DataMember]
        public System.String SKU_NM { set; get; }

        [DataMember]
        public System.String USR_INPUT { set; get; }

        [DataMember]
        public System.Boolean WITHOUT_FILTER { set; get; }

        [DataMember]
        public System.String YCS2 { set; get; }

        [DataMember]
        public System.DateTime YCS2_END { set; get; }

        [DataMember]
        public System.DateTime YCS2_START { set; get; }
    }

    public class MeetCompUpdate
    {
        [DataMember]
        public System.String GRP { set; get; }

        [DataMember]
        public System.Int32 CUST_NM_SID { set; get; }

        [DataMember]
        public System.String DEAL_PRD_TYPE { set; get; }

        [DataMember]
        public System.String PRD_CAT_NM { set; get; }

        [DataMember]
        public System.String GRP_PRD_NM { set; get; }

        [DataMember]
        public System.String GRP_PRD_SID { set; get; }

        [DataMember]
        public System.Int32 DEAL_OBJ_SID { set; get; }

        [DataMember]
        public System.String COMP_SKU { set; get; }

        [DataMember]
        public System.Decimal COMP_PRC { set; get; }

        [DataMember]
        public System.Decimal COMP_BNCH { set; get; }

        [DataMember]
        public System.Decimal IA_BNCH { set; get; }

        [DataMember]
        public System.String COMP_OVRRD_RSN { set; get; }

        [DataMember]
        public System.Boolean COMP_OVRRD_FLG { set; get; }

        [DataMember]
        public System.Char MEET_COMP_UPD_FLG { set; get; }
    }

    public class MEET_COMP_DIM
    {
        [DataMember]
        public System.String HIER_VAL_NM { set; get; }

        [DataMember]
        public System.String PRD_CAT_NM { set; get; }

        [DataMember]
        public System.Int32 CUST_MBR_SID { set; get; }

        [DataMember]
        public System.String BRND_NM { set; get; }

        [DataMember]
        public System.String CUST_NM { set; get; }
    }

    public class logFileObject
    {
        [DataMember]
        public System.String fileName;

        [DataMember]
        public System.DateTime creationDate;

        [DataMember]
        public System.DateTime modifiedDate;

        [DataMember]
        public System.String errorType;

        [DataMember]
        public System.String errorMessage;

        [DataMember]
        public System.Int32 WWID;
    }

    public class logDate
    {
        [DataMember]
        public System.DateTime startDate;

        [DataMember]
        public System.DateTime endDate;
    }

    public class MeetCompSearch
    {
        [DataMember]
        public int cid;

        [DataMember]
        public string PRD_CAT_NM;

        [DataMember]
        public string BRND_NM;

        [DataMember]
        public string HIER_VAL_NM;

    }
}