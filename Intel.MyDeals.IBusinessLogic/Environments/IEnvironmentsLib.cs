using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IEnvironmentsLib
    {
        List<AdminEnvironments> GetEnvDetails();

        AdminEnvironments CreateEnvDetails(AdminEnvironments data);

        AdminEnvironments UpdateEnvDetails(AdminEnvironments data);

        AdminEnvironments DeleteEnvDetails(AdminEnvironments data);

        AdminServerDetails CreateServerDetails(AdminServerDetails data);

        AdminServerDetails UpdateServerDetails(AdminServerDetails data);

        AdminServerDetails DeleteServerDetails(AdminServerDetails data);

        List<AdminServerDetails> GetServerDetails();

    }

}
