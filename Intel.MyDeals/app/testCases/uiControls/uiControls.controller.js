angular.module('app.testCases')
    .controller('uiControlsController', function ($uibModal, $scope) {

        var gTools = new gridTools(
            {
                "_pivot": { type: "object" },
                "_behaviors": { type: "object" },
                "_MultiDim": { type: "object" },

                "dc_id": {
                    editable: false,
                    nullable: true
                },
                "TEXT": { type: "string" },
                "INT": { type: "number" },
                "DATE": { type: "date" },
                "DROPDOWN": {
                    type: "string",
                    values: "/api/Lookups/v1/GetLookups/DROPDOWN",
                    valuesText: "DROP_DOWN",
                    valuesValue: "DROP_DOWN"
                },
                "COMBOBOX": {
                    type: "string",
                    values: "/api/Lookups/v1/GetLookups/COMBOBOX",
                    valuesText: "DROP_DOWN",
                    valuesValue: "DROP_DOWN"
                }
            },
            [
                {
                    field: "_dirty",
                    title: "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                    width: "16px",
                    template: "#=gridUtils.uiIconWrapper(data, '_dirty')#"
                }, {
                    field: "TEXT",
                    title: "Text",
                    template: "#=gridUtils.uiControlWrapper(data, 'TEXT')#"
                }, {
                    field: "INT",
                    title: "Int",
                    template: "#=gridUtils.uiControlWrapper(data, 'INT')#"
                }, {
                    field: "DATE",
                    title: "Date",
                    template: "#=gridUtils.uiControlWrapper(data, 'DATE', \"date:'MM/dd/yyyy'\")#"
                }, {
                    field: "DROPDOWN",
                    title: "Dropdown",
                    uiType: "DropDown",
                    template: "#=gridUtils.uiControlWrapper(data, 'DROPDOWN')#",
                    editor: gridUtils.lookupEditor
                }, {
                    field: "COMBOBOX",
                    title: "Combobox",
                    uiType: "ComboBox",
                    template: "#=gridUtils.uiControlWrapper(data, 'COMBOBOX')#",
                    editor: gridUtils.lookupEditor
                }, {
                    field: "",
                    title: "&nbsp;"
                }
            ]);


        // Functions

        $scope.init = function () {
            $scope.clkIsHidden(false);
            $scope.clkIsReadOnly(false);
            $scope.clkIsRequired(false);
            $scope.clkIsError(false);
            $scope.clkIsSaved(false);
            $scope.clkIsDirty(false);
            //debugger;
        }

        $scope.clkIsBase = function ($event, field) {

            // des
            $scope.des._dirty = $event;
            angular.forEach($scope.des,
                function (item) {
                    item[field] = $event;
                });

            // flat
            $scope.flat._dirty = $event;
            angular.forEach($scope.flat,
                function (value, key) {
                    if ($scope.flat._behaviors[field] === undefined) $scope.flat._behaviors[field] = {};
                    $scope.flat._behaviors[field][key] = $event;
                });

            // flatGrid
            if ($scope.flatGrid !== undefined) {
                //debugger;
                for (var i = 0; i < $scope.flatGrid.length; i++) {
                    $scope.flatGrid[i]._dirty = $event;
                    angular.forEach($scope.flatGrid[i],
                        function (value, key) {
                            var item = $scope.flatGrid[i];
                            if (item._behaviors[field] === undefined) item._behaviors[field] = {};
                            item._behaviors[field][key] = $event;
                            //_MultiDim
                            for (var ii = 0; ii < item._MultiDim.length; ii++) {
                                item._MultiDim[ii]._dirty = $event;
                                angular.forEach(item._MultiDim[ii],
                                    function (v1, k1) {
                                        var item2 = item._MultiDim[ii];
                                        if (item2._behaviors === undefined || item2._behaviors === null) item2._behaviors = {};
                                        if (item2._behaviors[field] === undefined || item2._behaviors[field] === null) item2._behaviors[field] = {};
                                        item2._behaviors[field][k1] = $event;
                                    });
                            }
                        });
                }
                //debugger;
            }
            //debugger;
        }
        $scope.clkIsHidden = function ($event) {
            $scope.clkIsBase($event, "isHidden");
        }
        $scope.clkIsReadOnly = function ($event) {
            $scope.clkIsBase($event, "isReadOnly");
        }
        $scope.clkIsRequired = function ($event) {
            $scope.clkIsBase($event, "isRequired");
        }
        $scope.clkIsError = function ($event) {
            $scope.clkIsBase($event, "isError");
        }
        $scope.clkIsSaved = function ($event) {
            $scope.clkIsBase($event, "isSaved");
        }
        $scope.clkIsDirty = function ($event) {
            $scope.clkIsBase($event, "isDirty");
        }

        // Variables
        $scope.isReadOnly = false;
        $scope.isRequired = false;
        $scope.isHidden = false;
        $scope.isError = false;
        $scope.isSaved = false;
        $scope.isDirty = false;

        $scope.loadData = function () {

            $scope.des = {
                "_dirty": false,
                "TEXT": {
                    "value": "Hello World",
                    isReadOnly: false,
                    isRequired: false,
                    isHidden: false,
                    isError: false,
                    isDirty: false,
                    validMsg: "Please enter a valid value."
                },
                "INT": {
                    "value": 123,
                    isReadOnly: false,
                    isRequired: false,
                    isHidden: false,
                    isError: false,
                    isDirty: false,
                    validMsg: "Please enter a valid value."
                },
                "DATE": {
                    "value": "2/4/2016",
                    isReadOnly: false,
                    isRequired: false,
                    isHidden: false,
                    isError: false,
                    isDirty: false,
                    validMsg: "Please enter a valid value."
                },
                "DROPDOWN": {
                    "value": "DROPDOWN 3",
                    isReadOnly: false,
                    isRequired: false,
                    isHidden: false,
                    isError: false,
                    isDirty: false,
                    validMsg: "Please enter a valid value."
                },
                "COMBOBOX": {
                    "value": "COMBOBOX 4",
                    isReadOnly: false,
                    isRequired: false,
                    isHidden: false,
                    isError: false,
                    isDirty: false,
                    validMsg: "Please enter a valid value."
                }
            }
            $scope.flat = {
                "_dirty": false,
                "dc_id": 1,
                "TEXT": "Hello World",
                "INT": 123,
                "DATE": "2/4/2016",
                "DROPDOWN": "DROPDOWN 2",
                "COMBOBOX": "COMBOBOX 3",
                "_MultiDim": [
                    {
                        "PIVOT": -1,
                        "TITLE": "Kit",
                        "TEXT": "Hello World 1",
                        "INT": 1231,
                        "DATE": "2/1/2016",
                        "DROPDOWN": "DROPDOWN 3",
                        "COMBOBOX": "COMBOBOX 5"
                    },
                    {
                        "PIVOT": 0,
                        "TITLE": "Primary",
                        "TEXT": "Hello World 2",
                        "INT": 1232,
                        "DATE": "2/2/2016",
                        "DROPDOWN": "DROPDOWN 3",
                        "COMBOBOX": "COMBOBOX 5"
                    },
                    {
                        "PIVOT": 1,
                        "TITLE": "Secondary 1",
                        "TEXT": "Hello World 3",
                        "INT": 1233,
                        "DATE": "2/3/2016",
                        "DROPDOWN": "DROPDOWN 3",
                        "COMBOBOX": "COMBOBOX 5"
                    }
                ],
                "_pivot": {
                    "_MultiDim": {
                        "Kit": "-1",
                        "Primary": "0",
                        "Secondary 1": "1",
                        "Secondary 2": "2"
                    }
                },
                "_behaviors": {
                    "isRequired": {},
                    "isReadOnly": {},
                    "isHidden": {},
                    "isSaved": {},
                    "isError": {},
                    "isDirty": {},
                    "validMsg": {
                        "TEXT": "That did not work"
                    }
                }
            };
            $scope.flatGrid = [
                {
                    "_dirty": false,
                    "dc_id": 1,
                    "TEXT": "Hello World 1",
                    "INT": 123,
                    "DATE": "2/4/2016",
                    "DROPDOWN": "DROPDOWN 3",
                    "COMBOBOX": "COMBOBOX 5",
                    "_MultiDim": [
                        {
                            "dc_id": -300,
                            "PIVOT": -1,
                            "TITLE": "Kit",
                            "TEXT": "Hello World 1",
                            "INT": 1231,
                            "DATE": "2/1/2016",
                            "DROPDOWN": "DROPDOWN 3",
                            "COMBOBOX": "COMBOBOX 5",
                            "_behaviors": {
                                "isRequired": {},
                                "isReadOnly": {},
                                "isHidden": {},
                                "isSaved": {},
                                "isError": {},
                                "isDirty": {},
                                "validMsg": {
                                    "TEXT": "That did not work"
                                }
                            }
                        },
                        {
                            "dc_id": -301,
                            "PIVOT": 0,
                            "TITLE": "Primary",
                            "TEXT": "Hello World 2",
                            "INT": 1232,
                            "DATE": "2/2/2016",
                            "DROPDOWN": "DROPDOWN 2",
                            "COMBOBOX": "COMBOBOX 2"
                        },
                        {
                            "dc_id": -302,
                            "PIVOT": 1,
                            "TITLE": "Secondary 1",
                            "TEXT": "Hello World 3",
                            "INT": 1233,
                            "DATE": "2/3/2016",
                            "DROPDOWN": "DROPDOWN 2",
                            "COMBOBOX": "COMBOBOX 3"
                        }
                    ],
                    "_pivot": {
                        "_MultiDim": {
                            "Kit": "-1",
                            "Primary": "0",
                            "Secondary 1": "1",
                            "Secondary 2": "2"
                        }
                    },
                    "_behaviors": {
                        "isRequired": {},
                        "isReadOnly": {},
                        "isHidden": {},
                        "isSaved": {},
                        "isError": {},
                        "isDirty": {},
                        "validMsg": {
                            "TEXT": "That did not work"
                        }
                    }
                },
                {
                    "_dirty": false,
                    "dc_id": 2,
                    "TEXT": "Hello World 2",
                    "INT": 124,
                    "DATE": "2/4/2016",
                    "DROPDOWN": "DROPDOWN 3",
                    "COMBOBOX": "COMBOBOX 3",
                    "_MultiDim": [
                        {
                            "dc_id": -304,
                            "PIVOT": -1,
                            "TITLE": "Kit",
                            "TEXT": "Hello World 1",
                            "INT": 1231,
                            "DATE": "2/1/2016",
                            "DROPDOWN": "DROPDOWN 3",
                            "COMBOBOX": "COMBOBOX 4"
                        },
                        {
                            "dc_id": -305,
                            "PIVOT": 0,
                            "TITLE": "Primary",
                            "TEXT": "Hello World 2",
                            "INT": 1232,
                            "DATE": "2/2/2016",
                            "DROPDOWN": "DROPDOWN 1",
                            "COMBOBOX": "COMBOBOX 5"
                        },
                        {
                            "dc_id": -306,
                            "PIVOT": 1,
                            "TITLE": "Secondary 1",
                            "TEXT": "Hello World 3",
                            "INT": 1233,
                            "DATE": "2/3/2016",
                            "DROPDOWN": "DROPDOWN 2",
                            "COMBOBOX": "COMBOBOX 2"
                        }
                    ],
                    "_pivot": {
                        "_MultiDim": {
                            "Kit": "-1",
                            "Primary": "0",
                            "Secondary 1": "1",
                            "Secondary 2": "2"
                        }
                    },
                    "_behaviors": {
                        "isRequired": {},
                        "isReadOnly": {},
                        "isHidden": {},
                        "isSaved": {},
                        "isError": {},
                        "isDirty": {},
                        "validMsg": {
                            "TEXT": "That did not work"
                        }
                    }
                }
            ];

            $scope.mainGridOptions = {
                dataSource: gTools.createDataSource($scope.flatGrid),
                columns: gTools.cols,
                scrollable: false,
                sortable: true,
                editable: true,
                navigatable: true,
                filterable: true,
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: true,
                save: gTools.saveCell
            };

            $scope.detailGridOptions = function (dataItem, pivotName) {

                var gt = new gridTools(
                {
                    "_behaviors": { type: "object" },
                    "dc_id": { editable: false, nullable: true },
                    "PIVOT": { type: "object" },
                    "TITLE": { type: "string" },
                    "TEXT": { type: "string" },
                    "INT": { type: "number" },
                    "DATE": { type: "date" },
                    "DROPDOWN": {
                        type: "string",
                        values: "/api/Lookups/v1/GetLookups/DROPDOWN",
                        valuesText: "DROP_DOWN",
                        valuesValue: "DROP_DOWN"
                    },
                    "COMBOBOX": {
                        type: "string",
                        values: "/api/Lookups/v1/GetLookups/COMBOBOX",
                        valuesText: "DROP_DOWN",
                        valuesValue: "DROP_DOWN"
                    }
                },
                [
                    {
                        field: "_dirty",
                        title: "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                        width: "30px",
                        template: "#=gridUtils.uiIconWrapper(data, '_dirty')#"
                    }, {
                        field: "PIVOT", title: "PIVOT"
                    },{
                        field: "TITLE", title: "TITLE"
                    },{
                        field: "TEXT", title: "TEXT2",
                        template: "#=gridUtils.uiControlWrapper(data, 'TEXT')#"
                    },{
                        field: "INT", title: "INT",
                        template: "#=gridUtils.uiControlWrapper(data, 'INT')#"
                    },{
                        field: "DATE", title: "DATE",
                        template: "#=gridUtils.uiControlWrapper(data, 'DATE', \"date:'MM/dd/yyyy'\")#"
                    }, {
                        field: "DROPDOWN",
                        title: "Dropdown",
                        uiType: "DropDown",
                        template: "#=gridUtils.uiControlWrapper(data, 'DROPDOWN')#",
                        editor: gridUtils.lookupEditor
                    }, {
                        field: "COMBOBOX",
                        title: "Combobox",
                        uiType: "ComboBox",
                        template: "#=gridUtils.uiControlWrapper(data, 'COMBOBOX')#",
                        editor: gridUtils.lookupEditor
                    }, {
                        field: "",
                        title: "&nbsp;"
                    }
                ]);

                var idIndx = $scope.flatGrid.indexOfField("dc_id", dataItem["dc_id"]);
                var src = $scope.flatGrid[idIndx][pivotName];

                return {
                    dataSource: gt.createDataSource(src),
                    columns: gt.cols,
                    sortable: true,
                    editable: true,
                    resizable: true,
                    reorderable: true,
                    save: gTools.saveCell
                };
            };

        };

        $scope.loadData();
    });




