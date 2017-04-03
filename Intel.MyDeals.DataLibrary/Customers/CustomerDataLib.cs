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
                IN_ALL_CUST_FLG = allCustomers
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    //TABLE 1
                    int IDX_access_type = DB.GetReaderOrdinal(rdr, "access_type");
                    int IDX_actv_ind = DB.GetReaderOrdinal(rdr, "actv_ind");
                    int IDX_cdms_cust_div_id = DB.GetReaderOrdinal(rdr, "cdms_cust_div_id");
                    int IDX_cdms_cust_id = DB.GetReaderOrdinal(rdr, "cdms_cust_id");
                    int IDX_cust_chnl = DB.GetReaderOrdinal(rdr, "cust_chnl");
                    int IDX_cust_div_nm = DB.GetReaderOrdinal(rdr, "cust_div_nm");
                    int IDX_cust_lvl_id = DB.GetReaderOrdinal(rdr, "cust_lvl_id");
                    int IDX_cust_nm = DB.GetReaderOrdinal(rdr, "cust_nm");
                    int IDX_DEAL_FLG = DB.GetReaderOrdinal(rdr, "DEAL_FLG");
                    int IDX_disp_nm = DB.GetReaderOrdinal(rdr, "disp_nm");
                    int IDX_host_geo = DB.GetReaderOrdinal(rdr, "host_geo");

                    while (rdr.Read())
                    {
                        retCustInfo.Add(new MyCustomersInformation
                        {
                            access_type = (IDX_access_type < 0 || rdr.IsDBNull(IDX_access_type)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_access_type),
                            actv_ind = (IDX_actv_ind < 0 || rdr.IsDBNull(IDX_actv_ind)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_actv_ind),
                            cdms_cust_div_id = (IDX_cdms_cust_div_id < 0 || rdr.IsDBNull(IDX_cdms_cust_div_id)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cdms_cust_div_id),
                            cdms_cust_id = (IDX_cdms_cust_id < 0 || rdr.IsDBNull(IDX_cdms_cust_id)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cdms_cust_id),
                            cust_chnl = (IDX_cust_chnl < 0 || rdr.IsDBNull(IDX_cust_chnl)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_chnl),
                            cust_div_nm = (IDX_cust_div_nm < 0 || rdr.IsDBNull(IDX_cust_div_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_div_nm),
                            cust_lvl_id = (IDX_cust_lvl_id < 0 || rdr.IsDBNull(IDX_cust_lvl_id)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cust_lvl_id),
                            cust_nm = (IDX_cust_nm < 0 || rdr.IsDBNull(IDX_cust_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_nm),
                            DEAL_FLG = (IDX_DEAL_FLG < 0 || rdr.IsDBNull(IDX_DEAL_FLG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_FLG),
                            disp_nm = (IDX_disp_nm < 0 || rdr.IsDBNull(IDX_disp_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_disp_nm),
                            host_geo = (IDX_host_geo < 0 || rdr.IsDBNull(IDX_host_geo)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_host_geo)
                        });
                    } // while

                    ret.CustomerInfo = retCustInfo;
                    rdr.NextResult();

                    //TABLE 2
                    int IDX_cdms_cust_div_id2 = DB.GetReaderOrdinal(rdr, "cdms_cust_div_id");
                    int IDX_cdms_cust_id2 = DB.GetReaderOrdinal(rdr, "cdms_cust_id");
                    int IDX_cust_nm2 = DB.GetReaderOrdinal(rdr, "cust_nm");
                    int IDX_disp_nm2 = DB.GetReaderOrdinal(rdr, "disp_nm");
                    int IDX_geo_nm = DB.GetReaderOrdinal(rdr, "geo_nm");
                    int IDX_sold_to_id = DB.GetReaderOrdinal(rdr, "sold_to_id");

                    while (rdr.Read())
                    {
                        retCustSoldTo.Add(new MyCustomersSoldTo
                        {
                            cdms_cust_div_id = (IDX_cdms_cust_div_id2 < 0 || rdr.IsDBNull(IDX_cdms_cust_div_id2)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cdms_cust_div_id2),
                            cdms_cust_id = (IDX_cdms_cust_id2 < 0 || rdr.IsDBNull(IDX_cdms_cust_id2)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cdms_cust_id2),
                            cust_nm = (IDX_cust_nm2 < 0 || rdr.IsDBNull(IDX_cust_nm2)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cust_nm2),
                            disp_nm = (IDX_disp_nm2 < 0 || rdr.IsDBNull(IDX_disp_nm2)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_disp_nm2),
                            geo_nm = (IDX_geo_nm < 0 || rdr.IsDBNull(IDX_geo_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_geo_nm),
                            sold_to_id = (IDX_sold_to_id < 0 || rdr.IsDBNull(IDX_sold_to_id)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_sold_to_id)
                        });
                    } // while

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
