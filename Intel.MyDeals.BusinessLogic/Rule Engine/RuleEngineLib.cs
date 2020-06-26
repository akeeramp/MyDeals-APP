using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.Entities;
using Intel.MyDeals.BusinessLogic.Rule_Engine;
using Newtonsoft.Json;
using System;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class RuleEngineLib : IRuleEngineLib
    {
        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public RuleEngineLib()
        {
        }

        public List<MyOpRule> GetBusinessRules()
        {
            //List<MyOpRule> AtrbRules
            return MyRulesConfiguration.AttrbRules;
        }

        public RuleConfig GetPriceRulesConfig()
        {
            var ruleConfig = new ApprovalRules().GetPriceRulesConfig();
            ruleConfig.DA_Users = new EmployeeDataLib().GetUsrProfileRole().Where(x => x.ROLE_NM == "DA").OrderBy(x => x.NAME).ToList();
            return ruleConfig;
        }

        public List<string> GetSuggestion(string strCategory, string strSearchKey)
        {
            return new ApprovalRules().GetSuggestion(strCategory, strSearchKey);
        }

        public List<PriceRuleCriteria> GetPriceRules(int id, PriceRuleAction priceRuleAction)
        {
            List<PriceRuleCriteria> lstPriceRuleCriteria = new List<PriceRuleCriteria>();
            if (id == 0 && priceRuleAction == PriceRuleAction.GET_BY_RULE_ID)
            {
                var ruleConfig = new ApprovalRules().GetPriceRulesConfig();
                lstPriceRuleCriteria.Add(new PriceRuleCriteria
                {
                    Id = 0,
                    Name = string.Empty,
                    OwnerName = ruleConfig.CurrentUserName,
                    Notes = string.Empty,
                    CriteriaJson = "{\"Rules\":[{\"type\":\"singleselect_read_only\",\"field\":\"OBJ_SET_TYPE_CD\",\"operator\":\"=\",\"value\":\"ECAP\",\"values\":[],\"valueType\":null}],\"BlanketDiscount\":[{\"type\":null,\"field\":null,\"operator\":null,\"value\":\"\",\"values\":null,\"valueType\":{\"text\":null,\"value\":\"%\"}},{\"type\":null,\"field\":null,\"operator\":null,\"value\":\"\",\"values\":null,\"valueType\":{\"text\":null,\"value\":\"$\"}}]}",
                    ProductCriteriaJson = "[]",
                    IsActive = false,
                    IsAutomationIncluded = true,
                    RuleStage = false,
                    StartDate = DateTime.Now,
                    EndDate = ruleConfig.DefaultEndDate,
                    OwnerId = ruleConfig.CurrentUserWWID,
                    ChangedBy = ruleConfig.CurrentUserName,
                    ChangeDateTime = DateTime.Now,
                    RuleDescription = string.Empty,
                    ProductDescription = string.Empty,
                });
            }
            else
            {
                lstPriceRuleCriteria = new ApprovalRules().GetPriceRuleCriteria(id, priceRuleAction);
            }

            if (priceRuleAction == PriceRuleAction.GET_BY_RULE_ID)
            {
                lstPriceRuleCriteria.ForEach(x =>
                {
                    x.Criterias = JsonConvert.DeserializeObject<Criteria>(x.CriteriaJson);
                    x.ProductCriteria = JsonConvert.DeserializeObject<List<Products>>(x.ProductCriteriaJson);
                    x.Criterias.BlanketDiscount.Where(y => y.valueType.value == "%" && y.value != string.Empty && !(Convert.ToInt32(y.value) <= 70)).ToList().ForEach(z => z.value = "70");
                });
            }
            return lstPriceRuleCriteria;
        }

        public List<RulesSimulationResults> RunRuleSimulations(List<int[]> dataList) // dataList list has 2 items, first is rules list array, second is deals list array
        {
            List<int> rulesToRun = new List<int>(dataList[0]);
            List<int> dealsToTestAgainst = new List<int>(dataList[1]);
            // First parameter = Run this as a simulation, not an approval.  Might pass in Run at later time for admin page.
            return new ApprovalRules().GetRuleSimulationsResults(false, rulesToRun, dealsToTestAgainst);
        }

        public List<string> ValidateProducts(List<string> lstProducts)
        {
            //List<Product> lstProductFromCache = new ProductsLib().GetProducts(true);
            return new ApprovalRules().GetValidProducts(lstProducts);
        }

        public PriceRuleCriteria UpdatePriceRule(PriceRuleCriteria priceRuleCriteria, PriceRuleAction priceRuleAction, Dictionary<int, string> dicCustomerName)
        {
            if (priceRuleAction == PriceRuleAction.SAVE_AS_DRAFT || priceRuleAction == PriceRuleAction.SUBMIT)
            {
                string[] lstAllowedRole = new string[] { "GA", "FSE" };
                priceRuleCriteria.Criterias.BlanketDiscount.Where(y => y.valueType.value == "%" && y.value != string.Empty && !(Convert.ToInt32(y.value) <= 70)).ToList().ForEach(z => z.value = "70");
                //Merging into single attribute
                string[] strXmlRulesAttributes = priceRuleCriteria.Criterias.Rules.Where(x => x.type == "list" && x.subType == "xml").Select(x => x.field).Distinct().ToArray();
                if (strXmlRulesAttributes.Length > 0)
                {
                    List<rule> lstRuleMerge = new List<rule>();
                    foreach (string strXmlRulesAttribute in strXmlRulesAttributes)
                    {
                        List<rule> lstTemp = priceRuleCriteria.Criterias.Rules.Where(x => x.field == strXmlRulesAttribute).ToList();
                        lstTemp.First().values = string.Join(",", lstTemp.Select(x => string.Join(",", x.values))).Split(',').Distinct().OrderBy(x => x).ToList();
                        lstRuleMerge.Add(lstTemp.First());
                    }
                    priceRuleCriteria.Criterias.Rules.RemoveAll(x => strXmlRulesAttributes.Contains(x.field));
                    priceRuleCriteria.Criterias.Rules.AddRange(lstRuleMerge);
                }
                Dictionary<int, string> dicEmployeeName = priceRuleCriteria.Criterias.Rules.Any(x => x.field == "CRE_EMP_NAME") ? new EmployeesLib().GetUsrProfileRoleByRoleCode(lstAllowedRole).ToDictionary(x => x.EMP_WWID, y => y.NAME) : new Dictionary<int, string>();
                priceRuleCriteria.CriteriaJson = JsonConvert.SerializeObject(priceRuleCriteria.Criterias);
                priceRuleCriteria.ProductCriteriaJson = JsonConvert.SerializeObject(priceRuleCriteria.ProductCriteria);
                using (RuleExpressions ruleExpressions = new RuleExpressions())
                {
                    Dictionary<ExpressionType, string> dicExpressions = ruleExpressions.GetExpressions(priceRuleCriteria, dicCustomerName, dicEmployeeName);
                    priceRuleCriteria.CriteriaSql = dicExpressions[ExpressionType.RuleSql];
                    priceRuleCriteria.ProductCriteriaSql = dicExpressions[ExpressionType.ProductSql];
                    priceRuleCriteria.RuleDescription = dicExpressions[ExpressionType.RuleDescription];
                    priceRuleCriteria.ProductDescription = dicExpressions[ExpressionType.ProductDescription];
                    priceRuleCriteria.CriteriaXml = dicExpressions[ExpressionType.RuleXml];
                }
            }
            return new ApprovalRules().UpdatePriceRule(priceRuleCriteria, priceRuleAction);
        }

        public bool IsDuplicateTitle(int iRuleSid, string strTitle)
        {
            return new ApprovalRules().IsDuplicateTitle(iRuleSid, strTitle);
        }

        public int DeletePriceRule(int iRuleSid)
        {
            return new ApprovalRules().DeletePriceRule(iRuleSid);
        }

        public int CopyPriceRule(int iRuleSid)
        {
            return new ApprovalRules().CopyPriceRule(iRuleSid);
        }
    }
}