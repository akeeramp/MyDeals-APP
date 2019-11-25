using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using System.Data.SqlClient;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class ApprovalRules
    {
        public PriceRuleCriteria UpdatePriceRule(PriceRuleCriteria priceRuleCriteria, bool isPublish)
        {
            if (!IsDuplicateTitle(priceRuleCriteria.Id, priceRuleCriteria.Name))
            {
                var cmd = new Procs.dbo.PR_MYDL_UPD_PRC_RULE
                {
                    @rule_sid = priceRuleCriteria.Id,
                    @rule_nm = priceRuleCriteria.Name.Trim(),
                    @ownr_wwid = priceRuleCriteria.OwnerId,
                    @strt_dt = priceRuleCriteria.StartDate,
                    @end_dt = priceRuleCriteria.EndDate,
                    @notes = priceRuleCriteria.Notes == null ? string.Empty : priceRuleCriteria.Notes,
                    @rule_cri = priceRuleCriteria.CriteriaJson,
                    @rule_sql_cri = priceRuleCriteria.CriteriaSql,
                    @prd_cri = null,
                    @prd_sql_cri = null,
                    @is_auto_incl = priceRuleCriteria.IsAutomationIncluded,
                    @is_aprv = priceRuleCriteria.RuleStage,
                    @actv_ind = priceRuleCriteria.IsActive,
                    @usr_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                    @is_publ = isPublish
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_RULE_SID = DB.GetReaderOrdinal(rdr, "RULE_SID");

                    while (rdr.Read())
                    {
                        priceRuleCriteria.Id = (IDX_RULE_SID < 0 || rdr.IsDBNull(IDX_RULE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RULE_SID);
                    } // while
                }
            }

            if (priceRuleCriteria.Id > 0)
            {
                priceRuleCriteria.ChangeDateTimeFormat = DateTime.UtcNow.ToString("MM/dd/yyyy HH:mm");
                priceRuleCriteria.ChangedBy = string.Concat(OpUserStack.MyOpUserToken.Usr.LastName, ", ", OpUserStack.MyOpUserToken.Usr.FirstName);
            }
            return priceRuleCriteria;
        }

        public int DeletePriceRule(int iRuleSid)
        {
            var cmd = new Procs.dbo.PR_MYDL_DEL_PRC_RULE
            {
                rule_sid = iRuleSid
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_RULE_SID = DB.GetReaderOrdinal(rdr, "RULE_SID");

                while (rdr.Read())
                {
                    iRuleSid = (IDX_RULE_SID < 0 || rdr.IsDBNull(IDX_RULE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RULE_SID);
                } // while
            }
            return iRuleSid;
        }

        public int CopyPriceRule(int iRuleSid)
        {
            var cmd = new Procs.dbo.PR_MYDL_COPY_PRC_RULE
            {
                rule_sid = iRuleSid,
                usr_wwid = OpUserStack.MyOpUserToken.Usr.WWID
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_RULE_SID = DB.GetReaderOrdinal(rdr, "RULE_SID");

                while (rdr.Read())
                {
                    iRuleSid = (IDX_RULE_SID < 0 || rdr.IsDBNull(IDX_RULE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RULE_SID);
                } // while
            }
            return iRuleSid;
        }

        public bool IsDuplicateTitle(int iRuleSid, string strTitle)
        {
            using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_PRC_RULE_VLD
            {
                rule_sid = iRuleSid,
                rule_nm = strTitle.Trim()
            }))
            {
                if (rdr.HasRows) return true;
            }
            return false;
        }

        public List<PriceRuleCriteria> GetPriceRuleCriteriaById(int id, PriceRuleAction priceRuleAction)
        {
            var cmd = new Procs.dbo.PR_MYDL_GET_PRC_RULE
            {
                actn_nm = priceRuleAction.ToString("g"),
                rule_sid = id
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                return GetPriceRuleCriteria(rdr);
            }
        }

        List<PriceRuleCriteria> GetPriceRuleCriteria(SqlDataReader rdr)
        {
            List<PriceRuleCriteria> rtn = new List<PriceRuleCriteria>();

            // Go and add this to templates classes if needed (MIKE)
            int IDX_RULE_ID = DB.GetReaderOrdinal(rdr, "RULE_SID");
            int IDX_RULE_NAME = DB.GetReaderOrdinal(rdr, "RULE_NM");
            int IDX_OWNER_NAME = DB.GetReaderOrdinal(rdr, "OWNR_EMP_NM");
            int IDX_NOTES = DB.GetReaderOrdinal(rdr, "NOTES");
            int IDX_RULE_CRITERIA = DB.GetReaderOrdinal(rdr, "RULE_CRI");
            int IDX_IS_ACTV = DB.GetReaderOrdinal(rdr, "ACTV_IND");
            int IDX_IS_NORMAL_RULE = DB.GetReaderOrdinal(rdr, "IS_AUTO_INCL");
            int IDX_IS_APPROVED = DB.GetReaderOrdinal(rdr, "IS_APRV");
            int IDX_EFF_FRM_DT = DB.GetReaderOrdinal(rdr, "STRT_DT");
            int IDX_EFF_TO_DT = DB.GetReaderOrdinal(rdr, "END_DT");
            int IDX_OWNER_WWID = DB.GetReaderOrdinal(rdr, "OWNR_EMP_WWID");
            int IDX_CHG_BY = DB.GetReaderOrdinal(rdr, "CHG_EMP_NM");
            int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");

            while (rdr.Read())
            {
                int j = 0;
                rtn.Add(new PriceRuleCriteria
                {
                    Id = (IDX_RULE_ID < 0 || rdr.IsDBNull(IDX_RULE_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RULE_ID),
                    Name = (IDX_RULE_NAME < 0 || rdr.IsDBNull(IDX_RULE_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RULE_NAME),
                    OwnerName = (IDX_OWNER_NAME < 0 || rdr.IsDBNull(IDX_OWNER_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OWNER_NAME),
                    Notes = (IDX_NOTES < 0 || rdr.IsDBNull(IDX_NOTES)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTES),
                    CriteriaJson = (IDX_RULE_CRITERIA < 0 || rdr.IsDBNull(IDX_RULE_CRITERIA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RULE_CRITERIA),
                    IsActive = (IDX_IS_ACTV < 0 || rdr.IsDBNull(IDX_IS_ACTV)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_ACTV),
                    IsAutomationIncluded = (IDX_IS_NORMAL_RULE < 0 || rdr.IsDBNull(IDX_IS_NORMAL_RULE)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_NORMAL_RULE),
                    RuleStage = (IDX_IS_APPROVED < 0 || rdr.IsDBNull(IDX_IS_APPROVED)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_APPROVED),
                    StartDate = (IDX_EFF_FRM_DT < 0 || rdr.IsDBNull(IDX_EFF_FRM_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_EFF_FRM_DT),
                    EndDate = (IDX_EFF_TO_DT < 0 || rdr.IsDBNull(IDX_EFF_TO_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_EFF_TO_DT),
                    OwnerId = (IDX_OWNER_WWID < 0 || rdr.IsDBNull(IDX_OWNER_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OWNER_WWID),
                    // FIX CHANGED BY DEFINATION
                    ChangedBy = (IDX_CHG_BY < 0 || rdr.IsDBNull(IDX_CHG_BY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHG_BY),
                    ChangeDateTime = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM)
                });
            } // while
            rtn.ForEach(x => x.ChangeDateTimeFormat = x.ChangeDateTime.ToString("MM/dd/yyyy HH:mm"));
            return rtn;
        }

        List<int> lstApprovers = new List<int> { 11500950, 10548414 };
        public RuleConfig GetPriceRulesConfig()
        {
            RuleConfig ruleConfig = new RuleConfig();
            ruleConfig.CurrentUserWWID = OpUserStack.MyOpUserToken.Usr.WWID;
            ruleConfig.CurrentUserName = string.Concat(OpUserStack.MyOpUserToken.Usr.LastName, ", ", OpUserStack.MyOpUserToken.Usr.FirstName);
            ruleConfig.IsElligibleForApproval = lstApprovers.Contains(OpUserStack.MyOpUserToken.Usr.WWID);
            //ruleConfig.PriceRuleCriteria = GetPriceRuleCriteriaById(iRuleTypeId, PriceRuleAction.GET_BY_RULE_TYPE_ID);
            //ruleConfig.AttributeSettings = new List<AttributeSettings>();
            //ruleConfig.operatorSettings = new operatorSettings();
            //var cmd = new Procs.dbo.PR_MYDL_GET_PRC_RULE_CONFIG
            //{
            //    RULE_TYPE_ID = iRuleTypeId
            //};
            //using (var rdr = DataAccess.ExecuteDataSet(cmd))
            //{
            //    if (rdr.Tables.Count > 0)
            //    {
            //        ruleConfig.operatorSettings.operators = (from result in rdr.Tables[0].AsEnumerable()
            //                                                 select new operators
            //                                                 {
            //                                                     id = (int)result["OPERATOR_ID"],
            //                                                     label = Convert.ToString(result["OPERATOR_TITLE"]),
            //                                                     @operator = Convert.ToString(result["OPERATOR_SYMBOL"]),
            //                                                     operCode = Convert.ToString(result["OPERATOR_CD"])
            //                                                 }).ToList();

            //        ruleConfig.operatorSettings.types = (from result in rdr.Tables[1].AsEnumerable()
            //                                             select new types
            //                                             {
            //                                                 id = (int)result["UI_TYPE_ID"],
            //                                                 type = Convert.ToString(result["UI_DATA_TYPE"]),
            //                                                 uiType = Convert.ToString(result["UI_NAME"])
            //                                             }).ToList();

            //        Dictionary<int, List<int>> dicOperatorsMap = rdr.Tables[2].AsEnumerable().GroupBy(x => (int)x["UI_TYPE_ID"]).ToDictionary(x => x.Key, y => y.Select(z => (int)z["OPERATOR_ID"]).ToList());
            //        ruleConfig.operatorSettings.types2operator = (from result in dicOperatorsMap
            //                                                      select new types2operator
            //                                                      {
            //                                                          @operator = ruleConfig.operatorSettings.operators.Where(x => result.Value.Contains(x.id)).Select(x => x.@operator).ToList(),
            //                                                          type = ruleConfig.operatorSettings.types.Where(x => x.id == result.Key).First().type
            //                                                      }).ToList();

            //        ruleConfig.AttributeSettings = (from result in rdr.Tables[3].AsEnumerable()
            //                                        select new AttributeSettings
            //                                        {
            //                                            field = Convert.ToString(result["ATTR_CODE"]),
            //                                            title = Convert.ToString(result["TITLE"]),
            //                                            width = Convert.ToDouble(result["WIDTH"]),
            //                                            dimKey = result["DIM_KEY"] == DBNull.Value ? 0 : (int)result["DIM_KEY"],
            //                                            type = ruleConfig.operatorSettings.types.Where(x => x.id == (int)result["UI_TYPE_ID"]).First().type,
            //                                            lookupText = result["LKUP_TYPE_ID"] == DBNull.Value ? string.Empty : (result["LKUP_TEXT_KEY"] == DBNull.Value && (LookupType)result["LKUP_TYPE_ID"] != LookupType.URL ? "Text" : Convert.ToString(result["LKUP_TEXT_KEY"])),
            //                                            lookupValue = result["LKUP_TYPE_ID"] == DBNull.Value ? string.Empty : (result["LKUP_VALUE_KEY"] == DBNull.Value && (LookupType)result["LKUP_TYPE_ID"] != LookupType.URL ? "Value" : Convert.ToString(result["LKUP_VALUE_KEY"])),
            //                                            lookups = result["LKUP_TYPE_ID"] == DBNull.Value ? new List<DropDowns>() : ((LookupType)result["LKUP_TYPE_ID"] != LookupType.URL ? GetLookUps((LookupType)result["LKUP_TYPE_ID"], Convert.ToString(result["LKUP_DATA"])) : new List<DropDowns>()),
            //                                            lookupUrl = result["LKUP_TYPE_ID"] == DBNull.Value ? string.Empty : ((LookupType)result["LKUP_TYPE_ID"] == LookupType.URL ? Convert.ToString(result["LKUP_DATA"]) : string.Empty)
            //                                        }).ToList();

            //        ruleConfig.AttributeSettings.Where(x => x.type == "money").ToList().ForEach(x =>
            //        {
            //            x.format = "{0:c}";
            //            x.filterable = "moneyObjFilter";
            //            x.template = "#= gridUtils.tierDim(data, 'RATE', 'c') #";
            //        });
            //    }
            //}
            return ruleConfig;
        }

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

    }
}
