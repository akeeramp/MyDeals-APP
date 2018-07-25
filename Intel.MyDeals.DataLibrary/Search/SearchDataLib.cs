using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

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
        public SearchPacket GetAdvancedSearchResults(string searchCondition, string orderBy, string searchObjTypes, int skip, int take)
        {
            var ret = new List<AdvancedSearchResults>();
            var cnt = 0;
            Procs.dbo.PR_MYDL_ADV_SRCH_OBJ cmd = new Procs.dbo.PR_MYDL_ADV_SRCH_OBJ()
            {
                in_fltr_cond = searchCondition,
                in_sort_by = orderBy,
                in_rtrn_obj_types = searchObjTypes
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CNTRCT_C2A_DATA_C2A_ID = DB.GetReaderOrdinal(rdr, "CNTRCT_C2A_DATA_C2A_ID");
                    int IDX_CNTRCT_OBJ_SID = DB.GetReaderOrdinal(rdr, "CNTRCT_OBJ_SID");
                    int IDX_CNTRCT_TITLE = DB.GetReaderOrdinal(rdr, "CNTRCT_TITLE");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_OBJ_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_TYPE");
                    int IDX_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID");
                    int IDX_PRC_ST_OBJ_SID = DB.GetReaderOrdinal(rdr, "PRC_ST_OBJ_SID");
                    int IDX_PRC_ST_TITLE = DB.GetReaderOrdinal(rdr, "PRC_ST_TITLE");
                    int IDX_SORT_ORD = DB.GetReaderOrdinal(rdr, "SORT_ORD");
                    int IDX_WIP_DEAL_CHG_DTM = DB.GetReaderOrdinal(rdr, "WIP_DEAL_CHG_DTM");
                    int IDX_WIP_DEAL_CHG_EMP_NAME = DB.GetReaderOrdinal(rdr, "WIP_DEAL_CHG_EMP_NAME");
                    int IDX_WIP_DEAL_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "WIP_DEAL_CHG_EMP_WWID");
                    int IDX_WIP_DEAL_CRE_DTM = DB.GetReaderOrdinal(rdr, "WIP_DEAL_CRE_DTM");
                    int IDX_WIP_DEAL_CRE_EMP_NAME = DB.GetReaderOrdinal(rdr, "WIP_DEAL_CRE_EMP_NAME");
                    int IDX_WIP_DEAL_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "WIP_DEAL_CRE_EMP_WWID");
                    int IDX_WIP_DEAL_DIV_APPROVED_BY = DB.GetReaderOrdinal(rdr, "WIP_DEAL_DIV_APPROVED_BY");
                    int IDX_WIP_DEAL_GEO_APPROVED_BY = DB.GetReaderOrdinal(rdr, "WIP_DEAL_GEO_APPROVED_BY");

                    while (rdr.Read())
                    {
                        if (cnt >= skip && cnt <= skip + take)
                        {
                            ret.Add(new AdvancedSearchResults
                            {
                                CNTRCT_C2A_DATA_C2A_ID = (IDX_CNTRCT_C2A_DATA_C2A_ID < 0 || rdr.IsDBNull(IDX_CNTRCT_C2A_DATA_C2A_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNTRCT_C2A_DATA_C2A_ID),
                                CNTRCT_OBJ_SID = (IDX_CNTRCT_OBJ_SID < 0 || rdr.IsDBNull(IDX_CNTRCT_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CNTRCT_OBJ_SID),
                                CNTRCT_TITLE = (IDX_CNTRCT_TITLE < 0 || rdr.IsDBNull(IDX_CNTRCT_TITLE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNTRCT_TITLE),
                                OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
                                OBJ_TYPE = (IDX_OBJ_TYPE < 0 || rdr.IsDBNull(IDX_OBJ_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_TYPE),
                                OBJ_TYPE_SID = (IDX_OBJ_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID),
                                PRC_ST_OBJ_SID = (IDX_PRC_ST_OBJ_SID < 0 || rdr.IsDBNull(IDX_PRC_ST_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRC_ST_OBJ_SID),
                                PRC_ST_TITLE = (IDX_PRC_ST_TITLE < 0 || rdr.IsDBNull(IDX_PRC_ST_TITLE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRC_ST_TITLE),
                                SORT_ORD = (IDX_SORT_ORD < 0 || rdr.IsDBNull(IDX_SORT_ORD)) ? default(System.Int64) : rdr.GetFieldValue<System.Int64>(IDX_SORT_ORD),
                                WIP_DEAL_CHG_DTM = (IDX_WIP_DEAL_CHG_DTM < 0 || rdr.IsDBNull(IDX_WIP_DEAL_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_WIP_DEAL_CHG_DTM),
                                WIP_DEAL_CHG_EMP_NAME = (IDX_WIP_DEAL_CHG_EMP_NAME < 0 || rdr.IsDBNull(IDX_WIP_DEAL_CHG_EMP_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WIP_DEAL_CHG_EMP_NAME),
                                WIP_DEAL_CHG_EMP_WWID = (IDX_WIP_DEAL_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_WIP_DEAL_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WIP_DEAL_CHG_EMP_WWID),
                                WIP_DEAL_CRE_DTM = (IDX_WIP_DEAL_CRE_DTM < 0 || rdr.IsDBNull(IDX_WIP_DEAL_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_WIP_DEAL_CRE_DTM),
                                WIP_DEAL_CRE_EMP_NAME = (IDX_WIP_DEAL_CRE_EMP_NAME < 0 || rdr.IsDBNull(IDX_WIP_DEAL_CRE_EMP_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WIP_DEAL_CRE_EMP_NAME),
                                WIP_DEAL_CRE_EMP_WWID = (IDX_WIP_DEAL_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_WIP_DEAL_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WIP_DEAL_CRE_EMP_WWID),
                                WIP_DEAL_DIV_APPROVED_BY = (IDX_WIP_DEAL_DIV_APPROVED_BY < 0 || rdr.IsDBNull(IDX_WIP_DEAL_DIV_APPROVED_BY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WIP_DEAL_DIV_APPROVED_BY),
                                WIP_DEAL_GEO_APPROVED_BY = (IDX_WIP_DEAL_GEO_APPROVED_BY < 0 || rdr.IsDBNull(IDX_WIP_DEAL_GEO_APPROVED_BY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WIP_DEAL_GEO_APPROVED_BY)
                            });
                        }
                        cnt++;
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            var packet = new SearchPacket
            {
                SearchCount = cnt,
                SearchResults = ret
            };

            return packet;
        }
    }
}