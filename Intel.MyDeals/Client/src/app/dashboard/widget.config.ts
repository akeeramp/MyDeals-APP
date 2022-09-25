export const configWidgets = [
    {
        id: '6',
        size: { x: 0, y: 0 },
        position: { rows: 1, cols: 1 },
        name: "New My Deals Contracts",
        desc: "Link to add a new contract",
        icon: "intelicon-tools",
        type: "newcontract",
        canChangeSettings: true,
        canRefresh: false,
        canAdd: true,
        isAdded: true,
        //to be changed when widget is created
        template: 'app/dashboard/widgets/newContract.html',
        subConfig: {},
        widgetConfig: {
            options: {},
            data: [],
            api: {}
        }
    },
    {
        id: '7',
        size: { x: 1, y: 0 },
        position: { rows: 2, cols: 2 },
        name: "Deal Desk",
        desc: "Quick view of status board",
        icon: "intelicon-grid",
        type: "contractstatus",
        canChangeSettings: true,
        canRefresh: true,
        canAdd: true,
        isAdded: true,
        template: 'Client/src/app/dashboard/dealDeskWidget/dealDeskWidget.component.html',
        widgetConfig: {},
        subConfig: {
            favContractIds: "",
            gridFilter: ""
        }
    },
    {
        id: '8',
        size: { x: 0, y: 1 },
        position: { rows: 1, cols: 1 },
        name: "Search My Deals Report(s)",
        desc: "Search for contracts, pricing strategies, or pricing tables by entering a name or id",
        icon: "intelicon-tools",
        type: "searchcontracts",
        canChangeSettings: true,
        canRefresh: false,
        canAdd: true,
        isAdded: true,
        //to be changed when widget is created
        template: 'app/dashboard/widgets/searchContract.html',
        subConfig: {},
        widgetConfig: {
            options: {},
            data: [],
            api: {}
        }
    },
    {
        id: '9',
        size: { x: 1, y: 2 },
        position: null,
        name: "Open Contracts By Id",
        desc: "Quickly Navigate to a contract by entering its Id",
        icon: "intelicon-tools",
        type: "opencontracts",
        canChangeSettings: true,
        canRefresh: false,
        canAdd: true,
        isAdded: true,
        //to be changed when widget is created
        template: 'Client/src/app/dashboard/opencontract/openContractWidget.component.html',
        subConfig: {},
        widgetConfig: {
            options: {},
            data: [],
            api: {}
        }
    },
    {
        id: '10',
        size: { x: 1, y: 0 },
        position: null,
        name: "Recent",
        desc: "Recently visited My deals contracts or deals",
        icon: "intelicon-time-outlined",
        type: "openrecents",
        canChangeSettings: true,
        canRefresh: false,
        canAdd: true,
        isAdded: true,
        //to be changed when widget is created
        template: 'Client/src/app/dashboard/recentURL/recentsUrlWidget.component.html',
        subConfig: {},
        widgetConfig: {
            options: {},
            data: [],
            api: {}
        }
    },
];

export const configLayouts = [
    {
        id: '1',
        name: 'Inputer',
        widgets: [
            {
                id: '6',
                defaultSize: { x: 0, y: 0 },
                defaultPosition: { row: 1, col: 1 }
            }, {
                id: '8',
                defaultSize: { x: 0, y: 0 },
                defaultPosition: { row: 1, col: 1 }
            }, {
                id: '7',
                defaultSize: { x: 0, y: 0 },
                defaultPosition: { row: 2, col: 2 }
            }
        ]
    },
    {
        id: '2',
        name: 'Approver',
        widgets: [
            {
                id: '7',
                defaultSize: { x: 13, y: 7 },
                defaultPosition: { row: 0, col: 5 }
            }, {
                id: '8',
                defaultSize: { x: 5, y: 4 },
                defaultPosition: { row: 0, col: 0 }
            }
        ]
    },
    {
        id: '3',
        name: 'Viewer',
        widgets: [
            {
                id: '7',
                defaultSize: { x: 13, y: 7 },
                defaultPosition: { row: 0, col: 5 }
            }, {
                id: '8',
                defaultSize: { x: 5, y: 4 },
                defaultPosition: { row: 0, col: 0 }
            }
        ]
    }

];
