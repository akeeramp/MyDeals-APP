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
        /// <summary>
        /// Get All Vistex Customer Mappings 
        /// </summary>
        /// <returns>List of Vistex Customer Mappings Data </returns>
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

        /// <summary>
        /// Save Is vistex customer flag Changes 
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public List<VistexCustomerMapping> SetVistexCustomerMapping(CrudModes mode,VistexCustomerMapping data)
        {
            var retVstxCustMappings = new List<VistexCustomerMapping>();

            try
            {
                using(var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_VISTEX_CUST_MAP
                {
                    in_cust_mbr_sid  =data.CUST_MBR_SID,
                    in_vistex_cust_flag = data.VISTEX_CUST_FLAG,
                    in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID
                }))
                {
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_VISTEX_CUST_FLAG = DB.GetReaderOrdinal(rdr, "VISTEX_CUST_FLAG");

                    while (rdr.Read())
                    {
                        retVstxCustMappings.Add(new VistexCustomerMapping
                        {
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            VISTEX_CUST_FLAG = (IDX_VISTEX_CUST_FLAG < 0 || rdr.IsDBNull(IDX_VISTEX_CUST_FLAG)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_VISTEX_CUST_FLAG)
                        });
                    }

                    DataCollections.RecycleCache("_getVistexCustomerMappings");
                }
            }
            catch(Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return retVstxCustMappings;
        }
    }  
}
