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
    public class PrimeCustomersDataLib : IPrimeCustomersDataLib
    {
        public List<PrimeCustomers> GetPrimeCustomerDetails()
        {
            var ret = new List<PrimeCustomers>();
            var cmd = new Procs.dbo.PR_MYDL_GET_PRIM_CUST_DTL{ };

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
                            RPL_STS = (IDX_RPL_STS < 0 || rdr.IsDBNull(IDX_RPL_STS)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RPL_STS)

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


        public PrimeCustomers ManagePrimeCustomers(CrudModes mode, PrimeCustomers data)
        {
            List<PrimeCustomers> ret = ManagePrimeCustomersExcute(mode, data);
            return ret.FirstOrDefault();
        }

        /// <summary>
        /// This will help to INSERT, UPDATE, DELETE from Prime Customer Master table
        /// </summary>
        /// <param name="mode"></param> // CrudModes - Insert / Update / Delete
        /// <param name="data"></param>
        /// <returns></returns>
        public List<PrimeCustomers> ManagePrimeCustomersExcute(CrudModes mode, PrimeCustomers data)
        {
            var retPrimeCustomers = new List<PrimeCustomers>();

            using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_PRIM_CUST
            {
                in_prim_sid = data.PRIM_SID,
                in_prim_cust_id = data.PRIM_CUST_ID,
                in_prim_cust_nm = data.PRIM_CUST_NM,
                in_prim_cust_ctry = data.PRIM_CUST_CTRY,
                in_prim_lvl_id = data.PRIM_LVL_ID,
                in_prim_lvl_nm = data.PRIM_CUST_NM,
                in_rpl_sts = data.RPL_STS,
                in_is_actv = data.IS_ACTV,
                in_mode = mode.ToString().ToUpper(),
                in_cre_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                in_chg_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID


            }))
            {
                int IDX_IS_ACTV = DB.GetReaderOrdinal(rdr, "IS_ACTV");
                int IDX_PRIM_CUST_CTRY = DB.GetReaderOrdinal(rdr, "PRIM_CUST_CTRY");
                int IDX_PRIM_CUST_ID = DB.GetReaderOrdinal(rdr, "PRIM_CUST_ID");
                int IDX_PRIM_CUST_NM = DB.GetReaderOrdinal(rdr, "PRIM_CUST_NM");
                int IDX_PRIM_LVL_ID = DB.GetReaderOrdinal(rdr, "PRIM_LVL_ID");
                int IDX_PRIM_LVL_NM = DB.GetReaderOrdinal(rdr, "PRIM_LVL_NM");
                int IDX_PRIM_SID = DB.GetReaderOrdinal(rdr, "PRIM_SID");
                int IDX_RPL_STS = DB.GetReaderOrdinal(rdr, "RPL_STS");

                while (rdr.Read())
                {
                    retPrimeCustomers.Add(new PrimeCustomers
                    {
                        IS_ACTV = (IDX_IS_ACTV < 0 || rdr.IsDBNull(IDX_IS_ACTV)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_ACTV),
                        PRIM_CUST_CTRY = (IDX_PRIM_CUST_CTRY < 0 || rdr.IsDBNull(IDX_PRIM_CUST_CTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_CUST_CTRY),
                        PRIM_CUST_ID = (IDX_PRIM_CUST_ID < 0 || rdr.IsDBNull(IDX_PRIM_CUST_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_CUST_ID),
                        PRIM_CUST_NM = (IDX_PRIM_CUST_NM < 0 || rdr.IsDBNull(IDX_PRIM_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_CUST_NM),
                        PRIM_LVL_ID = (IDX_PRIM_LVL_ID < 0 || rdr.IsDBNull(IDX_PRIM_LVL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_LVL_ID),
                        PRIM_LVL_NM = (IDX_PRIM_LVL_NM < 0 || rdr.IsDBNull(IDX_PRIM_LVL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_LVL_NM),
                        PRIM_SID = (IDX_PRIM_SID < 0 || rdr.IsDBNull(IDX_PRIM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_SID),
                        RPL_STS = (IDX_RPL_STS < 0 || rdr.IsDBNull(IDX_RPL_STS)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RPL_STS)
                    });
                } // while
            }


            return retPrimeCustomers;
        }

        public List<UnPrimeDeals> GetUnPrimeDeals()
        {
            var ret = new List<UnPrimeDeals>();
            var cmd = new Procs.dbo.PR_MYDL_GET_UNPRIM_DEALS { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CNTRCT_OBJ_SID = DB.GetReaderOrdinal(rdr, "CNTRCT_OBJ_SID");
                    int IDX_END_CUSTOMER_COUNTRY = DB.GetReaderOrdinal(rdr, "END_CUSTOMER_COUNTRY");
                    int IDX_END_CUSTOMER_RETAIL = DB.GetReaderOrdinal(rdr, "END_CUSTOMER_RETAIL");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new UnPrimeDeals
                        {
                            CNTRCT_OBJ_SID = (IDX_CNTRCT_OBJ_SID < 0 || rdr.IsDBNull(IDX_CNTRCT_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CNTRCT_OBJ_SID),
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

        public List<Countires> GetCountries()
        {
            var ret = new List<Countires>();
            var cmd = new Procs.dbo.PR_MYDL_GET_CTRY_DATA { };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_CTRY_CD = DB.GetReaderOrdinal(rdr, "CTRY_CD");
                int IDX_CTRY_NM = DB.GetReaderOrdinal(rdr, "CTRY_NM");
                while (rdr.Read())
                {
                    ret.Add(new Countires
                    {
                        CTRY_CD = (IDX_CTRY_CD < 0 || rdr.IsDBNull(IDX_CTRY_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CTRY_CD),
                        CTRY_NM = (IDX_CTRY_NM < 0 || rdr.IsDBNull(IDX_CTRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CTRY_NM)
                    });
                }
            }

            return ret;
        }

        public List<PrimeCustDropdown> GetPrimeCustomers()
        {
            var ret = new List<PrimeCustDropdown>();
            var cmd = new Procs.dbo.PR_MYDL_GET_PRIM_CUST { };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_PRIM_CUST_ID = DB.GetReaderOrdinal(rdr, "PRIM_CUST_ID");
                int IDX_PRIM_CUST_NM = DB.GetReaderOrdinal(rdr, "PRIM_CUST_NM");

                while (rdr.Read())
                {
                    ret.Add(new PrimeCustDropdown
                    {
                        PRIM_CUST_ID = (IDX_PRIM_CUST_ID < 0 || rdr.IsDBNull(IDX_PRIM_CUST_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIM_CUST_ID),
                        PRIM_CUST_NM = (IDX_PRIM_CUST_NM < 0 || rdr.IsDBNull(IDX_PRIM_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIM_CUST_NM)
                    });
                }
            }

            return ret;
        }

    }
}
