using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class ProductDataLib : IProductDataLib
    {
        /// <summary>
        /// Get All Products
        /// </summary>
        /// <returns>list of product data</returns>
        public List<Product> GetProducts()
        {
            OpLogPerf.Log("GetProducts");

            var ret = new List<Product>();
            var cmd = new Procs.dbo.PR_MYDL_GET_PRD_DTL { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_ALL_PRD_NM = DB.GetReaderOrdinal(rdr, "ALL_PRD_NM");
                    int IDX_ALL_PRD_NM_SID = DB.GetReaderOrdinal(rdr, "ALL_PRD_NM_SID");
                    int IDX_BRND_NM = DB.GetReaderOrdinal(rdr, "BRND_NM");
                    int IDX_BRND_NM_SID = DB.GetReaderOrdinal(rdr, "BRND_NM_SID");
                    int IDX_DEAL_PRD_NM = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM");
                    int IDX_DEAL_PRD_NM_SID = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM_SID");
                    int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
                    int IDX_DEAL_PRD_TYPE_SID = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE_SID");
                    int IDX_FMLY_NM = DB.GetReaderOrdinal(rdr, "FMLY_NM");
                    int IDX_FMLY_NM_SID = DB.GetReaderOrdinal(rdr, "FMLY_NM_SID");
                    int IDX_MTRL_ID = DB.GetReaderOrdinal(rdr, "MTRL_ID");
                    int IDX_MTRL_ID_SID = DB.GetReaderOrdinal(rdr, "MTRL_ID_SID");
                    int IDX_PRCSSR_NBR = DB.GetReaderOrdinal(rdr, "PRCSSR_NBR");
                    int IDX_PRCSSR_NBR_SID = DB.GetReaderOrdinal(rdr, "PRCSSR_NBR_SID");
                    int IDX_PRD_ATRB_SID = DB.GetReaderOrdinal(rdr, "PRD_ATRB_SID");
                    int IDX_PRD_CATGRY_NM = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM");
                    int IDX_PRD_CATGRY_NM_SID = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM_SID");
                    int IDX_PRD_END_DTM = DB.GetReaderOrdinal(rdr, "PRD_END_DTM");
                    int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
                    int IDX_PRD_STRT_DTM = DB.GetReaderOrdinal(rdr, "PRD_STRT_DTM");

                    while (rdr.Read())
                    {
                        ret.Add(new Product
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            ALL_PRD_NM = (IDX_ALL_PRD_NM < 0 || rdr.IsDBNull(IDX_ALL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ALL_PRD_NM),
                            ALL_PRD_NM_SID = (IDX_ALL_PRD_NM_SID < 0 || rdr.IsDBNull(IDX_ALL_PRD_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ALL_PRD_NM_SID),
                            BRND_NM = (IDX_BRND_NM < 0 || rdr.IsDBNull(IDX_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRND_NM),
                            BRND_NM_SID = (IDX_BRND_NM_SID < 0 || rdr.IsDBNull(IDX_BRND_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_BRND_NM_SID),
                            DEAL_PRD_NM = (IDX_DEAL_PRD_NM < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_NM),
                            DEAL_PRD_NM_SID = (IDX_DEAL_PRD_NM_SID < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_PRD_NM_SID),
                            DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
                            DEAL_PRD_TYPE_SID = (IDX_DEAL_PRD_TYPE_SID < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_PRD_TYPE_SID),
                            FMLY_NM = (IDX_FMLY_NM < 0 || rdr.IsDBNull(IDX_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMLY_NM),
                            FMLY_NM_SID = (IDX_FMLY_NM_SID < 0 || rdr.IsDBNull(IDX_FMLY_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_FMLY_NM_SID),
                            MTRL_ID = (IDX_MTRL_ID < 0 || rdr.IsDBNull(IDX_MTRL_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MTRL_ID),
                            MTRL_ID_SID = (IDX_MTRL_ID_SID < 0 || rdr.IsDBNull(IDX_MTRL_ID_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MTRL_ID_SID),
                            PRCSSR_NBR = (IDX_PRCSSR_NBR < 0 || rdr.IsDBNull(IDX_PRCSSR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRCSSR_NBR),
                            PRCSSR_NBR_SID = (IDX_PRCSSR_NBR_SID < 0 || rdr.IsDBNull(IDX_PRCSSR_NBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRCSSR_NBR_SID),
                            PRD_ATRB_SID = (IDX_PRD_ATRB_SID < 0 || rdr.IsDBNull(IDX_PRD_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_ATRB_SID),
                            PRD_CATGRY_NM = (IDX_PRD_CATGRY_NM < 0 || rdr.IsDBNull(IDX_PRD_CATGRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CATGRY_NM),
                            PRD_CATGRY_NM_SID = (IDX_PRD_CATGRY_NM_SID < 0 || rdr.IsDBNull(IDX_PRD_CATGRY_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_CATGRY_NM_SID),
                            PRD_END_DTM = (IDX_PRD_END_DTM < 0 || rdr.IsDBNull(IDX_PRD_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_END_DTM),
                            PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
                            PRD_STRT_DTM = (IDX_PRD_STRT_DTM < 0 || rdr.IsDBNull(IDX_PRD_STRT_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_STRT_DTM)
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

        /// <summary>
        /// Get Product Details with all columns
        /// </summary>
        /// <param name="data"></param>
        /// <param name="opsType"></param>
        /// <returns></returns>
        public List<ProductDatails> GetProductsDetails()
        {
            OpLogPerf.Log("GetProductDetails");

            var ret = new List<ProductDatails>();
            var cmd = new Procs.dbo.PR_MYDL_GET_PRD_DETAILS { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BRND_NM = DB.GetReaderOrdinal(rdr, "BRND_NM");
                    int IDX_CPU_CACHE = DB.GetReaderOrdinal(rdr, "CPU_CACHE");
                    int IDX_CPU_PACKAGE = DB.GetReaderOrdinal(rdr, "CPU_PACKAGE");
                    int IDX_CPU_PROCESSOR_NUMBER = DB.GetReaderOrdinal(rdr, "CPU_PROCESSOR_NUMBER");
                    int IDX_CPU_VOLTAGE_SEGMENT = DB.GetReaderOrdinal(rdr, "CPU_VOLTAGE_SEGMENT");
                    int IDX_CPU_WATTAGE = DB.GetReaderOrdinal(rdr, "CPU_WATTAGE");
                    int IDX_DEAL_PRD_NM = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM");
                    int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
                    int IDX_EFF_FR_DTM = DB.GetReaderOrdinal(rdr, "EFF_FR_DTM");
                    int IDX_EPM_NM = DB.GetReaderOrdinal(rdr, "EPM_NM");
                    int IDX_FMLY_NM = DB.GetReaderOrdinal(rdr, "FMLY_NM");
                    int IDX_FMLY_NM_MM = DB.GetReaderOrdinal(rdr, "FMLY_NM_MM");
                    int IDX_GDM_BRND_NM = DB.GetReaderOrdinal(rdr, "GDM_BRND_NM");
                    int IDX_GDM_FMLY_NM = DB.GetReaderOrdinal(rdr, "GDM_FMLY_NM");
                    int IDX_HIER_NM_HASH = DB.GetReaderOrdinal(rdr, "HIER_NM_HASH");
                    int IDX_HIER_VAL_NM = DB.GetReaderOrdinal(rdr, "HIER_VAL_NM");
                    int IDX_KIT_NM = DB.GetReaderOrdinal(rdr, "KIT_NM");
                    int IDX_MTRL_ID = DB.GetReaderOrdinal(rdr, "MTRL_ID");
                    int IDX_NAND_DENSITY = DB.GetReaderOrdinal(rdr, "NAND_DENSITY");
                    int IDX_NAND_FAMILY = DB.GetReaderOrdinal(rdr, "NAND_FAMILY");
                    int IDX_PRCSSR_NBR = DB.GetReaderOrdinal(rdr, "PRCSSR_NBR");
                    int IDX_PRD_ATRB_SID = DB.GetReaderOrdinal(rdr, "PRD_ATRB_SID");
                    int IDX_PRD_CATGRY_NM = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM");
                    int IDX_PRD_END_DTM = DB.GetReaderOrdinal(rdr, "PRD_END_DTM");
                    int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
                    int IDX_PRD_STRT_DTM = DB.GetReaderOrdinal(rdr, "PRD_STRT_DTM");
                    int IDX_PRICE_SEGMENT = DB.GetReaderOrdinal(rdr, "PRICE_SEGMENT");
                    int IDX_SBS_NM = DB.GetReaderOrdinal(rdr, "SBS_NM");
                    int IDX_SKU_MARKET_SEGMENT = DB.GetReaderOrdinal(rdr, "SKU_MARKET_SEGMENT");
                    int IDX_SKU_NM = DB.GetReaderOrdinal(rdr, "SKU_NM");
                    int IDX_USR_INPUT = DB.GetReaderOrdinal(rdr, "USR_INPUT");

                    while (rdr.Read())
                    {
                        ret.Add(new ProductDatails
                        {
                            BRND_NM = (IDX_BRND_NM < 0 || rdr.IsDBNull(IDX_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRND_NM),
                            CPU_CACHE = (IDX_CPU_CACHE < 0 || rdr.IsDBNull(IDX_CPU_CACHE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_CACHE),
                            CPU_PACKAGE = (IDX_CPU_PACKAGE < 0 || rdr.IsDBNull(IDX_CPU_PACKAGE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_PACKAGE),
                            CPU_PROCESSOR_NUMBER = (IDX_CPU_PROCESSOR_NUMBER < 0 || rdr.IsDBNull(IDX_CPU_PROCESSOR_NUMBER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_PROCESSOR_NUMBER),
                            CPU_VOLTAGE_SEGMENT = (IDX_CPU_VOLTAGE_SEGMENT < 0 || rdr.IsDBNull(IDX_CPU_VOLTAGE_SEGMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_VOLTAGE_SEGMENT),
                            CPU_WATTAGE = (IDX_CPU_WATTAGE < 0 || rdr.IsDBNull(IDX_CPU_WATTAGE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_WATTAGE),
                            DEAL_PRD_NM = (IDX_DEAL_PRD_NM < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_NM),
                            DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
                            EFF_FR_DTM = (IDX_EFF_FR_DTM < 0 || rdr.IsDBNull(IDX_EFF_FR_DTM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EFF_FR_DTM),
                            EPM_NM = (IDX_EPM_NM < 0 || rdr.IsDBNull(IDX_EPM_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EPM_NM),
                            FMLY_NM = (IDX_FMLY_NM < 0 || rdr.IsDBNull(IDX_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMLY_NM),
                            FMLY_NM_MM = (IDX_FMLY_NM_MM < 0 || rdr.IsDBNull(IDX_FMLY_NM_MM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMLY_NM_MM),
                            GDM_BRND_NM = (IDX_GDM_BRND_NM < 0 || rdr.IsDBNull(IDX_GDM_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GDM_BRND_NM),
                            GDM_FMLY_NM = (IDX_GDM_FMLY_NM < 0 || rdr.IsDBNull(IDX_GDM_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GDM_FMLY_NM),
                            HIER_NM_HASH = (IDX_HIER_NM_HASH < 0 || rdr.IsDBNull(IDX_HIER_NM_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_NM_HASH),
                            HIER_VAL_NM = (IDX_HIER_VAL_NM < 0 || rdr.IsDBNull(IDX_HIER_VAL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_VAL_NM),
                            KIT_NM = (IDX_KIT_NM < 0 || rdr.IsDBNull(IDX_KIT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_KIT_NM),
                            MTRL_ID = (IDX_MTRL_ID < 0 || rdr.IsDBNull(IDX_MTRL_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MTRL_ID),
                            NAND_DENSITY = (IDX_NAND_DENSITY < 0 || rdr.IsDBNull(IDX_NAND_DENSITY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NAND_DENSITY),
                            NAND_FAMILY = (IDX_NAND_FAMILY < 0 || rdr.IsDBNull(IDX_NAND_FAMILY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NAND_FAMILY),
                            PRCSSR_NBR = (IDX_PRCSSR_NBR < 0 || rdr.IsDBNull(IDX_PRCSSR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRCSSR_NBR),
                            PRD_ATRB_SID = (IDX_PRD_ATRB_SID < 0 || rdr.IsDBNull(IDX_PRD_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_ATRB_SID),
                            PRD_CATGRY_NM = (IDX_PRD_CATGRY_NM < 0 || rdr.IsDBNull(IDX_PRD_CATGRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CATGRY_NM),
                            PRD_END_DTM = (IDX_PRD_END_DTM < 0 || rdr.IsDBNull(IDX_PRD_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_END_DTM),
                            PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
                            PRD_STRT_DTM = (IDX_PRD_STRT_DTM < 0 || rdr.IsDBNull(IDX_PRD_STRT_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_STRT_DTM),
                            PRICE_SEGMENT = (IDX_PRICE_SEGMENT < 0 || rdr.IsDBNull(IDX_PRICE_SEGMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRICE_SEGMENT),
                            SBS_NM = (IDX_SBS_NM < 0 || rdr.IsDBNull(IDX_SBS_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SBS_NM),
                            SKU_MARKET_SEGMENT = (IDX_SKU_MARKET_SEGMENT < 0 || rdr.IsDBNull(IDX_SKU_MARKET_SEGMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SKU_MARKET_SEGMENT),
                            SKU_NM = (IDX_SKU_NM < 0 || rdr.IsDBNull(IDX_SKU_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SKU_NM),
                            USR_INPUT = (IDX_USR_INPUT < 0 || rdr.IsDBNull(IDX_USR_INPUT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_USR_INPUT)
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

        public List<ProductIncExcAttribute> SetIncludeExclude(List<ProductIncExcAttribute> data, string opsType)
        {
            OpLogPerf.Log("ProductIncExcAttribute");
            var ret = new List<ProductIncExcAttribute>();
            try
            {
                // Make datatable
                in_t_prd_IncExc dt = new in_t_prd_IncExc();
                dt.AddRows(data);

                Procs.dbo.PR_MYDL_UPD_PRD_ATRB_FLTR_CRI cmd = new Procs.dbo.PR_MYDL_UPD_PRD_ATRB_FLTR_CRI
                {
                    MODE = opsType.ToUpper(),
                    tvt_PRD_ATRB_FLTR_CRI = dt
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ATTR_VAL = DB.GetReaderOrdinal(rdr, "ATTR_VAL");

                    while (rdr.Read())
                    {
                        ret.Add(new ProductIncExcAttribute
                        {
                            ATTR_VAL = (IDX_ATTR_VAL < 0 || rdr.IsDBNull(IDX_ATTR_VAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATTR_VAL)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
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
            OpLogPerf.Log("GetProductIncludeExcludeAttribute");

            var ret = new ProductIncExcAttributeSelector();
            var retProdIncExcAttribute = new List<IncExcAttributeMaster>();
            var retProdIncExc = new List<ProductAttributeSelected>();
            var cmd = new Procs.dbo.PR_MYDL_GET_PRD_INCL_EXCL_CRI { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ATRB_DESC = DB.GetReaderOrdinal(rdr, "ATRB_DESC");
                    int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");

                    while (rdr.Read())
                    {
                        retProdIncExcAttribute.Add(new IncExcAttributeMaster
                        {
                            ATRB_DESC = (IDX_ATRB_DESC < 0 || rdr.IsDBNull(IDX_ATRB_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_DESC),
                            ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID)
                        });
                    }

                    ret.IncExcAttributeMaster = retProdIncExcAttribute;
                    rdr.NextResult();

                    int IDX_ATRB_SID_INC = DB.GetReaderOrdinal(rdr, "ATRB_SID_INC");
                    int IDX_ATRB_SID_EXC = DB.GetReaderOrdinal(rdr, "ATRB_SID_EXC");

                    while (rdr.Read())
                    {
                        retProdIncExc.Add(new ProductAttributeSelected
                        {
                            ATRB_SID_INC = (IDX_ATRB_SID_INC < 0 || rdr.IsDBNull(IDX_ATRB_SID_INC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_SID_INC),
                            ATRB_SID_EXC = (IDX_ATRB_SID_EXC < 0 || rdr.IsDBNull(IDX_ATRB_SID_EXC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_SID_EXC)
                        });
                    }

                    ret.ProductIncExcAttributeSelected = retProdIncExc;
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        /// <summary>
        /// Get Deal types
        /// </summary>
        /// <returns type="List<PrdDealType>">List of Deal types</returns>
        public List<PrdDealType> GetProdDealType()
        {
            var ret = new List<PrdDealType>();
            OpLogPerf.Log("GetProdDealType");

            var cmd = new Procs.dbo.PR_MYDL_GET_DEAL_TYPES { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_OBJ_SET_TYPE_CD = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_CD");
                    int IDX_OBJ_SET_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new PrdDealType
                        {
                            OBJ_SET_TYPE_CD = (IDX_OBJ_SET_TYPE_CD < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE_CD),
                            OBJ_SET_TYPE_SID = (IDX_OBJ_SET_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SET_TYPE_SID)
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

        public List<PrdSelLevel> GetProdSelectionLevel(int OBJ_SET_TYPE_SID = 3)
        {
            var ret = new List<PrdSelLevel>();
            OpLogPerf.Log("GetProdSelectionLevel");
            try
            {
                Procs.dbo.PR_MYDL_LD_PRD_SEL_LVL cmd = new Procs.dbo.PR_MYDL_LD_PRD_SEL_LVL
                {
                    OBJ_SET_TYPE_SID = OBJ_SET_TYPE_SID
                };
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_PRD_ATRB_SID = DB.GetReaderOrdinal(rdr, "PRD_ATRB_SID");
                    int IDX_PRD_SELC_LVL = DB.GetReaderOrdinal(rdr, "PRD_SELC_LVL");

                    while (rdr.Read())
                    {
                        ret.Add(new PrdSelLevel
                        {
                            PRD_ATRB_SID = (IDX_PRD_ATRB_SID < 0 || rdr.IsDBNull(IDX_PRD_ATRB_SID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_ATRB_SID),
                            PRD_SELC_LVL = (IDX_PRD_SELC_LVL < 0 || rdr.IsDBNull(IDX_PRD_SELC_LVL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_SELC_LVL)
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

        /// <summary>
        /// To Insert, Update, Delete the Products and Alias in ProductAlias
        /// </summary>
        /// <input type="CrudModes">To pass the command like Select,Insert, Update, Delete</input>
        /// <input Type="ProductAlias">Product alias data</input>
        /// <returns type="List<ProductAlias>">List of affected rows</returns>
        public List<ProductAlias> SetProductAlias(CrudModes mode, ProductAlias data)
        {
            var ret = new List<ProductAlias>();
            OpLogPerf.Log("SetProductAlias");
            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_PRD_ALIAS()
                {
                    WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    MODE = mode.ToString().ToUpper(),
                    PRD_ALS_NM = data.PRD_ALS_NM,
                    PRD_ALS_SID = data.PRD_ALS_SID,
                    PRD_NM = data.PRD_NM
                }))
                {
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_PRD_ALS_NM = DB.GetReaderOrdinal(rdr, "PRD_ALS_NM");
                    int IDX_PRD_ALS_SID = DB.GetReaderOrdinal(rdr, "PRD_ALS_SID");
                    int IDX_PRD_NM = DB.GetReaderOrdinal(rdr, "PRD_NM");

                    while (rdr.Read())
                    {
                        ret.Add(new ProductAlias
                        {
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                            CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                            PRD_ALS_NM = (IDX_PRD_ALS_NM < 0 || rdr.IsDBNull(IDX_PRD_ALS_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_ALS_NM),
                            PRD_ALS_SID = (IDX_PRD_ALS_SID < 0 || rdr.IsDBNull(IDX_PRD_ALS_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_ALS_SID),
                            PRD_NM = (IDX_PRD_NM < 0 || rdr.IsDBNull(IDX_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_NM)
                        });
                    }
                }
                DataCollections.RecycleCache("_getProductsFromAlias");
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        /// <summary>
        /// Get All products and alias from ProductAlias
        /// </summary>
        /// <returns type="List<ProductAlias>">List of All Products and Alias</returns>
        public List<ProductAlias> GetProductsFromAlias()
        {
            var cmd = new Procs.dbo.PR_MYDL_UPD_PRD_ALIAS
            {
                WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                MODE = CrudModes.Select.ToString()
            };

            var ret = new List<ProductAlias>();

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                int IDX_PRD_ALS_NM = DB.GetReaderOrdinal(rdr, "PRD_ALS_NM");
                int IDX_PRD_ALS_SID = DB.GetReaderOrdinal(rdr, "PRD_ALS_SID");
                int IDX_PRD_NM = DB.GetReaderOrdinal(rdr, "PRD_NM");

                while (rdr.Read())
                {
                    ret.Add(new ProductAlias
                    {
                        CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                        CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                        CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                        CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                        PRD_ALS_NM = (IDX_PRD_ALS_NM < 0 || rdr.IsDBNull(IDX_PRD_ALS_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_ALS_NM),
                        PRD_ALS_SID = (IDX_PRD_ALS_SID < 0 || rdr.IsDBNull(IDX_PRD_ALS_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_ALS_SID),
                        PRD_NM = (IDX_PRD_NM < 0 || rdr.IsDBNull(IDX_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_NM)
                    });
                }
                return ret;
            }
        }

        /// <summary>
        /// Find product match in the database
        /// </summary>
        /// <param name="productsToMatch"></param>
        /// <returns></returns>
        public List<PRD_LOOKUP_RESULTS> FindProductMatch(List<ProductEntryAttribute> productsToMatch)
        {
            OpLogPerf.Log("FindProductMatch");
            var ret = new List<PRD_LOOKUP_RESULTS>();
            try
            {
                // Make datatable
                in_t_prd_entry dt = new in_t_prd_entry();
                dt.AddRows(productsToMatch);

                Procs.dbo.PR_MYDL_GET_PRD_BY_HIER_VAL_NM cmd = new Procs.dbo.PR_MYDL_GET_PRD_BY_HIER_VAL_NM
                {
                    tvt_HIER_VAL_NM = dt
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BRND_NM = DB.GetReaderOrdinal(rdr, "BRND_NM");
                    int IDX_DEAL_PRD_NM = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM");
                    int IDX_FMLY_NM = DB.GetReaderOrdinal(rdr, "FMLY_NM");
                    int IDX_HIER_VAL_NM = DB.GetReaderOrdinal(rdr, "HIER_VAL_NM");
                    int IDX_KIT_NM = DB.GetReaderOrdinal(rdr, "KIT_NM");
                    int IDX_PCSR_NBR = DB.GetReaderOrdinal(rdr, "PCSR_NBR");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
                    int IDX_PRD_END_DTM = DB.GetReaderOrdinal(rdr, "PRD_END_DTM");
                    int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
                    int IDX_PRD_STRT_DTM = DB.GetReaderOrdinal(rdr, "PRD_STRT_DTM");
                    int IDX_SKU_NM = DB.GetReaderOrdinal(rdr, "SKU_NM");
                    int IDX_USR_INPUT = DB.GetReaderOrdinal(rdr, "USR_INPUT");
                    int IDX_HIER_NM_HASH = DB.GetReaderOrdinal(rdr, "HIER_NM_HASH");

                    while (rdr.Read())
                    {
                        ret.Add(new PRD_LOOKUP_RESULTS
                        {
                            BRND_NM = (IDX_BRND_NM < 0 || rdr.IsDBNull(IDX_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRND_NM),
                            HIER_NM_HASH = (IDX_HIER_NM_HASH < 0 || rdr.IsDBNull(IDX_HIER_NM_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_NM_HASH),
                            DEAL_PRD_NM = (IDX_DEAL_PRD_NM < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_NM),
                            FMLY_NM = (IDX_FMLY_NM < 0 || rdr.IsDBNull(IDX_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMLY_NM),
                            HIER_VAL_NM = (IDX_HIER_VAL_NM < 0 || rdr.IsDBNull(IDX_HIER_VAL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_VAL_NM),
                            KIT_NM = (IDX_KIT_NM < 0 || rdr.IsDBNull(IDX_KIT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_KIT_NM),
                            PCSR_NBR = (IDX_PCSR_NBR < 0 || rdr.IsDBNull(IDX_PCSR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PCSR_NBR),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
                            PRD_END_DTM = (IDX_PRD_END_DTM < 0 || rdr.IsDBNull(IDX_PRD_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_END_DTM),
                            PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
                            PRD_STRT_DTM = (IDX_PRD_STRT_DTM < 0 || rdr.IsDBNull(IDX_PRD_STRT_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_STRT_DTM),
                            SKU_NM = (IDX_SKU_NM < 0 || rdr.IsDBNull(IDX_SKU_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SKU_NM),
                            USR_INPUT = (IDX_USR_INPUT < 0 || rdr.IsDBNull(IDX_USR_INPUT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_USR_INPUT)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        public List<PRD_LOOKUP_RESULTS> GetProductDetails(List<ProductEntryAttribute> productsToMatch, Int32 CUST_MBR_SID, Int32 GEO_MBR_SID)
        {
            OpLogPerf.Log("FindProductMatch");
            var ret = new List<PRD_LOOKUP_RESULTS>();
            try
            {
                // Make datatable
                in_t_prd_selector dt = new in_t_prd_selector();
                dt.AddRows(productsToMatch);

                Procs.dbo.PR_MYDL_TRANSLT_PRD_ENTRY cmd = new Procs.dbo.PR_MYDL_TRANSLT_PRD_ENTRY
                {
                    CUST_MBR_SID = CUST_MBR_SID,
                    tvt_HIER_VAL_NM = dt,
                    GEO_MBR_SID = GEO_MBR_SID
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BRND_NM = DB.GetReaderOrdinal(rdr, "BRND_NM");
                    int IDX_CPU_CACHE = DB.GetReaderOrdinal(rdr, "CPU_CACHE");
                    int IDX_CPU_PACKAGE = DB.GetReaderOrdinal(rdr, "CPU_PACKAGE");
                    int IDX_cpu_processor_number = DB.GetReaderOrdinal(rdr, "cpu_processor_number");
                    int IDX_CPU_VOLTAGE_SEGMENT = DB.GetReaderOrdinal(rdr, "CPU_VOLTAGE_SEGMENT");
                    int IDX_CPU_WATTAGE = DB.GetReaderOrdinal(rdr, "CPU_WATTAGE");
                    int IDX_DEAL_PRD_NM = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM");
                    int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
                    int IDX_EFF_FR_DTM = DB.GetReaderOrdinal(rdr, "EFF_FR_DTM");
                    int IDX_EPM_NM = DB.GetReaderOrdinal(rdr, "EPM_NM");
                    int IDX_FMLY_NM = DB.GetReaderOrdinal(rdr, "FMLY_NM");
                    int IDX_fmly_nm_MM = DB.GetReaderOrdinal(rdr, "fmly_nm_MM");
                    int IDX_GDM_BRND_NM = DB.GetReaderOrdinal(rdr, "GDM_BRND_NM");
                    int IDX_GDM_FMLY_NM = DB.GetReaderOrdinal(rdr, "GDM_FMLY_NM");
                    int IDX_HIER_NM_HASH = DB.GetReaderOrdinal(rdr, "HIER_NM_HASH");
                    int IDX_HIER_VAL_NM = DB.GetReaderOrdinal(rdr, "HIER_VAL_NM");
                    int IDX_KIT_NM = DB.GetReaderOrdinal(rdr, "KIT_NM");
                    int IDX_MTRL_ID = DB.GetReaderOrdinal(rdr, "MTRL_ID");
                    int IDX_NAND_Density = DB.GetReaderOrdinal(rdr, "NAND_Density");
                    int IDX_NAND_FAMILY = DB.GetReaderOrdinal(rdr, "NAND_FAMILY");
                    int IDX_PCSR_NBR = DB.GetReaderOrdinal(rdr, "PCSR_NBR");
                    int IDX_PRD_atrb_SID = DB.GetReaderOrdinal(rdr, "PRD_atrb_SID");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
                    int IDX_PRD_END_DTM = DB.GetReaderOrdinal(rdr, "PRD_END_DTM");
                    int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
                    int IDX_PRD_STRT_DTM = DB.GetReaderOrdinal(rdr, "PRD_STRT_DTM");
                    int IDX_PRICE_SEGMENT = DB.GetReaderOrdinal(rdr, "PRICE_SEGMENT");
                    int IDX_SBS_NM = DB.GetReaderOrdinal(rdr, "SBS_NM");
                    int IDX_SKU_MARKET_SEGMENT = DB.GetReaderOrdinal(rdr, "SKU_MARKET_SEGMENT");
                    int IDX_SKU_NM = DB.GetReaderOrdinal(rdr, "SKU_NM");
                    int IDX_USR_INPUT = DB.GetReaderOrdinal(rdr, "USR_INPUT");

                    while (rdr.Read())
                    {
                        ret.Add(new PRD_LOOKUP_RESULTS
                        {
                            BRND_NM = (IDX_BRND_NM < 0 || rdr.IsDBNull(IDX_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRND_NM),
                            CPU_CACHE = (IDX_CPU_CACHE < 0 || rdr.IsDBNull(IDX_CPU_CACHE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_CACHE),
                            CPU_PACKAGE = (IDX_CPU_PACKAGE < 0 || rdr.IsDBNull(IDX_CPU_PACKAGE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_PACKAGE),
                            cpu_processor_number = (IDX_cpu_processor_number < 0 || rdr.IsDBNull(IDX_cpu_processor_number)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cpu_processor_number),
                            CPU_VOLTAGE_SEGMENT = (IDX_CPU_VOLTAGE_SEGMENT < 0 || rdr.IsDBNull(IDX_CPU_VOLTAGE_SEGMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_VOLTAGE_SEGMENT),
                            CPU_WATTAGE = (IDX_CPU_WATTAGE < 0 || rdr.IsDBNull(IDX_CPU_WATTAGE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_WATTAGE),
                            DEAL_PRD_NM = (IDX_DEAL_PRD_NM < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_NM),
                            DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
                            EFF_FR_DTM = (IDX_EFF_FR_DTM < 0 || rdr.IsDBNull(IDX_EFF_FR_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_EFF_FR_DTM),
                            EPM_NM = (IDX_EPM_NM < 0 || rdr.IsDBNull(IDX_EPM_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EPM_NM),
                            FMLY_NM = (IDX_FMLY_NM < 0 || rdr.IsDBNull(IDX_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMLY_NM),
                            fmly_nm_MM = (IDX_fmly_nm_MM < 0 || rdr.IsDBNull(IDX_fmly_nm_MM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_fmly_nm_MM),
                            GDM_BRND_NM = (IDX_GDM_BRND_NM < 0 || rdr.IsDBNull(IDX_GDM_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GDM_BRND_NM),
                            GDM_FMLY_NM = (IDX_GDM_FMLY_NM < 0 || rdr.IsDBNull(IDX_GDM_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GDM_FMLY_NM),
                            HIER_NM_HASH = (IDX_HIER_NM_HASH < 0 || rdr.IsDBNull(IDX_HIER_NM_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_NM_HASH),
                            HIER_VAL_NM = (IDX_HIER_VAL_NM < 0 || rdr.IsDBNull(IDX_HIER_VAL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_VAL_NM),
                            KIT_NM = (IDX_KIT_NM < 0 || rdr.IsDBNull(IDX_KIT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_KIT_NM),
                            MTRL_ID = (IDX_MTRL_ID < 0 || rdr.IsDBNull(IDX_MTRL_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MTRL_ID),
                            NAND_Density = (IDX_NAND_Density < 0 || rdr.IsDBNull(IDX_NAND_Density)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NAND_Density),
                            NAND_FAMILY = (IDX_NAND_FAMILY < 0 || rdr.IsDBNull(IDX_NAND_FAMILY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NAND_FAMILY),
                            PCSR_NBR = (IDX_PCSR_NBR < 0 || rdr.IsDBNull(IDX_PCSR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PCSR_NBR),
                            PRD_atrb_SID = (IDX_PRD_atrb_SID < 0 || rdr.IsDBNull(IDX_PRD_atrb_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_atrb_SID),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
                            PRD_END_DTM = (IDX_PRD_END_DTM < 0 || rdr.IsDBNull(IDX_PRD_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_END_DTM),
                            PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
                            PRD_STRT_DTM = (IDX_PRD_STRT_DTM < 0 || rdr.IsDBNull(IDX_PRD_STRT_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_STRT_DTM),
                            PRICE_SEGMENT = (IDX_PRICE_SEGMENT < 0 || rdr.IsDBNull(IDX_PRICE_SEGMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRICE_SEGMENT),
                            SBS_NM = (IDX_SBS_NM < 0 || rdr.IsDBNull(IDX_SBS_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SBS_NM),
                            SKU_MARKET_SEGMENT = (IDX_SKU_MARKET_SEGMENT < 0 || rdr.IsDBNull(IDX_SKU_MARKET_SEGMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SKU_MARKET_SEGMENT),
                            SKU_NM = (IDX_SKU_NM < 0 || rdr.IsDBNull(IDX_SKU_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SKU_NM),
                            USR_INPUT = (IDX_USR_INPUT < 0 || rdr.IsDBNull(IDX_USR_INPUT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_USR_INPUT)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        /// <summary>
        /// Get product selection levels,
        /// Type/Vertical/Brand(GDM Brand)/Family(GDM Family)/Processor/DealProduct/MM
        /// </summary>
        /// <returns></returns>
        public ProductSelectorWrapper GetProductSelectorWrapper()
        {
            OpLogPerf.Log("GetProductSelectionLevels");
            var ret = new ProductSelectorWrapper();
            var cmd = new Procs.dbo.PR_MYDL_SEARCH_PRD_DTL();
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BRND_NM = DB.GetReaderOrdinal(rdr, "BRND_NM");
                    int IDX_BRND_NM_SID = DB.GetReaderOrdinal(rdr, "BRND_NM_SID");
                    int IDX_DEAL_PRD_NM = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM");
                    int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
                    int IDX_DEAL_PRD_TYPE_SID = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE_SID");
                    int IDX_FMLY_NM = DB.GetReaderOrdinal(rdr, "FMLY_NM");
                    int IDX_HIER_NM_HASH = DB.GetReaderOrdinal(rdr, "HIER_NM_HASH");
                    int IDX_HIER_VAL_NM = DB.GetReaderOrdinal(rdr, "HIER_VAL_NM");
                    int IDX_MRK_LVL1 = DB.GetReaderOrdinal(rdr, "MRK_LVL1");
                    int IDX_MRK_LVL2 = DB.GetReaderOrdinal(rdr, "MRK_LVL2");
                    int IDX_MTRL_ID = DB.GetReaderOrdinal(rdr, "MTRL_ID");
                    int IDX_NAND_Density = DB.GetReaderOrdinal(rdr, "NAND_Density");
                    int IDX_PCSR_NBR = DB.GetReaderOrdinal(rdr, "PCSR_NBR");
                    int IDX_PRD_ATRB_SID = DB.GetReaderOrdinal(rdr, "PRD_ATRB_SID");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
                    int IDX_PRD_CAT_NM_SID = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM_SID");
                    int IDX_PRD_END_DTM = DB.GetReaderOrdinal(rdr, "PRD_END_DTM");
                    int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
                    int IDX_PRD_MRK_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MRK_MBR_SID");
                    int IDX_PRD_STRT_DTM = DB.GetReaderOrdinal(rdr, "PRD_STRT_DTM");

                    while (rdr.Read())
                    {
                        ret.ProductSelectionLevels.Add(new ProductSelectionLevels
                        {
                            BRND_NM = (IDX_BRND_NM < 0 || rdr.IsDBNull(IDX_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRND_NM),
                            BRND_NM_SID = (IDX_BRND_NM_SID < 0 || rdr.IsDBNull(IDX_BRND_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_BRND_NM_SID),
                            DEAL_PRD_NM = (IDX_DEAL_PRD_NM < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_NM),
                            DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
                            DEAL_PRD_TYPE_SID = (IDX_DEAL_PRD_TYPE_SID < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_PRD_TYPE_SID),
                            FMLY_NM = (IDX_FMLY_NM < 0 || rdr.IsDBNull(IDX_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMLY_NM),
                            HIER_NM_HASH = (IDX_HIER_NM_HASH < 0 || rdr.IsDBNull(IDX_HIER_NM_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_NM_HASH),
                            HIER_VAL_NM = (IDX_HIER_VAL_NM < 0 || rdr.IsDBNull(IDX_HIER_VAL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_VAL_NM),
                            MRK_LVL1 = (IDX_MRK_LVL1 < 0 || rdr.IsDBNull(IDX_MRK_LVL1)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MRK_LVL1),
                            MRK_LVL2 = (IDX_MRK_LVL2 < 0 || rdr.IsDBNull(IDX_MRK_LVL2)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MRK_LVL2),
                            MTRL_ID = (IDX_MTRL_ID < 0 || rdr.IsDBNull(IDX_MTRL_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MTRL_ID),
                            NAND_Density = (IDX_NAND_Density < 0 || rdr.IsDBNull(IDX_NAND_Density)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NAND_Density),
                            PCSR_NBR = (IDX_PCSR_NBR < 0 || rdr.IsDBNull(IDX_PCSR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PCSR_NBR),
                            PRD_ATRB_SID = (IDX_PRD_ATRB_SID < 0 || rdr.IsDBNull(IDX_PRD_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_ATRB_SID),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
                            PRD_CAT_NM_SID = (IDX_PRD_CAT_NM_SID < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_CAT_NM_SID),
                            PRD_END_DTM = (IDX_PRD_END_DTM < 0 || rdr.IsDBNull(IDX_PRD_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_END_DTM),
                            PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
                            PRD_MRK_MBR_SID = (IDX_PRD_MRK_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MRK_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MRK_MBR_SID),
                            PRD_STRT_DTM = (IDX_PRD_STRT_DTM < 0 || rdr.IsDBNull(IDX_PRD_STRT_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_STRT_DTM)
                        });
                    } // while

                    rdr.NextResult();

                    int IDX_GDM_BRND_NM = DB.GetReaderOrdinal(rdr, "GDM_BRND_NM");
                    int IDX_GDM_FMLY_NM = DB.GetReaderOrdinal(rdr, "GDM_FMLY_NM");
                    int IDX_NAND_FAMILY = DB.GetReaderOrdinal(rdr, "NAND_FAMILY");
                    int IDX_PRD_FMLY_TXT = DB.GetReaderOrdinal(rdr, "PRD_FMLY_TXT");
                    int IDX_PRD_STRT_DTM_1 = DB.GetReaderOrdinal(rdr, "PRD_STRT_DTM");
                    int IDX_PRD_END_DTM_1 = DB.GetReaderOrdinal(rdr, "PRD_END_DTM");
                    int IDX_PRD_CAT_NM1 = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");

                    while (rdr.Read())
                    {
                        ret.ProductSelectionLevelsAttributes.Add(new ProductSelectionLevelsAttributes
                        {
                            GDM_BRND_NM = (IDX_GDM_BRND_NM < 0 || rdr.IsDBNull(IDX_GDM_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GDM_BRND_NM),
                            GDM_FMLY_NM = (IDX_GDM_FMLY_NM < 0 || rdr.IsDBNull(IDX_GDM_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GDM_FMLY_NM),
                            NAND_FAMILY = (IDX_NAND_FAMILY < 0 || rdr.IsDBNull(IDX_NAND_FAMILY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NAND_FAMILY),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM1 < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM1)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM1),
                            PRD_END_DTM = (IDX_PRD_END_DTM_1 < 0 || rdr.IsDBNull(IDX_PRD_END_DTM_1)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_END_DTM_1),
                            PRD_FMLY_TXT = (IDX_PRD_FMLY_TXT < 0 || rdr.IsDBNull(IDX_PRD_FMLY_TXT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_FMLY_TXT),
                            PRD_STRT_DTM = (IDX_PRD_STRT_DTM_1 < 0 || rdr.IsDBNull(IDX_PRD_STRT_DTM_1)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_STRT_DTM_1)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);

                throw;
            }

            return ret;
        }

        /// <summary>
        /// Product selection results
        /// </summary>
        /// <param name="searchHash"></param>
        /// <param name="startDate"></param>
        /// <param name="endDateTime"></param>
        /// <param name="selectionLevel"></param>
        /// <param name="drillDownFilter"></param>
        /// <returns></returns>
        public List<ProductSelectionResults> GetProductSelectionResults(string searchHash, DateTime startDate, DateTime endDateTime,
                int selectionLevel, string drillDownFilter4, string drillDownFilter5, int custSid, int geoSid)
        {
            OpLogPerf.Log("ProductSelectionResults");
            var ret = new List<ProductSelectionResults>();

            try
            {
                var cmd = new Procs.dbo.PR_MYDL_SEARCH_PRD_DTL
                {
                    SEARCH_HASH = searchHash,
                    STRT_DTM = startDate,
                    END_DTM = endDateTime,
                    SEL_LVL = selectionLevel,
                    DRILL_DOWN_FLTR_4 = drillDownFilter4,
                    DRILL_DOWN_FLTR_5 = drillDownFilter5,
                    CUST_MBR_SID = custSid,
                    GEO_MBR_SID = geoSid
                };
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BRND_NM = DB.GetReaderOrdinal(rdr, "BRND_NM");
                    int IDX_BRND_NM_SID = DB.GetReaderOrdinal(rdr, "BRND_NM_SID");
                    int IDX_CPU_CACHE = DB.GetReaderOrdinal(rdr, "CPU_CACHE");
                    int IDX_CPU_PACKAGE = DB.GetReaderOrdinal(rdr, "CPU_PACKAGE");
                    int IDX_cpu_processor_number = DB.GetReaderOrdinal(rdr, "cpu_processor_number");
                    int IDX_CPU_VOLTAGE_SEGMENT = DB.GetReaderOrdinal(rdr, "CPU_VOLTAGE_SEGMENT");
                    int IDX_CPU_WATTAGE = DB.GetReaderOrdinal(rdr, "CPU_WATTAGE");
                    int IDX_DEAL_PRD_NM = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM");
                    int IDX_DEAL_PRD_NM_SID = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM_SID");
                    int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
                    int IDX_DEAL_PRD_TYPE_SID = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE_SID");
                    int IDX_EFF_FR_DTM = DB.GetReaderOrdinal(rdr, "EFF_FR_DTM");
                    int IDX_EPM_NM = DB.GetReaderOrdinal(rdr, "EPM_NM");
                    int IDX_FMLY_NM = DB.GetReaderOrdinal(rdr, "FMLY_NM");
                    int IDX_fmly_nm_MM = DB.GetReaderOrdinal(rdr, "fmly_nm_MM");
                    int IDX_FMLY_NM_SID = DB.GetReaderOrdinal(rdr, "FMLY_NM_SID");
                    int IDX_GDM_BRND_NM = DB.GetReaderOrdinal(rdr, "GDM_BRND_NM");
                    int IDX_GDM_FMLY_NM = DB.GetReaderOrdinal(rdr, "GDM_FMLY_NM");
                    int IDX_HIER_NM_HASH = DB.GetReaderOrdinal(rdr, "HIER_NM_HASH");
                    int IDX_HIER_VAL_NM = DB.GetReaderOrdinal(rdr, "HIER_VAL_NM");
                    int IDX_MTRL_ID = DB.GetReaderOrdinal(rdr, "MTRL_ID");
                    int IDX_NAND_Density = DB.GetReaderOrdinal(rdr, "NAND_Density");
                    int IDX_NAND_FAMILY = DB.GetReaderOrdinal(rdr, "NAND_FAMILY");
                    int IDX_PCSR_NBR = DB.GetReaderOrdinal(rdr, "PCSR_NBR");
                    int IDX_PRC_AMT = DB.GetReaderOrdinal(rdr, "PRC_AMT");
                    int IDX_PRD_ATRB_SID = DB.GetReaderOrdinal(rdr, "PRD_ATRB_SID");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
                    int IDX_PRD_CAT_NM_SID = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM_SID");
                    int IDX_PRD_END_DTM = DB.GetReaderOrdinal(rdr, "PRD_END_DTM");
                    int IDX_PRD_Fmly_Txt = DB.GetReaderOrdinal(rdr, "PRD_Fmly_Txt");
                    int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
                    int IDX_PRD_STRT_DTM = DB.GetReaderOrdinal(rdr, "PRD_STRT_DTM");
                    int IDX_PRICE_SEGMENT = DB.GetReaderOrdinal(rdr, "PRICE_SEGMENT");
                    int IDX_SBS_NM = DB.GetReaderOrdinal(rdr, "SBS_NM");
                    int IDX_SKU_MARKET_SEGMENT = DB.GetReaderOrdinal(rdr, "SKU_MARKET_SEGMENT");
                    int IDX_SKU_NM = DB.GetReaderOrdinal(rdr, "SKU_NM");

                    while (rdr.Read())
                    {
                        ret.Add(new ProductSelectionResults
                        {
                            BRND_NM = (IDX_BRND_NM < 0 || rdr.IsDBNull(IDX_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRND_NM),
                            BRND_NM_SID = (IDX_BRND_NM_SID < 0 || rdr.IsDBNull(IDX_BRND_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_BRND_NM_SID),
                            CPU_CACHE = (IDX_CPU_CACHE < 0 || rdr.IsDBNull(IDX_CPU_CACHE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_CACHE),
                            CPU_PACKAGE = (IDX_CPU_PACKAGE < 0 || rdr.IsDBNull(IDX_CPU_PACKAGE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_PACKAGE),
                            cpu_processor_number = (IDX_cpu_processor_number < 0 || rdr.IsDBNull(IDX_cpu_processor_number)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cpu_processor_number),
                            CPU_VOLTAGE_SEGMENT = (IDX_CPU_VOLTAGE_SEGMENT < 0 || rdr.IsDBNull(IDX_CPU_VOLTAGE_SEGMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_VOLTAGE_SEGMENT),
                            CPU_WATTAGE = (IDX_CPU_WATTAGE < 0 || rdr.IsDBNull(IDX_CPU_WATTAGE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_WATTAGE),
                            DEAL_PRD_NM = (IDX_DEAL_PRD_NM < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_NM),
                            DEAL_PRD_NM_SID = (IDX_DEAL_PRD_NM_SID < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_PRD_NM_SID),
                            DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
                            DEAL_PRD_TYPE_SID = (IDX_DEAL_PRD_TYPE_SID < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_PRD_TYPE_SID),
                            EFF_FR_DTM = (IDX_EFF_FR_DTM < 0 || rdr.IsDBNull(IDX_EFF_FR_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_EFF_FR_DTM),
                            EPM_NM = (IDX_EPM_NM < 0 || rdr.IsDBNull(IDX_EPM_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EPM_NM),
                            FMLY_NM = (IDX_FMLY_NM < 0 || rdr.IsDBNull(IDX_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMLY_NM),
                            fmly_nm_MM = (IDX_fmly_nm_MM < 0 || rdr.IsDBNull(IDX_fmly_nm_MM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_fmly_nm_MM),
                            FMLY_NM_SID = (IDX_FMLY_NM_SID < 0 || rdr.IsDBNull(IDX_FMLY_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_FMLY_NM_SID),
                            GDM_BRND_NM = (IDX_GDM_BRND_NM < 0 || rdr.IsDBNull(IDX_GDM_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GDM_BRND_NM),
                            GDM_FMLY_NM = (IDX_GDM_FMLY_NM < 0 || rdr.IsDBNull(IDX_GDM_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GDM_FMLY_NM),
                            HIER_NM_HASH = (IDX_HIER_NM_HASH < 0 || rdr.IsDBNull(IDX_HIER_NM_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_NM_HASH),
                            HIER_VAL_NM = (IDX_HIER_VAL_NM < 0 || rdr.IsDBNull(IDX_HIER_VAL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_VAL_NM),
                            MTRL_ID = (IDX_MTRL_ID < 0 || rdr.IsDBNull(IDX_MTRL_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MTRL_ID),
                            NAND_Density = (IDX_NAND_Density < 0 || rdr.IsDBNull(IDX_NAND_Density)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NAND_Density),
                            NAND_FAMILY = (IDX_NAND_FAMILY < 0 || rdr.IsDBNull(IDX_NAND_FAMILY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_NAND_FAMILY),
                            PCSR_NBR = (IDX_PCSR_NBR < 0 || rdr.IsDBNull(IDX_PCSR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PCSR_NBR),
                            PRC_AMT = (IDX_PRC_AMT < 0 || rdr.IsDBNull(IDX_PRC_AMT)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_PRC_AMT),
                            PRD_ATRB_SID = (IDX_PRD_ATRB_SID < 0 || rdr.IsDBNull(IDX_PRD_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_ATRB_SID),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
                            PRD_CAT_NM_SID = (IDX_PRD_CAT_NM_SID < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_CAT_NM_SID),
                            PRD_END_DTM = (IDX_PRD_END_DTM < 0 || rdr.IsDBNull(IDX_PRD_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_END_DTM),
                            PRD_Fmly_Txt = (IDX_PRD_Fmly_Txt < 0 || rdr.IsDBNull(IDX_PRD_Fmly_Txt)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_Fmly_Txt),
                            PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
                            PRD_STRT_DTM = (IDX_PRD_STRT_DTM < 0 || rdr.IsDBNull(IDX_PRD_STRT_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_STRT_DTM),
                            PRICE_SEGMENT = (IDX_PRICE_SEGMENT < 0 || rdr.IsDBNull(IDX_PRICE_SEGMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRICE_SEGMENT),
                            SBS_NM = (IDX_SBS_NM < 0 || rdr.IsDBNull(IDX_SBS_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SBS_NM),
                            SKU_MARKET_SEGMENT = (IDX_SKU_MARKET_SEGMENT < 0 || rdr.IsDBNull(IDX_SKU_MARKET_SEGMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SKU_MARKET_SEGMENT),
                            SKU_NM = (IDX_SKU_NM < 0 || rdr.IsDBNull(IDX_SKU_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SKU_NM)
                        });
                    } // while
                }
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