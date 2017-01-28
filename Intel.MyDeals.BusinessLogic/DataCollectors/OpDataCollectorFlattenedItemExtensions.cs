using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic.DataCollectors
{
    public static class OpDataCollectorFlattenedItemExtensions
    {
        public static void ApplyMessages(this OpDataCollectorFlattenedItem data, MyDealsData myDealsData)
        {
            List<string> infoMsgs = new List<string>();
            List<string> warnMsgs = new List<string>();
            List<OpDataElementType> dataElementTypes = new List<OpDataElementType> { OpDataElementType.Deals, OpDataElementType.Secondary };

            if (!data.ContainsKey("DealId")) return;

            foreach (OpDataElementType opDataElementType in dataElementTypes.Where(myDealsData.ContainsKey))
            {
                foreach (OpMsg msg in myDealsData[opDataElementType].Messages.Messages
                    .Where(m => (m.MsgType == OpMsg.MessageType.Warning || m.MsgType == OpMsg.MessageType.Info) && m.KeyIdentifiers.Contains(Int32.Parse(data["DealId"].ToString()))))
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
            }
            data["infoMessages"] = infoMsgs;
            data["warningMessages"] = warnMsgs;
        }

        public static void ApplySingleAndMultiDim(this OpDataCollectorFlattenedItem objsetItem, CustomerDivision cust, OpDataElement de, OpDataCollector dc, ObjSetPivotMode pivotMode)
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
            objsetItem.SetBehavior("isReadOnly", de.AtrbCd, de.IsReadOnly || (cust != null && !cust.ACTV_IND));
            objsetItem.SetBehavior("isHidden", de.AtrbCd, de.IsHidden);
        }

        private static void SetBehavior(this OpDataCollectorFlattenedItem objsetItem, string behaveType, string name, bool value)
        {
            if (!objsetItem.ContainsKey("_behaviors")) objsetItem["_behaviors"] = new OpDataCollectorFlattenedItem();
            OpDataCollectorFlattenedItem behav = (OpDataCollectorFlattenedItem)objsetItem["_behaviors"];

            if (!behav.ContainsKey(behaveType)) behav[behaveType] = new OpDataCollectorFlattenedItem();
            if (value) ((OpDataCollectorFlattenedItem)behav[behaveType])[name] = true;
        }

        private static void PivotData(this OpDataCollectorFlattenedItem objsetItem, OpDataElement de, OpDataCollector dc, ObjSetPivotMode pivotMode, object dimKey)
        {
            string dimName = "_MultiDim";
            string pivotName = "PIVOT";
            string pivotKeyName = "_pivot";
            string titleKeyName = "TITLE";


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
                    if (!objsetItem.ContainsKey(dimName)) objsetItem[dimName] = new Dictionary<int, OpDataCollectorFlattenedItem>();
                    Dictionary<int, OpDataCollectorFlattenedItem> collection = (Dictionary<int, OpDataCollectorFlattenedItem>)objsetItem[dimName];

                    int intDimKey = (int)dimKey;
                    if (!collection.ContainsKey(intDimKey)) collection[intDimKey] = new OpDataCollectorFlattenedItem();

                    if (!collection[intDimKey].ContainsKey(pivotName))
                    {
                        collection[intDimKey]["dc_id"] = de.DcID;
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
        
    }
}