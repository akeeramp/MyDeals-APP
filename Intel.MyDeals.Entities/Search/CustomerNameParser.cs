using System;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.Entities
{
    public class CustomerNameParser : SearchParser
    {
        public CustomerNameParser() : base(AttributeCodes.CUST_MBR_SID) { }

        public SearchFilter Parse(SearchFilter fltr, AttributeCollection atrbMstr, Dictionary<int, CustomerDivision> divisions)
        {
            if (string.IsNullOrEmpty(fltr?.Value)) { return null; }

            string search_term = fltr.Value.ToUpper().Trim();
            string[] search_terms = search_term.Split(
                SearchLib.INLINE_OR_DELIM_SPLITTER, 
                StringSplitOptions.RemoveEmptyEntries
                );

            var matches = divisions.Values
                .Where(c => {
                                return
                                    c.CUST_NM.ToUpper().StartsWith(search_term)
                                    || c.CUST_DIV_NM.ToUpper().StartsWith(search_term)
                                    || search_terms.Contains(c.CUST_NM.ToUpper())
                                    || search_terms.Contains(c.CUST_DIV_NM.ToUpper());
                });

            if (!matches.Any()) { return null; }

            List<int> all_matches = new List<int>(matches.Select(c => c.CUST_MBR_SID));
            all_matches.AddRange(matches.Select(c => c.CUST_DIV_NM_SID));
            all_matches.AddRange(matches.Select(c => c.CUST_NM_SID));

            
            return new SearchFilter
                (
                atrbMstr[AttributeCodes.CUST_MBR_SID], // Must search on this...
                fltr.Operator,
                String.Join(";", all_matches.Distinct())
                );
        }

        public override SearchFilter Parse(string searchTerm, MyDealsAttribute atrb, AttributeCollection atrbMstr, Dictionary<int, CustomerDivision> divisions)
        {
            return Parse
                (
                    new SearchFilter(atrb.ATRB_SID, SearchFilter.OperatorType.EQUAL, searchTerm),
                    atrbMstr,
                    divisions
                );
        }
    }
}