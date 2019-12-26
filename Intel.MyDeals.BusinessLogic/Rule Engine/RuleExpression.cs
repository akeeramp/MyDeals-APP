using Intel.MyDeals.Entities;
using Microsoft.Win32.SafeHandles;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Xml.Linq;
using System.Xml.Serialization;

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

        //public bool ApplyPriceRule(RuleAttribute ruleAttribute, string strPriceRuleExpression)
        //{
        //    var p = Expression.Parameter(typeof(RuleAttribute), typeof(RuleAttribute).Name);
        //    var e = System.Linq.Dynamic.DynamicExpression.ParseLambda(new[] { p }, null, strPriceRuleExpression);
        //    return (bool)e.Compile().DynamicInvoke(ruleAttribute);
        //}

        public List<rule> GetRules(string strJson, List<AttributeTemplate> lstRuleAttribute)
        {
            List<rule> lstRtn = new List<rule>();
            string strRtn = string.Empty;
            if (strJson.StartsWith("[") && strJson.EndsWith("]"))
                strJson = strJson.Remove(strJson.Length - 1, 1).Remove(0, 1);
            if (strJson != string.Empty)
            {
                if (!strJson.Contains("rule"))
                    strJson = string.Concat("{\"rule\":[", strJson, "]}");

                string[] lstStringDataTypesExt = new string[] { "string", "singleselect" };
                string strTempXmlRoot = "rules";
                XNode node = JsonConvert.DeserializeXNode(strJson, strTempXmlRoot);
                StringReader stringReader = new StringReader(node.ToString());
                XmlSerializer serializer = new XmlSerializer(typeof(List<rule>), new XmlRootAttribute(strTempXmlRoot));
                lstRtn = (List<rule>)serializer.Deserialize(stringReader);
                lstRtn.ForEach(x => x.field = lstRuleAttribute.Where(y => y.UI_Code == x.field).First().DB_Code);
            }
            return lstRtn;
        }

        public string GetSqlDynamicColumns(List<AttributeTemplate> lstAttributeTemplate)
        {
            return string.Join(",", lstAttributeTemplate.Where(x => x.IsDirectAttributeValue).Select(x => string.Format("'{0}'", x.DB_Code)));
        }

        public string GetSqlStaticColumns(List<AttributeTemplate> lstAttributeTemplate)
        {
            return string.Join(",", lstAttributeTemplate.Where(x => !x.IsDirectAttributeValue).Select(x => x.InitiateAs == string.Empty ? x.DB_Code : string.Format("{0} AS {1}", x.InitiateAs, x.DB_Code)));
        }

        public string GenerateInsertAttributeScript(List<AttributeTemplate> lstAttributeTemplate)
        {
            return string.Concat("USE [Mydeals]\nGO\n\n", string.Join("\n\n", lstAttributeTemplate.Select(x => string.Format("IF(SELECT COUNT(*) from MYDL_RULE_ATRB_TMPLT WHERE DB_Code = '{0}' AND IsActv = 1) = 0\nINSERT INTO MYDL_RULE_ATRB_TMPLT VALUES('{1}', '{0}', '{2}', {3}, '{4}', 1, 11500950, GETUTCDATE(), 11500950, GETUTCDATE())", x.DB_Code, x.UI_Code, x.SqlDataType, x.IsDirectAttributeValue ? "1" : "0", x.InitiateAs))));
        }

        public string GetLambdaExpression(List<rule> lstRules)
        {
            lstRules.Where(x => x.@operator == "=").ToList().ForEach(x => { x.@operator = "=="; });
            //Sometimes, datatype "double" will have string value as "No YCS2". this will be handled by below lines
            lstRules.Where(x => !lstStringDataTypesExt.Contains(x.type) && !x.value.Contains(",")).ToList().ForEach(x =>
            {
                if (ConvertToData(x.type, x.value).GetType().Name == "String")
                    x.type = "string";
            });
            //Double quotes will be handled by beow line
            lstRules.Where(x => lstStringDataTypesExt.Contains(x.type) && x.value.Contains("\"")).ToList().ForEach(x => { x.value = x.value.Replace("\"", "\"\""); });
            lstRules.Where(x => lstStringDataTypesExt.Contains(x.type)).ToList().ForEach(x => { x.value = string.Concat("\"", x.value, "\""); });
            return string.Join(" AND ", lstRules.Select(x => GetExpression(x)));
        }

        public List<AttributeTemplate> GetAttributeTemplate(string strJson)
        {
            string strTempXmlRoot = "AttributeTemplates";
            XNode node = JsonConvert.DeserializeXNode(strJson, strTempXmlRoot);
            StringReader stringReader = new StringReader(node.ToString());
            XmlSerializer serializer = new XmlSerializer(typeof(List<AttributeTemplate>), new XmlRootAttribute(strTempXmlRoot));
            List<AttributeTemplate> lstRtn = (List<AttributeTemplate>)serializer.Deserialize(stringReader);
            return lstRtn.Distinct(new DistinctItemComparerAttributeTemplate()).OrderBy(x => x.DB_Code).ToList();
        }

        public List<Products> GetProducts(string strJson)
        {
            string strTempXmlRoot = "ProductsRoot";
            XNode node = JsonConvert.DeserializeXNode(strJson, strTempXmlRoot);
            StringReader stringReader = new StringReader(node.ToString());
            XmlSerializer serializer = new XmlSerializer(typeof(List<Products>), new XmlRootAttribute(strTempXmlRoot));
            List<Products> lstRtn = (List<Products>)serializer.Deserialize(stringReader);
            return lstRtn.Distinct(new DistinctItemComparerProducts()).OrderBy(x => x.ProductName).ToList();
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
                strDescription = string.Join("<br/>", lstProducts.Select(x => string.Format("Product = '{0}' AND ECAP (Price) >= ${1}", x.ProductName, x.Price)));
            }

            return strSqlExpression;
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
            criteria.Rules.Where(x => lstStringDataTypes.Contains(x.type) && x.@operator == "LIKE" && x.value.Contains(",")).ToList().ForEach(x =>
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
                    x.value = string.Concat(x.value.Trim().Remove(x.value.Trim().Length - 1, 1), x.@operator == "=" ? "*" : "%");
                    x.@operator = x.@operator == "=" ? "LIKE" : "NOT LIKE";
                });

                criteria.Rules.Where(x => x.type == "date").ToList().ForEach(x => { x.value = Convert.ToDateTime(x.value).ToString("MM/dd/yyyy"); });
                criteria.Rules.Where(x => x.type == "numericOrPercentage").ToList().ForEach(x => { x.field = string.Concat(x.field, (x.valueType == null || x.valueType.value == "%" ? "_PRCNT" : x.valueType.value == "$" ? "_DLLR" : string.Empty)); });
                criteria.Rules.Where(x => x.type != "list" && x.value != string.Empty && lstStringDataTypesExt.Contains(x.type) && x.value.Contains("'")).ToList().ForEach(x => { x.value = x.value.Replace("'", "''"); });
                criteria.Rules.Where(x => x.type != "list" && x.value != string.Empty && lstStringDataTypesExt.Contains(x.type) && x.@operator == "IN").ToList().ForEach(x => { x.value = string.Join(",", x.value.Split(',').Select(y => string.Concat("'", y.Trim(), "'"))); });
                criteria.Rules.Where(x => x.type != "list" && x.value != string.Empty && lstStringDataTypesExt.Contains(x.type)).ToList().ForEach(x => { x.value = x.@operator == "LIKE" ? (x.value.Trim() != "*" && x.value.Trim().EndsWith("*") ? string.Concat("'", x.value.Trim().Remove(x.value.Trim().Length - 1, 1), "%'") : string.Concat("'%", x.value, "%'")) : (x.@operator == "IN" ? x.value : string.Concat("'", x.value, "'")); });
                criteria.Rules.Where(x => x.type != "list" && x.value != string.Empty && x.@operator == "IN").ToList().ForEach(x => { x.value = string.Concat("(", x.value, ")"); });

                lstSqlCriteria.AddRange(criteria.Rules.Where(x => x.type != "list").Select(x => string.Format("{0} {1} {2}", x.field, x.@operator, x.value.Trim())));
                lstDescription.AddRange(criteria.Rules.Where(x => x.type != "list").Select(x => string.Format("{0} {1} {2}", dicAttributes.ContainsKey(x.field) ? dicAttributes[x.field] : "NA", x.@operator, x.value.Trim())));
            }

            if (criteria.Rules.Where(x => x.type == "list").Count() > 0)
            {
                criteria.Rules.Where(x => x.type == "list" && x.value != null && x.value != string.Empty && x.@operator == "IN").ToList().ForEach(x =>
                {
                    x.value = string.Concat("(", string.Join(",", x.value.Split(',').Select(y => string.Concat("'", y.Trim(), "'"))), ")");
                    lstSqlCriteria.Add(string.Format("{0} {1} {2}", x.field, x.@operator, x.value.Trim()));
                    lstDescription.Add(string.Format("{0} {1} {2}", dicAttributes.ContainsKey(x.field) ? dicAttributes[x.field] : "NA", x.@operator, x.value.Trim()));
                });

                criteria.Rules.Where(x => x.type == "list" && x.@operator != "LIKE" && x.values != null && x.values.Count > 0).ToList().ForEach(x =>
                {
                    x.@operator = x.@operator == "!=" ? "NOT IN" : "IN";
                    x.value = string.Concat("(", string.Join(",", x.values.Select(y => string.Concat("'", GetFromDictionary(y, x.field, dicCustomerName, dicEmployeeName).Replace("'", "''"), "'"))), ")");
                    lstSqlCriteria.Add(string.Format("{0} {1} {2}", x.field, x.@operator, x.value.Trim()));
                    lstDescription.Add(string.Format("{0} {1} {2}", dicAttributes.ContainsKey(x.field) ? dicAttributes[x.field] : "NA", x.@operator, x.value.Trim()));
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
                        lstSqlCriteria.Add(string.Join(" OR ", lstMulti.Select(y => string.Format("({0} {1} {2})", y.field, y.@operator, y.value.Trim() != "*" && y.value.Trim().EndsWith("*") ? string.Concat("'", y.value.Trim().Remove(y.value.Trim().Length - 1, 1), "%'") : string.Concat("'%", y.value.Trim(), "%'")))));
                        lstDescription.Add(string.Join(" OR ", lstMulti.Select(y => string.Format("({0} {1} {2})", dicAttributes.ContainsKey(y.field) ? dicAttributes[y.field] : "NA", y.@operator, y.value.Trim() != "*" && y.value.Trim().EndsWith("*") ? string.Concat("'", y.value.Trim().Remove(y.value.Trim().Length - 1, 1), "%'") : string.Concat("'%", y.value.Trim(), "%'")))));
                    }
                });
            }

            criteria.BlanketDiscount.RemoveAll(x => x.value == "0" || x.value == string.Empty);
            if (criteria.BlanketDiscount.Count > 0)
            {
                lstSqlCriteria.Add(string.Concat(strECapPriceCode, " >= (", strCapPriceCode, " - ", criteria.BlanketDiscount.First().valueType.value == "%" ? string.Format("({1} * {0})", (Convert.ToDouble(criteria.BlanketDiscount.First().value) / 100).ToString(), strCapPriceCode) : criteria.BlanketDiscount.First().value, ")"));
                lstDescription.Add(string.Concat(strECapPriceTitle, " >= (", strCapPriceTitle, " - ", criteria.BlanketDiscount.First().valueType.value == "%" ? string.Format("({1} * {0})", (Convert.ToDouble(criteria.BlanketDiscount.First().value) / 100).ToString(), strCapPriceTitle) : criteria.BlanketDiscount.First().value, ")"));
            }

            string strProductDescription = string.Empty;
            dicExpressions.Add(ExpressionType.RuleSql, string.Join(" AND ", lstSqlCriteria.Select(x => string.Concat("(", x, ")"))));
            dicExpressions.Add(ExpressionType.RuleDescription, string.Join("<br/>", lstDescription.Select(x => x)));
            dicExpressions.Add(ExpressionType.ProductSql, GetSqlExpressionForProducts(priceRuleCriteria.ProductCriteria, out strProductDescription));
            dicExpressions.Add(ExpressionType.ProductDescription, strProductDescription);
            return dicExpressions;
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

        string GetExpression(rule rule)
        {
            string strConvertTo = GetToDataType(rule.type);
            switch (rule.@operator)
            {
                case "LIKE":
                    return string.Format("(Convert.To{0}(RuleAttribute.AttrCodeValue[\"{1}\"]).Contains({2}))", strConvertTo, rule.field, rule.value);
                case "IN":
                    return string.Concat("(", string.Join(" OR ", rule.value.Split(',').Select(x => string.Format("(Convert.To{0}(RuleAttribute.AttrCodeValue[\"{1}\"]) == {2})", strConvertTo, rule.field, x))), ")");
                default:
                    return string.Format("(Convert.To{0}(RuleAttribute.AttrCodeValue[\"{1}\"]) {2} {3})", strConvertTo, rule.field, rule.@operator, rule.value);
            }
        }

        string GetToDataType(string strType)
        {
            switch (strType)
            {
                case "money":
                    return "Double";
                case "number":
                    return "Int32";
                default:
                    return "String";
            }
        }

        object ConvertToData(string strType, object objValue)
        {
            switch (strType)
            {
                case "System.Boolean":
                    return objValue.ToString() == "1";
                case "System.DateTime":
                    {
                        DateTime dtDate = DateTime.Now;
                        if (DateTime.TryParse(objValue.ToString(), out dtDate))
                            return dtDate;
                        else
                            return objValue.ToString();
                    }
                case "money":
                case "System.Double":
                    {
                        double dblNumber = 0;
                        if (Double.TryParse(objValue.ToString(), out dblNumber))
                            return dblNumber;
                        else
                            return objValue.ToString();
                    }
                case "number":
                case "System.Int32":
                    {
                        int iNumber = 0;
                        if (Int32.TryParse(objValue.ToString(), out iNumber))
                            return iNumber;
                        else
                            return objValue.ToString();
                    }
                default:
                    return objValue.ToString();
            }
        }

        string ConvertListToXML(List<RuleAttribute> lstRuleAttribute)
        {
            List<RuleAttributeTemp> lstRuleAttributeTemp = (from result in lstRuleAttribute
                                                            select new RuleAttributeTemp
                                                            {
                                                                DcId = result.DcId,
                                                                AttrCodeValue = ((from resultAttrb in result.AttrCodeValue
                                                                                  select new AttrCodeValue
                                                                                  {
                                                                                      Key = resultAttrb.Key,
                                                                                      Value = resultAttrb.Value
                                                                                  }).ToList())
                                                            }).ToList();

            // Define the root element to avoid ArrayOfBranch
            var serializer = new XmlSerializer(typeof(List<RuleAttributeTemp>));
            using (var stream = new StringWriter())
            {
                serializer.Serialize(stream, lstRuleAttributeTemp);
                return stream.ToString();
            }
        }
    }

    class DistinctItemComparerAttributeTemplate : IEqualityComparer<AttributeTemplate>
    {
        public bool Equals(AttributeTemplate x, AttributeTemplate y)
        {
            return x.DB_Code == y.DB_Code && x.SqlDataType == y.SqlDataType;
        }

        public int GetHashCode(AttributeTemplate obj)
        {
            return obj.DB_Code.GetHashCode() ^ obj.SqlDataType.GetHashCode();
        }
    }

    class DistinctItemComparerProducts : IEqualityComparer<Products>
    {
        public bool Equals(Products x, Products y)
        {
            return x.ProductName == y.ProductName && x.Price == y.Price;
        }

        public int GetHashCode(Products obj)
        {
            return obj.ProductName.GetHashCode() ^ obj.Price.GetHashCode();
        }
    }

    public class RuleAttribute
    {
        public int DcId { get; set; }
        public Dictionary<string, object> AttrCodeValue { get; set; }
    }

    public class RuleAttributeTemp
    {
        public int DcId { get; set; }
        public List<AttrCodeValue> AttrCodeValue { get; set; }
    }

    public class AttrCodeValue
    {
        public string Key { get; set; }
        public object Value { get; set; }
    }

    public class AttributeTemplate
    {
        public string UI_Code { get; set; }
        public string DB_Code { get; set; }
        public string SqlDataType { get; set; }
        public bool IsDirectAttributeValue { get; set; }
        public string InitiateAs { get; set; }
    }

    public enum ExpressionType
    {
        RuleSql = 0,
        RuleDescription,
        ProductSql,
        ProductDescription,
    }
}
