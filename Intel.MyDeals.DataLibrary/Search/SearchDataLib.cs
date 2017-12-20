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


        /// <summary>
		/// Get Search Results based on provided search text and customer ids
		/// </summary>
		/// <returns>list of SearchResults data</returns>
        public List<AdvancedSearchResults> GetAdvancedSearchResults(string searchText, List<int> custIds)
        {
            var ret = new List<AdvancedSearchResults>();
            //////Phil requested this section be commented out for now alongside his changes
            //Procs.dbo.PR_MYDL_ADV_SRCH_OBJ cmd = new Procs.dbo.PR_MYDL_ADV_SRCH_OBJ()
            //{
            //    in_srch_txt = searchText
            //    //in_cust_list = new type_int_list(custIds.ToArray()) TBD - VN
            //};

            //try
            //{
            //    using (var rdr = DataAccess.ExecuteReader(cmd))
            //    {
            //        int IDX_ROW_ID = DB.GetReaderOrdinal(rdr, "Row_ID");
            //        int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
            //        int IDX_DIVISION = DB.GetReaderOrdinal(rdr, "DIVISION");
            //        int IDX_CONTRACT = DB.GetReaderOrdinal(rdr, "CONTRACT");
            //        int IDX_CONTRACT_NAME = DB.GetReaderOrdinal(rdr, "CONTRACT_NAME");
            //        int IDX_PRICING_STRATEGY = DB.GetReaderOrdinal(rdr, "PRICING_STRATEGY");
            //        int IDX_PRICING_STRATEGY_NAME = DB.GetReaderOrdinal(rdr, "PRICING_STRATEGY_NAME");
            //        int IDX_PRICING_TABLE = DB.GetReaderOrdinal(rdr, "PRICING_TABLE");
            //        int IDX_PRICING_TABLE_NAME = DB.GetReaderOrdinal(rdr, "PRICING_TABLE_NAME");
            //        int IDX_PRICING_TABLE_ROW = DB.GetReaderOrdinal(rdr, "PRICING_TABLE_ROW");
            //        int IDX_WIP_DEAL = DB.GetReaderOrdinal(rdr, "WIP_DEAL");
            //        int IDX_TRKR_NBR = DB.GetReaderOrdinal(rdr, "TRKR_NBR");
            //        int IDX_WIP_PRODUCT = DB.GetReaderOrdinal(rdr, "PRODUCT");
            //        int IDX_START_DT = DB.GetReaderOrdinal(rdr, "START_DT");
            //        int IDX_END_DT = DB.GetReaderOrdinal(rdr, "END_DT");

            //        while (rdr.Read())
            //        {
            //            ret.Add(new AdvancedSearchResults
            //            {
            //                Row_ID = (IDX_ROW_ID < 0 || rdr.IsDBNull(IDX_ROW_ID)) ? default(System.Int64) : rdr.GetFieldValue<System.Int64>(IDX_ROW_ID),
            //                CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
            //                DIVISION = (IDX_DIVISION < 0 || rdr.IsDBNull(IDX_DIVISION)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIVISION),
            //                CONTRACT = (IDX_CONTRACT < 0 || rdr.IsDBNull(IDX_CONTRACT)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CONTRACT),
            //                CONTRACT_NAME = (IDX_CONTRACT_NAME < 0 || rdr.IsDBNull(IDX_CONTRACT_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CONTRACT_NAME),
            //                PRICING_STRATEGY = (IDX_PRICING_STRATEGY < 0 || rdr.IsDBNull(IDX_PRICING_STRATEGY)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRICING_STRATEGY),
            //                PRICING_STRATEGY_NAME = (IDX_PRICING_STRATEGY_NAME < 0 || rdr.IsDBNull(IDX_PRICING_STRATEGY_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRICING_STRATEGY_NAME),
            //                PRICING_TABLE = (IDX_PRICING_TABLE < 0 || rdr.IsDBNull(IDX_PRICING_TABLE)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRICING_TABLE),
            //                PRICING_TABLE_NAME = (IDX_PRICING_TABLE_NAME < 0 || rdr.IsDBNull(IDX_PRICING_TABLE_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRICING_TABLE_NAME),
            //                PRICING_TABLE_ROW = (IDX_PRICING_TABLE_ROW < 0 || rdr.IsDBNull(IDX_PRICING_TABLE_ROW)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRICING_TABLE_ROW),
            //                WIP_DEAL = (IDX_WIP_DEAL < 0 || rdr.IsDBNull(IDX_WIP_DEAL)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WIP_DEAL),
            //                TRKR_NBR = (IDX_TRKR_NBR < 0 || rdr.IsDBNull(IDX_TRKR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_TRKR_NBR),
            //                PRODUCT = (IDX_WIP_PRODUCT < 0 || rdr.IsDBNull(IDX_WIP_PRODUCT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WIP_PRODUCT),
            //                START_DT = (IDX_START_DT < 0 || rdr.IsDBNull(IDX_START_DT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_START_DT),
            //                END_DT = (rdr.IsDBNull(IDX_END_DT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_DT)
            //            });
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    OpLogPerf.Log(ex);
            //    throw;
            //}
            return ret;
        }
    }
}