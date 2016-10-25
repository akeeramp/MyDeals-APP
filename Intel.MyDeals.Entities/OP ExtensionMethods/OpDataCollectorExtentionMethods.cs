using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    public static class OpDataCollectorExtentionMethods
    {
       
        ///// <summary>
        ///// Add a simple data element.
        ///// Uses default service client to get attribute master data.
        ///// </summary>
        ///// <param name="wb"></param>
        ///// <param name="atrb_cd">ATBR_CD to add.</param>
        ///// <param name="atrbVal">Value.</param>
        ///// <returns>Newly added data element.</returns>
        //public static OpDataElement AddDataElement(this OpDataCollector wb, string atrb_cd, object atrbVal)
        //{
        //    return AddDataElement(wb, atrb_cd, atrbVal, DataCollections.GetAttributeData());
        //}

        /// <summary>
        /// Add a simple data element.
        /// </summary>
        /// <param name="wb"></param>
        /// <param name="atrb_cd">ATBR_CD to add.</param>
        /// <param name="atrbVal">Value.</param>
        /// <param name="source_data">Master data list to lookup extended attribute details.</param>
        /// <returns>Newly added data element.</returns>
        public static OpDataElement AddDataElement(this OpDataCollector wb, string atrb_cd, object atrbVal, AttributeCollection source_data)
        {
            var atrb = source_data.Get(atrb_cd);

            var de = new OpDataElement
            {
                DcID = wb.DcID,
                AtrbID = atrb.ATRB_SID,
                AtrbCd = atrb.ATRB_CD,
                DataType = atrb.DOT_NET_DATA_TYPE,
                AtrbValue = atrbVal
            };
            wb.DataElements.Add(de);

            return de;
        }

        /// <summary>
        /// Get first matching attribute
        /// </summary>
        public static OpDataElementAtrb GetAtrb(this OpDataCollector dc, string atrb_cd)
        {
            if (dc == null || dc.DataElements == null) { return null; }

            return dc.DataElements.FirstOrDefault(de => de.AtrbCd == atrb_cd);
        }

        /// <summary>
        /// Get first matching attribute
        /// </summary>
        public static OpDataElementAtrb GetAtrb(this OpDataCollector dc, int atrbId)
        {
            return dc?.DataElements?.FirstOrDefault(de => de.AtrbID == atrbId);
        }

        public static object GetAtrbValue(this OpDataCollector dc, string atrbCd)
        {
            var el = dc?.DataElements?.FirstOrDefault(de => de.AtrbCd == atrbCd);
            return el?.AtrbValue;
        }

        public static object GetAtrbValue(this OpDataCollector dc, int atrbId)
        {
            var el = dc?.DataElements?.FirstOrDefault(de => de.AtrbID == atrbId);
            return el?.AtrbValue;
        }

        /// <summary>
        /// Get all matching attributes
        /// </summary>
        public static IEnumerable<OpDataElementAtrb> GetAtrbs(this OpDataCollector dc, string atrbCd)
        {
            if (dc?.DataElements == null) { return new OpDataElementAtrb[]{}; }
            return dc.DataElements.Where(de => de.AtrbCd == atrbCd);
        }

        /// <summary>
        /// Get all matching attributes
        /// </summary>
        public static IEnumerable<OpDataElementAtrb> GetAtrbs(this OpDataCollector dc, int atrb_id)
        {
            if (dc == null || dc.DataElements == null) { return new OpDataElementAtrb[] { }; }

            return dc.DataElements.Where(de => de.AtrbID == atrb_id);
        }




        public static DealType GetDealType(this OpDataCollector dc, List<DealType> dealTypeData)
        {             
            OpDataElement deDealType = dc.DataElements.FirstOrDefault(d => d.AtrbCd == AttributeCodes.DEAL_TYPE_CD_SID);
            return deDealType == null ? null : dealTypeData.FirstOrDefault(d => d.DEAL_TYPE_SID.ToString() == deDealType.AtrbValue.ToString());
        }

        public static string GetDealTypeCd(this OpDataCollector dc, List<DealType> dealTypeData)
        {
            OpDataElement deDealType = dc.DataElements.FirstOrDefault(d => d.AtrbCd == AttributeCodes.DEAL_TYPE_CD_SID);
            return deDealType == null ? null : dealTypeData.Where(d => d.DEAL_TYPE_SID.ToString() == deDealType.AtrbValue.ToString()).Select(d => d.DEAL_TYPE_CD).FirstOrDefault();
        }

        public static List<string> GetListOfVerticals(this OpDataCollector dc, List<OpAtrbMap> atrbMap)
        {
            if (dc == null) return new List<string>();
            List<int> des = dc.DataElements.Where(d => d.AtrbCd == AttributeCodes.PRD_LEVEL).Select(d => d.DimKey.GetDistinctDimKeyValue(AttributeCodes.PRD_MBR_SID, 0)).ToList();
            return atrbMap.Where(a => a.AtrbCd == AttributeCodes.PRD_CATGRY_NM && des.Contains(a.AtrbItemId)).Select(a => a.AtrbItemValue).Distinct().ToList();
        }



        /// <summary>
        /// Ensure each data collector has the DcAltId set when known, and has an OpDataElement for DEAL_SID.
        /// </summary>
        public static void EnsureDcType(this OpDataCollector dc, AttributeCollection sourceData, string defDealType = null)
        {
            if (dc == null || !string.IsNullOrEmpty(dc.DcType)) { return; }

            string dealType = defDealType;

            if (dealType == null)
            {
                string deDealTypeSid = dc.GetAtrbValue(AttributeCodes.DEAL_TYPE_CD_SID).ToString();

                if (string.IsNullOrEmpty(deDealTypeSid))
                {
                    dc.DcType = string.Empty;
                    return;
                }

                dealType = sourceData.MasterDataLookups
                    .Where(m => m.AtrbCd == AttributeCodes.DEAL_TYPE_CD_SID && m.AtrbItemId.ToString() == deDealTypeSid)
                    .Select(m => m.AtrbItemValue).FirstOrDefault();
            }

            if (dealType == OpDataElementType.Contract.ToString()) dealType = "CONTRACT";
            if (dealType == OpDataElementType.PricingStrategy.ToString()) dealType = "PRICING STRAT";
            if (dealType == OpDataElementType.PricingTable.ToString()) dealType = "PRICING TABLE";

            dc.DcType = dealType ?? string.Empty;

            IOpDataElement deDealTypeCd = (IOpDataElement) dc.GetAtrb(AttributeCodes.DEAL_TYPE_CD);
            if (deDealTypeCd == null)
            {
                dc.DataElements.Add(new OpDataElement
                {
                    DcID = dc.DcID,
                    DcAltID = dc.DcAltID,
                    AtrbID = 5,
                    AtrbValue = dc.DcType,
                    OrigAtrbValue = dc.DcType,
                    PrevAtrbValue = dc.DcType,
                    AtrbCd = AttributeCodes.DEAL_TYPE_CD,
                    State = OpDataElementState.Unchanged
                });
            }
            else if (deDealTypeCd.AtrbValue.ToString() == string.Empty)
            {
                deDealTypeCd.AtrbValue=dc.DcType;
            }

        }

        /// <summary>
        /// Ensure each data collector has the DcAltId set when known, and has an OpDataElement for DEAL_SID.
        /// </summary>
        public static void EnsureObjSetIdAtrb(this OpDataCollector dc, AttributeCollection sourceData)
        {
            if (dc == null) { return; }

            var atrb = sourceData.Get(AttributeCodes.DEAL_SID);
            if (dc.DataElements.All(de => de.AtrbID != atrb.ATRB_SID))
            {
                dc.DataElements.Add(new OpDataElement
                {
                    AtrbCd = atrb.ATRB_CD,
                    AtrbID = atrb.ATRB_SID,
                    AtrbValue = dc.DcID,
                    DcID = dc.DcID,
                    DcAltID = dc.DcAltID,
                    State = OpDataElementState.Unchanged
                });
            }

        }
    }
}
