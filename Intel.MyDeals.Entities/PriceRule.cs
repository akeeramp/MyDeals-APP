using System;
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class RuleConfig
    {
        public List<UsrProfileRole> DA_Users { get; set; }
        public int CurrentUserWWID { get; set; }
        public DateTime DefaultEndDate { get; set; }
        public string CurrentUserName { get; set; }
    }

    public class DropDowns
    {
        public string Value { get; set; }
        public string Text { get; set; }
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
        public string RuleStatusLabel { get; set; }
        public bool IsAutomationIncluded { get; set; }
        public string RuleAutomationLabel { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Notes { get; set; }
        public bool RuleStage { get; set; }
        public string RuleStageLabel { get; set; }
        public Criteria Criterias { get; set; }
        public string CriteriaJson { get; set; }
        public string CriteriaSql { get; set; }
        public List<Products> ProductCriteria { get; set; }
        public string ProductCriteriaJson { get; set; }
        public string ProductCriteriaSql { get; set; }
        public string ChangedBy { get; set; }
        public DateTime ChangeDateTime { get; set; }
        public string ChangeDateTimeFormat { get; set; }
        public string RuleDescription { get; set; }
        public string ProductDescription { get; set; }
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
}
