function widgetConfig() { }

widgetConfig.widgets = {};
widgetConfig.widgetLayouts = {};
widgetConfig.generator = null;
widgetConfig.objsetService = null;

widgetConfig.getAllWidgets = function (generator, objsetService) {
    widgetConfig.generator = generator;
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
        sizeX: 1,
        sizeY: 1,
        name: "New Contracts",
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

    widgetConfig.widgets["8"] = {
        sizeX: 1,
        sizeY: 1,
        name: "Find Contracts",
        desc: "Find a contract by entering the name or id",
        icon: "intelicon-tools",
        type: 'findContracts',
        hasConfig: true,
        template: 'app/dashboard/widgets/findContract.html',
        widgetConfig: {
            options: {},
            data: [],
            api: {}
        },
        resizeEvent: function (widget) {
        }
    };

    widgetConfig.widgets["7"] = {
        sizeX: 4,
        sizeY: 2,
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
                sizeX: 1,
                sizeY: 1
            }, {
                id: 7,
                sizeX: 5,
                sizeY: 2
            }, {
                id: 8,
                sizeX: 1,
                sizeY: 1
            }
        ]
    };

    widgetConfig.widgetLayouts["2"] = {
        id: '2',
        name: 'Approver',
        widgets: [
            {
                id: 8,
                sizeX: 1,
                sizeY: 1
            }, {
                id: 7,
                sizeX: 5,
                sizeY: 2
            }
        ]
    };

    widgetConfig.widgetLayouts["3"] = {
        id: '3',
        name: 'Viewer',
        widgets: [
            {
                id: 8,
                sizeX: 1,
                sizeY: 1
            }, {
                id: 7,
                sizeX: 5,
                sizeY: 2
            }
        ]
    };

}
