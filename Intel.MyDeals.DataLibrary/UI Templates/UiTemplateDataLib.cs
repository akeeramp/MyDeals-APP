using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.UI_Templates;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.DataLibrary
{
    class UiTemplateDataLib : IUiTemplateDataLib
    {

        private List<UiTemplateContainerItem> GetData()
        {
            // TODO replace with DB call
            List<UiTemplateContainerItem> items = new List<UiTemplateContainerItem>();
            items.Add(new UiTemplateContainerItem { Id = 1, AtrbCd = "DC_ID", IsKey = true, DataType = "number", Label = "Id", Width = 50 });
            items.Add(new UiTemplateContainerItem { Id = 3, AtrbCd = "TITLE", ObjType = new List<OpDataElementType> { OpDataElementType.PricingTableRow }, DataType = "string", Label = "Title", Width = 150 });
            items.Add(new UiTemplateContainerItem { Id = 7, AtrbCd = OpDataElementSetType.ECAP.ToString(), ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.ECAP }, DataType = "string", Label = "Ecap", Width = 150 });
            items.Add(new UiTemplateContainerItem { Id = 8, AtrbCd = OpDataElementSetType.PROGRAM.ToString(), ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.PROGRAM }, DataType = "string", Label = "Program", Width = 150 });
            items.Add(new UiTemplateContainerItem { Id = 9, AtrbCd = OpDataElementSetType.VOL_TIER.ToString(), ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER }, DataType = "string", Label = "Vol Tier", Width = 150 });
            items.Add(new UiTemplateContainerItem { Id = 10, AtrbCd = OpDataElementSetType.CAP_BAND.ToString(), ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.CAP_BAND }, DataType = "string", Label = "Cap Band", Width = 150 });

            items.Add(new UiTemplateContainerItem { Id = 11, AtrbCd = EN.OBJDIM._PIVOTKEY, ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "object", IsReadonly = true });
            items.Add(new UiTemplateContainerItem { Id = 12, AtrbCd = "_behaviors", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "object" });
            items.Add(new UiTemplateContainerItem { Id = 13, AtrbCd = EN.OBJDIM._MULTIDIM, ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "object" });
            items.Add(new UiTemplateContainerItem { Id = 14, AtrbCd = "DROPDOWN", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "string", LookupUrl = "/api/Lookups/v1/GetLookups/DROPDOWN", LookupText = "DROP_DOWN", LookupValue = "DROP_DOWN", Template = "#=gridUtils.uiIconWrapper(data, 'DROPDOWN')#" });
            items.Add(new UiTemplateContainerItem { Id = 15, AtrbCd = "COMBOBOX", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "string", LookupUrl = "/api/Lookups/v1/GetLookups/COMBOBOX", LookupText = "DROP_DOWN", LookupValue = "DROP_DOWN", Template = "#=gridUtils.uiIconWrapper(data, 'COMBOBOX')#" });

            items.Add(new UiTemplateContainerItem { Id = 16, AtrbCd = "_dirty", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "string", Label = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>", Width = 45, Template = "#=gridUtils.uiIconWrapper(data, '_dirty')#" });
            items.Add(new UiTemplateContainerItem { Id = 17, AtrbCd = "", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "string", Label = "&nbsp;" });


            items.Add(new UiTemplateContainerItem { Id = 18, AtrbCd = EN.OBJDIM._PIVOTKEY, ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "object", IsReadonly = true });
            items.Add(new UiTemplateContainerItem { Id = 19, AtrbCd = "_behaviors", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "object" });
            items.Add(new UiTemplateContainerItem { Id = 20, AtrbCd = "DC_ID", IsKey = true, ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "number", Label = "Id", Width = 50 });
            items.Add(new UiTemplateContainerItem { Id = 21, AtrbCd = EN.OBJDIM.PIVOT, ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", Label = "Pivot", Width = 50 });
            items.Add(new UiTemplateContainerItem { Id = 22, AtrbCd = "TITLE", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", Label = "Title", Width = 150 });
            items.Add(new UiTemplateContainerItem { Id = 23, AtrbCd = "INT", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "number", Label = "Int", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'INT')#" });
            items.Add(new UiTemplateContainerItem { Id = 24, AtrbCd = "TEXT", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", Label = "Text", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'TEXT')#" });
            items.Add(new UiTemplateContainerItem { Id = 25, AtrbCd = "DATE", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", Label = "Date", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'DATE')#" });
            items.Add(new UiTemplateContainerItem { Id = 26, AtrbCd = "DROPDOWN", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", LookupUrl = "/api/Lookups/v1/GetLookups/DROPDOWN", LookupText = "DROP_DOWN", LookupValue = "DROP_DOWN", Template = "#=gridUtils.uiIconWrapper(data, 'DROPDOWN')#" });
            items.Add(new UiTemplateContainerItem { Id = 27, AtrbCd = "COMBOBOX", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", LookupUrl = "/api/Lookups/v1/GetLookups/COMBOBOX", LookupText = "DROP_DOWN", LookupValue = "DROP_DOWN", Template = "#=gridUtils.uiIconWrapper(data, 'COMBOBOX')#" });
            items.Add(new UiTemplateContainerItem { Id = 28, AtrbCd = "_dirty", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", Label = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>", Width = 45, Template = "#=gridUtils.uiIconWrapper(data, '_dirty')#" });

            items.Add(new UiTemplateContainerItem { Id = 29, AtrbCd = "PRODUCTS", ObjType = new List<OpDataElementType> { OpDataElementType.PricingTableRow }, DataType = "string", Label = "Products", Width = 200, Template = "#=gridUtils.uiIconWrapper(data, 'PRODUCTS')#" });
            items.Add(new UiTemplateContainerItem { Id = 30, AtrbCd = AttributeCodes.START_DT, ObjType = new List<OpDataElementType> { OpDataElementType.PricingTableRow }, DataType = "date", Label = "Start Date", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'START_DT')#" });
            items.Add(new UiTemplateContainerItem { Id = 31, AtrbCd = AttributeCodes.END_DT, ObjType = new List<OpDataElementType> { OpDataElementType.PricingTableRow }, DataType = "date", Label = "End Date", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'END_DT')#" });
            items.Add(new UiTemplateContainerItem { Id = 32, AtrbCd = "RPU", ObjType = new List<OpDataElementType> { OpDataElementType.PricingTableRow }, DataType = "number", Label = "RPU", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'RPU')#" });

            items.Add(new UiTemplateContainerItem { Id = 33, AtrbCd = "NUM_TIERS", ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER }, IsExtra = true, Label = "Number of Tiers", IsRequired = true, DataType = "string", UiType = "DROPDOWN", LookupUrl = "/api/Lookups/v1/GetLookups/DROPDOWN", LookupText = "DROP_DOWN", LookupValue = "DROP_DOWN", Template = "#=gridUtils.uiIconWrapper(data, 'DROPDOWN')#" });
            items.Add(new UiTemplateContainerItem { Id = 34, AtrbCd = "DROPDOWN", ObjType = new List<OpDataElementType> { OpDataElementType.PricingTable }, ObjSetType = new List<OpDataElementSetType> { OpDataElementSetType.VOL_TIER }, IsDefaultable = true, Label = "Dropdown sample", IsRequired = true, DataType = "string", UiType = "DROPDOWN", LookupUrl = "/api/Lookups/v1/GetLookups/DROPDOWN", LookupText = "DROP_DOWN", LookupValue = "DROP_DOWN", Template = "#=gridUtils.uiIconWrapper(data, 'DROPDOWN')#" });

            return items;
        }

        public UiTemplates GetUiTemplates()
        {
            // TODO - replace with correct logic once DB has Obj_Type and Obj_Set_Type
            OpDataElementUITemplates templates = DataCollections.GetTemplateDict();
            List<UiTemplateContainerItem> items = GetData();

            UiTemplates ret = new UiTemplates();
            ret.BuildUiModelTemplates(items);
            ret.BuildUiObjectTemplates(templates);
            ret.BuildExtrasTemplates(items);
            ret.BuildDefaultsTemplates(items);

            return ret;
        }
    }
}
