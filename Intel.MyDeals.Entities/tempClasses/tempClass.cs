using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
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


    [DataContract]
    public partial class SecurityMask
    {

        [DataMember]
        public System.String ACTN_CD { set; get; }


        [DataMember]
        public System.Int32 ACTN_SID { set; get; }


        [DataMember]
        public System.Int32 DEAL_MBR_SID { set; get; }


        [DataMember]
        public System.String DEAL_TYPE_CD { set; get; }


        [DataMember]
        public System.String PERMISSION_MASK { set; get; }


        [DataMember]
        public System.String ROLE_TYPE_CD { set; get; }


        [DataMember]
        public System.Int32 ROLE_TYPE_SID { set; get; }


        [DataMember]
        public System.String WFSTG_CD { set; get; }


        [DataMember]
        public System.Int32 WFSTG_MBR_SID { set; get; }


        /*
        private static List<SecurityMask> SecurityMaskFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<SecurityMask>();
        int IDX_ACTN_CD = DB.GetReaderOrdinal(rdr, "ACTN_CD");
        int IDX_ACTN_SID = DB.GetReaderOrdinal(rdr, "ACTN_SID");
        int IDX_DEAL_MBR_SID = DB.GetReaderOrdinal(rdr, "DEAL_MBR_SID");
        int IDX_DEAL_TYPE_CD = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_CD");
        int IDX_PERMISSION_MASK = DB.GetReaderOrdinal(rdr, "PERMISSION_MASK");
        int IDX_ROLE_TYPE_CD = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_CD");
        int IDX_ROLE_TYPE_SID = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_SID");
        int IDX_WFSTG_CD = DB.GetReaderOrdinal(rdr, "WFSTG_CD");
        int IDX_WFSTG_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_MBR_SID");

        while (rdr.Read()){
        ret.Add(new SecurityMask {
        ACTN_CD = (IDX_ACTN_CD < 0 || rdr.IsDBNull(IDX_ACTN_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ACTN_CD),
        ACTN_SID = (IDX_ACTN_SID < 0 || rdr.IsDBNull(IDX_ACTN_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ACTN_SID),
        DEAL_MBR_SID = (IDX_DEAL_MBR_SID < 0 || rdr.IsDBNull(IDX_DEAL_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_MBR_SID),
        DEAL_TYPE_CD = (IDX_DEAL_TYPE_CD < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_CD),
        PERMISSION_MASK = (IDX_PERMISSION_MASK < 0 || rdr.IsDBNull(IDX_PERMISSION_MASK)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PERMISSION_MASK),
        ROLE_TYPE_CD = (IDX_ROLE_TYPE_CD < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_CD),
        ROLE_TYPE_SID = (IDX_ROLE_TYPE_SID < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TYPE_SID),
        WFSTG_CD = (IDX_WFSTG_CD < 0 || rdr.IsDBNull(IDX_WFSTG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD),
        WFSTG_MBR_SID = (IDX_WFSTG_MBR_SID < 0 || rdr.IsDBNull(IDX_WFSTG_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID)
        });
        } // while
        return ret;
        }
        */

    } // End of class SecurityMask


    [DataContract]
    public partial class CustomerItem
    {

        [DataMember]
        public System.Int32 access_type { set; get; }


        [DataMember]
        public System.Boolean actv_ind { set; get; }


        [DataMember]
        public System.Int32 cdms_cust_div_id { set; get; }


        [DataMember]
        public System.Int32 cdms_cust_id { set; get; }


        [DataMember]
        public System.String cust_chnl { set; get; }


        [DataMember]
        public System.String cust_div_nm { set; get; }


        [DataMember]
        public System.Int32 cust_lvl_id { set; get; }


        [DataMember]
        public System.String cust_nm { set; get; }


        [DataMember]
        public System.String cust_type { set; get; }


        [DataMember]
        public System.String CustCategory { set; get; }


        [DataMember]
        public System.Int32 DEAL_FLG { set; get; }


        [DataMember]
        public System.String deal_type_cd { set; get; }


        [DataMember]
        public System.String disp_nm { set; get; }


        [DataMember]
        public System.String hosted_geo { set; get; }


        [DataMember]
        public System.Boolean IS_CORP_ACCNT { set; get; }


        [DataMember]
        public System.Int32 mail_notification { set; get; }


        /*
        private static List<CustomerItem> CustomerItemFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<CustomerItem>();
        int IDX_access_type = DB.GetReaderOrdinal(rdr, "access_type");
        int IDX_actv_ind = DB.GetReaderOrdinal(rdr, "actv_ind");
        int IDX_cdms_cust_div_id = DB.GetReaderOrdinal(rdr, "cdms_cust_div_id");
        int IDX_cdms_cust_id = DB.GetReaderOrdinal(rdr, "cdms_cust_id");
        int IDX_cust_chnl = DB.GetReaderOrdinal(rdr, "cust_chnl");
        int IDX_cust_div_nm = DB.GetReaderOrdinal(rdr, "cust_div_nm");
        int IDX_cust_lvl_id = DB.GetReaderOrdinal(rdr, "cust_lvl_id");
        int IDX_cust_nm = DB.GetReaderOrdinal(rdr, "cust_nm");
        int IDX_cust_type = DB.GetReaderOrdinal(rdr, "cust_type");
        int IDX_CustCategory = DB.GetReaderOrdinal(rdr, "CustCategory");
        int IDX_DEAL_FLG = DB.GetReaderOrdinal(rdr, "DEAL_FLG");
        int IDX_deal_type_cd = DB.GetReaderOrdinal(rdr, "deal_type_cd");
        int IDX_disp_nm = DB.GetReaderOrdinal(rdr, "disp_nm");
        int IDX_hosted_geo = DB.GetReaderOrdinal(rdr, "hosted_geo");
        int IDX_IS_CORP_ACCNT = DB.GetReaderOrdinal(rdr, "IS_CORP_ACCNT");
        int IDX_mail_notification = DB.GetReaderOrdinal(rdr, "mail_notification");

        while (rdr.Read()){
        ret.Add(new CustomerItem {
        access_type = (IDX_access_type < 0 || rdr.IsDBNull(IDX_access_type)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_access_type),
        actv_ind = (IDX_actv_ind < 0 || rdr.IsDBNull(IDX_actv_ind)) ? default(System.Boolean) : ((int)rdr[IDX_actv_ind] == 1),
        cdms_cust_div_id = (IDX_cdms_cust_div_id < 0 || rdr.IsDBNull(IDX_cdms_cust_div_id)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cdms_cust_div_id),
        cdms_cust_id = (IDX_cdms_cust_id < 0 || rdr.IsDBNull(IDX_cdms_cust_id)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cdms_cust_id),
        cust_chnl = (IDX_cust_chnl < 0 || rdr.IsDBNull(IDX_cust_chnl)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_chnl),
        cust_div_nm = (IDX_cust_div_nm < 0 || rdr.IsDBNull(IDX_cust_div_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_div_nm),
        cust_lvl_id = (IDX_cust_lvl_id < 0 || rdr.IsDBNull(IDX_cust_lvl_id)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cust_lvl_id),
        cust_nm = (IDX_cust_nm < 0 || rdr.IsDBNull(IDX_cust_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_nm),
        cust_type = (IDX_cust_type < 0 || rdr.IsDBNull(IDX_cust_type)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_type),
        CustCategory = (IDX_CustCategory < 0 || rdr.IsDBNull(IDX_CustCategory)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CustCategory),
        DEAL_FLG = (IDX_DEAL_FLG < 0 || rdr.IsDBNull(IDX_DEAL_FLG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_FLG),
        deal_type_cd = (IDX_deal_type_cd < 0 || rdr.IsDBNull(IDX_deal_type_cd)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_deal_type_cd),
        disp_nm = (IDX_disp_nm < 0 || rdr.IsDBNull(IDX_disp_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_disp_nm),
        hosted_geo = (IDX_hosted_geo < 0 || rdr.IsDBNull(IDX_hosted_geo)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_hosted_geo),
        IS_CORP_ACCNT = (IDX_IS_CORP_ACCNT < 0 || rdr.IsDBNull(IDX_IS_CORP_ACCNT)) ? default(System.Boolean) : ((int)rdr[IDX_IS_CORP_ACCNT] == 1),
        mail_notification = (IDX_mail_notification < 0 || rdr.IsDBNull(IDX_mail_notification)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_mail_notification)
        });
        } // while
        return ret;
        }
        */

    } // End of class CustomerItem


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



    [DataContract]
    public partial class SecurityAction
    {

        [DataMember]
        public System.Int64 ATRB_BIT { set; get; }


        [DataMember]
        public System.Int64 ATRB_MAGNITUDE { set; get; }


        [DataMember]
        public System.String FACT_ATRB_CD { set; get; }


        [DataMember]
        public System.Int32 FACT_ATRB_SID { set; get; }


        /*
        private static List<SecurityAction> SecurityActionFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<SecurityAction>();
        int IDX_ATRB_BIT = DB.GetReaderOrdinal(rdr, "ATRB_BIT");
        int IDX_ATRB_MAGNITUDE = DB.GetReaderOrdinal(rdr, "ATRB_MAGNITUDE");
        int IDX_FACT_ATRB_CD = DB.GetReaderOrdinal(rdr, "FACT_ATRB_CD");
        int IDX_FACT_ATRB_SID = DB.GetReaderOrdinal(rdr, "FACT_ATRB_SID");

        while (rdr.Read()){
        ret.Add(new SecurityAction {
        ATRB_BIT = (IDX_ATRB_BIT < 0 || rdr.IsDBNull(IDX_ATRB_BIT)) ? default(System.Int64) : rdr.GetFieldValue<System.Int64>(IDX_ATRB_BIT),
        ATRB_MAGNITUDE = (IDX_ATRB_MAGNITUDE < 0 || rdr.IsDBNull(IDX_ATRB_MAGNITUDE)) ? default(System.Int64) : rdr.GetFieldValue<System.Int64>(IDX_ATRB_MAGNITUDE),
        FACT_ATRB_CD = (IDX_FACT_ATRB_CD < 0 || rdr.IsDBNull(IDX_FACT_ATRB_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FACT_ATRB_CD),
        FACT_ATRB_SID = (IDX_FACT_ATRB_SID < 0 || rdr.IsDBNull(IDX_FACT_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_FACT_ATRB_SID)
        });
        } // while
        return ret;
        }
        */

    } // End of class SecurityAction


    [DataContract]
    public partial class AppRoleTier
    {

        [DataMember]
        public System.Boolean ACTV_IND { set; get; }


        [DataMember]
        public System.Boolean APPL_ACTV_IND { set; get; }


        [DataMember]
        public System.String APPL_CD { set; get; }


        [DataMember]
        public System.String APPL_DESC { set; get; }


        [DataMember]
        public System.Byte APPL_SID { set; get; }


        [DataMember]
        public System.String APPL_SUITE { set; get; }


        [DataMember]
        public System.DateTime CHG_DTM { set; get; }


        [DataMember]
        public System.Boolean IS_SINGLE_SELECT { set; get; }


        [DataMember]
        public System.Boolean ROLE_ACTV_IND { set; get; }


        [DataMember]
        public System.String ROLE_TIER_CD { set; get; }


        [DataMember]
        public System.Int32 ROLE_TIER_SID { set; get; }


        [DataMember]
        public System.Int32 ROLE_TIER_SRT_ORD { set; get; }


        [DataMember]
        public System.String ROLE_TYPE_CD { set; get; }


        [DataMember]
        public System.String ROLE_TYPE_DESC { set; get; }


        [DataMember]
        public System.String ROLE_TYPE_DSPLY_CD { set; get; }


        [DataMember]
        public System.Int32 ROLE_TYPE_SID { set; get; }


        /*
        private static List<AppRoleTier> AppRoleTierFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<AppRoleTier>();
        int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
        int IDX_APPL_ACTV_IND = DB.GetReaderOrdinal(rdr, "APPL_ACTV_IND");
        int IDX_APPL_CD = DB.GetReaderOrdinal(rdr, "APPL_CD");
        int IDX_APPL_DESC = DB.GetReaderOrdinal(rdr, "APPL_DESC");
        int IDX_APPL_SID = DB.GetReaderOrdinal(rdr, "APPL_SID");
        int IDX_APPL_SUITE = DB.GetReaderOrdinal(rdr, "APPL_SUITE");
        int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
        int IDX_IS_SINGLE_SELECT = DB.GetReaderOrdinal(rdr, "IS_SINGLE_SELECT");
        int IDX_ROLE_ACTV_IND = DB.GetReaderOrdinal(rdr, "ROLE_ACTV_IND");
        int IDX_ROLE_TIER_CD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_CD");
        int IDX_ROLE_TIER_SID = DB.GetReaderOrdinal(rdr, "ROLE_TIER_SID");
        int IDX_ROLE_TIER_SRT_ORD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_SRT_ORD");
        int IDX_ROLE_TYPE_CD = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_CD");
        int IDX_ROLE_TYPE_DESC = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_DESC");
        int IDX_ROLE_TYPE_DSPLY_CD = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_DSPLY_CD");
        int IDX_ROLE_TYPE_SID = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_SID");

        while (rdr.Read()){
        ret.Add(new AppRoleTier {
        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ACTV_IND] == 1),
        APPL_ACTV_IND = (IDX_APPL_ACTV_IND < 0 || rdr.IsDBNull(IDX_APPL_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_APPL_ACTV_IND] == 1),
        APPL_CD = (IDX_APPL_CD < 0 || rdr.IsDBNull(IDX_APPL_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APPL_CD),
        APPL_DESC = (IDX_APPL_DESC < 0 || rdr.IsDBNull(IDX_APPL_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APPL_DESC),
        APPL_SID = (IDX_APPL_SID < 0 || rdr.IsDBNull(IDX_APPL_SID)) ? default(System.Byte) : rdr.GetFieldValue<System.Byte>(IDX_APPL_SID),
        APPL_SUITE = (IDX_APPL_SUITE < 0 || rdr.IsDBNull(IDX_APPL_SUITE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APPL_SUITE),
        CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
        IS_SINGLE_SELECT = (IDX_IS_SINGLE_SELECT < 0 || rdr.IsDBNull(IDX_IS_SINGLE_SELECT)) ? default(System.Boolean) : ((int)rdr[IDX_IS_SINGLE_SELECT] == 1),
        ROLE_ACTV_IND = (IDX_ROLE_ACTV_IND < 0 || rdr.IsDBNull(IDX_ROLE_ACTV_IND)) ? default(System.Boolean) : ((int)rdr[IDX_ROLE_ACTV_IND] == 1),
        ROLE_TIER_CD = (IDX_ROLE_TIER_CD < 0 || rdr.IsDBNull(IDX_ROLE_TIER_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_CD),
        ROLE_TIER_SID = (IDX_ROLE_TIER_SID < 0 || rdr.IsDBNull(IDX_ROLE_TIER_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TIER_SID),
        ROLE_TIER_SRT_ORD = (IDX_ROLE_TIER_SRT_ORD < 0 || rdr.IsDBNull(IDX_ROLE_TIER_SRT_ORD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TIER_SRT_ORD),
        ROLE_TYPE_CD = (IDX_ROLE_TYPE_CD < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_CD),
        ROLE_TYPE_DESC = (IDX_ROLE_TYPE_DESC < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_DESC),
        ROLE_TYPE_DSPLY_CD = (IDX_ROLE_TYPE_DSPLY_CD < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_DSPLY_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_DSPLY_CD),
        ROLE_TYPE_SID = (IDX_ROLE_TYPE_SID < 0 || rdr.IsDBNull(IDX_ROLE_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TYPE_SID)
        });
        } // while
        return ret;
        }
        */

    } // End of class AppRoleTier





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

}
