using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IWorkflowsLib
    {
        List<WorkFlowStg> GetWorkFlowStages();
        List<WorkFlowStg> SetWorkFlowStages(string mode, WorkFlowStg data);
    }
}
