using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IWorkFlowLib
    {
        //List<WorkFlowStg> GetWorkFlowStages();

        //List<WorkFlowStg> SetWorkFlowStages(CrudModes mode, WorkFlowStg data);

        List<WorkFlows> GetWorkFlowItems();        

        List<WorkFlows> SetWorkFlows(CrudModes mode, WorkFlows data);
        
    }
}
