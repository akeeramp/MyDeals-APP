using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public interface IUiTemplateLib
    {
        UiTemplates GetUiTemplates();
        UiTemplates GetUiTemplates(string group);
        UiTemplates GetUiTemplates(string group, string category);
        UiModelTemplate GetUiTemplate(string group, string category, string subcategory);
    }
}