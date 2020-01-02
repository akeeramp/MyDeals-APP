using Intel.MyDeals.Entities;
using Microsoft.Win32.SafeHandles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;

namespace Intel.MyDeals.BusinessLogic.Rule_Engine
{
    public class RuleExpressions : IDisposable
    {
        // Flag: Has Dispose already been called?
        bool disposed = false;
        // Instantiate a SafeHandle instance.
        SafeHandle handle = new SafeFileHandle(IntPtr.Zero, true);

        // Public implementation of Dispose pattern callable by consumers.
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        // Protected implementation of Dispose pattern.
        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
                return;

            if (disposing)
            {
                handle.Dispose();
                // Free any other managed objects here.
                //
            }

            disposed = true;
        }

        List<string> lstStringDataTypes = new List<string>() { "string", "autocomplete", "string_with_in", "string_limited" };
        List<string> lstStringDataTypesExt = new List<string>() { "singleselect", "date", "singleselect_ext", "singleselect_read_only" };
        string strCapPriceCode = "CAP_PRICE";
        string strECapPriceCode = "ECAP_PRICE";
        string strCapPriceTitle = "Product CAP Price for Customer";
        string strECapPriceTitle = "ECAP Price";
        string[] strProductFilters = new string[] { "MTRL_ID", "DEAL_PRD_NM", "PCSR_NBR" };
        public Dictionary<ExpressionType, string> GetExpressions(PriceRuleCriteria priceRuleCriteria, Dictionary<int, string> dicCustomerName, Dictionary<int, string> dicEmployeeName)
        {
            Dictionary<ExpressionType, string> dicExpressions = new Dictionary<ExpressionType, string>();
            Dictionary<string, string> dicAttributes = GetAttributes();

            lstStringDataTypesExt.AddRange(lstStringDataTypes);
            List<string> lstSqlCriteria = new List<string>();
            List<string> lstDescription = new List<string>();
            Criteria criteria = priceRuleCriteria.Criterias;
            criteria.Rules.Where(x => lstStringDataTypes.Contains(x.type) && x.@operator == "LIKE").ToList().ForEach(x =>
            {
                x.values = x.value.Split(',').ToList();
                x.value = string.Empty;
                x.type = "list";
            });

            if (criteria.Rules.Where(x => x.type != "list").Count() > 0)
            {
                criteria.Rules.Where(x => strProductFilters.Contains(x.field)).ToList().ForEach(x => x.field = "PRODUCT_FILTER");
                criteria.Rules.Where(x => x.type != "list" && x.@operator == "!=").ToList().ForEach(x => { x.@operator = "<>"; });

                criteria.Rules.Where(x => lstStringDataTypes.Contains(x.type) && (x.@operator == "=" || x.@operator == "<>") && x.value.Trim() != "*" && x.value.Trim().EndsWith("*")).ToList().ForEach(x =>
                {
                    x.value = x.value.Trim().Remove(x.value.Trim().Length - 1, 1);
                    x.value = x.value.Contains(' ') ? string.Join("%", x.value.Split(' ').Where(y => y != " ").Select(z => z.Trim())) : x.value;
                    x.@operator = x.@operator == "=" ? "LIKE" : "NOT LIKE";
                });

                criteria.Rules.Where(x => x.type == "date").ToList().ForEach(x => { x.value = Convert.ToDateTime(x.value).ToString("MM/dd/yyyy"); });
                criteria.Rules.Where(x => x.type == "numericOrPercentage").ToList().ForEach(x => { x.field = string.Concat(x.field, (x.valueType == null || x.valueType.value == "%" ? "_PRCNT" : x.valueType.value == "$" ? "_DLLR" : string.Empty)); });
                criteria.Rules.Where(x => x.type != "list" && x.value != string.Empty && lstStringDataTypesExt.Contains(x.type) && x.value.Contains("'")).ToList().ForEach(x => { x.value = x.value.Replace("'", "''"); });
                criteria.Rules.Where(x => x.type != "list" && x.value != string.Empty && lstStringDataTypesExt.Contains(x.type) && x.@operator == "IN").ToList().ForEach(x => { x.value = string.Join(",", x.value.Split(',').Select(y => string.Concat("'", y.Trim(), "'"))); });
                criteria.Rules.Where(x => x.type != "list" && x.value != string.Empty && lstStringDataTypesExt.Contains(x.type)).ToList().ForEach(x => { x.value = x.@operator == "LIKE" || x.@operator == "NOT LIKE" ? string.Concat("'%", x.value, "%'") : (x.@operator == "IN" ? x.value : string.Concat("'", x.value, "'")); });
                criteria.Rules.Where(x => x.type != "list" && x.value != string.Empty && x.@operator == "IN").ToList().ForEach(x => { x.value = string.Concat("(", x.value, ")"); });

                lstSqlCriteria.AddRange(criteria.Rules.Where(x => x.type != "list").Select(x => string.Format("{0} {1} {2}", x.field, x.@operator, x.value.Trim())));
                lstDescription.AddRange(criteria.Rules.Where(x => x.type != "list").Select(x => string.Format("<span class=\"rule_attr_desc\">{0}</span><span class=\"rule_operator_desc\"> {1} </span><span class=\"rule_value_desc\">{2}</span>", dicAttributes.ContainsKey(x.field) ? dicAttributes[x.field] : "NA", x.@operator, x.value.Trim())));
            }

            if (criteria.Rules.Where(x => x.type == "list").Count() > 0)
            {
                criteria.Rules.Where(x => x.type == "list" && x.value != null && x.value != string.Empty && x.@operator == "IN").ToList().ForEach(x =>
                {
                    x.value = string.Concat("(", string.Join(",", x.value.Split(',').Select(y => string.Concat("'", y.Trim(), "'"))), ")");
                    lstSqlCriteria.Add(string.Format("{0} {1} {2}", x.field, x.@operator, x.value.Trim()));
                    lstDescription.Add(string.Format("<span class=\"rule_attr_desc\">{0}</span><span class=\"rule_operator_desc\"> {1} </span><span class=\"rule_value_desc\">{2}</span>", dicAttributes.ContainsKey(x.field) ? dicAttributes[x.field] : "NA", x.@operator, x.value.Trim()));
                });

                criteria.Rules.Where(x => x.type == "list" && x.@operator != "LIKE" && x.values != null && x.values.Count > 0).ToList().ForEach(x =>
                {
                    x.@operator = x.@operator == "!=" ? "NOT IN" : "IN";
                    x.value = string.Concat("(", string.Join(",", x.values.Select(y => string.Concat("'", GetFromDictionary(y, x.field, dicCustomerName, dicEmployeeName).Replace("'", "''"), "'"))), ")");
                    lstSqlCriteria.Add(string.Format("{0} {1} {2}", x.field, x.@operator, x.value.Trim()));
                    lstDescription.Add(string.Format("<span class=\"rule_attr_desc\">{0}</span><span class=\"rule_operator_desc\"> {1} </span><span class=\"rule_value_desc\">{2}</span>", dicAttributes.ContainsKey(x.field) ? dicAttributes[x.field] : "NA", x.@operator, x.value.Trim()));
                });

                criteria.Rules.Where(x => x.type == "list" && x.@operator == "LIKE" && x.values != null && x.values.Count > 0).ToList().ForEach(x =>
                {
                    List<rule> lstMulti = (from result in x.values
                                           select new rule
                                           {
                                               type = "string",
                                               value = GetFromDictionary(result, x.field, dicCustomerName, dicEmployeeName),
                                               field = x.field,
                                               @operator = x.@operator
                                           }).ToList();
                    if (lstMulti.Count > 0)
                    {
                        lstMulti.Where(y => y.value.Trim() != "*" && y.value.Trim().EndsWith("*")).ToList().ForEach(y =>
                        {
                            y.value = y.value.Trim().Remove(y.value.Trim().Length - 1, 1);
                            y.value = y.value.Contains(' ') ? string.Join("%", y.value.Split(' ').Where(z => z != " ").Select(a => a.Trim())) : y.value;
                        });

                        lstSqlCriteria.Add(string.Join(" OR ", lstMulti.Select(y => string.Format("({0} {1} {2})", y.field, y.@operator, y.value.Trim().EndsWith("%") && y.value.Trim() != "%" ? string.Concat("'", y.value.Trim(), "'") : string.Concat("'%", y.value.Trim(), "%'")))));
                        lstDescription.Add(string.Join(" OR ", lstMulti.Select(y => string.Format("(<span class=\"rule_attr_desc\">{0}</span><span class=\"rule_operator_desc\"> {1} </span><span class=\"rule_value_desc\">{2}</span>)", dicAttributes.ContainsKey(y.field) ? dicAttributes[y.field] : "NA", y.@operator, y.value.Trim().EndsWith("%") && y.value.Trim() != "%" ? string.Concat("'", y.value.Trim(), "'") : string.Concat("'%", y.value.Trim(), "%'")))));
                    }
                });
            }

            criteria.BlanketDiscount.RemoveAll(x => x.value == "0" || x.value == string.Empty);
            if (criteria.BlanketDiscount.Count > 0)
            {
                lstSqlCriteria.Add(string.Concat(strECapPriceCode, " >= (", strCapPriceCode, " - ", criteria.BlanketDiscount.First().valueType.value == "%" ? string.Format("({1} * {0})", (Convert.ToDouble(criteria.BlanketDiscount.First().value) / 100).ToString(), strCapPriceCode) : criteria.BlanketDiscount.First().value, ")"));
                string strBlanketValue = string.Concat(criteria.BlanketDiscount.First().valueType.value == "$" ? "$" : string.Empty, criteria.BlanketDiscount.First().value, criteria.BlanketDiscount.First().valueType.value == "%" ? "%" : string.Empty);
                lstDescription.Add(string.Concat("(<span class=\"rule_attr_desc\">", strECapPriceTitle, "</span>", "<span class=\"rule_operator_desc\"> >= </span>(", "<span class=\"rule_attr_desc\">", strCapPriceTitle, "</span>", "<span class=\"rule_operator_desc\"> - </span>", "<span class=\"rule_value_desc\">", strBlanketValue, "</span>)"));
            }

            string strProductDescription = string.Empty;
            dicExpressions.Add(ExpressionType.RuleSql, string.Join(" AND ", lstSqlCriteria.Select(x => string.Concat("(", x, ")"))));
            dicExpressions.Add(ExpressionType.RuleDescription, string.Join("<br/>", lstDescription.Select(x => x)));
            dicExpressions.Add(ExpressionType.ProductSql, GetSqlExpressionForProducts(priceRuleCriteria.ProductCriteria, out strProductDescription));
            dicExpressions.Add(ExpressionType.ProductDescription, strProductDescription);
            return dicExpressions;
        }

        string GetSqlExpressionForProducts(List<Products> lstProducts, out string strDescription)
        {
            if (lstProducts.Count > 0)
            {
                lstProducts.RemoveAll(x => x.Price <= 0);
            }
            string strSqlExpression = string.Empty;
            strDescription = string.Empty;

            if (lstProducts.Count > 0)
            {
                strSqlExpression = string.Concat("(", string.Join(" OR ", lstProducts.Select(x => string.Format("(PRODUCT_FILTER = '{0}' AND ECAP_PRICE >= {1})", x.ProductName, x.Price))), ")");
                strDescription = string.Join("<br/>", lstProducts.Select(x => string.Format("<span class=\"rule_attr_desc\">Product</span><span class=\"rule_operator_desc\"> = </span><span class=\"rule_value_desc\">{0}</span> AND <span class=\"rule_attr_desc\">ECAP (Price)</span><span class=\"rule_operator_desc\"> >= </span><span class=\"rule_value_desc\">{1}</span>", x.ProductName, String.Format("{0:C}", x.Price))));
            }

            return strSqlExpression;
        }

        string GetFromDictionary(string strValue, string strField, Dictionary<int, string> dicCustomerName, Dictionary<int, string> dicEmployeeName)
        {
            string strRtn = strValue;
            int iKey = 0;
            if (Int32.TryParse(strValue, out iKey))
            {
                switch (strField)
                {
                    case "CUST_NM":
                        {
                            strRtn = dicCustomerName.ContainsKey(Convert.ToInt32(iKey)) ? dicCustomerName[Convert.ToInt32(iKey)] : strValue;
                        }
                        break;
                    case "CRE_EMP_NAME":
                        {
                            strRtn = dicEmployeeName.ContainsKey(Convert.ToInt32(iKey)) ? dicEmployeeName[Convert.ToInt32(iKey)] : strValue;
                        }
                        break;
                }
            }
            return strRtn;
        }

        Dictionary<string, string> GetAttributes()
        {
            Dictionary<string, string> dicAttr = new Dictionary<string, string>();
            dicAttr.Add("CRE_EMP_NAME", "Created by name");
            dicAttr.Add("WIP_DEAL_OBJ_SID", "Deal #");
            dicAttr.Add("OBJ_SET_TYPE_CD", "Deal Type");
            dicAttr.Add("CUST_NM", "Customer");
            dicAttr.Add("END_CUSTOMER_RETAIL", "End Customer");
            dicAttr.Add("GEO_COMBINED", "Deal Geo");
            dicAttr.Add("HOST_GEO", "Customer Geo");
            dicAttr.Add("PRODUCT_FILTER", "Product");
            dicAttr.Add("DEAL_DESC", "Deal Description");
            dicAttr.Add("OP_CD", "Op Code");
            dicAttr.Add("DIV_NM", "Product Division");
            dicAttr.Add("FMLY_NM", "Family");
            dicAttr.Add("PRD_CAT_NM", "Product Verticals");
            dicAttr.Add("SERVER_DEAL_TYPE", "Server Deal Type");
            dicAttr.Add("MRKT_SEG", "Market Segment");
            dicAttr.Add("PAYOUT_BASED_ON", "Payout Based On");
            dicAttr.Add("COMP_SKU", "Meet Comp Sku");
            dicAttr.Add("ECAP_PRICE", "ECAP (Price)");
            dicAttr.Add("VOLUME", "Ceiling Volume");
            dicAttr.Add("VOL_INCR_PRCNT", "Ceiling Volume Increase (%)");
            dicAttr.Add("VOL_INCR_DLLR", "Ceiling Volume Increase ($)");
            dicAttr.Add("END_DT", "End Date");
            dicAttr.Add("END_DT_PUSH", "End Date Push");
            dicAttr.Add("HAS_TRCK", "Has Tracker");
            dicAttr.Add("MTRL_ID", "Material Id");
            dicAttr.Add("DEAL_PRD_NM", "Level 4");
            dicAttr.Add("PCSR_NBR", "Processor Number");
            return dicAttr;
        }
    }

    public enum ExpressionType
    {
        RuleSql = 0,
        RuleDescription,
        ProductSql,
        ProductDescription,
    }
}
