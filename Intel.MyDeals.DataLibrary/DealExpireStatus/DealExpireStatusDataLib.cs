using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibraries;
using Intel.Opaque.DBAccess;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class DealExpireStatusDataLib : IDealExpireStatusDataLib
    {
        public List<InActvDeals> GetDealExpireStatus(int contractid)
        {
            var ExpireStatus = new List<InActvDeals>();

            Procs.dbo.PR_MYDL_CHK_INACTV_DEALS cmd = new Procs.dbo.PR_MYDL_CHK_INACTV_DEALS()
            {
                in_obj_sids = contractid
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    // Get the ordinal positions of each column
                    int IDX_PS_OBJ_SID = DB.GetReaderOrdinal(rdr, "PS_OBJ_SID");
                    int IDX_OVERALL_STATUS = DB.GetReaderOrdinal(rdr, "OVERALL_STATUS");

                    // Read the paginated result set
                    while (rdr.Read())
                    {
                        InActvDeals ExpireData = new InActvDeals
                        {
                            PS_OBJ_SID = (IDX_PS_OBJ_SID < 0 || rdr.IsDBNull(IDX_PS_OBJ_SID)) ? null : (int?)rdr.GetFieldValue<System.Int32>(IDX_PS_OBJ_SID),
                            OVERALL_STATUS = rdr.IsDBNull(IDX_OVERALL_STATUS) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVERALL_STATUS)
                        };
                        ExpireStatus.Add(ExpireData);
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new Exception("An error occurred while accessing the database.", ex);
            }

            // Return both the data and the total count
            return ExpireStatus;
        }
    }
}
