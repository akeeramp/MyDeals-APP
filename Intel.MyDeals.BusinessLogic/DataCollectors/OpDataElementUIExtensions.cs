using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public static class OpDataElementUIExtensions
    {
        //public static OpDataCollector GetDataCollectorFromTemplate(OpDataElementType opDataElementType, int id, int parentId)
        //{
        //    return GetOpDataElementUITemplate(opDataElementType).CopyToOpDataCollector(id, parentId);
        //}

        //public static OpDataElementUITemplate GetOpDataElementUITemplate(OpDataElementType opDataElementType)
        //{
        //    OpDataElementUITemplates ourTemplates = DataCollections.GetOpDataElementUITemplates();
        //    string key = opDataElementType.ToString();

        //    // TODO need to be consistent on naming these !!!
        //    if (opDataElementType == OpDataElementType.PricingTable) key = "PRICING TABLE";
        //    if (opDataElementType == OpDataElementType.PricingStrategy) key = "PRICING STRAT";

        //    return ourTemplates.ContainsKey(key.ToUpper())
        //        ? ourTemplates[key.ToUpper()]
        //        : new OpDataElementUITemplate();
        //}

        public static OpDataElementUITemplates GetDataCollectorTemplates()
        {
            return DataCollections.GetOpDataElementUITemplates();
        }

        public static OpDataElementUITemplate GetDataCollectorTemplate(string templateName)
        {
            OpDataElementUITemplates templates = DataCollections.GetOpDataElementUITemplates();
            return templates.ContainsKey(templateName) ? templates[templateName] : new OpDataElementUITemplate();
        }

    }
}
