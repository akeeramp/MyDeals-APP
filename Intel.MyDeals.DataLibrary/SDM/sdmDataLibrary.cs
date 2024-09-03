using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibraries;
using Intel.Opaque.DBAccess;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;
using Apache.NMS.ActiveMQ.Commands;
using OfficeOpenXml.FormulaParsing.Excel.Functions.RefAndLookup;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;

namespace Intel.MyDeals.DataLibrary
{
    public class sdmDataLibrary: IsdmDataLibrary
    {

        public SDMStageDataResult GetSDMStageData(int take, int skip, string whereStg, string orderBy, bool pageChange)
        {
            whereStg = whereStg == "all" ? "" : whereStg;
            var lSDMData = new List<SDMSummary>();
            int totalCount = 0;

            Procs.dbo.PR_MYDL_GET_SDM_RTL_PULL_DLR_DTL cmd = new Procs.dbo.PR_MYDL_GET_SDM_RTL_PULL_DLR_DTL()
            {
                WhereClause = whereStg,
                OrderBy = orderBy,
                Skip = skip,
                Take = take,
                LoadCount = pageChange
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    // Get the ordinal positions of each column
                    int IDX_CYCLE_NM = DB.GetReaderOrdinal(rdr, "CYCLE_NM");
                    int IDX_CURR_STRT_DT = DB.GetReaderOrdinal(rdr, "CURR_STRT_DT");
                    int IDX_CURR_END_DT = DB.GetReaderOrdinal(rdr, "CURR_END_DT");
                    int IDX_CPU_VRT_NM = DB.GetReaderOrdinal(rdr, "CPU_VRT_NM");
                    int IDX_CPU_SKU_NM = DB.GetReaderOrdinal(rdr, "CPU_SKU_NM");
                    int IDX_CPU_PROCESSOR_NUMBER = DB.GetReaderOrdinal(rdr, "CPU_PROCESSOR_NUMBER");
                    int IDX_CPU_FLR = DB.GetReaderOrdinal(rdr, "CPU_FLR");
                    int IDX_APAC_PD = DB.GetReaderOrdinal(rdr, "APAC_PD");
                    int IDX_IJKK_PD = DB.GetReaderOrdinal(rdr, "IJKK_PD");
                    int IDX_PRC_PD = DB.GetReaderOrdinal(rdr, "PRC_PD");
                    int IDX_EMEA_PD = DB.GetReaderOrdinal(rdr, "EMEA_PD");
                    int IDX_ASMO_PD = DB.GetReaderOrdinal(rdr, "ASMO_PD");
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");

                    // Read the paginated result set
                    while (rdr.Read())
                    {
                        var sdmSummary = new SDMSummary
                        {
                            CYCLE_NM = rdr.IsDBNull(IDX_CYCLE_NM) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CYCLE_NM),
                            CURR_STRT_DT = rdr.IsDBNull(IDX_CURR_STRT_DT) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CURR_STRT_DT),
                            CURR_END_DT = rdr.IsDBNull(IDX_CURR_END_DT) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CURR_END_DT),
                            CPU_VRT_NM = rdr.IsDBNull(IDX_CPU_VRT_NM) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_VRT_NM),
                            CPU_SKU_NM = rdr.IsDBNull(IDX_CPU_SKU_NM) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_SKU_NM),
                            CPU_PROCESSOR_NUMBER = rdr.IsDBNull(IDX_CPU_PROCESSOR_NUMBER) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_PROCESSOR_NUMBER),
                            CPU_FLR = rdr.IsDBNull(IDX_CPU_FLR) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CPU_FLR),
                            APAC_PD = rdr.IsDBNull(IDX_APAC_PD) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_APAC_PD),
                            IJKK_PD = rdr.IsDBNull(IDX_IJKK_PD) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_IJKK_PD),
                            PRC_PD = rdr.IsDBNull(IDX_PRC_PD) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRC_PD),
                            EMEA_PD = rdr.IsDBNull(IDX_EMEA_PD) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMEA_PD),
                            ASMO_PD = rdr.IsDBNull(IDX_ASMO_PD) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ASMO_PD),
                            CHG_DTM = rdr.IsDBNull(IDX_CHG_DTM) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM)
                            // ... other properties
                        };
                        lSDMData.Add(sdmSummary);
                    }

                    // Move to the next result set to get the total count
                    if (rdr.NextResult() && rdr.Read())
                    {
                        totalCount = rdr.GetInt32(0); // Assuming the total count is the first column
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new Exception("An error occurred while accessing the database.", ex);
            }

            // Return both the data and the total count
            return new SDMStageDataResult
            {
                Data = lSDMData,
                TotalCount = totalCount
            };
        }




        public List<SDMSummary> UploadSDMData(List<SDMData> SDMData, bool isBulkUpld)
        {
            in_t_sdm dt = new in_t_sdm();
            SDMData.ForEach(x =>
                dt.AddRow(x)
            );
            var ret = new List<SDMSummary>();
            var cmd = new Procs.dbo.PR_MYDL_LD_SDM_RTL_PULL_DLR_DTL()
            {
                @sdm_input_data = dt,
                @in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                @is_bulkupld = true
            };
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CYCLE_NM = DB.GetReaderOrdinal(rdr, "CYCLE_NM");
                    int IDX_CURR_STRT_DT = DB.GetReaderOrdinal(rdr, "CURR_STRT_DT");
                    int IDX_CURR_END_DT = DB.GetReaderOrdinal(rdr, "CURR_END_DT");
                    int IDX_CPU_VRT_NM = DB.GetReaderOrdinal(rdr, "CPU_VRT_NM");
                    int IDX_CPU_SKU_NM = DB.GetReaderOrdinal(rdr, "CPU_SKU_NM");
                    int IDX_CPU_PROCESSOR_NUMBER = DB.GetReaderOrdinal(rdr, "CPU_PROCESSOR_NUMBER");
                    int IDX_CPU_FLR = DB.GetReaderOrdinal(rdr, "CPU_FLR");
                    int IDX_APAC_PD = DB.GetReaderOrdinal(rdr, "APAC_PD");
                    int IDX_IJKK_PD = DB.GetReaderOrdinal(rdr, "IJKK_PD");
                    int IDX_PRC_PD = DB.GetReaderOrdinal(rdr, "PRC_PD");
                    int IDX_EMEA_PD = DB.GetReaderOrdinal(rdr, "EMEA_PD");
                    int IDX_ASMO_PD = DB.GetReaderOrdinal(rdr, "ASMO_PD");
                    int IDX_IS_DELETE = DB.GetReaderOrdinal(rdr, "IS_DELETE");
                    int IDX_ERROR = DB.GetReaderOrdinal(rdr, "ERROR");

                    while (rdr.Read())
                    {
                        ret.Add(new SDMSummary
                        {
                            CYCLE_NM = (IDX_CYCLE_NM < 0 || rdr.IsDBNull(IDX_CYCLE_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CYCLE_NM),
                            CURR_STRT_DT = (IDX_CURR_STRT_DT < 0 || rdr.IsDBNull(IDX_CURR_STRT_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CURR_STRT_DT),
                            CURR_END_DT = (IDX_CURR_END_DT < 0 || rdr.IsDBNull(IDX_CURR_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CURR_END_DT),
                            CPU_VRT_NM = (IDX_CPU_VRT_NM < 0 || rdr.IsDBNull(IDX_CPU_VRT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_VRT_NM),
                            CPU_SKU_NM = (IDX_CPU_SKU_NM < 0 || rdr.IsDBNull(IDX_CPU_SKU_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_SKU_NM),
                            CPU_PROCESSOR_NUMBER = (IDX_CPU_PROCESSOR_NUMBER < 0 || rdr.IsDBNull(IDX_CPU_PROCESSOR_NUMBER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_PROCESSOR_NUMBER),
                            CPU_FLR = (IDX_CPU_FLR < 0 || rdr.IsDBNull(IDX_CPU_FLR)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CPU_FLR),
                            APAC_PD = (IDX_APAC_PD < 0 || rdr.IsDBNull(IDX_APAC_PD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_APAC_PD),
                            IJKK_PD = (IDX_IJKK_PD < 0 || rdr.IsDBNull(IDX_IJKK_PD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_IJKK_PD),
                            PRC_PD = (IDX_PRC_PD < 0 || rdr.IsDBNull(IDX_PRC_PD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRC_PD),
                            EMEA_PD = (IDX_EMEA_PD < 0 || rdr.IsDBNull(IDX_EMEA_PD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMEA_PD),
                            ASMO_PD = (IDX_ASMO_PD < 0 || rdr.IsDBNull(IDX_ASMO_PD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ASMO_PD),
                            IS_DELETE = (IDX_IS_DELETE < 0 || rdr.IsDBNull(IDX_IS_DELETE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_IS_DELETE)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new Exception("An error occurred while accessing the database.", ex);
            }
            return ret;
        }


        public SDMMasterProductDetails GetMstrPrdDtls(int take, int skip, string whereStg, bool pageChange)
        {
            whereStg = whereStg == "all" ? "" : whereStg;
            var lMstrData = new List<MstrPrdDtlSmry>();
            int totalCount = 0;

            var cmd = new Procs.dbo.PR_MYDL_GET_SDM_NEW_PRD_LKP() 
            {
                in_fltr_cond = whereStg,
                Skip = skip,
                Take = take,
                LoadCount = pageChange
            };
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CPU_VRT_NM = DB.GetReaderOrdinal(rdr, "CPU_VRT_NM");
                    int IDX_CPU_PROCESSOR_NUMBER = DB.GetReaderOrdinal(rdr, "CPU_PROCESSOR_NUMBER");
                    int IDX_CPU_SKU_NM = DB.GetReaderOrdinal(rdr, "CPU_SKU_NM");
                    int IDX_PRODUCT_ACTIVATION_DATE = DB.GetReaderOrdinal(rdr, "PRODUCT_ACTIVATION_DATE");

                    while (rdr.Read())
                    {
                        lMstrData.Add(new MstrPrdDtlSmry
                        {
                            CPU_VRT_NM = (IDX_CPU_VRT_NM < 0 || rdr.IsDBNull(IDX_CPU_VRT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_VRT_NM),
                            CPU_PROCESSOR_NUMBER = (IDX_CPU_PROCESSOR_NUMBER < 0 || rdr.IsDBNull(IDX_CPU_PROCESSOR_NUMBER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_PROCESSOR_NUMBER),
                            CPU_SKU_NM = (IDX_CPU_SKU_NM < 0 || rdr.IsDBNull(IDX_CPU_SKU_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_SKU_NM),
                            PRODUCT_ACTIVATION_DATE = (IDX_PRODUCT_ACTIVATION_DATE < 0 || rdr.IsDBNull(IDX_PRODUCT_ACTIVATION_DATE)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRODUCT_ACTIVATION_DATE)
                        });
                    }
                    // Move to the next result set to get the total count
                    if (rdr.NextResult() && rdr.Read())
                    {
                        totalCount = rdr.GetInt32(0); // Assuming the total count is the first column
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new Exception("An error occurred while accessing the database.", ex);
            }
            // Return both the data and the total count
            return new SDMMasterProductDetails
            {
                Data = lMstrData,
                TotalCount = totalCount
            };
        }

        public List<string> GetSdmDropValues(SdmDropVal data)
        {
            var lDropData = new List<string>();

            bool isStgTbl = data.tblNm == "StgTbl" ? true : false;
            string whereClause = $"PCSR.{data.colNm} LIKE '%{data.filter}%'";
            whereClause = data.addlFilter == "" ? whereClause : $"{whereClause} AND {data.addlFilter}" ;

            var cmd = new Procs.dbo.PR_MYDL_GET_SDM_DROPDOWN()
            {
                WhereClause = whereClause,
                isStgTbl = isStgTbl,
                ColNm = data.colNm,
                isAddRow = data.addRow
            };
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_OUT = DB.GetReaderOrdinal(rdr, data.colNm);

                    while (rdr.Read())
                    {
                        lDropData.Add((IDX_OUT < 0 || rdr.IsDBNull(IDX_OUT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OUT));
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new Exception("An error occurred while accessing the database.", ex);
            }

            return lDropData;
        }
    }
}
