using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class UiTemplateContainerItem
    {
        public UiTemplateContainerItem()
        {
            ObjType = new List<OpDataElementType>();
            ObjSetType = new List<OpDataElementSetType>();
        }

        public int Id { get; set; }
        public bool IsKey { get; set; }
        public string ContainerType { get; set; }
        public string AtrbCd { get; set; }
        public List<OpDataElementType> ObjType { get; set; }
        public List<OpDataElementSetType> ObjSetType { get; set; }
        public string Label { get; set; }
        public string DefValue { get; set; }
        public string HelpText { get; set; }
        public string DataType { get; set; }
        public string UiType { get; set; }
        public string DimCd { get; set; }
        public int MaxLength { get; set; }
        public bool IsDefaultable { get; set; }
        public bool IsDimKey { get; set; }
        public bool IsDetail { get; set; }
        public bool IsExtra { get; set; }
        public bool IsHidden { get; set; }
        public bool IsReadOnly { get; set; }
        public bool IsRequired { get; set; }
        public bool IsEncoded { get; set; }
        public bool IsFilterable { get; set; }
        public bool IsSortable { get; set; }
        public string MjrMnrChg { get; set; }
        public int Width { get; set; }
        public string Format { get; set; }
        public string LookupUrl { get; set; }
        public string LookupText { get; set; }
        public string LookupValue { get; set; }
        public string HeaderTemplate { get; set; }
        public string Template { get; set; }
        public string Editor { get; set; }
        public string AtrbGroup { get; set; }
        public int AtrbOrder { get; set; }
        public int Order { get; set; }
        public bool IsActive { get; set; }
    }
}