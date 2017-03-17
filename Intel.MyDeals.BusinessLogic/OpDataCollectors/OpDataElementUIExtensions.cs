using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public static class OpDataElementUiExtensions
    {
        public static OpDataElementAtrbTemplates GetDataCollectorTemplates()
        {
            return DataCollections.GetOpDataElementUiTemplates();
        }

        public static OpDataElementAtrbTemplate GetDataCollectorTemplate(string templateName)
        {
            OpDataElementAtrbTemplates templates = DataCollections.GetOpDataElementUiTemplates();
            return templates.ContainsKey(templateName) ? templates[templateName] : new OpDataElementAtrbTemplate();
        }

        public static OpDataElementAtrbTemplate GetAtrbTemplate(OpDataElementType opDataElementType, OpDataElementSetType opDataElementSetType)
        {
            OpDataElementAtrbTemplates templateSource = DataCollections.GetOpDataElementUiTemplates();
            string key = $"{opDataElementType}:{opDataElementSetType}";
            return !templateSource.ContainsKey(key) ? new OpDataElementAtrbTemplate() : templateSource[key];
        }

    }
}
