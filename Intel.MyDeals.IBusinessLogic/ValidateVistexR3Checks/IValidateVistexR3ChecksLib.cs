using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IValidateVistexR3ChecksLib
    {
        ValidateVistexR3Wrapper ValidateVistexR3Checks(PushValidateVistexR3Data data);
    }
}