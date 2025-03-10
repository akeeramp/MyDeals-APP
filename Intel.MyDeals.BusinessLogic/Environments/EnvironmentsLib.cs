using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibraries;

namespace Intel.MyDeals.BusinessLogic
{
    public class EnvironmentsLib : IEnvironmentsLib
    {
        /// <summary>
        /// Constants lookup Data library
        /// </summary>
        private readonly IEnvironmentsDataLib _environmentsDataLib;

        /// <summary>
        /// DataCollection Data Library, wrapper methods to access static cache
        /// </summary>
        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        private readonly INotificationsLib _notificationsLib;

        public EnvironmentsLib(IEnvironmentsDataLib environmentsDataLib,
            IDataCollectionsDataLib dataCollectionsDataLib, INotificationsLib notificationsLib)
        {
            _environmentsDataLib = environmentsDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
            _notificationsLib = notificationsLib;
        }

        public List<AdminEnvironments> GetEnvDetails()
        {
            return _environmentsDataLib.GetEnvDetails();
        }

        public AdminEnvironments CreateEnvDetails(AdminEnvironments data)
        {
            return _environmentsDataLib.SetEnvDetails(CrudModes.Insert, data);
        }

        public AdminEnvironments UpdateEnvDetails(AdminEnvironments data)
        {
            var result = _environmentsDataLib.SetEnvDetails(CrudModes.Update, data);            
            return result;
        }

        public AdminEnvironments DeleteEnvDetails(AdminEnvironments data)
        {
            if (data == null) return null;

            // In proc delete operation requires only SID, if we pass CNST_NM, operation fails
            var adminConstant = new AdminEnvironments { ENVT_SID = data.ENVT_SID };
            return _environmentsDataLib.SetEnvDetails(CrudModes.Delete, adminConstant);
        }

        public AdminServerDetails CreateServerDetails(AdminServerDetails data)
        {
            return _environmentsDataLib.SetServerDetails(CrudModes.Insert, data);
        }

        public AdminServerDetails UpdateServerDetails(AdminServerDetails data)
        {
            var result = _environmentsDataLib.SetServerDetails(CrudModes.Update, data); 
            return result;
        }

        public AdminServerDetails DeleteServerDetails(AdminServerDetails data)
        {
            if (data == null) return null;

            // In proc delete operation requires only SID, if we pass CNST_NM, operation fails
            var adminConstant = new AdminServerDetails { LNKD_SRVR_NM = data.LNKD_SRVR_NM };
            return _environmentsDataLib.SetServerDetails(CrudModes.Delete, adminConstant);
        }

        public List<AdminServerDetails> GetServerDetails()
        {
            return _environmentsDataLib.GetServerDetails();
        }

    }
}
