using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;

namespace Intel.MyDeals.DataLibrary
{
    public class DashboardDataLib : IDashboardDataLib
    {
        /// <summary>
        /// Get Dashboard Contract Summary
        /// </summary>
        /// <returns></returns>
        public List<DashboardContractSummary> GetDashboardContractSummary(List<int> custIds, DateTime startDate, DateTime endDate)
        {
            OpLog.Log("GetDashboardContractSummary");

            var ret = new List<DashboardContractSummary>();

            var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_GET_CNSNT_SUMMARY
            {
                CUST_SIDS = new type_int_list(custIds.ToArray()),
                STRT_DTM = startDate,
                END_DTM = endDate
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
                    int IDX_NOTES = DB.GetReaderOrdinal(rdr, "NOTES");
                    int IDX_STRT_DTM = DB.GetReaderOrdinal(rdr, "STRT_DTM");
                    int IDX_TITLE = DB.GetReaderOrdinal(rdr, "TITLE");
                    int IDX_WF_STG_CD = DB.GetReaderOrdinal(rdr, "WF_STG_CD");

                    while (rdr.Read())
                    {
                        ret.Add(new DashboardContractSummary
                        {
                            CHG_EMP_NM = (IDX_CHG_EMP_NM < 0 || rdr.IsDBNull(IDX_CHG_EMP_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHG_EMP_NM),
                            CNTRCT_OBJ_SID = (IDX_CNTRCT_OBJ_SID < 0 || rdr.IsDBNull(IDX_CNTRCT_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CNTRCT_OBJ_SID),
                            CRE_EMP_NM = (IDX_CRE_EMP_NM < 0 || rdr.IsDBNull(IDX_CRE_EMP_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CRE_EMP_NM),
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            END_DTM = (IDX_END_DTM < 0 || rdr.IsDBNull(IDX_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_END_DTM),
                            HAS_ALERT = (IDX_HAS_ALERT < 0 || rdr.IsDBNull(IDX_HAS_ALERT)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_HAS_ALERT),
                            NOTES = (IDX_NOTES < 0 || rdr.IsDBNull(IDX_NOTES)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTES),
                            STRT_DTM = (IDX_STRT_DTM < 0 || rdr.IsDBNull(IDX_STRT_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_STRT_DTM),
                            TITLE = (IDX_TITLE < 0 || rdr.IsDBNull(IDX_TITLE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_TITLE),
                            WF_STG_CD = (IDX_WF_STG_CD < 0 || rdr.IsDBNull(IDX_WF_STG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WF_STG_CD)
                        });
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
    }
}