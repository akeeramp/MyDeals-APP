angular
    .module('app.core')
    .directive('dealTools', dealTools);

dealTools.$inject = ['$timeout', 'logger', 'dataService'];

function dealTools($timeout, logger, dataService) {
    return {
        scope: {
            dataItem: '=ngModel',
            isEditable: '@isEditable',
            isCommentEnabled: '=?',
            isFileAttachmentEnabled: '=?'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridCell/dealTools.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            if (!$scope.isEditable || $scope.isEditable == "false" || $scope.isEditable == false || $scope.dataItem.WF_STG_CD_PRNT === "Cancelled") {
                $scope.editable = (1 === 2);
            }
            else {
                $scope.editable = (1 === 1);
            }

            if (!!$scope.isEditable) $scope.isEditable = false;

            $scope.assignVal = function (field, defval) {
                var item = $scope[field];
                return (item === undefined || item === null) ? defval : item;
            }

            $scope.isCommentEnabled = $scope.assignVal("isCommentEnabled", true);
            $scope.isFileAttachmentEnabled = $scope.assignVal("isFileAttachmentEnabled", true);

            //var prntRoot = $scope.$parent.$parent.$parent.$parent.$parent.$parent.$parent;
            var rootScope = $scope.$parent;
            if (!$scope.$parent.contractData) {
                rootScope = $scope.$parent.$parent.$parent.$parent.$parent;
            }

            $scope.stgOneChar = function () {
                return $scope.dataItem.WF_STG_CD === undefined ? "&nbsp;" : $scope.dataItem.WF_STG_CD[0];
            }

            $scope.notesActions = [
                {
                    text: 'OK',
                    action: function () {
                        if ($scope.dataItem._dirty) {
                            $scope._dirty = true;
                            rootScope.saveCell($scope.dataItem, "NOTES");
                        }
                    }
                }
            ];

            $scope.attachmentsActions = [
                {
                    text: 'Close',
                    action: function () { }
                }
            ];

            $scope.groupActions = [
                {
                    text: 'Cancel',
                    action: function () { }
                },
                {
                    text: 'Yes, Split',
                    primary: true,
                    action: function () {
                        rootScope.unGroupPricingTableRow($scope.dataItem);
                    }
                }
            ];

            $scope.deleteActions = [
                {
                    text: 'Cancel',
                    action: function () { }
                },
                {
                    text: 'Yes, Delete',
                    primary: true,
                    action: function () {
                        rootScope.deletePricingTableRow($scope.dataItem);
                    }
                }
            ];

            $scope.holdActions = [
                {
                    text: 'Cancel',
                    action: function () { }
                },
                {
                    text: 'Yes, Hold',
                    primary: true,
                    action: function () {
                        rootScope.actionWipDeal($scope.dataItem, 'Hold');
                    }
                }
            ];

            $scope.unHoldActions = [
                {
                    text: 'Cancel',
                    action: function () { }
                },
                {
                    text: 'Yes, Take off Hold',
                    primary: true,
                    action: function () {
                        rootScope.actionWipDeal($scope.dataItem, 'Approve');
                    }
                }
            ];

            $scope.notesDialogShow = function () {
            }

            $scope.attachmentsDialogShow = function () {
                this.$angular_scope.attachmentsDlgShown = true;
            }

            $scope.fileUploadOptions = { saveUrl: '/FileUpload/save', autoUpload: false };

            $scope.filePostAddParams = function (e) {
                e.data = {
                    custMbrSid: $scope.dataItem.CUST_MBR_SID,
                    objSid: $scope.dataItem.DC_ID,
                    objTypeSid: 5 // WIP_DEAL
                }
            };

            $scope.onSuccess = function (e) {
                logger.success("Successfully uploaded " + String(e.files.length) + " file(s).", null, "Upload successful");
            }

            $scope.onComplete = function (e) {
                // Refresh the Existing Attachments grid to reflect the newly uploaded file(s).
                $scope.attachmentsGridOptions.dataSource.transport.read($scope.optionCallback);
            }

            $scope.onError = function (e) {
                logger.error("Failed to upload " + String(e.files.length) + " file(s).", null, "Upload failed");
            }

            $scope.onFileSelect = function (e) {
                // Hide default kendo clear button.
                $timeout(function () {
                    $(".k-clear-selected").hide();
                    //$(".k-upload-selected").hide();
                });
            }

            $scope.onFileRemove = function (e) {
            }

            $scope.attachmentCount = 1; // Can't be 0 or initialization won't happen.
            $scope.initComplete = false;

            var attachmentsDataSource = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        $scope.optionCallback = e;
                        dataService.get("/api/Files/GetFileAttachments/" +
                            $scope.dataItem.CUST_MBR_SID +
                            "/" +
                            5 + // WIP_DEAL
                            "/" +
                            $scope.dataItem.DC_ID +
                            "/" +
                            $scope.dataItem.dc_type)
                            .then(function (response) {
                                e.success(response.data);
                                $scope.attachmentCount = response.data.length;
                                $scope.initComplete = true;
                            },
                            function (response) {
                                logger.error("Failed to get attachments.", response, response.statusText);
                                $scope.attachmentCount = -1; // Causes the 'Failed to retrieve attachments!' message to be displayed.
                                $scope.initComplete = true;
                            });
                    },
                    destroy: function (e) {
                        // If we want to support deleting attachments, the logic would go here.
                    },
                },
                pageSize: 25,
                schema: {
                    model: {
                        id: "ATTCH_SID",
                        fields: {
                            ATTCH_SID: { editable: false, nullable: true },
                            FILE_NM: { validation: { required: false }, editable: false },
                            CHG_EMP_WWID: { validation: { required: false }, editable: false },
                            CHG_DTM: { validation: { required: false }, editable: false },
                        }
                    }
                },
            });

            $scope.attachmentsGridOptions = {
                dataSource: attachmentsDataSource,
                filterable: false,
                sortable: true,
                selectable: true,
                resizable: true,
                columnMenu: false,
                editable: { mode: "inline", confirmation: false },
                columns: [
                    { field: "ATTCH_SID", title: "ID", hidden: true },
                    {
                        field: "FILE_NM",
                        title: "File Name",
                        //IE doesn't support download tag on anchor, added target='_blank' as a work around
                        template: "<a download target='_blank' href='/api/Files/OpenFileAttachment/#: FILE_DATA_SID #/'>#: FILE_NM #</a>",
                        width: "50%"
                    },
                    {
                        field: "CHG_EMP_WWID",
                        title: "Added By",
                        width: "25%"
                    },
                    {
                        field: "CHG_DTM",
                        title: "Date Added",
                        type: "date",
                        template: "#= kendo.toString(new Date(CHG_DTM), 'M/d/yyyy') #",
                        width: "25%"
                    }
                ]
            };
        }],
        link: function (scope, element, attr) {
        }
    };
}
