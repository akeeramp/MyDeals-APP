using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class ProductCostTestDataLib : IProductCostTestDataLib
    {
        /// <summary>
        /// Get Price Cost Test Rules
        /// </summary>
        /// <returns></returns>
        public List<ProductCostTestRules> GetProductCostTestRules()
        {
            var ret = new List<ProductCostTestRules>();
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_PCT_RULE_UI_FETCH();
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CONDITION = DB.GetReaderOrdinal(rdr, "CONDITION");
                    int IDX_COST_TEST_TYPE = DB.GetReaderOrdinal(rdr, "COST_TEST_TYPE");
                    int IDX_CRITERIA = DB.GetReaderOrdinal(rdr, "CRITERIA");
                    int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
                    int IDX_DEAL_PRD_TYPE_SID = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE_SID");
                    int IDX_JSON_TXT = DB.GetReaderOrdinal(rdr, "JSON_TXT");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
                    int IDX_PRD_CAT_NM_SID = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new ProductCostTestRules
                        {
                            CONDITION = (IDX_CONDITION < 0 || rdr.IsDBNull(IDX_CONDITION)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CONDITION),
                            COST_TEST_TYPE = (IDX_COST_TEST_TYPE < 0 || rdr.IsDBNull(IDX_COST_TEST_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COST_TEST_TYPE),
                            CRITERIA = (IDX_CRITERIA < 0 || rdr.IsDBNull(IDX_CRITERIA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CRITERIA),
                            DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
                            DEAL_PRD_TYPE_SID = (IDX_DEAL_PRD_TYPE_SID < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_PRD_TYPE_SID),
                            JSON_TXT = (IDX_JSON_TXT < 0 || rdr.IsDBNull(IDX_JSON_TXT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_JSON_TXT),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
                            PRD_CAT_NM_SID = (IDX_PRD_CAT_NM_SID < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_CAT_NM_SID)
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

        /// <summary>
        ///
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="pctRules"></param>
        /// <returns></returns>
        public List<ProductCostTestRules> SetPCTRules(CrudModes mode, ProductCostTestRules pctRules)
        {
            var ret = new List<ProductCostTestRules>();
            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_SAVE_RULES_PCT
                {
                    emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                    prd_type_sid = pctRules.DEAL_PRD_TYPE_SID,
                    vertical_sid = pctRules.PRD_CAT_NM_SID,
                    cost_test = pctRules.COST_TEST_TYPE,
                    criteria = pctRules.CRITERIA,
                    condition = pctRules.CONDITION,
                    json_txt = pctRules.JSON_TXT,
                    mode = mode.ToString()
                }))
                {
                    int IDX_CONDITION = DB.GetReaderOrdinal(rdr, "CONDITION");
                    int IDX_COST_TEST_TYPE = DB.GetReaderOrdinal(rdr, "COST_TEST_TYPE");
                    int IDX_CRITERIA = DB.GetReaderOrdinal(rdr, "CRITERIA");
                    int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
                    int IDX_DEAL_PRD_TYPE_SID = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE_SID");
                    int IDX_JSON_TXT = DB.GetReaderOrdinal(rdr, "JSON_TXT");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
                    int IDX_PRD_CAT_NM_SID = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new ProductCostTestRules
                        {
                            CONDITION = (IDX_CONDITION < 0 || rdr.IsDBNull(IDX_CONDITION)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CONDITION),
                            COST_TEST_TYPE = (IDX_COST_TEST_TYPE < 0 || rdr.IsDBNull(IDX_COST_TEST_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COST_TEST_TYPE),
                            CRITERIA = (IDX_CRITERIA < 0 || rdr.IsDBNull(IDX_CRITERIA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CRITERIA),
                            DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
                            DEAL_PRD_TYPE_SID = (IDX_DEAL_PRD_TYPE_SID < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_PRD_TYPE_SID),
                            JSON_TXT = (IDX_JSON_TXT < 0 || rdr.IsDBNull(IDX_JSON_TXT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_JSON_TXT),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
                            PRD_CAT_NM_SID = (IDX_PRD_CAT_NM_SID < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_CAT_NM_SID)
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

        /// <summary>
        /// PCT Product Mappings
        /// </summary>
        /// <returns></returns>
        public List<ProductTypeMappings> GetPCTProductTypeMappings()
        {
            var ret = new List<ProductTypeMappings>();
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_GET_PRD_CAT_PCT();
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_PRD_TYPE = DB.GetReaderOrdinal(rdr, "PRD_TYPE");
                    int IDX_PRD_TYPE_SID = DB.GetReaderOrdinal(rdr, "PRD_TYPE_SID");
                    int IDX_VERTICAL = DB.GetReaderOrdinal(rdr, "VERTICAL");
                    int IDX_VERTICAL_SID = DB.GetReaderOrdinal(rdr, "VERTICAL_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new ProductTypeMappings
                        {
                            PRD_TYPE = (IDX_PRD_TYPE < 0 || rdr.IsDBNull(IDX_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_TYPE),
                            PRD_TYPE_SID = (IDX_PRD_TYPE_SID < 0 || rdr.IsDBNull(IDX_PRD_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_TYPE_SID),
                            VERTICAL = (IDX_VERTICAL < 0 || rdr.IsDBNull(IDX_VERTICAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_VERTICAL),
                            VERTICAL_SID = (IDX_VERTICAL_SID < 0 || rdr.IsDBNull(IDX_VERTICAL_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_VERTICAL_SID)
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

        /// <summary>
        /// PCT Product Attribute values
        /// </summary>
        /// <returns></returns>
        public List<ProductAttributeValues> GetProductAttributeValues(int verticalId)
        {
            var ret = new List<ProductAttributeValues>();
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_ATRB_VAL_PCT
                {
                    vrt_mbr_sid = verticalId
                };
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ATRB_COL_NM = DB.GetReaderOrdinal(rdr, "ATRB_COL_NM");
                    int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
                    int IDX_DISPLAYNAME = DB.GetReaderOrdinal(rdr, "DISPLAYNAME");
                    int IDX_VALUE = DB.GetReaderOrdinal(rdr, "VALUE");

                    while (rdr.Read())
                    {
                        ret.Add(new ProductAttributeValues
                        {
                            ATRB_COL_NM = (IDX_ATRB_COL_NM < 0 || rdr.IsDBNull(IDX_ATRB_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_COL_NM),
                            ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_SID),
                            DISPLAYNAME = (IDX_DISPLAYNAME < 0 || rdr.IsDBNull(IDX_DISPLAYNAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DISPLAYNAME),
                            VALUE = (IDX_VALUE < 0 || rdr.IsDBNull(IDX_VALUE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_VALUE)
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

        /// <summary>
        /// Get Legal Exception
        /// </summary>
        /// <returns></returns>
        public List<PCTLegalException> GetLegalExceptions()
        {
            var ret = new List<PCTLegalException>();
            try
            {
                // Call Proc
                Procs.dbo.PR_MYDL_UPD_PCT_LGL_EXCPT cmd = new Procs.dbo.PR_MYDL_UPD_PCT_LGL_EXCPT
                {
                    MODE = CrudModes.Select.ToString(),
                    EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID
                };
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_APRV_ATRNY = DB.GetReaderOrdinal(rdr, "APRV_ATRNY");
                    int IDX_BUSNS_OBJ = DB.GetReaderOrdinal(rdr, "BUSNS_OBJ");
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CHG_EMP_NAME = DB.GetReaderOrdinal(rdr, "CHG_EMP_NAME");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                    int IDX_COST = DB.GetReaderOrdinal(rdr, "COST");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_CUST_PRD = DB.GetReaderOrdinal(rdr, "CUST_PRD");
                    int IDX_DT_APRV = DB.GetReaderOrdinal(rdr, "DT_APRV");
                    int IDX_FRCST_VOL_BYQTR = DB.GetReaderOrdinal(rdr, "FRCST_VOL_BYQTR");
                    int IDX_INTEL_PRD = DB.GetReaderOrdinal(rdr, "INTEL_PRD");
                    int IDX_JSTFN_PCT_EXCPT = DB.GetReaderOrdinal(rdr, "JSTFN_PCT_EXCPT");
                    int IDX_MEET_COMP_PRC = DB.GetReaderOrdinal(rdr, "MEET_COMP_PRC");
                    int IDX_MEET_COMP_PRD = DB.GetReaderOrdinal(rdr, "MEET_COMP_PRD");
                    int IDX_MYDL_PCT_LGL_EXCPT_SID = DB.GetReaderOrdinal(rdr, "MYDL_PCT_LGL_EXCPT_SID");
                    int IDX_OTHER = DB.GetReaderOrdinal(rdr, "OTHER");
                    int IDX_PCT_LGL_EXCPT_END_DT = DB.GetReaderOrdinal(rdr, "PCT_LGL_EXCPT_END_DT");
                    int IDX_PCT_LGL_EXCPT_STRT_DT = DB.GetReaderOrdinal(rdr, "PCT_LGL_EXCPT_STRT_DT");
                    int IDX_PRC_RQST = DB.GetReaderOrdinal(rdr, "PRC_RQST");
                    int IDX_PTNTL_MKT_IMPCT = DB.GetReaderOrdinal(rdr, "PTNTL_MKT_IMPCT");
                    int IDX_RQST_ATRNY = DB.GetReaderOrdinal(rdr, "RQST_ATRNY");
                    int IDX_RQST_CLNT = DB.GetReaderOrdinal(rdr, "RQST_CLNT");
                    int IDX_SCPE = DB.GetReaderOrdinal(rdr, "SCPE");
                    int IDX_USED_IN_DL = DB.GetReaderOrdinal(rdr, "USED_IN_DL");

                    while (rdr.Read())
                    {
                        ret.Add(new PCTLegalException
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            APRV_ATRNY = (IDX_APRV_ATRNY < 0 || rdr.IsDBNull(IDX_APRV_ATRNY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APRV_ATRNY),
                            BUSNS_OBJ = (IDX_BUSNS_OBJ < 0 || rdr.IsDBNull(IDX_BUSNS_OBJ)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BUSNS_OBJ),
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CHG_EMP_NAME = (IDX_CHG_EMP_NAME < 0 || rdr.IsDBNull(IDX_CHG_EMP_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHG_EMP_NAME),
                            CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                            COST = (IDX_COST < 0 || rdr.IsDBNull(IDX_COST)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_COST),
                            CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                            CUST_PRD = (IDX_CUST_PRD < 0 || rdr.IsDBNull(IDX_CUST_PRD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_PRD),
                            DT_APRV = (IDX_DT_APRV < 0 || rdr.IsDBNull(IDX_DT_APRV)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_DT_APRV),
                            FRCST_VOL_BYQTR = (IDX_FRCST_VOL_BYQTR < 0 || rdr.IsDBNull(IDX_FRCST_VOL_BYQTR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FRCST_VOL_BYQTR),
                            INTEL_PRD = (IDX_INTEL_PRD < 0 || rdr.IsDBNull(IDX_INTEL_PRD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_INTEL_PRD),
                            JSTFN_PCT_EXCPT = (IDX_JSTFN_PCT_EXCPT < 0 || rdr.IsDBNull(IDX_JSTFN_PCT_EXCPT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_JSTFN_PCT_EXCPT),
                            MEET_COMP_PRC = (IDX_MEET_COMP_PRC < 0 || rdr.IsDBNull(IDX_MEET_COMP_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_MEET_COMP_PRC),
                            MEET_COMP_PRD = (IDX_MEET_COMP_PRD < 0 || rdr.IsDBNull(IDX_MEET_COMP_PRD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_PRD),
                            MYDL_PCT_LGL_EXCPT_SID = (IDX_MYDL_PCT_LGL_EXCPT_SID < 0 || rdr.IsDBNull(IDX_MYDL_PCT_LGL_EXCPT_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MYDL_PCT_LGL_EXCPT_SID),
                            OTHER = (IDX_OTHER < 0 || rdr.IsDBNull(IDX_OTHER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OTHER),
                            PCT_LGL_EXCPT_END_DT = (IDX_PCT_LGL_EXCPT_END_DT < 0 || rdr.IsDBNull(IDX_PCT_LGL_EXCPT_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PCT_LGL_EXCPT_END_DT),
                            PCT_LGL_EXCPT_STRT_DT = (IDX_PCT_LGL_EXCPT_STRT_DT < 0 || rdr.IsDBNull(IDX_PCT_LGL_EXCPT_STRT_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PCT_LGL_EXCPT_STRT_DT),
                            PRC_RQST = (IDX_PRC_RQST < 0 || rdr.IsDBNull(IDX_PRC_RQST)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRC_RQST),
                            PTNTL_MKT_IMPCT = (IDX_PTNTL_MKT_IMPCT < 0 || rdr.IsDBNull(IDX_PTNTL_MKT_IMPCT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PTNTL_MKT_IMPCT),
                            RQST_ATRNY = (IDX_RQST_ATRNY < 0 || rdr.IsDBNull(IDX_RQST_ATRNY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_ATRNY),
                            RQST_CLNT = (IDX_RQST_CLNT < 0 || rdr.IsDBNull(IDX_RQST_CLNT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_CLNT),
                            SCPE = (IDX_SCPE < 0 || rdr.IsDBNull(IDX_SCPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SCPE),
                            USED_IN_DL = (IDX_USED_IN_DL < 0 || rdr.IsDBNull(IDX_USED_IN_DL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_USED_IN_DL)
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

        /// <summary>
        /// Set LegalException
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="input"></param>
        /// <returns></returns>
        public PCTLegalException SetPCTlegalException(CrudModes mode, PCTLegalException input)
        {
            var ret = new List<PCTLegalException>();
            try
            {
                input.CHG_EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID;

                // Make datatable
                in_t_pct_lgl_excpt dt = new in_t_pct_lgl_excpt();
                dt.AddRow(input);

                // Call Proc
                Procs.dbo.PR_MYDL_UPD_PCT_LGL_EXCPT cmd = new Procs.dbo.PR_MYDL_UPD_PCT_LGL_EXCPT
                {
                    TVT_LGL_EXCPT = dt,
                    MODE = mode.ToString(),
                    EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID
                };
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_APRV_ATRNY = DB.GetReaderOrdinal(rdr, "APRV_ATRNY");
                    int IDX_BUSNS_OBJ = DB.GetReaderOrdinal(rdr, "BUSNS_OBJ");
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CHG_EMP_NAME = DB.GetReaderOrdinal(rdr, "CHG_EMP_NAME");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                    int IDX_COST = DB.GetReaderOrdinal(rdr, "COST");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_CUST_PRD = DB.GetReaderOrdinal(rdr, "CUST_PRD");
                    int IDX_DT_APRV = DB.GetReaderOrdinal(rdr, "DT_APRV");
                    int IDX_FRCST_VOL_BYQTR = DB.GetReaderOrdinal(rdr, "FRCST_VOL_BYQTR");
                    int IDX_INTEL_PRD = DB.GetReaderOrdinal(rdr, "INTEL_PRD");
                    int IDX_JSTFN_PCT_EXCPT = DB.GetReaderOrdinal(rdr, "JSTFN_PCT_EXCPT");
                    int IDX_MEET_COMP_PRC = DB.GetReaderOrdinal(rdr, "MEET_COMP_PRC");
                    int IDX_MEET_COMP_PRD = DB.GetReaderOrdinal(rdr, "MEET_COMP_PRD");
                    int IDX_MYDL_PCT_LGL_EXCPT_SID = DB.GetReaderOrdinal(rdr, "MYDL_PCT_LGL_EXCPT_SID");
                    int IDX_OTHER = DB.GetReaderOrdinal(rdr, "OTHER");
                    int IDX_PCT_LGL_EXCPT_END_DT = DB.GetReaderOrdinal(rdr, "PCT_LGL_EXCPT_END_DT");
                    int IDX_PCT_LGL_EXCPT_STRT_DT = DB.GetReaderOrdinal(rdr, "PCT_LGL_EXCPT_STRT_DT");
                    int IDX_PRC_RQST = DB.GetReaderOrdinal(rdr, "PRC_RQST");
                    int IDX_PTNTL_MKT_IMPCT = DB.GetReaderOrdinal(rdr, "PTNTL_MKT_IMPCT");
                    int IDX_RQST_ATRNY = DB.GetReaderOrdinal(rdr, "RQST_ATRNY");
                    int IDX_RQST_CLNT = DB.GetReaderOrdinal(rdr, "RQST_CLNT");
                    int IDX_SCPE = DB.GetReaderOrdinal(rdr, "SCPE");
                    int IDX_USED_IN_DL = DB.GetReaderOrdinal(rdr, "USED_IN_DL");

                    while (rdr.Read())
                    {
                        ret.Add(new PCTLegalException
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            APRV_ATRNY = (IDX_APRV_ATRNY < 0 || rdr.IsDBNull(IDX_APRV_ATRNY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APRV_ATRNY),
                            BUSNS_OBJ = (IDX_BUSNS_OBJ < 0 || rdr.IsDBNull(IDX_BUSNS_OBJ)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BUSNS_OBJ),
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CHG_EMP_NAME = (IDX_CHG_EMP_NAME < 0 || rdr.IsDBNull(IDX_CHG_EMP_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHG_EMP_NAME),
                            CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                            COST = (IDX_COST < 0 || rdr.IsDBNull(IDX_COST)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_COST),
                            CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                            CUST_PRD = (IDX_CUST_PRD < 0 || rdr.IsDBNull(IDX_CUST_PRD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_PRD),
                            DT_APRV = (IDX_DT_APRV < 0 || rdr.IsDBNull(IDX_DT_APRV)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_DT_APRV),
                            FRCST_VOL_BYQTR = (IDX_FRCST_VOL_BYQTR < 0 || rdr.IsDBNull(IDX_FRCST_VOL_BYQTR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FRCST_VOL_BYQTR),
                            INTEL_PRD = (IDX_INTEL_PRD < 0 || rdr.IsDBNull(IDX_INTEL_PRD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_INTEL_PRD),
                            JSTFN_PCT_EXCPT = (IDX_JSTFN_PCT_EXCPT < 0 || rdr.IsDBNull(IDX_JSTFN_PCT_EXCPT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_JSTFN_PCT_EXCPT),
                            MEET_COMP_PRC = (IDX_MEET_COMP_PRC < 0 || rdr.IsDBNull(IDX_MEET_COMP_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_MEET_COMP_PRC),
                            MEET_COMP_PRD = (IDX_MEET_COMP_PRD < 0 || rdr.IsDBNull(IDX_MEET_COMP_PRD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_PRD),
                            MYDL_PCT_LGL_EXCPT_SID = (IDX_MYDL_PCT_LGL_EXCPT_SID < 0 || rdr.IsDBNull(IDX_MYDL_PCT_LGL_EXCPT_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MYDL_PCT_LGL_EXCPT_SID),
                            OTHER = (IDX_OTHER < 0 || rdr.IsDBNull(IDX_OTHER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OTHER),
                            PCT_LGL_EXCPT_END_DT = (IDX_PCT_LGL_EXCPT_END_DT < 0 || rdr.IsDBNull(IDX_PCT_LGL_EXCPT_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PCT_LGL_EXCPT_END_DT),
                            PCT_LGL_EXCPT_STRT_DT = (IDX_PCT_LGL_EXCPT_STRT_DT < 0 || rdr.IsDBNull(IDX_PCT_LGL_EXCPT_STRT_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PCT_LGL_EXCPT_STRT_DT),
                            PRC_RQST = (IDX_PRC_RQST < 0 || rdr.IsDBNull(IDX_PRC_RQST)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRC_RQST),
                            PTNTL_MKT_IMPCT = (IDX_PTNTL_MKT_IMPCT < 0 || rdr.IsDBNull(IDX_PTNTL_MKT_IMPCT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PTNTL_MKT_IMPCT),
                            RQST_ATRNY = (IDX_RQST_ATRNY < 0 || rdr.IsDBNull(IDX_RQST_ATRNY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_ATRNY),
                            RQST_CLNT = (IDX_RQST_CLNT < 0 || rdr.IsDBNull(IDX_RQST_CLNT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_CLNT),
                            SCPE = (IDX_SCPE < 0 || rdr.IsDBNull(IDX_SCPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SCPE),
                            USED_IN_DL = (IDX_USED_IN_DL < 0 || rdr.IsDBNull(IDX_USED_IN_DL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_USED_IN_DL)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret.FirstOrDefault();
        }

    }
}