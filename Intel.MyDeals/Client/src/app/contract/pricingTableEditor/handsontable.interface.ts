export const sheetObj = {
    0:"A",
    1:"B",
    2:"C",
    3:"D",
    4:"E",
    5:"F",
    6:"G",
    7:"H",
    8:"I",
    9:"J",
    10:"K",
    11:"L",
    12:"M",
    13:"N",
    14:"O",
    15:"P",
    16:"Q",
    17:"R",
    18:"S",
    19:"T",
    20:"U",
    21:"V",
    22:"W",
    23:"X",
    24:"Y",
    25:"Z",
    26:"AA",
    27:"AB",
    28:"AC",
    29:"AD",
    30:"AE",
    31:"AF",
    32:"AG",
    33:"AH",
    34:"AI",
    35:"AJ",
    36:"AK",
    37:"AL",
    38:"AM",
    39:"AN",
    40:"AO",
    41:"AP",
    42:"AQ",
    43:"AR",
    44:"AS"
}

// Pricing Table Template Response
export interface PRC_TBL_Model_Field {
    editable: boolean;  // Disable / Enable cell
    field: string;  // Field Name / Key Name
    format?: string;    // Formatting Style (i.e. integer, string, money) {0} string, {0:d} decimal number
    label: string;  // Display title / name
    nullable: boolean;  // Can be empty
    opLookupUrl?: string;   // Data API
    opLookupText?: string;  // variable from API response to use as text
    opLookupValue?: string;  // variable from API response to use as value
    uiType?: string;    // UI Element
    type: string;   // JS Type
    validMsg?: string;  // Validation messages attatched to attribute
    values?: string;    // Variable from row element to get value data
    valuesText?: string;    // Variable from row element to get value text
    valuesValue?: string;    // Variable from row element to get value data
}

export interface PRC_TBL_Model_Column {
    field: string;  // Field Name / Key Name
    title: string;  // Display title
    width: number;  // Cell width
    template?: string;  // CSS Template
    bypassExport: boolean;  // ??? (Potentially for export to XLS)
    hidden: boolean;    // Column should be hidden from view
    uiType?: string;    // UI Element Type (CSS Selector)
    isDimKey: boolean;  // Expects dimensionalized information from object key
    isRequired: boolean;    // Show `*` and cell needs to contain a value
    sortable: boolean;      // Allow sortable column type
    filterable: boolean;    // Add Filter option
    headerTemplate?: string;    // Header Column Title should be replaced with this HTML
    mjrMnrChg?: string; // ??? Defined type of change, may need to return with element
    lookupUrl?: string; // Lookup data API
    lookupText?: string;    // variable from API response to use as text
    lookupValue?: string;   // variable from API response to use as value
    locked: boolean;    // ??? Column does not scroll right
    lockable: boolean;  // ??? Column can be set to locked state
}

export interface PRC_TBL_Model_Attributes {
    value?: string;
    label: string;
    type: string;
    isRequired: boolean;
    isError: boolean;   // Failed with validation / error message
    isHidden: boolean;
    opLookupUrl?: string;   // Dropdown API Endpoint
    opLookupText?: string;  // Variable from API response
    opLookupValue?: string; // Variable from API response
    validMsg?: string;  // Validation messages attatched to attribute
    helpMsg?: string;   // Help popup text from attribute
}
export interface ProdCorrectObj {
    DCID:number,
    name:string,
    items:any[],
    indx:number
}
