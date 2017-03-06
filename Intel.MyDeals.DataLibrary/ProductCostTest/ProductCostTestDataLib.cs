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
    }
}