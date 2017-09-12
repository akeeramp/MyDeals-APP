function widgetConfig() { }

widgetConfig.widgets = {};
widgetConfig.widgetLayouts = {};
widgetConfig.objsetService = null;

widgetConfig.getAllWidgets = function (objsetService) {
    widgetConfig.objsetService = objsetService;
    widgetConfig.configWidgets();

    var w = {};
    angular.forEach(widgetConfig.widgets, function(value, key) {
        this[key] = widgetConfig.widgets[key];
    }, w);

    return w;
}

widgetConfig.configWidgets = function () {

    widgetConfig.widgets["6"] = {
        id: '6',
        size: { x: 5, y: 2 },
        position: { row: 0, col: 0 },
        name: "New MyDeals Contracts",
        desc: "Link to add a new contract",
        icon: "intelicon-tools",
        type: 'newContract',
        hasConfig: true,
        template: 'app/dashboard/widgets/newContract.html',
        widgetConfig: {
            options: {},
            data: [],
            api: {}
        },
        resizeEvent: function (widget) {
        }
    };

    widgetConfig.widgets["7"] = {
        id: '7',
        size: { x: 13, y: 8 },
        position: { row: 0, col: 0 },
        name: "Contract Status",
        desc: "Quick view of status board",
        icon: "intelicon-grid",
        type: 'contractStatusBoard',
        hasConfig: true,
        template: 'app/dashboard/widgets/contractStatusBoard.html',
        widgetConfig: {},
        resizeEvent: function (widget) {
            var grid = $("#gridContractStatus");
            grid.data("kendoGrid").resize();
        },
        refreshEvent: function (widget) {
            var grid = $("#gridContractStatus");
            grid.data("kendoGrid").resize();
        }
    };

    widgetConfig.widgets["8"] = {
        id: '8',
        size: { x: 5, y: 2 },
        position: { row: 0, col: 0 },
        name: "Search MyDeals Contracts",
        desc: "Search for contracts, pricing strategies, or pricing tables by entering a name or id",
        icon: "intelicon-tools",
        type: 'searchContracts',
        hasConfig: true,
        template: 'app/dashboard/widgets/searchContract.html',
        widgetConfig: {
            options: {},
            data: [],
            api: {}
        },
        refreshEvent: function (widget) {
            setTimeout(function () {
                $("#bynResetSearch").click();
            }, 1000);
        },
        resizeEvent: function (widget) {
        }
    };

    widgetConfig.widgets["9"] = {
        id: '9',
        size: { x: 5, y: 3 },
        position: { row: 0, col: 0 },
        name: "Open Contracts By Id",
        desc: "Quickly Navigate to a contract by entering its Id",
        icon: "intelicon-tools",
        type: 'openContracts',
        hasConfig: true,
        template: 'app/dashboard/widgets/openContract.html',
        widgetConfig: {
            options: {},
            data: [],
            api: {}
        },
        resizeEvent: function (widget) {
        }
    };

}

widgetConfig.getAllWidgetLayouts = function () {
    widgetConfig.configLayouts();

    var w = {};
    angular.forEach(widgetConfig.widgetLayouts, function (value, key) {
        this[key] = widgetConfig.widgetLayouts[key];
    }, w);

    return w;
}

widgetConfig.configLayouts = function () {

    widgetConfig.widgetLayouts["1"] = {
        id: '1',
        name: 'Inputer',
        widgets: [
            {
                id: 6,
                defaultSize: { x: 5, y: 2 },
                defaultPosition: { row: 2, col: 0 }
            }, {
                id: 7,
                defaultSize: { x: 13, y: 8 },
                defaultPosition: { row: 0, col: 5 }
            }, {
                id: 8,
                defaultSize: { x: 5, y: 2 },
                defaultPosition: { row: 0, col: 0 }
            }
        ]
    };

    widgetConfig.widgetLayouts["2"] = {
        id: '2',
        name: 'Approver',
        widgets: [
            {
                id: 7,
                defaultSize: { x: 13, y: 8 },
                defaultPosition: { row: 0, col: 5 }
            }, {
                id: 8,
                defaultSize: { x: 5, y: 2 },
                defaultPosition: { row: 0, col: 0 }
            }
        ]
    };

    widgetConfig.widgetLayouts["3"] = {
        id: '3',
        name: 'Viewer',
        widgets: [
            {
                id: 7,
                defaultSize: { x: 13, y: 8 },
                defaultPosition: { row: 0, col: 5 }
            }, {
                id: 8,
                defaultSize: { x: 5, y: 2 },
                defaultPosition: { row: 0, col: 0 }
            }
        ]
    };

}
