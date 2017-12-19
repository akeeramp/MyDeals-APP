angular
    .module('app.core')
    .directive('contractStatusBoard', contractStatusBoard);

contractStatusBoard.$inject = ['$compile', 'objsetService', 'colorDictionary'];

function contractStatusBoard($compile, objsetService,colorDictionary) {
    return {
        scope: {
            contractId: '=ngModel'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridStatusBoard/contractStatusBoard.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {
            
            $scope.isLoaded = false;
            $scope.Title = "";
            $scope.width = 175;
            $scope.height = 175;
            $scope.radius = (Math.min($scope.width, $scope.height) / 2) - 10;
            $scope.breadcrumbs = [];
            $scope.legend = {};

            objsetService.readContractStatus($scope.contractId).then(function (response) {
                $scope.init(response.data);
                $scope.isLoaded = true;
            });

            $scope.chartType = "valid";

            $scope.getColor = function (k, c) {
                if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
                    return colorDictionary[k][c];
                }
                return "#cccccc";
            }
            $scope.getColorType = function (d) {
                return $scope.getColor('type', d.type);
            }
            $scope.getColorStage = function (d) {
                return $scope.getColor('stage', d.stage);
            }
            $scope.getColorPct = function (d) {
                return $scope.getColor('pct', d.pct);
            }
            $scope.getColorValid = function (d) {
                return $scope.getColor('valid', d.valid);
            }
            $scope.getColorMct = function (d) {
                return $scope.getColor('mct', d.mct);
            }

            $scope.$watch(function (scope) { return scope.chartType },
              function (newValue, oldValue) {
                  if (newValue !== oldValue) {
                      $scope.svg.selectAll("path")
                          .style("fill",
                              function (d) {
                                  return $scope.color(d);
                              });
                      $scope.legend = colorDictionary[newValue];
                  }
              }
             );

            $scope.chartTypes = new kendo.data.DataSource({
                data: [
                    { "value": "type", "text": "Deal Types" },
                    { "value": "stage", "text": "Stages" },
                    { "value": "valid", "text": "Valid" },
                    { "value": "pct", "text": "Pricing Cost Test" },
                    { "value": "mct", "text": "Meet Comp Test" }
                ]
            });
            


            $scope.zoomChart = function(d) {
                var selection = d3.selectAll("path").data().filter(function (d1) {
                    return (d1.id === d.id);
                })[0];
                $scope.click(selection);
            }

            $scope.sbData = {};

            $scope.gridDs = new kendo.data.DataSource({
                data: []
            });

            $scope.mainGridOptions = {
                dataSource: $scope.gridDs,
                sortable: true,
                filterable: true,
                columns: [{
                    field: "id",
                    title: "&nbsp;",
                    width: "30px",
                    sortable: false,
                    filterable: false,
                    template: "<a href='\\#' ng-click='gotoContractManager(dataItem.id)' style='margin-left: 3px;' title='Click to open the Contract in the Contract Editor'><i class='intelicon-frame-template' style='font-size: 20px;'></i></a>"
                }, {
                    field: "stage",
                    title: "Strategy Stage",
                    template: "<span><i class='intelicon-workflow-process-outlined' style='color: {{getColorStage(dataItem)}}; font-size: 20px;'></i> {{dataItem.stage}}</span>"
                }, {
                    field: "name",
                    title: "Strategy Name",
                    template: "<a href='\\#' ng-click='gotoContractManager(dataItem.id)' style='margin-left: 3px;' title='Click to open the Contract in the Contract Editor'>{{dataItem.name}}</a>"
                }, {
                    field: "pct",
                    title: "Price Cost Test Results",
                    template: "<icon-mct-pct ng-model='dataItem.pct' icon-class=\"'medIcon'\"></icon-mct-pct>"
                }, {
                    field: "mct",
                    title: "Meet Comp Test Results",
                    template: "<icon-mct-pct ng-model='dataItem.mct' icon-class=\"'medIcon'\"></icon-mct-pct>"
                }]
            };

            $scope.recurCalcData = function (data, defStage) {

                var ret = [];

                for (var i = 0; i < data.length; i++) {
                    var results = ["Pass", "Fail", "InComplete", "NA"];
                    var next = "";
                    var titleCd = "TITLE";

                    if (data[i]["dc_type"] === "CNTRCT") {
                        next = "PRC_ST";
                        defStage = "InComplete";

                    } else if (data[i]["dc_type"] === "PRC_ST") {
                        next = "PRC_TBL";
                        defStage = "Draft";

                    } else if (data[i]["dc_type"] === "PRC_TBL") {
                        next = "PRC_TBL_ROW";

                    } else if (data[i]["dc_type"] === "PRC_TBL_ROW") {
                        next = "WIP_DEALS";
                        titleCd = "PTR_USER_PRD";

                    } else if (data[i]["dc_type"] === "WIP_DEALS") {
                        next = "REAL_DEALS";
                        titleCd = "PTR_USER_PRD";

                    }

                    var stg = !data[i]["WF_STG_CD"] ? defStage : data[i]["WF_STG_CD"];
                    ret.push({
                        "id": data[i]["DC_ID"],
                        "name": data[i][titleCd],
                        "obj": $scope.getObjType(data[i]["dc_type"]),
                        "type": data[i]["OBJ_SET_TYPE_CD"],
                        "stage": stg,
                        "valid": data[i]["PASSED_VALIDATION"],
                        "mct": results[3],
                        "pct": results[3],
                        "children": data[i][next] === undefined ? [] : $scope.recurCalcData(data[i][next], stg)
                    });
                }

                return ret;
            }

            $scope.getObjType = function(obj) {
                if (obj === "CNTRCT") return "Contract";
                if (obj === "PRC_ST") return "Pricing Strategy";
                if (obj === "PRC_TBL") return "Pricing Table";
                if (obj === "PRC_TBL_ROW") return "Pricing Table Product";
                if (obj === "WIP_DEAL") return "WIP Deal";
                return "";
            }

            $scope.init = function (responseData) {

                var data = $scope.recurCalcData(responseData, "InComplete")[0];

                $scope.sbData = data;

                $scope.drawChart();

                if (data === undefined || data === null) {
                    $scope.gridDs.data([]);
                    $scope.Title = "";
                } else {
                    $scope.refreshGrid(data);
                    $scope.Title = data.obj + ": " + data.name;
                }
            }

            $scope.refreshGrid = function(d) {
                var d1 = [];
                if (d.children !== undefined) {
                    for (var i = 0; i < d.children.length; i++) {
                        d1.push({
                            "id": d.children[i].id,
                            "name": d.children[i].name,
                            "obj": d.children[i].obj,
                            "type": d.children[i].type,
                            "stage": d.children[i].stage,
                            "valid": d.children[i].valid,
                            "pct": d.children[i].pct,
                            "mct": d.children[i].mct
                        });
                    }
                }

                $scope.gridDs.data(d1);
            }

            $scope.drawChart = function() {

                $scope.formatNumber = d3.format(",d");

                $scope.legend = colorDictionary[$scope.chartType];

                $scope.x = d3.scale.linear()
                    .range([0, 2 * Math.PI]);

                $scope.y = d3.scale.sqrt()
                    .range([0, $scope.radius]);

                $scope.color = function (d) {
                    var d2 = d3.selectAll("path").data().filter(function (d1) {
                        return (d1.name === d.name);
                    })[0];
                    if (d2[$scope.chartType] === undefined) {
                        return "transparent";
                    }

                    return $scope.getColor($scope.chartType, d2[$scope.chartType]);
                }

                $scope.partition = d3.layout.partition()
                    .value(function (d) { return 1; }); //d.size

                $scope.arc = d3.svg.arc()
                    .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, $scope.x(d.x))); })
                    .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, $scope.x(d.x + d.dx))); })
                    .innerRadius(function (d) { return Math.max(0, $scope.y(d.y)); })
                    .outerRadius(function (d) { return Math.max(0, $scope.y(d.y + d.dy)); });

                $scope.svg = d3.select("#svg_" + $scope.contractId)
                    .attr("width", $scope.width)
                    .attr("height", $scope.height)
                    .append("g")
                    .attr("transform", "translate(" + $scope.width / 2 + "," + ($scope.height / 2) + ")");

                $scope.svg.selectAll("path")
                    .data($scope.partition.nodes($scope.sbData))
                    .enter().append("path")
                    .attr("d", $scope.arc)
                    .style("fill", function (d) {
                        return $scope.color(d);
                    })
                    .on("mouseover", mouseover)
                    .on("click", $scope.click)
                    .append("title")
                    .text(function (d) { return d.obj + ": " + d.name; });

                // Add the mouseleave handler to the bounding circle.
                d3.select("#svg_" + $scope.contractId).on("mouseleave", mouseleave);

            }

            $scope.drawChart();

            $scope.click = function (d) {
                $scope.Title = d.obj + ": " + d.name;
                $scope.svg.transition()
                    .duration(750)
                    .tween("scale", function () {
                        var xd = d3.interpolate($scope.x.domain(), [d.x, d.x + d.dx]),
                            yd = d3.interpolate($scope.y.domain(), [d.y, 1]),
                            yr = d3.interpolate($scope.y.range(), [d.y ? 20 : 0, $scope.radius]);
                        return function (t) { $scope.x.domain(xd(t)); $scope.y.domain(yd(t)).range(yr(t)); };
                    })
                  .selectAll("path")
                    .attrTween("d", function (d) { return function () { return $scope.arc(d); }; });


                $scope.refreshGrid(d);
            }

            $scope.gotoContractManager = function (id) {
                //var d = d3.selectAll("path").data().filter(function (d1) {
                //    return (d1.id === id);
                //})[0];
                //var sequenceArray = $scope.getAncestors(d);

                var lnk = "/Contract#/manager/" + $scope.contractId;

                if (window.usrRole === "DA") {
                    lnk = "/Contract#/manager/" + $scope.contractId + "/summary";
                //} else {
                    //if (sequenceArray.length >= 4) { // WIP
                    //    lnk += "/" + sequenceArray[0].id + "/" + sequenceArray[1].id + "/wip";
                    ///} else if (sequenceArray.length >= 2) { // Pricing Table
                    //    lnk += "/" + sequenceArray[0].id + "/" + sequenceArray[1].id;
                    //}
                }
                window.open(lnk, '_blank');
            }

            $scope.getAncestors = function (node) {
                var path = [];
                var current = node;
                while (current.parent) {
                    path.unshift(current);
                    current = current.parent;
                }
                return path;
            }
            
            function mouseover(d) {

                var sequenceArray = $scope.getAncestors(d);

                $scope.breadcrumbs = sequenceArray;
                
                // Fade all the segments.
                $scope.svg.selectAll("path")
                    .style("opacity", 0.4);

                // Then highlight only those that are an ancestor of the current segment.
                $scope.svg.selectAll("path")
                    .filter(function (node) {
                        return (sequenceArray.indexOf(node) >= 0);
                    })
                    .style("opacity", 1);
            }

            // Restore everything to full opacity when moving off the visualization.
            function mouseleave(d) {
                console.log("leaving");
                unHightlightAll();
            }

            function unHightlightAll() {

                $scope.breadcrumbs = [];

                // Deactivate all segments during transition.
                $scope.svg.selectAll("path").on("mouseover", null);

                // Transition each segment to full opacity and then reactivate it.
                $scope.svg.selectAll("path")
                    .transition()
                    .duration(1000)
                    .style("opacity", 1)
                    .each("end", function () {
                        d3.select(this).on("mouseover", mouseover);
                    });

            }

            d3.select(self.frameElement).style("height", $scope.height + "px");

        }],
        link: function (scope, element, attr) {
        }
    };
}
