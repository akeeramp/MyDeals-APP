using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures;

namespace Intel.MyDeals.DataLibrary
{
    public class AdminDataLib
    {
        /// <summary>
        /// Get lookup data for attributes that contain pointers to other data.
        /// </summary>
        /// <returns></returns>
        public List<GetSecurityAdminInfo> GetAdminToolSecurity()
        {
            //lock (LOCK_OBJECT)
            //{
            //    if (_adminSecurityTool != null && _adminSecurityTool.Count > 0)
            //    {
            //        return new List<GetSecurityAdminInfo>(_adminSecurityTool); // Return a copy
            //    }
            //}

            var ret = new List<GetSecurityAdminInfo>();

            using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.admin.PR_GET_SECURITY_INFO_ADMIN()))
            {
                int SECURITYFACTSID = rdr.GetOrdinal("SECURITY_FACT_SID");
                int FULLNAME = rdr.GetOrdinal("FULL_NAME");
                int EMPWWID = rdr.GetOrdinal("EMP_WWID");
                int LKUPMBRSID = rdr.GetOrdinal("LKUP_MBR_SID");
                int ACCESSLEVEL = rdr.GetOrdinal("ACCESS_LEVEL");

                while (rdr.Read())
                {
                    if (rdr.IsDBNull(SECURITYFACTSID)) { continue; }

                    ret.Add(new GetSecurityAdminInfo
                    {
                        SECURITY_FACT_SID = rdr.GetInt32(SECURITYFACTSID),
                        FULL_NAME = String.Format("{0}", rdr[FULLNAME]).Trim().ToUpper(),
                        EMP_WWID = rdr.GetInt32(EMPWWID),
                        LKUP_MBR_SID = rdr.GetInt32(LKUPMBRSID),
                        ACCESS_LEVEL = String.Format("{0}", rdr[ACCESSLEVEL]).Trim().ToUpper()
                    });
                }
            }

            //lock (LOCK_OBJECT)
            //{
            //    _adminSecurityTool = ret;
            //}

            return ret;

            //DataTable dtResult = new DataTable();
            //dtResult =DataAccess.ExecuteDataTable(new Procs.CDMS.admin.PR_GET_SECURITY_INFO_ADMIN ());
            //return dtResult;
        }


        #region Dropdowns
        public List<AdminBasicDropdowns> GetAdminBasicDropdowns()
        {
            var ret = new List<AdminBasicDropdowns>();

            using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.admin.PR_MANAGE_BASIC_DROPDOWNS() { idsid = Utils.ThreadUser, mode = "Select" }))
            {
                int IDX_actv_ind = DB.GetReaderOrdinal(rdr, "actv_ind");
                int IDX_atrb_col_nm = DB.GetReaderOrdinal(rdr, "atrb_col_nm");
                int IDX_cust_mbr_sid = DB.GetReaderOrdinal(rdr, "cust_mbr_sid");
                int IDX_cust_nm = DB.GetReaderOrdinal(rdr, "cust_nm");
                int IDX_deal_mbr_sid = DB.GetReaderOrdinal(rdr, "deal_mbr_sid");
                int IDX_deal_type_cd = DB.GetReaderOrdinal(rdr, "deal_type_cd");
                int IDX_drop_down = DB.GetReaderOrdinal(rdr, "drop_down");
                int IDX_layer1_sid = DB.GetReaderOrdinal(rdr, "layer1_sid");
                int IDX_metadata_fact_sid = DB.GetReaderOrdinal(rdr, "metadata_fact_sid");

                while (rdr.Read())
                {
                    ret.Add(new AdminBasicDropdowns
                    {
                        actv_ind = rdr.IsDBNull(IDX_actv_ind) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_actv_ind),
                        atrb_col_nm = rdr.IsDBNull(IDX_atrb_col_nm) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_atrb_col_nm),
                        cust_mbr_sid = rdr.IsDBNull(IDX_cust_mbr_sid) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cust_mbr_sid),
                        cust_nm = rdr.IsDBNull(IDX_cust_nm) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_cust_nm),
                        deal_mbr_sid = rdr.IsDBNull(IDX_deal_mbr_sid) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_deal_mbr_sid),
                        deal_type_cd = rdr.IsDBNull(IDX_deal_type_cd) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_deal_type_cd),
                        drop_down = rdr.IsDBNull(IDX_drop_down) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_drop_down),
                        layer1_sid = rdr.IsDBNull(IDX_layer1_sid) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_layer1_sid),
                        metadata_fact_sid = rdr.IsDBNull(IDX_metadata_fact_sid) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_metadata_fact_sid)
                    });
                } // while
            }

            return ret;
        }

        public AdminBasicDropdowns SetAdminBasicDropdowns(string mode, AdminBasicDropdowns adminValues)
        {
            var ret = new List<AdminBasicDropdowns>();

            using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.admin.PR_MANAGE_BASIC_DROPDOWNS()
            {
                idsid = Utils.ThreadUser,
                mode = mode,
                metadata_fact_sid = adminValues.metadata_fact_sid,
                atrb_val_char = adminValues.drop_down,
                actv_ind = adminValues.actv_ind,
                deal_mbr_sid = adminValues.deal_mbr_sid,
                layer1_sid = adminValues.layer1_sid,
            }))
            {
                int IDX_actv_ind = DB.GetReaderOrdinal(rdr, "actv_ind");
                int IDX_atrb_col_nm = DB.GetReaderOrdinal(rdr, "atrb_col_nm");
                int IDX_cust_mbr_sid = DB.GetReaderOrdinal(rdr, "cust_mbr_sid");
                int IDX_cust_nm = DB.GetReaderOrdinal(rdr, "cust_nm");
                int IDX_deal_mbr_sid = DB.GetReaderOrdinal(rdr, "deal_mbr_sid");
                int IDX_deal_type_cd = DB.GetReaderOrdinal(rdr, "deal_type_cd");
                int IDX_drop_down = DB.GetReaderOrdinal(rdr, "drop_down");
                int IDX_layer1_sid = DB.GetReaderOrdinal(rdr, "layer1_sid");
                int IDX_metadata_fact_sid = DB.GetReaderOrdinal(rdr, "metadata_fact_sid");

                while (rdr.Read())
                {
                    ret.Add(new AdminBasicDropdowns
                    {
                        actv_ind = rdr.IsDBNull(IDX_actv_ind) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_actv_ind),
                        atrb_col_nm = rdr.IsDBNull(IDX_atrb_col_nm) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_atrb_col_nm),
                        cust_mbr_sid = rdr.IsDBNull(IDX_cust_mbr_sid) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cust_mbr_sid),
                        cust_nm = rdr.IsDBNull(IDX_cust_nm) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_cust_nm),
                        deal_mbr_sid = rdr.IsDBNull(IDX_deal_mbr_sid) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_deal_mbr_sid),
                        deal_type_cd = rdr.IsDBNull(IDX_deal_type_cd) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_deal_type_cd),
                        drop_down = rdr.IsDBNull(IDX_drop_down) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_drop_down),
                        layer1_sid = rdr.IsDBNull(IDX_layer1_sid) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_layer1_sid),
                        metadata_fact_sid = rdr.IsDBNull(IDX_metadata_fact_sid) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_metadata_fact_sid)
                    });
                } // while
            }

            return ret.FirstOrDefault();
        }
        #endregion

        #region Customers
        public List<AdminCustomerHeaders> GetAdminCustomerHeaders()
        {
            var cmd = new Procs.CDMS_MYDEALS.admin.PR_MANAGE_CUSTOMERS_HEADERS();

            var ret = new List<AdminCustomerHeaders>();
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                int IDX_CUST_CATEGORY = DB.GetReaderOrdinal(rdr, "CUST_CATEGORY");
                int IDX_CUST_CHNL = DB.GetReaderOrdinal(rdr, "CUST_CHNL");
                int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                int IDX_CUST_TYPE = DB.GetReaderOrdinal(rdr, "CUST_TYPE");
                int IDX_HOSTED_GEO = DB.GetReaderOrdinal(rdr, "HOSTED_GEO");
                int IDX_PRC_GRP_CD = DB.GetReaderOrdinal(rdr, "PRC_GRP_CD");

                while (rdr.Read())
                {
                    ret.Add(new AdminCustomerHeaders
                    {
                        ACTV_IND = rdr.IsDBNull(IDX_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                        CUST_CATEGORY = rdr.IsDBNull(IDX_CUST_CATEGORY) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_CATEGORY),
                        CUST_CHNL = rdr.IsDBNull(IDX_CUST_CHNL) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_CHNL),
                        CUST_MBR_SID = rdr.IsDBNull(IDX_CUST_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                        CUST_NM = rdr.IsDBNull(IDX_CUST_NM) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                        CUST_TYPE = rdr.IsDBNull(IDX_CUST_TYPE) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_TYPE),
                        HOSTED_GEO = rdr.IsDBNull(IDX_HOSTED_GEO) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_HOSTED_GEO),
                        PRC_GRP_CD = rdr.IsDBNull(IDX_PRC_GRP_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_PRC_GRP_CD)
                    });
                } // while
            }

            return ret;
        }

        public CustomerDetailWrapper GetAdminCustomerDetails(int custId)
        {
            var cmd = new Procs.CDMS_MYDEALS.admin.PR_MANAGE_CUSTOMER_DETAILS
            {
                idsid = Utils.ThreadUser,
                mode = "Select",
                cust_id = custId
            };

            var ret = new CustomerDetailWrapper(); // BASE CUSTOMER DATA (Table 1)
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                ret.CustBaseDetails = new CustomerBaseDetails();

                int IDX_DACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                int IDX_CUST_C2A_ACCT_NAME = DB.GetReaderOrdinal(rdr, "CUST_C2A_ACCT_NAME");
                int IDX_CUST_C2A_CPM_ID = DB.GetReaderOrdinal(rdr, "CUST_C2A_CPM_ID");
                int IDX_DCUST_CATEGORY = DB.GetReaderOrdinal(rdr, "CUST_CATEGORY");
                int IDX_CUST_CHNL = DB.GetReaderOrdinal(rdr, "CUST_CHNL");
                int IDX_CUST_EXT_EMAIL = DB.GetReaderOrdinal(rdr, "CUST_EXT_EMAIL");
                int IDX_CUST_FSE_EMAIL = DB.GetReaderOrdinal(rdr, "CUST_FSE_EMAIL");
                int IDX_DCUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                int IDX_DCUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                int IDX_CUST_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_NM_SID");
                int IDX_CUST_TYPE = DB.GetReaderOrdinal(rdr, "CUST_TYPE");
                int IDX_GDM_FLG = DB.GetReaderOrdinal(rdr, "GDM_FLG");
                int IDX_HOSTED_GEO = DB.GetReaderOrdinal(rdr, "HOSTED_GEO");
                int IDX_IS_CORP_ACCNT = DB.GetReaderOrdinal(rdr, "IS_CORP_ACCNT");
                int IDX_PRC_GRP_CD = DB.GetReaderOrdinal(rdr, "PRC_GRP_CD");


                while (rdr.Read())
                {
                    ret.CustBaseDetails = (new CustomerBaseDetails
                    {
                        ACTV_IND = rdr.IsDBNull(IDX_DACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_DACTV_IND),
                        CUST_C2A_ACCT_NAME = rdr.IsDBNull(IDX_CUST_C2A_ACCT_NAME) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_C2A_ACCT_NAME),
                        CUST_C2A_CPM_ID = rdr.IsDBNull(IDX_CUST_C2A_CPM_ID) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_C2A_CPM_ID),
                        CUST_CATEGORY = rdr.IsDBNull(IDX_DCUST_CATEGORY) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_DCUST_CATEGORY),
                        CUST_CHNL = rdr.IsDBNull(IDX_CUST_CHNL) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_CHNL),
                        CUST_EXT_EMAIL = rdr.IsDBNull(IDX_CUST_EXT_EMAIL) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_EXT_EMAIL),
                        CUST_FSE_EMAIL = rdr.IsDBNull(IDX_CUST_FSE_EMAIL) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_FSE_EMAIL),
                        CUST_MBR_SID = rdr.IsDBNull(IDX_DCUST_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DCUST_MBR_SID),
                        CUST_NM = rdr.IsDBNull(IDX_DCUST_NM) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_DCUST_NM),
                        CUST_NM_SID = rdr.IsDBNull(IDX_CUST_NM_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_NM_SID),
                        CUST_TYPE = rdr.IsDBNull(IDX_CUST_TYPE) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_TYPE),
                        GDM_FLG = rdr.IsDBNull(IDX_GDM_FLG) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GDM_FLG),
                        HOSTED_GEO = rdr.IsDBNull(IDX_HOSTED_GEO) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_HOSTED_GEO),
                        IS_CORP_ACCNT = rdr.IsDBNull(IDX_IS_CORP_ACCNT) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_CORP_ACCNT),
                        PRC_GRP_CD = rdr.IsDBNull(IDX_PRC_GRP_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_PRC_GRP_CD)
                    });
                } // while

                rdr.NextResult(); // DIVISION DATA (Table 2)
                ret.CustDivisionData = new List<CustomerDivisionData>();
                int IDX_DIACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                int IDX_CUST_DIV_NM = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM");
                int IDX_DICUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                int IDX_DICUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                IDX_CUST_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_NM_SID");
                IDX_GDM_FLG = DB.GetReaderOrdinal(rdr, "GDM_FLG");
                IDX_IS_CORP_ACCNT = DB.GetReaderOrdinal(rdr, "IS_CORP_ACCNT");

                while (rdr.Read())
                {
                    ret.CustDivisionData.Add(new CustomerDivisionData
                    {
                        ACTV_IND = rdr.IsDBNull(IDX_DIACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_DIACTV_IND),
                        CUST_DIV_NM = rdr.IsDBNull(IDX_CUST_DIV_NM) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_DIV_NM),
                        CUST_MBR_SID = rdr.IsDBNull(IDX_DICUST_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DICUST_MBR_SID),
                        CUST_NM = rdr.IsDBNull(IDX_DICUST_NM) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_DICUST_NM),
                        CUST_NM_SID = rdr.IsDBNull(IDX_CUST_NM_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_NM_SID),
                        GDM_FLG = rdr.IsDBNull(IDX_GDM_FLG) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GDM_FLG),
                        IS_CORP_ACCNT = rdr.IsDBNull(IDX_IS_CORP_ACCNT) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_CORP_ACCNT)
                    });
                } // while

                rdr.NextResult(); // CUST DEAL TYPES DATA (Table 3)
                ret.CustDealTypesData = new List<CustomerDealTypesData>();
                int IDX_DTCUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                int IDX_DTCUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                int IDX_DEAL_MBR_SID = DB.GetReaderOrdinal(rdr, "DEAL_MBR_SID");
                int IDX_DEAL_TYPE_CD = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_CD");
                int IDX_METADATA_ACTV_IND = DB.GetReaderOrdinal(rdr, "METADATA_ACTV_IND");

                while (rdr.Read())
                {
                    ret.CustDealTypesData.Add(new CustomerDealTypesData
                    {
                        CUST_MBR_SID = rdr.IsDBNull(IDX_DTCUST_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DTCUST_MBR_SID),
                        CUST_NM = rdr.IsDBNull(IDX_DTCUST_NM) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_DTCUST_NM),
                        DEAL_MBR_SID = rdr.IsDBNull(IDX_DEAL_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_MBR_SID),
                        DEAL_TYPE_CD = rdr.IsDBNull(IDX_DEAL_TYPE_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_CD),
                        METADATA_ACTV_IND = rdr.IsDBNull(IDX_METADATA_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_METADATA_ACTV_IND)
                    });
                } // while

                rdr.NextResult(); // INDUSTRY KEY CODES (Table 4)
                ret.CustIndustryKeyCodes = new List<CustomerIndustryKeyCodes>();
                int IDX_IKACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                int IDX_ATRB_VAL_TXT = DB.GetReaderOrdinal(rdr, "ATRB_VAL_TXT");
                int IDX_KEY_AT_MBR_SID = DB.GetReaderOrdinal(rdr, "KEY_AT_MBR_SID");

                while (rdr.Read())
                {
                    ret.CustIndustryKeyCodes.Add(new CustomerIndustryKeyCodes
                    {
                        ACTV_IND = rdr.IsDBNull(IDX_IKACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IKACTV_IND),
                        ATRB_VAL_TXT = rdr.IsDBNull(IDX_ATRB_VAL_TXT) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_ATRB_VAL_TXT),
                        KEY_AT_MBR_SID = rdr.IsDBNull(IDX_KEY_AT_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_KEY_AT_MBR_SID)
                    });
                } // while

                rdr.NextResult(); // CCP GROUP CODES (Table 5)
                ret.CustCCPGroupCodes = new List<CustomerCCPGroupCodes>();
                int IDX_CCPACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                IDX_ATRB_VAL_TXT = DB.GetReaderOrdinal(rdr, "ATRB_VAL_TXT");
                IDX_CUST_DIV_NM = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM");
                int IDX_CCPCUST_DIV_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM_SID");

                while (rdr.Read())
                {
                    ret.CustCCPGroupCodes.Add(new CustomerCCPGroupCodes
                    {
                        ACTV_IND = rdr.IsDBNull(IDX_CCPACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_CCPACTV_IND),
                        ATRB_VAL_TXT = rdr.IsDBNull(IDX_ATRB_VAL_TXT) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_ATRB_VAL_TXT),
                        CUST_DIV_NM = rdr.IsDBNull(IDX_CUST_DIV_NM) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_DIV_NM),
                        CUST_DIV_NM_SID = rdr.IsDBNull(IDX_CCPCUST_DIV_NM_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CCPCUST_DIV_NM_SID)
                    });
                } // while

                rdr.NextResult(); // Customer Sales Org Per Divisions (Table 6)
                ret.CustomerSalesOrgPerDivisionData = new List<CustomerSalesOrgPerDivision>();
                int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                int IDX_CUST_DIV_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM_SID");
                int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                int IDX_SLS_ORG_CD = DB.GetReaderOrdinal(rdr, "SLS_ORG_CD");
                int IDX_SOLD_TO_ID = DB.GetReaderOrdinal(rdr, "SOLD_TO_ID");

                while (rdr.Read())
                {
                    ret.CustomerSalesOrgPerDivisionData.Add(new CustomerSalesOrgPerDivision
                    {
                        ACTV_IND = rdr.IsDBNull(IDX_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                        CUST_DIV_NM_SID = rdr.IsDBNull(IDX_CUST_DIV_NM_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_DIV_NM_SID),
                        CUST_MBR_SID = rdr.IsDBNull(IDX_CUST_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                        CUST_NM = rdr.IsDBNull(IDX_CUST_NM) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                        SLS_ORG_CD = rdr.IsDBNull(IDX_SLS_ORG_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_SLS_ORG_CD),
                        SOLD_TO_ID = rdr.IsDBNull(IDX_SOLD_TO_ID) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_SOLD_TO_ID)
                    });
                } // while

                rdr.NextResult(); // CUST Sales Org DROPDOWN VALUES (Table 7)
                ret.CustSalesOrgCodes = new List<CustomerDistinctSalesOrgCodes>();
                IDX_SLS_ORG_CD = DB.GetReaderOrdinal(rdr, "SLS_ORG_CD");

                while (rdr.Read())
                {
                    ret.CustSalesOrgCodes.Add(new CustomerDistinctSalesOrgCodes
                    {
                        SLS_ORG_CD = rdr.IsDBNull(IDX_SLS_ORG_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_SLS_ORG_CD)
                    });
                } // while

                rdr.NextResult(); // CUST CATEGORY DROPDOWN VALUES (Table 8)
                ret.CustCategoryDropdownCodes = new List<CustomerCategoryDropdown>();
                int IDX_CUST_CATEGORY = DB.GetReaderOrdinal(rdr, "CUST_CATEGORY");

                while (rdr.Read())
                {
                    ret.CustCategoryDropdownCodes.Add(new CustomerCategoryDropdown
                    {
                        CUST_CATEGORY = rdr.IsDBNull(IDX_CUST_CATEGORY) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_CUST_CATEGORY)
                    });
                } // while

                rdr.NextResult(); // CustomerC2AAccounts DROPDOWN VALUES (Table 9)
                ret.CustC2ACodes = new List<CustomerC2AAccounts>();
                int IDX_C2A_ACCT_NAME = DB.GetReaderOrdinal(rdr, "C2A_ACCT_NAME");
                int IDX_C2A_CPM_ID = DB.GetReaderOrdinal(rdr, "C2A_CPM_ID");

                while (rdr.Read())
                {
                    ret.CustC2ACodes.Add(new CustomerC2AAccounts
                    {
                        C2A_ACCT_NAME = rdr.IsDBNull(IDX_C2A_ACCT_NAME) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_C2A_ACCT_NAME),
                        C2A_CPM_ID = rdr.IsDBNull(IDX_C2A_CPM_ID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_C2A_CPM_ID)
                    });
                } // while

                rdr.NextResult(); // CUST GEOS DROPDOWN VALUES (Table 10)
                ret.CustGeosDropdownData = new List<CustomerGeosDropdown>();
                int IDX_GACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                int IDX_GEO_ID = DB.GetReaderOrdinal(rdr, "GEO_ID");
                int IDX_GEO_NM = DB.GetReaderOrdinal(rdr, "GEO_NM");

                while (rdr.Read())
                {
                    ret.CustGeosDropdownData.Add(new CustomerGeosDropdown
                    {
                        ACTV_IND = rdr.IsDBNull(IDX_GACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_GACTV_IND),
                        GEO_ID = rdr.IsDBNull(IDX_GEO_ID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GEO_ID),
                        GEO_NM = rdr.IsDBNull(IDX_GEO_NM) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_GEO_NM)
                    });
                } // while

            }

            return ret;
        }

        #endregion

        #region AdminQuoteLetter

        /// <summary>
        /// Performs get operation on data and returns Menu and Deals information
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="dealType"></param>
        /// <param name="dealSubType"></param>
        /// <param name="content0"></param>
        /// <param name="content1"></param>
        /// <returns></returns>
        public List<ManageQuote> ManageQuoteFromReader(string mode, string dealType, string dealSubType, string content0,
            string content1)
        {
            // This helper method is template generated.
            // Refer to that template for details to modify this code.

            var ret = new List<ManageQuote>();

            using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.admin.PR_MANAGE_QUOTES()
            {
                idsid = Utils.ThreadUser,
                mode = mode,
                dealType = dealType,
                dealSubType = dealSubType,
                content0 = content0,
                content1 = content1
            }))
            {
                int IDX_CONTENT0 = DB.GetReaderOrdinal(rdr, "CONTENT0");
                int IDX_CONTENT1 = DB.GetReaderOrdinal(rdr, "CONTENT1");
                int IDX_DEAL_SUBTYPE = DB.GetReaderOrdinal(rdr, "DEAL_SUBTYPE");
                int IDX_DEAL_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_TYPE");
                int IDX_ID = DB.GetReaderOrdinal(rdr, "ID");

                while (rdr.Read())
                {
                    ret.Add(new ManageQuote
                    {
                        CONTENT0 =
                            (IDX_CONTENT0 < 0 || rdr.IsDBNull(IDX_CONTENT0))
                                ? String.Empty
                                : rdr.GetFieldValue<System.String>(IDX_CONTENT0),
                        CONTENT1 =
                            (IDX_CONTENT1 < 0 || rdr.IsDBNull(IDX_CONTENT1))
                                ? String.Empty
                                : rdr.GetFieldValue<System.String>(IDX_CONTENT1),
                        DEAL_SUBTYPE =
                            (IDX_DEAL_SUBTYPE < 0 || rdr.IsDBNull(IDX_DEAL_SUBTYPE))
                                ? String.Empty
                                : rdr.GetFieldValue<System.String>(IDX_DEAL_SUBTYPE),
                        DEAL_TYPE =
                            (IDX_DEAL_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_TYPE))
                                ? String.Empty
                                : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE),
                        ID =
                            (IDX_ID < 0 || rdr.IsDBNull(IDX_ID))
                                ? default(System.Int32)
                                : rdr.GetFieldValue<System.Int32>(IDX_ID)
                    });
                } // while
            }

            return ret;

        }

        /// <summary>
        /// Updates data to db
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="obManageQuote"></param>
        /// <returns></returns>
        public ManageQuote SetQuoteLetter(string mode, ManageQuote obManageQuote)
        {
            // This helper method is template generated.
            // Refer to that template for details to modify this code.

            var ret = new List<ManageQuote>();

            using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.admin.PR_MANAGE_QUOTES()
            {
                idsid = Utils.ThreadUser,
                mode = mode,
                dealType = obManageQuote.DEAL_TYPE,
                dealSubType = obManageQuote.DEAL_SUBTYPE,
                content0 = obManageQuote.CONTENT0,
                content1 = obManageQuote.CONTENT1
            }))
            {
                int IDX_CONTENT0 = DB.GetReaderOrdinal(rdr, "CONTENT0");
                int IDX_CONTENT1 = DB.GetReaderOrdinal(rdr, "CONTENT1");
                int IDX_DEAL_SUBTYPE = DB.GetReaderOrdinal(rdr, "DEAL_SUBTYPE");
                int IDX_DEAL_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_TYPE");
                int IDX_ID = DB.GetReaderOrdinal(rdr, "ID");

                while (rdr.Read())
                {
                    ret.Add(new ManageQuote
                    {
                        CONTENT0 =
                            (IDX_CONTENT0 < 0 || rdr.IsDBNull(IDX_CONTENT0))
                                ? String.Empty
                                : rdr.GetFieldValue<System.String>(IDX_CONTENT0),
                        CONTENT1 =
                            (IDX_CONTENT1 < 0 || rdr.IsDBNull(IDX_CONTENT1))
                                ? String.Empty
                                : rdr.GetFieldValue<System.String>(IDX_CONTENT1),
                        DEAL_SUBTYPE =
                            (IDX_DEAL_SUBTYPE < 0 || rdr.IsDBNull(IDX_DEAL_SUBTYPE))
                                ? String.Empty
                                : rdr.GetFieldValue<System.String>(IDX_DEAL_SUBTYPE),
                        DEAL_TYPE =
                            (IDX_DEAL_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_TYPE))
                                ? String.Empty
                                : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE),
                        ID =
                            (IDX_ID < 0 || rdr.IsDBNull(IDX_ID))
                                ? default(System.Int32)
                                : rdr.GetFieldValue<System.Int32>(IDX_ID)
                    });
                } // while
            }

            return ret.FirstOrDefault();

        }

        #endregion

    }
}
