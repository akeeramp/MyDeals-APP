using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals.dbo;
using Intel.MyDeals.Entities;
using CustomEntities = Intel.MyDeals.Entities.Custom;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;

namespace Intel.MyDeals.DataLibrary
{
    public class CostTestDataLib : ICostTestDataLib
    {
        public CostTestDetail GetCostTestDetails(int prcTblId)
        {
            OpLog.Log("GetCostTestDetails");

            var ret = new List<CustomEntities.CostTestDetailItem>();
            var ret2 = new List<CostTestGroupDetailItem>();

            var cmd = new PR_MYDL_GET_COST_TEST_DTL
            {
                in_prc_tbl_obj_sid = prcTblId
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_AVG_RPU = DB.GetReaderOrdinal(rdr, "AVG_RPU");
                    int IDX_CAP = DB.GetReaderOrdinal(rdr, "CAP");
                    int IDX_CNSMPTN_RSN = DB.GetReaderOrdinal(rdr, "CNSMPTN_RSN");
                    int IDX_COST_TEST_OVRRD_CMT = DB.GetReaderOrdinal(rdr, "COST_TEST_OVRRD_CMT");
                    int IDX_COST_TEST_OVRRD_FLG = DB.GetReaderOrdinal(rdr, "COST_TEST_OVRRD_FLG");
                    int IDX_CST_TYPE = DB.GetReaderOrdinal(rdr, "CST_TYPE");
                    int IDX_CUST_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_NM_SID");
                    int IDX_DEAL_DESC = DB.GetReaderOrdinal(rdr, "DEAL_DESC");
                    int IDX_DEAL_END_DT = DB.GetReaderOrdinal(rdr, "DEAL_END_DT");
                    int IDX_DEAL_GRP_CMNT = DB.GetReaderOrdinal(rdr, "DEAL_GRP_CMNT");
                    int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
                    int IDX_DEAL_PRD_RNK = DB.GetReaderOrdinal(rdr, "DEAL_PRD_RNK");
                    int IDX_DEAL_STRT_DT = DB.GetReaderOrdinal(rdr, "DEAL_STRT_DT");
                    int IDX_ECAP_FLR = DB.GetReaderOrdinal(rdr, "ECAP_FLR");
                    int IDX_ECAP_PRC = DB.GetReaderOrdinal(rdr, "ECAP_PRC");
                    int IDX_GEO = DB.GetReaderOrdinal(rdr, "GEO");
                    int IDX_GRP_DEALS = DB.GetReaderOrdinal(rdr, "GRP_DEALS");
                    int IDX_INCMPL_COST_TEST_RSN = DB.GetReaderOrdinal(rdr, "INCMPL_COST_TEST_RSN");
                    int IDX_LAST_COST_TEST_RUN = DB.GetReaderOrdinal(rdr, "LAST_COST_TEST_RUN");
                    int IDX_LNP_FRMULA = DB.GetReaderOrdinal(rdr, "LNP_FRMULA");
                    int IDX_LOW_NET_PRC = DB.GetReaderOrdinal(rdr, "LOW_NET_PRC");
                    int IDX_MAX_RPU = DB.GetReaderOrdinal(rdr, "MAX_RPU");
                    int IDX_MKT_SEG = DB.GetReaderOrdinal(rdr, "MKT_SEG");
                    int IDX_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID");
                    int IDX_OEM_PLTFRM_EOL_DT = DB.GetReaderOrdinal(rdr, "OEM_PLTFRM_EOL_DT");
                    int IDX_OEM_PLTFRM_LNCH_DT = DB.GetReaderOrdinal(rdr, "OEM_PLTFRM_LNCH_DT");
                    int IDX_PCSR_NBR = DB.GetReaderOrdinal(rdr, "PCSR_NBR");
                    int IDX_PRC_CST_TST_STS = DB.GetReaderOrdinal(rdr, "PRC_CST_TST_STS");
                    int IDX_PRD_COST = DB.GetReaderOrdinal(rdr, "PRD_COST");
                    int IDX_PRD_MBR_SIDS = DB.GetReaderOrdinal(rdr, "PRD_MBR_SIDS");
                    int IDX_PRODUCT = DB.GetReaderOrdinal(rdr, "PRODUCT");
                    int IDX_PROG_PMT = DB.GetReaderOrdinal(rdr, "PROG_PMT");
                    int IDX_PYOUT_BASE_ON = DB.GetReaderOrdinal(rdr, "PYOUT_BASE_ON");
                    int IDX_RTL_CYC_NM = DB.GetReaderOrdinal(rdr, "RTL_CYC_NM");
                    int IDX_RTL_PULL_DLR = DB.GetReaderOrdinal(rdr, "RTL_PULL_DLR");
                    int IDX_WF_STG_CD = DB.GetReaderOrdinal(rdr, "WF_STG_CD");
                    int IDX_YCS2 = DB.GetReaderOrdinal(rdr, "YCS2");

                    while (rdr.Read())
                    {
                        ret.Add(new CustomEntities.CostTestDetailItem
                        {
                            AVG_RPU = (IDX_AVG_RPU < 0 || rdr.IsDBNull(IDX_AVG_RPU)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_AVG_RPU),
                            CAP = (IDX_CAP < 0 || rdr.IsDBNull(IDX_CAP)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_CAP),
                            CNSMPTN_RSN = (IDX_CNSMPTN_RSN < 0 || rdr.IsDBNull(IDX_CNSMPTN_RSN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNSMPTN_RSN),
                            COST_TEST_OVRRD_CMT = (IDX_COST_TEST_OVRRD_CMT < 0 || rdr.IsDBNull(IDX_COST_TEST_OVRRD_CMT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COST_TEST_OVRRD_CMT),
                            COST_TEST_OVRRD_FLG = (IDX_COST_TEST_OVRRD_FLG < 0 || rdr.IsDBNull(IDX_COST_TEST_OVRRD_FLG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COST_TEST_OVRRD_FLG),
                            CST_TYPE = (IDX_CST_TYPE < 0 || rdr.IsDBNull(IDX_CST_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CST_TYPE),
                            CUST_NM_SID = (IDX_CUST_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_NM_SID),
                            DEAL_DESC = (IDX_DEAL_DESC < 0 || rdr.IsDBNull(IDX_DEAL_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_DESC),
                            DEAL_END_DT = (IDX_DEAL_END_DT < 0 || rdr.IsDBNull(IDX_DEAL_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_DEAL_END_DT),
                            DEAL_GRP_CMNT = (IDX_DEAL_GRP_CMNT < 0 || rdr.IsDBNull(IDX_DEAL_GRP_CMNT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_GRP_CMNT),
                            DEAL_ID = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                            DEAL_PRD_RNK = (IDX_DEAL_PRD_RNK < 0 || rdr.IsDBNull(IDX_DEAL_PRD_RNK)) ? default(System.Int64) : rdr.GetFieldValue<System.Int64>(IDX_DEAL_PRD_RNK),
                            DEAL_STRT_DT = (IDX_DEAL_STRT_DT < 0 || rdr.IsDBNull(IDX_DEAL_STRT_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_DEAL_STRT_DT),
                            ECAP_FLR = (IDX_ECAP_FLR < 0 || rdr.IsDBNull(IDX_ECAP_FLR)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_ECAP_FLR),
                            ECAP_PRC = (IDX_ECAP_PRC < 0 || rdr.IsDBNull(IDX_ECAP_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_ECAP_PRC),
                            GEO = (IDX_GEO < 0 || rdr.IsDBNull(IDX_GEO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO),
                            GRP_DEALS = (IDX_GRP_DEALS < 0 || rdr.IsDBNull(IDX_GRP_DEALS)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GRP_DEALS),
                            INCMPL_COST_TEST_RSN = (IDX_INCMPL_COST_TEST_RSN < 0 || rdr.IsDBNull(IDX_INCMPL_COST_TEST_RSN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_INCMPL_COST_TEST_RSN),
                            LAST_COST_TEST_RUN = (IDX_LAST_COST_TEST_RUN < 0 || rdr.IsDBNull(IDX_LAST_COST_TEST_RUN)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_LAST_COST_TEST_RUN),
                            LNP_FRMULA = (IDX_LNP_FRMULA < 0 || rdr.IsDBNull(IDX_LNP_FRMULA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LNP_FRMULA),
                            LOW_NET_PRC = (IDX_LOW_NET_PRC < 0 || rdr.IsDBNull(IDX_LOW_NET_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_LOW_NET_PRC),
                            MAX_RPU = (IDX_MAX_RPU < 0 || rdr.IsDBNull(IDX_MAX_RPU)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_MAX_RPU),
                            MKT_SEG = (IDX_MKT_SEG < 0 || rdr.IsDBNull(IDX_MKT_SEG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MKT_SEG),
                            OBJ_TYPE_SID = (IDX_OBJ_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID),
                            OEM_PLTFRM_EOL_DT = (IDX_OEM_PLTFRM_EOL_DT < 0 || rdr.IsDBNull(IDX_OEM_PLTFRM_EOL_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_OEM_PLTFRM_EOL_DT),
                            OEM_PLTFRM_LNCH_DT = (IDX_OEM_PLTFRM_LNCH_DT < 0 || rdr.IsDBNull(IDX_OEM_PLTFRM_LNCH_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_OEM_PLTFRM_LNCH_DT),
                            PCSR_NBR = (IDX_PCSR_NBR < 0 || rdr.IsDBNull(IDX_PCSR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PCSR_NBR),
                            PRC_CST_TST_STS = (IDX_PRC_CST_TST_STS < 0 || rdr.IsDBNull(IDX_PRC_CST_TST_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRC_CST_TST_STS),
                            PRD_COST = (IDX_PRD_COST < 0 || rdr.IsDBNull(IDX_PRD_COST)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_PRD_COST),
                            PRD_MBR_SIDS = (IDX_PRD_MBR_SIDS < 0 || rdr.IsDBNull(IDX_PRD_MBR_SIDS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_MBR_SIDS),
                            PRODUCT = (IDX_PRODUCT < 0 || rdr.IsDBNull(IDX_PRODUCT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRODUCT),
                            PROG_PMT = (IDX_PROG_PMT < 0 || rdr.IsDBNull(IDX_PROG_PMT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PROG_PMT),
                            PYOUT_BASE_ON = (IDX_PYOUT_BASE_ON < 0 || rdr.IsDBNull(IDX_PYOUT_BASE_ON)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PYOUT_BASE_ON),
                            RTL_CYC_NM = (IDX_RTL_CYC_NM < 0 || rdr.IsDBNull(IDX_RTL_CYC_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RTL_CYC_NM),
                            RTL_PULL_DLR = (IDX_RTL_PULL_DLR < 0 || rdr.IsDBNull(IDX_RTL_PULL_DLR)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_RTL_PULL_DLR),
                            WF_STG_CD = (IDX_WF_STG_CD < 0 || rdr.IsDBNull(IDX_WF_STG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WF_STG_CD),
                            YCS2 = (IDX_YCS2 < 0 || rdr.IsDBNull(IDX_YCS2)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_YCS2)
                        });
                    }

                    rdr.NextResult();

                    //TABLE 2
                    IDX_DEAL_PRD_RNK = DB.GetReaderOrdinal(rdr, "DEAL_PRD_RNK");
                    int IDX_EXCLD_DEAL_FLAG = DB.GetReaderOrdinal(rdr, "EXCLD_DEAL_FLAG");
                    int IDX_OVLP_ADDITIVE = DB.GetReaderOrdinal(rdr, "OVLP_ADDITIVE");
                    int IDX_OVLP_CNSMPTN_RSN = DB.GetReaderOrdinal(rdr, "OVLP_CNSMPTN_RSN");
                    int IDX_OVLP_CNSMPTN_RSN_CMNT = DB.GetReaderOrdinal(rdr, "OVLP_CNSMPTN_RSN_CMNT");
                    int IDX_OVLP_CNTRCT_NM = DB.GetReaderOrdinal(rdr, "OVLP_CNTRCT_NM");
                    int IDX_OVLP_DEAL_DESC = DB.GetReaderOrdinal(rdr, "OVLP_DEAL_DESC");
                    int IDX_OVLP_DEAL_END_DT = DB.GetReaderOrdinal(rdr, "OVLP_DEAL_END_DT");
                    int IDX_OVLP_DEAL_ID = DB.GetReaderOrdinal(rdr, "OVLP_DEAL_ID");
                    int IDX_OVLP_DEAL_STRT_DT = DB.GetReaderOrdinal(rdr, "OVLP_DEAL_STRT_DT");
                    int IDX_OVLP_DEAL_TYPE = DB.GetReaderOrdinal(rdr, "OVLP_DEAL_TYPE");
                    int IDX_OVLP_ECAP_PRC = DB.GetReaderOrdinal(rdr, "OVLP_ECAP_PRC");
                    int IDX_OVLP_MAX_RPU = DB.GetReaderOrdinal(rdr, "OVLP_MAX_RPU");
                    int IDX_OVLP_WF_STG_CD = DB.GetReaderOrdinal(rdr, "OVLP_WF_STG_CD");
                    IDX_PRODUCT = DB.GetReaderOrdinal(rdr, "PRODUCT");

                    while (rdr.Read())
                    {
                        ret2.Add(new CostTestGroupDetailItem
                        {
                            DEAL_PRD_RNK = (IDX_DEAL_PRD_RNK < 0 || rdr.IsDBNull(IDX_DEAL_PRD_RNK)) ? default(System.Int64) : rdr.GetFieldValue<System.Int64>(IDX_DEAL_PRD_RNK),
                            EXCLD_DEAL_FLAG = (IDX_EXCLD_DEAL_FLAG < 0 || rdr.IsDBNull(IDX_EXCLD_DEAL_FLAG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EXCLD_DEAL_FLAG),
                            OVLP_ADDITIVE = (IDX_OVLP_ADDITIVE < 0 || rdr.IsDBNull(IDX_OVLP_ADDITIVE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_ADDITIVE),
                            OVLP_CNSMPTN_RSN = (IDX_OVLP_CNSMPTN_RSN < 0 || rdr.IsDBNull(IDX_OVLP_CNSMPTN_RSN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_CNSMPTN_RSN),
                            OVLP_CNSMPTN_RSN_CMNT = (IDX_OVLP_CNSMPTN_RSN_CMNT < 0 || rdr.IsDBNull(IDX_OVLP_CNSMPTN_RSN_CMNT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_CNSMPTN_RSN_CMNT),
                            OVLP_CNTRCT_NM = (IDX_OVLP_CNTRCT_NM < 0 || rdr.IsDBNull(IDX_OVLP_CNTRCT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_CNTRCT_NM),
                            OVLP_DEAL_DESC = (IDX_OVLP_DEAL_DESC < 0 || rdr.IsDBNull(IDX_OVLP_DEAL_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_DEAL_DESC),
                            OVLP_DEAL_END_DT = (IDX_OVLP_DEAL_END_DT < 0 || rdr.IsDBNull(IDX_OVLP_DEAL_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_OVLP_DEAL_END_DT),
                            OVLP_DEAL_ID = (IDX_OVLP_DEAL_ID < 0 || rdr.IsDBNull(IDX_OVLP_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OVLP_DEAL_ID),
                            OVLP_DEAL_STRT_DT = (IDX_OVLP_DEAL_STRT_DT < 0 || rdr.IsDBNull(IDX_OVLP_DEAL_STRT_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_OVLP_DEAL_STRT_DT),
                            OVLP_DEAL_TYPE = (IDX_OVLP_DEAL_TYPE < 0 || rdr.IsDBNull(IDX_OVLP_DEAL_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_DEAL_TYPE),
                            OVLP_ECAP_PRC = (IDX_OVLP_ECAP_PRC < 0 || rdr.IsDBNull(IDX_OVLP_ECAP_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_OVLP_ECAP_PRC),
                            OVLP_MAX_RPU = (IDX_OVLP_MAX_RPU < 0 || rdr.IsDBNull(IDX_OVLP_MAX_RPU)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_OVLP_MAX_RPU),
                            OVLP_WF_STG_CD = (IDX_OVLP_WF_STG_CD < 0 || rdr.IsDBNull(IDX_OVLP_WF_STG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_WF_STG_CD),
                            PRODUCT = (IDX_PRODUCT < 0 || rdr.IsDBNull(IDX_PRODUCT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRODUCT)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return new CostTestDetail
            {
                CostTestDetailItems = ret,
                CostTestGroupDetailItems = ret2
            };
        }

        public static OpDataCollectorFlattenedList ToOpDataCollectorFlattenedList(List<CostTestGroupDetailItem> items)
        {
            OpDataCollectorFlattenedList rtnData = new OpDataCollectorFlattenedList();

            PropertyInfo[] fieldNames = typeof(CostTestGroupDetailItem).GetProperties(BindingFlags.Instance |
                       BindingFlags.Static |
                       BindingFlags.NonPublic |
                       BindingFlags.Public);

            foreach (CostTestGroupDetailItem item in items)
            {
                OpDataCollectorFlattenedItem newItem = new OpDataCollectorFlattenedItem();
                foreach (PropertyInfo propertyInfo in fieldNames)
                {
                    newItem[propertyInfo.Name] = propertyInfo.GetValue(item);
                }
                rtnData.Add(newItem);
            }

            return rtnData;
        }

        public PctOverrideReason SetPctOverrideReason(PctOverrideReason data)
        {
            var ret = new List<PctOverrideReason>();
            try
            {
                // Make datatable
                in_deal_ovrrd dt = new in_deal_ovrrd();
                dt.AddRow(data);

                // Call Proc
                DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_UPD_DEAL_OVRRD_ATRBS cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_UPD_DEAL_OVRRD_ATRBS
                {
                    in_deal_ovrrd = dt,
                    in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID
                };
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret.FirstOrDefault();
        }

        public List<PctMctResult> RunPct(int objTypeId, List<int> objSetTypeIds)
        {
            OpLog.Log("RunPct");

            var ret = new List<PctMctResult>();

            var cmd = new PR_MYDL_GET_MEET_COMP
            {
                obj_sids = new type_int_list(objSetTypeIds.ToArray()),
                OBJ_TYPE_ID = objTypeId,
                USR_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                Role = OpUserStack.MyOpUserToken.Role.RoleTypeCd,
                MODE = "M"
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_COST_TEST_RESULT = DB.GetReaderOrdinal(rdr, "COST_TEST_RESULT");
                    int IDX_MEETCOMP_TEST_RESULT = DB.GetReaderOrdinal(rdr, "MEETCOMP_TEST_RESULT");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new PctMctResult
                        {
                            COST_TEST_RESULT = (IDX_COST_TEST_RESULT < 0 || rdr.IsDBNull(IDX_COST_TEST_RESULT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COST_TEST_RESULT),
                            MEETCOMP_TEST_RESULT = (IDX_MEETCOMP_TEST_RESULT < 0 || rdr.IsDBNull(IDX_MEETCOMP_TEST_RESULT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEETCOMP_TEST_RESULT),
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
                            OBJ_TYPE_SID = (IDX_OBJ_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID)
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

        public void RollupResults(List<int> contractLst)
        {
            DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_CNTRCT_OBJ_VAL_ROLLUP cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_CNTRCT_OBJ_VAL_ROLLUP
            {
                contractLst = new type_int_list(contractLst.ToArray()),
            };
            using (DataAccess.ExecuteDataSet(cmd))
            {
            }
        }
    }
}