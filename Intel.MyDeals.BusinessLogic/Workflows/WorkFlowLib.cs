using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;
using System.Net;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class WorkFlowLib : IWorkFlowLib
    {
        private readonly IWorkFlowDataLib _WorkFlowCollectorLib;

        public WorkFlowLib(IWorkFlowDataLib workflowCollectorLib)
        {
            _WorkFlowCollectorLib = workflowCollectorLib;
        }     

        public List<WorkFlows> SetWorkFlows(CrudModes mode, WorkFlows data)
        {
            return _WorkFlowCollectorLib.SetWorkFlows(mode, data);                       
        }

        public List<WorkFlows> GetWorkFlowItems()
        {
            return _WorkFlowCollectorLib.GetWorkFlowItems();            
        }        
    }
}
