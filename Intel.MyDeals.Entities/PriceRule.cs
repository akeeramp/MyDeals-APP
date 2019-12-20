using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class RuleConfig
    {
        public List<UsrProfileRole> DA_Users { get; set; }
        public int CurrentUserWWID { get; set; }
        public DateTime DefaultEndDate { get; set; }
        public string CurrentUserName { get; set; }
        public operatorSettings operatorSettings { get; set; }
        public List<AttributeSettings> AttributeSettings { get; set; }

        public List<PriceRuleCriteria> PriceRuleCriteria { get; set; }
    }

    public class operatorSettings
    {
        public List<operators> operators { get; set; }
        public List<types> types { get; set; }
        public List<types2operator> types2operator { get; set; }
    }

    public enum LookupType
    {
        JSON_DATA = 1,
        COMMA_SEPARATED_DATA = 2,
        XML_DATA = 3,
        SQL_QUERY = 4,
        URL = 5
    }

    public class DropDowns
    {
        public string Value { get; set; }
        public string Text { get; set; }
    }

    public class types2operator
    {
        public string type { get; set; }
        public List<string> @operator { get; set; }

    }

    public class operators
    {
        public int id { get; set; }
        public string @operator { get; set; }
        public string operCode { get; set; }
        public string label { get; set; }
    }

    public class types
    {
        public int id { get; set; }
        public string type { get; set; }
        public string uiType { get; set; }
    }

    public class AttributeSettings
    {
        public string field { get; set; }
        public string title { get; set; }
        public string type { get; set; }
        public double width { get; set; }
        public string filterable { get; set; }
        public string lookupText { get; set; }
        public string lookupValue { get; set; }
        public string lookupUrl { get; set; }
        public List<DropDowns> lookups { get; set; }
        public string template { get; set; }
        public int dimKey { get; set; }
        public string format { get; set; }
    }


    public class PriceRuleData
    {
        public int ContractId { get; set; }
        public int PricingStrategyId { get; set; }
        public int DealId { get; set; }
    }

    public enum PriceRuleAction
    {
        NONE = 0,
        CREATE,
        UPDATE,
        COPY,
        DELETE,
        GET_BY_RULE_ID,
        GET_RULES,
        UPDATE_ACTV_IND,
        UPDATE_STAGE_IND,
        SAVE_AS_DRAFT,
        SUBMIT
    }

    public class Criteria
    {
        public List<rule> Rules { get; set; }
        public List<rule> BlanketDiscount { get; set; }
    }

    public class Products
    {
        public string ProductName { get; set; }
        public double Price { get; set; }
    }

    public class PriceRuleCriteria
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string OwnerName { get; set; }
        public int OwnerId { get; set; }
        public bool IsActive { get; set; }
        public string ActiveStatus { get; set; }
        public bool IsAutomationIncluded { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Notes { get; set; }
        public bool RuleStage { get; set; }
        public string RuleStageStatus { get; set; }
        public Criteria Criterias { get; set; }
        public string CriteriaJson { get; set; }
        public string CriteriaSql { get; set; }
        public List<Products> ProductCriteria { get; set; }
        public string ProductCriteriaJson { get; set; }
        public string ProductCriteriaSql { get; set; }
        public string ChangedBy { get; set; }
        public DateTime ChangeDateTime { get; set; }
        public string ChangeDateTimeFormat { get; set; }
    }

    public class rule
    {
        public string type { get; set; }
        public string field { get; set; }
        public string @operator { get; set; }
        public string value { get; set; }
        public List<string> values { get; set; }
        public ValueType valueType { get; set; }        
    }

    public class ValueType
    {
        public string text { get; set; }
        public string value { get; set; }
    }

    public class MultiRule
    {
        public string type { get; set; }
        public string field { get; set; }
        public string @operator { get; set; }
        public List<string> value { get; set; }
    }
}
