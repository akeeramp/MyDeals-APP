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
            //var retCustSoldTo = new List<MyCustomersSoldTo>();

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
                    int IDX_ACCESS_TYPE = DB.GetReaderOrdinal(rdr, "ACCESS_TYPE");
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_CUST_CHNL = DB.GetReaderOrdinal(rdr, "CUST_CHNL");
                    int IDX_CUST_DIV_NM = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM");
                    int IDX_CUST_DIV_SID = DB.GetReaderOrdinal(rdr, "CUST_DIV_SID");
                    int IDX_CUST_LVL_SID = DB.GetReaderOrdinal(rdr, "CUST_LVL_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_CUST_SID = DB.GetReaderOrdinal(rdr, "CUST_SID");
                    int IDX_DEAL_FLG = DB.GetReaderOrdinal(rdr, "DEAL_FLG");
                    int IDX_DISP_NM = DB.GetReaderOrdinal(rdr, "DISP_NM");
                    int IDX_HOST_GEO = DB.GetReaderOrdinal(rdr, "HOST_GEO");

                    while (rdr.Read())
                    {
                        retCustInfo.Add(new MyCustomersInformation
                        {
                            ACCESS_TYPE = (IDX_ACCESS_TYPE < 0 || rdr.IsDBNull(IDX_ACCESS_TYPE)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACCESS_TYPE),
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            CUST_CHNL = (IDX_CUST_CHNL < 0 || rdr.IsDBNull(IDX_CUST_CHNL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_CHNL),
                            CUST_DIV_NM = (IDX_CUST_DIV_NM < 0 || rdr.IsDBNull(IDX_CUST_DIV_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_DIV_NM),
                            CUST_DIV_SID = (IDX_CUST_DIV_SID < 0 || rdr.IsDBNull(IDX_CUST_DIV_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_DIV_SID),
                            CUST_LVL_SID = (IDX_CUST_LVL_SID < 0 || rdr.IsDBNull(IDX_CUST_LVL_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_LVL_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            CUST_SID = (IDX_CUST_SID < 0 || rdr.IsDBNull(IDX_CUST_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_SID),
                            DEAL_FLG = (IDX_DEAL_FLG < 0 || rdr.IsDBNull(IDX_DEAL_FLG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_FLG),
                            DISP_NM = (IDX_DISP_NM < 0 || rdr.IsDBNull(IDX_DISP_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DISP_NM),
                            HOST_GEO = (IDX_HOST_GEO < 0 || rdr.IsDBNull(IDX_HOST_GEO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HOST_GEO)
                        });
                    } // while

                    ret.CustomerInfo = retCustInfo;
                    rdr.NextResult();

                    // REMOVED FOR NOW... DON'T NEED SOLD TO VALUES HERE
                    ////TABLE 2
                    //int IDX_CUST_DIV_SID2 = DB.GetReaderOrdinal(rdr, "CUST_DIV_SID");
                    //int IDX_CUST_NM2 = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    //int IDX_CUST_SID2 = DB.GetReaderOrdinal(rdr, "CUST_SID");
                    //int IDX_DISP_NM2 = DB.GetReaderOrdinal(rdr, "DISP_NM");
                    //int IDX_GEO_NM = DB.GetReaderOrdinal(rdr, "GEO_NM");
                    //int IDX_SOLD_TO_ID = DB.GetReaderOrdinal(rdr, "SOLD_TO_ID");

                    //while (rdr.Read())
                    //{
                    //    retCustSoldTo.Add(new MyCustomersSoldTo
                    //    {
                    //        CUST_DIV_SID = (IDX_CUST_DIV_SID2 < 0 || rdr.IsDBNull(IDX_CUST_DIV_SID2)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_DIV_SID2),
                    //        CUST_NM = (IDX_CUST_NM2 < 0 || rdr.IsDBNull(IDX_CUST_NM2)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM2),
                    //        CUST_SID = (IDX_CUST_SID2 < 0 || rdr.IsDBNull(IDX_CUST_SID2)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_SID2),
                    //        DISP_NM = (IDX_DISP_NM2 < 0 || rdr.IsDBNull(IDX_DISP_NM2)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DISP_NM2),
                    //        GEO_NM = (IDX_GEO_NM < 0 || rdr.IsDBNull(IDX_GEO_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO_NM),
                    //        SOLD_TO_ID = (IDX_SOLD_TO_ID < 0 || rdr.IsDBNull(IDX_SOLD_TO_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SOLD_TO_ID)
                    //    });
                    //} // while

                    //ret.CustomerSoldTo = retCustSoldTo;
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
