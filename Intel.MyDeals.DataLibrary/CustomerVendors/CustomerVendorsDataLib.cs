using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System.Linq;
using System.Data;
using Intel.Opaque.Tools;


namespace Intel.MyDeals.DataLibrary
{
    public class CustomerVendorsDataLib : ICustomerVendorsDataLib
    {
        /// <summary>
        /// To get Customer Vendors Mapped Data to Admin Screen
        /// </summary>
        /// <param name="custId"></param>
        /// <returns></returns>
        public List<CustomerVendors> GetCustomerVendors(int custId = 0)
        {
            var ret = new List<CustomerVendors>();
            var cmd = new Procs.dbo.PR_MYDL_GET_VNDR_CUST_DTL
            {
                IN_CUST_MBR_SID = custId
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_ATRB_LKUP_DESC = DB.GetReaderOrdinal(rdr, "ATRB_LKUP_DESC");
                    int IDX_ATRB_LKUP_SID = DB.GetReaderOrdinal(rdr, "ATRB_LKUP_SID");
                    int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
                    int IDX_BUSNS_ORG_NM = DB.GetReaderOrdinal(rdr, "BUSNS_ORG_NM");
                    int IDX_CTRY_CD = DB.GetReaderOrdinal(rdr, "CTRY_CD");
                    int IDX_CTRY_NM = DB.GetReaderOrdinal(rdr, "CTRY_NM");
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_DROP_DOWN = DB.GetReaderOrdinal(rdr, "DROP_DOWN");
                    int IDX_OBJ_SET_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_SID");
                    int IDX_VNDR_ID = DB.GetReaderOrdinal(rdr, "VNDR_ID");

                    while (rdr.Read())
                    {
                        ret.Add(new CustomerVendors
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            ATRB_LKUP_DESC = (IDX_ATRB_LKUP_DESC < 0 || rdr.IsDBNull(IDX_ATRB_LKUP_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_LKUP_DESC),
                            ATRB_LKUP_SID = (IDX_ATRB_LKUP_SID < 0 || rdr.IsDBNull(IDX_ATRB_LKUP_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_LKUP_SID),
                            ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID),
                            BUSNS_ORG_NM = (IDX_BUSNS_ORG_NM < 0 || rdr.IsDBNull(IDX_BUSNS_ORG_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BUSNS_ORG_NM),
                            CTRY_CD = (IDX_CTRY_CD < 0 || rdr.IsDBNull(IDX_CTRY_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CTRY_CD),
                            CTRY_NM = (IDX_CTRY_NM < 0 || rdr.IsDBNull(IDX_CTRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CTRY_NM),
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            DROP_DOWN = (IDX_DROP_DOWN < 0 || rdr.IsDBNull(IDX_DROP_DOWN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN),
                            OBJ_SET_TYPE_SID = (IDX_OBJ_SET_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SET_TYPE_SID),
                            VNDR_ID = (IDX_VNDR_ID < 0 || rdr.IsDBNull(IDX_VNDR_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_VNDR_ID)
                        });
                    }
                }


            }

            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return ret;
        }

        public CustomerVendors ManageCustomerVendors(CustomerVendors CustVendor, CrudModes type)
        {
            BasicDropdown data = new BasicDropdown();
            data.ATRB_LKUP_SID = CustVendor.ATRB_LKUP_SID;
            data.OBJ_SET_TYPE_SID = 1;
            data.ATRB_SID = 3353;
            data.CUST_MBR_SID = CustVendor.CUST_MBR_SID;
            data.DROP_DOWN = CustVendor.DROP_DOWN;           
            data.ATRB_LKUP_DESC = string.Empty;
            data.ACTV_IND = CustVendor.ACTV_IND;
            data.ATRB_LKUP_TTIP = "";

            var ret = ExecuteManageCustomerVendorsSP(data, type);
            data = ret.FirstOrDefault();
            if (data != null)
            {
                CustVendor.CUST_NM = data.CUST_NM;
                CustVendor.ATRB_LKUP_SID = data.ATRB_LKUP_SID;
            }

            DataCollections.RecycleCache("_getCustomerVendors");
            DataCollections.RecycleCache("_getVistexCustomerMappings");
            DataCollections.RecycleCache("_getMyCustomers");

            return CustVendor;
        }

        public List<BasicDropdown> ExecuteManageCustomerVendorsSP(BasicDropdown data, CrudModes type)
        {
            var ret = new List<BasicDropdown>();
            Procs.dbo.PR_MYDL_MANAGE_BASIC_DROPDOWNS cmd = new Procs.dbo.PR_MYDL_MANAGE_BASIC_DROPDOWNS();


            cmd = new Procs.dbo.PR_MYDL_MANAGE_BASIC_DROPDOWNS()
            {
                LK_UP_SID = data.ATRB_LKUP_SID,
                MODE = type.ToString(),
                ATRB_SID = data.ATRB_SID,
                OBJ_SET_TYPE_SID = data.OBJ_SET_TYPE_SID,
                CUST_MBR_SID = data.CUST_MBR_SID,
                ATRB_VAL_TXT = data.DROP_DOWN,
                ATRB_LKUP_DESC = data.ATRB_LKUP_DESC,
                ATRB_LKUP_TTIP = data.ATRB_LKUP_TTIP,
                ACTV_IND = data.ACTV_IND,
                EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_ATRB_CD = DB.GetReaderOrdinal(rdr, "ATRB_CD");
                    int IDX_ATRB_LKUP_DESC = DB.GetReaderOrdinal(rdr, "ATRB_LKUP_DESC");
                    int IDX_ATRB_LKUP_SID = DB.GetReaderOrdinal(rdr, "ATRB_LKUP_SID");
                    int IDX_ATRB_LKUP_TTIP = DB.GetReaderOrdinal(rdr, "ATRB_LKUP_TTIP");
                    int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_DFLT_FLG = DB.GetReaderOrdinal(rdr, "DFLT_FLG");
                    int IDX_DROP_DOWN = DB.GetReaderOrdinal(rdr, "DROP_DOWN");
                    int IDX_OBJ_SET_TYPE_CD = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_CD");
                    int IDX_OBJ_SET_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_SID");
                    int IDX_ORD = DB.GetReaderOrdinal(rdr, "ORD");

                    while (rdr.Read())
                    {
                        ret.Add(new BasicDropdown
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            ATRB_CD = (IDX_ATRB_CD < 0 || rdr.IsDBNull(IDX_ATRB_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_CD),
                            ATRB_LKUP_DESC = (IDX_ATRB_LKUP_DESC < 0 || rdr.IsDBNull(IDX_ATRB_LKUP_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_LKUP_DESC),
                            ATRB_LKUP_SID = (IDX_ATRB_LKUP_SID < 0 || rdr.IsDBNull(IDX_ATRB_LKUP_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_LKUP_SID),
                            ATRB_LKUP_TTIP = (IDX_ATRB_LKUP_TTIP < 0 || rdr.IsDBNull(IDX_ATRB_LKUP_TTIP)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_LKUP_TTIP),
                            ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID),
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            DFLT_FLG = (IDX_DFLT_FLG < 0 || rdr.IsDBNull(IDX_DFLT_FLG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DFLT_FLG),
                            DROP_DOWN = (IDX_DROP_DOWN < 0 || rdr.IsDBNull(IDX_DROP_DOWN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN),
                            OBJ_SET_TYPE_CD = (IDX_OBJ_SET_TYPE_CD < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE_CD),
                            OBJ_SET_TYPE_SID = (IDX_OBJ_SET_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SET_TYPE_SID),
                            ORD = (IDX_ORD < 0 || rdr.IsDBNull(IDX_ORD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ORD)
                        });
                    }

                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        public List<VendorsInfo> GetVendorsData()
        {
            var ret = new List<VendorsInfo>();
            var cmd = new Procs.dbo.PR_MYDL_GET_VNDR_DATA { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BUSNS_ORG_NM = DB.GetReaderOrdinal(rdr, "BUSNS_ORG_NM");
                    int IDX_CTRY_CD = DB.GetReaderOrdinal(rdr, "CTRY_CD");
                    int IDX_CTRY_NM = DB.GetReaderOrdinal(rdr, "CTRY_NM");
                    int IDX_VNDR_ID = DB.GetReaderOrdinal(rdr, "VNDR_ID");

                    while (rdr.Read())
                    {
                        ret.Add(new VendorsInfo
                        {
                            BUSNS_ORG_NM = (IDX_BUSNS_ORG_NM < 0 || rdr.IsDBNull(IDX_BUSNS_ORG_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BUSNS_ORG_NM),
                            CTRY_CD = (IDX_CTRY_CD < 0 || rdr.IsDBNull(IDX_CTRY_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CTRY_CD),
                            CTRY_NM = (IDX_CTRY_NM < 0 || rdr.IsDBNull(IDX_CTRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CTRY_NM),
                            VNDR_ID = (IDX_VNDR_ID < 0 || rdr.IsDBNull(IDX_VNDR_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_VNDR_ID)
                        });
                    }
                }
            }

            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
            }

            return ret;
        }


    }
}
