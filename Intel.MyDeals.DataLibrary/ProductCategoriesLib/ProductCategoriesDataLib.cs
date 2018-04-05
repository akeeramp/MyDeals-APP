using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class ProductCategoriesDataLib : IProductCategoriesDataLib
    {
        public ProductCategoriesDataLib()
        {
        }

        /// <summary>
        /// Get All Product Verticals
        /// </summary>
        /// <returns>list of product data</returns>
        public List<ProductCategory> GetProductCategories()
        {
            var ret = new List<ProductCategory>();
            Procs.dbo.PR_MYDL_GET_PRD_CAT_MAP cmd = new Procs.dbo.PR_MYDL_GET_PRD_CAT_MAP();

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CHG_EMP_NM = DB.GetReaderOrdinal(rdr, "CHG_EMP_NM");
                    int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
                    int IDX_DIV_NM = DB.GetReaderOrdinal(rdr, "DIV_NM");
                    int IDX_GDM_PRD_TYPE_NM = DB.GetReaderOrdinal(rdr, "GDM_PRD_TYPE_NM");
                    int IDX_GDM_VRT_NM = DB.GetReaderOrdinal(rdr, "GDM_VRT_NM");
                    int IDX_OP_CD = DB.GetReaderOrdinal(rdr, "OP_CD");
                    int IDX_PRD_CAT_MAP_SID = DB.GetReaderOrdinal(rdr, "PRD_CAT_MAP_SID");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");

                    while (rdr.Read())
                    {
                        ret.Add(new ProductCategory
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CHG_EMP_NM = (IDX_CHG_EMP_NM < 0 || rdr.IsDBNull(IDX_CHG_EMP_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHG_EMP_NM),
                            DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
                            DIV_NM = (IDX_DIV_NM < 0 || rdr.IsDBNull(IDX_DIV_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIV_NM),
                            GDM_PRD_TYPE_NM = (IDX_GDM_PRD_TYPE_NM < 0 || rdr.IsDBNull(IDX_GDM_PRD_TYPE_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GDM_PRD_TYPE_NM),
                            GDM_VRT_NM = (IDX_GDM_VRT_NM < 0 || rdr.IsDBNull(IDX_GDM_VRT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GDM_VRT_NM),
                            OP_CD = (IDX_OP_CD < 0 || rdr.IsDBNull(IDX_OP_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OP_CD),
                            PRD_CAT_MAP_SID = (IDX_PRD_CAT_MAP_SID < 0 || rdr.IsDBNull(IDX_PRD_CAT_MAP_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_CAT_MAP_SID),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        //public ProductCategory CreateProductCategory(ProductCategory category)
        //{
        //	if (category == null) { return null; }
        //	// TODO: Hookup and replace Product.cs references with newly generated ProductCategoes.cs (in future sprint)
        //	// Update Cache
        //	DataCollections.ClearCache("_getProductCategories");
        //		DataCollections.LoadCache("_getProductCategories");
        //	return new ProductCategory();
        //}

        /// <summary>
        /// Updates a Bulk List of Product Verticals
        /// </summary>
        /// <returns>True or exception depending on whether the SP fails or not</returns>
        public List<ProductCategory> UpdateProductCategories(List<ProductCategory> categories)
        {
            var ret = new List<ProductCategory>();
            try
            {
                // Make datatable
                in_t_prd_cat_map dt = new in_t_prd_cat_map();
                dt.AddRows(categories);

                // Call Proc
                Procs.dbo.PR_MYDL_UPD_PRD_CAT_MAP cmd = new Procs.dbo.PR_MYDL_UPD_PRD_CAT_MAP
                {
                    in_t_prd_cat_map = dt,
                    in_wwid = OpUserStack.MyOpUserToken.Usr.WWID
                };

                using (DataSet data = DataAccess.ExecuteDataSet(cmd))
                {
                    ret = (from rw in data.Tables[0].AsEnumerable()
                           select new ProductCategory
                           {
                               ACTV_IND = Convert.ToBoolean(rw["ACTV_IND"]),
                               CHG_DTM = Convert.ToDateTime(rw["CHG_DTM"]),
                               CHG_EMP_NM = Convert.ToString(rw["CHG_EMP_NM"]),
                               DEAL_PRD_TYPE = Convert.ToString(rw["DEAL_PRD_TYPE"]),
                               DIV_NM = Convert.ToString(rw["DIV_NM"]),
                               GDM_PRD_TYPE_NM = Convert.ToString(rw["GDM_PRD_TYPE_NM"]),
                               GDM_VRT_NM = Convert.ToString(rw["GDM_VRT_NM"]),
                               OP_CD = Convert.ToString(rw["OP_CD"]),
                               PRD_CAT_MAP_SID = Convert.ToInt32(rw["PRD_CAT_MAP_SID"]),
                               PRD_CAT_NM = Convert.ToString(rw["PRD_CAT_NM"])
                           }).ToList();
                }

                // Update Cache
                DataCollections.RecycleCache("_getProductCategories");
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }
    }
}