using Intel.MyDeals.Entities;

namespace Intel.Opaque.Data
{
    public class OpDataElementTypeMapping
    {
        public OpDataElementTypeMapping(OpDataElementType parentOpDataElementType, OpDataElementSetType parentOpDataElementSetType, 
            OpDataElementType childOpDataElementType, OpDataElementSetType childOpDataElementSetType, OpTranslationType translationType)
        {
            ParentOpDataElementType = parentOpDataElementType;
            ParentOpDataElementSetType = parentOpDataElementSetType;
            ChildOpDataElementType = childOpDataElementType;
            ChildOpDataElementSetType = childOpDataElementSetType;
            TranslationType = translationType;
        }

        public OpDataElementType ParentOpDataElementType { get; set; }
        public OpDataElementSetType ParentOpDataElementSetType { get; set; }
        public OpDataElementType ChildOpDataElementType { get; set; }
        public OpDataElementSetType ChildOpDataElementSetType { get; set; }

        public OpTranslationType TranslationType { get; set; }
    }

    public enum OpTranslationType
    {
        OneDealPerRow,
        OneDealPerProduct
    }
}