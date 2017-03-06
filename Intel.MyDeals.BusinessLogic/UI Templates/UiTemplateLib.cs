using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class UiTemplateLib : IUiTemplateLib
    {
        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        public UiTemplateLib(DataCollectionsDataLib dataCollectionsDataLib)
        {
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

    }
}
