using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinesssLogic
{
    public class ProductsLib
    {
        #region Products

        /// <summary>
        /// Get All Products
        /// </summary>
        /// <returns>list of Product data</returns>
        public List<Product> GetProducts(bool getCachedResult = true)
        {
            if (!getCachedResult)
            {
                new ProductDataLib().GetProducts();
            }
            return DataCollections.GetProductData();
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
            return GetProducts().Where(c => c.ACTV_IND == true).ToList();
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
                return GetProducts(getCachedResult).Where(c => c.PRD_CATGRY_NM.Contains(name)).ToList();
            }
            return GetProducts().Where(c => c.PRD_CATGRY_NM.Contains(name)).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Product Category SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 9)</input>
        /// <returns>list of Product data matching specified Product category sid</returns>
        public List<Product> GetProductByCategorySid(int sid)
        {
            return GetProducts().Where(c => c.PRD_CATGRY_NM_SID == sid).ToList();
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
            return GetProducts().Where(c => c.PRCSSR_NBR.Contains(name)).ToList();
        }

        /// <summary>
        /// Get All Products By Specified Processor Number SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 56345)</input>
        /// <returns>list of Product data matching specified Product Processor Number sid</returns>
        public List<Product> GetProductByProcessorNumberSid(int sid)
        {
            return GetProducts().Where(c => c.PRCSSR_NBR_SID == sid).ToList();
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

        #endregion
    }
}
