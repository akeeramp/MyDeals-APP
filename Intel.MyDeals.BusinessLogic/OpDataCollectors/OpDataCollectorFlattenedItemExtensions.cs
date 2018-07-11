using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Helpers;
using Intel.Opaque;
using Intel.Opaque.Data;
using Newtonsoft.Json;

namespace Intel.MyDeals.BusinessLogic.DataCollectors
{

    public static class OpDataCollectorFlattenedItemExtensions
    {
        public static void ApplyMessages(this OpDataCollectorFlattenedItem data, MyDealsData myDealsData)
        {
            List<string> infoMsgs = new List<string>();
            List<string> warnMsgs = new List<string>();

            if (!data.ContainsKey(AttributeCodes.DC_ID)) return;
            OpDataElementType opDataElementType = OpDataElementTypeConverter.FromString(data[AttributeCodes.dc_type]);

            var msgCol = myDealsData[opDataElementType].Messages.Messages.Where(m =>
                (m.MsgType == OpMsg.MessageType.Error || m.MsgType == OpMsg.MessageType.Warning ||
                m.MsgType == OpMsg.MessageType.Info) &&
                (!myDealsData[opDataElementType].Messages.Messages[0].KeyIdentifiers.Any() ||
                m.KeyIdentifiers.Contains(Int32.Parse(data[AttributeCodes.DC_ID].ToString())))).ToList();

            if (!msgCol.Any())
            {
                foreach (var dc in myDealsData[opDataElementType].AllDataCollectors)
                {
                    foreach (var de in dc.DataElements.Where(d => d.ValidationMessage != string.Empty))
                    {
                        myDealsData[opDataElementType].Messages.WriteMessage(OpMsg.MessageType.Warning, de.ValidationMessage);
                    }
                }
            }

            msgCol = myDealsData[opDataElementType].Messages.Messages.Where(m =>
               (m.MsgType == OpMsg.MessageType.Error || m.MsgType == OpMsg.MessageType.Warning ||
               m.MsgType == OpMsg.MessageType.Info) &&
               (!myDealsData[opDataElementType].Messages.Messages[0].KeyIdentifiers.Any() ||
               m.KeyIdentifiers.Contains(Int32.Parse(data[AttributeCodes.DC_ID].ToString())))).ToList();

            foreach (OpMsg msg in msgCol)
            {
                switch (msg.MsgType)
                {
                    case OpMsg.MessageType.Info:
                        infoMsgs.Add(msg.Message.Replace("\r\n", ""));
                        break;

                    case OpMsg.MessageType.Error:
                    case OpMsg.MessageType.Warning:
                        warnMsgs.Add(msg.Message.Replace("\r\n", ""));
                        break;
                }
            }

            data["infoMessages"] = infoMsgs;
            data["warningMessages"] = warnMsgs;
        }

        public static void EnsureBasicIds(this OpDataCollectorFlattenedItem item, int dcId, string dcType, int dcParentId, string dcParentType)
        {
            item[AttributeCodes.DC_ID] = dcId;
            item[AttributeCodes.dc_type] = dcType;
            item[AttributeCodes.DC_PARENT_ID] = dcParentId;
            item[AttributeCodes.dc_parent_type] = dcParentType;
        }

        public static void MapMultiDim(this OpDataCollectorFlattenedItem item)
        {
            if (item.ContainsKey(EN.OBJDIM._MULTIDIM))
                item[EN.OBJDIM._MULTIDIM] = ((Dictionary<string, OpDataCollectorFlattenedItem>)item[EN.OBJDIM._MULTIDIM]).Values.ToList();
        }

        public static void ApplySingleAndMultiDim(this OpDataCollectorFlattenedItem objsetItem, OpDataElement de, OpDataCollector dc, ObjSetPivotMode pivotMode)
        {
            string dimKey = de.DimKeyString ?? "";

            if (string.IsNullOrEmpty(dimKey) && de.DimID <= 0) // single dim
            {
                objsetItem[de.AtrbCd] = de.AtrbValue;
            }
            else  // multi dim
            {
                if (de.DimID > 0)
                    objsetItem.PivotData(de, dc, pivotMode, de.DimID);
                else
                    objsetItem.PivotData(de, dc, pivotMode, dimKey);
            }

            objsetItem.SetBehavior("isRequired", de.AtrbCd, de.IsRequired);
            objsetItem.SetBehavior("isReadOnly", de.AtrbCd, de.IsReadOnly);
            objsetItem.SetBehavior("isHidden", de.AtrbCd, de.IsHidden);
            objsetItem.SetBehavior("isError", de.AtrbCd, de.ValidationMessage != string.Empty);
            objsetItem.SetBehavior("validMsg", de.AtrbCd, de.ValidationMessage);
        }

        public static int GetIntAtrb(this OpDataCollectorFlattenedItem items, string atrbCd)
        {
            return !items.ContainsKey(atrbCd) || items[atrbCd] == null ? 0 : Convert.ToInt32(items[atrbCd].ToString());
        }

        public static int GetIntAtrbFromOpDataElementType(this OpDataCollectorFlattenedItem items, string atrbCd)
        {
            return !items.ContainsKey(atrbCd) || items[atrbCd] == null ? 0 : OpDataElementTypeConverter.FromString(items[atrbCd]).ToId();
        }

        private static void SetBehavior<T>(this OpDataCollectorFlattenedItem objsetItem, string behaveType, string name, T value)
        {
            if (!objsetItem.ContainsKey("_behaviors")) objsetItem["_behaviors"] = new OpDataCollectorFlattenedItem();
            OpDataCollectorFlattenedItem behav = (OpDataCollectorFlattenedItem)objsetItem["_behaviors"];

            if (!behav.ContainsKey(behaveType)) behav[behaveType] = new OpDataCollectorFlattenedItem();
            if (value.GetType().Name == "Boolean")
            {
                if (bool.Parse(value.ToString())) ((OpDataCollectorFlattenedItem)behav[behaveType])[name] = true;
            }
            else
            {
                if (value.ToString() != string.Empty) ((OpDataCollectorFlattenedItem)behav[behaveType])[name] = value;
            }
        }

        private static void PivotData(this OpDataCollectorFlattenedItem objsetItem, OpDataElement de, OpDataCollector dc, ObjSetPivotMode pivotMode, object dimKey)
        {
            string dimName = EN.OBJDIM._MULTIDIM;
            string pivotName = EN.OBJDIM.PIVOT;
            string pivotKeyName = EN.OBJDIM._PIVOTKEY;
            string titleKeyName = EN.OBJDIM.TITLE;

            // setup _pivot
            if (!objsetItem.ContainsKey(pivotKeyName))
            {
                objsetItem[pivotKeyName] = new Dictionary<string, OpDataCollectorFlattenedItem>
                {
                    [dimName] = new OpDataCollectorFlattenedItem()
                };
            }
            if (de.AtrbCd == titleKeyName)
            {
                ((Dictionary<string, OpDataCollectorFlattenedItem>)objsetItem[pivotKeyName])[dimName][de.AtrbValue.ToString()] = dimKey;
            }

            string strDimKey = ((string)dimKey).DimKeySafe();

            switch (pivotMode)
            {
                case ObjSetPivotMode.Pivoted:
                    if (!objsetItem.ContainsKey(dimName)) objsetItem[dimName] = new Dictionary<string, OpDataCollectorFlattenedItem>();
                    Dictionary<string, OpDataCollectorFlattenedItem> collection = (Dictionary<string, OpDataCollectorFlattenedItem>)objsetItem[dimName];

                    if (!collection.ContainsKey(strDimKey)) collection[strDimKey] = new OpDataCollectorFlattenedItem();

                    if (!collection[strDimKey].ContainsKey(pivotName))
                    {
                        collection[strDimKey][AttributeCodes.DC_ID] = de.DcID;
                        collection[strDimKey][pivotName] = dimKey;
                    }

                    collection[strDimKey][de.AtrbCd] = de.AtrbValue.ToString();

                    collection[strDimKey].SetBehavior("isRequired", de.AtrbCd, de.IsRequired);
                    collection[strDimKey].SetBehavior("isReadOnly", de.AtrbCd, de.IsReadOnly);
                    collection[strDimKey].SetBehavior("isHidden", de.AtrbCd, de.IsHidden);

                    break;

                case ObjSetPivotMode.Nested:

                    if (objsetItem.ContainsKey(de.AtrbCd)) return;

                    Dictionary<string, string> dictDes = new Dictionary<string, string>();
                    foreach (IOpDataElement item in dc.GetDataElements(de.AtrbCd))
                    {
                        if (item.AtrbValue.ToString() != string.Empty || item.State != OpDataElementState.Unchanged)
                            dictDes[item.DimKey.ToString().DimKeySafe()] = item.AtrbValue.ToString();
                    }
                    objsetItem[de.AtrbCd] = dictDes;

                    break;

                case ObjSetPivotMode.UniqueKey:

                    if (objsetItem.ContainsKey(de.AtrbCd)) return;

                    foreach (IOpDataElement item in dc.GetDataElements(de.AtrbCd))
                    {
                        objsetItem[item.AtrbCd + item.DimKeyString.AtrbCdDimKeySafe()] = item.AtrbValue.ToString();
                    }

                    break;
            }
        }

        public static OpDataCollectorFlattenedList TranslateToWip(this OpDataCollectorFlattenedItem opFlatItem)
        {
            OpDataCollectorFlattenedList retItems = new OpDataCollectorFlattenedList();
            ProdMappings items = null;

            // check that this is the correct OpDataElementType and has products
            if (!opFlatItem.ContainsKey(AttributeCodes.dc_type) || opFlatItem[AttributeCodes.dc_type].ToString() != OpDataElementType.PRC_TBL_ROW.ToString()) return retItems;
            if (!opFlatItem.ContainsKey(AttributeCodes.PTR_SYS_PRD) || opFlatItem[AttributeCodes.PTR_SYS_PRD] == null || opFlatItem[AttributeCodes.PTR_SYS_PRD].ToString() == string.Empty) return retItems;

            OpDataElementType opType = OpDataElementTypeConverter.FromString(opFlatItem[AttributeCodes.dc_type]);
            OpDataElementSetType opSetType = OpDataElementSetTypeConverter.FromString(opFlatItem[AttributeCodes.OBJ_SET_TYPE_CD]);

            OpDataElementTypeMapping elMapping = opSetType.OpDataElementTypeChildMapping(opType);
            OpDataElementAtrbTemplate template = OpDataElementUiExtensions.GetAtrbTemplate(elMapping.ChildOpDataElementType, elMapping.ChildOpDataElementSetType);

            List<string> singleDimAtrbs = template.Where(t => t.DimID == 0 && !t.DimKey.Any()).Select(t => t.AtrbCd).Distinct().ToList();
            List<string> multiDimAtrbs = template.Where(t => t.DimID != 0 || t.DimKey.Any()).Select(t => t.AtrbCd + t.DimKeyString.AtrbCdDimKeySafe()).Distinct().ToList();

            // Get Product string already approved by Product Entry.  We should be able to trust these values
            string products = opFlatItem[AttributeCodes.PTR_SYS_PRD].ToString();
            var productDrawingOrder = new List<string>();
            if (opFlatItem[AttributeCodes.OBJ_SET_TYPE_CD].ToString().ToUpper() == "KIT" && opFlatItem.ContainsKey(AttributeCodes.PRD_DRAWING_ORD))
            {
                productDrawingOrder = opFlatItem[AttributeCodes.PRD_DRAWING_ORD].ToString().Split(',').ToList();
            }

            try
            {
                products = FixesHelpers.FixStructure(products);
                items = JsonConvert.DeserializeObject<ProdMappings>(products);
            }
            catch (Exception ex)
            {
                throw new Exception("Unable to parse the Products entered", ex);
            }

            List<string> geos = GetGeos(opFlatItem["GEO_COMBINED"].ToString());

            switch (elMapping.TranslationType)
            {
                case OpTranslationType.OneDealPerProduct:
                    foreach (KeyValuePair<string, IEnumerable<ProdMapping>> kvp in items)
                    {
                        var item = (List<ProdMapping>)kvp.Value;
                        foreach (ProdMapping pMap in item)
                        {
                            foreach (string g in geos)
                            {
                                retItems.CopyMatchingAttributes(opFlatItem, elMapping, singleDimAtrbs, multiDimAtrbs, new List<ProdMapping> { pMap }, g);
                            }
                        }
                    }
                    break;

                case OpTranslationType.OneDealPerRow:

                    List<ProdMapping> pMaps = new List<ProdMapping>();
                    foreach (KeyValuePair<string, IEnumerable<ProdMapping>> kvp in items)
                    {
                        pMaps.AddRange((List<ProdMapping>)kvp.Value);
                    }
                    if (opFlatItem[AttributeCodes.OBJ_SET_TYPE_CD].ToString().ToUpper() == "KIT")
                    {
                        pMaps = pMaps.OrderBy(p => productDrawingOrder.IndexOf(p.PRD_MBR_SID)).ToList();
                    }
                    foreach (string g in geos)
                    {
                        retItems.CopyMatchingAttributes(opFlatItem, elMapping, singleDimAtrbs, multiDimAtrbs, pMaps, g);
                    }
                    break;
            }

            return retItems;
        }

        public static List<string> GetGeos(string geoString)
        {
            return (from Match m in Regex.Matches(geoString, @"\[[^]]*]|\{[^}]*}|[^,]+")
                    select m.Value.Replace("[", "").Replace("]", "")).ToList();
        }

        public static OpDataCollectorFlattenedItem TranslateToPrcTbl(this OpDataCollectorFlattenedItem opFlatItem, OpDataCollectorFlattenedItem pricingTable)
        {
            OpDataCollectorFlattenedItem retItems = new OpDataCollectorFlattenedItem();

            // check that this is the correct OpDataElementType and has products
            if (!opFlatItem.ContainsKey(AttributeCodes.dc_type) || !opFlatItem.ContainsKey(AttributeCodes.OBJ_SET_TYPE_CD) || opFlatItem[AttributeCodes.dc_type].ToString() != OpDataElementType.WIP_DEAL.ToString()) return retItems;

            OpDataElementType opType = OpDataElementTypeConverter.FromString(opFlatItem[AttributeCodes.dc_type]);
            OpDataElementSetType opSetType = OpDataElementSetTypeConverter.FromString(opFlatItem[AttributeCodes.OBJ_SET_TYPE_CD]);

            OpDataElementTypeMapping elMapping = opSetType.OpDataElementTypeParentMapping(opType);
            OpDataElementAtrbTemplate template = OpDataElementUiExtensions.GetAtrbTemplate(elMapping.ParentOpDataElementType, elMapping.ParentOpDataElementSetType);

            List<string> singleDimAtrbs = template.Where(t => t.DimID == 0 && !t.DimKey.Any()).Select(t => t.AtrbCd).Distinct().ToList();
            //List<string> multiDimAtrbs = template.Where(t => t.DimID != 0 || t.DimKey.Any()).Select(t => t.AtrbCd + t.DimKeyString.AtrbCdDimKeySafe()).Distinct().ToList();
            List<string> multiDimAtrbs = template.Where(t => t.DimID != 0 || t.DimKey.Any()).Select(t => t.AtrbCd).Distinct().ToList();

            foreach (string key in opFlatItem.Keys.Where(k => k != AttributeCodes.dc_type && k != AttributeCodes.dc_parent_type))
            {
                if (singleDimAtrbs.Contains(key))
                {
                    if (key == AttributeCodes.ECAP_PRICE)
                    {
                        var jsonStr = opFlatItem[key].ToString().Replace("null", "0");
                        var items = JsonConvert.DeserializeObject<Dictionary<string, float>>(jsonStr);
                        retItems[key] = items["20___0"];
                    }
                    else if (key == AttributeCodes.GEO_COMBINED)
                    {
                        // let's leave this and let the DB version take control
                        //retItems[key] = opFlatItem[key].ToString().IndexOf(",") >= 0 ? $"[{opFlatItem[key]}]": retItems[key] = opFlatItem[key];
                    }
                    else
                    {
                        retItems[key] = opFlatItem[key];
                    }
                }
                else if (multiDimAtrbs.Contains(key))
                {
                    OpDataCollectorFlattenedItem item = JsonConvert.DeserializeObject<OpDataCollectorFlattenedItem>(opFlatItem[key].ToString());
                    foreach (KeyValuePair<string, object> kvp in item)
                    {
                        retItems[key + "_____" + kvp.Key] = kvp.Value;
                    }
                }
                else
                {
#if DEBUG
                    //System.Diagnostics.Debug.WriteLine($"Attribute NOT MAPPED during TranslateToWip: {key}");
#endif
                }
            }

            // PTR
            retItems[AttributeCodes.DC_ID] = opFlatItem[AttributeCodes.DC_PARENT_ID];
            retItems[AttributeCodes.dc_type] = elMapping.ParentOpDataElementType;
            retItems[AttributeCodes.OBJ_SET_TYPE_CD] = elMapping.ParentOpDataElementSetType;

            if (pricingTable.Count > 0)
            {
                retItems[AttributeCodes.DC_PARENT_ID] = pricingTable[AttributeCodes.DC_ID];
                retItems[AttributeCodes.dc_parent_type] = pricingTable[AttributeCodes.dc_type];
            }
            else
            {
                retItems[AttributeCodes.DC_PARENT_ID] = 0;
                retItems[AttributeCodes.dc_parent_type] = elMapping.ParentOpDataElementType;
            }

            return retItems;
        }

        public static void CopyMatchingAttributes(this OpDataCollectorFlattenedList retItems, OpDataCollectorFlattenedItem opFlatItemLocal, OpDataElementTypeMapping elMapping,
            List<string> singleDimAtrbs, List<string> multiDimAtrbs, List<ProdMapping> pMaps, string geo)
        {
            string baseEcapDimKey = "_____20___0";
            string baseKitDimKey = "_____20___";

            //L1 / L2 counters used to determine if kit deal eligible for subkit
            int numL1 = 0;
            int numL2 = 0;

            ////below used for calculating NORTHBRIDGE_SPLIT in KIT deals
            //string CHIPSET = "CS";
            //List<string> chipsetEcapDims = new List<string>();
            //decimal northbridgeSum = 0.00;

            OpDataCollectorFlattenedItem newItem = new OpDataCollectorFlattenedItem();

            // make a copy so we don't cross-contaminate records
            OpDataCollectorFlattenedItem opFlatItem = new OpDataCollectorFlattenedItem();
            foreach (KeyValuePair<string, object> kvp in opFlatItemLocal)
            {
                opFlatItem[kvp.Key] = kvp.Value;
            }

            switch (elMapping.TranslationType)
            {
                case OpTranslationType.OneDealPerProduct:

                    foreach (ProdMapping pMap in pMaps)
                    {
                        opFlatItem[AttributeCodes.PRODUCT_FILTER + "_____7___" + pMap.PRD_MBR_SID + "____20___0"] = pMap.PRD_MBR_SID;
                        opFlatItem[AttributeCodes.TITLE] = pMap.HIER_VAL_NM;
                        opFlatItem[AttributeCodes.CAP + baseEcapDimKey] = pMap.CAP;
                        opFlatItem[AttributeCodes.CAP_STRT_DT + baseEcapDimKey] = pMap.CAP == "No CAP" ? "" : pMap.CAP_START;
                        opFlatItem[AttributeCodes.CAP_END_DT + baseEcapDimKey] = pMap.CAP == "No CAP" ? "" : pMap.CAP_END;
                        opFlatItem[AttributeCodes.YCS2_PRC_IRBT + baseEcapDimKey] = pMap.YCS2;
                        opFlatItem[AttributeCodes.YCS2_START_DT + baseEcapDimKey] = pMap.YCS2 == "No YCS2" ? "" : pMap.YCS2_START;
                        opFlatItem[AttributeCodes.YCS2_END_DT + baseEcapDimKey] = pMap.YCS2 == "No YCS2" ? "" : pMap.YCS2_END;
                        opFlatItem[AttributeCodes.PRD_COST] = pMap.PRD_COST;
                        opFlatItem[AttributeCodes.PRD_STRT_DTM] = pMap.PRD_STRT_DTM;
                        opFlatItem[AttributeCodes.PRD_END_DTM] = pMap.PRD_END_DTM;
                        opFlatItem[AttributeCodes.HAS_L1] = pMap.HAS_L1;
                        opFlatItem[AttributeCodes.HAS_L2] = pMap.HAS_L2;
                        opFlatItem[AttributeCodes.PRODUCT_CATEGORIES] = pMap.PRD_CAT_NM;
                    }
                    break;

                case OpTranslationType.OneDealPerRow:

                    List<string> pTitle = new List<string>();
                    List<string> pCat = new List<string>();
                    var dim = 0;

                    if (opFlatItem[AttributeCodes.OBJ_SET_TYPE_CD].ToString().ToUpper() == "KIT")
                    {
                        var numDim = 0;
                        foreach (string key in opFlatItem.Keys.Where(k => k.ToString().Contains("ECAP_PRICE") && !k.ToString().Contains(baseKitDimKey + "__"))) {
                            numDim++;   //it's probably safe to assume kit will always have 10 positive dims at most, but to have less hard-coded maintenance we just caluclate it here using ECAP_PRICE
                        }

                        for (int i = 0; i < numDim; i++)
                        {
                            //blank out all cap and ycs2 details (we reset them later if needed, but this will prevent leftover data from lingering if we delete a product)
                            opFlatItem[AttributeCodes.CAP + baseKitDimKey + i] = "";
                            opFlatItem[AttributeCodes.CAP_STRT_DT + baseKitDimKey + i] = "";
                            opFlatItem[AttributeCodes.CAP_END_DT + baseKitDimKey + i] = "";
                            opFlatItem[AttributeCodes.YCS2_PRC_IRBT + baseKitDimKey + i] = "";
                            opFlatItem[AttributeCodes.YCS2_START_DT + baseKitDimKey + i] = "";
                            opFlatItem[AttributeCodes.YCS2_END_DT + baseKitDimKey + i] = "";
                        }
                    }

                    double kitCap = 0;
                    double kitYcs2 = 0;
                    bool validKitCap = false;
                    bool validkitYcs2 = false;
                    foreach (ProdMapping pMap in pMaps.Where(p => !p.EXCLUDE))
                    {
                        if (opFlatItem[AttributeCodes.OBJ_SET_TYPE_CD].ToString().ToUpper() == "KIT")
                        {
                            opFlatItem[AttributeCodes.PRODUCT_FILTER + "_____7___" + pMap.PRD_MBR_SID + "____20___" + dim] = pMap.PRD_MBR_SID;  //copying the original code where it only has 4 leading underscores - why is that the case? seems intentional...
                            opFlatItem[AttributeCodes.CAP + baseKitDimKey + dim] = pMap.CAP;
                            opFlatItem[AttributeCodes.CAP_STRT_DT + baseKitDimKey + dim] = pMap.CAP == "No CAP" ? "" : pMap.CAP_START;
                            opFlatItem[AttributeCodes.CAP_END_DT + baseKitDimKey + dim] = pMap.CAP == "No CAP" ? "" : pMap.CAP_END;
                            opFlatItem[AttributeCodes.YCS2_PRC_IRBT + baseKitDimKey + dim] = pMap.YCS2;
                            opFlatItem[AttributeCodes.YCS2_START_DT + baseKitDimKey + dim] = pMap.YCS2 == "No YCS2" ? "" : pMap.YCS2_START;
                            opFlatItem[AttributeCodes.YCS2_END_DT + baseKitDimKey + dim] = pMap.YCS2 == "No YCS2" ? "" : pMap.YCS2_END;

                            int tmpQty;
                            double tmpPrc;
                            if (double.TryParse(opFlatItem[AttributeCodes.CAP + baseKitDimKey + dim]?.ToString(), out tmpPrc))
                            {
                                validKitCap = true;
                                if (int.TryParse(opFlatItem[AttributeCodes.QTY + baseKitDimKey + dim]?.ToString(), out tmpQty))
                                {
                                    kitCap += (tmpPrc * tmpQty);
                                } else
                                {
                                    kitCap += (tmpPrc * 1);
                                }
                            }

                            if (double.TryParse(opFlatItem[AttributeCodes.YCS2_PRC_IRBT + baseKitDimKey + dim]?.ToString(), out tmpPrc))
                            {
                                validkitYcs2 = true;
                                if (int.TryParse(opFlatItem[AttributeCodes.QTY + baseKitDimKey + dim]?.ToString(), out tmpQty))
                                {
                                    kitYcs2 += (tmpPrc * tmpQty);
                                }
                                else
                                {
                                    kitYcs2 += (tmpPrc * 1);
                                }
                            }
                            //if (pMap.PRD_CAT_NM == CHIPSET)
                            //{
                            //    chipsetEcapDims.Add("ECAP_PRICE" + baseKitDimKey + dim);
                            //}
                        }
                        else
                        {
                            opFlatItem[AttributeCodes.PRODUCT_FILTER + "_____7___" + pMap.PRD_MBR_SID + "____20___0"] = pMap.PRD_MBR_SID;  //why did this only have 4 underscores?
                        }
                        dim++;

                        pTitle.Add(pMap.HIER_VAL_NM);
                        pCat.Add(pMap.PRD_CAT_NM);
                        int l1, l2;
                        l1 = pMap.HAS_L1;
                        l2 = pMap.HAS_L2;

                        if (l1 >= 1)
                        {
                            numL1++;
                        }
                        if (l2 >= 1)
                        {
                            numL2++;
                        }
                    }

                    //check if eligible to create subkits
                    if (opFlatItem[AttributeCodes.OBJ_SET_TYPE_CD].ToString().ToUpper() == "KIT")
                    {

                        opFlatItem[AttributeCodes.CAP + baseKitDimKey + "__1"] = validKitCap ? kitCap.ToString() : "";
                        opFlatItem[AttributeCodes.YCS2_PRC_IRBT + baseKitDimKey + "__1"] = validkitYcs2 ? kitYcs2.ToString() : "";

                        opFlatItem[AttributeCodes.HAS_SUBKIT] = 0;  //default to 0=false
                        if (pMaps.Count() > 2)
                        {
                            //"If a kit having more than two products, having two L1 or one L1 and one L2,then can create subkit"
                            if ((numL1 == 2 && numL2 == 0) || (numL1 == 1 && numL2 == 1))
                            {
                                opFlatItem[AttributeCodes.HAS_SUBKIT] = 1;
                            }
                        }
                    }

                    opFlatItem[AttributeCodes.HAS_L1] = numL1;
                    opFlatItem[AttributeCodes.HAS_L2] = numL2;
                    opFlatItem[AttributeCodes.TITLE] = string.Join(",", pTitle);
                    opFlatItem[AttributeCodes.PRODUCT_CATEGORIES] = string.Join(",", pCat.Distinct());

                    break;
            }

            foreach (string key in opFlatItem.Keys.Where(k => k != AttributeCodes.dc_type && k != AttributeCodes.dc_parent_type))
            {
                if (singleDimAtrbs.Contains(key))
                {
                    newItem[key] = opFlatItem[key];
                }
                else if (multiDimAtrbs.IndexOf(key) >= 0 || key.IndexOf(AttributeCodes.PRODUCT_FILTER) == 0 || key.IndexOf(AttributeCodes.ECAP_PRICE) == 0)
                {
                    if (key.IndexOf(AttributeCodes.ECAP_PRICE) == 0 && opFlatItem[AttributeCodes.OBJ_SET_TYPE_CD].ToString().ToUpper() != "KIT")
                    {
                        newItem[key + baseEcapDimKey] = opFlatItem[key];
                    }
                    else
                    {
                        newItem[key] = opFlatItem[key];

                        ////for kit deals, need to sum chipset ecap $s as NORTHBOUND_SPLIT
                        //if (opFlatItem[AttributeCodes.OBJ_SET_TYPE_CD].ToString().ToUpper() == "KIT")
                        //{
                        //    if (key.IndexOf(AttributeCodes.ECAP_PRICE) == 0 && chipsetEcapDims.Contains(key))
                        //    {
                        //        var temp = opFlatItem[key];
                        //        northbridgeSum += decimal.Parse(opFlatItem[key].ToString());
                        //    }
                        //}
                    }
                }
                else
                {
#if DEBUG
                    //System.Diagnostics.Debug.WriteLine($"Attribute NOT MAPPED during TranslateToWip: {key}");
#endif
                }
            }

            // Overwrite geo value
            newItem[AttributeCodes.GEO_COMBINED] = geo;

            // not sure what to assign this to yet... if new, no id, if existing need the id.  We don't have access to that in this scope
            //newItem[AttributeCodes.DC_ID] = 0;
            // Thinking we just remove it and let the template and getById populate this for us.  Might need to revisit.
            newItem.Remove(AttributeCodes.DC_ID);

            newItem[AttributeCodes.DC_PARENT_ID] = opFlatItem[AttributeCodes.DC_ID];
            newItem[AttributeCodes.dc_type] = elMapping.ChildOpDataElementType;
            newItem[AttributeCodes.dc_parent_type] = elMapping.ParentOpDataElementType;
            newItem[AttributeCodes.OBJ_SET_TYPE_CD] = elMapping.ChildOpDataElementSetType;

            ////used to initialize NB_SPLIT value
            //if (opFlatItem[AttributeCodes.OBJ_SET_TYPE_CD].ToString().ToUpper() == "KIT")
            //{
            //    newItem["TEMP_NB_SUM"] = northbridgeSum;
            //}
            // Get the exclude Ids from the Product JSON
            // Remove PRD_EXCLDS_IDS from PTR UI Template from Database
            if (elMapping.TranslationType == OpTranslationType.OneDealPerRow)
            {
                newItem[AttributeCodes.PRD_EXCLDS_IDS] = string.Join(",", pMaps.Where(p => p.EXCLUDE).Select(x => x.PRD_MBR_SID).Distinct());
            }

            retItems.Add(newItem);
        }
    }
}