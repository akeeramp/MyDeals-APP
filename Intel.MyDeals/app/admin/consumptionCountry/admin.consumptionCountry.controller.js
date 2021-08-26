(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ConsumptionCountryController', ConsumptionCountryController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    ConsumptionCountryController.$inject = ['consumptionCountryService', 'dropdownsService', '$scope', 'logger', 'gridConstants', '$uibModal'];

    function ConsumptionCountryController(consumptionCountryService, dropdownsService, $scope, logger, gridConstants, $uibModal) {

        $scope.accessAllowed = true;
        if (!(window.usrRole === 'SA' || window.isDeveloper)) {
            $scope.accessAllowed = false;
            document.location.href = "/Dashboard#/portal";
        }

        var vm = this;
        vm.Geo = [];
        vm.Countries = [];
        vm.ConsumptionCountry = [];

        vm.InitiateDropDowns = function () {
            dropdownsService.getDropdown('GetGeosDropdowns').then(function (response) {
                vm.Geo = response.data;
            }, function (response) {
                logger.error("Unable to get Geo.", response, response.statusText);
            });

            consumptionCountryService.getCountryList().then(function (response) {
                vm.Countries = response.data
            }, function (response) {
                logger.error("Unable to get Countries", response, response.statusText);
            });
        }

        vm.IsValidConsumptionCountryMapping = function (model) {

            var validationMessages = [];
            if (model.GEO_NM == null || model.GEO_NM == '' || vm.Geo.filter(x => x.dropdownName === model.GEO_NM).length == 0)
                validationMessages.push("Please Select Valid <b>Geo</b>.");
            if (model.CNSMPTN_CTRY_NM == null || model.CNSMPTN_CTRY_NM == '' || vm.Countries.filter(x => x.CTRY_NM === model.CNSMPTN_CTRY_NM).length == 0)
                validationMessages.push("Please Select Valid <b>Consumption Country</b>.");
            if (vm.ConsumptionCountry.filter(x => x.CNSMPTN_CTRY_NM === model.CNSMPTN_CTRY_NM && x.GEO_NM === model.GEO_NM).length != 0)
                validationMessages.push("The Combination of <b>" + model.GEO_NM + " </b>and<b> " + model.CNSMPTN_CTRY_NM + " </b>aleady exists.");
            if (vm.ConsumptionCountry.filter(x => x.CNSMPTN_CTRY_NM === model.CNSMPTN_CTRY_NM).length != 0)
                validationMessages.push("<b> " + model.CNSMPTN_CTRY_NM + " </b>already mapped.");


            if (validationMessages.length > 0)
                kendo.alert(validationMessages.join("</br>"));
            return validationMessages.length == 0;
        }

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    consumptionCountryService.getConsumptionCountry().then(function (response) {
                        e.success(response.data);
                        vm.InitiateDropDowns();
                        vm.ConsumptionCountry = response.data;
                    }, function (response) {
                        logger.error("Unable to get Consumption Countries.", response, response.statusText);
                    });
                }
                , update: function (e) {
                    if (vm.IsValidConsumptionCountryMapping(e.data)) {
                        consumptionCountryService.updateConsumptionCountry(e.data)
                            .then(function (response) {
                                e.success(response.data);
                                logger.success("Consumption Country updated.");
                            }, function (response) {
                                logger.error("Unable to update Consumption Country.", response, response.statusText);
                            });
                    }

                }
                , create: function (e) {
                    // if (e.data) {
                    if (vm.IsValidConsumptionCountryMapping(e.data)) {
                        consumptionCountryService.insertConsumptionCountry(e.data)
                            .then(function (response) {
                                e.success(response.data);
                                logger.success("New Consumption Country Added.");
                            }, function (response) {
                                logger.error("Unable to insert Consumption Country.", response, response.statusText);
                            });
                    }
                    // }

                }
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "CNSMPTN_CTRY_NM",
                    fields: {

                        GEO_NM: { editable: true, nullable: false, validation: { required: true } },
                        CNSMPTN_CTRY_NM: { editable: true, nullable: false, validation: { required: true } }
                    }
                }
            }
        });


        vm.GeoDropDownEditor = function (container, options) {
            var editor = $('<select kendo-combo-box k-options="vm.GeoOptions" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.CountryDropDownEditor = function (container, options) {
            var editor = $('<select kendo-combo-box k-options="vm.CtryOptions" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.GeoOptions = {
            placeholder: "Select Geo..",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.Geo);
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "dropdownName",
            dataValueField: "dropdownName",
            valuePrimitive: true
        };

        vm.CtryOptions = {
            placeholder: "Select Consumption Country..",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.Countries);
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "CTRY_NM",
            dataValueField: "CTRY_NM",
            valuePrimitive: true
        };

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: gridConstants.filterable,
            sortable: true,
            selectable: true,
            resizable: true,
            groupable: false,
            editable: { mode: "inline", confirmation: false },
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            toolbar: gridUtils.clearAllFiltersToolbar(),
            //save: function (e) {


            //    if (vm.IsValidCustomerMapping(e.model, true)) {
            //        //consumptionCountryService.UpdateVistexCustomer(e.model).then(function (response) {
            //        //    logger.success("Vistex Customer Mapping updated.");
            //        //}, function (response) {
            //        //    logger.error("Unable to update Vistex Customer Mapping.", response, response.statusText);
            //        //});
            //    }
            //},
            edit: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span title="Save" class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span title="Cancel" class="k-icon k-i-cancel"></span></a>');
            },
            toolbar: gridUtils.inLineClearAllFiltersToolbar(),
            columns: [
                {
                    command: [
                        { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span title='Edit' class='k-icon k-i-edit'></span></a>" },
                    ],
                    title: " ",
                    width: "100px"
                },

                {
                    field: "GEO_NM",
                    title: "Geo Name",
                    width: "230px",
                    filterable: { multi: true, search: true },
                    editor: vm.GeoDropDownEditor
                },
                {
                    field: "CNSMPTN_CTRY_NM",
                    title: "Conusumption Country",
                    width: "230px",
                    filterable: { multi: true, search: true },
                    editor: vm.CountryDropDownEditor
                }

            ]
        }
    }
})();
