(function() {
    'use strict';

    angular.module('app.testCases')
        .controller('statusController', statusController);

    statusController.$inject = ['$uibModal', '$scope'];

    function statusController($uibModal, $scope) {

        $scope.data = {
            "id": 1, "name": "Contract Name", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Fail",
            "children": [
                {
                    "id": 2, "name": "Pricing Strategy 1", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Fail",
                    "children": [
                        { "id": 3, "name": "Pricing Table 1", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Pass" }
                    ]
                },
                {
                    "id": 4, "name": "Pricing Strategy 2", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Fail",
                    "children": [
                        { "id": 5, "name": "Pricing Table 2", "stage": "Complete", "type": "VOLTIER", "mct": "Fail", "pct": "Fail" },
                        { "id": 6, "name": "Pricing Table 3", "stage": "InComplete", "type": "VOLTIER", "mct": "Fail", "pct": "Pass" },
                        { "id": 7, "name": "Pricing Table 4", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Fail" },
                        { "id": 8, "name": "Pricing Table 5", "stage": "Complete", "type": "VOLTIER", "mct": "Fail", "pct": "Fail" },
                        { "id": 9, "name": "Pricing Table 6", "stage": "InComplete", "type": "ECAP", "mct": "Fail", "pct": "Fail" },
                        { "id": 10, "name": "Pricing Table 7", "stage": "InComplete", "type": "ECAP", "mct": "Fail", "pct": "Pass" },
                        { "id": 11, "name": "Pricing Table 8", "stage": "Complete", "type": "VOLTIER", "mct": "Fail", "pct": "Pass" },
                        { "id": 12, "name": "Pricing Table 9", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Fail" }
                    ]
                },
                {
                    "id": 13, "name": "Pricing Strategy 3", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Pass",
                    "children": [
                        {
                            "id": 14, "name": "Pricing Table 10", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Pass",
                            "children": [
                                { "id": 15, "name": "Ptr 1", "stage": "Complete", "type": "ECAP", "mct": "Pass", "pct": "Pass" },
                                { "id": 16, "name": "Ptr 2", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Pass" },
                                { "id": 17, "name": "Ptr 3", "stage": "InComplete", "type": "VOLTIER", "mct": "Pass", "pct": "Pass" },
                                { "id": 18, "name": "Ptr 4", "stage": "InComplete", "type": "VOLTIER", "mct": "Pass", "pct": "Pass" },
                                { "id": 19, "name": "Ptr 5", "stage": "Complete", "type": "ECAP", "mct": "Pass", "pct": "Pass" }
                            ]
                        },
                        {
                            "id": 20, "name": "Pricing Table 11", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Pass",
                            "children": [
                                { "id": 21, "name": "AnchorControl", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Pass" },
                                { "id": 22, "name": "ClickControl", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Pass" },
                                { "id": 23, "name": "Control", "stage": "Complete", "type": "VOLTIER", "mct": "Fail", "pct": "Pass" },
                                { "id": 24, "name": "ControlList", "stage": "Complete", "type": "VOLTIER", "mct": "Fail", "pct": "Pass" }
                            ]
                        },
                        {
                            "id": 25, "name": "Pricing Table 12", "stage": "InComplete", "type": "ECAP", "mct": "Fail", "pct": "Pass",
                            "children": [
                                { "id": 26, "name": "Data", "stage": "InComplete", "type": "VOLTIER", "mct": "Fail", "pct": "InComplete" },
                                { "id": 27, "name": "DataList", "stage": "InComplete", "type": "PROGRAM", "mct": "Fail", "pct": "InComplete" },
                                { "id": 28, "name": "DataSprite", "stage": "InComplete", "type": "PROGRAM", "mct": "Fail", "pct": "InComplete" },
                                { "id": 29, "name": "EdgeSprite", "stage": "InComplete", "type": "ECAP", "mct": "Fail", "pct": "NA" },
                                { "id": 30, "name": "NodeSprite", "stage": "InComplete", "type": "ECAP", "mct": "Fail", "pct": "InComplete" },
                                {
                                    "id": 31, "name": "render", "stage": "InComplete", "type": "ECAP", "mct": "Fail", "pct": "InComplete",
                                    "children": [
                                        { "id": 32, "name": "ArrowType", "stage": "InComplete", "type": "ECAP", "mct": "Fail", "pct": "NA" },
                                        { "id": 33, "name": "EdgeRenderer", "stage": "InComplete", "type": "ECAP", "mct": "Fail", "pct": "InComplete" },
                                        { "id": 34, "name": "IRenderer", "stage": "InComplete", "type": "ECAP", "mct": "Fail", "pct": "InComplete" },
                                        { "id": 35, "name": "ShapeRenderer", "stage": "InComplete", "type": "ECAP", "mct": "Fail", "pct": "NA" }
                                    ]
                                },
                                { "id": 36, "name": "ScaleBinding", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "NA" },
                                { "id": 37, "name": "Tree", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "NA" },
                                { "id": 38, "name": "TreeBuilder", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "NA" }
                            ]
                        },
                        {
                            "id": 39, "name": "events", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "InComplete",
                            "children": [
                                { "id": 40, "name": "DataEvent", "stage": "Complete", "type": "CAPBAND", "mct": "Fail", "pct": "InComplete" },
                                { "id": 41, "name": "SelectionEvent", "stage": "Complete", "type": "CAPBAND", "mct": "Fail", "pct": "Pass" },
                                { "id": 42, "name": "TooltipEvent", "stage": "Complete", "type": "CAPBAND", "mct": "Fail", "pct": "Pass" },
                                { "id": 43, "name": "VisualizationEvent", "stage": "Complete", "type": "CAPBAND", "mct": "Fail", "pct": "NA" }
                            ]
                        },
                        {
                            "id": 44, "name": "legend", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "NA",
                            "children": [
                                { "id": 45, "name": "Legend", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "NA" },
                                { "id": 46, "name": "LegendItem", "stage": "Complete", "type": "CAPBAND", "mct": "Fail", "pct": "NA" },
                                { "id": 47, "name": "LegendRange", "stage": "Complete", "type": "CAPBAND", "mct": "Fail", "pct": "NA" }
                            ]
                        },
                        {
                            "id": 48, "name": "Visualization", "stage": "Complete", "type": "ECAP", "mct": "Fail", "pct": "Pass"
                        }
                    ]
                }
            ]
        };

    };
})();

