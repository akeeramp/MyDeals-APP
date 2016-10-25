using System;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.Entities
{
    /// <summary>
    /// Search parser to use ? 
    /// </summary>
    public class DefaultSearchParser : SearchParser
    {
        public DefaultSearchParser(string targetAttribute) : base(targetAttribute) { }

        public override SearchFilter Parse(string searchTerm, MyDealsAttribute atrb, AttributeCollection atrbMstr, Dictionary<int, CustomerDivision> divisions)
        {
            searchTerm = String.Join(";",
                searchTerm
                    .Split(',', ';')
                    .Select(s => GetValueStonglyTyped(s.Trim(), atrb))
                    .Where(s => !String.IsNullOrEmpty(s))
                    .Distinct()
                );
            
            if (String.IsNullOrEmpty(searchTerm))
            {
                return null;
            }

            return new SearchFilter
                (
                atrb.ATRB_SID,
                SearchFilter.OperatorType.EQUAL,
                searchTerm
                );
        }
    }
}