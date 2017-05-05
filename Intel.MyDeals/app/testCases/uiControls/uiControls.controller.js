(function () {
    'use strict';

    angular.module('app.testCases')
        .controller('uiControlsController', uiControlsController);

    uiControlsController.$inject = ['$uibModal', '$scope'];

    function uiControlsController($uibModal, $scope) {
        var gTools = new gridTools(
            {
                "id": "",
                "fields": {
                    "_pivot": { type: "object" },
                    "_behaviors": { type: "object" },
                    "_MultiDim": { type: "object" },

                    "DC_ID": {
                        editable: false,
                        nullable: true
                    },
                    "TEXT": { type: "string" },
                    "INT": { type: "number" },
                    "DATE": { type: "date" },
                    "DROPDOWN": {
                        type: "string",
                        values: "/api/Dropdown/GetDropdowns/MRKT_SEG_NON_CORP",
                        valuesText: "DROP_DOWN",
                        valuesValue: "DROP_DOWN"
                    },
                    "COMBOBOX": {
                        type: "string",
                        values: "/api/Dropdown/GetDropdowns/MRKT_SEG_NON_CORP",
                        valuesText: "DROP_DOWN",
                        valuesValue: "DROP_DOWN"
                    }
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
                    template: "#=gridUtils.uiControlWrapper(data, 'MRKT_SEG_NON_CORP')#",
                    editor: gridUtils.lookupEditor
                }, {
                    field: "COMBOBOX",
                    title: "Combobox",
                    uiType: "ComboBox",
                    template: "#=gridUtils.uiControlWrapper(data, 'MRKT_SEG_NON_CORP')#",
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
                function (value, key) {
                    if (key !== "_dirty") $scope.des[key][field] = $event;
                });

            // flat
            $scope.flat._dirty = $event;
            angular.forEach($scope.flat,
                function (value, key) {
                    if ($scope.flat._behaviors[field] === undefined) $scope.flat._behaviors[field] = {};
                    if (key !== "_dirty") $scope.flat._behaviors[field][key] = $event;
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
                    validMsg: "Please enter a valid value.",
                    helpMsg: "Look, here are some helpful instructions"
                },
                "INT": {
                    "value": 123,
                    isReadOnly: false,
                    isRequired: false,
                    isHidden: false,
                    isError: false,
                    isDirty: false,
                    validMsg: "Please enter a valid value.",
                    helpMsg: "Look, here are some helpful instructions"
                },
                "DATE": {
                    "value": "2/4/2016",
                    isReadOnly: false,
                    isRequired: false,
                    isHidden: false,
                    isError: false,
                    isDirty: false,
                    validMsg: "Please enter a valid value.",
                    helpMsg: "Look, here are some helpful instructions"
                },
                "DROPDOWN": {
                    "value": "SMB",
                    isReadOnly: false,
                    isRequired: false,
                    isHidden: false,
                    isError: false,
                    isDirty: false,
                    validMsg: "Please enter a valid value.",
                    helpMsg: "Look, here are some helpful instructions"
                },
                "COMBOBOX": {
                    "value": "Gaming",
                    isReadOnly: false,
                    isRequired: false,
                    isHidden: false,
                    isError: false,
                    isDirty: false,
                    validMsg: "Please enter a valid value.",
                    helpMsg: "Look, here are some helpful instructions"
                },
                "TEXTAREA": {
                    "value": "Multi-line TextBox",
                    isReadOnly: false,
                    isRequired: false,
                    isHidden: false,
                    isError: false,
                    isDirty: false,
                    validMsg: "Please enter a valid value.",
                    helpMsg: "Look, here are some helpful instructions"
                },
                "SliderInt": {
                    "value": 1,
                    isReadOnly: false,
                    isRequired: false,
                    isHidden: false,
                    isError: false,
                    isDirty: false,
                    validMsg: "Please enter a valid value.",
                    helpMsg: "Look, here are some helpful instructions"
                },
                "RADIOBUTTON": {
                    "value": "",
                    isReadOnly: false,
                    isRequired: false,
                    isHidden: false,
                    isError: false,
                    isDirty: false,
                    validMsg: "Please enter a valid value.",
                    helpMsg: "Look, here are some helpful instructions"
                }
            }
            $scope.flat = {
                "_dirty": false,
                "DC_ID": 1,
                "TEXT": "Hello World",
                "INT": 123,
                "DATE": "2/4/2016",
                "DROPDOWNH": "SMB",
                "DROPDOWNV": "SMB",
                "DropdownSelected": [],
                "COMBOBOXH": "Gaming",
                "COMBOBOXV": "Gaming",
                "ComboboxSelected": [],
                "RADIOBUTTONH": "",
                "RADIOBUTTONV": "",
                "TEXTAREA": "Multi-line TextBox",
                "SliderIntH": 1,
                "SliderIntV": 1,
                "MULTISELECTH": ["SMB"],
                "MULTISELECTV": ["SMB"],
                "_MultiDim": [
                    {
                        "PIVOT": -1,
                        "TITLE": "Kit",
                        "TEXT": "Hello World 1",
                        "INT": 1231,
                        "DATE": "2/1/2016",
                        "DROPDOWN": "SMB",
                        "COMBOBOX": "Gaming"
                    },
                    {
                        "PIVOT": 0,
                        "TITLE": "Primary",
                        "TEXT": "Hello World 2",
                        "INT": 1232,
                        "DATE": "2/2/2016",
                        "DROPDOWN": "SMB",
                        "COMBOBOX": "Gaming"
                    },
                    {
                        "PIVOT": 1,
                        "TITLE": "Secondary 1",
                        "TEXT": "Hello World 3",
                        "INT": 1233,
                        "DATE": "2/3/2016",
                        "DROPDOWN": "SMB",
                        "COMBOBOX": "Gaming"
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
                        "TEXT": "That did not work",
                        "DATE": "That did not work"
                    },
                    "helpMsg": {
                        "TEXT": "Look, here are some helpful instructions",
                        "DATE": "Look, here are some helpful instructions"
                    }
                }
            };
            $scope.flatGrid = [
                {
                    "_dirty": false,
                    "DC_ID": 1,
                    "TEXT": "Hello World 1",
                    "INT": 123,
                    "DATE": "2/4/2016",
                    "DROPDOWN": "SMB",
                    "COMBOBOX": "Gaming",
                    "_MultiDim": [
                        {
                            "DC_ID": -300,
                            "PIVOT": -1,
                            "TITLE": "Kit",
                            "TEXT": "Hello World 1",
                            "INT": 1231,
                            "DATE": "2/1/2016",
                            "DROPDOWN": "SMB",
                            "COMBOBOX": "Gaming",
                            "_behaviors": {
                                "isRequired": {},
                                "isReadOnly": {},
                                "isHidden": {},
                                "isSaved": {},
                                "isError": {},
                                "isDirty": {},
                                "validMsg": {
                                    "TEXT": "That did not work"
                                },
                                "helpMsg": {
                                    "TEXT": "Look, here are some helpful instructions"
                                }
                            }
                        },
                        {
                            "DC_ID": -301,
                            "PIVOT": 0,
                            "TITLE": "Primary",
                            "TEXT": "Hello World 2",
                            "INT": 1232,
                            "DATE": "2/2/2016",
                            "DROPDOWN": "SMB",
                            "COMBOBOX": "Gaming"
                        },
                        {
                            "DC_ID": -302,
                            "PIVOT": 1,
                            "TITLE": "Secondary 1",
                            "TEXT": "Hello World 3",
                            "INT": 1233,
                            "DATE": "2/3/2016",
                            "DROPDOWN": "SMB",
                            "COMBOBOX": "Gaming"
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
                        },
                        "helpMsg": {
                            "TEXT": "Look, here are some helpful instructions"
                        }
                    }
                },
                {
                    "_dirty": false,
                    "DC_ID": 2,
                    "TEXT": "Hello World 2",
                    "INT": 124,
                    "DATE": "2/4/2016",
                    "DROPDOWN": "SMB",
                    "COMBOBOX": "Gaming",
                    "_MultiDim": [
                        {
                            "DC_ID": -304,
                            "PIVOT": -1,
                            "TITLE": "Kit",
                            "TEXT": "Hello World 1",
                            "INT": 1231,
                            "DATE": "2/1/2016",
                            "DROPDOWN": "SMB",
                            "COMBOBOX": "Gaming"
                        },
                        {
                            "DC_ID": -305,
                            "PIVOT": 0,
                            "TITLE": "Primary",
                            "TEXT": "Hello World 2",
                            "INT": 1232,
                            "DATE": "2/2/2016",
                            "DROPDOWN": "SMB",
                            "COMBOBOX": "Gaming"
                        },
                        {
                            "DC_ID": -306,
                            "PIVOT": 1,
                            "TITLE": "Secondary 1",
                            "TEXT": "Hello World 3",
                            "INT": 1233,
                            "DATE": "2/3/2016",
                            "DROPDOWN": "SMB",
                            "COMBOBOX": "Gaming"
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
                        },
                        "helpMsg": {
                            "TEXT": "Look, here are some helpful instructions"
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
                    "id": "",
                    "fields": {
                        "_behaviors": { type: "object" },
                        "DC_ID": { editable: false, nullable: true },
                        "PIVOT": { type: "object" },
                        "TITLE": { type: "string" },
                        "TEXT": { type: "string" },
                        "INT": { type: "number" },
                        "DATE": { type: "date" },
                        "DROPDOWN": {
                            type: "string",
                            values: "/api/Dropdown/GetDropdowns/MRKT_SEG_NON_CORP",
                            valuesText: "DROP_DOWN",
                            valuesValue: "DROP_DOWN"
                        },
                        "COMBOBOX": {
                            type: "string",
                            values: "/api/Dropdown/GetDropdowns/MRKT_SEG_NON_CORP",
                            valuesText: "DROP_DOWN",
                            valuesValue: "DROP_DOWN"
                        }
                    }
                },
                [
                    {
                        field: "_dirty",
                        title: "<i class='intelicon-upload-solid gridHeaderIcon' title='Something changed on this row'></i>",
                        width: "40px",
                        template: "#=gridUtils.uiIconWrapper(data, '_dirty')#"
                    }, {
                        field: "PIVOT", title: "PIVOT"
                    }, {
                        field: "TITLE", title: "TITLE"
                    }, {
                        field: "TEXT", title: "TEXT2",
                        template: "#=gridUtils.uiControlWrapper(data, 'TEXT')#"
                    }, {
                        field: "INT", title: "INT",
                        template: "#=gridUtils.uiControlWrapper(data, 'INT')#"
                    }, {
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

                var idIndx = $scope.flatGrid.indexOfField("DC_ID", dataItem["DC_ID"]);
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

        $scope.fontSize = "lg";
        $scope.$watch('fontSize',
            function (newValue, oldValue, el) {
                if (oldValue === newValue) return;

                $(".opUiContainer").removeClass("sm").removeClass("md");
                if (newValue !== "lg")
                    $(".opUiContainer").addClass(newValue);

            }, true);

        $scope.fontSize = "white";
        $scope.$watch('bgColor',
            function (newValue, oldValue, el) {
                if (oldValue === newValue) return;

                $(".opUiContainer").removeClass("blue").removeClass("intel");
                $(".testContainer").removeClass("blue").removeClass("intel");
                if (newValue !== "white") {
                    $(".opUiContainer").addClass(newValue);
                    $(".testContainer").addClass(newValue);
                }

            }, true);

        $scope.loadData();
    }
})();