using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.Entities
{
    public class LookupSearchParser : SearchParser
    {
        public string LookupAttribute;

        public LookupSearchParser(string targetAttribute, string lookupAttribute) : base(targetAttribute)
        {
            LookupAttribute = lookupAttribute;
        }

        public override SearchFilter Parse(string searchTerm, MyDealsAttribute atrb, AttributeCollection atrbMstr, Dictionary<int, CustomerDivision> divisions)
        {
            if (string.IsNullOrEmpty(LookupAttribute)) { return null; }

            searchTerm = GetValueStonglyTyped(searchTerm, atrb);

            if (string.IsNullOrEmpty(searchTerm))
            {
                return null;
            }

            var lu = atrbMstr.LookupGet(LookupAttribute);
            if (lu == null || !lu.Any()) { return null; }

            searchTerm = searchTerm.Trim().ToUpper();

            SearchFilter ret = new SearchFilter(SearchFilter.ConjunctionType.OR);

            foreach (var lm in lu.Where(itm => itm.AtrbItemValue.ToUpper().Contains(searchTerm)))
            {
                ret.SubFilters.Add(new SearchFilter(
                    lm.AtrbID,
                    SearchFilter.OperatorType.EQUAL,
                    $"{lm.AtrbItemId}"
                    ));
            }

            return ret;
        }
    }
}