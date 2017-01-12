using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Helpers
{
    public static class GridHelpers
    {

        ////public static GridType GetGridType(string gridName)
        ////{
        ////    return new MetasLib().GetGridType(gridName);
        ////}

        ////public static string GetGridColumns(GridType gridType)
        ////{
        ////    var localColumns = GetGridColumnsBase();
        ////    return localColumns.ContainsKey(gridType.GridTypeName)
        ////        ? localColumns[gridType.GridTypeName]
        ////        : string.Empty;
        ////}

        ////public static string GetGridSchema(GridType gridType)
        ////{
        ////    var localGridSchema = GridSchema;
        ////    return localGridSchema.ContainsKey(gridType.GridTypeName) ? localGridSchema[gridType.GridTypeName] : string.Empty;
        ////}

        ////public static Dictionary<string, List<string>> GetDealTypeAtrbCds()
        ////{
        ////    Dictionary<string, List<string>> rtn = new Dictionary<string, List<string>>();

        ////    Dictionary<string, List<OpDataElementUI>> templates = new MetasLib().GetTemplateData();
        ////    foreach (KeyValuePair<string, List<OpDataElementUI>> keyValuePair in templates)
        ////    {
        ////        rtn[keyValuePair.Key] = keyValuePair.Value.Select(de => de.AtrbCd).Distinct().ToList();
        ////    }
        ////    return rtn;
        ////}



        ////public static Dictionary<string, string> GetGridColumnsBase()
        ////{
        ////    if (_gridColumns != null && _gridColumns.Any()) return _gridColumns;

        ////    _gridColumns = new Dictionary<string, string>();

        ////    List<GridType> distinctGridTypes = new MetasLib().GetGridTypes().ToList();
        ////    List<FilterAttribute> attribs = new MetasLib().GetFilterAttributes().ToList();
        ////    var ttt = attribs.Where(t => t.AtrbColNm == "DEAL_SID");

        ////    foreach (GridType distinctGridType in distinctGridTypes)
        ////    {
        ////        List<string> atrbs = new List<string>();

        ////        foreach (FilterAttribute filterAttribute in attribs
        ////            .Where(g => g.GridTypeID == distinctGridType.GridTypeID)
        ////            .OrderBy(g => g.AtrbGroupOrder).ThenBy(f => f.Order).ThenBy(f => f.AtrbLabel))
        ////        {
        ////            List<string> atrb = new List<string>();

        ////            SetColAtrb(ref atrb, "field", filterAttribute.AtrbColNm);
        ////            SetColAtrb(ref atrb, "title", filterAttribute.AtrbLabel);
        ////            SetColAtrb(ref atrb, "group", filterAttribute.AtrbGroup);
        ////            SetColAtrb(ref atrb, "encoded", filterAttribute.Encoded);
        ////            SetColAtrb(ref atrb, "locked", filterAttribute.Locked);
        ////            SetColAtrb(ref atrb, "sortable", filterAttribute.Sortable);
        ////            SetColAtrb(ref atrb, "filterable", filterAttribute.Filterable);
        ////            SetColAtrb(ref atrb, "hidden", filterAttribute.Hidden);
        ////            SetColAtrb(ref atrb, "width", filterAttribute.Width);
        ////            SetColAtrb(ref atrb, "format", filterAttribute.Format);
        ////            SetColAtrb(ref atrb, "template", filterAttribute.Template);
        ////            SetColAtrb(ref atrb, "headerTemplate", filterAttribute.HeaderTemplate);
        ////            SetColAtrb(ref atrb, "editable", filterAttribute.ReadOnly_class, true);
        ////            SetColAtrb(ref atrb, "editor", filterAttribute.Editor);

        ////            atrbs.Add("{" + string.Join(",", atrb) + "}");
        ////        }
        ////        _gridColumns[distinctGridType.GridTypeName] =
        ////            string.Join(",", atrbs)
        ////                .Replace("_HASH',", "_HASH',filterable:false,")
        ////                .Replace("DEAL_NBR',", "DEAL_NBR',filterable:false,");
        ////    }
        ////    return _gridColumns;
        ////}
        ////private static Dictionary<string, string> _gridColumns;

        ////public static Dictionary<string, string> GridSchema
        ////{
        ////    get
        ////    {
        ////        if (_gridSchema != null && _gridSchema.Any()) return _gridSchema;

        ////        _gridSchema = new Dictionary<string, string>();

        ////        List<GridType> distinctGridTypes = new MetasLib().GetGridTypes().ToList();
        ////        List<UIType> uiTypes = new MetasLib().GetUITypes().ToList();

        ////        foreach (GridType distinctGridType in distinctGridTypes)
        ////        {
        ////            List<string> atrbs = new List<string>();

        ////            List<FilterAttribute> attribs = new MetasLib().GetFilterAttributes(distinctGridType).OrderBy(f => f.AtrbLabel).ToList();
        ////            foreach (FilterAttribute filterAttribute in attribs)
        ////            {
        ////                string type = uiTypes.Where(u => u.UITypeID == filterAttribute.UITypeID).Select(u => u.UITypeCd).FirstOrDefault();

        ////                List<string> atrb = new List<string>();
        ////                SetColAtrb(ref atrb, "values", filterAttribute.LookupUrl);
        ////                SetColAtrb(ref atrb, "valuesText", filterAttribute.LookupText);
        ////                SetColAtrb(ref atrb, "valuesValue", filterAttribute.LookupValue);

        ////                string extraAtrbs = string.Join(",", atrb);
        ////                if (extraAtrbs != "") extraAtrbs = "," + extraAtrbs;

        ////                atrbs.Add(filterAttribute.AtrbColNm.Replace(".","") + ": { type: '" + type + "'" + extraAtrbs + "}");
        ////            }

        ////            _gridSchema[distinctGridType.GridTypeName] = string.Join(",", atrbs);
        ////        }
        ////        return _gridSchema;
        ////    }
        ////    set { _gridSchema = value; }
        ////}
        ////private static Dictionary<string, string> _gridSchema;

        ////private static void SetColWidth(ref List<string> atrb, double dataWidth)
        ////{
        ////    atrb.Add($"width: {dataWidth}");
        ////}

        ////private static void SetColFormat(ref List<string> atrb, string dataFormat)
        ////{
        ////    if (string.IsNullOrEmpty(dataFormat)) return;
        ////    atrb.Add($"format: '{dataFormat}'");

        ////    if (dataFormat == "{0:n0}")
        ////    {
        ////        atrb.Add("filterable: {ui: function (element) {element.kendoNumericTextBox({format: '#',decimals: 0});}}");
        ////    }
        ////}

        ////private static void SetColAtrb(ref List<string> atrb, string dataAtrbName, string dataAtrbValue)
        ////{
        ////    if (string.IsNullOrEmpty(dataAtrbValue)) return;

        ////    if (dataAtrbName == "template" || dataAtrbName == "headerTemplate")
        ////    {
        ////        atrb.Add($"{dataAtrbName}: '{dataAtrbValue}'");
        ////    }
        ////    else if (dataAtrbName == "editor")
        ////    {
        ////        if (dataAtrbValue.Trim() != string.Empty) atrb.Add($"{dataAtrbName}: {dataAtrbValue.Trim()}");
        ////    }
        ////    else
        ////    {
        ////        atrb.Add($"{dataAtrbName}: \"{dataAtrbValue}\"");
        ////    }

        ////    if (dataAtrbName == "format" && dataAtrbValue == "{0:n0}")
        ////    {
        ////        atrb.Add("filterable: {ui: function (element) {element.kendoNumericTextBox({format: '#',decimals: 0});}}");
        ////    }
        ////}

        ////private static void SetColAtrb(ref List<string> atrb, string dataAtrbName, bool dataAtrbValue, bool inverse = false)
        ////{
        ////    atrb.Add(!inverse
        ////        ? $"{dataAtrbName}: {(dataAtrbValue ? "true" : "false")}"
        ////        : $"{dataAtrbName}: {(dataAtrbValue ? "false" : "true")}");
        ////}

        ////private static void SetColAtrb(ref List<string> atrb, string dataAtrbName, double dataAtrbValue)
        ////{
        ////    atrb.Add($"{dataAtrbName}: {dataAtrbValue}");
        ////}

        ////private static void SetColHidden(ref List<string> atrb, bool dataHidden)
        ////{
        ////    if (!dataHidden) return;
        ////    atrb.Add($"hidden: {(dataHidden ? "true" : "false")}");
        ////}

        ////private static void SetColSortable(ref List<string> atrb, bool dataSortable)
        ////{
        ////    //if (!dataSortable) return;
        ////    atrb.Add($"sortable: {(dataSortable ? "true" : "false")}");
        ////}

        ////private static void SetColTemplate(ref List<string> atrb, string dataTemplate)
        ////{
        ////    if (string.IsNullOrEmpty(dataTemplate)) return;
        ////    atrb.Add($"template: '{dataTemplate}'");
        ////}


    }
}