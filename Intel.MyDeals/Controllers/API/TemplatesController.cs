using System.Web.Http;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Templates/v1")]
    public class TemplatesController : BaseApiController
    {
        private readonly IUiTemplateLib _uiTemplateLib;

        public TemplatesController(IUiTemplateLib uiTemplateLib)
        {
            _uiTemplateLib = uiTemplateLib;
        }

        [Authorize]
        [Route("GetTemplates")]
        public OpDataElementAtrbTemplates Get()
        {
            return SafeExecutor(OpDataElementUiExtensions.GetDataCollectorTemplates
                , "Unable to get templates"
            );
        }

        [Authorize]
        [Route("GetTemplates/{cd}")]
        public OpDataElementAtrbTemplate Get(string cd)
        {
            return SafeExecutor(() => OpDataElementUiExtensions.GetDataCollectorTemplate(cd)
                , "Unable to get templates"
            );
        }

        [Authorize]
        [Route("GetUiTemplates")]
        public UiTemplates GetUiTemplates()
        {
            return SafeExecutor(_uiTemplateLib.GetUiTemplates
                , "Unable to get templates"
            );
        }

        [Authorize]
        [Route("GetUiTemplates/{group}")]
        public UiTemplates GetUiTemplates(string group)
        {
            return SafeExecutor(() => _uiTemplateLib.GetUiTemplates(group)
                , "Unable to get templates"
            );
        }

        [Authorize]
        [Route("GetUiTemplates/{group}/{category}")]
        public UiTemplates GetUiTemplates(string group, string category)
        {
            return SafeExecutor(() => _uiTemplateLib.GetUiTemplates(group, category)
                , "Unable to get templates"
            );
        }

    }
}
