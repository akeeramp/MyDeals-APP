using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.IBusinessLogic;
using System.Text.RegularExpressions;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Collections.Concurrent;

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

        public List<Product> GetProductsByIds(IEnumerable<int> pids)
        {
            return _dataCollectionsDataLib.GetProductData().Where(p => pids.Contains(p.PRD_MBR_SID)).ToList();
        }

        public List<Product> GetProductsDetails(bool getCachedResult = true)
        {
            if (!getCachedResult)
            {
                _productDataLib.GetProducts();
            }
            return _dataCollectionsDataLib.GetProductData();
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
        /// Get All Products By Specified Product Vertical
        /// </summary>
        /// <input>string name which is what will be filtered against (example: 'NAND')</input>
        /// <returns>list of Product data containing specified Product Vertical</returns>
        public List<Product> GetProductByCategoryName(string name, bool getCachedResult = true)
        {
            if (!getCachedResult)
            {
                return GetProducts(getCachedResult).Where(c => c.PRD_CAT_NM.Contains(name)).ToList();
            }
            return GetProducts().Where(c => c.PRD_CAT_NM.Contains(name)).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Product Vertical SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 9)</input>
        /// <returns>list of Product data matching specified Product Vertical sid</returns>
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

        public ProductLookup TranslateProducts(ContractToken contractToken, List<ProductEntryAttribute> prodNames, int CUST_MBR_SID, string DEAL_TYPE)
        {
            DateTime start = DateTime.Now;
            Stopwatch stopwatch = new Stopwatch();
            if (EN.GLOBAL.DEBUG >= 1)
            {
                stopwatch.Start();
                Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\tStart TranslateProducts {1}", stopwatch.Elapsed.TotalMilliseconds, string.Join(", ", prodNames.Select(s => s.USR_INPUT)), DateTime.Now);
            }

            //var prodNames = new List<string>();
            Dictionary<string, string> mediaSubverticalResult = GetVerticalandMedia();
            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{1:HH:mm:ss:fff}\t{0,10} (ms)\tFinished GetVerticalandMedia", stopwatch.Elapsed.TotalMilliseconds, DateTime.Now);

            var userProducts = prodNames.Select(l => l.USR_INPUT).ToList();
            var productsTodbConcurrent = new ConcurrentBag<List<ProductEntryAttribute>>();
            var productLookup = new ProductLookup
            {
                ProdctTransformResults = new Dictionary<string, Dictionary<string, List<string>>>(),
                DuplicateProducts = new Dictionary<string, Dictionary<string, List<PRD_TRANSLATION_RESULTS>>>(),
                ValidProducts = new Dictionary<string, Dictionary<string, List<PRD_TRANSLATION_RESULTS>>>(),
                InValidProducts = new Dictionary<string, Dictionary<string, List<string>>>()
            };

            var concurrentProdctTransformResults = new ConcurrentDictionary<string, Dictionary<string, List<string>>>();

            //  Check if any product has alias mapping, this will call cache

            start = DateTime.Now;
            var aliasMapping = GetProductsFromAlias();
            contractToken.AddMark("GetProductsFromAlias - PR_MYDL_UPD_PRD_ALIAS", TimeFlowMedia.DB, (DateTime.Now - start).TotalMilliseconds);

            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{1:HH:mm:ss:fff}\t{0,10} (ms)\tFinished GetProductsFromAlias", stopwatch.Elapsed.TotalMilliseconds, DateTime.Now);

            Parallel.ForEach(prodNames, (userProduct) =>
            {
                var products = TransformProducts(userProduct.USR_INPUT);
                var aliasReplacedProducts = new List<string>();

                var prodTemp = products.ToList();
                foreach (var product in prodTemp)
                {
                    string productName = product.Trim();
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
                                               on p.USR_INPUT.ToLower() equals a.PRD_ALS_NM.ToLower() into pa
                                               from t in pa.DefaultIfEmpty()
                                               select new ProductEntryAttribute
                                               {
                                                   USR_INPUT = t == null ? p.USR_INPUT : t.PRD_NM
                                               }).Distinct().ToList();

                    finalProdName = string.Join(" ", productAliasesSplit.Select(x => x.USR_INPUT));

                    aliasReplacedProducts.Add(finalProdName);
                }
                List<ProductEntryAttribute> prodNamesList = new List<ProductEntryAttribute>();
                foreach (var product in aliasReplacedProducts)
                {
                    ProductEntryAttribute pea = new ProductEntryAttribute();
                    bool isEPMName = product.Contains("~~**~~**~~");
                    string tempProdName = isEPMName ? product.Remove(product.IndexOf("~~**~~**~~"), 10) : product; // unique combination checking
                    string afterMediaRemoval = RemoveVerticalAndMedia(tempProdName, mediaSubverticalResult, isEPMName);
                    string userInput = CheckBogusProduct(afterMediaRemoval, isEPMName);
                    pea.ROW_NUMBER = userProduct.ROW_NUMBER;
                    pea.USR_INPUT = afterMediaRemoval;
                    pea.MOD_USR_INPUT = userInput;
                    pea.START_DATE = userProduct.START_DATE;
                    pea.END_DATE = userProduct.END_DATE;
                    pea.EXCLUDE = userProduct.EXCLUDE;
                    pea.FILTER = userProduct.FILTER;
                    pea.GEO_COMBINED = userProduct.GEO_COMBINED;
                    pea.PROGRAM_PAYMENT = userProduct.PROGRAM_PAYMENT;
                    pea.COLUMN_TYPE = isEPMName; // unique combination checking

                    prodNamesList.Add(pea);
                }
                prodNamesList = prodNamesList.Distinct().ToList();

                productsTodbConcurrent.Add(prodNamesList);

                if (concurrentProdctTransformResults.ContainsKey(userProduct.ROW_NUMBER.ToString()))
                {
                    prodNamesList.ForEach(d =>
                    concurrentProdctTransformResults[userProduct.ROW_NUMBER.ToString()][d.EXCLUDE ? "E" : "I"].Add(d.USR_INPUT));
                }
                else
                {
                    var records = new Dictionary<string, List<string>>();
                    records.Add("E", new List<string>());
                    records.Add("I", new List<string>());
                    prodNamesList.ForEach(d => records[d.EXCLUDE ? "E" : "I"].Add(d.USR_INPUT));
                    concurrentProdctTransformResults[userProduct.ROW_NUMBER.ToString()] = records;
                }
            });
            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{1:HH:mm:ss:fff}\t{0,10} (ms)\tFinished foreach (var userProduct in prodNames)", stopwatch.Elapsed.TotalMilliseconds, DateTime.Now);

            //  Product match master list
            start = DateTime.Now;

            var productsToDb = productsTodbConcurrent.SelectMany(x => x).ToList();
            var productMatchResults = GetProductDetails(productsToDb, CUST_MBR_SID, DEAL_TYPE);
            contractToken.AddMark("GetProductDetails - PR_MYDL_TRANSLT_PRD_ENTRY", TimeFlowMedia.DB, (DateTime.Now - start).TotalMilliseconds);
            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{1:HH:mm:ss:fff}\t{0,10} (ms)\tFinished GetProductDetails", stopwatch.Elapsed.TotalMilliseconds, DateTime.Now);

            productLookup.ProdctTransformResults = concurrentProdctTransformResults.ToDictionary(kvp => kvp.Key,
                                                          kvp => kvp.Value);
            // Get duplicate and Valid Products
            ExtractValidandDuplicateProducts(productLookup, productMatchResults);
            contractToken.AddMark("ExtractValidandDuplicateProducts", TimeFlowMedia.MT, (DateTime.Now - start).TotalMilliseconds);
            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{1:HH:mm:ss:fff}\t{0,10} (ms)\tFinished ExtractValidandDuplicateProducts", stopwatch.Elapsed.TotalMilliseconds, DateTime.Now);

            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{1:HH:mm:ss:fff}\t{0,10} (ms)\tFinished TranslateProducts", stopwatch.Elapsed.TotalMilliseconds, DateTime.Now);

            return productLookup;
        }

        private Dictionary<string, string> GetVerticalandMedia()
        {
            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{0:HH:mm:ss:fff}\t{0,10} (ms)\tStarted GetProductsDetails", DateTime.Now);

            List<Product> prds = GetProductsDetails();

            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{0:HH:mm:ss:fff}\t{0,10} (ms)\tFinished GetProductsDetails", DateTime.Now);

            var resultMEDIA = (from p in prds
                               group p by p.MM_MEDIA_CD
                          into g
                               select new { g.Key }).Distinct();

            var resultVERTICAL = (from p in prds
                                  group p by p.SUB_VERTICAL
                                  into g
                                  select new { g.Key }).Distinct();

            Dictionary<string, string> rtn = resultMEDIA.Union(resultVERTICAL).Distinct().ToDictionary(d => d.Key, d => d.Key);

            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{0:HH:mm:ss:fff}\t{0,10} (ms)\tPopulated Dictionary<string, string>", DateTime.Now);

            return rtn;
        }

        private string RemoveVerticalAndMedia(string tempProdName, Dictionary<string, string> mediaResult, bool isEPMserach)
        {
            string tempName = tempProdName;
            if (!isEPMserach)
            {
                var splitedProd = tempName.Trim().Split(' ');

                var isMediaPresent = (from md in mediaResult
                                      join s in splitedProd on md.Key.ToLower() equals s.ToLower()
                                      select new { md.Key });

                if (isMediaPresent.Any())
                {
                    foreach (var k in isMediaPresent)
                    {
                        tempName = Regex.Replace(tempName, k.Key, @"", RegexOptions.IgnoreCase); // Replace OR with nothing
                    }

                    tempName = Regex.Replace(tempName, @"\s+", " ");
                }
            }

            return tempName.Trim().Length == 0 ? tempProdName : tempName.Trim();
        }

        private string CheckBogusProduct(string tempProdName, bool isEPMserach)
        {
            string finalProdName = string.Empty;
            int counter = 4;
            int firstValidIndex = -1;
            if (tempProdName.Contains(" "))
            {
                var splitedProd = tempProdName.Trim().Split(' ');

                bool isValid = IsProductNamePartiallyExists(tempProdName, isEPMserach);
                if (!isValid)
                {
                    int cnt = splitedProd.Length > counter ? counter : splitedProd.Length;
                    for (int i = 1; i <= cnt; i++)
                    {
                        if (splitedProd.Length > 0)
                        {
                            int offset = splitedProd.Length - i;
                            int noOfItem = firstValidIndex == -1 ? 1 : (firstValidIndex - offset) + 1;
                            var newArray = splitedProd.Skip(offset).Take(noOfItem).ToArray();
                            string tempProductName = string.Join(" ", newArray);
                            if (tempProductName.Length > 2)
                            {
                                bool tempisValid = IsProductNamePartiallyExists(tempProductName, isEPMserach);
                                if (tempisValid)
                                {
                                    firstValidIndex = offset;
                                    finalProdName = tempProductName;
                                }
                                if (!string.IsNullOrEmpty(finalProdName) && !tempisValid)
                                {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                finalProdName = tempProdName;
            }

            return finalProdName;
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
        private static void ExtractValidandDuplicateProducts(ProductLookup productLookup, List<PRD_TRANSLATION_RESULTS> productMatchResultsMaster)
        {
            foreach (var rowNumber in productLookup.ProdctTransformResults)
            {
                foreach (var typeOfProduct in productLookup.ProdctTransformResults[rowNumber.Key])
                {
                    // Step 1: Get matching products for a particular row from master match list
                    var tranlatedProducts = productLookup.ProdctTransformResults[rowNumber.Key][typeOfProduct.Key];

                    var productMatchResults = (from p in productMatchResultsMaster
                                               where p.ROW_NM.ToString() == rowNumber.Key
                                                     && p.EXCLUDE == (typeOfProduct.Key == "E")
                                               select p).ToList();

                    //Step 2.1: Checking for Conflict upto Family Name
                    var isConflict = (from p in productMatchResults
                                      join t in tranlatedProducts
                                      on p.USR_INPUT.ToLower() equals t.ToLower()
                                      group p by new
                                      {
                                          p.ROW_NM,
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
                                                    on p.USR_INPUT.ToLower() equals t.ToLower()
                                                    where !p.EXACT_MATCH
                                                    select t).Distinct();

                    // Get distinct user inputs where user interaction needed from UI, put them in Duplicate product bucket list
                    duplicateProds = duplicateProds.Union(productWithoutExactMatch).Distinct();

                    // If any duplicates found extract them
                    if (duplicateProds.Any())
                    {
                        var duplicateRecords = productMatchResults.FindAll(p => duplicateProds.Contains(p.USR_INPUT));
                        if (productLookup.DuplicateProducts.ContainsKey(rowNumber.Key))
                        {
                            foreach (var d in duplicateRecords)
                            {
                                if (productLookup.DuplicateProducts[rowNumber.Key].ContainsKey(d.USR_INPUT))
                                {
                                    productLookup.DuplicateProducts[rowNumber.Key][d.USR_INPUT].Add(d);
                                }
                                else
                                {
                                    productLookup.DuplicateProducts[rowNumber.Key].Add(d.USR_INPUT, new List<PRD_TRANSLATION_RESULTS>() { d });
                                }
                            }
                        }
                        else
                        {
                            var records = new Dictionary<string, List<PRD_TRANSLATION_RESULTS>>();
                            duplicateProds.ToList().ForEach(d => records[d] = new List<PRD_TRANSLATION_RESULTS>());
                            duplicateRecords.ForEach(r => records[r.USR_INPUT].Add(r));
                            productLookup.DuplicateProducts[rowNumber.Key] = records;
                        }
                    }

                    // Step 3: Find the Valid products
                    var validProducts = productMatchResults.Where(p => !duplicateProds.Contains(p.USR_INPUT)
                                                                && tranlatedProducts.Any(t => t.Equals(p.USR_INPUT, StringComparison.InvariantCultureIgnoreCase))
                                                                );
                    var isConflictValid = (from p in validProducts
                                           group p by p.USR_INPUT
                                            into d
                                           select d.Key).ToList();

                    if (isConflictValid.Any())
                    {
                        var validProduct = productMatchResults.FindAll(p => isConflictValid.Contains(p.USR_INPUT));
                        if (productLookup.ValidProducts.ContainsKey(rowNumber.Key))
                        {
                            foreach (var v in validProduct)
                            {
                                if (productLookup.ValidProducts[rowNumber.Key].ContainsKey(v.USR_INPUT))
                                {
                                    productLookup.ValidProducts[rowNumber.Key][v.USR_INPUT].Add(v);
                                }
                                else
                                {
                                    productLookup.ValidProducts[rowNumber.Key].Add(v.USR_INPUT, new List<PRD_TRANSLATION_RESULTS>() { v });
                                }
                            }
                        }
                        else
                        {
                            var validRecords = new Dictionary<string, List<PRD_TRANSLATION_RESULTS>>();
                            isConflictValid.ToList().ForEach(d => validRecords[d] = new List<PRD_TRANSLATION_RESULTS>());
                            validProduct.ForEach(r => validRecords[r.USR_INPUT].Add(r));
                            productLookup.ValidProducts[rowNumber.Key] = validRecords;
                        }
                    }

                    // Step 4: Find InValid products, products which are present in master match result and not present in duplicate products and valid products
                    var invalidProducts = tranlatedProducts.Where(t => !duplicateProds.Contains(t) &&
                                                                    !validProducts.Any(v => v.USR_INPUT.Equals(t, StringComparison.InvariantCultureIgnoreCase))).ToList();

                    if (productLookup.InValidProducts.ContainsKey(rowNumber.Key))
                    {
                        productLookup.InValidProducts[rowNumber.Key][typeOfProduct.Key].AddRange(invalidProducts.ToList());
                    }
                    else
                    {
                        var records = new Dictionary<string, List<string>>();
                        records.Add("E", new List<string>());
                        records.Add("I", new List<string>());
                        records[typeOfProduct.Key].AddRange(invalidProducts);
                        productLookup.InValidProducts[rowNumber.Key] = records;
                    }
                }
            }
        }

        public List<PRD_TRANSLATION_RESULTS> GetProductDetails(List<ProductEntryAttribute> productsToMatch, int CUST_MBR_SID, string DEAL_TYPE)
        {
            return _productDataLib.GetProductDetails(productsToMatch, CUST_MBR_SID, DEAL_TYPE);
        }

        /// <summary>
        /// Check product exists in Mydeals (without any filter, for quick check. Performance matters)
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public bool IsProductNamePartiallyExists(string searchText, bool isEPMserach)
        {
            bool test;
            var searchStringData = GetSearchString();
            return isEPMserach
                ? searchStringData.Keys.Any(currentKey => currentKey.ToLower().Contains(searchText.ToLower()))
                : searchStringData.Where(d => d.Value != ProductHierarchyLevelsEnum.EPM_NM.ToString()).Select(k => k.Key).Any(currentKey => currentKey.ToLower().Contains(searchText.ToLower()));
            //var searchString = isEPMserach == false ? searchStringData.Where(d => d.Value != ProductHierarchyLevelsEnum.EPM_NM.ToString()).ToDictionary(d => d.Key, d => d.Value) : GetSearchString();
            //test = searchString.Keys.Any(currentKey => currentKey.ToLower().Contains(searchText.ToLower()));

            return test;
        }

        /// <summary>
        /// Check product exists in Mydeals (without any filter, for quick check. Performance matters)
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public bool IsProductExistsInMydeals(string searchText)
        {
            var searchString = GetSearchString();
            return searchString.ContainsKey(searchText.Trim());
        }

        /// <summary>
        /// Here only alias replace will happen
        /// </summary>
        /// <param name="productsToMatch"></param>
        /// <param name="CUST_MBR_SID"></param>
        /// <returns></returns>
        public List<PRD_LOOKUP_RESULTS> SearchProduct(List<ProductEntryAttribute> productsToMatch, int CUST_MBR_SID, OpDataElementSetType dealType, bool getWithoutFilters)
        {
            var aliasMapping = GetProductsFromAlias();
            var productsSplit = productsToMatch.FirstOrDefault().USR_INPUT.Split(' ');
            Dictionary<string, string> mediaSubverticalResult = GetVerticalandMedia();

            var productAliasesSplit = (from p in productsSplit
                                       join a in aliasMapping
                                       on p.ToLower() equals a.PRD_ALS_NM.ToLower() into pa
                                       from t in pa.DefaultIfEmpty()
                                       select t == null ? p : t.PRD_NM).Distinct().ToList();

            productsToMatch.FirstOrDefault().USR_INPUT = String.Join(" ", productAliasesSplit.ToArray());

            productsToMatch.FirstOrDefault().USR_INPUT = RemoveVerticalAndMedia(productsToMatch.FirstOrDefault().USR_INPUT, mediaSubverticalResult,
                productsToMatch.FirstOrDefault().COLUMN_TYPE);

            productsToMatch.FirstOrDefault().MOD_USR_INPUT = CheckBogusProduct(productsToMatch.FirstOrDefault().USR_INPUT,
                productsToMatch.FirstOrDefault().COLUMN_TYPE);

            return _productDataLib.SearchProduct(productsToMatch, CUST_MBR_SID, dealType, getWithoutFilters);
        }

        /// <summary>
        /// Transform the single row user inputted products to Mydeals products
        /// </summary>
        /// <param name="userProduct">e.g: i5 2400(S,T),H61</param>
        /// <returns></returns>
        public List<string> TransformProducts(string userProduct)
        {
            Boolean flag = false;
            string EPMString = "";
            var EPMList = new List<string>();
            string tempProdNM = userProduct;

            tempProdNM = Regex.Replace(tempProdNM, " OR ", @"~", RegexOptions.IgnoreCase); // Replace OR with ~
            tempProdNM = tempProdNM.Replace("&", "~"); // Replace & with ~

            // Checking for any EPM name present inside "" and extracting the EPM name will add it at the END
            if (tempProdNM.Contains('"'))
            {
                do
                {
                    if (tempProdNM.Contains('"'))
                    {
                        int lastIndex = tempProdNM.LastIndexOf('"');
                        int secodnLast = lastIndex > 0 ? tempProdNM.LastIndexOf('"', tempProdNM.LastIndexOf('"') - 1) : -1;
                        if (secodnLast > -1 && lastIndex > -1)
                        {
                            var empArr = tempProdNM.Substring(secodnLast, lastIndex - secodnLast);//Extract string inside double quote

                            var tempString = (lastIndex < 0)
                                ? tempProdNM
                                : tempProdNM.Remove(secodnLast, tempProdNM.Length - secodnLast);

                            EPMString = empArr.Replace("\"", "");

                            int index = tempProdNM.IndexOf("\"" + EPMString + "\"");

                            tempProdNM = (index < 0)
                                ? tempProdNM
                                : tempProdNM.Remove(index, ("\"" + EPMString + "\"").Length);

                            var lastOperatorIndex = tempString.LastIndexOfAny(new char[] { ',', '~', '/' });

                            var GDM_NM = tempString.Substring(lastOperatorIndex + 1, tempString.Length - lastOperatorIndex - 1);

                            if (lastOperatorIndex == -1 && tempString.Length > 0)
                            {
                                lastOperatorIndex = 0;
                            }

                            tempProdNM = (lastOperatorIndex < 0)
                                ? tempProdNM
                                : tempProdNM.Remove(lastOperatorIndex > 0 ? lastOperatorIndex + 1 : lastOperatorIndex = 0, GDM_NM.Length);

                            EPMList.Add((GDM_NM + EPMString + "~~**~~**~~").Trim()); // to avoid any character presence in EPM i am adding this unique combination
                            flag = true;
                        }
                        else
                        {
                            flag = false;
                        }
                    }
                    else
                    {
                        flag = false;
                    }
                } while (flag);
            }

            userProduct = tempProdNM;

            //Getting value from Constant Table
            string charset = "";
            var charsetResult = _constantsLookupsLib.GetConstantsByName("PROD_REPLACE_CHARSET"); // NULL Check
            if (charsetResult != null)
                charset = charsetResult.CNST_VAL_TXT;

            string userProd = Regex.Replace(userProduct, @"(?<=\([^()]*),", "/");
            userProd = Regex.Replace(userProd, @"\s+", " ");// Replace multiple spaces with single line
            //userProd = Regex.Replace(userProd, @"\s*([-])\s", "$1"); // Replace multiple space before and after - (Hyphen)

            userProd = Regex.Replace(userProd, " OR ", @"~", RegexOptions.IgnoreCase); // Replace OR with ~
            userProd = userProd.Replace("&", "~"); // Replace & with ~
            userProd = userProd.Replace("+", "~"); // Replace & with ~

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
                            strRep = item.Trim();
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
                        if ((productNames[0] + character.Trim()).Trim().Length > 0)
                        {
                            singleProducts.Add(productNames[0] + character.Trim());
                        }
                    }
                }
                else
                {
                    if (item.Trim().Length > 0)
                    {
                        singleProducts.Add(item.Trim());
                    }
                }
            }

            //Adding EPM name
            foreach (var item in EPMList)
            {
                singleProducts.Add(item);
            }

            return singleProducts;
        }

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
            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{0:HH:mm:ss:fff}\t{0,10} (ms)\tStarted SetProductAlias", DateTime.Now);

            // Before adding a Alias mapping for a product check if Mydeals has the product
            var product = new List<string>();
            product.Add(data.PRD_NM);
            product.Add(data.PRD_ALS_NM);
            var isValidProduct = _productDataLib.SetProductAlias(mode, data);
            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{0:HH:mm:ss:fff}\t{0,10} (ms)\tReturn from DB", DateTime.Now);

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

            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{0:HH:mm:ss:fff}\t{0,10} (ms)\tFinished SetProductAlias", DateTime.Now);

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
        public ProductSelectorWrapper GetProductSelectorWrapperByDates(DateTime startDate, DateTime endDate, string mediaCode)
        {
            var productSelectorWrapper = GetProductSelectorWrapper();
            var productSelectionLevels = new List<ProductSelectionLevels>();
            var productSelectionLevelsAttributes = new List<ProductSelectionLevelsAttributes>();

            var productTypeToApplyMediaCode = new string[] { "EIA CPU", "CPU", "EIA MISC" };

            productSelectionLevels.AddRange(productSelectorWrapper.ProductSelectionLevels.
                    Where(x => x.PRD_STRT_DTM <= endDate && x.PRD_END_DTM >= startDate && !productTypeToApplyMediaCode.Contains(x.DEAL_PRD_TYPE)));

            productSelectionLevelsAttributes.AddRange(productSelectorWrapper.ProductSelectionLevelsAttributes.
                    Where(x => x.PRD_STRT_DTM <= endDate && x.PRD_END_DTM >= startDate && !productTypeToApplyMediaCode.Contains(x.PRD_CAT_NM)));

            if (mediaCode.Trim().ToUpper() == "TRAY")
            {
                productSelectionLevels.AddRange(productSelectorWrapper.ProductSelectionLevels.
                    Where(x => productTypeToApplyMediaCode.Contains(x.DEAL_PRD_TYPE) && x.TRAY_STRT_DT <= endDate && x.TRAY_END_DT >= startDate));

                productSelectionLevelsAttributes.AddRange(productSelectorWrapper.ProductSelectionLevelsAttributes.
                    Where(x => productTypeToApplyMediaCode.Contains(x.PRD_CAT_NM) && x.TRAY_STRT_DT <= endDate && x.TRAY_END_DT >= startDate));
            }
            else if (mediaCode.Trim().ToUpper() == "BOX")
            {
                productSelectionLevels.AddRange(productSelectorWrapper.ProductSelectionLevels.
                   Where(x => productTypeToApplyMediaCode.Contains(x.DEAL_PRD_TYPE) && x.BOX_STRD_DT <= endDate && x.BOX_END_DT >= startDate));

                productSelectionLevelsAttributes.AddRange(productSelectorWrapper.ProductSelectionLevelsAttributes.
                    Where(x => productTypeToApplyMediaCode.Contains(x.PRD_CAT_NM) && x.BOX_STRD_DT <= endDate && x.BOX_END_DT >= startDate));
            }
            else
            {
                productSelectionLevels.AddRange(productSelectorWrapper.ProductSelectionLevels.
                    Where(x => productTypeToApplyMediaCode.Contains(x.DEAL_PRD_TYPE) && x.PRD_STRT_DTM <= endDate && x.PRD_END_DTM >= startDate));

                productSelectionLevelsAttributes.AddRange(productSelectorWrapper.ProductSelectionLevelsAttributes.
                    Where(x => productTypeToApplyMediaCode.Contains(x.PRD_CAT_NM) && x.PRD_STRT_DTM <= endDate && x.PRD_END_DTM >= startDate));
            }

            var result = new ProductSelectorWrapper();
            result.ProductSelectionLevels = productSelectionLevels;
            result.ProductSelectionLevelsAttributes = productSelectionLevelsAttributes;
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
            DateTime startDate, DateTime endDate, int selectionLevel, string drillDownFilter4, string drillDownFilter5, int custSid, string geoSid, string mediaCd, OpDataElementSetType dealType)
        {
            return _productDataLib.GetProductSelectionResults(searchHash, startDate, endDate, selectionLevel, drillDownFilter4, drillDownFilter5, custSid, geoSid, mediaCd, dealType);
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
        /// Return CAP values for the Product
        /// </summary>
        /// <param name="PRD_MBR_SID"></param>
        /// <param name="CUST_CD"></param>
        /// <param name="GEO_MBR_SID"></param>
        /// <param name="START_DT"></param>
        /// <param name="END_DT"></param>
        /// <returns></returns>
        public List<ProductCAPYCS2> GetCAPForProduct(int PRD_MBR_SID, int CUST_CD, string GEO_MBR_SID, DateTime START_DT, DateTime END_DT)
        {
            string getAvailable = "Y";
            string priceCondition = "";

            ProductCAPYCS2Calc pCap = new ProductCAPYCS2Calc();
            pCap.PRD_MBR_SID = PRD_MBR_SID;
            pCap.CUST_MBR_SID = CUST_CD;
            pCap.GEO_MBR_SID = GEO_MBR_SID;
            pCap.DEAL_STRT_DT = START_DT;
            pCap.DEAL_END_DT = END_DT;

            List<ProductCAPYCS2Calc> lpCap = new List<ProductCAPYCS2Calc>();
            lpCap.Add(pCap);

            List<ProductCAPYCS2> capResult = _productDataLib.GetCAPForProduct(lpCap, getAvailable, priceCondition);
            return capResult;
        }

        /// <summary>
        /// Get all the attribute values for the product
        /// </summary>
        /// <param name="product"></param>
        /// <returns></returns>
        public List<PRD_LOOKUP_RESULTS> GetProductAttributes(List<PRD_LOOKUP_RESULTS> product = null)
        {
            List<Product> prds = GetProductsDetails();

            List<PRD_LOOKUP_RESULTS> prdResult = (from r in prds
                                                  join d in product
                                                  on r.PRD_MBR_SID equals d.PRD_MBR_SID
                                                  select new PRD_LOOKUP_RESULTS()
                                                  {
                                                      BRND_NM = r.BRND_NM,
                                                      CAP = d.CAP,
                                                      CAP_END = d.CAP_END,
                                                      CAP_PRC_COND = d.CAP_PRC_COND,
                                                      CAP_START = d.CAP_START,
                                                      CPU_CACHE = r.CPU_CACHE,
                                                      CPU_PACKAGE = r.CPU_PACKAGE,
                                                      CPU_PROCESSOR_NUMBER = r.CPU_PROCESSOR_NUMBER,
                                                      CPU_VOLTAGE_SEGMENT = r.CPU_VOLTAGE_SEGMENT,
                                                      CPU_WATTAGE = r.CPU_WATTAGE,
                                                      DEAL_END_DT = d.DEAL_END_DT,
                                                      DEAL_PRD_NM = r.DEAL_PRD_NM,
                                                      DEAL_PRD_TYPE = r.DEAL_PRD_TYPE,
                                                      DEAL_STRT_DT = d.DEAL_STRT_DT,
                                                      EPM_NM = r.EPM_NM,
                                                      EXACT_MATCH = d.EXACT_MATCH,
                                                      FMLY_NM = r.FMLY_NM,
                                                      HAS_L1 = r.HAS_L1,
                                                      HAS_L2 = r.HAS_L2,
                                                      FMLY_NM_MM = r.FMLY_NM_MM,
                                                      GDM_BRND_NM = r.GDM_BRND_NM,
                                                      GDM_FMLY_NM = r.GDM_FMLY_NM,
                                                      HIER_NM_HASH = r.HIER_NM_HASH,
                                                      HIER_VAL_NM = r.HIER_VAL_NM,
                                                      MM_CUST_CUSTOMER = r.MM_CUST_CUSTOMER,
                                                      MTRL_ID = r.MTRL_ID,
                                                      NAND_Density = r.NAND_Density,
                                                      NAND_FAMILY = r.NAND_FAMILY,
                                                      PCSR_NBR = r.PCSR_NBR,
                                                      PRD_ATRB_SID = r.PRD_ATRB_SID,
                                                      PRD_CAT_NM = r.PRD_CAT_NM,
                                                      PRD_END_DTM = r.PRD_END_DTM,
                                                      PRD_MBR_SID = r.PRD_MBR_SID,
                                                      PRD_STRT_DTM = r.PRD_STRT_DTM,
                                                      PRICE_SEGMENT = r.PRICE_SEGMENT,
                                                      SBS_NM = r.SBS_NM,
                                                      SKU_MARKET_SEGMENT = r.SKU_MARKET_SEGMENT,
                                                      SKU_NM = r.SKU_NM,
                                                      USR_INPUT = d.USR_INPUT,
                                                      YCS2 = d.YCS2,
                                                      YCS2_END = d.YCS2_END,
                                                      YCS2_START = d.YCS2_START
                                                  }).ToList();
            return prdResult;
        }

        /// <summary>
        /// Get search string
        /// </summary>
        /// <param name="searchText"></param>
        /// <returns></returns>
        public IList<SearchString> GetSearchString(string searchText, string mediaCode,
            DateTime startDate, DateTime endDate, bool getWithFilters = true)
        {
            searchText = searchText.Trim();

            var searchString = getWithFilters ? FilterProducts(mediaCode, startDate, endDate) : GetSearchString();

            // Get the matching product
            var matchingProducts = GetMatchingProduct(searchText, searchString);

            // Still if there are no matches get the auto correct matches
            if (!matchingProducts.Any())
            {
                matchingProducts = GetAutcorrectedSugestions(searchText, searchString);
            }

            return matchingProducts;
        }

        private Dictionary<string, string> FilterProducts(string mediaCode, DateTime startDate, DateTime endDate)
        {
            var applyMediaFilter = new[] { "CPU", "EIA CPU", "EIA MISC" };

            var products = GetProducts();

            products = products.Where(x => x.PRD_STRT_DTM <= endDate && x.PRD_END_DTM >= startDate).ToList();
            if (mediaCode.ToUpper() != "ALL")
            {
                var p = products.Where(x => applyMediaFilter.Contains(x.DEAL_PRD_TYPE.ToUpper())
                && !x.MM_MEDIA_CD.ToUpper().Contains(mediaCode.ToUpper()));

                products = products.Except(p).ToList();
            }

            var _getSearchStringList = new List<SearchString>();

            var searchHierColumns = products.Where(x => !string.IsNullOrEmpty(x.HIER_VAL_NM) &&
                x.PRD_ATRB_SID <= (int)ProductHierarchyLevelsEnum.MTRL_ID
                && x.PRD_ATRB_SID >= (int)ProductHierarchyLevelsEnum.DEAL_PRD_TYPE)
                .Select(x => new SearchString { Name = x.HIER_VAL_NM, Type = ((ProductHierarchyLevelsEnum)x.PRD_ATRB_SID).ToString() });

            var searchGDMFamily = products.Where(x => !string.IsNullOrEmpty(x.GDM_FMLY_NM)).
                    Select(x => new SearchString { Name = x.GDM_FMLY_NM, Type = ProductHierarchyLevelsEnum.GDM_FMLY_NM.ToString() });

            var searchNandFamily = products.Where(x => !string.IsNullOrEmpty(x.NAND_FAMILY) && x.PRD_ATRB_SID == 7008).
                               Select(x => new SearchString { Name = x.NAND_FAMILY, Type = ProductHierarchyLevelsEnum.NAND_FAMILY.ToString() });

            var searchNandDensity = products.Where(x => !string.IsNullOrEmpty(x.NAND_Density) && x.PRD_ATRB_SID == 7008).
                               Select(x => new SearchString { Name = x.NAND_Density, Type = ProductHierarchyLevelsEnum.NAND_DENSITY.ToString() });

            var searchEPM = products.Where(x => !string.IsNullOrEmpty(x.EPM_NM) && x.PRD_ATRB_SID == 7008).
                               Select(x => new SearchString { Name = x.EPM_NM, Type = ProductHierarchyLevelsEnum.EPM_NM.ToString() });

            _getSearchStringList.AddRange(searchHierColumns);
            _getSearchStringList.AddRange(searchGDMFamily);
            _getSearchStringList.AddRange(searchNandFamily);
            _getSearchStringList.AddRange(searchNandDensity);
            _getSearchStringList.AddRange(searchEPM);

            var _getSearchString = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase);

            foreach (var s in _getSearchStringList)
            {
                if (!_getSearchString.Keys.Contains(s.Name))
                    _getSearchString.Add(s.Name, s.Type);
            }

            return _getSearchString;
        }

        private IList<SearchString> GetMatchingProduct(string searchValue, Dictionary<string, string> searchString)
        {
            var searchText = searchValue.Split('*').ToList();

            string pattern = string.Join("|", searchText.Select(Regex.Escape));
            Regex regex = new Regex(pattern, RegexOptions.IgnoreCase);

            List<NodeMatch> myMatches = new List<NodeMatch>();
            foreach (var searchVal in searchString)
            {
                MatchCollection matches = regex.Matches(FuzzySearch.StripUnicodeCharactersFromString(searchVal.Key.ToUpper()));
                if (matches.Count > 0)
                {
                    int matchesLength = 0;
                    string matchVal = "";
                    foreach (Match match in matches)
                    {
                        matchesLength += match.Length;
                        matchVal += match.Value;
                    }

                    float weight = ((float)matchesLength / (float)searchVal.Key.Length) * 100;

                    NodeMatch newMatch = new NodeMatch
                    {
                        Value = searchVal.Key,
                        MatchVal = matchVal,
                        MatchLen = matchesLength,
                        MatchCount = matches.Count,
                        Weight = weight
                    };
                    myMatches.Add(newMatch);
                }
            }

            var sortedList = myMatches.OrderByDescending(o => o.MatchLen).ThenByDescending(o => o.Weight);
            var matchedNames = sortedList.Take(30).Select(p => p.Value);
            return matchedNames.Where(x => searchString.ContainsKey(x)).Select(x => new SearchString { Name = x, Type = searchString[x] }).ToList();
        }

        /// <summary>
        /// Get search string
        /// </summary>
        /// <param name="searchText"></param>
        /// <returns></returns>
        public IList<SearchString> GetAutcorrectedSugestions(string searchText, Dictionary<string, string> searchString)
        {
            var suggestions = new Dictionary<string, int>(StringComparer.InvariantCultureIgnoreCase);

            List<NodeMatch> myMatches = new List<NodeMatch>();
            int threshold = searchText.Length / 2;
            searchText = searchText.Trim().ToUpper();
            foreach (KeyValuePair<string, string> searchVal in searchString)
            {
                var numberOfEdits = FuzzySearch.DamerauLevenshteinDistance(searchText, searchVal.Key.ToUpper(), threshold);
                if (!suggestions.Keys.Contains(searchVal.Key))
                    suggestions.Add(searchVal.Key, numberOfEdits);
            }

            // if word contains a space see split the word and see if there are any direct matches exist
            var wordList = searchText.Split(' ');
            foreach (var word in wordList)
            {
                if (suggestions.ContainsKey(word.Trim()))
                {
                    suggestions[word.Trim()] = 0;
                }
            }

            var sortedList = suggestions.Where(o => o.Value <= threshold).OrderBy(o => o.Value).Take(7);
            var rtn = sortedList.Select(x => new SearchString { Name = x.Key, Type = searchString[x.Key] });

            return rtn.ToList();
        }

        /// <summary>
        /// Bring in the search string object from cache
        /// </summary>
        /// <returns></returns>
        public Dictionary<string, string> GetSearchString()
        {
            return _dataCollectionsDataLib.GetSearchString();
        }

        /// <summary>
        /// Get Suggestions
        /// </summary>
        /// <param name="userInputs"></param>
        /// <param name="custId"></param>
        /// <returns></returns>
        public IList<PRD_LOOKUP_RESULTS> GetSuggestions(ProductEntryAttribute userInput, int custId, OpDataElementSetType dealType)
        {
            var suggestions = GetSearchString(userInput.USR_INPUT, userInput.FILTER, DateTime.Parse(userInput.START_DATE),
                DateTime.Parse(userInput.END_DATE), true).Take(5);

            List<ProductEntryAttribute> productsToTranslate = new List<ProductEntryAttribute>();

            if (suggestions.Any())
            {
                productsToTranslate = suggestions.Select(t => new ProductEntryAttribute
                {
                    ROW_NUMBER = 1,
                    USR_INPUT = t.Name,
                    EXCLUDE = userInput.EXCLUDE,
                    MOD_USR_INPUT = "",
                    FILTER = userInput.FILTER,
                    END_DATE = userInput.END_DATE,
                    START_DATE = userInput.START_DATE,
                    GEO_COMBINED = userInput.GEO_COMBINED,
                    PROGRAM_PAYMENT = userInput.PROGRAM_PAYMENT,
                    COLUMN_TYPE = (t.Name == "EPM_NM")
                }).ToList();
            }
            else
            {
                Dictionary<string, string> mediaSubverticalResult = GetVerticalandMedia();
                userInput.USR_INPUT = RemoveVerticalAndMedia(userInput.USR_INPUT, mediaSubverticalResult, false);
                productsToTranslate.Add(new ProductEntryAttribute()
                {
                    ROW_NUMBER = 1,
                    USR_INPUT = userInput.USR_INPUT,
                    EXCLUDE = userInput.EXCLUDE,
                    MOD_USR_INPUT = CheckBogusProduct(userInput.USR_INPUT, true),
                    FILTER = userInput.FILTER,
                    END_DATE = userInput.END_DATE,
                    START_DATE = userInput.START_DATE,
                    GEO_COMBINED = userInput.GEO_COMBINED,
                    PROGRAM_PAYMENT = userInput.PROGRAM_PAYMENT,
                    COLUMN_TYPE = false
                });
            }

            return SearchProduct(productsToTranslate, custId, dealType, true);
        }

        /// <summary>
        /// Get Products for Legal Exception Admin screen
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public IList<SearchString> GetLegalExceptionProducts(string filter)
        {
            var products = GetProducts();

            // Get L1 and L2 CPU processors
            // Get L1 and L2 non CPU Level4's
            var legalproducts = products.Where(p => (p.HAS_L1 > 0 || p.HAS_L2 > 0) &&
                                    ((p.DEAL_PRD_TYPE.ToUpper() == "CPU" && p.PRD_ATRB_SID == 7006) || (p.DEAL_PRD_TYPE != "CPU" && p.PRD_ATRB_SID == 7007)))
                                    .Select(x => new SearchString { Name = x.HIER_VAL_NM });

            var _getSearchString = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase);

            foreach (var s in legalproducts)
            {
                if (!_getSearchString.Keys.Contains(s.Name))
                    _getSearchString.Add(s.Name, s.Type);
            }

            return GetMatchingProduct(filter, _getSearchString);
        }

        public List<ProductEngName> GetEngProducts(List<int> prds)
        {
            return _productDataLib.GetEngProducts(prds);
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