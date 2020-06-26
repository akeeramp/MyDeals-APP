using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using System.Data.SqlClient;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System.Linq;

namespace Intel.MyDeals.DataLibrary
{
    public class ApprovalRules
    {
        public PriceRuleCriteria UpdatePriceRule(PriceRuleCriteria priceRuleCriteria, PriceRuleAction priceRuleAction)
        {
            bool isApproved = priceRuleAction == PriceRuleAction.UPDATE_STAGE_IND ? priceRuleCriteria.RuleStage : priceRuleCriteria.IsAutomationIncluded == false;
            if (isApproved == false) priceRuleCriteria.IsActive = false; // If IsApproved is unset, make the rule inactive

            if (!IsDuplicateTitle(priceRuleCriteria.Id, priceRuleCriteria.Name == null ? string.Empty : priceRuleCriteria.Name) || (priceRuleAction != PriceRuleAction.SUBMIT && priceRuleAction != PriceRuleAction.SAVE_AS_DRAFT))
            {
                //Assign dummy value to avoid overflow
                if (priceRuleAction != PriceRuleAction.SAVE_AS_DRAFT && priceRuleAction != PriceRuleAction.SUBMIT)
                {
                    priceRuleCriteria.StartDate = DateTime.Now;
                    priceRuleCriteria.EndDate = DateTime.Now;
                }

                var cmd = new Procs.dbo.PR_MYDL_UPD_PRC_RULE
                {
                    rule_sid = priceRuleCriteria.Id,
                    rule_nm = priceRuleCriteria.Name == null ? string.Empty : priceRuleCriteria.Name.Trim(),
                    strt_dt = priceRuleCriteria.StartDate,
                    end_dt = priceRuleCriteria.EndDate,
                    notes = priceRuleCriteria.Notes == null ? string.Empty : priceRuleCriteria.Notes,
                    rule_cri = priceRuleCriteria.CriteriaJson,
                    rule_sql_cri = priceRuleCriteria.CriteriaSql,
                    prd_cri = priceRuleCriteria.ProductCriteriaJson,
                    prd_sql_cri = priceRuleCriteria.ProductCriteriaSql,
                    is_auto_incl = priceRuleCriteria.IsAutomationIncluded,
                    is_aprv = isApproved,
                    actv_ind = priceRuleCriteria.IsActive,
                    usr_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                    ownr_wwid = priceRuleCriteria.OwnerId,
                    actn_nm = priceRuleAction.ToString("g"),
                    rule_desc = priceRuleCriteria.RuleDescription,
                    prd_desc = priceRuleCriteria.ProductDescription,
                    rule_ext_pro = priceRuleCriteria.CriteriaXml
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
                priceRuleCriteria.ChangeDateTime = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.UtcNow, "Pacific Standard Time");
                priceRuleCriteria.ChangeDateTimeFormat = priceRuleCriteria.ChangeDateTime.ToString("MM/dd/yyyy h:mm tt");
                priceRuleCriteria.ChangedBy = string.Concat(OpUserStack.MyOpUserToken.Usr.LastName, ", ", OpUserStack.MyOpUserToken.Usr.FirstName);
                priceRuleCriteria.RuleStage = isApproved;
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

        public List<PriceRuleCriteria> GetPriceRuleCriteria(int id, PriceRuleAction priceRuleAction)
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

        public List<RulesSimulationResults> GetRuleSimulationsResults(bool runAsApprovalModeFlag, List<int> RulesToRun, List<int> DealsToTestAgainst)
        {
            //OpLog.Log("Simulate Approval Rules");
            var ret = new List<RulesSimulationResults>();
            var cmd = new Procs.dbo.PR_MYDL_EXEC_APRV_RULES
            {
                in_aprv_mode = runAsApprovalModeFlag,
                in_deal_ids = new type_int_list(DealsToTestAgainst.ToArray()),
                in_rule_ids = new type_int_list(RulesToRun.ToArray())
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_APRV_PRCSS_FLG = DB.GetReaderOrdinal(rdr, "APRV_PRCSS_FLG");
                int IDX_APRV_RULES = DB.GetReaderOrdinal(rdr, "APRV_RULES");
                int IDX_EXCLD_RULES = DB.GetReaderOrdinal(rdr, "EXCLD_RULES");
                int IDX_OWNER_EMP_WWID = DB.GetReaderOrdinal(rdr, "OWNER_EMP_WWID");
                int IDX_WIP_DEAL_SID = DB.GetReaderOrdinal(rdr, "WIP_DEAL_SID");

                while (rdr.Read())
                {
                    ret.Add(new RulesSimulationResults
                    {
                        APRV_PRCSS_FLG = (IDX_APRV_PRCSS_FLG < 0 || rdr.IsDBNull(IDX_APRV_PRCSS_FLG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APRV_PRCSS_FLG),
                        APRV_RULES = (IDX_APRV_RULES < 0 || rdr.IsDBNull(IDX_APRV_RULES)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APRV_RULES),
                        EXCLD_RULES = (IDX_EXCLD_RULES < 0 || rdr.IsDBNull(IDX_EXCLD_RULES)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EXCLD_RULES),
                        OWNER_EMP_WWID = (IDX_OWNER_EMP_WWID < 0 || rdr.IsDBNull(IDX_OWNER_EMP_WWID)) ? default(System.Int32) : Convert.ToInt32(rdr.GetFieldValue<System.String>(IDX_OWNER_EMP_WWID)),
                        WIP_DEAL_SID = (IDX_WIP_DEAL_SID < 0 || rdr.IsDBNull(IDX_WIP_DEAL_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WIP_DEAL_SID)
                    });
                } // while
            }

            return ret;
        }

        public List<string> GetValidProducts(List<string> lstProducts)
        {
            lstProducts.ForEach(x => x = x.Trim().ToLower());
            lstProducts.RemoveAll(x => x == string.Empty);
            List<string> lstValidProducts = new List<string>();
            Procs.dbo.PR_MYDL_PRD_VLD cmd = new Procs.dbo.PR_MYDL_PRD_VLD()
            {
                in_prd_nm_list = new type_list(lstProducts.ToArray())
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_PRD_NM = DB.GetReaderOrdinal(rdr, "PRD_NM");

                while (rdr.Read())
                {
                    lstValidProducts.Add((IDX_PRD_NM < 0 || rdr.IsDBNull(IDX_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_NM));
                } // while
            }

            return lstValidProducts.Distinct().ToList();
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
            int IDX_PRD_CRITERIA = DB.GetReaderOrdinal(rdr, "PRD_CRI");
            int IDX_IS_ACTV = DB.GetReaderOrdinal(rdr, "ACTV_IND");
            int IDX_IS_NORMAL_RULE = DB.GetReaderOrdinal(rdr, "IS_AUTO_INCL");
            int IDX_IS_APPROVED = DB.GetReaderOrdinal(rdr, "IS_APRV");
            int IDX_EFF_FRM_DT = DB.GetReaderOrdinal(rdr, "STRT_DT");
            int IDX_EFF_TO_DT = DB.GetReaderOrdinal(rdr, "END_DT");
            int IDX_OWNER_WWID = DB.GetReaderOrdinal(rdr, "OWNR_EMP_WWID");
            int IDX_CHG_BY = DB.GetReaderOrdinal(rdr, "CHG_EMP_NM");
            int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
            int IDX_RULE_DESC = DB.GetReaderOrdinal(rdr, "RULE_DESC");
            int IDX_PRD_DESC = DB.GetReaderOrdinal(rdr, "PRD_DESC");

            while (rdr.Read())
            {
                rtn.Add(new PriceRuleCriteria
                {
                    Id = (IDX_RULE_ID < 0 || rdr.IsDBNull(IDX_RULE_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RULE_ID),
                    Name = (IDX_RULE_NAME < 0 || rdr.IsDBNull(IDX_RULE_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RULE_NAME),
                    OwnerName = (IDX_OWNER_NAME < 0 || rdr.IsDBNull(IDX_OWNER_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OWNER_NAME),
                    Notes = (IDX_NOTES < 0 || rdr.IsDBNull(IDX_NOTES)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NOTES),
                    CriteriaJson = (IDX_RULE_CRITERIA < 0 || rdr.IsDBNull(IDX_RULE_CRITERIA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RULE_CRITERIA),
                    ProductCriteriaJson = (IDX_PRD_CRITERIA < 0 || rdr.IsDBNull(IDX_PRD_CRITERIA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CRITERIA),
                    IsActive = (IDX_IS_ACTV < 0 || rdr.IsDBNull(IDX_IS_ACTV)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_ACTV),
                    IsAutomationIncluded = (IDX_IS_NORMAL_RULE < 0 || rdr.IsDBNull(IDX_IS_NORMAL_RULE)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_NORMAL_RULE),
                    RuleStage = (IDX_IS_APPROVED < 0 || rdr.IsDBNull(IDX_IS_APPROVED)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_APPROVED),
                    StartDate = (IDX_EFF_FRM_DT < 0 || rdr.IsDBNull(IDX_EFF_FRM_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_EFF_FRM_DT),
                    EndDate = (IDX_EFF_TO_DT < 0 || rdr.IsDBNull(IDX_EFF_TO_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_EFF_TO_DT),
                    OwnerId = (IDX_OWNER_WWID < 0 || rdr.IsDBNull(IDX_OWNER_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OWNER_WWID),
                    // FIX CHANGED BY DEFINATION
                    ChangedBy = (IDX_CHG_BY < 0 || rdr.IsDBNull(IDX_CHG_BY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHG_BY),
                    ChangeDateTime = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                    RuleDescription = (IDX_RULE_DESC < 0 || rdr.IsDBNull(IDX_RULE_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RULE_DESC),
                    ProductDescription = (IDX_PRD_DESC < 0 || rdr.IsDBNull(IDX_PRD_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_DESC),
                });
            } // while
            rtn.ForEach(x =>
            {
                x.ChangeDateTimeFormat = x.ChangeDateTime.ToString("MM/dd/yyyy h:mm tt");
                x.RuleStatusLabel = x.IsActive ? "Active" : "Inactive";
                x.RuleStageLabel = x.RuleStage ? "Approved" : "Pending Approval";
                x.RuleAutomationLabel = x.IsAutomationIncluded ? "Auto Approval" : "Exclusion Rule";
            });

            return rtn;
        }

        public RuleConfig GetPriceRulesConfig()
        {
            RuleConfig ruleConfig = new RuleConfig();
            ruleConfig.CurrentUserWWID = OpUserStack.MyOpUserToken.Usr.WWID;
            ruleConfig.CurrentUserName = string.Concat(OpUserStack.MyOpUserToken.Usr.LastName, ", ", OpUserStack.MyOpUserToken.Usr.FirstName);
            ruleConfig.DefaultEndDate = DateTime.Now.AddYears(10);
            return ruleConfig;
        }
        public List<string> GetSuggestion(string strCategory, string strSearchKey)
        {
            List<string> lstRtn = new List<string>();
            var cmd = new Procs.dbo.PR_MYDL_GET_RULE_SUGG
            {
                category = strCategory,
                key = strSearchKey
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_PRD_NM = DB.GetReaderOrdinal(rdr, "result");

                while (rdr.Read())
                {
                    lstRtn.Add((IDX_PRD_NM < 0 || rdr.IsDBNull(IDX_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_NM));
                } // while
            }
            return lstRtn;
        }
    }
}