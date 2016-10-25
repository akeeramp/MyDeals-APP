
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class DateRangeParser : SearchParser
    {
        public string EndDateAttribute;

        public DateRangeParser(string targetAttribute, string endDateAttribute)
            : base(targetAttribute)
        {
            EndDateAttribute = endDateAttribute;
        }

        public override SearchFilter Parse(string searchTerm, MyDealsAttribute atrb, AttributeCollection atrbMstr, Dictionary<int, CustomerDivision> divisions)
        {
            searchTerm = GetValueStonglyTyped(searchTerm, atrb);

            if (string.IsNullOrEmpty(searchTerm))
            {
                return null;
            }

            SearchFilter ret = new SearchFilter(SearchFilter.ConjunctionType.AND);
            ret.SubFilters.Add(new SearchFilter(
                atrb.ATRB_SID,
                SearchFilter.OperatorType.LESS_OR_EQUAL,
                searchTerm
                ));

            if (!string.IsNullOrEmpty(EndDateAttribute) && atrbMstr != null)
            {
                var endAtrb = atrbMstr.Get(EndDateAttribute);
                if (endAtrb != null)
                {
                    ret.SubFilters.Add(new SearchFilter(
                        endAtrb.ATRB_SID,
                        SearchFilter.OperatorType.GREATER,
                        searchTerm
                        ));
                }
            }


            return ret;
        }
    }
}