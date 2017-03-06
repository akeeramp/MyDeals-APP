using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class WorkFlowLib : IWorkFlowLib
    {
        private readonly IWorkFlowDataLib _workFlowCollectorLib;

        public WorkFlowLib(IWorkFlowDataLib workflowCollectorLib)
        {
            _workFlowCollectorLib = workflowCollectorLib;
        }

        /// <summary>
        /// Get All Work Flow Stage
        /// </summary>
        /// <returns>List of all work flow stage</returns>
        public List<WorkFlowStg> GetWorkFlowStages()
        {
            // TODO :Later need to decide caching will be apply or not
            return _workFlowCollectorLib.GetWorkFlowStages();
        }

        /// <summary>
        /// This method will be used to Insert,Update and Delete the workflow stage
        /// </summary>
        /// <param name="mode" type="CrudModes">Mode of the operation like Insert,Update or Delete</param>
        /// <param name="data" type="WorkFlowStg">Requested values of Workflow stage </param>
        /// <returns>List of affected rows</returns>
        public List<WorkFlowStg> SetWorkFlowStages(CrudModes mode, WorkFlowStg data)
        {
            return _workFlowCollectorLib.SetWorkFlowStages(mode, data);
        }

        public List<WorkFlows> SetWorkFlows(CrudModes mode, WorkFlows data)
        {
            return _workFlowCollectorLib.SetWorkFlows(mode, data);                       
        }

        public List<WorkFlowAttribute> GetDropDownValues()
        {
            return _workFlowCollectorLib.GetDropDownValues();
        }

        public List<WorkFlows> GetWorkFlowItems()
        {
            return _workFlowCollectorLib.GetWorkFlowItems();            
        }     
              
    }
}
