using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public static class SearchTools
    {
        private static string ParseFilter(string filter, OpDataElementType opDataElementType)
        {
            string rtn = string.Empty;
            string strContainsKey = "substringof(";
            Dictionary<string, string> dictOperKeys = new Dictionary<string, string>
            {
                [" eq "] = " = ",
                [" neq "] = " != ",
                [" gt "] = " > ",
                [" ge "] = " >= ",
                [" lt "] = " < ",
                [" le "] = " <= ",
            };

            // Check for LIKE condition
            if (filter.IndexOf(strContainsKey, StringComparison.Ordinal) >= 0)
            {
                // pattern = substringof('CM806',PRODUCT_FILTER)
                string newFilter = filter.Substring(strContainsKey.Length, filter.Length - strContainsKey.Length - 1).Replace("',",",").Replace("'","");
                List<string> arNewFilter = newFilter.Split(',').ToList();

                if (arNewFilter.Count > 2)
                {
                    var atrb = arNewFilter[arNewFilter.Count - 1];
                    var vals = arNewFilter.Take(arNewFilter.Count - 1).ToArray();
                    return $"{opDataElementType}_{atrb} IN ('{string.Join("','", vals)}')";
                }
                return $"{opDataElementType}_{arNewFilter[1]} LIKE '%{arNewFilter[0].Replace("*", "%")}%'";
            }

            // Check for OPERs
            foreach (KeyValuePair<string, string> kvp in dictOperKeys)
            {
                if (filter.IndexOf(kvp.Key, StringComparison.Ordinal) >= 0)
                {
                    return ConstructSqlFilter(kvp.Key, kvp.Value, filter, opDataElementType);
                }
            }

            return rtn;
        }

        private static string ConstructSqlFilter(string delim, string joinKey, string filter, OpDataElementType opDataElementType)
        {
            string strDateKey = "datetime'";
            string rtn = string.Empty;
            string tick = string.Empty;
            List<string> stringDataTypes = new List<string> {"VARCHAR", "DATETIME"};

            // Check for datetime : pattern = START_DT gt datetime'2017-12-12T00:00:00'
            if (filter.IndexOf(strDateKey, StringComparison.Ordinal) >= 0)
            {
                List<string> arNewFilter = filter.Substring(0,filter.Length - 1).Split(new[] { strDateKey }, StringSplitOptions.None).ToList();
                string newDateFormat = Convert.ToDateTime(arNewFilter[1]).ToString("MM/dd/yyyy");
                string atrb = arNewFilter[0];
                FieldInfo fieldInfo = typeof(Attributes).GetField(atrb);
                if (fieldInfo != null)
                {
                    tick = ((MyDealsAttribute)fieldInfo.GetValue(null)).DATA_TYPE_CD == "VARCHAR" ? "'" : "";
                }

                filter = $"{atrb} {newDateFormat.Trim()}";
            }

            List<string> arSections = filter.Split(new[] { delim }, StringSplitOptions.None).ToList();
            if (arSections.Count == 2)
            {
                string atrb = arSections[0];
                arSections[1] = arSections[1].Trim().Replace("'", "");

                // Special case... CAP is a string becuase of ranges and "NO CAP" be we will treatit in the filter like a number
                if (atrb != AttributeCodes.CAP)
                {
                    FieldInfo fieldInfo = typeof(Attributes).GetField(atrb);
                    if (fieldInfo != null)
                    {
                        tick = stringDataTypes.Contains(((MyDealsAttribute)fieldInfo.GetValue(null)).DATA_TYPE_CD) ? "'" : "";
                    }
                    else if (atrb == "Customer/CUST_NM")
                    {
                        tick = "";
                        arSections[1] = "('" + arSections[1].Trim().Replace(",", "','") + "')";
                        joinKey = " in ";
                    }
                }
                string passedAtrb = atrb == "DC_ID" ? "OBJ_SID" : atrb;
                rtn = $"{opDataElementType}_{passedAtrb}{joinKey}{tick}{arSections[1]}{tick}";
            }
            return rtn;
        }

        public static string BuildFilterClause(string filters, OpDataElementType opDataElementType)
        {
            if (string.IsNullOrEmpty(filters)) return string.Empty;

            if (filters[0] == '(') // strip off first and last paren
                filters = filters.Substring(1, filters.Length - 2);

            List<string> arFilters = filters.Split(new[] { " and " }, StringSplitOptions.None).ToList();
            List<string> arFilterClauses = arFilters.Select(f => ParseFilter(f, opDataElementType)).ToList();

            for (int f = 0; f < arFilterClauses.Count; f++)
            {
                if (arFilterClauses[f].IndexOf("WIP_DEAL_WF_STG_CD") >= 0)
                {
                    arFilterClauses[f] = $"({arFilterClauses[f]} OR (WIP_DEAL_WF_STG_CD = 'Draft' AND {arFilterClauses[f].Replace("WIP_DEAL_WF_STG_CD", "WIP_DEAL_PS_WF_STG_CD")}))";
                }
            }
            string rtn = string.Join(" and ", arFilterClauses);

            // Special columns... When we make the advanced search, need a better way than hard coding this
            rtn = rtn.Replace("WIP_DEAL_Customer/CUST_NM", "CUST_NM");
            rtn = rtn.Replace("WIP_DEAL_CNTRCT_TITLE", "CNTRCT_TITLE");
            rtn = rtn.Replace("WIP_DEAL_CNTRCT_OBJ_SID", "CNTRCT_OBJ_SID");
            rtn = rtn.Replace("WIP_DEAL_PRC_ST_TITLE", "PRC_ST_TITLE");
            rtn = rtn.Replace("WIP_DEAL_CNTRCT_C2A_DATA_C2A_ID", "CNTRCT_C2A_DATA_C2A_ID");

            return rtn;
        }

        public static string BuildCustSecurityWhere()
        {
            string custIds = string.Join(",", DataCollections.GetMyCustomers().CustomerInfo.Select(s => s.CUST_SID));
            return $"pst.CUST_MBR_SID IN ({custIds})";
        }
    }
}
