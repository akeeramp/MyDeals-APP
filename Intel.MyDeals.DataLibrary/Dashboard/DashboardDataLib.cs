using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;

namespace Intel.MyDeals.DataLibrary
{
    public class DashboardDataLib : IDashboardDataLib
    {
        /// <summary>
        /// Get Dashboard Contract Summary
        /// </summary>
        /// <returns></returns>
        public List<DashboardContractSummary> GetDashboardContractSummary(List<int> custIds, DateTime startDate, DateTime endDate, string filter, string grpFltr, string sort, int take, int skip, List<int> vertIds = null)
        {
            OpLog.Log("GetDashboardContractSummary");

            var ret = new List<DashboardContractSummary>();

            string verticalsList = string.Join(",", vertIds); // If list is empty (WW), then string will be empty as well and SP views empty to be WW.
            if (string.IsNullOrEmpty(verticalsList)) verticalsList = null;

            var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_GET_CNSNT_SUMMARY
            {
                CUST_SIDS = new type_int_list(custIds.ToArray()),
                STRT_DTM = startDate,
                END_DTM = endDate,
                FILTER = filter,
                GRPFLTR = grpFltr,
                SORT = sort,
                TAKE = take,
                SKIP = skip,
                VRTCL_LST = verticalsList,
                MODE = "SELECT"
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CHG_EMP_NM = DB.GetReaderOrdinal(rdr, "CHG_EMP_NM");
                    int IDX_CNTRCT_OBJ_SID = DB.GetReaderOrdinal(rdr, "CNTRCT_OBJ_SID");
                    int IDX_CRE_EMP_NM = DB.GetReaderOrdinal(rdr, "CRE_EMP_NM");
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_END_DTM = DB.GetReaderOrdinal(rdr, "END_DTM");
                    int IDX_HAS_ALERT = DB.GetReaderOrdinal(rdr, "HAS_ALERT");
                    int IDX_IS_TENDER = DB.GetReaderOrdinal(rdr, "IS_TENDER");
                    int IDX_NOTES = DB.GetReaderOrdinal(rdr, "NOTES");
                    int IDX_STRT_DTM = DB.GetReaderOrdinal(rdr, "STRT_DTM");
                    int IDX_TITLE = DB.GetReaderOrdinal(rdr, "TITLE");
                    int IDX_WF_STG_CD = DB.GetReaderOrdinal(rdr, "WF_STG_CD");

                    while (rdr.Read())
                    {
                        var summary = new DashboardContractSummary
                        {
                            CHG_EMP_NM = (IDX_CHG_EMP_NM < 0 || rdr.IsDBNull(IDX_CHG_EMP_NM)) ? String.Empty : rdr.GetString(IDX_CHG_EMP_NM),
                            CNTRCT_OBJ_SID = (IDX_CNTRCT_OBJ_SID < 0 || rdr.IsDBNull(IDX_CNTRCT_OBJ_SID)) ? default : rdr.GetInt32(IDX_CNTRCT_OBJ_SID),
                            CRE_EMP_NM = (IDX_CRE_EMP_NM < 0 || rdr.IsDBNull(IDX_CRE_EMP_NM)) ? String.Empty : rdr.GetString(IDX_CRE_EMP_NM),
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default : rdr.GetInt32(IDX_CUST_MBR_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetString(IDX_CUST_NM),
                            END_DTM = (IDX_END_DTM < 0 || rdr.IsDBNull(IDX_END_DTM)) ? default : rdr.GetDateTime(IDX_END_DTM),
                            HAS_ALERT = IDX_HAS_ALERT >= 0 && !rdr.IsDBNull(IDX_HAS_ALERT) && rdr.GetBoolean(IDX_HAS_ALERT),
                            IS_TENDER = (IDX_IS_TENDER < 0 || rdr.IsDBNull(IDX_IS_TENDER)) ? default : rdr.GetInt32(IDX_IS_TENDER),
                            NOTES = (IDX_NOTES < 0 || rdr.IsDBNull(IDX_NOTES)) ? String.Empty : rdr.GetString(IDX_NOTES),
                            STRT_DTM = (IDX_STRT_DTM < 0 || rdr.IsDBNull(IDX_STRT_DTM)) ? default : rdr.GetDateTime(IDX_STRT_DTM),
                            TITLE = (IDX_TITLE < 0 || rdr.IsDBNull(IDX_TITLE)) ? String.Empty : rdr.GetString(IDX_TITLE),
                            WF_STG_CD = (IDX_WF_STG_CD < 0 || rdr.IsDBNull(IDX_WF_STG_CD)) ? "InComplete" : rdr.GetString(IDX_WF_STG_CD)
                        };
                        ret.Add(summary);
                    } // while


                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return ret;
        }


        public List<DashboardContractSummaryCount> GetDashboardContractSummaryCount(List<int> custIds, DateTime startDate, DateTime endDate, string filter, string grpFltr, string sort, int take, int skip, List<int> vertIds = null)
        {
            OpLog.Log("GetDashboardContractSummary");

            var inCnt = new List<DashboardSummaryCount>();
            var cnt = new List<DashboardContractSummaryCount>();

            string verticalsList = string.Join(",", vertIds); // If list is empty (WW), then string will be empty as well and SP views empty to be WW.
            if (string.IsNullOrEmpty(verticalsList)) verticalsList = null;

            var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_GET_CNSNT_SUMMARY
            {
                CUST_SIDS = new type_int_list(custIds.ToArray()),
                STRT_DTM = startDate,
                END_DTM = endDate,
                FILTER = filter,
                GRPFLTR = grpFltr,
                SORT = sort,
                TAKE = take,
                SKIP = skip,
                VRTCL_LST = verticalsList,
                MODE = "COUNT"
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {

                    int IDX_COUNT = DB.GetReaderOrdinal(rdr, "COUNT");
                    int IDX_WF_STG_CD1 = DB.GetReaderOrdinal(rdr, "WF_STG_CD");
                    int IDX_IS_TENDER1 = DB.GetReaderOrdinal(rdr, "IS_TENDER");
                    int IDX_HAS_ALERT1 = DB.GetReaderOrdinal(rdr, "HAS_ALERT");
                    while (rdr.Read())
                    {
                        var data = new DashboardSummaryCount
                        {
                            COUNT = (IDX_COUNT < 0 || rdr.IsDBNull(IDX_COUNT)) ? default : rdr.GetInt32(IDX_COUNT),
                            WF_STG_CD = (IDX_WF_STG_CD1 < 0 || rdr.IsDBNull(IDX_WF_STG_CD1)) ? String.Empty : rdr.GetString(IDX_WF_STG_CD1),
                            IS_TENDER = (IDX_IS_TENDER1 < 0 || rdr.IsDBNull(IDX_IS_TENDER1)) ? default : rdr.GetInt32(IDX_IS_TENDER1),
                            HAS_ALERT = (IDX_HAS_ALERT1 < 0 || rdr.IsDBNull(IDX_HAS_ALERT1)) ? default : rdr.GetBoolean(IDX_HAS_ALERT1)
                        };
                        inCnt.Add(data);
                    }
                    int totContractComplete = inCnt.Where(item => item.WF_STG_CD == "Complete" && item.IS_TENDER == 0).Sum(item => item.COUNT);
                    int totContractInComplete = inCnt.Where(item => item.WF_STG_CD == "InComplete" && item.IS_TENDER == 0).Sum(item => item.COUNT);
                    int totTenderComplete = inCnt.Where(item => item.WF_STG_CD == "Complete" && item.IS_TENDER == 1).Sum(item => item.COUNT);
                    int totTenderInComplete = inCnt.Where(item => item.WF_STG_CD == "InComplete" && item.IS_TENDER == 1).Sum(item => item.COUNT);
                    int totTenderCancelled = inCnt.Where(item => item.WF_STG_CD == "Cancelled" && item.IS_TENDER == 1).Sum(item => item.COUNT);
                    int totAlert = inCnt.Where(item=> item.WF_STG_CD == "InComplete" && item.IS_TENDER == 1 && item.HAS_ALERT == true).Sum(item => item.COUNT);

                    var summaryCount = new DashboardContractSummaryCount
                    {
                        TOT_TABLE_COUNT = totContractComplete + totContractInComplete + totTenderComplete + totTenderInComplete + totTenderCancelled,
                        TOT_TENDER_COUNT = totTenderComplete + totTenderInComplete + totTenderCancelled,
                        TOT_CONTRACT_COUNT = totContractComplete + totContractInComplete,
                        TOT_COMPLETE_CONTRACT_COUNT = totContractComplete,
                        TOT_COMPLETE_TENDER_COUNT = totTenderComplete,
                        TOT_CANCELLED_TENDER_COUNT = totTenderCancelled,
                        TOT_ALERT_COUNT = totAlert
                    };
                    cnt.Add(summaryCount);

                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }


            return cnt;
        }


        public List<string> GetDashboardContractSummaryFltr(List<int> custIds, DateTime startDate, DateTime endDate, string filter, string grpFltr, string sort, int take, int skip, List<int> vertIds = null)
        {
            OpLog.Log("GetDashboardContractSummary");

            var custfltr = new List<string>();

            string verticalsList = string.Join(",", vertIds); // If list is empty (WW), then string will be empty as well and SP views empty to be WW.
            if (string.IsNullOrEmpty(verticalsList)) verticalsList = null;

            var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_GET_CNSNT_SUMMARY
            {
                CUST_SIDS = new type_int_list(custIds.ToArray()),
                STRT_DTM = startDate,
                END_DTM = endDate,
                FILTER = filter,
                GRPFLTR = grpFltr,
                SORT = sort,
                TAKE = take,
                SKIP = skip,
                VRTCL_LST = verticalsList,
                MODE = "FILTER"
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CUST_NM_FLR = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    while (rdr.Read())
                    {
                        custfltr.Add((IDX_CUST_NM_FLR < 0 || rdr.IsDBNull(IDX_CUST_NM_FLR)) ? String.Empty : rdr.GetString(IDX_CUST_NM_FLR));
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return custfltr;
        }
    }
}