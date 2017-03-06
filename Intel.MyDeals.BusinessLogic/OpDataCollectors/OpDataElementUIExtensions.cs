using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public static class OpDataElementUiExtensions
    {
        public static OpDataElementUITemplates GetDataCollectorTemplates()
        {
            return DataCollections.GetOpDataElementUiTemplates();
        }

        public static OpDataElementUITemplate GetDataCollectorTemplate(string templateName)
        {
            OpDataElementUITemplates templates = DataCollections.GetOpDataElementUiTemplates();
            return templates.ContainsKey(templateName) ? templates[templateName] : new OpDataElementUITemplate();
        }

    }
}
