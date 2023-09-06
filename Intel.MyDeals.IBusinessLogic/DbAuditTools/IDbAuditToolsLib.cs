using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDbAuditToolsLib
    {
        string GetDbAuditData(string _mode);

        string RunDbAudit(string _mode, string _jsonData);

        string GetDbAuditObjectText(string _mode, string _jsonData);

    }
}
