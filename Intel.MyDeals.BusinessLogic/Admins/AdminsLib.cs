using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinesssLogic
{
    public class AdminsLib
    {
        public List<GetSecurityAdminInfo> GetAdminToolSecurity()
        {
            return new AdminDataLib().GetAdminToolSecurity();
        }

 
        #region Dropdowns
        public List<AdminBasicDropdowns> GetAdminBasicDropdowns()
        {
            return new AdminDataLib().GetAdminBasicDropdowns();
        }

        public AdminBasicDropdowns SetAdminBasicDropdowns(string mode, AdminBasicDropdowns adminValues)
        {
            return new AdminDataLib().SetAdminBasicDropdowns(mode, adminValues);
        }
        #endregion

        #region Customers
        public List<AdminCustomerHeaders> GetAdminCustomerHeaders()
        {
            return new AdminDataLib().GetAdminCustomerHeaders();
        }

        public CustomerDetailWrapper GetAdminCustomerDetails(int custId)
        {
            return new AdminDataLib().GetAdminCustomerDetails(custId);
        }

        #endregion

        #region AdminQuoteLetter

        /// <summary>
        /// Performs get operation on data and returns Menu and Deals information
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="dealType"></param>
        /// <param name="dealSubType"></param>
        /// <param name="content0"></param>
        /// <param name="content1"></param>
        /// <returns></returns>
        public List<ManageQuote> ManageQuoteFromReader(string mode, string dealType, string dealSubType, string content0, string content1)
        {
            return new AdminDataLib().ManageQuoteFromReader(mode, dealType, dealSubType, content0, content1);
        }

        /// <summary>
        /// Updates data to db
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="obManageQuote"></param>
        /// <returns></returns>
        public ManageQuote SetQuoteLetter(string mode, ManageQuote obManageQuote)
        {
            return new AdminDataLib().SetQuoteLetter(mode, obManageQuote);
        }

        #endregion

    }
}
