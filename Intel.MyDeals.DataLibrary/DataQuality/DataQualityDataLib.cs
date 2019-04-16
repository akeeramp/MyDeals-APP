using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class DataQualityDataLib : IDataQualityDataLib
    {
        public DataQualityDataLib()
        {
        }

        /// <summary>
        /// Get Data Q
        /// </summary>
        /// <returns></returns>
        public IList<DataQualityUsecase> GetDataQualityUseCases()
        {
            var ret = new List<DataQualityUsecase>();
            Procs.dbo.PR_MYDL_GET_DQ_META_DATA cmd = new Procs.dbo.PR_MYDL_GET_DQ_META_DATA();

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_DQ_ENBL_IND = DB.GetReaderOrdinal(rdr, "DQ_ENBL_IND");
                    int IDX_DQ_SEND_MAX_NUM_ISS_ROWS = DB.GetReaderOrdinal(rdr, "DQ_SEND_MAX_NUM_ISS_ROWS");
                    int IDX_DQ_USE_CASE_CD = DB.GetReaderOrdinal(rdr, "DQ_USE_CASE_CD");
                    int IDX_DQ_USE_CASE_DSC = DB.GetReaderOrdinal(rdr, "DQ_USE_CASE_DSC");
                    int IDX_DQ_USE_CASE_HELP_TXT = DB.GetReaderOrdinal(rdr, "DQ_USE_CASE_HELP_TXT");
                    int IDX_DQ_USE_CASE_NM = DB.GetReaderOrdinal(rdr, "DQ_USE_CASE_NM");
                    int IDX_LOG_RETEN_NUM_DAY = DB.GetReaderOrdinal(rdr, "LOG_RETEN_NUM_DAY");
                    int IDX_SUBJ_AREA_CD = DB.GetReaderOrdinal(rdr, "SUBJ_AREA_CD");

                    while (rdr.Read())
                    {
                        ret.Add(new DataQualityUsecase
                        {
                            DQ_ENBL_IND = (IDX_DQ_ENBL_IND < 0 || rdr.IsDBNull(IDX_DQ_ENBL_IND)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DQ_ENBL_IND),
                            DQ_SEND_MAX_NUM_ISS_ROWS = (IDX_DQ_SEND_MAX_NUM_ISS_ROWS < 0 || rdr.IsDBNull(IDX_DQ_SEND_MAX_NUM_ISS_ROWS)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DQ_SEND_MAX_NUM_ISS_ROWS),
                            DQ_USE_CASE_CD = (IDX_DQ_USE_CASE_CD < 0 || rdr.IsDBNull(IDX_DQ_USE_CASE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DQ_USE_CASE_CD),
                            DQ_USE_CASE_DSC = (IDX_DQ_USE_CASE_DSC < 0 || rdr.IsDBNull(IDX_DQ_USE_CASE_DSC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DQ_USE_CASE_DSC),
                            DQ_USE_CASE_HELP_TXT = (IDX_DQ_USE_CASE_HELP_TXT < 0 || rdr.IsDBNull(IDX_DQ_USE_CASE_HELP_TXT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DQ_USE_CASE_HELP_TXT),
                            DQ_USE_CASE_NM = (IDX_DQ_USE_CASE_NM < 0 || rdr.IsDBNull(IDX_DQ_USE_CASE_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DQ_USE_CASE_NM),
                            LOG_RETEN_NUM_DAY = (IDX_LOG_RETEN_NUM_DAY < 0 || rdr.IsDBNull(IDX_LOG_RETEN_NUM_DAY)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_LOG_RETEN_NUM_DAY),
                            SUBJ_AREA_CD = (IDX_SUBJ_AREA_CD < 0 || rdr.IsDBNull(IDX_SUBJ_AREA_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SUBJ_AREA_CD)
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
        /// Run DQ
        /// </summary>
        /// <param name="useCase"></param>
        /// <returns></returns>
        public bool RunDQ(string useCase)
        {
            Procs.dbo.PR_DQMF_INS_USE_CASE_MDATA cmd = new Procs.dbo.PR_DQMF_INS_USE_CASE_MDATA
            {
                op_in_i_dq_use_case_cd = useCase,
                dq_perd = null,
                customsummaryemailmessage = null
            };

            try
            {
                using (var rdr = DataAccess.ExecuteDataSet(cmd))
                {

                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return true;
        }
    }
}
