using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Security.Permissions;
using Intel.Opaque;

namespace Intel.MyDeals.Entities
{
    public class UserSetting
    {
        public UserSetting()
        {
            SecurityMasks = new ObservableCollection<SecurityMask>();
            SecurityActions = new ObservableCollection<SecurityAction>();
            AllMyCustomers = new List<CustomerItem>();
            UserPreferences = new List<UserPreference>();
        }

        public OpUserToken UserToken { get; set; }
        public bool SuperSa { get; set; }

        public DateTime DashboardStartDate { get; set; }
        public DateTime DashboardEndDate { get; set; }

        public List<UserPreference> UserPreferences { get; set; }

        public ObservableCollection<SecurityMask> SecurityMasks { get; set; }

        public ObservableCollection<VerticalSecurityItem> VerticalSecurity { get; set; }

        public ObservableCollection<SecurityAction> SecurityActions { get; set; }

        public List<CustomerItem> AllMyCustomers { get; set; }

    }
}