using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities.UI_Templates
{
    public static class UiTemplatesExtensionMethods
    {
        public static UiTemplates Populate(this UiTemplates uiTemplates, OpDataElementAtrbTemplates templates, List<UiTemplateContainerItem> items)
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
                var data = opDataElementType.GetChildrenSetTypes();
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
                string dimKey = "";
                if (!string.IsNullOrEmpty(item.DimCd)) dimKey = item.DimCd.AtrbCdDimKeySafe();
                if (!item.IsDetail)
                {
                    fields[item.AtrbCd + dimKey] = new UiFieldItem
                    {
                        editable = !item.IsReadOnly,
						field = item.AtrbCd + dimKey,
						format = item.Format,
						label = item.Label,
						nullable = !item.IsRequired,
						opLookupUrl = item.LookupUrl ?? "",
						opLookupText = item.LookupText ?? "",
						opLookupValue = item.LookupValue ?? "",
						uiType = item.UiType,
						type = item.DataType,
						validMsg = item.HelpText ?? "",
                        values = item.LookupValue,
                        valuesText = item.LookupText,
                        valuesValue = item.LookupValue
					};

                    columns.Add(new UiColumn
                    {
                        field = item.AtrbCd + dimKey,
                        title = item.Label,
                        hidden = item.IsHidden,
                        width = item.Width,
                        editor = item.Editor,
                        template = item.Template,
                        headerTemplate = item.HeaderTemplate,
                        isDimKey = item.IsDimKey,
                        filterable = item.IsFilterable,
                        sortable = item.IsSortable,
                        lookupUrl = item.LookupUrl ?? "",
                        lookupText = item.LookupText ?? "",
                        lookupValue = item.LookupValue ?? "",
                        uiType = item.UiType
					});
                }
                else
                {
                    detailsFields[item.AtrbCd + dimKey] = new UiFieldItem
                    {
                        editable = !item.IsReadOnly,
						field = item.AtrbCd + dimKey,
						format = item.Format,
						label = item.Label,
						nullable = !item.IsRequired,
						opLookupUrl = item.LookupUrl ?? "",
						opLookupText = item.LookupText ?? "",
						opLookupValue = item.LookupValue ?? "",
                        type = item.DataType,
						uiType = item.UiType,
						validMsg = item.HelpText ?? "",
                        values = item.LookupValue,
                        valuesText = item.LookupText,
                        valuesValue = item.LookupValue
					};

                    detailsColumns.Add(new UiColumn
                    {
                        field = item.AtrbCd + dimKey,
                        title = item.Label,
                        hidden = item.IsHidden,
                        width = item.Width,
                        editor = item.Editor,
                        template = item.Template,
                        headerTemplate = item.HeaderTemplate,
                        isDimKey = item.IsDimKey,
                        filterable = item.IsFilterable,
                        sortable = item.IsSortable,
                        lookupUrl = item.LookupUrl ?? "",
                        lookupText = item.LookupText ?? "",
                        lookupValue = item.LookupValue ?? "",
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
        public static UiTemplates BuildUiObjectTemplates(this UiTemplates uiTemplates, OpDataElementAtrbTemplates templates)
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
        private static UiTemplates BuildUiObjectTemplate(this UiTemplates uiTemplates, OpDataElementType opDataElementType, OpDataElementSetType objSetType, OpDataElementAtrbTemplates templates)
        {
            if (!uiTemplates.ObjectTemplates.ContainsKey(opDataElementType.ToString()))
                uiTemplates.ObjectTemplates[opDataElementType.ToString()] = new Dictionary<string, UiObjectTemplate>();

            if (objSetType != OpDataElementSetType.CAP_BAND) // temporary until CAP BAND can be removed
            {
                uiTemplates.ObjectTemplates[opDataElementType.ToString()][objSetType.ToString()] = BuildUiObjectTemplateItem(opDataElementType, objSetType, templates);
            }

            return uiTemplates;
        }

        /// <summary>
        /// Build a single item in an Object Template
        /// </summary>
        /// <param name="opDataElementType"></param>
        /// <param name="objSetType"></param>
        /// <param name="templates"></param>
        /// <returns></returns>
        private static UiObjectTemplate BuildUiObjectTemplateItem(OpDataElementType opDataElementType, OpDataElementSetType objSetType, OpDataElementAtrbTemplates templates)
        {
            UiObjectTemplate template = new UiObjectTemplate();
            string key = $"{opDataElementType}:{objSetType}";
            if (!templates.ContainsKey(key)) return template;

            foreach (OpDataElement opDataElement in templates[key])
            {
                template[opDataElement.AtrbCd] = opDataElement.AtrbValue;
            }

            template[AttributeCodes.dc_type] = opDataElementType.ToId();
            template[AttributeCodes.dc_parent_type] = opDataElementType.GetParent().ToId();
            template[AttributeCodes.OBJ_SET_TYPE_CD] = objSetType.ToString();
            template["_behaviors"] = new Dictionary<string, Dictionary<string, dynamic>>
            {
                ["isRequired"] = new Dictionary<string, dynamic>(),
                ["isReadOnly"] = new Dictionary<string, dynamic>(),
                ["isHidden"] = new Dictionary<string, dynamic>(),
                ["isError"] = new Dictionary<string, dynamic>(),
                ["validMsg"] = new Dictionary<string, dynamic>()
            };

            foreach (OpDataElementType opDet in opDataElementType.GetChildren())
            {
                template[opDet.ToString()] = new List<string>();
            }

            // TODO replace with security attributes reference for required attributes

            if (opDataElementType == OpDataElementType.CNTRCT)
            {
                template["_behaviors"]["isRequired"] = new Dictionary<string, dynamic>
                {
                    [AttributeCodes.TITLE] = true,
                    [AttributeCodes.CUST_MBR_SID] = true,
                    [AttributeCodes.START_DT] = true,
                    [AttributeCodes.END_DT] = true
                };
            }

            if (opDataElementType == OpDataElementType.PRC_ST)
            {
                template["_behaviors"]["isRequired"] = new Dictionary<string, dynamic>
                {
                    [AttributeCodes.TITLE] = true
                };
            }

            if (opDataElementType == OpDataElementType.PRC_TBL)
            {
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
                    isRequired = item.IsRequired,
                    isError = false,
                    isHidden = item.IsHidden,
                    opLookupUrl = item.LookupUrl ?? "",
                    opLookupText = item.LookupText ?? "",
                    opLookupValue = item.LookupValue ?? "",
                    validMsg = item.HelpText ?? "",
                    helpMsg = item.HelpText ?? ""
                };
            }
            return uiTemplates;
        }
    }
}