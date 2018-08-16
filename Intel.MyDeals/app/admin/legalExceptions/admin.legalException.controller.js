(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('legalExceptionsController', legalExceptionsController)

    legalExceptionsController.$inject = ['legalExceptionService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq', 'productSelectorService'];

    function legalExceptionsController(legalExceptionService, $scope, logger, confirmationModal, gridConstants, $linq, productSelectorService) {
        var vm = this;
        vm.validationMessage = "";
        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    legalExceptionService.getLegalExceptions()
                        .then(function (response) {
                            if (response.data.length > 0) {
                                e.success(response.data);
                            }
                        }, function (response) {
                            logger.error("Unable to get Legal exceptions.", response, response.statusText);
                        });
                },
                update: function (e) {
                    if (isInvalidateRow(e, 'update')) {
                        e.error();
                    } else {
                        legalExceptionService.updateLegalException(e.data.models[0])
                            .then(function (response) {
                                e.success(response.data);
                                logger.success("Legal exception were successfully updated.");
                            }, function (response) {
                                logger.error("Unable to update Legal exception.", response, response.statusText);
                            });
                    }

                },
                create: function (e) {
                    if (isInvalidateRow(e, 'create')) {
                        e.error();
                    } else {
                        legalExceptionService.createLegalException(e.data.models[0])
                            .then(function (response) {
                                e.success(response.data);
                                logger.success("Legal exceptions added.");
                            }, function (response) {
                                logger.error("Unable to add new Legal exceptions", response, response.statusText);
                            });
                    }
                },
                destroy: function (e) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete Legal Exception',
                        hasActionButton: true,
                        headerText: 'Delete confirmation',
                        bodyText: 'Are you sure you would like to Delete this Legal Exception ?'
                    };
                    confirmationModal.showModal({}, modalOptions).then(function (result) {
                        legalExceptionService.deleteLegalException(e.data.models[0]).then(function (response) {
                            e.success(response.data);
                            logger.success("Legal Exception Deleted.");
                        }, function (response) {
                            logger.error("Unable to delete Legal Exception.", response, response.statusText);
                        });
                    }, function (response) {
                        cancelChanges();
                    });
                },
            },
            batch: true,
            pageSize: 25,
            filter: [{
                field: "ACTV_IND", operator: "eq", value: "true"
            }],
            sort: { field: "INTEL_PRD", dir: "asc" },
            schema: {
                model: {
                    id: "MYDL_PCT_LGL_EXCPT_SID",
                    fields: {
                        ACTV_IND: { editable: true, defaultValue: true, type: "boolean" }
                        , INTEL_PRD: {
                            validation: {
                                required: { message: "* field is required" },
                            }
                        },
                        IS_DSBL: { editable: true, defaultValue: true, type: "boolean" }
						, SCPE: {
						    type: "string", validation: {
						        required: { message: "* field is required" }
						    }
						}
						, PRC_RQST: {
						    type: "string", validation: {
						        required: { message: "* field is required" }
						    }
						}
                        , COST: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
            			, PCT_LGL_EXCPT_STRT_DT: {
            			    type: "date", validation: {
            			        required: { message: "* field is required" }
            			    }
            			}
                        , PCT_LGL_EXCPT_END_DT: {
                            type: "date", validation: {
                                required: { message: "* field is required" },
                                exceptionEndDateValidation: exceptionEndDateValidation
                            }
                        }
						, FRCST_VOL_BYQTR: {
						    type: "string", validation: {
						        required: { message: "* field is required" }
						    }
						}
						, CUST_PRD: {
						    type: "string", validation: {
						        required: { message: "* field is required" }
						    }
						}
						, MEET_COMP_PRD: {
						    type: "string", validation: {
						        required: { message: "* field is required" }
						    }
						}
                        , MEET_COMP_PRC: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
						, BUSNS_OBJ: {
						    type: "string", validation: {
						        required: { message: "* field is required" }
						    }
						}
						, PTNTL_MKT_IMPCT: {
						    type: "string", validation: {
						        required: { message: "* field is required" }
						    }
						}
						, OTHER: { type: "string" }
						, JSTFN_PCT_EXCPT: {
						    type: "string", validation: {
						        required: { message: "* field is required" }
						    }
						}
                        , RQST_CLNT: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , RQST_ATRNY: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , APRV_ATRNY: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , DT_APRV: {
                            type: "date", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , CHG_EMP_NAME: { type: "string", editable: false, defaultValue: usrName }
                        , CHG_DTM: { type: "date", editable: false, defaultValue: moment().format('l') }
                    }
                },
            },
        });

        function textareaEditor(container, options) {
            $('<textarea name="' + options.field + '" style="width: ' + container.width() + 'px;height:150px" validationMessage="* field is required" placeholder="Please enter.." ' +
                'required name="' + options.field + '" />').appendTo(container);
            $('<span class="k-invalid-msg" data-for="' + options.field + '"></span>').appendTo(container);
        }

        var editNotAllowed = usrRole == "SA" ? 1 : 0;

        $scope.isEditable = function (dataItem) {
            return editNotAllowed === 1 ? false : dataItem.ACTV_IND && dataItem.USED_IN_DL !== 'Y';
        }

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: true,
            scrollable: true,
            sortable: true,
            enableHorizontalScrollbar: true,
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            navigatable: true,
            resizable: true,
            reorderable: true,
            columnMenu: false,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            toolbar: gridUtils.inLineClearAllFiltersToolbarRestricted(editNotAllowed),
            editable: { mode: "inline", confirmation: false },
            edit: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
            },
            destroy: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
            },
            cancel: function (e) {
                vm.validationMessage = '';
            },
            columns: [
            {
                command: [
                       { name: "edit", template: "<a ng-if='" + !editNotAllowed + "' class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>" },
                       { name: "destroy", template: "<a ng-if='" + !editNotAllowed + " && dataItem.ACTV_IND && dataItem.USED_IN_DL !== \"Y\"' class='k-grid-delete' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }
                ],
                width: 100,
            },
            {
                field: "ACTV_IND",
                width: 115,
                headerTemplate: "<div class='isRequired'> Active </div>",
                template: gridUtils.boolViewer('ACTV_IND'),
                editor: gridUtils.boolEditor,
                attributes: { style: "text-align: center;" },
                editable: $scope.isEditable
            },
            {
                field: "IS_DSBL",
                width: 115,
                headerTemplate: "<div class='isRequired'> Hidden </div>",
                template: gridUtils.boolViewer('IS_DSBL'),
                editor: gridUtils.boolEditor,
                attributes: { style: "text-align: center;" },
                editable: function (dataItem) {
                    return editNotAllowed === 1 ? false : true;
                }
            },
            {
                field: "MYDL_PCT_LGL_EXCPT_SID",
                hidden: true,
                width: 120,
                filterable: { multi: true, search: true }
            },
            {
                field: "INTEL_PRD",
                headerTemplate: "<div class='isRequired'> Intel Product </div>",
                editor: textareaEditor,
                title: "Intel Product",
                width: 240,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "SCPE",
                headerTemplate: "<div class='isRequired'> Scope </div>",
                editor: textareaEditor,
                title: "Scope",
                width: 200,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "PRC_RQST",
                editor: textareaEditor,
                title: "Price Request",
                headerTemplate: "<div class='isRequired'> Price Request </div>",
                width: 160,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "COST",
                title: "Cost",
                editor: textareaEditor,
                headerTemplate: "<div class='isRequired'> Cost </div>",
                width: 120,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "PCT_LGL_EXCPT_STRT_DT",
                width: 150,
                headerTemplate: "<div class='isRequired'> Exception Start Date </div>",
                template: "#= kendo.toString(new Date(PCT_LGL_EXCPT_STRT_DT), 'M/d/yyyy') #",
                title: "Exception Start Date",
                filterable: {
                    extra: false,
                    ui: "datepicker"
                },
                editable: $scope.isEditable
            },
            {
                field: "PCT_LGL_EXCPT_END_DT",
                title: "Exception End Date",
                headerTemplate: "<div class='isRequired'> Exception End Date </div>",
                template: "#= kendo.toString(new Date(PCT_LGL_EXCPT_END_DT), 'M/d/yyyy') #",
                width: 150,
                filterable: {
                    extra: false,
                    ui: "datepicker"
                },
                editable: $scope.isEditable
            },
            {
                field: "FRCST_VOL_BYQTR",
                title: "Forecasted Volume By Quarter",
                editor: textareaEditor,
                headerTemplate: "<div class='isRequired'> Forecasted Volume By Quarter </div>",
                width: 190,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "CUST_PRD",
                title: "Customer Product",
                editor: textareaEditor,
                headerTemplate: "<div class='isRequired'> Customer Product </div>",
                width: 150,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "MEET_COMP_PRD",
                title: "Comp Product",
                editor: textareaEditor,
                headerTemplate: "<div class='isRequired'> Comp Product </div>",
                width: 150,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "MEET_COMP_PRC",
                title: "Comp Price",
                editor: textareaEditor,
                headerTemplate: "<div class='isRequired'> Comp Price </div>",
                width: 150,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "BUSNS_OBJ",
                title: "Business Object",
                editor: textareaEditor,
                headerTemplate: "<div class='isRequired'> Business Object </div>",
                width: 150,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "PTNTL_MKT_IMPCT",
                title: "Potential Market Impact",
                editor: textareaEditor,
                headerTemplate: "<div class='isRequired'> Potential Market Impact </div>",
                width: 180,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "OTHER",
                title: "Other",
                editor: textareaEditor,
                headerTemplate: "<div class='isRequired'> Other </div>",
                width: 120,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "JSTFN_PCT_EXCPT",
                title: "Justification for PCT Expiry",
                editor: textareaEditor,
                headerTemplate: "<div class='isRequired'> Justification for PCT Expiry </div>",
                width: 220,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "RQST_CLNT",
                title: "Requesting Client",
                headerTemplate: "<div class='isRequired'> Requesting Client </div>",
                width: 150,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "RQST_ATRNY",
                title: "Requesting Attorney",
                headerTemplate: "<div class='isRequired'> Requesting Attorney </div>",
                width: 150,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "APRV_ATRNY",
                title: "Approving Attorney",
                headerTemplate: "<div class='isRequired'> Approving Attorney </div>",
                width: 150,
                filterable: { multi: true, search: true },
                editable: $scope.isEditable
            },
            {
                field: "DT_APRV",
                title: "Date Approved",
                template: "#= kendo.toString(new Date(DT_APRV), 'M/d/yyyy') #",
                headerTemplate: "<div class='isRequired'> Date Approved </div>",
                width: 150,
                filterable: {
                    extra: false,
                    ui: "datepicker"
                },
                editable: $scope.isEditable
            },
            {
                field: "CHG_EMP_NAME",
                title: "Entered By",
                headerTemplate: "<div class='isRequired'> Entered By </div>",
                width: 150,
                filterable: { multi: true, search: true },
                editable: false
            },
            {
                field: "CHG_DTM",
                title: "Entered Date",
                headerTemplate: "<div class='isRequired'> Entered Date </div>",
                template: "#= kendo.toString(new Date(gridUtils.stripMilliseconds(CHG_DTM)), 'M/d/yyyy') #",
                width: 150,
                filterable: {
                    extra: false,
                    ui: "datepicker"
                },
                editable: false
            }]
        }

        function cancelChanges() {
            var grid = $("#grid").data("kendoGrid");
            grid.cancelChanges();
        }

        function exceptionEndDateValidation(input) {
            var row = input.closest("tr");
            var grid = row.closest("[data-role=grid]").data("kendoGrid");
            var dataItem = grid.dataItem(row);
            if (input.is("[name='PCT_LGL_EXCPT_END_DT']") && input.val() != "" &&
                moment(moment(input.val()).format('l')).isBefore(moment(dataItem.PCT_LGL_EXCPT_STRT_DT).format('l'))) {
                input.attr("data-exceptionEndDateValidation-msg", "End Date cannot be before Start Date");
                return false;
            }
            return true;
        }

        function isInvalidateRow(e, mode) {
            vm.validationMessage = "";
            if (moment(moment(e.data.models[0].PCT_LGL_EXCPT_END_DT).format('l')).isBefore(moment().format('l'))) {
                e.data.models[0].ACTV_IND = false;
            }

            if (mode === "create") {
                if (e.data.models[0].ACTV_IND == false) {
                    $scope.$apply(function () {
                        vm.validationMessage = 'Cannot create inactive legal exception.';
                    });
                    return true;
                }
            }

            e.data.models[0].PCT_LGL_EXCPT_STRT_DT = moment(e.data.models[0].PCT_LGL_EXCPT_STRT_DT).format("l");
            e.data.models[0].PCT_LGL_EXCPT_END_DT = moment(e.data.models[0].PCT_LGL_EXCPT_END_DT).format("l");
            e.data.models[0].DT_APRV = moment(e.data.models[0].DT_APRV).format("l");

            return false;
        }

        function productEditor(container, options) {
            $('<input id="productEditor" validationMessage="* field is required" placeholder="Enter Products.."' +
                'required name="' + options.field + '" data-text-field="Name" data-value-field="Name" data-bind="value:' + options.field + '" />').appendTo(container)
                .kendoComboBox({
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            type: "json",
                            read: function (e) {
                                var param = e.data.filter.filters[0].value;
                                if (param === "") {
                                    e.success([]);
                                } else {
                                    var dto = {
                                        filter: param
                                    };
                                    productSelectorService.GetLegalExceptionProducts(dto).then(function (response) {
                                        e.success(response.data);
                                    }, function (response) {
                                        logger.error("Unable to get product suggestions.", response, response.statusText);
                                    });
                                }
                            },
                        }
                    },
                    autoBind: false,
                    serverFiltering: true,
                    filter: "startsWith",
                    height: 300,
                    delay: 700,
                    minLength: 2,
                    change: function (e) {
                        if (this.selectedIndex == -1) {
                            this.text("");
                        }
                    }
                });

            $('<span class="k-invalid-msg" data-for="' + options.field + '"></span>').appendTo(container);
        }
    }
})();