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
                ObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST, OpDataElementType.PRC_TBL }
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
                Label = "Deal Type",
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                Width = 150
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 20,
                AtrbCd = AttributeCodes.END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
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
                Width = 200,
                Template = "#=gridUtils.uiIconWrapper(data, 'PRODUCTS')#" });
            items.Add(new UiTemplateContainerItem {
                Id = 29,
                AtrbCd = AttributeCodes.PTR_SYS_PRD,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 200,
                Template = "#=gridUtils.uiIconWrapper(data, 'PRODUCTS')#" });
            items.Add(new UiTemplateContainerItem {
                Id = 33,
                AtrbCd = AttributeCodes.PRD_LEVEL,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'PRD_LEVEL')#" });
            items.Add(new UiTemplateContainerItem {
                Id = 30,
                AtrbCd = AttributeCodes.START_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'START_DT')#" });
            items.Add(new UiTemplateContainerItem {
                Id = 31,
                AtrbCd = AttributeCodes.END_DT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'END_DT')#" });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = "ECAP_PRICE",
                DimCd = "10:0",
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'ECAP_PRICE_____10___0')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PAYOUT_BASED_ON,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'PAYOUT_BASED_ON')#",
                IsDefaultable = true,
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PROGRAM_PAYMENT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'PROGRAM_PAYMENT')#",
                IsDefaultable = true,
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 34,
                AtrbCd = AttributeCodes.MAX_RPU,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'MAX_RPU')#"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 35,
                AtrbCd = AttributeCodes.AVG_RPU,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                Width = 100,
                Template = "#=gridUtils.uiIconWrapper(data, 'AVG_RPU')#"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 36,
                AtrbCd = AttributeCodes.NUM_OF_TIERS,
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER, OpDataElementSetType.CAP_BAND },
                IsExtra = true,
                Label = "Number of Tiers",
                IsRequired = true,
                DataType = "string",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetNumTiersDropdowns",
                LookupText = "dropdownName",
                LookupValue = "dropdownID"
            });

            items.Add(new UiTemplateContainerItem
            {
                Id = 37,
                AtrbCd = AttributeCodes.ECAP_TYPE,
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                IsDefaultable = true,
                Label = "ECAP Type",
                DataType = "string",
                UiType = "DROPDOWN",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_ECAP_TYPE/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 38,
                AtrbCd = AttributeCodes.MRKT_SEG_COMBINED,
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                IsDefaultable = true,
                Label = "Market Segment",
                DataType = "string",
                UiType = "EMBEDDEDMULTISELECT",
                LookupUrl = "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG_COMBINED",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN",
                HelpText = "You cannot mix ALL & other market segments.\n\nNon Corp selects: Consumer retail pull, Education, Government, &SMB"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 39,
                AtrbCd = AttributeCodes.GEO_COMBINED,
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                IsDefaultable = true,
                Label = "GEO",
                DataType = "string",
                UiType = "MULTISELECT",
                LookupUrl = "/api/Dropdown/GetGeosDropdowns",
                LookupText = "dropdownName",
                LookupValue = "dropdownName"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PAYOUT_BASED_ON,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                Width = 100,
                IsDefaultable = true,
                UiType = "RADIOBUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 29,
                AtrbCd = AttributeCodes.PROGRAM_PAYMENT,
                ObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                Width = 100,
                IsDefaultable = true,
                UiType = "RADIOBUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });
            items.Add(new UiTemplateContainerItem
            {
                Id = 41,
                AtrbCd = AttributeCodes.MEET_COMP_PRICE_QSTN,
                ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP },
                IsDefaultable = true,
                Label = "Meet Comp Analysis",
                DataType = "string",
                UiType = "RADIOBUTTONGROUP",
                LookupUrl = "/api/Dropdown/GetDropdowns/MEET_COMP_PRICE_QSTN/ECAP",
                LookupText = "DROP_DOWN",
                LookupValue = "DROP_DOWN"
            });



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
                if (string.IsNullOrEmpty(item.DataType)) item.DataType = GetDataType(atrb.DATA_TYPE_CD);
                if (item.MaxLength == 0) item.MaxLength = atrb.ATRB_MAX_LEN == 0 ? 8000 : atrb.ATRB_MAX_LEN;
                if (string.IsNullOrEmpty(item.Format)) item.Format = atrb.FRMT_MSK;
            }

            return data;
        }

        private string GetDataType(string dataType)
        {
            switch (dataType)
            {
                case "INT":
                case "MONEY":
                    return "number";
                case "VARCHAR":
                    return "string";
                case "CUSTOM":
                    return "object";
                case "DATETIME":
                    return "date";
                case "BIT":
                    return "boolean";
            }
            return "string";
        }
    }
}