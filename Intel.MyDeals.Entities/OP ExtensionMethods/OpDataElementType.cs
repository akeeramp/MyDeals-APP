namespace Intel.Opaque.Data
{
    public enum OpDataElementType
    {
        /// <summary>
        /// Value not set (Order 0)
        /// </summary>
        Unknown = 0,

        /// <summary>
        /// Grouping of items (Workbook) (Order 10)
        /// </summary>
        Group = 10,

        /// <summary>
        /// Grouping of items (Contract) (Order 12)
        /// </summary>
        Contract = 12,

        /// <summary>
        /// Grouping of items (Pricing Strategy) (Order 15)
        /// </summary>
        PricingStrategy = 15,

        /// <summary>
        /// Grouping of items (Pricing Table) (Order 17)
        /// </summary>
        PricingTable = 17,

        /// <summary>
        /// Grouping of items (Draft Deals) (Order 19)
        /// </summary>
        WipDeals = 19,

        /// <summary>
        /// Tertiary item, like Product Line Item (PRD_LINE_ITM) (Order 20)
        /// </summary>
        Tertiary = 20,

        /// <summary>
        /// Secondary item, like Pre Deal (DEAL_PREP) (Order 30)
        /// </summary>
        Secondary = 30,

        /// <summary>
        /// Primary item, like "Real Deal" (DEAL) (Order 40)
        /// </summary>
        Deals = 40,


        /// <summary>
        /// Snapshot of a Primary Item (Order 50)
        /// </summary>
        Snapshot = 50,

        /// <summary>
        /// Old item that has been archived (Order 60)
        /// </summary>
        Archive = 60,

        /// <summary>
        /// Historical "Change" record (Order 70)
        /// </summary>
        History = 70

    }
}