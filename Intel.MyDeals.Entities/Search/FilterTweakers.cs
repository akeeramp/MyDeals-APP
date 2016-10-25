using System;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.Entities
{
    internal static class FilterTweakers
    {
        /// <summary>
        /// Delegate that defines how custom filters are applied.
        /// </summary>
        /// <param name="sl">Library used to resolve filters by default.</param>
        /// <param name="filter">Filter to resolve.</param>
        /// <returns>Valid SQL Where Clause</returns>
        internal delegate string FilterTweaker(SearchLib sl, SearchFilter filter, string targetView, Dictionary<int, CustomerDivision> divisions);

        /// <summary>
        /// All applicable tweakers, where attribute code is used to filter to find any applicable tweakers.
        /// </summary>
        /// <param name="attributes">Used to resolve Attribute IDs</param>
        /// <returns>Dictionary of all applicable tweakers.</returns>
        internal static Dictionary<int, FilterTweaker> GetTweakers(AttributeCollection attributes)
        {
            return new Dictionary<int, FilterTweaker>
            {
                {attributes[AttributeCodes.DEAL_TYPE_CD], DealTypeCodeTweaker},
                {attributes[AttributeCodes.DEAL_SID], DealIDTweaker},
                {attributes[AttributeCodes.DEAL_NBR], DealIDTweaker},
                {attributes[AttributeCodes.DEAL_CUST_DIV_NM], CustNameTweaker},
                {attributes[AttributeCodes.DEAL_CUST_NM], CustNameTweaker},
                {attributes[AttributeCodes.CUST_DIV_NM], CustNameTweaker},
                {attributes[AttributeCodes.CUST_NM], CustNameTweaker},
                {attributes[AttributeCodes.HOSTED_GEO], HostGeoParserTweaker}
            };
        }

        internal static string DealTypeCodeTweaker(SearchLib sl, SearchFilter filter, string targetView, Dictionary<int, CustomerDivision> divisions)
        {
            // Used when searching in DEAL_TYPE_CD to map text value to their saved IDs
            if (filter.AttributeID != sl.Attributes[AttributeCodes.DEAL_TYPE_CD])
            {
                // We should never get here, but in case we do, return the correct resolution....
                return sl.ResolveFilter(filter);
            }

            // Split the value and parse each string to see if it maps to an ID
            var idList = String.Format("{0}", filter.Value)
                .Split(SearchLib.INLINE_OR_DELIM_SPLITTER, StringSplitOptions.None)
                .Select(s => sl.Attributes.LookupGetItemId(AttributeCodes.DEAL_TYPE_CD_SID, s.Trim(), null))
                .Where(i => i != null)
                .Distinct().ToArray();

            // If we find values, udpate the filter to search on IDs
            if (idList.Any())
            {
                filter.Value = String.Join(";", idList);
                filter.AttributeID = sl.Attributes[AttributeCodes.DEAL_TYPE_CD_SID];

                return sl.ResolveFilter(filter);
            }
            // else???

            sl.Messages.Add("Invalid Deal Type Code Filter.");

            return SearchLib.ERROR_RETURN;
        }

        public const string DealIDSearchMethodName = "DealIDTweaker";
        internal static string DealIDTweaker(SearchLib sl, SearchFilter filter, string targetView, Dictionary<int, CustomerDivision> divisions)
        {
            // NOTE!!!
            // If you rename this function, change the value in the const as well...

            var approvedAttributes = sl.Attributes
                .GetManySid(AttributeCodes.DEAL_SID, AttributeCodes.DEAL_NBR);


            if (!approvedAttributes.Contains(filter.AttributeID))
            {
                // We should never get here, but in case we do, return the correct resolution....
                return sl.ResolveFilter(filter);
            }

            var idList = String.Format("{0}", filter.Value)
                .Split(SearchLib.INLINE_OR_DELIM_SPLITTER, StringSplitOptions.RemoveEmptyEntries)
                .Select(s =>
                {
                    int r;
                    if (Int32.TryParse(s, out r))
                    {
                        return r;
                    }
                    return 0;
                })
                .Where(i => i > 0)
                .Distinct();

            if (idList.Any())
            {
                // Since this filter doesn't actually go against an attribute, custom over-ride to just go against PK

                if (idList.Count() == 1)
                {
                    // If there is only one deal ID, just use the passed operator
                    return string.Format("([{0}] {1} {2})",
                        Entities.deal.DEAL.OBJ_SID,
                        GetOperatorToSql(filter.Operator),
                        idList.First()
                        );
                }
                else
                {
                    // If there are more than one DEAL ID's, assume "IN" (or NOT IN)
                    return string.Format("([{0}] {1} IN ({2}))",
                        Entities.deal.DEAL.OBJ_SID,
                        (filter.Operator == SearchFilter.OperatorType.EQUAL ? "" : "NOT"),
                        string.Join(",", idList)
                        );
                }
            }

            sl.Messages.Add("Invalid Deal ID search filters, no valid Deal IDs found.");

            return SearchLib.ERROR_RETURN;
        }

        internal static string GetOperatorToSql(SearchFilter.OperatorType operatorType)
        {
            switch (operatorType)
            {
                case SearchFilter.OperatorType.GREATER:
                    return ">";
                case SearchFilter.OperatorType.GREATER_OR_EQUAL:
                    return ">=";
                case SearchFilter.OperatorType.LESS:
                    return "<";
                case SearchFilter.OperatorType.LESS_OR_EQUAL:
                    return "<=";
                default:
                    return "=";
            }
        }

        internal static string CustNameTweaker(SearchLib sl, SearchFilter filter, string targetView, Dictionary<int, CustomerDivision> divisions)
        {
            var sf = (new CustomerNameParser()).Parse(filter, sl.Attributes, divisions);
            if (sf != null)
            {
                return sl.ResolveFilter(sf);
            }
            
            sl.Messages.Add("Customer search filter.");
            return SearchLib.ERROR_RETURN;
        }

        internal static string HostGeoParserTweaker(SearchLib sl, SearchFilter filter, string targetView, Dictionary<int, CustomerDivision> divisions)
        {
            var sf = new HostGeoParser().Parse(filter, sl.Attributes, divisions);
            if (sf != null)
            {
                return sl.ResolveFilter(sf);
            }
            
            sl.Messages.Add("Host Geo search filter.");
            return SearchLib.ERROR_RETURN;
        }

        

    }
}
