export interface TenderTransferRootObject {
    header: Header;
    recordDetails: RecordDetails;
}

export interface Header {
    xid: string;
    target_system: string;
    source_system: string;
    action: string;
}

export interface RecordDetails {
    quote: Quote;
}

export interface Quote {
    Id: string;
    FolioID: string;
    Name: string;
    FolioName: string;
    ProjectName: string;
    DealType: string;
    EndCustomer: string;
    EndCustomerCountry: string;
    UnifiedEndCustomerGlobalName: string;
    UnifiedEndCustomer: string;
    UnifiedEndCustomerId: string;
    UnifiedCountryEndCustomerId: string;
    IsUnifiedEndCustomer: boolean;
    ComplianceWatchList: string;
    account: Account;
    ShipmentStartDate: string;
    ShipmentEndDate: string;
    ServerDealType: string;
    quoteLine: QuoteLine[];
}

export interface Account {
    Id: string;
    Name: string;
    CustomerMappingId: string;
}

export interface QuoteLine {
    Id: string;
    Name: string;
    ReferenceQuoteLineNumber: string;
    Status: string;
    IntegrationStatus: string;
    EffectivePricingStartDate: string;
    Wwid: string;
    QuoteLineNumber: string;
    Region: string;
    EndCustomerRegion: string;
    DealDescription: string;
    GroupType: string;
    MarketSegment: string;
    CustomerDivision: string;
    product: Product;
    ProductType: string;
    competitorProduct: CompetitorProduct;
    OtherProduct: string;
    MeetCompPrice: string;
    ApprovedStartDate: string;
    ApprovedEndDate: string;
    BackdateReason: string;
    BillingStartDate: string;
    BillingEndDate: string;
    ConsumptionCustomerPlatform: string;
    ConsumptionCustomerSegment: string;
    ConsumptionRegion: string;
    ConsumptionCountry: string;
    ConsumptionReportedSalesGeo: string;
    ApprovedQuantity: string;
    ApprovedECAPPrice: string;
    AdditionalTandC: string;
    ExcludeAutomation: boolean;
    DealRFQStatus: string;
    DealRFQId: string;
    performanceMetric: PerformanceMetric[];
    ApprovedByInfo: string;
    errorMessages: ErrorMessages[]
}

export interface CompetitorProduct {
    Id: string;
    Name: string;
}

export interface PerformanceMetric {
    Id: string;
    Name: string;
    performanceMetric: string;
    IntelSKUPerformance: string;
    CompSKUPerformance: string;
    Weighting: string;
}

export interface ErrorMessages {
    Code: number;
    Message: string;
    MessageDetails: string;
}

export interface Product {
    Id: string;
    Name: string;
    ProductNameEPMID: string;
    ProductLevel: string;
    Family: string;
    DealProductName: string;
    ProcessorNumber: string;
    MaterialID: string;
}