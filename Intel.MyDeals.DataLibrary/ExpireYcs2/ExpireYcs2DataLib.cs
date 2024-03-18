using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibraries;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class ExpireYcs2DataLib : IExpireYcs2DataLib
    {
        public ExpireYcs2DataLib()
        {
        }
     
        public List<DownloadExpireYcs2Data> ExpireYcs2(string dealId)
        {
            var ret = new List<DownloadExpireYcs2Data>();            
            var cmd = new Procs.dbo.PR_MYDL_DEAL_EXPIRE_YCS2
            {
                in_deal_id_list = dealId,
                in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID
            };            
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_Status = DB.GetReaderOrdinal(rdr, "STATUS");
                    while (rdr.Read())
                    {
                        ret.Add(new DownloadExpireYcs2Data
                        {
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(Int32) : rdr.GetFieldValue<Int32>(IDX_OBJ_SID),
                            STATUS = (IDX_Status < 0 || rdr.IsDBNull(IDX_Status)) ? String.Empty : rdr.GetFieldValue<string>(IDX_Status)
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