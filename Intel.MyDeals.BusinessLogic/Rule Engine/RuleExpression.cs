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

                string[] strStringDataTypes = new string[] { "string", "singleselect" };
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
            lstRules.Where(x => !strStringDataTypes.Contains(x.type) && !x.value.Contains(",")).ToList().ForEach(x =>
            {
                if (ConvertToData(x.type, x.value).GetType().Name == "String")
                    x.type = "string";
            });
            //Double quotes will be handled by beow line
            lstRules.Where(x => strStringDataTypes.Contains(x.type) && x.value.Contains("\"")).ToList().ForEach(x => { x.value = x.value.Replace("\"", "\"\""); });
            lstRules.Where(x => strStringDataTypes.Contains(x.type)).ToList().ForEach(x => { x.value = string.Concat("\"", x.value, "\""); });
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

        public string GetSqlExpressionForProducts(List<Products> lstProduct)
        {
            if (lstProduct.Count > 0)
            {
                lstProduct.RemoveAll(x => x.Price <= 0);
            }
            return lstProduct.Count > 0 ? string.Concat("(", string.Join(" OR ", lstProduct.Select(x => string.Format("(PRODUCT_FILTER = '{0}' AND ECAP_PRICE >= {1})", x.ProductName, x.Price))), ")") : string.Empty;
        }

        string[] strStringDataTypes = new string[] { "string", "singleselect", "date" };
        public string GetSqlExpression(Criteria criteria, Dictionary<int, string> dicCustomerName, Dictionary<int, string> dicEmployeeName)
        {
            string strSqlCriteria = string.Empty;
            criteria.BlanketDiscount.RemoveAll(x => x.value == "0" || x.value == string.Empty);
            if (criteria.BlanketDiscount.Count > 0)
            {
                strSqlCriteria = string.Concat("(OBJ_SET_TYPE_CD = 'ECAP') AND (ECAP_PRICE >= (CAP_PRICE - ", criteria.BlanketDiscount.First().valueType.value == "%" ? string.Format("(CAP_PRICE * {0})", (Convert.ToDouble(criteria.BlanketDiscount.First().value) / 100).ToString()) : criteria.BlanketDiscount.First().value, "))");
                criteria.Rules.RemoveAll(x => x.field == "OBJ_SET_TYPE_CD" && x.value == "ECAP");
            }

            criteria.Rules.Where(x => x.field == "CRE_EMP_NAME").ToList().ForEach(x => { x.value = dicEmployeeName.ContainsKey(Convert.ToInt32(x.value)) ? dicEmployeeName[Convert.ToInt32(x.value)] : x.value; });
            criteria.Rules.Where(x => x.type != "list" && x.@operator == "!=").ToList().ForEach(x => { x.@operator = "<>"; });
            criteria.Rules.Where(x => x.type != "list" && x.@operator == "!=").ToList().ForEach(x => { x.@operator = "<>"; });
            criteria.Rules.Where(x => x.type == "date").ToList().ForEach(x => { x.value = Convert.ToDateTime(x.value).ToString("MM/dd/yyyy"); });
            criteria.Rules.Where(x => x.type == "numericOrPercentage").ToList().ForEach(x => { x.field = string.Concat(x.field, (x.valueType == null || x.valueType.value == "%" ? "_PRCNT" : x.valueType.value == "$" ? "_DLLR" : string.Empty)); });
            criteria.Rules.Where(x => x.type != "list" && x.value != string.Empty && strStringDataTypes.Contains(x.type) && x.value.Contains("'")).ToList().ForEach(x => { x.value = x.value.Replace("'", "''"); });
            criteria.Rules.Where(x => x.type != "list" && x.value != string.Empty && strStringDataTypes.Contains(x.type) && x.@operator == "IN").ToList().ForEach(x => { x.value = string.Join(",", x.value.Split(',').Select(y => string.Concat("'", y, "'"))); });
            criteria.Rules.Where(x => x.type != "list" && x.value != string.Empty && strStringDataTypes.Contains(x.type)).ToList().ForEach(x => { x.value = x.@operator == "LIKE" ? string.Concat("'%", x.value, "%'") : string.Concat("'", x.value, "'"); });
            criteria.Rules.Where(x => x.type != "list" && x.value != string.Empty && x.@operator == "IN").ToList().ForEach(x => { x.value = string.Concat("(", x.value, ")"); });
            strSqlCriteria = string.Concat(strSqlCriteria, strSqlCriteria != string.Empty && strSqlCriteria.Trim().EndsWith("AND") == false ? " AND " : string.Empty, string.Join(" AND ", criteria.Rules.Where(x => x.type != "list").Select(x => string.Format("{0} {1} {2}", x.field, x.@operator, x.value))));

            if (criteria.Rules.Where(x => x.type == "list").Count() > 0)
            {
                criteria.Rules.Where(x => x.type == "list" && x.@operator != "LIKE").ToList().ForEach(x =>
                  {
                      x.@operator = "IN";
                      x.value = string.Concat("(", string.Join(",", x.values.Select(y => string.Concat("'", (x.field == "CUST_NM" && dicCustomerName.ContainsKey(Convert.ToInt32(y)) ? dicCustomerName[Convert.ToInt32(y)] : y).Replace("'", "''"), "'"))), ")");
                  });

                strSqlCriteria = string.Concat(strSqlCriteria, strSqlCriteria != string.Empty && strSqlCriteria.Trim().EndsWith("AND") == false ? " AND " : string.Empty, string.Join(" AND ", criteria.Rules.Where(x => x.type == "list" && x.@operator != "LIKE").Select(x => string.Format("{0} {1} {2}", x.field, x.@operator, x.value))));

                List<rule> lstMulti = new List<rule>();
                criteria.Rules.Where(x => x.type == "list" && x.@operator == "LIKE").ToList().ForEach(x =>
                {
                    List<rule> lstTemp = (from result in x.values
                                          select new rule
                                          {
                                              type = "string",
                                              value = x.field == "CUST_NM" && dicCustomerName.ContainsKey(Convert.ToInt32(result)) ? dicCustomerName[Convert.ToInt32(result)] : result,
                                              field = x.field,
                                              @operator = x.@operator
                                          }).ToList();
                    lstMulti.AddRange(lstTemp);
                });

                if (lstMulti.Count > 0)
                    strSqlCriteria = string.Concat(strSqlCriteria, strSqlCriteria != string.Empty && strSqlCriteria.Trim().EndsWith("AND") == false ? " AND (" : "(", string.Join(" OR ", lstMulti.Select(x => string.Format("{0} {1} {2}", x.field, x.@operator, string.Concat("'%", x.value, "%'")))), ")");
            }

            return strSqlCriteria;
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
}
