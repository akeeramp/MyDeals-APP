namespace Intel.MyDeals.Entities
{
    public static class EN
    {
        public static class GLOBAL
        {
            public static int DEBUG = 0;
        }

        public static class VARIABLES
        {
            public static int NEW_UNIQ_ID = -1000;
            public const string PRIMARY_DIMKEY = "_____20___0";
        }

        public static class OPUSERTOKEN
        {
            public const string IS_SUPER = "IsSuper";
            public const string IS_DEVELOPER = "IsDeveloper";
            public const string IS_TESTER = "IsTester";

            public const string SUPER_LIST = "UI_SUPER_ADMINISTRATOR_LIST";
            public const string DEVELOPER_LIST = "UI_Developers_List";
            public const string TESTER_LIST = "UI_Testers_List";
            
        }

        public static class OBJDIM
        {
            public const string _MULTIDIM = "_MultiDim";
            public const string _PIVOTKEY = "_pivot";
            public const string PIVOT = "PIVOT";
            public const string TITLE = "TITLE";
        }


        public static class DEALFACTS
        {
            public const int FACT_15 = 15; // Product selection level
            public const int FACT_60 = 60; // Sub-vertical filter
            public const int FACT_72 = 72; // Exclusion filter
            public const int FACT_80 = 80; // Product category filter
            public const int FACT_128 = 128; // Media code filter
        }


        public class MESSAGES
        {
            public static readonly string CANNOT_MODIFY_PRODUCTS = "Cannot modify or remove products that already have a tracker number.  Refresh the screen to restore the original products.";

            public static readonly string BLIND_SEARCH = "No Blind Searches allowed.  Please fill in more information.";
            public static readonly string QUICK_SEARCH_SEARCHING = "Searching Deals (Quick Search)...";

            public static readonly string UNKNOWN_UNABLE_TO_PROCESS =
                "Unable to process this item for an unknown reason.";

            public static readonly string OVERRIDE_DEAL_COMMENT = "Deal was updated via the OverRide Tool.";
            public static readonly string NO_TRACKER_NUMBER = "No Tracker Number";
            public static readonly string NO_TRACKER_RANGE = "No Tracker Date Range";

            public static readonly string NO_PRODUCTS_FOR_CAP_BREAKOUT =
                "You must select a product to view CAP information.";

            public static readonly string ADD_PRODUCTS = "Add Products";
            public static readonly string LOADING_SNAPSHOT = "Loading SnapShot Data";
        }

        public class DC_MESSAGE_TYPES
        {
            public const string ACTION = "ACTION";
            public const string NON_ACTION = "";
            public const string WORKFLOW = "WORKFLOW";
        }


        public class STRINGFORMAT
        {
            public const string NONE = "{0}";
            public const string MONEY = "{0:c}";
            public const string INT = "{0:N0}";
            public const string INTMONEY = "{0:$0}";
            public const string DECIMAL = "{0:N2}";
            public const string DATE = "{0:d}";
            public const string DATETIME = "{0:G}";

        }


    }
}