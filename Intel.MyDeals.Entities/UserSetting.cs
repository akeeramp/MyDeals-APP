using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Intel.Opaque;

namespace Intel.MyDeals.Entities
{
    public class UserSetting
    {
        public UserSetting()
        {
            SecurityMasks = new ObservableCollection<SecurityMask>();
            SecurityActions = new ObservableCollection<SecurityAttribute>();
            AllMyCustomers = new MyCustomerDetailsWrapper();
            UserPreferences = new List<UserPreference>();
            VerticalSecurity = new ObservableCollection<VerticalSecurityItem>();
        }

        public OpUserToken UserToken { get; set; }
        public bool SuperSa { get; set; }

        public DateTime DashboardStartDate { get; set; }
        public DateTime DashboardEndDate { get; set; }

        public List<UserPreference> UserPreferences { get; set; }

        public ObservableCollection<SecurityMask> SecurityMasks { get; set; }

        public ObservableCollection<VerticalSecurityItem> VerticalSecurity { get; set; }

        public ObservableCollection<SecurityAttribute> SecurityActions { get; set; }

        public MyCustomerDetailsWrapper AllMyCustomers { get; set; }

    }
}