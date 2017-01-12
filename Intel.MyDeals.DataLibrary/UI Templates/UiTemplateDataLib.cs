using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.DataLibrary
{
    class UiTemplateDataLib : IUiTemplateDataLib
    {

        public UiTemplates GetUiTemplates()
        {
            // TODO replace with DB call

            return new UiTemplates
            {
                ModelTemplates = new Dictionary<string, Dictionary<string, UiModelTemplate>>
                {
                    ["PricingTable"] = new Dictionary<string, UiModelTemplate>
                    {
                        ["ECAP"] = new UiModelTemplate
                        {
                            name = "ECAP",
                            model = new UiModel
                            {
                                id = "dc_id",
                                fields = new Dictionary<string, UiFieldItem>
                                {
                                    ["dc_id"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["PIVOT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["TITLE"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["INT"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["TEXT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["DATE"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["ECAP"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true }
                                }
                            },
                            columns = new List<UiColumn>
                            {
                                new UiColumn { field = "dc_id", title = "Id", width = 50 },
                                new UiColumn { field = "PIVOT", title = "Pivot", width = 50 },
                                new UiColumn { field = "TITLE", title = "Title", width = 150 },
                                new UiColumn { field = "TEXT", title = "Text", width = 100 },
                                new UiColumn { field = "INT", title = "Int", width = 100 },
                                new UiColumn { field = "DATE", title = "Date", width = 100 },
                                new UiColumn { field = "ECAP", title = "ECAP", width = 150 }
                            },
                            extraAtrbs = new Dictionary<string, UiAtrbs>(),
                            defaultAtrbs = new Dictionary<string, UiAtrbs>
                            {
                                ["TEXT"] = new UiAtrbs
                                {
                                    value = "We are the World",
                                    label = "TEXT: ",
                                    type = "TEXTBOX",
                                    isRequired = true
                                },
                                ["INT"] = new UiAtrbs
                                {
                                    value = 2001,
                                    label = "INT: ",
                                    type = "NUMERIC",
                                    isRequired = false
                                }
                            }
                        },
                        ["PROGRAM"] = new UiModelTemplate
                        {
                            name = "PROGRAM",
                            model = new UiModel
                            {
                                id = "dc_id",
                                fields = new Dictionary<string, UiFieldItem>
                                {
                                    ["dc_id"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["PIVOT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["TITLE"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["INT"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["TEXT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["DATE"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["PROGRAM"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true }
                                }
                            },
                            columns = new List<UiColumn>
                            {
                                new UiColumn { field = "dc_id", title = "Id", width = 50 },
                                new UiColumn { field = "PIVOT", title = "Pivot", width = 50 },
                                new UiColumn { field = "TITLE", title = "Title", width = 150 },
                                new UiColumn { field = "TEXT", title = "Text", width = 100 },
                                new UiColumn { field = "INT", title = "Int", width = 100 },
                                new UiColumn { field = "DATE", title = "Date", width = 100 },
                                new UiColumn { field = "PROGRAM", title = "PROGRAM", width = 150 }
                            },
                            extraAtrbs = new Dictionary<string, UiAtrbs>(),
                            defaultAtrbs = new Dictionary<string, UiAtrbs>
                            {
                                ["TEXT"] = new UiAtrbs
                                {
                                    value = "Program it!!!!",
                                    label = "TEXT: ",
                                    type = "TEXTBOX",
                                    isRequired = true
                                },
                                ["INT"] = new UiAtrbs
                                {
                                    value = 2010,
                                    label = "INT: ",
                                    type = "NUMERIC",
                                    isRequired = false
                                }
                            }
                        },
                        ["VOLTIER"] = new UiModelTemplate
                        {
                            name = "VOLTIER",
                            model = new UiModel
                            {
                                id = "dc_id",
                                fields = new Dictionary<string, UiFieldItem>
                                {
                                    ["dc_id"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["PIVOT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["TITLE"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["INT"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["TEXT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["DATE"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["VOLTIER"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true }
                                }
                            },
                            columns = new List<UiColumn>
                            {
                                new UiColumn { field = "dc_id", title = "Id", width = 50 },
                                new UiColumn { field = "PIVOT", title = "Pivot", width = 50 },
                                new UiColumn { field = "TITLE", title = "Title", width = 150 },
                                new UiColumn { field = "TEXT", title = "Text", width = 100 },
                                new UiColumn { field = "INT", title = "Int", width = 100 },
                                new UiColumn { field = "DATE", title = "Date", width = 100 },
                                new UiColumn { field = "VOLTIER", title = "VOLTIER", width = 150 }
                            },
                            extraAtrbs = new Dictionary<string, UiAtrbs>
                            {
                                ["NUM_TIERS"] = new UiAtrbs
                                {
                                    value = "",
                                    label = "Number of Tiers: ",
                                    type = "DROPDOWN",
                                    isRequired = true,
                                    isError = false,
                                    opLookupUrl = "/api/Lookups/v1/GetLookups/NUM_TIERS",
                                    opLookupText = "DROP_DOWN",
                                    opLookupValue = "DROP_DOWN",
                                    validMsg = "Please enter the number of tiers."
                                }
                            },
                            defaultAtrbs = new Dictionary<string, UiAtrbs>
                            {
                                ["TEXT"] = new UiAtrbs
                                {
                                    value = "More",
                                    label = "TEXT: ",
                                    type = "TEXTBOX",
                                    isRequired = true
                                },
                                ["INT"] = new UiAtrbs
                                {
                                    value = 2016,
                                    label = "INT: ",
                                    type = "NUMERIC",
                                    isRequired = false
                                }
                            }
                        },
                        ["CAPBAND"] = new UiModelTemplate
                        {
                            name = "CAPBAND",
                            model = new UiModel
                            {
                                id = "dc_id",
                                fields = new Dictionary<string, UiFieldItem>
                                {
                                    ["dc_id"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["PIVOT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["TITLE"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["INT"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["TEXT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["DATE"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["CAPBAND"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true }
                                }
                            },
                            columns = new List<UiColumn>
                            {
                                new UiColumn { field = "dc_id", title = "Id", width = 50 },
                                new UiColumn { field = "PIVOT", title = "Pivot", width = 50 },
                                new UiColumn { field = "TITLE", title = "Title", width = 150 },
                                new UiColumn { field = "TEXT", title = "Text", width = 100 },
                                new UiColumn { field = "INT", title = "Int", width = 100 },
                                new UiColumn { field = "DATE", title = "Date", width = 100 },
                                new UiColumn { field = "CAPBAND", title = "CAPBAND", width = 150 }
                            },
                            extraAtrbs = new Dictionary<string, UiAtrbs>
                            {
                                ["NUM_TIERS"] = new UiAtrbs
                                {
                                    value = "",
                                    label = "Number of Tiers: ",
                                    type = "DROPDOWN",
                                    isRequired = true,
                                    isError = false,
                                    opLookupUrl = "/api/Lookups/v1/GetLookups/NUM_TIERS",
                                    opLookupText = "DROP_DOWN",
                                    opLookupValue = "DROP_DOWN",
                                    validMsg = "Please enter the number of tiers."
                                }
                            },
                            defaultAtrbs = new Dictionary<string, UiAtrbs>
                            {
                                ["TEXT"] = new UiAtrbs
                                {
                                    value = "Show me the money!!!",
                                    label = "TEXT: ",
                                    type = "TEXTBOX",
                                    isRequired = true
                                },
                                ["INT"] = new UiAtrbs
                                {
                                    value = 1000000,
                                    label = "INT: ",
                                    type = "NUMERIC",
                                    isRequired = false
                                }
                            }
                        }
                    },
                    ["WipDeals"] = new Dictionary<string, UiModelTemplate>
                    {
                        ["ECAP"] = new UiModelTemplate
                        {
                            name = "ECAP",
                            model = new UiModel
                            {
                                id = "dc_id",
                                fields = new Dictionary<string, UiFieldItem>
                                {
                                    ["_pivot"] = new UiFieldItem { type = FieldTypes.Object, editable = false, nullable = true },
                                    ["_behaviors"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["_MultiDim"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["dc_id"] = new UiFieldItem { type = FieldTypes.Number, editable = false, nullable = true },
                                    ["TEXT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["INT"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["DATE"] = new UiFieldItem { type = FieldTypes.Date, editable = true, nullable = true },
                                    ["DROPDOWN"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/DROPDOWN",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    },
                                    ["COMBOBOX"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/COMBOBOX",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    }
                                }
                            },
                            columns = new List<UiColumn>
                            {
                                new UiColumn
                                {
                                    field = "_dirty",
                                    title = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                                    width = 30,
                                    template = "#=gridUtils.uiIconWrapper(data, '_dirty')#"
                                },
                                new UiColumn
                                {
                                    field = "TEXT",
                                    title = "Text",
                                    template = "#=gridUtils.uiControlWrapper(data, 'TEXT')#"
                                },
                                new UiColumn
                                {
                                    field = "INT",
                                    title = "Int",
                                    template = "#=gridUtils.uiControlWrapper(data, 'INT')#"
                                },
                                new UiColumn
                                {
                                    field = "DATE",
                                    title = "Date",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DATE', \"date:'MM/dd/yyyy'\")#"
                                },
                                new UiColumn
                                {
                                    field = "DROPDOWN",
                                    title = "Dropdown",
                                    uiType = "DropDown",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DROPDOWN')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn
                                {
                                    field = "COMBOBOX",
                                    title = "Combobox",
                                    uiType = "ComboBox",
                                    template = "#=gridUtils.uiControlWrapper(data, 'COMBOBOX')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn { field = "", title = "&nbsp;" }
                            },
                            detailsModel = new UiModel
                            {
                                id = "dc_id",
                                fields = new Dictionary<string, UiFieldItem>
                                {
                                    ["_pivot"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["_behaviors"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["dc_id"] = new UiFieldItem { type = FieldTypes.Number, editable = false, nullable = true },
                                    ["PIVOT"] = new UiFieldItem { type = FieldTypes.Object, editable = false, nullable = true },
                                    ["TEXT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["INT"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["DATE"] = new UiFieldItem { type = FieldTypes.Date, editable = true, nullable = true },
                                    ["DROPDOWN"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/DROPDOWN",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    },
                                    ["COMBOBOX"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/COMBOBOX",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    }
                                }
                            },
                            detailsColumns = new List<UiColumn>
                            {
                                new UiColumn
                                {
                                    field = "_dirty",
                                    title = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                                    width = 30,
                                    template = "#=gridUtils.uiIconWrapper(data, '_dirty')#"
                                },
                                new UiColumn
                                {
                                    field = "PIVOT",
                                    title = "PIVOT"
                                },
                                new UiColumn
                                {
                                    field = "TITLE",
                                    title = "TITLE"
                                },
                                new UiColumn
                                {
                                    field = "TEXT",
                                    title = "Text",
                                    template = "#=gridUtils.uiControlWrapper(data, 'TEXT')#"
                                },
                                new UiColumn
                                {
                                    field = "INT",
                                    title = "Int",
                                    template = "#=gridUtils.uiControlWrapper(data, 'INT')#"
                                },
                                new UiColumn
                                {
                                    field = "DATE",
                                    title = "Date",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DATE', \"date:'MM/dd/yyyy'\")#"
                                },
                                new UiColumn
                                {
                                    field = "DROPDOWN",
                                    title = "Dropdown",
                                    uiType = "DropDown",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DROPDOWN')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn
                                {
                                    field = "COMBOBOX",
                                    title = "Combobox",
                                    uiType = "ComboBox",
                                    template = "#=gridUtils.uiControlWrapper(data, 'COMBOBOX')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn { field = "", title = "&nbsp;" }
                            },
                            extraAtrbs = new Dictionary<string, UiAtrbs>()
                        },
                        ["PROGRAM"] = new UiModelTemplate
                        {
                            name = "ECAP",
                            model = new UiModel
                            {
                                id = "dc_id",
                                fields = new Dictionary<string, UiFieldItem>
                                {
                                    ["_pivot"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["_behaviors"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["dc_id"] = new UiFieldItem { type = FieldTypes.Number, editable = false, nullable = true },
                                    ["TEXT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["INT"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["DATE"] = new UiFieldItem { type = FieldTypes.Date, editable = true, nullable = true },
                                    ["DROPDOWN"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/DROPDOWN",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    },
                                    ["COMBOBOX"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/COMBOBOX",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    }
                                }
                            },
                            columns = new List<UiColumn>
                            {
                                new UiColumn
                                {
                                    field = "_dirty",
                                    title = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                                    width = 30,
                                    template = "#=gridUtils.uiIconWrapper(data, '_dirty')#"
                                },
                                new UiColumn
                                {
                                    field = "TEXT",
                                    title = "Text",
                                    template = "#=gridUtils.uiControlWrapper(data, 'TEXT')#"
                                },
                                new UiColumn
                                {
                                    field = "INT",
                                    title = "Int",
                                    template = "#=gridUtils.uiControlWrapper(data, 'INT')#"
                                },
                                new UiColumn
                                {
                                    field = "DATE",
                                    title = "Date",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DATE', \"date:'MM/dd/yyyy'\")#"
                                },
                                new UiColumn
                                {
                                    field = "DROPDOWN",
                                    title = "Dropdown",
                                    uiType = "DropDown",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DROPDOWN')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn
                                {
                                    field = "COMBOBOX",
                                    title = "Combobox",
                                    uiType = "ComboBox",
                                    template = "#=gridUtils.uiControlWrapper(data, 'COMBOBOX')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn { field = "", title = "&nbsp;" }
                            },
                            detailsModel = new UiModel
                            {
                                id = "dc_id",
                                fields = new Dictionary<string, UiFieldItem>
                                {
                                    ["_behaviors"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["dc_id"] = new UiFieldItem { type = FieldTypes.Number, editable = false, nullable = true },
                                    ["PIVOT"] = new UiFieldItem { type = FieldTypes.Object, editable = false, nullable = true },
                                    ["TEXT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["INT"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["DATE"] = new UiFieldItem { type = FieldTypes.Date, editable = true, nullable = true },
                                    ["DROPDOWN"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/DROPDOWN",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    },
                                    ["COMBOBOX"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/COMBOBOX",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    }
                                }
                            },
                            detailsColumns = new List<UiColumn>
                            {
                                new UiColumn
                                {
                                    field = "_dirty",
                                    title = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                                    width = 30,
                                    template = "#=gridUtils.uiIconWrapper(data, '_dirty')#"
                                },
                                new UiColumn
                                {
                                    field = "PIVOT",
                                    title = "PIVOT"
                                },
                                new UiColumn
                                {
                                    field = "TITLE",
                                    title = "TITLE"
                                },
                                new UiColumn
                                {
                                    field = "TEXT",
                                    title = "Text",
                                    template = "#=gridUtils.uiControlWrapper(data, 'TEXT')#"
                                },
                                new UiColumn
                                {
                                    field = "INT",
                                    title = "Int",
                                    template = "#=gridUtils.uiControlWrapper(data, 'INT')#"
                                },
                                new UiColumn
                                {
                                    field = "DATE",
                                    title = "Date",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DATE', \"date:'MM/dd/yyyy'\")#"
                                },
                                new UiColumn
                                {
                                    field = "DROPDOWN",
                                    title = "Dropdown",
                                    uiType = "DropDown",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DROPDOWN')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn
                                {
                                    field = "COMBOBOX",
                                    title = "Combobox",
                                    uiType = "ComboBox",
                                    template = "#=gridUtils.uiControlWrapper(data, 'COMBOBOX')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn { field = "", title = "&nbsp;" }
                            },
                            extraAtrbs = new Dictionary<string, UiAtrbs>()
                        },
                        ["VOLTIER"] = new UiModelTemplate
                        {
                            name = "ECAP",
                            model = new UiModel
                            {
                                id = "ID",
                                fields = new Dictionary<string, UiFieldItem>
                                {
                                    ["_pivot"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["_behaviors"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["_MultiDim"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["ID"] = new UiFieldItem { type = FieldTypes.Number, editable = false, nullable = true },
                                    ["PIVOT"] = new UiFieldItem { type = FieldTypes.Object, editable = false, nullable = true },
                                    ["TEXT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["INT"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["DATE"] = new UiFieldItem { type = FieldTypes.Date, editable = true, nullable = true },
                                    ["DROPDOWN"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/DROPDOWN",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    },
                                    ["COMBOBOX"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/COMBOBOX",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    }
                                }
                            },
                            columns = new List<UiColumn>
                            {
                                new UiColumn
                                {
                                    field = "_dirty",
                                    title = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                                    width = 30,
                                    template = "#=gridUtils.uiIconWrapper(data, '_dirty')#"
                                },
                                new UiColumn
                                {
                                    field = "TEXT",
                                    title = "Text",
                                    template = "#=gridUtils.uiControlWrapper(data, 'TEXT')#"
                                },
                                new UiColumn
                                {
                                    field = "INT",
                                    title = "Int",
                                    template = "#=gridUtils.uiControlWrapper(data, 'INT')#"
                                },
                                new UiColumn
                                {
                                    field = "DATE",
                                    title = "Date",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DATE', \"date:'MM/dd/yyyy'\")#"
                                },
                                new UiColumn
                                {
                                    field = "DROPDOWN",
                                    title = "Dropdown",
                                    uiType = "DropDown",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DROPDOWN')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn
                                {
                                    field = "COMBOBOX",
                                    title = "Combobox",
                                    uiType = "ComboBox",
                                    template = "#=gridUtils.uiControlWrapper(data, 'COMBOBOX')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn { field = "", title = "&nbsp;" }
                            },
                            detailsModel = new UiModel
                            {
                                id = "dc_id",
                                fields = new Dictionary<string, UiFieldItem>
                                {
                                    ["_behaviors"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["dc_id"] = new UiFieldItem { type = FieldTypes.Number, editable = false, nullable = true },
                                    ["PIVOT"] = new UiFieldItem { type = FieldTypes.Object, editable = false, nullable = true },
                                    ["TEXT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["INT"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["DATE"] = new UiFieldItem { type = FieldTypes.Date, editable = true, nullable = true },
                                    ["DROPDOWN"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/DROPDOWN",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    },
                                    ["COMBOBOX"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/COMBOBOX",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    }
                                }
                            },
                            detailsColumns = new List<UiColumn>
                            {
                                new UiColumn
                                {
                                    field = "_dirty",
                                    title = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                                    width = 30,
                                    template = "#=gridUtils.uiIconWrapper(data, '_dirty')#"
                                },
                                new UiColumn
                                {
                                    field = "PIVOT",
                                    title = "PIVOT"
                                },
                                new UiColumn
                                {
                                    field = "TITLE",
                                    title = "TITLE"
                                },
                                new UiColumn
                                {
                                    field = "TEXT",
                                    title = "Text",
                                    template = "#=gridUtils.uiControlWrapper(data, 'TEXT')#"
                                },
                                new UiColumn
                                {
                                    field = "INT",
                                    title = "Int",
                                    template = "#=gridUtils.uiControlWrapper(data, 'INT')#"
                                },
                                new UiColumn
                                {
                                    field = "DATE",
                                    title = "Date",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DATE', \"date:'MM/dd/yyyy'\")#"
                                },
                                new UiColumn
                                {
                                    field = "DROPDOWN",
                                    title = "Dropdown",
                                    uiType = "DropDown",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DROPDOWN')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn
                                {
                                    field = "COMBOBOX",
                                    title = "Combobox",
                                    uiType = "ComboBox",
                                    template = "#=gridUtils.uiControlWrapper(data, 'COMBOBOX')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn { field = "", title = "&nbsp;" }
                            },
                            extraAtrbs = new Dictionary<string, UiAtrbs>()
                        },
                        ["CAPBAND"] = new UiModelTemplate
                        {
                            name = "ECAP",
                            model = new UiModel
                            {
                                id = "dc_id",
                                fields = new Dictionary<string, UiFieldItem>
                                {
                                    ["_pivot"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["_behaviors"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["_MultiDim"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["dc_id"] = new UiFieldItem { type = FieldTypes.Number, editable = false, nullable = true },
                                    ["PIVOT"] = new UiFieldItem { type = FieldTypes.Object, editable = false, nullable = true },
                                    ["TEXT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["INT"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["DATE"] = new UiFieldItem { type = FieldTypes.Date, editable = true, nullable = true },
                                    ["DROPDOWN"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/DROPDOWN",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    },
                                    ["COMBOBOX"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/COMBOBOX",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    }
                                }
                            },
                            columns = new List<UiColumn>
                            {
                                new UiColumn
                                {
                                    field = "_dirty",
                                    title = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                                    width = 30,
                                    template = "#=gridUtils.uiIconWrapper(data, '_dirty')#"
                                },
                                new UiColumn
                                {
                                    field = "TEXT",
                                    title = "Text",
                                    template = "#=gridUtils.uiControlWrapper(data, 'TEXT')#"
                                },
                                new UiColumn
                                {
                                    field = "INT",
                                    title = "Int",
                                    template = "#=gridUtils.uiControlWrapper(data, 'INT')#"
                                },
                                new UiColumn
                                {
                                    field = "DATE",
                                    title = "Date",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DATE', \"date:'MM/dd/yyyy'\")#"
                                },
                                new UiColumn
                                {
                                    field = "DROPDOWN",
                                    title = "Dropdown",
                                    uiType = "DropDown",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DROPDOWN')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn
                                {
                                    field = "COMBOBOX",
                                    title = "Combobox",
                                    uiType = "ComboBox",
                                    template = "#=gridUtils.uiControlWrapper(data, 'COMBOBOX')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn { field = "", title = "&nbsp;" }
                            },
                            detailsModel = new UiModel
                            {
                                id = "dc_id",
                                fields = new Dictionary<string, UiFieldItem>
                                {
                                    ["_behaviors"] = new UiFieldItem { type = FieldTypes.Object, editable = true, nullable = true },
                                    ["dc_id"] = new UiFieldItem { type = FieldTypes.Number, editable = false, nullable = true },
                                    ["PIVOT"] = new UiFieldItem { type = FieldTypes.Object, editable = false, nullable = true },
                                    ["TEXT"] = new UiFieldItem { type = FieldTypes.String, editable = true, nullable = true },
                                    ["INT"] = new UiFieldItem { type = FieldTypes.Number, editable = true, nullable = true },
                                    ["DATE"] = new UiFieldItem { type = FieldTypes.Date, editable = true, nullable = true },
                                    ["DROPDOWN"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/DROPDOWN",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    },
                                    ["COMBOBOX"] = new UiFieldItem
                                    {
                                        type = FieldTypes.String,
                                        values = "/api/Lookups/v1/GetLookups/COMBOBOX",
                                        valuesText = "DROP_DOWN",
                                        valuesValue = "DROP_DOWN",
                                        editable = true,
                                        nullable = true
                                    }
                                }
                            },
                            detailsColumns = new List<UiColumn>
                            {
                                new UiColumn
                                {
                                    field = "_dirty",
                                    title = "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                                    width = 30,
                                    template = "#=gridUtils.uiIconWrapper(data, '_dirty')#"
                                },
                                new UiColumn
                                {
                                    field = "PIVOT",
                                    title = "PIVOT"
                                },
                                new UiColumn
                                {
                                    field = "TITLE",
                                    title = "TITLE"
                                },
                                new UiColumn
                                {
                                    field = "TEXT",
                                    title = "Text",
                                    template = "#=gridUtils.uiControlWrapper(data, 'TEXT')#"
                                },
                                new UiColumn
                                {
                                    field = "INT",
                                    title = "Int",
                                    template = "#=gridUtils.uiControlWrapper(data, 'INT')#"
                                },
                                new UiColumn
                                {
                                    field = "DATE",
                                    title = "Date",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DATE', \"date:'MM/dd/yyyy'\")#"
                                },
                                new UiColumn
                                {
                                    field = "DROPDOWN",
                                    title = "Dropdown",
                                    uiType = "DropDown",
                                    template = "#=gridUtils.uiControlWrapper(data, 'DROPDOWN')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn
                                {
                                    field = "COMBOBOX",
                                    title = "Combobox",
                                    uiType = "ComboBox",
                                    template = "#=gridUtils.uiControlWrapper(data, 'COMBOBOX')#",
                                    editor = "gridUtils.lookupEditor"
                                },
                                new UiColumn { field = "", title = "&nbsp;" }
                            },
                            extraAtrbs = new Dictionary<string, UiAtrbs>()
                        }
                    }
                },
                ObjectTemplates = new Dictionary<string, Dictionary<string, UiObjectTemplate>>
                {
                    ["Contract"] = new Dictionary<string, UiObjectTemplate>
                    {
                        ["Generic"] = new UiObjectTemplate
                        {
                            ["dc_id"] = 0,
                            ["dc_parent_id"] = 0,
                            ["OBJSET_TYPE"] = "",
                            ["TITLE"] = "",
                            ["CUST_NM"] = "",
                            ["START_DT"] = "",
                            ["END_DT"] = "",
                            ["CUST_ACCEPTED"] = "",
                            ["C2A_REF"] = "",
                            ["DEAL_STG_CD"] = "",
                            ["PricingStrategy"] = new List<string>(),
                            ["_behaviors"] = new Dictionary<string, Dictionary<string, dynamic>>
                            {
                                ["isRequired"] = new Dictionary<string, dynamic>
                                {
                                    ["TITLE"] = true,
                                    ["CUST_NM"] = true,
                                    ["CUST_NM"] = true,
                                    ["END_DT"] = true
                                },
                                ["isError"] = new Dictionary<string, dynamic>(),
                                ["validMsg"] = new Dictionary<string, dynamic>()
                            }
                        }
                    },
                    ["PricingStrategy"] = new Dictionary<string, UiObjectTemplate>
                    {
                        ["Generic"] = new UiObjectTemplate
                        {
                            ["dc_id"] = 0,
                            ["dc_parent_id"] = 0,
                            ["OBJSET_TYPE"] = "",
                            ["TITLE"] = "",
                            ["TERMS"] = "",
                            ["PricingTable"] = new List<string>(),
                            ["_behaviors"] = new Dictionary<string, Dictionary<string, dynamic>>
                            {
                                ["isRequired"] = new Dictionary<string, dynamic>
                                {
                                    ["TITLE"] = true
                                },
                                ["isError"] = new Dictionary<string, dynamic>(),
                                ["validMsg"] = new Dictionary<string, dynamic>()
                            }
                        }
                    },
                    ["PricingTable"] = new Dictionary<string, UiObjectTemplate>
                    {
                        ["Generic"] = new UiObjectTemplate
                        {
                            ["dc_id"] = 0,
                            ["dc_parent_id"] = 0,
                            ["OBJSET_TYPE"] = "",
                            ["TITLE"] = "",
                            ["_behaviors"] = new Dictionary<string, Dictionary<string, dynamic>>
                            {
                                ["isRequired"] = new Dictionary<string, dynamic>
                                {
                                    ["TITLE"] = true
                                },
                                ["isError"] = new Dictionary<string, dynamic>(),
                                ["validMsg"] = new Dictionary<string, dynamic>()
                            }
                        }
                    }
                }

            };



        }
    }
}
