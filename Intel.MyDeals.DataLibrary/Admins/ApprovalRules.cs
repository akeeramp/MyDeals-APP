using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class ApprovalRules
    {

        //public List<PriceRuleData> GetPriceRuleData()
        //{
        //    List<PriceRuleData> lstPriceRuleData = new List<PriceRuleData>();
        //    var cmd = new Procs.dbo.PR_MYDL_GET_PRC_RULE_DATA { };
        //    using (var rdr = DataAccess.ExecuteDataSet(cmd))
        //    {
        //        if (rdr.Tables.Count > 0)
        //        {
        //            lstPriceRuleData = (from result in rdr.Tables[0].AsEnumerable()
        //                                select new PriceRuleData
        //                                {
        //                                    ContractId = (int)result["CNTRCT_OBJ_SID"],
        //                                    DealId = (int)result["DC_ID"],
        //                                    PricingStrategyId = (int)result["PRC_ST_OBJ_SID"]
        //                                }).ToList();
        //        }
        //    }
        //    return lstPriceRuleData;
        //}

        public List<PriceRuleCriteria> GetPriceRuleCriteriaById(int id, PriceRuleAction priceRuleAction)
        {
            var cmd = new Procs.dbo.PR_MYDL_GET_PRC_RULE
            {
                actn_nm = priceRuleAction.ToString("g"),
                id = id,
                usr_id = OpUserStack.MyOpUserToken.Usr.WWID
            };

            List<PriceRuleCriteria> rtn = new List<PriceRuleCriteria>();

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                // Go and add this to templates classes if needed (MIKE)
                int IDX_RULE_ID = DB.GetReaderOrdinal(rdr, "RULE_ID");
                int IDX_RULE_NAME = DB.GetReaderOrdinal(rdr, "RULE_NAME");
                int IDX_NOTES = DB.GetReaderOrdinal(rdr, "NOTES");
                int IDX_RULE_CRITERIA = DB.GetReaderOrdinal(rdr, "RULE_CRITERIA");
                int IDX_PRODUCT_CRITERIA = DB.GetReaderOrdinal(rdr, "PRODUCT_CRITERIA");
                int IDX_IS_ACTV = DB.GetReaderOrdinal(rdr, "IS_ACTV");
                int IDX_IS_NORMAL_RULE = DB.GetReaderOrdinal(rdr, "IS_NORMAL_RULE");
                int IDX_IS_APPROVED = DB.GetReaderOrdinal(rdr, "IS_APPROVED");
                int IDX_EFF_FRM_DT = DB.GetReaderOrdinal(rdr, "EFF_FRM_DT");
                int IDX_EFF_TO_DT = DB.GetReaderOrdinal(rdr, "EFF_TO_DT");
                int IDX_OWNER_WWID = DB.GetReaderOrdinal(rdr, "OWNER_WWID");
                int IDX_CHG_BY = DB.GetReaderOrdinal(rdr, "CHG_BY");
                int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");

                while (rdr.Read())
                {
                    int j = 0;
                    rtn.Add(new PriceRuleCriteria
                    {
                        Id = (IDX_RULE_ID < 0 || rdr.IsDBNull(IDX_RULE_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RULE_ID),
                        Name = (IDX_RULE_NAME < 0 || rdr.IsDBNull(IDX_RULE_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RULE_NAME),
                        Notes = (IDX_NOTES < 0 || rdr.IsDBNull(IDX_NOTES)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTES),
                        CriteriaJson = (IDX_RULE_CRITERIA < 0 || rdr.IsDBNull(IDX_RULE_CRITERIA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RULE_CRITERIA),
                        ProductCriteriaJson = (IDX_PRODUCT_CRITERIA < 0 || rdr.IsDBNull(IDX_PRODUCT_CRITERIA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRODUCT_CRITERIA),
                        IsActive = (IDX_IS_ACTV < 0 || rdr.IsDBNull(IDX_IS_ACTV)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_ACTV),
                        IsNormalRule = (IDX_IS_NORMAL_RULE < 0 || rdr.IsDBNull(IDX_IS_NORMAL_RULE)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_NORMAL_RULE),
                        RuleStatus = (IDX_IS_APPROVED < 0 || rdr.IsDBNull(IDX_IS_APPROVED)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_APPROVED),
                        StartDate = (IDX_EFF_FRM_DT < 0 || rdr.IsDBNull(IDX_EFF_FRM_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_EFF_FRM_DT),
                        EndDate = (IDX_EFF_TO_DT < 0 || rdr.IsDBNull(IDX_EFF_TO_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_EFF_TO_DT),
                        OwnerId = (IDX_OWNER_WWID < 0 || rdr.IsDBNull(IDX_OWNER_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OWNER_WWID),
                        // FIX CHANGED BY DEFINATION
                        ChangedBy = (IDX_CHG_BY < 0 || rdr.IsDBNull(IDX_CHG_BY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHG_BY),
                        ChangeDateTime = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM)
                    });
                }  // while
            }

            return rtn;
        }


        //List<PriceRuleCriteria> GetPriceRuleCriteria(SqlData rdr)
        //{
        //    List<PriceRuleCriteria> rtn = new List<PriceRuleCriteria>();

        //    // Go and add this to templates classes if needed (MIKE)
        //    int IDX_RULE_ID = DB.GetReaderOrdinal(rdr, "RULE_ID");
        //    int IDX_RULE_TYPE_ID = DB.GetReaderOrdinal(rdr, "RULE_TYPE_ID");
        //    int IDX_RULE_NAME = DB.GetReaderOrdinal(rdr, "RULE_NAME");
        //    int IDX_RULE_CRITERIA = DB.GetReaderOrdinal(rdr, "RULE_CRITERIA");
        //    int IDX_PRODUCT_CRITERIA = DB.GetReaderOrdinal(rdr, "PRODUCT_CRITERIA");
        //    int IDX_IS_ACTV = DB.GetReaderOrdinal(rdr, "IS_ACTV");
        //    int IDX_IS_APPROVED = DB.GetReaderOrdinal(rdr, "IS_APPROVED");
        //    int IDX_EFF_FRM_DT = DB.GetReaderOrdinal(rdr, "EFF_FRM_DT");
        //    int IDX_EFF_TO_DT = DB.GetReaderOrdinal(rdr, "EFF_TO_DT");
        //    int IDX_OWNER_WWID = DB.GetReaderOrdinal(rdr, "OWNER_WWID");
        //    int IDX_CHG_BY = DB.GetReaderOrdinal(rdr, "CHG_BY");
        //    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");

        //    while (rdr.Read())
        //    {
        //        int j = 0;
        //        rtn.Add(new PriceRuleCriteria
        //        {
        //            Id = (IDX_RULE_ID < 0 || rdr.IsDBNull(IDX_RULE_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RULE_ID),
        //            RuleTypeId = (IDX_RULE_TYPE_ID < 0 || rdr.IsDBNull(IDX_RULE_TYPE_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RULE_TYPE_ID),
        //            Name = (IDX_RULE_NAME < 0 || rdr.IsDBNull(IDX_RULE_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RULE_NAME),
        //            CriteriaJson = (IDX_RULE_CRITERIA < 0 || rdr.IsDBNull(IDX_RULE_CRITERIA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RULE_CRITERIA),
        //            ProductCriteriaJson = (IDX_PRODUCT_CRITERIA < 0 || rdr.IsDBNull(IDX_PRODUCT_CRITERIA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRODUCT_CRITERIA),
        //            IsActive = (IDX_IS_ACTV < 0 || rdr.IsDBNull(IDX_IS_ACTV)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_ACTV),
        //            RuleStatus = (IDX_IS_APPROVED < 0 || rdr.IsDBNull(IDX_IS_APPROVED)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_APPROVED),
        //            StartDate = (IDX_EFF_FRM_DT < 0 || rdr.IsDBNull(IDX_EFF_FRM_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_EFF_FRM_DT),
        //            EndDate = (IDX_EFF_TO_DT < 0 || rdr.IsDBNull(IDX_EFF_TO_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_EFF_TO_DT),
        //            OwnerId = (IDX_OWNER_WWID < 0 || rdr.IsDBNull(IDX_OWNER_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OWNER_WWID),
        //            // FIX CHANGED BY DEFINATION
        //            ChangedBy = (IDX_CHG_BY < 0 || rdr.IsDBNull(IDX_CHG_BY)) ? default(System.Int32).ToString() : rdr.GetFieldValue<System.Int32>(IDX_CHG_BY).ToString(),
        //            ChangeDateTime = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM)
        //        });
        //    } // while

        //    return rtn;
        //}

        //public List<string> GetSuggestion(string strCategory, string strSearchKey)
        //{
        //    List<string> lstRtn = new List<string>();
        //    var cmd = new Procs.dbo.PR_MYDL_GET_RULE_SUGG
        //    {
        //        category = strCategory,
        //        key = strSearchKey
        //    };
        //    using (var rdr = DataAccess.ExecuteDataSet(cmd))
        //    {
        //        if (rdr.Tables.Count > 0)
        //        {
        //            lstRtn = (from result in rdr.Tables[0].AsEnumerable()
        //                      select result["result"].ToString()).ToList();
        //        }
        //    }
        //    return lstRtn;
        //}
        

        //public RuleConfig GetPriceRulesConfig(int iRuleTypeId)
        //{
        //    RuleConfig ruleConfig = new RuleConfig();
        //    ruleConfig.PriceRuleCriteria = GetPriceRuleCriteriaById(iRuleTypeId, PriceRuleAction.GET_BY_RULE_TYPE_ID);
        //    ruleConfig.AttributeSettings = new List<AttributeSettings>();
        //    ruleConfig.operatorSettings = new operatorSettings();
        //    var cmd = new Procs.dbo.PR_MYDL_GET_PRC_RULE_CONFIG
        //    {
        //        RULE_TYPE_ID = iRuleTypeId
        //    };
        //    using (var rdr = DataAccess.ExecuteDataSet(cmd))
        //    {
        //        if (rdr.Tables.Count > 0)
        //        {
        //            ruleConfig.operatorSettings.operators = (from result in rdr.Tables[0].AsEnumerable()
        //                                                     select new operators
        //                                                     {
        //                                                         id = (int)result["OPERATOR_ID"],
        //                                                         label = Convert.ToString(result["OPERATOR_TITLE"]),
        //                                                         @operator = Convert.ToString(result["OPERATOR_SYMBOL"]),
        //                                                         operCode = Convert.ToString(result["OPERATOR_CD"])
        //                                                     }).ToList();

        //            ruleConfig.operatorSettings.types = (from result in rdr.Tables[1].AsEnumerable()
        //                                                 select new types
        //                                                 {
        //                                                     id = (int)result["UI_TYPE_ID"],
        //                                                     type = Convert.ToString(result["UI_DATA_TYPE"]),
        //                                                     uiType = Convert.ToString(result["UI_NAME"])
        //                                                 }).ToList();

        //            Dictionary<int, List<int>> dicOperatorsMap = rdr.Tables[2].AsEnumerable().GroupBy(x => (int)x["UI_TYPE_ID"]).ToDictionary(x => x.Key, y => y.Select(z => (int)z["OPERATOR_ID"]).ToList());
        //            ruleConfig.operatorSettings.types2operator = (from result in dicOperatorsMap
        //                                                          select new types2operator
        //                                                          {
        //                                                              @operator = ruleConfig.operatorSettings.operators.Where(x => result.Value.Contains(x.id)).Select(x => x.@operator).ToList(),
        //                                                              type = ruleConfig.operatorSettings.types.Where(x => x.id == result.Key).First().type
        //                                                          }).ToList();

        //            ruleConfig.AttributeSettings = (from result in rdr.Tables[3].AsEnumerable()
        //                                            select new AttributeSettings
        //                                            {
        //                                                field = Convert.ToString(result["ATTR_CODE"]),
        //                                                title = Convert.ToString(result["TITLE"]),
        //                                                width = Convert.ToDouble(result["WIDTH"]),
        //                                                dimKey = result["DIM_KEY"] == DBNull.Value ? 0 : (int)result["DIM_KEY"],
        //                                                type = ruleConfig.operatorSettings.types.Where(x => x.id == (int)result["UI_TYPE_ID"]).First().type,
        //                                                lookupText = result["LKUP_TYPE_ID"] == DBNull.Value ? string.Empty : (result["LKUP_TEXT_KEY"] == DBNull.Value && (LookupType)result["LKUP_TYPE_ID"] != LookupType.URL ? "Text" : Convert.ToString(result["LKUP_TEXT_KEY"])),
        //                                                lookupValue = result["LKUP_TYPE_ID"] == DBNull.Value ? string.Empty : (result["LKUP_VALUE_KEY"] == DBNull.Value && (LookupType)result["LKUP_TYPE_ID"] != LookupType.URL ? "Value" : Convert.ToString(result["LKUP_VALUE_KEY"])),
        //                                                lookups = result["LKUP_TYPE_ID"] == DBNull.Value ? new List<DropDowns>() : ((LookupType)result["LKUP_TYPE_ID"] != LookupType.URL ? GetLookUps((LookupType)result["LKUP_TYPE_ID"], Convert.ToString(result["LKUP_DATA"])) : new List<DropDowns>()),
        //                                                lookupUrl = result["LKUP_TYPE_ID"] == DBNull.Value ? string.Empty : ((LookupType)result["LKUP_TYPE_ID"] == LookupType.URL ? Convert.ToString(result["LKUP_DATA"]) : string.Empty)
        //                                            }).ToList();

        //            ruleConfig.AttributeSettings.Where(x => x.type == "money").ToList().ForEach(x =>
        //            {
        //                x.format = "{0:c}";
        //                x.filterable = "moneyObjFilter";
        //                x.template = "#= gridUtils.tierDim(data, 'RATE', 'c') #";
        //            });
        //        }
        //    }
        //    return ruleConfig;
        //}

        //List<DropDowns> GetLookUps(LookupType lookupType, string strData)
        //{
        //    List<DropDowns> rtn = new List<DropDowns>();
        //    switch (lookupType)
        //    {
        //        case LookupType.COMMA_SEPARATED_DATA:
        //            {
        //                rtn = (from result in strData.Split(',')
        //                       select new DropDowns
        //                       {
        //                           Text = result.ToString(),
        //                           Value = result.ToString(),
        //                       }).ToList();
        //            }
        //            break;
        //    }
        //    return rtn;
        //}

        public List<PriceRuleCriteria> SavePriceRule(PriceRuleCriteria priceRuleCriteria, PriceRuleAction priceRuleAction)
        {
            var cmd = new Procs.dbo.PR_MYDL_SAVE_RULE
            {
                actn_nm = priceRuleAction.ToString("g"),
                rule_id = priceRuleCriteria.Id,
                rule_nm = priceRuleCriteria.Name,
                owner_wwid = priceRuleCriteria.OwnerId,
                is_normal_rule = priceRuleCriteria.IsNormalRule,
                is_actv = priceRuleCriteria.IsActive,
                eff_frm_dt = priceRuleCriteria.StartDate,
                eff_to_dt = priceRuleCriteria.EndDate,
                is_appvd = priceRuleCriteria.RuleStatus,
                notes = priceRuleCriteria.Notes == null ? string.Empty : priceRuleCriteria.Notes,
                rule_criteria = priceRuleCriteria.CriteriaJson,
                rule_sql_criteria = priceRuleCriteria.CriteriaSql,
                product_criteria = priceRuleCriteria.ProductCriteriaJson,
                product_sql_criteria = priceRuleCriteria.ProductCriteriaSql,
                usr_id = OpUserStack.MyOpUserToken.Usr.WWID
            };

            List<PriceRuleCriteria> rtn = new List<PriceRuleCriteria>();

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                // Go and add this to templates classes if needed (MIKE)
                int IDX_RULE_ID = DB.GetReaderOrdinal(rdr, "RULE_ID");
                int IDX_RULE_NAME = DB.GetReaderOrdinal(rdr, "RULE_NAME");
                int IDX_NOTES = DB.GetReaderOrdinal(rdr, "NOTES");
                int IDX_RULE_CRITERIA = DB.GetReaderOrdinal(rdr, "RULE_CRITERIA");
                int IDX_PRODUCT_CRITERIA = DB.GetReaderOrdinal(rdr, "PRODUCT_CRITERIA");
                int IDX_IS_ACTV = DB.GetReaderOrdinal(rdr, "IS_ACTV");
                int IDX_IS_NORMAL_RULE = DB.GetReaderOrdinal(rdr, "IS_NORMAL_RULE");
                int IDX_IS_APPROVED = DB.GetReaderOrdinal(rdr, "IS_APPROVED");
                int IDX_EFF_FRM_DT = DB.GetReaderOrdinal(rdr, "EFF_FRM_DT");
                int IDX_EFF_TO_DT = DB.GetReaderOrdinal(rdr, "EFF_TO_DT");
                int IDX_OWNER_WWID = DB.GetReaderOrdinal(rdr, "OWNER_WWID");
                int IDX_CHG_BY = DB.GetReaderOrdinal(rdr, "CHG_BY");
                int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");

                while (rdr.Read())
                {
                    int j = 0;
                    rtn.Add(new PriceRuleCriteria
                    {
                        Id = (IDX_RULE_ID < 0 || rdr.IsDBNull(IDX_RULE_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RULE_ID),
                        Name = (IDX_RULE_NAME < 0 || rdr.IsDBNull(IDX_RULE_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RULE_NAME),
                        Notes = (IDX_NOTES < 0 || rdr.IsDBNull(IDX_NOTES)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTES),
                        CriteriaJson = (IDX_RULE_CRITERIA < 0 || rdr.IsDBNull(IDX_RULE_CRITERIA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RULE_CRITERIA),
                        ProductCriteriaJson = (IDX_PRODUCT_CRITERIA < 0 || rdr.IsDBNull(IDX_PRODUCT_CRITERIA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRODUCT_CRITERIA),
                        IsActive = (IDX_IS_ACTV < 0 || rdr.IsDBNull(IDX_IS_ACTV)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_ACTV),
                        IsNormalRule = (IDX_IS_NORMAL_RULE < 0 || rdr.IsDBNull(IDX_IS_NORMAL_RULE)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_NORMAL_RULE),
                        RuleStatus = (IDX_IS_APPROVED < 0 || rdr.IsDBNull(IDX_IS_APPROVED)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_APPROVED),
                        StartDate = (IDX_EFF_FRM_DT < 0 || rdr.IsDBNull(IDX_EFF_FRM_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_EFF_FRM_DT),
                        EndDate = (IDX_EFF_TO_DT < 0 || rdr.IsDBNull(IDX_EFF_TO_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_EFF_TO_DT),
                        OwnerId = (IDX_OWNER_WWID < 0 || rdr.IsDBNull(IDX_OWNER_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OWNER_WWID),
                        // FIX CHANGED BY DEFINATION
                        ChangedBy = (IDX_CHG_BY < 0 || rdr.IsDBNull(IDX_CHG_BY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHG_BY),
                        ChangeDateTime = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM)
                    });
                } // while
            }

            return rtn;
        }
    }
}
