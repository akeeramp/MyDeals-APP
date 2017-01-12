using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class UiTemplateLib : IUiTemplateLib
    {
        private readonly IUiTemplateDataLib _uiTemplateDataLib;
        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        public UiTemplateLib(IUiTemplateDataLib uiTemplateDataLib, DataCollectionsDataLib dataCollectionsDataLib)
        {
            _uiTemplateDataLib = uiTemplateDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
        }

        public UiTemplates GetUiTemplates()
        {
            return _dataCollectionsDataLib.GetUiTemplates();
        }
        public UiTemplates GetUiTemplates(string group)
        {
            return _dataCollectionsDataLib.GetUiTemplates();
        }
        public UiTemplates GetUiTemplates(string group, string category)
        {
            return _dataCollectionsDataLib.GetUiTemplates();
        }

        public UiModelTemplate GetUiTemplate(string group, string category, string subcategory)
        {
            return new UiModelTemplate();
            //UiTemplates templates = GetUiTemplates();
            //templates.
            //if (!templates.ContainsKey(group)) return new UiModelTemplate();
            //if (!templates[group].ContainsKey(category)) return new UiModelTemplate();
            //if (!templates.ContainsKey(subcategory)) return new UiModelTemplate();
            //return templates[group][category][subcategory];
        }
    }
}
