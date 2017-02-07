using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;
using System.Net;
using System.Text;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/WorkFlow")]
    public class WorkFlowController : BaseApiController
    {
        private readonly IWorkFlowLib _workFlowLib;
        public WorkFlowController(IWorkFlowLib workflowLib)
        {
            _workFlowLib = workflowLib;
        }

        [Authorize]
        [Route("GetWorkFlowItems")]
        public IEnumerable<WorkFlows> GetWorkFlowItems()
        {
            return SafeExecutor(() => _workFlowLib.GetWorkFlowItems()
                , $"Unable to get {"Workflow"}"
            );
        }

        [Authorize]
        [Route("SetWorkFlows")]
        [HttpPost]
        public IEnumerable<WorkFlows> SetWorkFlows(WorkFlows data)
        {
            return SafeExecutor(() => _workFlowLib.SetWorkFlows(CrudModes.Insert, data)
                , $"Unable to get {"Workflow"}"
            );            
        }
        [Authorize]
        [Route("DeleteWorkflow")]
        [HttpPost]
        public IEnumerable<WorkFlows> DeleteWorkflow(WorkFlows data)
        {
            return SafeExecutor(() => _workFlowLib.SetWorkFlows(CrudModes.Delete, data)
                , $"Unable to get {"Workflow"}"
            );            
        }
        [Authorize]
        [Route("UpdateWorkflow")]
        [HttpPost]
        public IEnumerable<WorkFlows> UpdateWorkflow(WorkFlows data)
        {
            return SafeExecutor(() => _workFlowLib.SetWorkFlows(CrudModes.Update, data)
                , $"Unable to get {"Workflow"}"
            );
        }

    }
}
