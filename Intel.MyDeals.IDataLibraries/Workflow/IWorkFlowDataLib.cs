using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IWorkFlowDataLib
    {
        List<WorkFlows> GetWorkFlowItems();

        List<WorkFlows> SetWorkFlows(CrudModes mode, WorkFlows data);


        List<WorkFlowStg> SetWorkFlowStages(CrudModes mode, WorkFlowStg data);

        List<WorkFlowStg> GetWorkFlowStages();

        List<WorkFlowAttribute> GetDropDownValues();
    }
}
