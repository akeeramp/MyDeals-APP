using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.IBusinessLogic;
using System.Text.RegularExpressions;
using System;
using System.Collections.Specialized;
using System.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class ProductsLib : IProductsLib
    {
        private readonly IProductDataLib _productDataLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        private readonly IConstantsLookupsLib _constantsLookupsLib;

        public ProductsLib(IProductDataLib productDataLib, IDataCollectionsDataLib dataCollectionsDataLib, IConstantsLookupsLib constantsLookupsLib)
        {
            _productDataLib = productDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;

            _constantsLookupsLib = constantsLookupsLib;
        }

        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public ProductsLib()
        {
            _productDataLib = new ProductDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();
        }

        #region Products

        /// <summary>
        /// Get All Products
        /// </summary>
        /// <returns>list of Product data</returns>
        public List<Product> GetProducts(bool getCachedResult = true)
        {
            if (!getCachedResult)
            {
                _productDataLib.GetProducts();
            }
            return _dataCollectionsDataLib.GetProductData();
        }

        public List<Product> GetProductsDetails(bool getCachedResult = true)
        {
            if (!getCachedResult)
            {
                _productDataLib.GetProducts();
            }
            return _dataCollectionsDataLib.GetProductData();
        }

        public List<Product> GetProductsDetailsByDates(DateTime startDate, DateTime endDate)
        {
            return _dataCollectionsDataLib.GetProductData().Where(x => x.PRD_STRT_DTM <= endDate && x.PRD_END_DTM >= startDate).ToList();
        }

        /// <summary>
        /// Get specific Product
        /// </summary>
        /// <input>int sid of desired Product</input>
        /// <returns>Product data</returns>
        public Product GetProduct(int sid)
        {
            return GetProducts().FirstOrDefault(c => c.PRD_MBR_SID == sid);
        }

        /// <summary>
        /// Get All Active Products
        /// </summary>
        /// <returns>list of Product data flagged as active</returns>
        public List<Product> GetProductsActive()
        {
            return GetProducts().Where(c => c.ACTV_IND).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Product Category Name
        /// </summary>
        /// <input>string name which is what will be filtered against (example: 'NAND')</input>
        /// <returns>list of Product data containing specified Product category name</returns>
        public List<Product> GetProductByCategoryName(string name, bool getCachedResult = true)
        {
            if (!getCachedResult)
            {
                return GetProducts(getCachedResult).Where(c => c.PRD_CAT_NM.Contains(name)).ToList();
            }
            return GetProducts().Where(c => c.PRD_CAT_NM.Contains(name)).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Product Category SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 9)</input>
        /// <returns>list of Product data matching specified Product category sid</returns>
        public List<Product> GetProductByCategorySid(int sid)
        {
            return GetProducts().Where(c => c.PRD_CAT_NM_SID == sid).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Product Family Name
        /// </summary>
        /// <input>string name which is what will be filtered against (example: 'SandyBridge')</input>
        /// <returns>list of Product data containing specified Product family name</returns>
        public List<Product> GetProductByFamilyName(string name)
        {
            return GetProducts().Where(c => c.FMLY_NM.Contains(name)).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Product Family SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 18)</input>
        /// <returns>list of Product data matching specified Product family sid</returns>
        public List<Product> GetProductByFamilySid(int sid)
        {
            return GetProducts().Where(c => c.FMLY_NM_SID == sid).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Product Brand Name
        /// </summary>
        /// <input>string name which is what will be filtered against (example: 'Atom')</input>
        /// <returns>list of Product data containing specified Product Brand name</returns>
        public List<Product> GetProductByBrandName(string name)
        {
            return GetProducts().Where(c => c.BRND_NM.Contains(name)).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Product Brand SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 17)</input>
        /// <returns>list of Product data matching specified Product Brand sid</returns>
        public List<Product> GetProductByBrandSid(int sid)
        {
            return GetProducts().Where(c => c.BRND_NM_SID == sid).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Product Processor Number name
        /// </summary>
        /// <input>string name which is what will be filtered against (example: 'i7-6700K')</input>
        /// <returns>list of Product data containing specified Product Processor Number name</returns>
        public List<Product> GetProductByProcessorNumberName(string name)
        {
            return GetProducts().Where(c => c.PCSR_NBR.Contains(name)).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Processor Number SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 56345)</input>
        /// <returns>list of Product data matching specified Product Processor Number sid</returns>
        public List<Product> GetProductByProcessorNumberSid(int sid)
        {
            return GetProducts().Where(c => c.PCSR_NBR_SID == sid).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Deal Product Type name
        /// </summary>
        /// <input>string name which is what will be filtered against (example: 'CPU')</input>
        /// <returns>list of Product data containing specified Deal Product Type name</returns>
        public List<Product> GetProductByDealProductTypeName(string name)
        {
            return GetProducts().Where(c => c.DEAL_PRD_TYPE.Contains(name)).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Deal Product Type SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 3)</input>
        /// <returns>list of Product data matching specified Deal Product Type sid</returns>
        public List<Product> GetProductByDealProductTypeSid(int sid)
        {
            return GetProducts().Where(c => c.DEAL_PRD_TYPE_SID == sid).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Deal Product Name Name
        /// </summary>
        /// <input>string name which is what will be filtered against (example: 'MKLWG')</input>
        /// <returns>list of Product data containing specified Product family name</returns>
        public List<Product> GetProductByDealProductName(string name)
        {
            return GetProducts().Where(c => c.DEAL_PRD_NM.Contains(name)).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Deal Product Name SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 46882)</input>
        /// <returns>list of Product data matching specified Product family sid</returns>
        public List<Product> GetProductByDealProductNameSid(int sid)
        {
            return GetProducts().Where(c => c.DEAL_PRD_NM_SID == sid).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Product Material Id Name
        /// </summary>
        /// <input>string name which is what will be filtered against (example: '892544')</input>
        /// <returns>list of Product data containing specified Product Brand name</returns>
        public List<Product> GetProductByMaterialIdName(string id)  //note: material "id" is a string? db pulling this as string instead of int?
        {
            return GetProducts().Where(c => c.MTRL_ID == id).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Product Material Id SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 4325)</input>
        /// <returns>list of Product data matching specified Product Brand sid</returns>
        public List<Product> GetProductByMaterialIdSid(int sid)
        {
            return GetProducts().Where(c => c.MTRL_ID_SID == sid).ToList();
        }

        /// <summary>
        /// Translate user entered products into valid products
        /// ex: i5-2400(s) --> i5-2400, i5-2400s
        /// </summary>
        /// <param name="products"></param>
        /// <returns></returns>
        public ProductLookup TranslateProducts(List<ProductEntryAttribute> prodNames, int CUST_MBR_SID, string GEO_MBR_SID)
        {
            //var prodNames = new List<string>();
            var userProducts = prodNames.Select(l => l.USR_INPUT).ToList();
            var productsTodb = new List<ProductEntryAttribute>();
            var productLookup = new ProductLookup
            {
                ProdctTransformResults = new Dictionary<string, List<string>>(),
                DuplicateProducts = new Dictionary<string, Dictionary<string, List<PRD_LOOKUP_RESULTS>>>(),
                ValidProducts = new Dictionary<string, Dictionary<string, List<PRD_LOOKUP_RESULTS>>>(),
                InValidProducts = new Dictionary<string, List<string>>()
            };

            //  Check if any product has alias mapping, this will call cache
            var aliasMapping = GetProductsFromAlias();

            foreach (var userProduct in prodNames)
            {
                var products = TransformProducts(userProduct.USR_INPUT);
                var prodTemp = products;
                foreach (var product in prodTemp.ToList())
                {
                    string productName = product.ToString().Trim();
                    if (productName.Contains(" "))//Checking for Long Text search like DT I3
                    {
                        string[] prodductSplit = productName.Split(' ');
                        string finalProdName = "";
                        List<ProductEntryAttribute> prodNamesListSplit = new List<ProductEntryAttribute>();
                        foreach (var ps in prodductSplit)
                        {
                            ProductEntryAttribute peaSplitList = new ProductEntryAttribute();
                            peaSplitList.USR_INPUT = ps.ToString();
                            prodNamesListSplit.Add(peaSplitList);
                        }

                        var productAliasesSplit = (from p in prodNamesListSplit
                                                   join a in aliasMapping
                                                   on p.USR_INPUT equals a.PRD_ALS_NM into pa
                                                   from t in pa.DefaultIfEmpty()
                                                   select new ProductEntryAttribute
                                                   {
                                                       USR_INPUT = t == null ? p.USR_INPUT : t.PRD_NM
                                                   }).Distinct();

                        foreach (var pas in productAliasesSplit)
                        {
                            finalProdName = finalProdName + ' ' + pas.USR_INPUT.ToString();
                        }
                        finalProdName = finalProdName.Remove(0, 1);
                        int index = products.IndexOf(productName);
                        if (index != -1)
                            products[index] = finalProdName;
                    }
                }
                List<ProductEntryAttribute> prodNamesList = new List<ProductEntryAttribute>();
                foreach (var product in products)
                {
                    ProductEntryAttribute pea = new ProductEntryAttribute();
                    pea.ROW_NUMBER = userProduct.ROW_NUMBER;
                    pea.USR_INPUT = product.ToString();
                    pea.START_DATE = userProduct.START_DATE.ToString();
                    pea.END_DATE = userProduct.END_DATE.ToString();
                    pea.EXCLUDE = userProduct.EXCLUDE;
                    pea.FILTER = userProduct.FILTER;
                    prodNamesList.Add(pea);
                }
                var productAliases = (from p in prodNamesList
                                      join a in aliasMapping
                                      on p.USR_INPUT equals a.PRD_ALS_NM into pa
                                      from t in pa.DefaultIfEmpty()
                                      select new ProductEntryAttribute
                                      {
                                          ROW_NUMBER = p.ROW_NUMBER,
                                          USR_INPUT = t == null ? p.USR_INPUT : t.PRD_NM,
                                          EXCLUDE = p.EXCLUDE,
                                          FILTER = p.FILTER,
                                          END_DATE = p.END_DATE,
                                          START_DATE = p.START_DATE
                                      }).Distinct();

                productsTodb.AddRange(productAliases);
                productLookup.ProdctTransformResults[userProduct.ROW_NUMBER.ToString()] = productAliases.Select(x => x.ROW_NUMBER.ToString()).ToList(); // Adding ROW_NUMBER as a key
                productLookup.ProdctTransformResults[userProduct.ROW_NUMBER.ToString()] = productAliases.Select(x => x.USR_INPUT).ToList(); // Adding ROW_NUMBER as a key
            }

            //  Product match master list
            var productMatchResults = GetProductDetails(productsTodb, CUST_MBR_SID, GEO_MBR_SID);
            // Get duplicate and Valid Products
            ExtractValidandDuplicateProducts(productLookup, productMatchResults);

            return productLookup;
        }

        /// <summary>
        /// Extract the Duplicate, BValid and Invalid Products
        /// Step 1: Get matching products for a particular row from master match list
        /// Step 2: Find duplicate match products,
        /// Step 3: Find Valid Products
        /// Step 4: Products which exists in Step 1 and does not exists in Step 2, 3 are invalid products
        /// </summary>
        /// <param name="productLookup">Result object</param>
        /// <param name="productMatchResults">Master Product match list</param>
        private static void ExtractValidandDuplicateProducts(ProductLookup productLookup, List<PRD_LOOKUP_RESULTS> productMatchResults)
        {
            foreach (var userProduct in productLookup.ProdctTransformResults)
            {
                // Step 1: Get matching products for a particular row from master match list
                var tranlatedProducts = productLookup.ProdctTransformResults[userProduct.Key];

                //Step 2.1: Checking for Conflict upto Family Name
                var isConflict = (from p in productMatchResults
                                  join t in tranlatedProducts
                                  on p.USR_INPUT equals t
                                  group p by new
                                  {
                                      p.USR_INPUT,
                                      p.DEAL_PRD_TYPE,
                                      p.PRD_CAT_NM,
                                      p.BRND_NM,
                                      p.FMLY_NM
                                  }
                                     into d
                                  select d.Key).ToList();

                // Step 2.2: Find duplicate match products
                var duplicateProds = from p in isConflict
                                     group p by p.USR_INPUT
                                     into d
                                     where d.Count() > 1
                                     select d.Key;

                // Step 2.3: Get the products which are not matched
                var productWithoutExactMatch = (from p in productMatchResults
                                                join t in tranlatedProducts
                                                on p.USR_INPUT equals t
                                                where !p.EXACT_MATCH
                                                select t).Distinct();
                
                // Get distinct user inputs where user interaction needed from UI, put them in Duplicate product bucket list
                duplicateProds = duplicateProds.Union(productWithoutExactMatch).Distinct();

                // If any duplicates found extract them
                if (duplicateProds.Any())
                {
                    var duplicateRecords = productMatchResults.FindAll(p => duplicateProds.Contains(p.USR_INPUT));

                    var records = new Dictionary<string, List<PRD_LOOKUP_RESULTS>>();

                    duplicateProds.ToList().ForEach(d => records[d] = new List<PRD_LOOKUP_RESULTS>());

                    duplicateRecords.ForEach(r => records[r.USR_INPUT].Add(r));

                    productLookup.DuplicateProducts[userProduct.Key] = records;
                }

                // Step 3: Find the Valid products

                //productLookup.ValidProducts[userProduct.Key] = new List<PRD_LOOKUP_RESULTS>();

                var validProducts = productMatchResults.Where(p => !duplicateProds.Contains(p.USR_INPUT)
                                                            && tranlatedProducts.Any(t => t.Equals(p.USR_INPUT, StringComparison.InvariantCultureIgnoreCase)));

                var isConflictValid = from p in validProducts
                                      group p by p.USR_INPUT
                                        into d
                                      select d.Key;
                if (isConflictValid.Any())
                {
                    var validProduct = productMatchResults.FindAll(p => isConflictValid.Contains(p.USR_INPUT));
                    var validRecords = new Dictionary<string, List<PRD_LOOKUP_RESULTS>>();
                    isConflictValid.ToList().ForEach(d => validRecords[d] = new List<PRD_LOOKUP_RESULTS>());
                    validProduct.ForEach(r => validRecords[r.USR_INPUT].Add(r));
                    productLookup.ValidProducts[userProduct.Key] = validRecords;
                }

                productLookup.InValidProducts[userProduct.Key] = new List<string>();

                // Step 4: Find InValid products, products which are present in master match result and not present in duplicate products and valid products
                productLookup.InValidProducts[userProduct.Key] = tranlatedProducts.Where(t => !duplicateProds.Contains(t) &&
                                                                !validProducts.Any(v => v.USR_INPUT.Equals(t, StringComparison.InvariantCultureIgnoreCase))).ToList();
            }
        }

        /// <summary>
        /// Get the product match results
        /// </summary>
        /// <param name="productsToMatch"></param>
        /// <returns></returns>
        public List<PRD_LOOKUP_RESULTS> FindProductMatch(List<ProductEntryAttribute> productsToMatch)
        {
            return _productDataLib.FindProductMatch(productsToMatch);
        }

        public List<PRD_LOOKUP_RESULTS> GetProductDetails(List<ProductEntryAttribute> productsToMatch, int CUST_MBR_SID, string GEO_MBR_SID)
        {
            return _productDataLib.GetProductDetails(productsToMatch, CUST_MBR_SID, GEO_MBR_SID);
        }

        /// <summary>
        /// Transform the single row user inputted products to Mydeals products
        /// </summary>
        /// <param name="userProduct">e.g: i5 2400(S,T),H61</param>
        /// <returns></returns>
        public List<string> TransformProducts(string userProduct)
        {
            string EPMString = "";
            // Checking for any EPM name present inside "" and extracting the EPM name will add it at the END
            if (userProduct.Contains('"'))
            {
                var empArr = userProduct.Split('"', '"');
                if(empArr.Length > 0)
                {
                    EPMString = empArr[1];
                }
                userProduct = userProduct.Replace("\"", "");
                int index = userProduct.IndexOf(EPMString);                
                userProduct = (index < 0)
                    ? userProduct
                    : userProduct.Remove(index, EPMString.Length);
            }

            //Getting value from Constant Table
            string charset = "";
            var charsetResult = _constantsLookupsLib.GetConstantsByName("PROD_REPLACE_CHARSET"); // NULL Check
            if (charsetResult != null)
                charset = charsetResult.CNST_VAL_TXT;

            string userProd = Regex.Replace(userProduct, @"(?<=\([^()]*),", "/");
            userProd = Regex.Replace(userProd, @"\s+", " ");// Replace multiple spaces with single line
            userProd = Regex.Replace(userProd, @"\s*([-])\s", "$1"); // Replace multiple space before and after - (Hyphen)

            userProd = Regex.Replace(userProd, " OR ", @"~", RegexOptions.IgnoreCase); // Replace OR with ~
            userProd = userProd.Replace("&", "~"); // Replace & with ~

            // Replace forward slash product separator
            var replaceSlashRegex = new Regex(@"\([^\)]*\)|(/)");
            var replaceSlash = replaceSlashRegex.Replace(userProd, delegate (Match m)
            {
                if (m.Groups[1].Value == "") return m.Groups[0].Value;
                else return "~";
            });

            // Replace comma product separator
            var replaceCommaRegex = new Regex(@"\([^\)]*\)|(,)");
            var replaceComma = replaceCommaRegex.Replace(replaceSlash, delegate (Match m)
            {
                if (m.Groups[1].Value == "") return m.Groups[0].Value;
                else return "~";
            });

            string[] splits = Regex.Split(replaceComma, "~");
            var singleProducts = new List<string>();

            string[] chararr = charset.Split(',');

            foreach (var p in splits.Where(p => !string.IsNullOrEmpty(p)))
            {
                string strRep = string.Empty;
                var item = Regex.Replace(p.Trim(), @"\s+", " ");
                if (charset.Length > 0)
                {
                    foreach (string row in chararr)
                    {
                        if (item.IndexOf(row) == 0)
                        {
                            strRep = item.Replace(row, row.Trim() + '-');
                            break;
                        }
                        else
                        {
                            strRep = item;
                        }
                    }

                    item = strRep;
                }

                if (item.Contains('(') && item.Contains(')'))
                {
                    var productNames = item.Split('(', ')');
                    singleProducts.Add(productNames[0]);
                    var innerItems = productNames[1].Split('/');

                    foreach (var character in innerItems.Where(i => !string.IsNullOrEmpty(i)))
                    {
                        singleProducts.Add(productNames[0] + character.Trim());
                    }
                }
                else
                {
                    singleProducts.Add(item.Trim());
                }
            }
            //Adding EPM name
            if(EPMString.Length > 0)
            {
                singleProducts.Add(EPMString);
                EPMString = "";
            }
            return singleProducts;
        }

        /// <summary>
        /// Translate user entered products into valid products
        /// ex: i5-2400(s) --> i5-2400, i5-2400s
        /// </summary>
        /// <param name="products"></param>
        /// <returns></returns>
        public ProductLookup FetchProducts(List<ProductIEValues> prodNames)
        {
            var productLookup = new ProductLookup
            {
                ProdctTransformResults = new Dictionary<string, List<string>>(),
                DuplicateProducts = new Dictionary<string, Dictionary<string, List<PRD_LOOKUP_RESULTS>>>(),
                ValidProducts = new Dictionary<string, Dictionary<string, List<PRD_LOOKUP_RESULTS>>>(),
                InValidProducts = new Dictionary<string, List<string>>()
            };
            return productLookup;
        }

        /// <summary>
        /// Translate user entered products into valid products
        /// ex: i5-2400(s) --> i5-2400, i5-2400s
        /// </summary>
        /// <param name="products"></param>
        /// <returns></returns>
        //public List<ProductIncExcAttribute> SetIncludeExclude(CrudModes mode, ProductIncExcAttribute data)
        //{
        //    return _productDataLib.SetProductAlias(mode, data);
        //}

        /// <summary>
        /// Get include attribute list for product
        /// </summary>
        /// <param type="List<ProductIncExcAttribute>" name="prodNames"></param>
        /// <returns type="ProductIncExcAttribute">List of exclude attribute</returns>
        public List<ProductIncExcAttribute> SetIncludeAttibute(List<ProductIncExcAttribute> prodNames)
        {
            return _productDataLib.SetIncludeExclude(prodNames, "INCLUDE");
        }

        /// <summary>
        /// Get exclude attribute list for product
        /// </summary>
        /// <param name="prodNames"></param>
        /// <returns type="ProductIncExcAttribute">List of exclude attribute</returns>
        public List<ProductIncExcAttribute> SetExcludeAttibute(List<ProductIncExcAttribute> prodNames)
        {
            return _productDataLib.SetIncludeExclude(prodNames, "EXCLUDE");
        }

        /// <summary>
        /// This method will return 3 dataset
        /// 1- Get the attribute list from master
        /// 2- Get the include attribute list
        /// 3- Get the exclude attribute list
        /// </summary>
        /// <returns type="ProductIncExcAttributeSelector">List of inclide, exclude and master attribute</returns>
        public ProductIncExcAttributeSelector GetProductIncludeExcludeAttribute()
        {
            return _productDataLib.GetProductIncludeExcludeAttribute(); //return new IncExcAttributeMaster();
        }

        /// <summary>
        /// Get Product Deal Type
        /// </summary>
        /// <returns type="List<PrdDealType>"> List of product deal type</returns>
        public List<PrdDealType> GetProdDealType()
        {
            return _productDataLib.GetProdDealType();
        }

        /// <summary>
        /// Get Product Selection Level
        /// </summary>
        /// <param name="OBJ_SET_TYPE_SID"></param>
        /// <returns> type="List<PrdSelLevel>">List of product selection level</returns>
        public List<PrdSelLevel> GetProdSelectionLevel(int OBJ_SET_TYPE_SID)
        {
            return _productDataLib.GetProdSelectionLevel(OBJ_SET_TYPE_SID);
        }

        #endregion Products

        #region ProductAlias

        /// <summary>
        /// To Insert, Update, Delete the Products and Alias in ProductAlias
        /// </summary>
        /// <input type="CrudModes">To pass the command like Select,Insert, Update, Delete</input>
        /// <input Type="ProductAlias">Product alias data</input>
        /// <returns type="List<ProductAlias>">List of affected rows</returns>
        public List<ProductAlias> SetProductAlias(CrudModes mode, ProductAlias data)
        {
            // Before adding a Alias mapping for a product check if Mydeals has the product
            var product = new List<string>();
            product.Add(data.PRD_NM);
            product.Add(data.PRD_ALS_NM);
            var isValidProduct = _productDataLib.SetProductAlias(mode, data);
            if (mode == CrudModes.Insert || mode == CrudModes.Update)
            {
                if (!isValidProduct.Where(x => x.PRD_NM == data.PRD_NM).Any())
                {
                    throw new Exception($"The product name \"{data.PRD_NM}\" you are trying to map does not exists in Mydeals.");
                }
                if (!isValidProduct.Where(x => x.PRD_ALS_NM == data.PRD_ALS_NM).Any())
                {
                    throw new Exception($" \"{data.PRD_ALS_NM}\" is valid product name in MyDeals, this cannot be added as alias name.");
                }
            }

            return isValidProduct;
        }

        /// <summary>
        /// Get All products and alias from ProductAlias
        /// </summary>
        /// <returns type="List<ProductAlias>">List of All Products and Alias</returns>
        public List<ProductAlias> GetProductsFromAlias(bool getCachedResult = true)
        {
            if (!getCachedResult)
            {
                return _productDataLib.GetProductsFromAlias();
            }
            return _dataCollectionsDataLib.GetProductsFromAlias();
        }

        #endregion ProductAlias

        #region Suggest Products

        /// <summary>
        /// TODO: Remove this method once corrector also starts using this method for suggestion
        /// </summary>
        /// <param name="prdEntered"></param>f
        /// <param name="returnMax"></param>
        /// <returns></returns>
        public List<Product> SuggestProducts(string prdEntered, int? returnMax, IList<Product> prds = null)
        {
            const int defaultReturnedMaxRecords = 5;

            int returnMaxRecords = returnMax ?? defaultReturnedMaxRecords;

            prdEntered = prdEntered.Replace("?", "."); // Replace any single character wildcards with regex single character token (?)
            List<string> words = prdEntered.Split('*').ToList(); // Break into list on wildcard characters (*)

            //List<string> words = new List<string> { "(e4400)", "(80..7)" };
            string pattern = string.Join("|", words);
            Regex regex = new Regex(pattern, RegexOptions.IgnoreCase);

            // this takes time if it is the first time to load into cache
            if (prds == null)
            {
                prds = GetProductsDetails();
            }

            IEnumerable<ProductHash> hashPrds = from prd in prds
                                                select new ProductHash
                                                {
                                                    Id = prd.PRD_MBR_SID,
                                                    HashName = prd.HIER_VAL_NM
                                                };

            List<NodeMatch> myMatches = new List<NodeMatch>();
            foreach (ProductHash productHash in hashPrds)
            {
                MatchCollection matches = regex.Matches(productHash.HashName.ToUpper());
                if (matches.Count > 0)
                {
                    int matchesLength = 0;
                    string matchVal = "";
                    foreach (Match match in matches)
                    {
                        matchesLength += match.Length;
                        matchVal += match.Value;
                    }

                    float weight = ((float)matchesLength / (float)productHash.HashName.Length) * 100;

                    NodeMatch newMatch = new NodeMatch
                    {
                        ID = productHash.Id,
                        Value = productHash.HashName,
                        MatchVal = matchVal,
                        MatchLen = matchesLength,
                        MatchCount = matches.Count,
                        Weight = weight
                    };
                    myMatches.Add(newMatch);
                }
            }

            List<NodeMatch> SortedList = myMatches.OrderByDescending(o => o.MatchLen).ThenByDescending(o => o.Weight).ToList();
            List<int> matchedIDs = SortedList.Take(returnMaxRecords).Select(p => p.ID).ToList();
            List<Product> rtn = prds.Where(p => matchedIDs.Contains(p.PRD_MBR_SID)).ToList();

            foreach (var p in rtn)
            {
                p.USR_INPUT = prdEntered;
            }

            List<Product> Final = new List<Product>();
            Final.AddRange(rtn);

            return Final;
        }

        #endregion Suggest Products

        /// <summary>
        /// Get product selection levels
        /// </summary>
        /// <returns></returns>
        public ProductSelectorWrapper GetProductSelectorWrapper()
        {
            return _dataCollectionsDataLib.GetProductSelectorWrapper();
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public ProductSelectorWrapper GetProductSelectorWrapperByDates(DateTime startDate, DateTime endDate)
        {
            var productSelectorWrapper = GetProductSelectorWrapper();
            var productSelectionLevels = productSelectorWrapper.ProductSelectionLevels.
                Where(x => x.PRD_STRT_DTM <= endDate && x.PRD_END_DTM >= startDate);
            var productSelectionLevelsAttributes = productSelectorWrapper.ProductSelectionLevelsAttributes.
                Where(x => x.PRD_STRT_DTM <= endDate && x.PRD_END_DTM >= startDate);

            var result = new ProductSelectorWrapper();
            result.ProductSelectionLevels = productSelectionLevels.ToList();
            result.ProductSelectionLevelsAttributes = productSelectionLevelsAttributes.ToList();
            return result;
        }

        /// <summary>
        /// Get ProductSelectionResults
        /// </summary>
        /// <param name="searchHash"></param>
        /// <param name="startDate"></param>
        /// <param name="endDateTime"></param>
        /// <param name="selectionLevel"></param>
        /// <param name="drillDownFilter"></param>
        /// <returns></returns>
        public List<ProductSelectionResults> GetProductSelectionResults(string searchHash,
            DateTime startDate, DateTime endDate, int selectionLevel, string drillDownFilter4, string drillDownFilter5, int custSid, string geoSid)
        {
            return _productDataLib.GetProductSelectionResults(searchHash, startDate, endDate, selectionLevel, drillDownFilter4, drillDownFilter5, custSid, geoSid);
        }

        /// <summary>
        /// Get CAP and YCS2 values for given product with Geombrsid, cust_mbr_sid, and deal start and end date
        /// </summary>
        /// <param name="productCAPCalc"></param>
        /// <param name="getAvailable"></param>
        /// <param name="priceCondition"></param>
        /// <returns></returns>
        public List<ProductCAPYCS2> GetProductCAPYCS2Data(List<ProductCAPYCS2Calc> productCAPCalc, string getAvailable, string priceCondition)
        {
            return _productDataLib.GetProductCAPYCS2Data(productCAPCalc, getAvailable, priceCondition);
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="prdEntered"></param>
        /// <param name="returnMax"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<Product> SuggestProductsByDates(string prdEntered, int? returnMax, DateTime startDate, DateTime endDate)
        {
            var products = GetProductsDetailsByDates(startDate, endDate);
            var productNameFromAlias = GetProductsFromAlias().Where(x => x.PRD_ALS_NM == prdEntered);
            prdEntered = productNameFromAlias.Any() ? productNameFromAlias.FirstOrDefault().PRD_NM : prdEntered;
            return SuggestProducts(prdEntered, returnMax, products);
        }
    }

    public class NodeMatch
    {
        public int ID { get; set; }
        public string Value { get; set; }
        public string MatchVal { get; set; }
        public int MatchLen { get; set; }
        public int MatchCount { get; set; }
        public float Weight { get; set; }
    }
}