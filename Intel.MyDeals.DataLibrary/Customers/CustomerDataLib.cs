using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.DataLibrary
{
    public class CustomerDataLib : ICustomerDataLib
    {
        /// <summary>
        /// Get All Customer Divisions
        /// </summary>
        /// <returns>list of customer division data</returns>
        public List<CustomerDivision> GetCustomerDivisions()
        {
            OpLogPerf.Log("GetCustomerDivision");

            var ret = new List<CustomerDivision>();
            var cmd = new Procs.dbo.PR_MYDL_GET_CUST_DIV { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_CUST_CAT = DB.GetReaderOrdinal(rdr, "CUST_CAT");
                    int IDX_CUST_DIV_NM = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM");
                    int IDX_CUST_DIV_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM_SID");
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_CUST_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_NM_SID");
                    int IDX_CUST_TYPE = DB.GetReaderOrdinal(rdr, "CUST_TYPE");
                    int IDX_HOSTED_GEO = DB.GetReaderOrdinal(rdr, "HOSTED_GEO");

                    while (rdr.Read())
                    {
                        ret.Add(new CustomerDivision
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            CUST_CAT = (IDX_CUST_CAT < 0 || rdr.IsDBNull(IDX_CUST_CAT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_CAT),
                            CUST_DIV_NM = (IDX_CUST_DIV_NM < 0 || rdr.IsDBNull(IDX_CUST_DIV_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_DIV_NM),
                            CUST_DIV_NM_SID = (IDX_CUST_DIV_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_DIV_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_DIV_NM_SID),
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            CUST_NM_SID = (IDX_CUST_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_NM_SID),
                            CUST_TYPE = (IDX_CUST_TYPE < 0 || rdr.IsDBNull(IDX_CUST_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_TYPE),
                            HOSTED_GEO = (IDX_HOSTED_GEO < 0 || rdr.IsDBNull(IDX_HOSTED_GEO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HOSTED_GEO)
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

        /// <summary>
        /// Get Customer Divisions information for user making the request
        /// </summary>
        /// <returns>lists of customer data</returns>
        public MyCustomerDetailsWrapper GetMyCustomers(bool fullAccess = false, bool allCustomers = false)
        {
            OpLogPerf.Log("GetMyCustomers");

            var ret = new MyCustomerDetailsWrapper();

            var retCustInfo = new List<MyCustomersInformation>();
            var retCustSoldTo = new List<MyCustomersSoldTo>();

            var cmd = new Procs.dbo.PR_MYDL_GET_MY_CUST
            {
                IN_IDSID = OpUserStack.MyOpUserToken.Usr.Idsid,
                IN_FULL_ACCS_FLG = fullAccess,
                IN_ALL_CUST_FLG = allCustomers
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    //TABLE 1
                    int IDX_ACCS_TYPE = DB.GetReaderOrdinal(rdr, "ACCS_TYPE");
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_CUST_CAT = DB.GetReaderOrdinal(rdr, "CUST_CAT");
                    int IDX_CUST_CHNL = DB.GetReaderOrdinal(rdr, "CUST_CHNL");
                    int IDX_CUST_DISP_NM = DB.GetReaderOrdinal(rdr, "CUST_DISP_NM");
                    int IDX_CUST_DIV_NM = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM");
                    int IDX_CUST_DIV_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM_SID");
                    int IDX_CUST_LVL_SID = DB.GetReaderOrdinal(rdr, "CUST_LVL_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_CUST_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_NM_SID");
                    int IDX_CUST_TYPE = DB.GetReaderOrdinal(rdr, "CUST_TYPE");
                    int IDX_DEAL_FLG = DB.GetReaderOrdinal(rdr, "DEAL_FLG");
                    int IDX_HOSTED_GEO = DB.GetReaderOrdinal(rdr, "HOSTED_GEO");
                    int IDX_MAIL_NOTIF_FLG = DB.GetReaderOrdinal(rdr, "MAIL_NOTIF_FLG");

                    while (rdr.Read())
                    {
                        retCustInfo.Add(new MyCustomersInformation
                        {
                            ACCS_TYPE = (IDX_ACCS_TYPE < 0 || rdr.IsDBNull(IDX_ACCS_TYPE)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ACCS_TYPE),
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ACTV_IND),
                            CUST_CAT = (IDX_CUST_CAT < 0 || rdr.IsDBNull(IDX_CUST_CAT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_CAT),
                            CUST_CHNL = (IDX_CUST_CHNL < 0 || rdr.IsDBNull(IDX_CUST_CHNL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_CHNL),
                            CUST_DISP_NM = (IDX_CUST_DISP_NM < 0 || rdr.IsDBNull(IDX_CUST_DISP_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_DISP_NM),
                            CUST_DIV_NM = (IDX_CUST_DIV_NM < 0 || rdr.IsDBNull(IDX_CUST_DIV_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_DIV_NM),
                            CUST_DIV_NM_SID = (IDX_CUST_DIV_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_DIV_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_DIV_NM_SID),
                            CUST_LVL_SID = (IDX_CUST_LVL_SID < 0 || rdr.IsDBNull(IDX_CUST_LVL_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_LVL_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            CUST_NM_SID = (IDX_CUST_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_NM_SID),
                            CUST_TYPE = (IDX_CUST_TYPE < 0 || rdr.IsDBNull(IDX_CUST_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_TYPE),
                            DEAL_FLG = (IDX_DEAL_FLG < 0 || rdr.IsDBNull(IDX_DEAL_FLG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_FLG),
                            HOSTED_GEO = (IDX_HOSTED_GEO < 0 || rdr.IsDBNull(IDX_HOSTED_GEO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HOSTED_GEO),
                            MAIL_NOTIF_FLG = (IDX_MAIL_NOTIF_FLG < 0 || rdr.IsDBNull(IDX_MAIL_NOTIF_FLG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MAIL_NOTIF_FLG)
                        });
                    }

                    ret.CustomerInfo = retCustInfo;
                    rdr.NextResult();

                    //TABLE 2
                    int IDX_cust_disp_nm = DB.GetReaderOrdinal(rdr, "cust_disp_nm");
                    int IDX_cust_div_nm_sid = DB.GetReaderOrdinal(rdr, "cust_div_nm_sid");
                    int IDX_cust_nm = DB.GetReaderOrdinal(rdr, "cust_nm");
                    int IDX_geo_nm = DB.GetReaderOrdinal(rdr, "geo_nm");
                    int IDX_sold_to_id = DB.GetReaderOrdinal(rdr, "sold_to_id");

                    while (rdr.Read())
                    {
                        retCustSoldTo.Add(new MyCustomersSoldTo
                        {
                            cust_disp_nm = (IDX_cust_disp_nm < 0 || rdr.IsDBNull(IDX_cust_disp_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_disp_nm),
                            cust_div_nm_sid = (IDX_cust_div_nm_sid < 0 || rdr.IsDBNull(IDX_cust_div_nm_sid)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cust_div_nm_sid),
                            cust_nm = (IDX_cust_nm < 0 || rdr.IsDBNull(IDX_cust_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_nm),
                            geo_nm = (IDX_geo_nm < 0 || rdr.IsDBNull(IDX_geo_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_geo_nm),
                            sold_to_id = (IDX_sold_to_id < 0 || rdr.IsDBNull(IDX_sold_to_id)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_sold_to_id)
                        });
                    }

                    ret.CustomerSoldTo = retCustSoldTo;
                }
            }
            catch (Exception ex)
            {
				OpLogPerf.Log(ex);
				throw;
            }
            return ret;
        }
    }
}
