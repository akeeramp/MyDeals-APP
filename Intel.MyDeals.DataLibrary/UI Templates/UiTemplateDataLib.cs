using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.Data;

namespace Intel.MyDeals.DataLibrary
{
    class UiTemplateDataLib : IUiTemplateDataLib
    {

        private UiModelTemplate BuildUiModelTemplate(OpDataElementType opDataElementType, string objSetType, List<UiTemplateContainerItem> items)
        {
            List<UiTemplateContainerItem> filteredItems = items.Where(t => (!t.ObjType.Any() || t.ObjType.Contains(opDataElementType)) && (!t.ObjSetType.Any() || t.ObjSetType.Contains(objSetType))).ToList();

            Dictionary<string, UiFieldItem> fields = new Dictionary<string, UiFieldItem>();
            Dictionary<string, UiFieldItem> detailsFields = new Dictionary<string, UiFieldItem>();
            List<UiColumn> columns = new List<UiColumn>();
            List<UiColumn> detailsColumns = new List<UiColumn>();

            string pId = filteredItems.Where(i => i.IsKey && !i.IsDetail).Select(i => i.AtrbCd).FirstOrDefault();
            string pDetailsId = filteredItems.Where(i => i.IsKey && i.IsDetail).Select(i => i.AtrbCd).FirstOrDefault();

            foreach (UiTemplateContainerItem item in filteredItems.OrderBy(i => i.AtrbOrder).ThenBy(i => i.Order))
            {
                if (!item.IsDetail)
                {
                    fields[item.AtrbCd] = new UiFieldItem
                    {
                        type = item.DataType,
                        editable = !item.IsReadonly,
                        nullable = !item.IsRequired,
                        values = item.LookupValue,
                        valuesText = item.LookupText,
                        valuesValue = item.LookupValue
                    };

                    columns.Add(new UiColumn
                    {
                        field = item.AtrbCd,
                        title = item.Label,
                        width = item.Width,
                        editor = item.Editor,
                        template = item.Template,
                        uiType = item.UiType
                    });
                }
                else
                {
                    detailsFields[item.AtrbCd] = new UiFieldItem
                    {
                        type = item.DataType,
                        editable = !item.IsReadonly,
                        nullable = !item.IsRequired,
                        values = item.LookupValue,
                        valuesText = item.LookupText,
                        valuesValue = item.LookupValue
                    };

                    detailsColumns.Add(new UiColumn
                    {
                        field = item.AtrbCd,
                        title = item.Label,
                        width = item.Width,
                        editor = item.Editor,
                        template = item.Template,
                        uiType = item.UiType
                    });
                }
            }

            UiModelTemplate model = new UiModelTemplate
            {
                name = objSetType,
                model = new UiModel {fields = fields},
                columns = columns,
                detailsModel = new UiModel { fields = detailsFields },
                detailsColumns = detailsColumns
            };
            if (!string.IsNullOrEmpty(pId)) model.model.id = pId;
            if (!string.IsNullOrEmpty(pDetailsId)) model.detailsModel.id = pDetailsId;

            model.extraAtrbs = new Dictionary<string, UiAtrbs>();
            model.defaultAtrbs = new Dictionary<string, UiAtrbs>();

            return model;
        }


        private UiObjectTemplate BuildUiObjectTemplate(OpDataElementType objType)
        {
            OpDataElementUITemplates templates = DataCollections.GetTemplateDict();
            UiObjectTemplate template = new UiObjectTemplate();
            foreach (OpDataElementUI opDataElementUi in templates[objType.ToString()])
            {
                template[opDataElementUi.AtrbCd] = opDataElementUi.AtrbValue;
            }

            // TODO replace whith proper data once DB is ready
            template["dc_id"] = 0;
            template["dc_sid"] = 0;
            template["dc_parent_id"] = 0;
            template["dc_parent_sid"] = 0;
            template["_behaviors"] = new Dictionary<string, Dictionary<string, dynamic>>
            {
                ["isRequired"] = new Dictionary<string, dynamic>(),
                ["isError"] = new Dictionary<string, dynamic>(),
                ["validMsg"] = new Dictionary<string, dynamic>()
            };

            if (objType == OpDataElementType.Contract)
            {
                template["PricingStrategy"] = new List<string>();
                template["OBJSET_TYPE_CD"] = template["OBJSET_TYPE"] = "CONTRACT";
                template["_behaviors"]["isRequired"] = new Dictionary<string, dynamic>
                {
                    ["TITLE"] = true,
                    ["CUST_MBR_SID"] = true,
                    ["START_DT"] = true,
                    ["END_DT"] = true
                };
            }

            if (objType == OpDataElementType.PricingStrategy)
            {
                template["PricingTable"] = new List<string>();
                template["OBJSET_TYPE_CD"] = template["OBJSET_TYPE"] = "PRICING STRATEGY";
                template["_behaviors"]["isRequired"] = new Dictionary<string, dynamic>
                {
                    ["TITLE"] = true
                };
            }

            if (objType == OpDataElementType.PricingTable)
            {
                template["OBJSET_TYPE_CD"] = template["OBJSET_TYPE"] = "PRICING TABLE";
                template["_behaviors"]["isRequired"] = new Dictionary<string, dynamic>
                {
                    ["TITLE"] = true
                };
            }

            // TODO need attribute security

            return template;
        }

        private List<UiTemplateContainerItem> GetData()
        {
            // TODO replace with DB call
            List<UiTemplateContainerItem> items = new List<UiTemplateContainerItem>();
            items.Add(new UiTemplateContainerItem { Id = 1, AtrbCd = "dc_id", IsKey = true, DataType = "number", Label = "Id", Width = 50 });
            items.Add(new UiTemplateContainerItem { Id = 2, AtrbCd = "PIVOT", ObjType = new List<OpDataElementType> { OpDataElementType.PricingTable }, DataType = "string", Label = "Pivot", Width = 50 });
            items.Add(new UiTemplateContainerItem { Id = 3, AtrbCd = "TITLE", ObjType = new List<OpDataElementType> { OpDataElementType.PricingTable }, DataType = "string", Label = "Title", Width = 150 });
            items.Add(new UiTemplateContainerItem { Id = 4, AtrbCd = "INT", DataType = "number", Label = "Int", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'INT')#" });
            items.Add(new UiTemplateContainerItem { Id = 5, AtrbCd = "TEXT", DataType = "string", Label = "Text", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'TEXT')#" });
            items.Add(new UiTemplateContainerItem { Id = 6, AtrbCd = "DATE", DataType = "string", Label = "Date", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'DATE')#" });
            items.Add(new UiTemplateContainerItem { Id = 7, AtrbCd = "ECAP", ObjSetType = new List<string> { "ECAP" }, DataType = "string", Label = "Ecap", Width = 150 });
            items.Add(new UiTemplateContainerItem { Id = 8, AtrbCd = "PROGRAM", ObjSetType = new List<string> { "PROGRAM" }, DataType = "string", Label = "Program", Width = 150 });
            items.Add(new UiTemplateContainerItem { Id = 9, AtrbCd = "VOLTIER", ObjSetType = new List<string> { "VOLTIER" }, DataType = "string", Label = "Vol Tier", Width = 150 });
            items.Add(new UiTemplateContainerItem { Id = 10, AtrbCd = "CAPBAND", ObjSetType = new List<string> { "CAPBAND" }, DataType = "string", Label = "Cap Band", Width = 150 });

            items.Add(new UiTemplateContainerItem { Id = 11, AtrbCd = "_pivot", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "object", IsReadonly = true });
            items.Add(new UiTemplateContainerItem { Id = 12, AtrbCd = "_behaviors", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "object" });
            items.Add(new UiTemplateContainerItem { Id = 13, AtrbCd = "_MultiDim", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "object" });
            items.Add(new UiTemplateContainerItem { Id = 14, AtrbCd = "DROPDOWM", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "string", LookupUrl = "/api/Lookups/v1/GetLookups/DROPDOWN", LookupText = "DROP_DOWN", LookupValue = "DROP_DOWN", Template = "#=gridUtils.uiIconWrapper(data, 'DROPDOWN')#" });
            items.Add(new UiTemplateContainerItem { Id = 15, AtrbCd = "COMBOBOX", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "string", LookupUrl = "/api/Lookups/v1/GetLookups/COMBOBOX", LookupText = "DROP_DOWN", LookupValue = "DROP_DOWN", Template = "#=gridUtils.uiIconWrapper(data, 'COMBOBOX')#" });

            items.Add(new UiTemplateContainerItem { Id = 16, AtrbCd = "_dirty", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "string", Label = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>", Width = 45, Template = "#=gridUtils.uiIconWrapper(data, '_dirty')#" });
            items.Add(new UiTemplateContainerItem { Id = 17, AtrbCd = "", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, DataType = "string", Label = "&nbsp;" });


            items.Add(new UiTemplateContainerItem { Id = 18, AtrbCd = "_pivot", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "object", IsReadonly = true });
            items.Add(new UiTemplateContainerItem { Id = 19, AtrbCd = "_behaviors", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "object" });
            items.Add(new UiTemplateContainerItem { Id = 20, AtrbCd = "dc_id", IsKey = true, ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "number", Label = "Id", Width = 50 });
            items.Add(new UiTemplateContainerItem { Id = 21, AtrbCd = "PIVOT", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", Label = "Pivot", Width = 50 });
            items.Add(new UiTemplateContainerItem { Id = 22, AtrbCd = "TITLE", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", Label = "Title", Width = 150 });
            items.Add(new UiTemplateContainerItem { Id = 23, AtrbCd = "INT", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "number", Label = "Int", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'INT')#" });
            items.Add(new UiTemplateContainerItem { Id = 24, AtrbCd = "TEXT", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", Label = "Text", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'TEXT')#" });
            items.Add(new UiTemplateContainerItem { Id = 25, AtrbCd = "DATE", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", Label = "Date", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'DATE')#" });
            items.Add(new UiTemplateContainerItem { Id = 26, AtrbCd = "DROPDOWM", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", LookupUrl = "/api/Lookups/v1/GetLookups/DROPDOWN", LookupText = "DROP_DOWN", LookupValue = "DROP_DOWN", Template = "#=gridUtils.uiIconWrapper(data, 'DROPDOWN')#" });
            items.Add(new UiTemplateContainerItem { Id = 27, AtrbCd = "COMBOBOX", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", LookupUrl = "/api/Lookups/v1/GetLookups/COMBOBOX", LookupText = "DROP_DOWN", LookupValue = "DROP_DOWN", Template = "#=gridUtils.uiIconWrapper(data, 'COMBOBOX')#" });
            items.Add(new UiTemplateContainerItem { Id = 28, AtrbCd = "_dirty", ObjType = new List<OpDataElementType> { OpDataElementType.WipDeals }, IsDetail = true, DataType = "string", Label = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>", Width = 45, Template = "#=gridUtils.uiIconWrapper(data, '_dirty')#" });

            items.Add(new UiTemplateContainerItem { Id = 30, AtrbCd = "START_DT", ObjType = new List<OpDataElementType> { OpDataElementType.PricingTable }, DataType = "string", Label = "Start Date", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'START_DT')#" });
            items.Add(new UiTemplateContainerItem { Id = 31, AtrbCd = "END_DT", ObjType = new List<OpDataElementType> { OpDataElementType.PricingTable }, DataType = "string", Label = "End Date", Width = 100, Template = "#=gridUtils.uiIconWrapper(data, 'END_DT')#" });
            return items;
        }

        public UiTemplates GetUiTemplates()
        {
            // TODO - replace with correct logic once DB has Obj_Type and Obj_Set_Type

            List<UiTemplateContainerItem> items = GetData();

            UiTemplates ret = new UiTemplates
            {
                ModelTemplates = new Dictionary<string, Dictionary<string, UiModelTemplate>>
                {
                    ["PricingTable"] = new Dictionary<string, UiModelTemplate>
                    {
                        ["ECAP"] = BuildUiModelTemplate(OpDataElementType.PricingTable, "ECAP", items),
                        ["PROGRAM"] = BuildUiModelTemplate(OpDataElementType.PricingTable, "PROGRAM", items),
                        ["VOLTIER"] = BuildUiModelTemplate(OpDataElementType.PricingTable, "VOLTIER", items),
                        ["CAPBAND"] = BuildUiModelTemplate(OpDataElementType.PricingTable, "CAPBAND", items)
                    },
                    ["WipDeals"] = new Dictionary<string, UiModelTemplate>
                    {
                        ["ECAP"] = BuildUiModelTemplate(OpDataElementType.WipDeals, "ECAP", items),
                        ["PROGRAM"] = BuildUiModelTemplate(OpDataElementType.WipDeals, "PROGRAM", items),
                        ["VOLTIER"] = BuildUiModelTemplate(OpDataElementType.WipDeals, "VOLTIER", items),
                        ["CAPBAND"] = BuildUiModelTemplate(OpDataElementType.WipDeals, "CAPBAND", items)
                    }
                },
                ObjectTemplates = new Dictionary<string, Dictionary<string, UiObjectTemplate>>
                {
                    ["Contract"] = new Dictionary<string, UiObjectTemplate>
                    {
                        ["Generic"] = BuildUiObjectTemplate(OpDataElementType.Contract)
                    },
                    ["PricingStrategy"] = new Dictionary<string, UiObjectTemplate>
                    {
                        ["Generic"] = BuildUiObjectTemplate(OpDataElementType.PricingStrategy)
                    },
                    ["PricingTable"] = new Dictionary<string, UiObjectTemplate>
                    {
                        ["Generic"] = BuildUiObjectTemplate(OpDataElementType.PricingTable)
                    }
                }
            };

            return ret;
        }
    }
}
