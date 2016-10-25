using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Intel.Opaque;
using Intel.Opaque.Data;


namespace Intel.MyDeals.Entities
{
    /// <summary>
    /// Library used to help resolve search settings to valid searches
    /// </summary>
    public class SearchLib
    {
        #region Constants
        public const string BLANK_VALUE = "<blank>";
        public const string WILD_CARD = "*";
        public const string WILD_CARD_SQL = "%";
        public const string ERROR_RETURN = "(1=0)";
        public const string INLINE_OR_DELIM = ";";
        public static readonly string[] INLINE_OR_DELIM_SPLITTER = {SearchLib.INLINE_OR_DELIM};
        
        private const string TCT_DATETIME = "DATETIME";
        private const string TCT_INT = "INT";
        private const string TCT_MONEY = "MONEY";
        private const string TCT_VARCHAR = "VARCHAR";

        private const string SELECT_MASK = "\nSELECT [" + AttributeCodes.DEAL_SID + "] \nFROM {0} (nolock) \nWHERE ({1})\n";
        private const string INVALID_RETURN = "\nSELECT CAST(NULL AS INT) AS [" + AttributeCodes.DEAL_SID + "] WHERE (1=0)\n";

        // http://msdn.microsoft.com/en-us/library/ms187819.aspx
        private static readonly DateTime SQL_DATETIME_MIN = new DateTime(1753,1,1);
        private static readonly DateTime SQL_DATETIME_MAX = new DateTime(9999,12,31);
        private static readonly string SYS_CURRENCY_SYMBOL = System.Globalization.RegionInfo.CurrentRegion.CurrencySymbol;
        #endregion

        public List<string> Messages { internal set; get; }
        private void ClearMessages()
        {
            if (Messages == null) { Messages = new List<string>(); }
            Messages.Clear();
        }

        #region Constructors
        /////// <summary>
        /////// Create a search lib using the default attribute resolver (Facade)
        /////// </summary>
        ////public SearchLib(): this(new AttributeCollection(DcsDataClient.InstanceOptimal()))
        ////{
        ////}
        /// <summary>
        /// Create a search lib with a delayed attribute resolver, where attributes
        /// will be resolved on first need using the passed resolver.
        /// </summary>
        /// <param name="dataAccessor"></param>
        public SearchLib(AttributeCollection masterData)
        {
            Messages = new List<string>();
            Attributes = masterData;
        }
        #endregion

        /// <summary>
        /// Attribute master data used to properly resolve search.
        /// </summary>
        public AttributeCollection Attributes { set; get;}
        

        /// <summary>
        /// Convert a conjunction to a string, in this case AND to INTERSECT
        /// and OR to UNION ALL
        /// </summary>
        /// <param name="ct">Value to convert</param>
        /// <returns>INTERSCENT or UNION ALL</returns>
        private string ConjunctionTypeToString(SearchFilter.ConjunctionType ct)
        {
            switch (ct)
            {
                case SearchFilter.ConjunctionType.AND: return "INTERSECT";
                case SearchFilter.ConjunctionType.OR: return "UNION ALL";
                default: return "INTERSECT";
            }
        }

        /// <summary>
        /// Resolve a single filter value based on Attrbute/Operator/Value properties
        /// </summary>
        /// <param name="fltr">Valid input filter with valid values.</param>
        /// <returns>Valid T-SQL clause</returns>
        internal string ResolveFilter(SearchFilter fltr)
        {
            MyDealsAttribute atrb;
            string filter_value;
            if (Messages == null)
            {
                Messages = new List<string>();
            }
            string msg;

            #region Arguement Checking
            if (fltr == null || !fltr.IsFilter)
            {
                msg = "Error resolving filter, filter was null, AttributeID was not set or Operator was invalid.";
                Messages.Add(msg);
#if DEBUG
                OpLogPerf.Log(msg);
#endif
                return ERROR_RETURN;
            }

            if (!Attributes.TryGetValue(fltr.AttributeID, out atrb))
            {
                msg = String.Format("Error resolving filter, unable to find ATRB_SID = {0}.", fltr.AttributeID);
                Messages.Add(msg);
#if DEBUG
                OpLogPerf.Log(msg);
#endif
                return ERROR_RETURN;
            }

            filter_value = fltr.Value;
            if (String.IsNullOrEmpty(filter_value))
            {
                filter_value = BLANK_VALUE;
            }
            else
            {
                filter_value = filter_value.Replace(WILD_CARD_SQL, WILD_CARD);
            }
            #endregion

            var col = atrb.GetTargetColumn();
            var tct = atrb.TGT_COL_TYPE; // DATETIME,INT,MONEY,VARCHAR
            bool addNotNullClause = true;

            List<string> clauses = new List<string>();
            foreach (string cur_val in filter_value.Split(INLINE_OR_DELIM_SPLITTER, StringSplitOptions.None).Select(s => s.Trim()).Distinct())
            {
                var opr = fltr.OperatorString;
                var val = cur_val;
                string col_mask = "[{0}]";
            
                if (String.IsNullOrEmpty(val))
                {
                    val = BLANK_VALUE;
                }

                if (val.ToLower() == BLANK_VALUE)
                {
                    val = "NULL";

                    if (fltr.Operator == SearchFilter.OperatorType.EQUAL)
                    {
                        opr = "IS";
                    }
                    else
                    {
                        opr = "IS NOT";
                        addNotNullClause = false;
                    }

                    if (tct == TCT_VARCHAR)
                    {
                        col_mask = "NULLIF(LTRIM([{0}]),'')";
                    }
                } 
                else if (tct == TCT_DATETIME)
                {
                    try
                    {
                        DateTime dt;
                        if (DateTime.TryParse(val, out dt))
                        {
                            if (dt < SQL_DATETIME_MIN || dt > SQL_DATETIME_MAX)
                            {
                                msg = String.Format("Invalid Date Filter (Out of SQL Bounds) \"{0}\".", val);
                                Messages.Add(msg);
#if DEBUG
                                OpLogPerf.Log(msg);
#endif
                                val = ERROR_RETURN;
                            }
                            else
                            {
                                val = String.Format("'{0:yyyyMMdd}'", dt); // Intentionally flooring to day...
                            }
                        }
                        else
                        {
                            msg = String.Format("Invalid Date Filter (Failed TryParse) \"{0}\".", val);
                            Messages.Add(msg);
#if DEBUG
                            OpLogPerf.Log(msg);
#endif
                            val = ERROR_RETURN;
                        }
                    }
                    catch (Exception ex)
                    {
                        msg = String.Format("Invalid Date Filter (Exception) \"{0}\". {1}", val, ex);
                        Messages.Add(msg);
#if DEBUG
                        OpLogPerf.Log(msg);
#endif

                        val = ERROR_RETURN;
                    }
                }
                else if (tct == TCT_INT)
                {
                    int ival;
                    if (Int32.TryParse(val, out ival))
                    {
                        val = String.Format("{0}", ival);
                    }
                    else
                    {
                        msg = String.Format("Invalid Int Filter (Failed TryParse) \"{0}\".", val);
                        Messages.Add(msg);
#if DEBUG
                        OpLogPerf.Log(msg);
#endif

                        val = ERROR_RETURN;
                    }
                }
                else if (tct == TCT_MONEY)
                {
                    double dval;
                    val = val
                        .Replace("$", "")
                        .Replace(SYS_CURRENCY_SYMBOL, "");

                    if (Double.TryParse(val, out dval))
                    {
                        val = String.Format("{0}", dval);
                    }
                    else
                    {
                        msg = String.Format("Invalid Int Filter (Failed TryParse) \"{0}\".", val);
                        Messages.Add(msg);
#if DEBUG
                        OpLogPerf.Log(msg);
#endif
                        val = ERROR_RETURN;
                    }
                }
                else if (tct == TCT_VARCHAR)
                {
                    if (val.Contains(WILD_CARD))
                    {
                        if (fltr.Operator == SearchFilter.OperatorType.EQUAL)
                        {
                            opr = "LIKE";
                        }
                        else
                        {
                            opr = "NOT LIKE";
                        }
                        val = val.Replace(WILD_CARD, WILD_CARD_SQL);

                        while (val.Contains(WILD_CARD_SQL + WILD_CARD_SQL))
                        {
                            val = val.Replace(WILD_CARD_SQL + WILD_CARD_SQL, WILD_CARD_SQL);
                        }
                    }
    
                    val = val
                        .Replace((char)8216, '\'') // Smart ticks
                        .Replace((char)8217, '\'')
                        .Replace(@"'", @"''");

                    val = String.Format(@"'{0}'", val);
                }
                else
                {
                    val = ERROR_RETURN;

                    msg = String.Format("Unknown Data Type \"{0}\".", tct);
                    Messages.Add(msg);
#if DEBUG
                    OpLogPerf.Log(msg);
#endif
                }

                if (val == ERROR_RETURN)
                {
                    if (!clauses.Contains(ERROR_RETURN))
                    {
                        clauses.Add(val);
                    }
                }
                else
                {
                    clauses.Add(String.Format("({0} {1} {2})",
                        String.Format(col_mask, col),
                        opr,
                        val
                        ));
                }
            }

            var ret_clauses = clauses.Where(c => !String.IsNullOrEmpty(c)).Distinct();

            if (!ret_clauses.Any())
            {
                msg = String.Format("No Valid Filters Found.");
                Messages.Add(msg);
#if DEBUG
                OpLogPerf.Log(msg);
#endif
                return ERROR_RETURN;
            }

            return String.Format("(([{0}] = {1}) AND {3} ({2}))",
                        Entities.deal.DEAL.ATRB_SID,
                        atrb.ATRB_SID,
                        String.Join("\n OR \n", ret_clauses),
                        addNotNullClause   // Since our primary indexes are filtered indexes, make sure they are used by including the is not null...
                            ? String.Format("([{0}] IS NOT NULL) AND", col)
                            : String.Empty
                        );
        }

        //private Dictionary<int, FilterTweakers.FilterTweaker> Tweakers
        //{
        //    get { return _Tweakers ?? (_Tweakers = FilterTweakers.GetTweakers(attributeCollection)); }
        //}
        //Dictionary<int, FilterTweakers.FilterTweaker> _Tweakers = null;

        /// <summary>
        /// Resolve multiple filters recursivly
        /// </summary>
        /// <param name="rootFilter">Staring point of recursive resolution</param>
        /// <param name="dtl"></param>
        /// <param name="divisions"></param>
        /// <returns>Full T-SQL select usable in DCS search routine as a where clause.</returns>
        private string ResolveFitlers(SearchFilter rootFilter, SchemeDetail dtl, Dictionary<int, CustomerDivision> divisions, AttributeCollection attributeCollection)
        {
            if (rootFilter == null || dtl == null || String.IsNullOrEmpty(dtl.SearchViewName)) 
            { 
                Messages.Add("Root filter or target view not set.");
                return String.Empty; 
            }

            List<string> clauses = new List<string>();
            
            // If this filter has a valid individual filter, process it...
            if (rootFilter.IsFilter)
            {
                FilterTweakers.FilterTweaker ft;
                if (FilterTweakers.GetTweakers(attributeCollection).TryGetValue(rootFilter.AttributeID, out ft))
                {
                    // TODO: This PKID Search stuff is SUPER-HACKY, maybe redo later?
                    string tv = 
                        (
                            !String.IsNullOrEmpty(dtl.HeaderTableName) // Has to have a known PKID table
                            &&
                            dtl.PKColumnName == Entities.deal.DEAL.OBJ_SID // PKID column has to match what is written in deal id filter
                            &&
                            ft.Method.Name == FilterTweakers.DealIDSearchMethodName // Has to be a deal id search
                        )
                        ? dtl.HeaderTableName // ID only search, just seek against the parent table...
                        : dtl.SearchViewName; // Else the search view....

                    clauses.Add(string.Format(SELECT_MASK, tv, ft(this, rootFilter, tv, divisions)));
                }
                else
                {
                    clauses.Add(String.Format(SELECT_MASK, dtl.SearchViewName, ResolveFilter(rootFilter)));
                }
            }

            // Then process any sub filters...
            if (rootFilter.HasValidFilter)
            {
                clauses.AddRange(rootFilter.SubFilters.Select(f => ResolveFitlers(f, dtl, divisions, attributeCollection)));
            }

            // Remove any empty items...
            clauses.RemoveAll(String.IsNullOrEmpty);

            // If nothing valid was found, return empty...
            if (!clauses.Any())
            {
                Messages.Add("No valid search filters found.");
                return String.Empty;
            }

            // Else join all our clauses togther as requested.
            return String.Format("\n ({0}) \n", String.Join(
                String.Format("\n {0} \n", ConjunctionTypeToString(rootFilter.SubFilterConjunction)),
                clauses
                ));
        }

        /// <summary>
        /// Fully resolve a Search Filter
        /// </summary>
        /// <param name="setting">Valid search setting with filters and a target view.</param>
        /// <returns>Fully qualified T-SQL select to be used as a filter in a DCS search.</returns>
        public string ResolveSearch(SearchSettings setting, Dictionary<int, CustomerDivision> divisions, AttributeCollection attributeCollection)
        {
            ClearMessages();
#if DEBUG
            DateTime start = DateTime.Now;
#endif
            if(setting == null || setting.Filters == null || !setting.Filters.HasValidFilter)
            {
                Messages.Add("Search setting or filters not set or only only has invalid filters.");
                return INVALID_RETURN;
            }

            string ret = ResolveFitlers
                (
                setting.Filters,
                setting.GetSchemeDetails(),
                divisions,
                attributeCollection
                );

#if DEBUG
            // DO NOT USE THIS CODE IN PROD BUILDS!!!
            // It will corrupt the query.  For example, if you have "WHERE [CUST_NM] LIKE '%ab(cd)ef%'", the
            // parens in the clause will be corrupted, hence only in debug builds, since it makes debugging
            // so much easier.
            var rt = (DateTime.Now - start).TotalMilliseconds;

            string NL = Environment.NewLine;
            ret = ret
                .Replace("\n", NL)
                .Replace("\r", NL)
                .Replace("(nolock)", "###nolock###")
                .Replace("(", String.Format("{0}({0}", NL))
                .Replace(")", String.Format("{0}){0}", NL))
                .Replace("###nolock###", "(nolock)");

            while (ret.Contains(NL + NL))
            {
                ret = ret.Replace(NL + NL, NL);
            }

            int tab_level = 0;
            string[] ret_arr = ret.Split(new string[] { NL }, StringSplitOptions.None);
            int lines_count = ret_arr.Length;
            var join_lines = new List<string>();

            join_lines.Add("/***********************************************************");
            join_lines.Add("Query was generated in DEBUG mode.");
            join_lines.Add("Debug more queries are formatted for easier debugging (proper tabs), ");
            join_lines.Add("but could potentially alter the query syntax since it find/replaces things");
            join_lines.Add("like ( and ).  Do don't deploy DEBUG compiled code to production.");
            join_lines.Add("");
            join_lines.Add(String.Format("Date: {0}, Query Resolution Runtime: {1}ms", DateTime.Now, rt));
            join_lines.Add("***********************************************************/");

            for (int i = 0; i < lines_count; ++i)
            {
                string itm = ret_arr[i].Trim();
                StringBuilder sb = new StringBuilder();

                if (String.IsNullOrEmpty(itm))
                {
                    continue;
                }

                if (itm == ")" && tab_level > 0)
                {
                    tab_level--;
                }

                for (int t = 0; t < tab_level; ++t)
                {
                    sb.Append("  ");
                }

                if (itm == "(")
                {
                    tab_level++;
                }
                
                join_lines.Add(sb.ToString() + itm);
            }

            ret = String.Join(NL, join_lines);

            OpLogPerf.Log(ret);
            // Logperf removes \n, \r and \t to make importing to Excel easier, so dump out the pretty formatted version here...
            System.Diagnostics.Debug.WriteLine(ret);

#endif
            return ret;
        }

        private static readonly SearchParser[] SearchParsers =
        {
            new DefaultSearchParser(AttributeCodes.DEAL_SID),
            new LookupSearchParser(AttributeCodes.DEAL_TYPE_CD, AttributeCodes.DEAL_TYPE_CD_SID),
            new DateRangeParser(AttributeCodes.START_DT, AttributeCodes.END_DT),
            new CustomerNameParser()
        };

        public SearchSettings ParseQuickSearchDeal(string searchString, Dictionary<int, CustomerDivision> divisions)
        {
            SearchSettings ss = new SearchSettings();
            ss.Filters = ParseQuickSearch(searchString, divisions);
            ss.Name = "Quick Search";
            ss.TargetScheme = OpDataElementType.Deals;
            return ss;
        }

        /// <summary>
        /// Take in a single search text and try to resolve valid filters
        /// </summary>
        /// <param name="searchString"></param>
        /// <returns></returns>
        public SearchFilter ParseQuickSearch(string searchString, Dictionary<int, CustomerDivision> divisions)
        {
            ClearMessages();

            const char termSep = ' ';
            searchString = searchString.Replace(',', termSep);

            SearchFilter ret = new SearchFilter(SearchFilter.ConjunctionType.AND);

            // These two while clauses just made for a more natural search experience...
            while (searchString.Contains("," + termSep))
            {
                searchString = searchString.Replace("," + termSep, ",");
            }
            while (searchString.Contains(termSep + ","))
            {
                searchString = searchString.Replace(termSep + ",", ",");
            }

            // Search terms that have spaces where we want to treat as a single search term.
            // Add more as needed.  Key = Escaped Valye, Value = Search value (I know backwards,
            // but it made working the code after the split easier).
            Dictionary<string, string> EscapeSequences = new Dictionary<string,string>
            {
                {"ASP_TIER", "ASP TIER"},
                {"VOL_TIER","VOL TIER"},
                {"CAP_BAND","CAP BAND"}
            };

            foreach (var kvp in EscapeSequences)
            {
                // Do a case insensitive replace...
                searchString = Regex.Replace(
                    String.Format(" {0} ", searchString), 
                    String.Format(@"\b{0}\b", kvp.Value), // Must match word boundries (\b)
                    String.Format(" {0} ", kvp.Key), 
                    RegexOptions.IgnoreCase
                    );
            }

            // Split search terms into "AND" able units
            var searchTerms = (searchString ?? "")
                .Split(termSep)
                .Select(s => s.Trim())
                .Where(s => !String.IsNullOrEmpty(s))
                .ToArray();

            if (!searchTerms.Any())
            {
                return ret;
            }

            for (int i = searchTerms.Length - 1; i >= 0; --i)
            {
                string unescaped_value;
                if (EscapeSequences.TryGetValue(searchTerms[i], out unescaped_value))
                {
                    searchTerms[i] = unescaped_value;
                }

            }
            
            // Resolve all the attributes in one pass...
            var parsers = SearchParsers
                .Select(p => new
                {
                    Atrb = Attributes.Get(p.TargetAttribute),
                    Parser = p
                });

            // Process each term.
            foreach (string val in searchTerms)
            {
                SearchFilter termFilter = new SearchFilter(SearchFilter.ConjunctionType.OR);

                foreach (var parser in parsers)
                {
                    if (parser == null || parser.Atrb == null) { continue; }

                    // Resolve the filter.
                    SearchFilter f = parser.Parser.Parse(val, parser.Atrb, Attributes, divisions);

                    if (f == null || !f.HasValidFilter) { continue; }

                    termFilter.SubFilters.Add(f);
                }

                if (termFilter.HasValidFilter)
                {
                    ret.SubFilters.Add(termFilter);
                }
            }

            return ret;
        }


        public SearchSettings GetSearchSettingsFromJson(AttributeCollection amap, string f2, DateTime st, DateTime en, string[] c)
        {
            ClearMessages();

            // TODO: Complete hack... bad coding... fix late.  We need to stip off the time zone
            for (int i = 0; i < 10; i++) f2 = f2.Replace("T0" + i + ":00:00.000Z", "");
            for (int i = 10; i < 24; i++) f2 = f2.Replace("T" + i + ":00:00.000Z", "");

            f2 = ConvertOdataToSearchFilter(f2);
            OdataSearchFilter data = OpSerializeHelper.FromJsonString<OdataSearchFilter>(f2);

            //var custFilters = new SearchFilter(SearchFilter.ConjunctionType.AND, new[]
            //{
            //    new SearchFilter(SearchFilter.ConjunctionType.OR, c.Select(cust => new SearchFilter(amap.GetSid(AttributeCodes.DEAL_CUST_DIV_NM), SearchFilter.OperatorType.EQUAL, cust)).ToArray())
            //});
            //var custFilters = new SearchFilter(SearchFilter.ConjunctionType.OR, c.Select(cust => new SearchFilter(amap.GetSid(AttributeCodes.DEAL_CUST_DIV_NM), SearchFilter.OperatorType.EQUAL, cust)).ToArray());
            var custFilters = new SearchFilter(
                amap.GetSid(AttributeCodes.DEAL_CUST_DIV_NM),
                SearchFilter.OperatorType.EQUAL,
                String.Join(INLINE_OR_DELIM, (c ?? new string[] { }))
                );
            
            SearchSettings settings = new SearchSettings
            {
                Filters = new SearchFilter(SearchFilter.ConjunctionType.AND, new[]
                    {
                        new SearchFilter(amap.GetSid(AttributeCodes.START_DT), SearchFilter.OperatorType.LESS_OR_EQUAL, en.ToString("MM/dd/yyyy")),
                        new SearchFilter(amap.GetSid(AttributeCodes.END_DT), SearchFilter.OperatorType.GREATER_OR_EQUAL, st.ToString("MM/dd/yyyy")),
                        GetSearchFromOdataFilter(data, amap)
                    })
            };
            
            if (c.Any()) settings.Filters.SubFilters.Add(custFilters);

            return settings;
        }

        private SearchFilter GetSearchFromOdataFilter(OdataSearchFilter data, AttributeCollection amap)
        {
            //ss.Filters = new SearchFilter(SearchFilter.ConjunctionType.AND, new SearchFilter[]
            //{
            //    new SearchFilter(amap[AttributeCodes.ECAP_PRICE].ATRB_SID, SearchFilter.OperatorType.GREATER, "2.00"),
            //    new SearchFilter(amap[AttributeCodes.START_DT].ATRB_SID, SearchFilter.OperatorType.GREATER, "1/1/2013"),
            //    new SearchFilter(SearchFilter.ConjunctionType.OR, new SearchFilter[] {
            //        new SearchFilter(amap[AttributeCodes.END_VOL].ATRB_SID, SearchFilter.OperatorType.GREATER, "3"),
            //        new SearchFilter(amap[AttributeCodes.COMMENT_HISTORY].ATRB_SID, SearchFilter.OperatorType.EQUAL, "*Hello*"),
            //        new SearchFilter(SearchFilter.ConjunctionType.AND, new SearchFilter[] {
            //            new SearchFilter(amap[AttributeCodes.END_VOL].ATRB_SID, SearchFilter.OperatorType.LESS_OR_EQUAL, "99999"),
            //            new SearchFilter(amap[AttributeCodes.COMMENT_HISTORY].ATRB_SID, SearchFilter.OperatorType.NOT_EQUAL, "*Goodbye*"),
            //        })
            //    })
            //});
            SearchFilter sf = new SearchFilter();
            if (data == null)
            {
                Messages.Add("Odata Search Filter was not set.");
                return sf;
            }

            // look for logic provider
            if (data.SubFilterConjunction != string.Empty)
            {
                sf.SubFilterConjunction = GetConjunctionType(data.SubFilterConjunction);
                sf.SubFilters = new List<SearchFilter>();
                foreach (OdataSearchFilter odataSearchFilter in data.SubFilters)
                {
                    sf.SubFilters.Add(GetSearchFromOdataFilter(odataSearchFilter, amap));
                }
            }
            else // simple search filter
            {
                sf.AttributeID = amap.GetSid(data.AttributeNm);
                sf.Operator = GetOperatorType(data.Operator);
                sf.Value = data.Value;
            }
            return sf;
        }

        private SearchFilter.ConjunctionType GetConjunctionType(string conj)
        {
            switch (conj.ToLower().Trim())
            {
                case "and":
                    return SearchFilter.ConjunctionType.AND;
                case "or":
                    return SearchFilter.ConjunctionType.OR;
            }
            return SearchFilter.ConjunctionType.AND;
        }

        private SearchFilter.OperatorType GetOperatorType(string oper)
        {
            switch (oper.ToLower().Trim())
            {
                case "eq":
                    return SearchFilter.OperatorType.EQUAL;
                case "neq":
                    return SearchFilter.OperatorType.NOT_EQUAL;
                case "gt":
                    return SearchFilter.OperatorType.GREATER;
                case "gte":
                    return SearchFilter.OperatorType.GREATER_OR_EQUAL;
                case "lt":
                    return SearchFilter.OperatorType.LESS;
                case "lte":
                    return SearchFilter.OperatorType.LESS_OR_EQUAL;
            }
            return SearchFilter.OperatorType.EQUAL;
        }

        private string ConvertOdataToSearchFilter(string s)
        {
            s = s.Replace("\"field\"", "\"AttributeNm\"");
            s = s.Replace("\"operator\"", "\"Operator\"");
            s = s.Replace("\"value\"", "\"Value\"");
            s = s.Replace("\"logic\"", "\"SubFilterConjunction\"");
            s = s.Replace("\"filters\"", "\"SubFilters\"");
            return s;
        }

    }
}
