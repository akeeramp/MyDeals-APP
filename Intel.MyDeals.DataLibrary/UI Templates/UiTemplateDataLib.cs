using System;
using System.Collections.Generic;
using System.Reflection;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.UI_Templates;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.DataLibrary
{
    internal class UiTemplateDataLib : IUiTemplateDataLib
    {
        private List<UiTemplateContainerItem> GetData()
        {
            // TODO replace with DB call and admin screen

            List<UiTemplateContainerItem> items = new List<UiTemplateContainerItem>();
            items.Add(new UiTemplateContainerItem
            {
                Id = 1,
                AtrbCd = AttributeCodes.DC_ID,
                IsKey = true,
                ObjType = new List<OpDataElementType> {OpDataElementType.CNTRCT,OpDataElementType.PRC_ST,OpDataElementType.PRC_TBL,OpDataElementType.WIP_DEAL },
                DataType = "number",
                Label = "Id",
                Width = 50,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.DC_ID,
                IsKey = true,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                DataType = "number",
                Label = "Id",
                Width = 50,
                IsHidden = true,
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 2,
                AtrbCd = AttributeCodes.OBJ_SET_TYPE_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST, OpDataElementType.PRC_TBL },
                DataType = "string"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 3,
                AtrbCd = AttributeCodes.TITLE,
                ObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST, OpDataElementType.PRC_TBL },
                DataType = "string",
                Label = "Title",
                Width = 150
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 16,
                AtrbCd = "_dirty",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                IsHidden = true,
                DataType = "string",
                Label = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                Width = 45,
                Template = "#=gridUtils.uiIconWrapper(data, '_dirty')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 12,
                AtrbCd = "_behaviors",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                IsHidden = true,
                DataType = "object"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 13,
                AtrbCd = EN.OBJDIM._MULTIDIM,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                IsHidden = true,
                DataType = "object"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.OBJ_SET_TYPE_CD,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                DataType = "number",
                Label = "Deal Type",
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                DataType = "date",
                Label = "Start Date",
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                DataType = "date",
                Label = "End Date",
                Width = 150
            });

            items.Add(new UiTemplateContainerItem {
                Id = 28,
                AtrbCd = "_dirty",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                IsDetail = true,
                IsHidden = true,
                DataType = "string",
                Label = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                Width = 45,
                Template = "#=gridUtils.uiIconWrapper(data, '_dirty')#" });
            items.Add(new UiTemplateContainerItem
            {
                Id = 19,
                AtrbCd = "_behaviors",
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                IsDetail = true,
                IsHidden = true,
                DataType = "object"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 18,
                AtrbCd = EN.OBJDIM._PIVOTKEY,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                IsDetail = true,
                DataType = "object",
                IsReadOnly = true
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 21,
                AtrbCd = EN.OBJDIM.PIVOT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                IsDetail = true,
                DataType = "string",
                Label = "Pivot",
                Width = 50
            });


            
            items.Add(new UiTemplateContainerItem {
                Id = 29,
                AtrbCd = AttributeCodes.PTR_USER_PRD,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                DataType = "string",
                //Label = "Products",
                Width = 200,
                Template = "#=gridUtils.uiIconWrapper(data, 'PRODUCTS')#" });
            items.Add(new UiTemplateContainerItem {
                Id = 29,
                AtrbCd = AttributeCodes.PTR_SYS_PRD,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                DataType = "string",
                Label = "Products (system)",
                Width = 200,
                Template = "#=gridUtils.uiIconWrapper(data, 'PRODUCTS')#" });
            items.Add(new UiTemplateContainerItem {
                Id = 33,
                AtrbCd = AttributeCodes.PRD_LEVEL,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                DataType = "string",
                Label = "Product Level",
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'PRD_LEVEL')#" });
            items.Add(new UiTemplateContainerItem {
                Id = 30,
                AtrbCd = AttributeCodes.START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                DataType = "date",
                Label = "Start Date",
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'START_DT')#" });
            items.Add(new UiTemplateContainerItem {
                Id = 31,
                AtrbCd = AttributeCodes.END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                DataType = "date",
                Label = "End Date",
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'END_DT')#" });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "ECAP_PRICE",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                DataType = "number",
                Label = "ECAP Price",
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'ECAP_PRICE')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "PAYOUT_BASED_ON",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                DataType = "string",
                Label = "Payout Based On",
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'PAYOUT_BASED_ON')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "PROGRAM_PAYMENT",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                DataType = "string",
                Label = "Program Payment",
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'PROGRAM_PAYMENT')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 34,
                AtrbCd = AttributeCodes.MAX_RPU,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                DataType = "number",
                Label = "MAX RPU",
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'MAX_RPU')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 35,
                AtrbCd = AttributeCodes.AVG_RPU,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                DataType = "number",
                Label = "AVG RPU",
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'AVG_RPU')#"
            });

            items.Add(new UiTemplateContainerItem { Id = 36, AtrbCd = AttributeCodes.NUM_OF_TIERS, ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER }, IsExtra = true, Label = "Number of Tiers", IsRequired = true, DataType = "string", UiType = "DROPDOWN", LookupUrl = "/api/Lookups/v1/GetLookups/DROPDOWN", LookupText = "DROP_DOWN", LookupValue = "DROP_DOWN", Template = "#=gridUtils.uiIconWrapper(data, 'DROPDOWN')#" });
            items.Add(new UiTemplateContainerItem { Id = 37, AtrbCd = "DROPDOWN", ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL }, ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER }, IsDefaultable = true, Label = "Dropdown sample", IsRequired = true, DataType = "string", UiType = "DROPDOWN", LookupUrl = "/api/Lookups/v1/GetLookups/DROPDOWN", LookupText = "DROP_DOWN", LookupValue = "DROP_DOWN", Template = "#=gridUtils.uiIconWrapper(data, 'DROPDOWN')#" });


            return FillInGapsFromT4(items);
        }

        public UiTemplates GetUiTemplates()
        {
            return new UiTemplates().Populate(DataCollections.GetTemplateDict(), GetData());
        }

        private List<UiTemplateContainerItem> FillInGapsFromT4(List<UiTemplateContainerItem> data)
        {
            foreach (UiTemplateContainerItem item in data)
            {
                FieldInfo fieldInfo = typeof(Attributes).GetField(item.AtrbCd);
                if (fieldInfo == null) continue;

                MyDealsAttribute atrb = (MyDealsAttribute)fieldInfo.GetValue(null);
                if (string.IsNullOrEmpty(item.Label)) item.Label = atrb.ATRB_LBL;
            }

            return data;
        }

        private string GetDataType(string dataType)
        {
            switch (dataType)
            {
                case "":
                    return "number";
            }
            return string.Empty;
        }
    }
}