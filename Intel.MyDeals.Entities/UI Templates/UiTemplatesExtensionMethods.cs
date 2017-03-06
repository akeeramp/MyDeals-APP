using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities.UI_Templates
{
    public static class UiTemplatesExtensionMethods
    {

        public static UiTemplates Populate(this UiTemplates uiTemplates, OpDataElementUITemplates templates, List<UiTemplateContainerItem> items)
        {
            uiTemplates.BuildUiModelTemplates(items);
            uiTemplates.BuildUiObjectTemplates(templates);
            uiTemplates.BuildExtrasTemplates(items);
            uiTemplates.BuildDefaultsTemplates(items);

            return uiTemplates;
        }

        /// <summary>
        /// Build the UI Model Templates
        /// </summary>
        /// <param name="uiTemplates"></param>
        /// <param name="items"></param>
        /// <returns></returns>
        public static UiTemplates BuildUiModelTemplates(this UiTemplates uiTemplates, List<UiTemplateContainerItem> items)
        {
            // Ensure we clean this out before assigning values
            uiTemplates.ModelTemplates = new Dictionary<string, Dictionary<string, UiModelTemplate>>();

            foreach (OpDataElementType opDataElementType in Enum.GetValues(typeof(OpDataElementType)))
            {
                var data  = opDataElementType.GetChildrenSetTypes();
                if (data == null) continue;

                foreach (OpDataElementSetType opDataElementSetType in data)
                {
                    uiTemplates.BuildUiModelTemplate(opDataElementType, opDataElementSetType, items);
                }
            }

            return uiTemplates;
        }

        /// <summary>
        /// Build a single UI Model Template
        /// </summary>
        /// <param name="uiTemplates"></param>
        /// <param name="opDataElementType"></param>
        /// <param name="objSetType"></param>
        /// <param name="items"></param>
        /// <returns></returns>
        public static UiTemplates BuildUiModelTemplate(this UiTemplates uiTemplates, OpDataElementType opDataElementType, OpDataElementSetType objSetType, List<UiTemplateContainerItem> items)
        {
            if (!uiTemplates.ModelTemplates.ContainsKey(opDataElementType.ToString()))
                uiTemplates.ModelTemplates[opDataElementType.ToString()] = new Dictionary<string, UiModelTemplate>();

            uiTemplates.ModelTemplates[opDataElementType.ToString()][objSetType.ToString()] = BuildUiModelTemplateItem(opDataElementType, objSetType, items);
            return uiTemplates;
        }

        /// <summary>
        /// Build a single item in a Model Template
        /// </summary>
        /// <param name="opDataElementType"></param>
        /// <param name="objSetType"></param>
        /// <param name="items"></param>
        /// <returns></returns>
        private static UiModelTemplate BuildUiModelTemplateItem(OpDataElementType opDataElementType, OpDataElementSetType objSetType, List<UiTemplateContainerItem> items)
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
                name = objSetType.ToString(),
                model = new UiModel { fields = fields },
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




        /// <summary>
        /// Build the UI Object Templates
        /// </summary>
        /// <param name="uiTemplates"></param>
        /// <param name="templates"></param>
        /// <returns></returns>
        public static UiTemplates BuildUiObjectTemplates(this UiTemplates uiTemplates, OpDataElementUITemplates templates)
        {
            // Ensure we clean this out before assigning values
            uiTemplates.ObjectTemplates = new Dictionary<string, Dictionary<string, UiObjectTemplate>>();

            foreach (OpDataElementType opDataElementType in Enum.GetValues(typeof(OpDataElementType)))
            {
                var data = opDataElementType.GetChildrenSetTypes();
                if (data == null) continue;

                foreach (OpDataElementSetType opDataElementSetType in data)
                {
                    uiTemplates.BuildUiObjectTemplate(opDataElementType, opDataElementSetType, templates);
                }
            }

            return uiTemplates;
        }

        /// <summary>
        /// Build a single UI Object Template
        /// </summary>
        /// <param name="uiTemplates"></param>
        /// <param name="opDataElementType"></param>
        /// <param name="objSetType"></param>
        /// <param name="templates"></param>
        /// <returns></returns>
        private static UiTemplates BuildUiObjectTemplate(this UiTemplates uiTemplates, OpDataElementType opDataElementType, OpDataElementSetType objSetType, OpDataElementUITemplates templates)
        {
            if (!uiTemplates.ObjectTemplates.ContainsKey(opDataElementType.ToString()))
                uiTemplates.ObjectTemplates[opDataElementType.ToString()] = new Dictionary<string, UiObjectTemplate>();

            uiTemplates.ObjectTemplates[opDataElementType.ToString()][objSetType.ToString()] = BuildUiObjectTemplateItem(opDataElementType, templates);
            return uiTemplates;
        }

        /// <summary>
        /// Build a single item in an Object Template
        /// </summary>
        /// <param name="opDataElementType"></param>
        /// <param name="templates"></param>
        /// <returns></returns>
        private static UiObjectTemplate BuildUiObjectTemplateItem(OpDataElementType opDataElementType, OpDataElementUITemplates templates)
        {
            UiObjectTemplate template = new UiObjectTemplate();
            if (!templates.ContainsKey(opDataElementType.ToString())) return template;

            foreach (OpDataElementUI opDataElementUi in templates[opDataElementType.ToString()])
            {
                template[opDataElementUi.AtrbCd] = opDataElementUi.AtrbValue;
            }

            template["dc_type"] = opDataElementType.ToId();
            template["dc_parent_type"] = opDataElementType.GetParent().ToId();
            template["_behaviors"] = new Dictionary<string, Dictionary<string, dynamic>>
            {
                ["isRequired"] = new Dictionary<string, dynamic>(),
                ["isReadonly"] = new Dictionary<string, dynamic>(),
                ["isHidden"] = new Dictionary<string, dynamic>(),
                ["isError"] = new Dictionary<string, dynamic>(),
                ["validMsg"] = new Dictionary<string, dynamic>()
            };

            foreach (OpDataElementType opDet in opDataElementType.GetChildren())
            {
                template[opDet.ToString()] = new List<string>();
            }

            // TODO replace with security attributes reference for required attributes

            if (opDataElementType == OpDataElementType.Contract)
            {
                template[AttributeCodes.OBJ_SET_TYPE_CD] = OpDataElementType.Contract.ToString();
                template["_behaviors"]["isRequired"] = new Dictionary<string, dynamic>
                {
                    [AttributeCodes.TITLE] = true,
                    [AttributeCodes.CUST_MBR_SID] = true,
                    [AttributeCodes.START_DT] = true,
                    [AttributeCodes.END_DT] = true
                };
            }

            if (opDataElementType == OpDataElementType.PricingStrategy)
            {
                template[AttributeCodes.OBJ_SET_TYPE_CD] = OpDataElementType.PricingStrategy.ToString();
                template["_behaviors"]["isRequired"] = new Dictionary<string, dynamic>
                {
                    [AttributeCodes.TITLE] = true
                };
            }

            if (opDataElementType == OpDataElementType.PricingTable)
            {
                template[AttributeCodes.OBJ_SET_TYPE_CD] = OpDataElementType.PricingTable.ToString();
                template["_behaviors"]["isRequired"] = new Dictionary<string, dynamic>
                {
                    [AttributeCodes.TITLE] = true
                };
            }

            return template;
        }




        /// <summary>
        /// Build the Extras Templates
        /// </summary>
        /// <param name="uiTemplates"></param>
        /// <param name="items"></param>
        /// <returns></returns>
        public static UiTemplates BuildExtrasTemplates(this UiTemplates uiTemplates, List<UiTemplateContainerItem> items)
        {
            foreach (OpDataElementType opDataElementType in Enum.GetValues(typeof(OpDataElementType)))
            {
                var data = opDataElementType.GetChildrenSetTypes();
                if (data == null) continue;

                foreach (OpDataElementSetType opDataElementSetType in data)
                {
                    uiTemplates.BuildExtrasTemplate(opDataElementType, opDataElementSetType, items);
                }
            }

            return uiTemplates;
        }

        /// <summary>
        /// Build a single Extra Template
        /// </summary>
        /// <param name="uiTemplates"></param>
        /// <param name="opDataElementType"></param>
        /// <param name="objSetType"></param>
        /// <param name="items"></param>
        /// <returns></returns>
        public static UiTemplates BuildExtrasTemplate(this UiTemplates uiTemplates, OpDataElementType opDataElementType, OpDataElementSetType objSetType, List<UiTemplateContainerItem> items)
        {
            if (!uiTemplates.ModelTemplates.ContainsKey(opDataElementType.ToString()))
                uiTemplates.ModelTemplates[opDataElementType.ToString()] = new Dictionary<string, UiModelTemplate>();

            var ex = uiTemplates.ModelTemplates[opDataElementType.ToString()][objSetType.ToString()];

            List<UiTemplateContainerItem> filteredItems = items
                .Where(t => t.IsExtra 
                && (!t.ObjType.Any() || t.ObjType.Contains(opDataElementType)) 
                && (!t.ObjSetType.Any() || t.ObjSetType.Contains(objSetType))).ToList();

            foreach (UiTemplateContainerItem item in filteredItems)
            {
                ex.extraAtrbs[item.AtrbCd] = new UiAtrbs
                {
                    value = item.DefValue ?? "",
                    label = item.Label ?? "" + ":",
                    type = item.UiType ?? "",
                    isRequired = item.IsRequired,
                    isError = false,
                    opLookupUrl = item.LookupUrl ?? "",
                    opLookupText = item.LookupText ?? "",
                    opLookupValue = item.LookupValue ?? "",
                    validMsg = item.HelpText ?? ""
                };
            }
            return uiTemplates;
        }




        /// <summary>
        /// Build the Defaults Templates
        /// </summary>
        /// <param name="uiTemplates"></param>
        /// <param name="items"></param>
        /// <returns></returns>
        public static UiTemplates BuildDefaultsTemplates(this UiTemplates uiTemplates, List<UiTemplateContainerItem> items)
        {
            foreach (OpDataElementType opDataElementType in Enum.GetValues(typeof(OpDataElementType)))
            {
                var data = opDataElementType.GetChildrenSetTypes();
                if (data == null) continue;

                foreach (OpDataElementSetType opDataElementSetType in data)
                {
                    uiTemplates.BuildDefaultsTemplate(opDataElementType, opDataElementSetType, items);
                }
            }

            return uiTemplates;
        }

        /// <summary>
        /// Build a single item in a Defaults Template
        /// </summary>
        /// <param name="uiTemplates"></param>
        /// <param name="opDataElementType"></param>
        /// <param name="objSetType"></param>
        /// <param name="items"></param>
        /// <returns></returns>
        public static UiTemplates BuildDefaultsTemplate(this UiTemplates uiTemplates, OpDataElementType opDataElementType, OpDataElementSetType objSetType, List<UiTemplateContainerItem> items)
        {
            if (!uiTemplates.ModelTemplates.ContainsKey(opDataElementType.ToString()))
                uiTemplates.ModelTemplates[opDataElementType.ToString()] = new Dictionary<string, UiModelTemplate>();

            var ex = uiTemplates.ModelTemplates[opDataElementType.ToString()][objSetType.ToString()];

            List<UiTemplateContainerItem> filteredItems = items
                .Where(t => t.IsDefaultable 
                && (!t.ObjType.Any() || t.ObjType.Contains(opDataElementType)) 
                && (!t.ObjSetType.Any() || t.ObjSetType.Contains(objSetType))).ToList();

            foreach (UiTemplateContainerItem item in filteredItems)
            {
                ex.defaultAtrbs[item.AtrbCd] = new UiAtrbs
                {
                    value = item.DefValue ?? "",
                    label = item.Label ?? "" + ":",
                    type = item.UiType ?? "",
                    isRequired = item.IsRequired
                };
            }
            return uiTemplates;
        }

    }
}
