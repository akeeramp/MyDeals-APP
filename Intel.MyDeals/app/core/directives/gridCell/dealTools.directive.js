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
            $scope.rootScope = rootScope;

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

            $scope.deleteAttachmentActions = [
                {
                    text: 'Cancel',
                    action: function () { }
                },
                {
                    text: 'Yes, Delete',
                    primary: true,
                    action: function () {
                        dataService.post("/api/FileAttachments/Delete/" + deleteAttachmentParams.custMbrSid + "/" + deleteAttachmentParams.objTypeSid + "/" + deleteAttachmentParams.objSid + "/" + deleteAttachmentParams.fileDataSid + "/WIP_DEAL")
                            .then(function (response) {
                                logger.success("Successfully deleted attachment.", null, "Delete successful");

                                // Refresh the Existing Attachments grid to reflect the newly deleted attachment.
                                $scope.attachmentsGridOptions.dataSource.transport.read($scope.optionCallback);
                            },
                            function (response) {
                                logger.error("Unable to delete attachment.", null, "Delete failed");

                                // Refresh the Existing Attachments grid.  There should be no changes, but just incase.
                                $scope.attachmentsGridOptions.dataSource.transport.read($scope.optionCallback);
                            });
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

            $scope.fileUploadOptions = { saveUrl: '/FileAttachments/Save', autoUpload: false };

            $scope.filePostAddParams = function (e) {
                uploadSuccessCount = 0;
                uploadErrorCount = 0;
                e.data = {
                    custMbrSid: $scope.dataItem.CUST_MBR_SID,
                    objSid: $scope.dataItem.DC_ID,
                    objTypeSid: 5 // WIP_DEAL
                }
            };

            var uploadSuccessCount = 0;
            $scope.onSuccess = function (e) {
                uploadSuccessCount++;
            }

            var uploadErrorCount = 0;
            $scope.onError = function (e) {
                uploadErrorCount++;
            }

            $scope.onComplete = function (e) {
                if (uploadSuccessCount > 0) {
                    logger.success("Successfully uploaded " + uploadSuccessCount + " attachment(s).", null, "Upload successful");
                }
                if (uploadErrorCount > 0) {
                    logger.error("Unable to upload " + uploadErrorCount + " attachment(s).", null, "Upload failed");
                }

                // Refresh the Existing Attachments grid to reflect the newly uploaded attachments(s).
                if (uploadSuccessCount > 0) {
                    $scope.attachmentsGridOptions.dataSource.transport.read($scope.optionCallback);
                }
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

            var deleteAttachmentParams;
            $scope.deleteAttachment = function (custMbrSid, objTypeSid, objSid, fileDataSid) {
                deleteAttachmentParams = { custMbrSid: custMbrSid, objTypeSid: objTypeSid, objSid: objSid, fileDataSid: fileDataSid };
                $scope.deleteAttachmentDialog.open();
            }

            $scope.attachmentCount = 1; // Can't be 0 or initialization won't happen.
            $scope.initComplete = false;

            var attachmentsDataSource = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        $scope.optionCallback = e;
                        dataService.get("/api/FileAttachments/Get/" +
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
                                logger.error("Unable to retrieve attachments.", response, response.statusText);
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
                        field: "FILE_DATA_SID",
                        title: "&nbsp;",
                        template: "<a class='delete-attach-icon' ng-if='rootScope.C_DELETE_ATTACHMENTS' ng-click='deleteAttachment(#= CUST_MBR_SID #, #= OBJ_TYPE_SID #, #= OBJ_SID #, #= FILE_DATA_SID #)'><i class='intelicon-trash-outlined' title='Click to delete this attachment'></i></a>",
                        width: "10%"
                    },
                    {
                        field: "FILE_NM",
                        title: "File Name",
                        //IE doesn't support download tag on anchor, added target='_blank' as a work around
                        template: "<a download target='_blank' href='/api/FileAttachments/Open/#: FILE_DATA_SID #/'>#: FILE_NM #</a>",
                        width: "40%"
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
