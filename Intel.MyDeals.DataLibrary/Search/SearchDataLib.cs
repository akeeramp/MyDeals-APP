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

namespace Intel.MyDeals.DataLibrary
{
    public class SearchDataLib : ISearchDataLib
    {
        public SearchDataLib()
        {
        }


        /// <summary>
		/// Get Search Results based on provided search text and customer ids
		/// </summary>
		/// <returns>list of SearchResults data</returns>
        public List<SearchResults> GetSearchResults(string searchText, List<int> custIds)
        {
            var ret = new List<SearchResults>();
            Procs.dbo.PR_MYDL_SRCH_OBJ cmd = new Procs.dbo.PR_MYDL_SRCH_OBJ()
            {
                in_srch_txt = searchText,
                in_cust_list = new type_int_list(custIds.ToArray())
            };
            
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_CUSTOMER = DB.GetReaderOrdinal(rdr, "CUSTOMER");
                    int IDX_OBJ_HIER = DB.GetReaderOrdinal(rdr, "OBJ_HIER");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_OBJ_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_TYPE");
                    int IDX_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID");
                    int IDX_TITLE = DB.GetReaderOrdinal(rdr, "TITLE");

                    while (rdr.Read())
                    {
                        ret.Add(new SearchResults
                        {
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            CUSTOMER = (IDX_CUSTOMER < 0 || rdr.IsDBNull(IDX_CUSTOMER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUSTOMER),
                            OBJ_HIER = (IDX_OBJ_HIER < 0 || rdr.IsDBNull(IDX_OBJ_HIER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_HIER),
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
                            OBJ_TYPE = (IDX_OBJ_TYPE < 0 || rdr.IsDBNull(IDX_OBJ_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_TYPE),
                            OBJ_TYPE_SID = (IDX_OBJ_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID),
                            TITLE = (IDX_TITLE < 0 || rdr.IsDBNull(IDX_TITLE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_TITLE)
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