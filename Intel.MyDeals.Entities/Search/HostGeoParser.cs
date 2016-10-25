using System;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.Entities
{
    public class HostGeoParser : SearchParser
    {
        public HostGeoParser() : base(AttributeCodes.CUST_MBR_SID) { }

        public SearchFilter Parse(SearchFilter fltr, AttributeCollection atrbMstr, Dictionary<int, CustomerDivision> divisions)
        {
            if (string.IsNullOrEmpty(fltr?.Value)) { return null; }
            
            string searchTerm = fltr.Value.ToUpper().Trim();
            string[] searchTerms = searchTerm.Split(
                SearchLib.INLINE_OR_DELIM_SPLITTER,
                StringSplitOptions.RemoveEmptyEntries
                );

            var matches = divisions.Values
                .Where(c => !String.IsNullOrEmpty(c.HOSTED_GEO))
                .Where(c =>
                {
                    return
                        c.HOSTED_GEO.ToUpper().StartsWith(searchTerm)
                        || searchTerms.Contains(c.HOSTED_GEO.ToUpper());
                });

            if (!matches.Any()) { return null; }

            List<int> allMatches = new List<int>(matches.Select(c => c.CUST_MBR_SID));
            allMatches.AddRange(matches.Select(c => c.CUST_DIV_NM_SID));
            allMatches.AddRange(matches.Select(c => c.CUST_NM_SID));

            return new SearchFilter
                (
                atrbMstr[AttributeCodes.CUST_MBR_SID], // Must search on this...
                fltr.Operator,
                string.Join(";", allMatches.Distinct())
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