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
            return lstRtn.Distinct(new DistinctItemComparerProducts()).OrderBy(x => x.Product).ToList();
        }

        public string GetSqlExpressionForProducts(List<Products> lstProduct)
        {
            return string.Join(" OR ", lstProduct.Select(x => string.Format("({0} = ''{1}'' AND {2} = {3})", x.ProductAttribute, x.Product, x.PriceAttribute, x.Price)));
        }

        string[] strStringDataTypes = new string[] { "string", "singleselect" };
        public string GetSqlExpression(List<rule> lstRules)
        {
            lstRules.Where(x => x.@operator == "!=").ToList().ForEach(x => { x.@operator = "<>"; });
            lstRules.Where(x => strStringDataTypes.Contains(x.type) && x.@operator == "IN").ToList().ForEach(x => { x.value = string.Join(",", x.value.Split(',').Select(y => string.Concat("'", y, "'"))); });
            lstRules.Where(x => strStringDataTypes.Contains(x.type) && x.value.Contains("'")).ToList().ForEach(x => { x.value = x.value.Replace("'", "''"); });
            lstRules.Where(x => strStringDataTypes.Contains(x.type)).ToList().ForEach(x => { x.value = x.@operator == "LIKE" ? string.Concat("''%", x.value, "%''") : string.Concat("''", x.value, "''"); });
            lstRules.Where(x => x.@operator == "IN").ToList().ForEach(x => { x.value = string.Concat("(", x.value, ")"); });
            return string.Join(" AND ", lstRules.Select(x => string.Format("{0} {1} {2}", x.field, x.@operator, x.value)));
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
            return x.Product == y.Product && x.Price == y.Price;
        }

        public int GetHashCode(Products obj)
        {
            return obj.Product.GetHashCode() ^ obj.Price.GetHashCode();
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

    public class Products
    {
        public string ProductAttribute { get; set; }
        public string Product { get; set; }
        public string PriceAttribute { get; set; }
        public string Price { get; set; }
    }
}
