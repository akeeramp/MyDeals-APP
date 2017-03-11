(function() {
    'use strict';

    angular.module('app.testCases')
        .controller('basicController', basicController);

    basicController.$inject = ['$uibModal', '$scope', 'gridConstants'];

    function basicController($uibModal, $scope, gridConstants) {

        var gTools = new gridTools(
            {
                "id": "DC_ID",
                "fields": {
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
                    field: "TEXT",
                    title: "Text",
                    filterable: { multi: true, search: true }
                }, {
                    field: "INT",
                    title: "Int",
                    filterable: { multi: true, search: true }
                }, {
                    field: "DATE",
                    title: "Date",
                    filterable: { multi: true, search: true },
                    format: "{0:MM/dd/yyyy}"
                }, {
                    field: "DROPDOWN",
                    title: "Dropdown",
                    filterable: { multi: true, search: true },
                    uiType: "DropDown",
                    editor: gridUtils.lookupEditor
                }, {
                    field: "COMBOBOX",
                    title: "Combobox",
                    filterable: { multi: true, search: true },
                    uiType: "ComboBox",
                    editor: gridUtils.lookupEditor
                }
            ]);

        var gTools2 = new gridTools(
            {
                "id": "DC_ID",
                "fields": {
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
                    command: [
                        {
                            name: "edit",
                            template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>"
                        },
                        {
                            name: "delete",
                            template: "<a class='k-grid-delete' href='\\#'><span class='k-icon k-i-close'></span></a>"
                        }
                    ],
                    title: " ",
                    width: "80px"
                }, {
                    field: "TEXT",
                    title: "Text",
                    filterable: { multi: true, search: true }
                }, {
                    field: "INT",
                    title: "Int",
                    filterable: { multi: true, search: true }
                }, {
                    field: "DATE",
                    title: "Date",
                    filterable: { multi: true, search: true },
                    format: "{0:MM/dd/yyyy}"
                }, {
                    field: "DROPDOWN",
                    title: "Dropdown",
                    filterable: { multi: true, search: true },
                    uiType: "DropDown",
                    editor: gridUtils.lookupEditor
                }, {
                    field: "COMBOBOX",
                    title: "Combobox",
                    filterable: { multi: true, search: true },
                    uiType: "ComboBox",
                    editor: gridUtils.lookupEditor
                }
            ]);

        $scope.loadData = function() {
            $scope.flatGrid = [];

            for (var i = 0; i < 100; i++) {
                $scope.flatGrid.push({
                    "DC_ID": i,
                    "TEXT": "Hello World " + i,
                    "INT": 123 + (i * 1000),
                    "DATE": "2/4/2016",
                    "DROPDOWN": "DROPDOWN " + i,
                    "COMBOBOX": "COMBOBOX " + i
                });
            }

            $scope.basicGridOptions = {
                dataSource: gTools.createDataSource($scope.flatGrid, 50),
                columns: gTools.cols,
                scrollable: true,
                sortable: true,
                editable: true,
                pageable: {
                    refresh: true,
                    pageSizes: gridConstants.pageSizes,
                },
                navigatable: true,
                filterable: true,
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: false
            };

            $scope.inlineGridOptions = {
                dataSource: gTools2.createDataSource($scope.flatGrid, 50),
                columns: gTools2.cols,
                scrollable: true,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: gridConstants.pageSizes
                },
                navigatable: true,
                filterable: true,
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: true,
                toolbar: ["create"],
                editable: "inline",
                edit: function (e) {
                    var commandCell = e.container.find("td:first");
                    commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
                }
            };

        };

        $scope.loadData();
    };
})();

