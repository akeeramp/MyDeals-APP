using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataAccessLib;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.Opaque.DBAccess;
using Intel.Opaque;

namespace Intel.MyDeals.DataLibrary
{
    public class PushDealstoVistexDataLib  : IPushDealstoVistexDataLib
    {
        public List<PushDealstoVistexResults> DealsPushtoVistex(PushDealIdstoVistex dealIds)
        {
            var result = new List<PushDealstoVistexResults>();
            List<int> Ids = dealIds.DEAL_IDS.Split(',').Select(Int32.Parse).ToList();
            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_PUSH_DEALS_TO_VISTEX
                {

                    in_deal_lst = new type_int_list(Ids.ToArray())

                }))
                {
                    int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
                    int IDX_UPD_MSG = DB.GetReaderOrdinal(rdr, "UPD_MSG");
                    int IDX_ERR_FLAG = DB.GetReaderOrdinal(rdr, "ERR_FLAG");

                    while (rdr.Read())
                    {
                        result.Add(new PushDealstoVistexResults
                        {
                            DEAL_ID = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                            UPD_MSG = (IDX_UPD_MSG < 0 || rdr.IsDBNull(IDX_UPD_MSG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_UPD_MSG),
                            ERR_FLAG = (IDX_ERR_FLAG < 0 || rdr.IsDBNull(IDX_ERR_FLAG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ERR_FLAG)

                        });

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
        
    }
}
