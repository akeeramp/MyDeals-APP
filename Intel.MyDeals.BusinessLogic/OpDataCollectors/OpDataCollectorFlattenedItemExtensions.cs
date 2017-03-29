using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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

            foreach (OpMsg msg in myDealsData[opDataElementType].Messages.Messages
                .Where(m => (m.MsgType == OpMsg.MessageType.Warning || m.MsgType == OpMsg.MessageType.Info) && m.KeyIdentifiers.Contains(Int32.Parse(data[AttributeCodes.DC_ID].ToString()))))
            {
                switch (msg.MsgType)
                {
                    case OpMsg.MessageType.Info:
                        infoMsgs.Add(msg.Message.Replace("\r\n", ""));
                        break;
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
            objsetItem.SetBehavior("ValidMsg", de.AtrbCd, de.ValidationMessage);

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
                if (bool.Parse(value.ToString())) ((OpDataCollectorFlattenedItem) behav[behaveType])[name] = true;
            }
            else
            {
                if (value.ToString()!= string.Empty) ((OpDataCollectorFlattenedItem)behav[behaveType])[name] = value;
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

            switch (pivotMode)
            {
                case ObjSetPivotMode.Pivoted:
                    if (!objsetItem.ContainsKey(dimName)) objsetItem[dimName] = new Dictionary<string, OpDataCollectorFlattenedItem>();
                    Dictionary<string, OpDataCollectorFlattenedItem> collection = (Dictionary<string, OpDataCollectorFlattenedItem>)objsetItem[dimName];

                    string intDimKey = (string)dimKey;
                    if (!collection.ContainsKey(intDimKey)) collection[intDimKey] = new OpDataCollectorFlattenedItem();

                    if (!collection[intDimKey].ContainsKey(pivotName))
                    {
                        collection[intDimKey][AttributeCodes.DC_ID] = de.DcID;
                        collection[intDimKey][pivotName] = dimKey;
                    }

                    collection[intDimKey][de.AtrbCd] = de.AtrbValue.ToString();

                    collection[intDimKey].SetBehavior("isRequired", de.AtrbCd, de.IsRequired);
                    collection[intDimKey].SetBehavior("isReadOnly", de.AtrbCd, de.IsReadOnly);
                    collection[intDimKey].SetBehavior("isHidden", de.AtrbCd, de.IsHidden);

                    break;

                case ObjSetPivotMode.Nested:

                    if (objsetItem.ContainsKey(de.AtrbCd)) return;

                    Dictionary<string, string> dictDes = new Dictionary<string, string>();
                    foreach (IOpDataElement item in dc.GetDataElements(de.AtrbCd))
                    {
                        dictDes[dimKey.ToString()] = item.AtrbValue.ToString();
                    }
                    objsetItem[de.AtrbCd] = dictDes;

                    break;
            }

        }

        public static OpDataCollectorFlattenedList TranslateToWip(this OpDataCollectorFlattenedItem opFlatItem)
        {
            OpDataCollectorFlattenedList retItems = new OpDataCollectorFlattenedList();
            OpDataCollectorFlattenedList items = null;

            // check that this is the correct OpDataElementType and has products
            if (!opFlatItem.ContainsKey(AttributeCodes.dc_type) || opFlatItem[AttributeCodes.dc_type].ToString() != OpDataElementType.PRC_TBL_ROW.ToString()) return retItems;
            if (!opFlatItem.ContainsKey(AttributeCodes.PTR_SYS_PRD) || opFlatItem[AttributeCodes.PTR_SYS_PRD].ToString() == string.Empty) return retItems;

            OpDataElementType opType = OpDataElementTypeConverter.FromString(opFlatItem[AttributeCodes.dc_type]);
            OpDataElementSetType opSetType = OpDataElementSetTypeConverter.FromString(opFlatItem[AttributeCodes.OBJ_SET_TYPE_CD]);

            OpDataElementTypeMapping elMapping = opSetType.OpDataElementTypeChildMapping(opType);
            OpDataElementAtrbTemplate template = OpDataElementUiExtensions.GetAtrbTemplate(elMapping.ChildOpDataElementType, elMapping.ChildOpDataElementSetType);

            List<string> singleDimAtrbs = template.Where(t => t.DimID == 0 && !t.DimKey.Any()).Select(t => t.AtrbCd).ToList();
            List<string> multiDimAtrbs = template.Where(t => t.DimID != 0 || t.DimKey.Any()).Select(t => t.AtrbCd).ToList();


            // Get Product string already approved by Product Entry.  We should be able to trust these values
            string products = opFlatItem[AttributeCodes.PTR_SYS_PRD].ToString();

            try
            {
                items = JsonConvert.DeserializeObject<OpDataCollectorFlattenedList>(products);
            }
            catch (Exception ex)
            {
                throw new Exception("Unable to parse the Products entered", ex);
            }

            if (elMapping.TranslationType == OpTranslationType.OneDealPerProduct)
            {
                foreach (OpDataCollectorFlattenedItem item in items)
                {
                    foreach (KeyValuePair<string, object> kvp in item)
                    {
                        // TODO NEED to tack on product info here
                        retItems.CopyMatchingAttributes(opFlatItem, elMapping, singleDimAtrbs, multiDimAtrbs);
                    }
                }
            }
            else if (elMapping.TranslationType == OpTranslationType.OneDealPerRow)
            {
                retItems.CopyMatchingAttributes(opFlatItem, elMapping, singleDimAtrbs, multiDimAtrbs);
            }

            return retItems;
        }

        public static void CopyMatchingAttributes(this OpDataCollectorFlattenedList retItems, OpDataCollectorFlattenedItem opFlatItem, OpDataElementTypeMapping elMapping,
            List<string> singleDimAtrbs, List<string> multiDimAtrbs)
        {
            OpDataCollectorFlattenedItem newItem = new OpDataCollectorFlattenedItem();

            foreach (string key in opFlatItem.Keys.Where(k => k != AttributeCodes.dc_type && k != AttributeCodes.dc_parent_type))
            {
                if (singleDimAtrbs.Contains(key))
                {
                    newItem[key] = opFlatItem[key];
                }
                else if (multiDimAtrbs.Contains(key))
                {
                    // TODO: need to get multi dims working once we have multi dim in the system
                    newItem[key] = opFlatItem[key];
                }
                else
                {
#if DEBUG
                    System.Diagnostics.Debug.WriteLine($"Attribute NOT MAPPED during TranslateToWip: {key}");
#endif
                }
            }

            // not sure what to assign this to yet... if new,no id, if existingneed the id.  We don't have access to that in this scope
            //newItem[AttributeCodes.DC_ID] = 0;
            // Thinking we just remove it and let the template and getById populate this for us.  Might need to revisit.
            newItem.Remove(AttributeCodes.DC_ID);

            newItem[AttributeCodes.DC_PARENT_ID] = opFlatItem[AttributeCodes.DC_ID];
            newItem[AttributeCodes.dc_type] = elMapping.ChildOpDataElementType;
            newItem[AttributeCodes.dc_parent_type] = elMapping.ParentOpDataElementType;
            newItem[AttributeCodes.OBJ_SET_TYPE_CD] = elMapping.ChildOpDataElementSetType;

            retItems.Add(newItem);
        }

        public static OpDataCollectorFlattenedItem TranslateToPrcTbl(this OpDataCollectorFlattenedItem opFlatItem)
        {
            OpDataCollectorFlattenedItem retItem = new OpDataCollectorFlattenedItem();

            // check that this is the correct OpDataElementType
            if (!opFlatItem.ContainsKey(AttributeCodes.dc_type) || opFlatItem[AttributeCodes.dc_type].ToString() != OpDataElementType.WIP_DEAL.ToString()) return opFlatItem;
            if (!opFlatItem.ContainsKey(AttributeCodes.PTR_SYS_PRD) || opFlatItem[AttributeCodes.PTR_SYS_PRD].ToString() == "") return retItem;



            return retItem;
        }
    }
}