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
    public class VistexCustomerMappingDataLib : IVistexCustomerMappingDataLib
    {
        public List<VistexCustomerMapping> GetVistexCustomerMappings()
        {
            OpLog.Log("GetVistexCustomerMappings");

            var ret = new List<VistexCustomerMapping>();
            var cmd = new Procs.dbo.PR_MYDL_GET_VISTEX_CUST_MAP { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_VISTEX_CUST_FLAG = DB.GetReaderOrdinal(rdr, "VISTEX_CUST_FLAG");

                    while (rdr.Read())
                    {
                        ret.Add(new VistexCustomerMapping
                        {
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            VISTEX_CUST_FLAG = (IDX_VISTEX_CUST_FLAG < 0 || rdr.IsDBNull(IDX_VISTEX_CUST_FLAG)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_VISTEX_CUST_FLAG)
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
