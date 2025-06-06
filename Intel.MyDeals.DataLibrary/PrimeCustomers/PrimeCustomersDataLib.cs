using System;
using System.Linq;
using System.Data;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Intel.MyDeals.Entities;
using System.Collections.Generic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataAccessLib;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class PrimeCustomersDataLib : IPrimeCustomersDataLib
    {
        public List<PrimeCustomers> GetPrimeCustomerDetails()
        {
            var ret = new List<PrimeCustomers>();
            var cmd = new Procs.dbo.PR_MYDL_GET_PRIM_CUST_DTL { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_IS_ACTV = DB.GetReaderOrdinal(rdr, "IS_ACTV");
                    int IDX_PRIM_CUST_CTRY = DB.GetReaderOrdinal(rdr, "PRIM_CUST_CTRY");
                    int IDX_PRIM_CUST_ID = DB.GetReaderOrdinal(rdr, "PRIM_CUST_ID");
                    int IDX_PRIM_CUST_NM = DB.GetReaderOrdinal(rdr, "PRIM_CUST_NM");
                    int IDX_PRIM_LVL_ID = DB.GetReaderOrdinal(rdr, "PRIM_LVL_ID");
                    int IDX_PRIM_LVL_NM = DB.GetReaderOrdinal(rdr, "PRIM_LVL_NM");
                    int IDX_PRIM_SID = DB.GetReaderOrdinal(rdr, "PRIM_SID");
                    int IDX_RPL_STS = DB.GetReaderOrdinal(rdr, "RPL_STS");
                    int IDX_RPL_STS_CD = DB.GetReaderOrdinal(rdr, "RPL_STS_CD");

                    while (rdr.Read())
                    {
                        ret.Add(new PrimeCustomers
                        {
                            IS_ACTV = (IDX_IS_ACTV < 0 || rdr.IsDBNull(IDX_IS_ACTV)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_ACTV),
                            PRIM_CUST_CTRY = (IDX_PRIM_CUST_CTRY < 0 || rdr.IsDBNull(IDX_PRIM_CUST_CTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_CUST_CTRY),
                            PRIM_CUST_ID = (IDX_PRIM_CUST_ID < 0 || rdr.IsDBNull(IDX_PRIM_CUST_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_CUST_ID),
                            PRIM_CUST_NM = (IDX_PRIM_CUST_NM < 0 || rdr.IsDBNull(IDX_PRIM_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_CUST_NM),
                            PRIM_LVL_ID = (IDX_PRIM_LVL_ID < 0 || rdr.IsDBNull(IDX_PRIM_LVL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_LVL_ID),
                            PRIM_LVL_NM = (IDX_PRIM_LVL_NM < 0 || rdr.IsDBNull(IDX_PRIM_LVL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_LVL_NM),
                            PRIM_SID = (IDX_PRIM_SID < 0 || rdr.IsDBNull(IDX_PRIM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_SID),
                            RPL_STS = (IDX_RPL_STS < 0 || rdr.IsDBNull(IDX_RPL_STS)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_RPL_STS),
                            RPL_STS_CD = (IDX_RPL_STS_CD < 0 || rdr.IsDBNull(IDX_RPL_STS_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPL_STS_CD)
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

        public List<PrimeCustomers> GetPrimeCustomerDetails(string filter, string sort, int take, int skip)
        {
            var ret = new List<PrimeCustomers>();
            var cmd = new Procs.dbo.PR_MYDL_GET_PRIM_CUST_DTL_FILTER
            {
                FILTER = filter,
                SORT = sort,
                TAKE = take,
                SKIP = skip,
                MODE = "SELECT",
                FLTRCOL = "",
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_IS_ACTV = DB.GetReaderOrdinal(rdr, "IS_ACTV");
                    int IDX_PRIM_CUST_CTRY = DB.GetReaderOrdinal(rdr, "PRIM_CUST_CTRY");
                    int IDX_PRIM_CUST_ID = DB.GetReaderOrdinal(rdr, "PRIM_CUST_ID");
                    int IDX_PRIM_CUST_NM = DB.GetReaderOrdinal(rdr, "PRIM_CUST_NM");
                    int IDX_PRIM_LVL_ID = DB.GetReaderOrdinal(rdr, "PRIM_LVL_ID");
                    int IDX_PRIM_LVL_NM = DB.GetReaderOrdinal(rdr, "PRIM_LVL_NM");
                    int IDX_PRIM_SID = DB.GetReaderOrdinal(rdr, "PRIM_SID");
                    int IDX_RPL_STS = DB.GetReaderOrdinal(rdr, "RPL_STS");
                    int IDX_RPL_STS_CD = DB.GetReaderOrdinal(rdr, "RPL_STS_CD");
                    int IDX_TotalRows = DB.GetReaderOrdinal(rdr, "TotalRows");

                    while (rdr.Read())
                    {
                        ret.Add(new PrimeCustomers
                        {
                            IS_ACTV = (IDX_IS_ACTV < 0 || rdr.IsDBNull(IDX_IS_ACTV)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_ACTV),
                            PRIM_CUST_CTRY = (IDX_PRIM_CUST_CTRY < 0 || rdr.IsDBNull(IDX_PRIM_CUST_CTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_CUST_CTRY),
                            PRIM_CUST_ID = (IDX_PRIM_CUST_ID < 0 || rdr.IsDBNull(IDX_PRIM_CUST_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_CUST_ID),
                            PRIM_CUST_NM = (IDX_PRIM_CUST_NM < 0 || rdr.IsDBNull(IDX_PRIM_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_CUST_NM),
                            PRIM_LVL_ID = (IDX_PRIM_LVL_ID < 0 || rdr.IsDBNull(IDX_PRIM_LVL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_LVL_ID),
                            PRIM_LVL_NM = (IDX_PRIM_LVL_NM < 0 || rdr.IsDBNull(IDX_PRIM_LVL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_LVL_NM),
                            PRIM_SID = (IDX_PRIM_SID < 0 || rdr.IsDBNull(IDX_PRIM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_SID),
                            RPL_STS = (IDX_RPL_STS < 0 || rdr.IsDBNull(IDX_RPL_STS)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_RPL_STS),
                            RPL_STS_CD = (IDX_RPL_STS_CD < 0 || rdr.IsDBNull(IDX_RPL_STS_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPL_STS_CD),
                            TotalRows = (IDX_TotalRows < 0 || rdr.IsDBNull(IDX_TotalRows)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TotalRows)
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

        public List<string> GetPrimeCustData(string fieldName)
        {
            var ret = new List<string>();
            var cmd = new Procs.dbo.PR_MYDL_GET_PRIM_CUST_DTL_FILTER
            {
                FILTER = "",
                SORT = "",
                TAKE = 0,
                SKIP = 0,
                MODE = "FILTER",
                FLTRCOL = fieldName,
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_COL_NM_FLR = DB.GetReaderOrdinal(rdr, "FILTER_DATA");
                    while (rdr.Read())
                    {
                        ret.Add((IDX_COL_NM_FLR < 0 || rdr.IsDBNull(IDX_COL_NM_FLR)) ? String.Empty : rdr.GetString(IDX_COL_NM_FLR));
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


        public UpdatedPrimeCustomerDetail ManagePrimeCustomers(CrudModes mode, PrimeCustomers data)
        {
            List<UpdatedPrimeCustomerDetail> ret = ManagePrimeCustomersExcute(mode, data);
            return ret.FirstOrDefault();
        }

        /// <summary>
        /// This will help to INSERT, UPDATE, DELETE from Prime Customer Master table
        /// </summary>
        /// <param name="mode"></param> // CrudModes - Insert / Update / Delete
        /// <param name="data"></param>
        /// <returns></returns>
        public List<UpdatedPrimeCustomerDetail> ManagePrimeCustomersExcute(CrudModes mode, PrimeCustomers data)
        {
            var retPrimeCustomers = new List<UpdatedPrimeCustomerDetail>();

            using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_PRIM_CUST
            {
                in_prim_sid = data.PRIM_SID,
                in_prim_cust_id = data.PRIM_CUST_ID,
                in_prim_cust_nm = data.PRIM_CUST_NM,
                in_prim_cust_ctry = data.PRIM_CUST_CTRY,
                in_prim_lvl_id = data.PRIM_LVL_ID,
                in_prim_lvl_nm = data.PRIM_CUST_NM,
                in_rpl_sts_code = data.RPL_STS_CD,
                in_is_actv = data.IS_ACTV,
                in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                in_mode = mode.ToString()
            }))
            {
                int IDX_DEALID = DB.GetReaderOrdinal(rdr, "DEALID");
                int IDX_IS_ACTV = DB.GetReaderOrdinal(rdr, "IS_ACTV");
                int IDX_PRIM_CUST_CTRY = DB.GetReaderOrdinal(rdr, "PRIM_CUST_CTRY");
                int IDX_PRIM_CUST_ID = DB.GetReaderOrdinal(rdr, "PRIM_CUST_ID");
                int IDX_PRIM_CUST_NM = DB.GetReaderOrdinal(rdr, "PRIM_CUST_NM");
                int IDX_PRIM_LVL_ID = DB.GetReaderOrdinal(rdr, "PRIM_LVL_ID");
                int IDX_PRIM_LVL_NM = DB.GetReaderOrdinal(rdr, "PRIM_LVL_NM");
                int IDX_PRIM_SID = DB.GetReaderOrdinal(rdr, "PRIM_SID");
                int IDX_RPL_STS = DB.GetReaderOrdinal(rdr, "RPL_STS");
                int IDX_RPL_STS_CD = DB.GetReaderOrdinal(rdr, "RPL_STS_CD");
                int IDX_ERROR_MSG = DB.GetReaderOrdinal(rdr, "ERROR_MSG");

                while (rdr.Read())
                {
                    retPrimeCustomers.Add(new UpdatedPrimeCustomerDetail
                    {
                        DEALID = (IDX_DEALID < 0 || rdr.IsDBNull(IDX_DEALID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEALID),
                        IS_ACTV = (IDX_IS_ACTV < 0 || rdr.IsDBNull(IDX_IS_ACTV)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_ACTV),
                        PRIM_CUST_CTRY = (IDX_PRIM_CUST_CTRY < 0 || rdr.IsDBNull(IDX_PRIM_CUST_CTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_CUST_CTRY),
                        PRIM_CUST_ID = (IDX_PRIM_CUST_ID < 0 || rdr.IsDBNull(IDX_PRIM_CUST_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_CUST_ID),
                        PRIM_CUST_NM = (IDX_PRIM_CUST_NM < 0 || rdr.IsDBNull(IDX_PRIM_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_CUST_NM),
                        PRIM_LVL_ID = (IDX_PRIM_LVL_ID < 0 || rdr.IsDBNull(IDX_PRIM_LVL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_LVL_ID),
                        PRIM_LVL_NM = (IDX_PRIM_LVL_NM < 0 || rdr.IsDBNull(IDX_PRIM_LVL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_LVL_NM),
                        PRIM_SID = (IDX_PRIM_SID < 0 || rdr.IsDBNull(IDX_PRIM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_SID),
                        RPL_STS = (IDX_RPL_STS < 0 || rdr.IsDBNull(IDX_RPL_STS)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_RPL_STS),
                        RPL_STS_CD = (IDX_RPL_STS_CD < 0 || rdr.IsDBNull(IDX_RPL_STS_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPL_STS_CD),
                        ERROR_MSG = (IDX_ERROR_MSG < 0 || rdr.IsDBNull(IDX_ERROR_MSG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ERROR_MSG)
                    });
                }
            }

            return retPrimeCustomers;
        }

        public List<UnPrimeDeals> GetUnPrimeDeals()
        {
            var ret = new List<UnPrimeDeals>();
            var cmd = new Procs.dbo.PR_MYDL_GET_UNPRIM_DEALS
            {
                in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CNTRCT_OBJ_SID = DB.GetReaderOrdinal(rdr, "CNTRCT_OBJ_SID");
                    int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "Emp_WWID");
                    int IDX_END_CUST_OBJ = DB.GetReaderOrdinal(rdr, "END_CUST_OBJ");
                    int IDX_END_CUSTOMER_COUNTRY = DB.GetReaderOrdinal(rdr, "END_CUSTOMER_COUNTRY");
                    int IDX_END_CUSTOMER_RETAIL = DB.GetReaderOrdinal(rdr, "END_CUSTOMER_RETAIL");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_TITLE = DB.GetReaderOrdinal(rdr, "TITLE");
                    int IDX_STATUS = DB.GetReaderOrdinal(rdr, "Status");
                    int IDX_REASON = DB.GetReaderOrdinal(rdr, "Reason");

                    while (rdr.Read())
                    {
                        ret.Add(new UnPrimeDeals
                        {
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CNTRCT_OBJ_SID = (IDX_CNTRCT_OBJ_SID < 0 || rdr.IsDBNull(IDX_CNTRCT_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CNTRCT_OBJ_SID),
                            EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
                            END_CUST_OBJ = (IDX_END_CUST_OBJ < 0 || rdr.IsDBNull(IDX_END_CUST_OBJ)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUST_OBJ),
                            END_CUSTOMER_COUNTRY = (IDX_END_CUSTOMER_COUNTRY < 0 || rdr.IsDBNull(IDX_END_CUSTOMER_COUNTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUSTOMER_COUNTRY),
                            END_CUSTOMER_RETAIL = (IDX_END_CUSTOMER_RETAIL < 0 || rdr.IsDBNull(IDX_END_CUSTOMER_RETAIL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUSTOMER_RETAIL),
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
                            TITLE = (IDX_TITLE < 0 || rdr.IsDBNull(IDX_TITLE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_TITLE),
                            UNIFIED_STATUS = (IDX_STATUS < 0 || rdr.IsDBNull(IDX_STATUS)) ? String.Empty : rdr.GetFieldValue<String>(IDX_STATUS),
                            UNIFIED_REASON = (IDX_REASON < 0 || rdr.IsDBNull(IDX_REASON)) ? String.Empty : rdr.GetFieldValue<String>(IDX_REASON)
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


        public List<UnPrimeDeals> GetUnPrimeDeals(int skip, int take, string sort, string inFilters)
        {
            var ret = new List<UnPrimeDeals>();
            var cmd = new Procs.dbo.PR_MYDL_GET_UNPRIM_DEALS_BY_FILTER
            {
                in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                skipRows= skip,
                takeRows= take,
                sort = sort == null ? "" : sort,
                fltrcol = inFilters == null ? "" : inFilters
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CNTRCT_OBJ_SID = DB.GetReaderOrdinal(rdr, "CNTRCT_OBJ_SID");
                    int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "Emp_WWID");
                    int IDX_END_CUST_OBJ = DB.GetReaderOrdinal(rdr, "END_CUST_OBJ");
                    int IDX_END_CUSTOMER_COUNTRY = DB.GetReaderOrdinal(rdr, "END_CUSTOMER_COUNTRY");
                    int IDX_END_CUSTOMER_RETAIL = DB.GetReaderOrdinal(rdr, "END_CUSTOMER_RETAIL");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_TITLE = DB.GetReaderOrdinal(rdr, "TITLE");
                    int IDX_STATUS = DB.GetReaderOrdinal(rdr, "UNIFIED_STATUS");
                    int IDX_REASON = DB.GetReaderOrdinal(rdr, "UNIFIED_REASON");
                    int IDX_TOTALCOUNT = DB.GetReaderOrdinal(rdr, "TOTALCOUNT");

                    while (rdr.Read())
                    {
                        ret.Add(new UnPrimeDeals
                        {
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CNTRCT_OBJ_SID = (IDX_CNTRCT_OBJ_SID < 0 || rdr.IsDBNull(IDX_CNTRCT_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CNTRCT_OBJ_SID),
                            EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
                            END_CUST_OBJ = (IDX_END_CUST_OBJ < 0 || rdr.IsDBNull(IDX_END_CUST_OBJ)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUST_OBJ),
                            END_CUSTOMER_COUNTRY = (IDX_END_CUSTOMER_COUNTRY < 0 || rdr.IsDBNull(IDX_END_CUSTOMER_COUNTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUSTOMER_COUNTRY),
                            END_CUSTOMER_RETAIL = (IDX_END_CUSTOMER_RETAIL < 0 || rdr.IsDBNull(IDX_END_CUSTOMER_RETAIL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUSTOMER_RETAIL),
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
                            TITLE = (IDX_TITLE < 0 || rdr.IsDBNull(IDX_TITLE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_TITLE),
                            UNIFIED_STATUS = (IDX_STATUS < 0 || rdr.IsDBNull(IDX_STATUS)) ? String.Empty : rdr.GetFieldValue<String>(IDX_STATUS),
                            UNIFIED_REASON = (IDX_REASON < 0 || rdr.IsDBNull(IDX_REASON)) ? String.Empty : rdr.GetFieldValue<String>(IDX_REASON),
                            TOTALCOUNT = (IDX_TOTALCOUNT < 0 || rdr.IsDBNull(IDX_TOTALCOUNT)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TOTALCOUNT)
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

        public List<UnPrimeDealsField> GetUnPrimeDealsFilterValue(string field)
        {
            var ret = new List<UnPrimeDealsField>();
            var cmd = new Procs.dbo.PR_MYDL_GET_UNPRIM_DEALS_FILTER {
                in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                fltrcol = field
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_Value = DB.GetReaderOrdinal(rdr, "value");

                    while (rdr.Read())
                    {

                        ret.Add(new UnPrimeDealsField
                        {
                            value = (IDX_Value < 0 || rdr.IsDBNull(IDX_Value)) ? String.Empty : rdr.GetValue(IDX_Value).ToString()
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

        public List<Countires> GetCountries()
        {
            var ret = new List<Countires>();
            var cmd = new Procs.dbo.PR_MYDL_GET_CTRY_DATA { };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_CTRY_CD = DB.GetReaderOrdinal(rdr, "CTRY_CD");
                int IDX_CTRY_NM = DB.GetReaderOrdinal(rdr, "CTRY_NM");
                int IDX_CTRY_XPORT_CTRL_CD = DB.GetReaderOrdinal(rdr, "CTRY_XPORT_CTRL_CD");

                while (rdr.Read())
                {
                    ret.Add(new Countires
                    {
                        CTRY_CD = (IDX_CTRY_CD < 0 || rdr.IsDBNull(IDX_CTRY_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CTRY_CD),
                        CTRY_NM = (IDX_CTRY_NM < 0 || rdr.IsDBNull(IDX_CTRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CTRY_NM),
                        CTRY_XPORT_CTRL_CD = (IDX_CTRY_XPORT_CTRL_CD < 0 || rdr.IsDBNull(IDX_CTRY_XPORT_CTRL_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CTRY_XPORT_CTRL_CD)
                    });
                }
            }
            if (ret != null)
            {
                ret = ret.OrderBy(x => x.CTRY_NM).ToList();
            }
            return ret;
        }

        public List<PrimeCustomers> GetPrimeCustomers()
        {
            var ret = new List<PrimeCustomers>();
            ret = GetPrimeCustomerDetails().Where(dd => dd.IS_ACTV == true).OrderBy(x => x.PRIM_CUST_NM).ToList();
            PrimeCustomers AnyData = new PrimeCustomers();
            AnyData.IS_ACTV = true;
            AnyData.PRIM_CUST_CTRY = "";
            AnyData.PRIM_CUST_ID = 0;
            AnyData.PRIM_CUST_NM = "Any";
            AnyData.PRIM_LVL_ID = 0;
            AnyData.PRIM_LVL_NM = "Any";
            AnyData.PRIM_SID = 0;
            AnyData.RPL_STS = false;
            AnyData.RPL_STS_CD = "";
            ret.Insert(0, AnyData);
            return ret;
        }

        public List<PrimeCustomerDetails> GetEndCustomerData(string endCustomerName, string endCustomerCountry)
        {

            var cmd = new Procs.dbo.PR_MYDL_PRIM_VAL { @in_end_cust_nm = endCustomerName, @in_end_cust_ctry = endCustomerCountry };
            var ret = new List<PrimeCustomerDetails>();

            //    private static List<PrimeCustomerDetails> PrimeCustomerDetailsFromReader(SqlDataReader rdr)
            //{
            // This helper method is template generated.
            // Refer to that template for details to modify this code.

            //var ret = new List<PrimeCustomerDetails>();
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {

                int IDX_IS_PRIME = DB.GetReaderOrdinal(rdr, "IS_PRIME");
                int IDX_PRIM_CUST_ID = DB.GetReaderOrdinal(rdr, "PRIM_CUST_ID");
                int IDX_PRIM_CUST_NM = DB.GetReaderOrdinal(rdr, "PRIM_CUST_NM");

                while (rdr.Read())
                {
                    ret.Add(new PrimeCustomerDetails
                    {
                        IS_PRIME = (IDX_IS_PRIME < 0 || rdr.IsDBNull(IDX_IS_PRIME)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_IS_PRIME),
                        PRIM_CUST_ID = (IDX_PRIM_CUST_ID < 0 || rdr.IsDBNull(IDX_PRIM_CUST_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_CUST_ID),
                        PRIM_CUST_NM = (IDX_PRIM_CUST_NM < 0 || rdr.IsDBNull(IDX_PRIM_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_CUST_NM)
                    });
                } // while
            }
            return ret;
        }

        public bool UpdateUnPrimeDeals(int dealId, string primeCustomerName, string primeCustomerCountry)
        {
            var result = false;
            var cmd = new Procs.dbo.PR_MYDL_UPD_DEAL_UNPRIM_ATRBS
            {
                in_deal_id = dealId,
                in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                in_prim_nm = primeCustomerName,
                in_prim_ctry = primeCustomerCountry
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    var ret = new List<UnPrimedDealDetails>();
                    int IDX_IS_PRIMED_CUST = DB.GetReaderOrdinal(rdr, "IS_PRIMED_CUST");
                    while (rdr.Read())
                    {
                        ret.Add(new UnPrimedDealDetails
                        {
                            IS_PRIMED_CUST = (IDX_IS_PRIMED_CUST < 0 || rdr.IsDBNull(IDX_IS_PRIMED_CUST)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_IS_PRIMED_CUST)
                        });
                    }
                    if (ret != null)
                    {
                        if (ret.Where(x => x.IS_PRIMED_CUST == "1").ToList().Count() == 1)
                        {
                            result = true;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return result;
        }

        public void sendMail(string primeCustomerName, string primeCustomerCountry, string primeCustID, int dealId)
        {
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_PRIM_CUST_MAIL
                {
                    @in_cust_nm = primeCustomerName,
                    @in_cust_ctry = primeCustomerCountry,
                    @in_cust_id = primeCustID,
                    @in_deal_id = dealId,
                    @in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID
                };
                DataAccess.ExecuteNonQuery(cmd);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

        }

        public EndCustomerObject FetchEndCustomerMap(string endCustName, string endCustCountry, string primedCustomerL1Id)
        {
            EndCustomerObject retObj = new EndCustomerObject();

            var cmd = new Procs.dbo.PR_MYDL_PRIM_VAL()
            {
                in_end_cust_nm = endCustName,
                in_end_cust_ctry = endCustCountry,
                in_prim_cust_id = primedCustomerL1Id
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_PRIM_CUST_NM = DB.GetReaderOrdinal(rdr, "PRIM_CUST_NM");
                    int IDX_PRIM_CUST_ID = DB.GetReaderOrdinal(rdr, "PRIM_CUST_ID");
                    int IDX_PRIM_LVL_ID = DB.GetReaderOrdinal(rdr, "PRIM_LVL_ID");
                    int IDX_IS_PRIME = DB.GetReaderOrdinal(rdr, "IS_PRIME ");
                    int IDX_IS_RPL = DB.GetReaderOrdinal(rdr, "IS_RPL");
                    int IDX_RPL_STS_CD = DB.GetReaderOrdinal(rdr, "RPL_STS_CD");


                    while (rdr.Read())
                    {

                        retObj.UnifiedEndCustomer = (IDX_PRIM_CUST_NM < 0 || rdr.IsDBNull(IDX_PRIM_CUST_NM))
                            ? String.Empty
                            : rdr.GetFieldValue<System.String>(IDX_PRIM_CUST_NM);
                        retObj.UnifiedEndCustomerId = (IDX_PRIM_CUST_ID < 0 || rdr.IsDBNull(IDX_PRIM_CUST_ID))
                           ? default(System.Int32)
                           : rdr.GetFieldValue<System.Int32>(IDX_PRIM_CUST_ID);
                        retObj.UnifiedCountryEndCustomerId = (IDX_PRIM_LVL_ID < 0 || rdr.IsDBNull(IDX_PRIM_LVL_ID))
                           ? default(System.Int32)
                           : rdr.GetFieldValue<System.Int32>(IDX_PRIM_LVL_ID);
                        retObj.IsUnifiedEndCustomer = (IDX_IS_PRIME < 0 || rdr.IsDBNull(IDX_IS_PRIME))
                            ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_IS_PRIME);
                        retObj.IsRPLedEndCustomer = (IDX_IS_RPL < 0 || rdr.IsDBNull(IDX_IS_RPL)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_IS_RPL);
                        retObj.RPLStatusCode = (IDX_RPL_STS_CD < 0 || rdr.IsDBNull(IDX_RPL_STS_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPL_STS_CD);

                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return retObj;
        }

        public List<EndCustomer> ValidateEndCustomer(string endCustObj)
        {
            List<EndCustomer> endCustomer = new List<EndCustomer>();
            var cmd = new Procs.dbo.PR_MYDL_PRIM_VAL_MULTIPLE()
            {
                in_json = endCustObj
            };
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_END_CUSTOMER_RETAIL = DB.GetReaderOrdinal(rdr, "END_CUSTOMER_RETAIL");
                    int IDX_IS_EXCLUDE = DB.GetReaderOrdinal(rdr, "IS_EXCLUDE");
                    int IDX_IS_PRIMED_CUST = DB.GetReaderOrdinal(rdr, "IS_PRIMED_CUST");
                    int IDX_IS_RPL = DB.GetReaderOrdinal(rdr, "IS_RPL");
                    int IDX_PRIMED_CUST_CNTRY = DB.GetReaderOrdinal(rdr, "PRIMED_CUST_CNTRY");
                    int IDX_PRIMED_CUST_ID = DB.GetReaderOrdinal(rdr, "PRIMED_CUST_ID");
                    int IDX_PRIMED_CUST_NM = DB.GetReaderOrdinal(rdr, "PRIMED_CUST_NM");
                    int IDX_RPL_STS_CD = DB.GetReaderOrdinal(rdr, "RPL_STS_CD");




                    while (rdr.Read())
                    {
                        endCustomer.Add(new EndCustomer
                        {
                            END_CUSTOMER_RETAIL = (IDX_END_CUSTOMER_RETAIL < 0 || rdr.IsDBNull(IDX_END_CUSTOMER_RETAIL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUSTOMER_RETAIL),
                            IS_EXCLUDE = (IDX_IS_EXCLUDE < 0 || rdr.IsDBNull(IDX_IS_EXCLUDE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_IS_EXCLUDE),
                            IS_PRIMED_CUST = (IDX_IS_PRIMED_CUST < 0 || rdr.IsDBNull(IDX_IS_PRIMED_CUST)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_IS_PRIMED_CUST),
                            IS_RPL = (IDX_IS_RPL < 0 || rdr.IsDBNull(IDX_IS_RPL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_IS_RPL),
                            PRIMED_CUST_CNTRY = (IDX_PRIMED_CUST_CNTRY < 0 || rdr.IsDBNull(IDX_PRIMED_CUST_CNTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIMED_CUST_CNTRY),
                            PRIMED_CUST_ID = (IDX_PRIMED_CUST_ID < 0 || rdr.IsDBNull(IDX_PRIMED_CUST_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIMED_CUST_ID),
                            PRIMED_CUST_NM = (IDX_PRIMED_CUST_NM < 0 || rdr.IsDBNull(IDX_PRIMED_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIMED_CUST_NM),
                            RPL_STS_CD = (IDX_RPL_STS_CD < 0 || rdr.IsDBNull(IDX_RPL_STS_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPL_STS_CD)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return endCustomer;
        }

        public List<UnifiedDealsSummary> UploadBulkUnifyDeals(List<UnifyDeal> unifyDeals)
        {
            in_t_end_cust_unify dt = new in_t_end_cust_unify();
            unifyDeals.ForEach(x =>
            dt.AddRow(x)
            );
            var ret = new List<UnifiedDealsSummary>();
            var cmd = new Procs.dbo.PR_MYDL_END_CUSTOMER_UNIFY()
            {
                @Unify_input_data = dt,
                @in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID
            };
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_COMMENTS = DB.GetReaderOrdinal(rdr, "COMMENTS");
                    int IDX_Deal_No = DB.GetReaderOrdinal(rdr, "Deal_No");
                    int IDX_No_Of_Deals = DB.GetReaderOrdinal(rdr, "No.Of.Deals");

                    while (rdr.Read())
                    {
                        ret.Add(new UnifiedDealsSummary
                        {
                            COMMENTS = (IDX_COMMENTS < 0 || rdr.IsDBNull(IDX_COMMENTS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COMMENTS),
                            Deal_No = (IDX_Deal_No < 0 || rdr.IsDBNull(IDX_Deal_No)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Deal_No),
                            No_Of_Deals = (IDX_No_Of_Deals < 0 || rdr.IsDBNull(IDX_No_Of_Deals)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_No_Of_Deals)
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

        public List<DealsUnificationValidationSummary> ValidateBulkUnifyDeals(List<UnifyDeal> unifyDeals)
        {
            in_t_end_cust_unify dt = new in_t_end_cust_unify();
            unifyDeals.ForEach(x =>
            dt.AddRow(x)
            );
            var ret = new List<DealsUnificationValidationSummary>();
            var cmd = new Procs.dbo.PR_MYDL_END_CUSTOMER_UNIFY_VALIDATE()
            {
                @Unify_input_data = dt
            };
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_COMMENTS = DB.GetReaderOrdinal(rdr, "COMMENTS");
                    int IDX_END_CUSTOMER_COUNTRY = DB.GetReaderOrdinal(rdr, "END_CUSTOMER_COUNTRY");
                    int IDX_END_CUSTOMER_RETAIL = DB.GetReaderOrdinal(rdr, "END_CUSTOMER_RETAIL");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new DealsUnificationValidationSummary
                        {
                            COMMENTS = (IDX_COMMENTS < 0 || rdr.IsDBNull(IDX_COMMENTS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COMMENTS),
                            END_CUSTOMER_COUNTRY = (IDX_END_CUSTOMER_COUNTRY < 0 || rdr.IsDBNull(IDX_END_CUSTOMER_COUNTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUSTOMER_COUNTRY),
                            END_CUSTOMER_RETAIL = (IDX_END_CUSTOMER_RETAIL < 0 || rdr.IsDBNull(IDX_END_CUSTOMER_RETAIL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUSTOMER_RETAIL),
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID)
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

        public List<UnPrimedDealLogs> UnPrimeDealsLogs(int dealId, string endCustData)
        {
            var ret = new List<UnPrimedDealLogs>();
            var cmd = new Procs.dbo.PR_MYDL_UCD_LOG_VAL
            {
                in_end_cust_obj = endCustData,
                in_deal_id = dealId,
                in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID

            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {

                    int IDX_END_CUSTOMER_RETAIL = DB.GetReaderOrdinal(rdr, "END_CUSTOMER_RETAIL");
                    int IDX_PRIMED_CUST_CNTRY = DB.GetReaderOrdinal(rdr, "PRIMED_CUST_CNTRY");
                    int IDX_PRIMED_CUST_ID = DB.GetReaderOrdinal(rdr, "PRIMED_CUST_ID");

                    while (rdr.Read())
                    {
                        ret.Add(new UnPrimedDealLogs
                        {
                            END_CUSTOMER_RETAIL = (IDX_END_CUSTOMER_RETAIL < 0 || rdr.IsDBNull(IDX_END_CUSTOMER_RETAIL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUSTOMER_RETAIL),
                            PRIMED_CUST_CNTRY = (IDX_PRIMED_CUST_CNTRY < 0 || rdr.IsDBNull(IDX_PRIMED_CUST_CNTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIMED_CUST_CNTRY),
                            PRIMED_CUST_ID = (IDX_PRIMED_CUST_ID < 0 || rdr.IsDBNull(IDX_PRIMED_CUST_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIMED_CUST_ID)
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

        public List<UCDRetry> RetryUCDRequest(bool retryFlag, string endCustomer, string endCustomerCtry)
        {
            var ret = new List<UCDRetry>();
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_UCD_LOG_RETRY_COUNT
                {
                    @in_retry_flag = retryFlag,
                    @in_end_cust_nm = endCustomer,
                    @in_end_cust_ctry = endCustomerCtry
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {

                    int IDX_END_CUST_OBJ = DB.GetReaderOrdinal(rdr, "END_CUST_OBJ");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new UCDRetry
                        {
                            END_CUST_OBJ = (IDX_END_CUST_OBJ < 0 || rdr.IsDBNull(IDX_END_CUST_OBJ)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUST_OBJ),
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID)
                        });
                    } // while

                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        public List<DealIdEcJsonDetails> SaveUcdRequestData(string endCustomerName, string primeCustomerCountry, int dealId, string request, string response, string accId,
          string status)
        {
            var ret = new List<DealIdEcJsonDetails>();
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_INS_UPD_UCD_RSPN_RQST_LOG
                {
                    @in_cust_nm = endCustomerName,
                    @in_cust_ctry = primeCustomerCountry,
                    @in_deal_id = dealId,
                    @in_rqst_json = request,
                    @in_rspn_json = response,
                    @in_acct_id = accId,
                    @in_sts = status,
                    @in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {

                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
                    int IDX_END_CUST_OBJ = DB.GetReaderOrdinal(rdr, "END_CUST_OBJ");

                    while (rdr.Read())
                    {
                        ret.Add(new DealIdEcJsonDetails
                        {
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                            DEAL_ID = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                            END_CUST_OBJ = (IDX_END_CUST_OBJ < 0 || rdr.IsDBNull(IDX_END_CUST_OBJ)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUST_OBJ)
                        });
                    } // while

                }


            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        public List<RplStatusCode> GetRplStatusCodes()
        {
            var ret = new List<RplStatusCode>();
            var cmd = new Procs.dbo.PR_MYDL_GET_RPL_DATA { };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_RPL_STS = DB.GetReaderOrdinal(rdr, "RPL_STS");
                int IDX_RPL_STS_CD = DB.GetReaderOrdinal(rdr, "RPL_STS_CD");
                int IDX_RPL_STS_SID = DB.GetReaderOrdinal(rdr, "RPL_STS_SID");

                while (rdr.Read())
                {
                    ret.Add(new RplStatusCode
                    {
                        RPL_STS = (IDX_RPL_STS < 0 || rdr.IsDBNull(IDX_RPL_STS)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_RPL_STS),
                        RPL_STS_CD = (IDX_RPL_STS_CD < 0 || rdr.IsDBNull(IDX_RPL_STS_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPL_STS_CD),
                        RPL_STS_SID = (IDX_RPL_STS_SID < 0 || rdr.IsDBNull(IDX_RPL_STS_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RPL_STS_SID)
                    });
                }
            }
            if (ret != null)
            {
                ret = ret.OrderBy(x => x.RPL_STS_CD).ToList();
            }
            return ret;
        }

        public List<DealReconInvalidRecords> updateDealRecon(List<DealRecon> lstDealRecon)
        {
            var ret = new List<DealReconInvalidRecords>();
            T_DEAL_RECON dt = new T_DEAL_RECON();
            lstDealRecon.ForEach(x =>
            dt.AddRow(x)
            );
            var cmd = new Procs.dbo.PR_MYDL_DEAL_RECON()
            {
                @deal_recon_input_data = dt,
                @in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID
            };
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL ID");
                    int IDX_ERR_MSG = DB.GetReaderOrdinal(rdr, "ERR_MSG");
                    int IDX_EXISTING_UCD_COUNTRY = DB.GetReaderOrdinal(rdr, "EXISTING_UCD_COUNTRY");
                    int IDX_EXISTING_UCD_COUNTRY_CUST_ID = DB.GetReaderOrdinal(rdr, "EXISTING_UCD_COUNTRY_CUST_ID");
                    int IDX_EXISTING_UCD_GLOBAL_ID = DB.GetReaderOrdinal(rdr, "EXISTING_UCD_GLOBAL_ID");
                    int IDX_EXISTING_UCD_GLOBAL_NAME = DB.GetReaderOrdinal(rdr, "EXISTING_UCD_GLOBAL_NAME");
                    int IDX_NEW_UCD_COUNTRY = DB.GetReaderOrdinal(rdr, "NEW_UCD_COUNTRY");
                    int IDX_NEW_UCD_COUNTRY_CUST_ID = DB.GetReaderOrdinal(rdr, "NEW_UCD_COUNTRY_CUST_ID");
                    int IDX_NEW_UCD_GLOBAL_ID = DB.GetReaderOrdinal(rdr, "NEW_UCD_GLOBAL_ID");
                    int IDX_NEW_UCD_GLOBAL_NAME = DB.GetReaderOrdinal(rdr, "NEW_UCD_GLOBAL_NAME");
                    int IDX_RPL_STS_CD = DB.GetReaderOrdinal(rdr, "RPL_STS_CD");

                    while (rdr.Read())
                    {
                        ret.Add(new DealReconInvalidRecords
                        {
                            DEAL_ID = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                            ERR_MSG = (IDX_ERR_MSG < 0 || rdr.IsDBNull(IDX_ERR_MSG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ERR_MSG),
                            EXISTING_UCD_COUNTRY = (IDX_EXISTING_UCD_COUNTRY < 0 || rdr.IsDBNull(IDX_EXISTING_UCD_COUNTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EXISTING_UCD_COUNTRY),
                            EXISTING_UCD_COUNTRY_CUST_ID = (IDX_EXISTING_UCD_COUNTRY_CUST_ID < 0 || rdr.IsDBNull(IDX_EXISTING_UCD_COUNTRY_CUST_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EXISTING_UCD_COUNTRY_CUST_ID),
                            EXISTING_UCD_GLOBAL_ID = (IDX_EXISTING_UCD_GLOBAL_ID < 0 || rdr.IsDBNull(IDX_EXISTING_UCD_GLOBAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EXISTING_UCD_GLOBAL_ID),
                            EXISTING_UCD_GLOBAL_NAME = (IDX_EXISTING_UCD_GLOBAL_NAME < 0 || rdr.IsDBNull(IDX_EXISTING_UCD_GLOBAL_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EXISTING_UCD_GLOBAL_NAME),
                            NEW_UCD_COUNTRY = (IDX_NEW_UCD_COUNTRY < 0 || rdr.IsDBNull(IDX_NEW_UCD_COUNTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NEW_UCD_COUNTRY),
                            NEW_UCD_COUNTRY_CUST_ID = (IDX_NEW_UCD_COUNTRY_CUST_ID < 0 || rdr.IsDBNull(IDX_NEW_UCD_COUNTRY_CUST_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_NEW_UCD_COUNTRY_CUST_ID),
                            NEW_UCD_GLOBAL_ID = (IDX_NEW_UCD_GLOBAL_ID < 0 || rdr.IsDBNull(IDX_NEW_UCD_GLOBAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_NEW_UCD_GLOBAL_ID),
                            NEW_UCD_GLOBAL_NAME = (IDX_NEW_UCD_GLOBAL_NAME < 0 || rdr.IsDBNull(IDX_NEW_UCD_GLOBAL_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NEW_UCD_GLOBAL_NAME),
                            RPL_STS_CD = (IDX_RPL_STS_CD < 0 || rdr.IsDBNull(IDX_RPL_STS_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RPL_STS_CD)
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
        public DataTable InsertPrimedCustomerData(string endCustomerRetail, string endCustomerCountry, string primCustomerName, int primCustomerId, int primCustomerLvlId, string rplStatusCode, string UnifiedEndCustomerLvl2Name, int empWWID)
        {
            try
            {
                var cmd = new Procs.dbo.PR_INS_MYDL_PRIM_CUST()
                {
                    in_end_cust_retail = endCustomerRetail,
                    in_cust_ctry = endCustomerCountry,
                    in_cust_nm = primCustomerName,
                    in_lvl2_nm = UnifiedEndCustomerLvl2Name,
                    in_cust_id = primCustomerId,
                    in_cust_lvl_id = primCustomerLvlId,
                    in_rpl_sts_cd = rplStatusCode,
                    in_emp_wwid = empWWID
                };

                return DataAccess.ExecuteDataTable(cmd);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                return null;
            }

        }
        public DataTable ResubmissionDeals(string dealId, string endCustomerData)
        {
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_UCD_RETRIGGER()
                {
                    in_deal_id = dealId,
                    in_end_cust_data = endCustomerData

                };

                return DataAccess.ExecuteDataTable(cmd);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                return null;
            }
        }

        public bool CheckForIQRDeals(string dealId)
        {
            try
            {
                var isNotIqrDeal = true;
                var cmd = new Procs.dbo.PR_MYDL_CHECK_FOR_IQR_DEALS()
                {
                    IN_DEAL_ID = dealId
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int output = DB.GetReaderOrdinal(rdr, "OUTPUT");

                    while (rdr.Read())
                    {
                        isNotIqrDeal = rdr.GetFieldValue<bool>(output);
                    }
                }
                return isNotIqrDeal;
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                return false;
            }
        }

        public List<UCD_RQST_RSPN> GetReprocessUCDData(int Deal_Id = 0, string End_Cust_NM = "", string End_Cust_Ctry = "")
        {
            var ret = new List<UCD_RQST_RSPN>();
            var cmd = new Procs.dbo.PR_UCD_RQST_RSPN_LOG 
            {
                DEAL_ID = Deal_Id,
                END_CUST_NM = End_Cust_NM,
                END_CUST_CTRY = End_Cust_Ctry
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                { 
                    int IDX_END_CUST_SID = DB.GetReaderOrdinal(rdr, "END_CUST_SID");
                    int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
                    int IDX_END_CUST_NM = DB.GetReaderOrdinal(rdr, "END_CUST_NM");
                    int IDX_END_CUST_CTRY = DB.GetReaderOrdinal(rdr, "END_CUST_CTRY");
                    int IDX_RQST_JSON_MSG = DB.GetReaderOrdinal(rdr, "RQST_JSON_MSG");
                    int IDX_ACCT_ID = DB.GetReaderOrdinal(rdr, "ACCT_ID");
                    int IDX_AMQ_RSPN = DB.GetReaderOrdinal(rdr, "AMQ_RSPN");
                    int IDX_STS = DB.GetReaderOrdinal(rdr, "STS");
                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_RETRY_COUNT = DB.GetReaderOrdinal(rdr, "RETRY_COUNT");
                    int IDX_ERR_RES_COMMENT = DB.GetReaderOrdinal(rdr, "ERR_RES_COMMENT");
                    int IDX_END_CUST_OBJ = DB.GetReaderOrdinal(rdr, "END_CUST_OBJ");
                    while (rdr.Read())
                    {
                        ret.Add(new UCD_RQST_RSPN
                        {
                            END_CUST_SID = (IDX_END_CUST_SID < 0 || rdr.IsDBNull(IDX_END_CUST_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_END_CUST_SID),
                            DEAL_ID = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                            END_CUST_NM = (IDX_END_CUST_NM < 0 || rdr.IsDBNull(IDX_END_CUST_NM)) ? System.String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUST_NM),
                            END_CUST_CTRY = (IDX_END_CUST_CTRY < 0 || rdr.IsDBNull(IDX_END_CUST_CTRY)) ? System.String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUST_CTRY),
                            RQST_JSON_MSG = (IDX_RQST_JSON_MSG < 0 || rdr.IsDBNull(IDX_RQST_JSON_MSG)) ? System.String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_JSON_MSG),
                            ACCT_ID = (IDX_ACCT_ID < 0 || rdr.IsDBNull(IDX_ACCT_ID)) ? System.String.Empty : rdr.GetFieldValue<System.String>(IDX_ACCT_ID),
                            AMQ_RSPN = (IDX_AMQ_RSPN < 0 || rdr.IsDBNull(IDX_AMQ_RSPN)) ? System.String.Empty : rdr.GetFieldValue<System.String>(IDX_AMQ_RSPN),
                            STS = (IDX_STS < 0 || rdr.IsDBNull(IDX_STS)) ? System.String.Empty : rdr.GetFieldValue<System.String>(IDX_STS),
                            END_CUST_OBJ= (IDX_END_CUST_OBJ < 0 || rdr.IsDBNull(IDX_END_CUST_OBJ)) ? System.String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUST_OBJ),
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID)
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
    }
}
