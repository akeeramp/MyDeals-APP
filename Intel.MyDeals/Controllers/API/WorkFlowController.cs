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
using Intel.MyDeals.Helpers;

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
        [Route("GetWorkFlowStages")]
        public IEnumerable<WorkFlowStg> GetWorkFlowStages()
        {
            return SafeExecutor(() => _workFlowLib.GetWorkFlowStages()
                , $"Unable to get {"Workflow Stages"}"
            );            
        }

        [Authorize]
        [HttpPost]
        [AntiForgeryValidate]
        [Route("SetWorkFlowStages")]
        public IEnumerable<WorkFlowStg> SetWorkFlowStages(WorkFlowStg data)
        {
            return SafeExecutor(() => _workFlowLib.SetWorkFlowStages(CrudModes.Insert, data)
                , $"Unable to get {"Workflow Stages"}"
            );       
            
        }

        [Authorize]
        [HttpPost]
        [AntiForgeryValidate]
        [Route("UpdateWorkFlowStages")]
        public IEnumerable<WorkFlowStg> UpdateWorkFlowStages(WorkFlowStg data)
        {
            return SafeExecutor(() => _workFlowLib.SetWorkFlowStages(CrudModes.Update, data)
                , $"Unable to get {"Workflow Stages"}"
            );            
            
        }

        [Authorize]
        [HttpPost]
        [AntiForgeryValidate]
        [Route("DeleteWorkFlowStages")]
        public IEnumerable<WorkFlowStg> DeleteWorkFlowStages(WorkFlowStg data)
        {
            return SafeExecutor(() => _workFlowLib.SetWorkFlowStages(CrudModes.Delete, data)
                , $"Unable to get {"Workflow Stages"}"
            );          
            
        }

        [Authorize]
        [Route("GetWFStgDDLValues")]
        public IEnumerable<WorkFlowAttribute> GetWFStgDDLValues()
        {
            return SafeExecutor(() => _workFlowLib.GetDropDownValues()
                , $"Unable to get {"Workflow Stage Dropdown Values"}"
            );

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
        [Route("GetDropDownValues")]
        public List<WorkFlowAttribute> GetDropDownValues()
        {
           return SafeExecutor(() => _workFlowLib.GetDropDownValues()
                , $"Unable to get {"Workflow"}"
            );
        }
        
        [Authorize]
        [Route("SetWorkFlows")]
        [HttpPost]
        [AntiForgeryValidate]
        public IEnumerable<WorkFlows> SetWorkFlows(WorkFlows data)
        {
            return SafeExecutor(() => _workFlowLib.SetWorkFlows(CrudModes.Insert, data)
                , $"Unable to get {"Workflow"}"
            );            
        }
        [Authorize]
        [Route("DeleteWorkflow")]
        [HttpPost]
        [AntiForgeryValidate]
        public IEnumerable<WorkFlows> DeleteWorkflow(WorkFlows data)
        {
            return SafeExecutor(() => _workFlowLib.SetWorkFlows(CrudModes.Delete, data)
                , $"Unable to get {"Workflow"}"
            );            
        }
        [Authorize]
        [Route("UpdateWorkflow")]
        [HttpPost]
        [AntiForgeryValidate]
        public IEnumerable<WorkFlows> UpdateWorkflow(WorkFlows data)
        {
            return SafeExecutor(() => _workFlowLib.SetWorkFlows(CrudModes.Update, data)
                , $"Unable to get {"Workflow"}"
            );
        }
    }
}
