angular
    .module("app.admin")
    .controller("BulkUploadMeetCompModalController", BulkUploadMeetCompModalController)
    .run(SetRequestVerificationToken);

SetRequestVerificationToken.$inject = ["$http"];

BulkUploadMeetCompModalController.$inject = ["$rootScope", "$location", "meetCompService", "$scope", "$stateParams", "logger", "$timeout", "gridConstants", "$uibModalInstance"];

function BulkUploadMeetCompModalController($rootScope, $location, meetCompService, $scope, $stateParams, logger, $timeout, gridConstants, $uibModalInstance) {
    var vm = this;
    var hasUnSavedFiles = false;
    var hasFiles = false;
    var uploadSuccessCount = 0;
    var uploadErrorCount = 0;
    vm.ExtractedMeetComp = [];

    vm.fileUploadOptions = {
        async: {
            saveUrl: '/FileAttachments/ExtractMeetCompFile',
            autoUpload: false
        },
        validation: {
            allowedExtensions: [".xlsx"]
        }
    };

    vm.onFileSelect = function (e) {
        // Hide default kendo upload and clear buttons as contract is not generated at this point. Upload files after contract id is generated.
        // TODO: Do we want to show them in edit scenario ?
        $timeout(function () {
            $(".k-clear-selected").hide();
            $(".k-upload-selected").hide();
        });

        hasUnSavedFiles = true;
    }

    vm.filePostAddParams = function (e) {
        uploadSuccessCount = 0;
        uploadErrorCount = 0;
    };

    vm.onSuccess = function (e) {
        uploadSuccessCount++;
        vm.ExtractedMeetComp = e.response;
        vm.MeetCompDataSource.read();
    }

    vm.onError = function (e) {
        uploadErrorCount++;
    }

    vm.onComplete = function (e) {
        if (uploadSuccessCount > 0) {
            logger.success("Successfully uploaded " + uploadSuccessCount + " attachment(s).", null, "Upload successful");
        }
        if (uploadErrorCount > 0) {
            logger.error("Unable to upload " + uploadErrorCount + " attachment(s).", null, "Upload failed");
        }

        $timeout(function () {
            $scope._dirty = false; // don't want to kick of listeners
        });
    }

    vm.uploadFile = function (e) {
        $(".k-upload-selected").click();
    }

    vm.MeetCompDataSource = new kendo.data.DataSource({
        transport: {
            read: function (e) {
                e.success(vm.ExtractedMeetComp);
            }
        },
        pageSize: 25,
        schema: {
            model: {
                fields: {
                    CUST_NM: { editable: true, nullable: false },
                    HIER_VAL_NM: { editable: true, nullable: false },
                    MEET_COMP_PRD: { editable: true, nullable: false },
                    MEET_COMP_PRC: { editable: true, nullable: false },
                    IA_BNCH: { editable: true, nullable: false },
                    COMP_BNCH: { editable: true, nullable: false }
                }
            }
        }
    });

    vm.MeetCompOptions = {
        dataSource: vm.MeetCompDataSource,
        filterable: true,
        sortable: true,
        selectable: true,
        resizable: true,
        columnMenu: true,
        sort: function (e) { gridUtils.cancelChanges(e); },
        filter: function (e) { gridUtils.cancelChanges(e); },
        toolbar: gridUtils.inLineClearAllFiltersToolbarRestricted(true),
        editable: { mode: "inline", confirmation: false },
        pageable: {
            refresh: true
        },
        save: function (e) {

        },
        edit: function (e) {
            var commandCell = e.container.find("td:first");
            commandCell.html('<a class="k-grid-update" href="#"><span title="Save" class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span title="Cancel" class="k-icon k-i-cancel"></span></a>');
        },
        columns: [
            {
                command: [
                    { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span title='Edit' class='k-icon k-i-edit'></span></a>" },
                ],
                title: " ",
                width: "6%"
            },
            { field: "CUST_NM", title: "Customer", filterable: { multi: true, search: true } },
            { field: "HIER_VAL_NM", title: "Product", filterable: { multi: true, search: true } },
            { field: "MEET_COMP_PRD", title: "Meet Comp SKU", filterable: { multi: true, search: true }, groupable: false },
            { field: "MEET_COMP_PRC", title: "Meet Comp Price", format: "{0:c}", groupable: false },
            { field: "IA_BNCH", title: "IA Bench", groupable: false },
            { field: "COMP_BNCH", title: "Comp Bench", groupable: false },
        ]
    };

    vm.ok = function () {
        $uibModalInstance.close();
    };
}
