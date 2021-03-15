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
    public class PrimeCustomersDataLib :IPrimeCustomersDataLib
    {
        public List<PrimeCustomers> GetPrimeCustomerDetails()
        {
            var ret = new List<PrimeCustomers>();
            var cmd = new Procs.dbo.PR_MYDL_GET_PRIM_CUST_DATA { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_IS_ACTIVE = DB.GetReaderOrdinal(rdr, "IS_ACTIVE");
                    int IDX_PRIME_CUST_COUNTRY = DB.GetReaderOrdinal(rdr, "PRIME_CUST_COUNTRY");
                    int IDX_PRIME_CUST_NM = DB.GetReaderOrdinal(rdr, "PRIME_CUST_NM");
                    int IDX_PRIME_LVL_NM = DB.GetReaderOrdinal(rdr, "PRIME_LVL_NM");
                    int IDX_PRIME_LVL_SID = DB.GetReaderOrdinal(rdr, "PRIME_LVL_SID");
                    int IDX_PRIME_MBR_SID = DB.GetReaderOrdinal(rdr, "PRIME_MBR_SID");
                    int IDX_RPL_STATUS = DB.GetReaderOrdinal(rdr, "RPL_STATUS");
                    int IDX_PRIME_SID = DB.GetReaderOrdinal(rdr, "PRIME_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new PrimeCustomers
                        {
                            IS_ACTIVE = (IDX_IS_ACTIVE < 0 || rdr.IsDBNull(IDX_IS_ACTIVE)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_ACTIVE),
                            PRIME_CUST_COUNTRY = (IDX_PRIME_CUST_COUNTRY < 0 || rdr.IsDBNull(IDX_PRIME_CUST_COUNTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIME_CUST_COUNTRY),
                            PRIME_CUST_NM = (IDX_PRIME_CUST_NM < 0 || rdr.IsDBNull(IDX_PRIME_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIME_CUST_NM),
                            PRIME_LVL_NM = (IDX_PRIME_LVL_NM < 0 || rdr.IsDBNull(IDX_PRIME_LVL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIME_LVL_NM),
                            PRIME_LVL_SID = (IDX_PRIME_LVL_SID < 0 || rdr.IsDBNull(IDX_PRIME_LVL_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIME_LVL_SID),
                            PRIME_MBR_SID = (IDX_PRIME_MBR_SID < 0 || rdr.IsDBNull(IDX_PRIME_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIME_MBR_SID),
                            PRIME_SID = (IDX_PRIME_SID < 0 || rdr.IsDBNull(IDX_PRIME_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIME_SID),
                            RPL_STATUS = (IDX_RPL_STATUS < 0 || rdr.IsDBNull(IDX_RPL_STATUS)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RPL_STATUS)

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

            using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_PRIM_CUST_DATA
            {

                IN_MODE = mode.ToString().ToUpper(),
                IN_PRIME_CUST_COUNTRY = data.PRIME_CUST_COUNTRY,
                IN_PRIME_CUST_NM = data.PRIME_CUST_NM,
                IN_PRIME_MBR_SID = data.PRIME_MBR_SID,
                IN_RPL_STATUS = data.RPL_STATUS,
                IN_IS_ACTIVE = data.IS_ACTIVE,
                IN_PRIME_LVL_SID = data.PRIME_LVL_SID,
                IN_PRIME_LVL_NM = data.PRIME_CUST_NM,
                IN_CRE_EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                IN_CHG_EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                IN_PRIME_SID = data.PRIME_SID


            }))
            {
                int IDX_IS_ACTIVE = DB.GetReaderOrdinal(rdr, "IS_ACTIVE");
                int IDX_PRIME_CUST_COUNTRY = DB.GetReaderOrdinal(rdr, "PRIME_CUST_COUNTRY");
                int IDX_PRIME_CUST_NM = DB.GetReaderOrdinal(rdr, "PRIME_CUST_NM");
                int IDX_PRIME_LVL_NM = DB.GetReaderOrdinal(rdr, "PRIME_LVL_NM");
                int IDX_PRIME_LVL_SID = DB.GetReaderOrdinal(rdr, "PRIME_LVL_SID");
                int IDX_PRIME_MBR_SID = DB.GetReaderOrdinal(rdr, "PRIME_MBR_SID");
                int IDX_RPL_STATUS = DB.GetReaderOrdinal(rdr, "RPL_STATUS");
                int IDX_PRIME_SID = DB.GetReaderOrdinal(rdr, "PRIME_SID");

                while (rdr.Read())
                {
                    retPrimeCustomers.Add(new PrimeCustomers
                    {
                        IS_ACTIVE = (IDX_IS_ACTIVE < 0 || rdr.IsDBNull(IDX_IS_ACTIVE)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_ACTIVE),
                        PRIME_CUST_COUNTRY = (IDX_PRIME_CUST_COUNTRY < 0 || rdr.IsDBNull(IDX_PRIME_CUST_COUNTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIME_CUST_COUNTRY),
                        PRIME_CUST_NM = (IDX_PRIME_CUST_NM < 0 || rdr.IsDBNull(IDX_PRIME_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIME_CUST_NM),
                        PRIME_LVL_NM = (IDX_PRIME_LVL_NM < 0 || rdr.IsDBNull(IDX_PRIME_LVL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIME_LVL_NM),
                        PRIME_LVL_SID = (IDX_PRIME_LVL_SID < 0 || rdr.IsDBNull(IDX_PRIME_LVL_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIME_LVL_SID),
                        PRIME_MBR_SID = (IDX_PRIME_MBR_SID < 0 || rdr.IsDBNull(IDX_PRIME_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIME_MBR_SID),
                        PRIME_SID = (IDX_PRIME_SID < 0 || rdr.IsDBNull(IDX_PRIME_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIME_SID),
                        RPL_STATUS = (IDX_RPL_STATUS < 0 || rdr.IsDBNull(IDX_RPL_STATUS)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RPL_STATUS)

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
                int IDX_PRIME_CUST_COUNTRY = DB.GetReaderOrdinal(rdr, "PRIME_CUST_COUNTRY");
                int IDX_PRIME_CUST_NM = DB.GetReaderOrdinal(rdr, "PRIME_CUST_NM");
                int IDX_PRIME_MBR_SID = DB.GetReaderOrdinal(rdr, "PRIME_MBR_SID");

                while (rdr.Read())
                {
                    ret.Add(new PrimeCustDropdown
                    {
                        PRIME_CUST_COUNTRY = (IDX_PRIME_CUST_COUNTRY < 0 || rdr.IsDBNull(IDX_PRIME_CUST_COUNTRY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIME_CUST_COUNTRY),
                        PRIME_CUST_NM = (IDX_PRIME_CUST_NM < 0 || rdr.IsDBNull(IDX_PRIME_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRIME_CUST_NM),
                        PRIME_MBR_SID = (IDX_PRIME_MBR_SID < 0 || rdr.IsDBNull(IDX_PRIME_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRIME_MBR_SID)
                    });
                }
            }

            return ret;
        }

    }
}
