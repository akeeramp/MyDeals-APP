using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class RuleConfig
    {
        public operatorSettings operatorSettings { get; set; }
        public List<AttributeSettings> AttributeSettings { get; set; }
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
}
