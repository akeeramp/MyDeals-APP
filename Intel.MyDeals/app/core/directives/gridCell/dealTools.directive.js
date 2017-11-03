angular
    .module('app.core')
    .directive('dealTools', dealTools);

dealTools.$inject = ['$timeout', 'logger', 'dataService', '$rootScope', '$compile', '$templateRequest'];

function dealTools($timeout, logger, dataService, $rootScope, $compile, $templateRequest) {
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

            if (!$scope.isEditable || $scope.isEditable === "false" || $scope.isEditable === false || $scope.dataItem.PS_WF_STG_CD === "Cancelled") {
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

            $scope.C_DELETE_ATTACHMENTS = ($scope.dataItem.HAS_TRACKER === "1") ? false: rootScope.canDeleteAttachment($scope.dataItem.PS_WF_STG_CD);
          

            $scope.stgOneChar = function () {
                return $scope.dataItem.WF_STG_CD === undefined ? "&nbsp;" : $scope.dataItem.WF_STG_CD[0];
            }





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
                    $scope.attachmentsDataSource.read();
                    //$scope.attachmentsGridOptions.dataSource.transport.read($scope.optionCallback);

                    // Notify that attachments were removed so that the state of the paper-clip icon can be updated accordingly.
                    $rootScope.$broadcast('attachments-changed');
                }
            }


            // HOLD Items
            $scope.getHoldValue = function (dataItem) {
                if (dataItem.WF_STG_CD === 'Active') return 'NoHold';

                if (dataItem._actionsPS === undefined) dataItem._actionsPS = {};
                if (dataItem.WF_STG_CD === 'Hold') {
                    if (!!dataItem._actionsPS.Hold) return 'TakeOffHold'; // !! = If it exists - If deal is on hold and I can hold from hold stage...
                    else return 'CantRemoveHold';
                }
                else {
                    if (!!dataItem._actionsPS.Hold && dataItem._actionsPS.Hold === true) return 'CanHold';
                    else return 'NoHold';
                }
            }
            $scope.holdItems = {
                "NoHold": {
                    "icon": "fa fa-hand-paper-o",
                    "title": "Unable to place a hold on the deal at this stage",
                    "style": { color: "#e7e7e8" }
                },
                "TakeOffHold": {
                    "icon": "fa fa-thumbs-o-up",
                    "title": "Click to take the deal off hold",
                    "style": { color: "#FC4C02", cursor: "pointer" }
                },
                "CantRemoveHold": {
                    "icon": "fa fa-thumbs-o-up",
                    "title": "Unable to take the deal off of hold at this stage",
                    "style": { color: "#e7e7e8" }
                },
                "CanHold": {
                    "icon": "fa fa-hand-paper-o",
                    "title": "Click to place the deal on hold",
                    "style": { cursor: "pointer" }
                }
            }
            $scope.getHoldIcon = function (dataItem) {
                return $scope.holdItems[$scope.getHoldValue(dataItem)].icon;
            };
            $scope.getHoldTitle = function (dataItem) {
                return $scope.holdItems[$scope.getHoldValue(dataItem)].title;
            };
            $scope.getHoldStyle = function (dataItem) {
                return $scope.holdItems[$scope.getHoldValue(dataItem)].style;
            };
            $scope.clkHoldIcon = function (dataItem) {
                var hVal = $scope.getHoldValue(dataItem);
                if (hVal === "CanHold") $scope.openHoldDialog();
                if (hVal === "TakeOffHold") $scope.openUnHoldDialog();
            }



            // FILES Items
            $scope.getFileValue = function (dataItem) {
                if (!rootScope.C_VIEW_ATTACHMENTS) return "NoPerm";
                if ($scope.isFileAttachmentEnabled) {
                    if (!dataItem.HAS_ATTACHED_FILES) {
                        if (dataItem.PS_WF_STG_CD === 'Cancelled') return "CantAdd";
                        if (dataItem.PS_WF_STG_CD !== 'Cancelled') return "AddFile";
                    }
                    if (dataItem.HAS_ATTACHED_FILES === '1') return "HasFile";
                }

                return "NoPerm";
            }
            $scope.fileItems = {
                "NoPerm": {
                    "icon": "intelicon-attach",
                    "title": "You do not have permission to view attachments",
                    "style": { color: "#e7e7e8" }
                },
                "CantAdd": {
                    "icon": "intelicon-attach",
                    "title": "Cancelled, cannot add an attachment",
                    "style": { color: "#e7e7e8" }
                },
                "AddFile": {
                    "icon": "intelicon-attach",
                    "title": "Click to add an attachment",
                    "style": { color: "#00AEEF", cursor: "pointer" },
                    "onClick": $scope.openAttachments
                },
                "HasFile": {
                    "icon": "intelicon-attach",
                    "title": "Click to view or add attachments",
                    "style": { color: "#003C71", cursor: "pointer" },
                    "onClick": $scope.openAttachments
                }
            }
            $scope.getFileIcon = function (dataItem) {
                return $scope.fileItems[$scope.getFileValue(dataItem)].icon;
            };
            $scope.getFileTitle = function (dataItem) {
                return $scope.fileItems[$scope.getFileValue(dataItem)].title;
            };
            $scope.getFileStyle = function (dataItem) {
                return $scope.fileItems[$scope.getFileValue(dataItem)].style;
            };
            $scope.clkFileIcon = function (dataItem) {

                var fVal = $scope.getFileValue(dataItem);

                //Forces datasource web API call 
                $scope.attachmentsDataSource.read().then(function () {
                    var view = $scope.attachmentsDataSource.view();

                    $scope.attachmentCount = (view === null || view === undefined) ? 0 : view.length;
                    console.log($scope.attachmentCount);

                    $scope.dataItem.HAS_ATTACHED_FILES = $scope.attachmentCount > 0 ? "1" : "0";
                    rootScope.saveCell($scope.dataItem, "HAS_ATTACHED_FILES");

                    $scope.initComplete = true;
                    kendo.ui.progress($("#attachmentsGrid"), false);
                });
                if (fVal === "HasFile" || fVal === "AddFile") $scope.openAttachments();
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
                kendo.confirm("Are you sure that you want to Delete this file attachment?").then(function () {
                    dataService.post("/api/FileAttachments/Delete/" + deleteAttachmentParams.custMbrSid + "/" + deleteAttachmentParams.objTypeSid + "/" + deleteAttachmentParams.objSid + "/" + deleteAttachmentParams.fileDataSid + "/WIP_DEAL")
                        .then(function (response) {
                            logger.success("Successfully deleted attachment.", null, "Delete successful");

                            // Refresh the Existing Attachments grid to reflect the newly deleted attachment.
                            $scope.attachmentsDataSource.read();

                            // Notify that attachments were added so that the state of the paper-clip icon can be updated accordingly.
                            $rootScope.$broadcast('attachments-changed');
                        },
                        function (response) {
                            logger.error("Unable to delete attachment.", null, "Delete failed");

                            // Refresh the Existing Attachments grid.  There should be no changes, but just incase.
                            $scope.attachmentsDataSource.read();
                        });
                });
            }

            $scope.attachmentCount = 1; // Can't be 0 or initialization won't happen.
            $scope.initComplete = false;

            $scope.getAttachmentDatasourceURL = function () {
                return "/api/FileAttachments/Get/" + $scope.dataItem.CUST_MBR_SID + "/" + 5 + // WIP_DEAL
                                "/" + $scope.dataItem.DC_ID + "/" + $scope.dataItem.dc_type;

            }

            $scope.attachmentsDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: $scope.getAttachmentDatasourceURL(),
                        dataType: "json"                        
                    }
                },
                requestStart: function () {
                    kendo.ui.progress($("#attachmentsGrid"), true);
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
                }
            });

            $scope.attachmentsGridOptions = {
                dataSource: $scope.attachmentsDataSource,
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
                        template: "<a class='delete-attach-icon' ng-if='C_DELETE_ATTACHMENTS' ng-click='deleteAttachment(#= CUST_MBR_SID #, #= OBJ_TYPE_SID #, #= OBJ_SID #, #= FILE_DATA_SID #)'><i class='intelicon-trash-outlined' title='Click to delete this attachment'></i></a>",
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

            $scope.dialog = $("#notesDialog");

            $scope.openNotes = function () {

                var scope = $scope;
                $scope.dialog = $("#notesDialog");

                $scope.dialog.kendoDialog({
                    width: "500px",
                    height: "350px",
                    title: "Notes",
                    closable: false,
                    modal: true,
                    actions: [
                        {
                            text: 'OK',
                            primary: true,
                            action: function () {
                                if ($scope.dataItem._dirty) {
                                    $scope._dirty = true;
                                    rootScope.saveCell($scope.dataItem, "NOTES");
                                    $rootScope.$broadcast('data-item-changed', 'NOTES', $scope.dataItem);
                                }
                            }
                        }
                    ]
                });


                $templateRequest("/app/core/directives/gridCell/_partials/notes.html").then(function (html) {
                    var template = angular.element(html);
                    $compile(template)(scope);
                    $scope.dialog.data("kendoDialog").content(template);
                });

            }

            $scope.openSplit = function () {
                kendo.confirm("<h4>Would you like to split the group?</h4><p>This will allow you to make changes in the Deal Editor.<br />Please note a new Row ID will be assigned for your reference.").then(function () {
                    rootScope.unGroupPricingTableRow($scope.dataItem);
                });
            }
         
            $scope.openAttachments = function () {                
                var scope = $scope;
                $scope.dialog = $("#fileDialog");

                $scope.dialog.kendoDialog({
                    width: "900px",
                    height: "620px",
                    title: "Deal " + $scope.dataItem.DC_ID + " Attachments",
                    closable: false,
                    modal: true,
                    actions: [
                        {
                            text: 'Close',
                            primary: true
                        }
                    ]
                });

                $scope.dialog.data("kendoDialog").open();
                $templateRequest("/app/core/directives/gridCell/_partials/files.html").then(function (html) {
                    var template = angular.element(html);
                    $compile(template)(scope);
                    $scope.dialog.data("kendoDialog").content(template);
                    $scope.attachmentsDlgShown = true;
                });

            }

            $scope.openDeleteDialog = function () {
                kendo.confirm("<h4>Would you like to delete the deal?</h4><p>This will remove the deal from the Pricing Editor also.</p>").then(function () {
                    rootScope.deletePricingTableRow($scope.dataItem);
                });
            }

            $scope.openHoldDialog = function () {
                kendo.confirm("<h4>Would you like to place the deal on hold?</h4><p>This will keep the deal in the Pricing Table, but it will not get<br/>promoted to active or get a tracker number for payment.</p>").then(function () {
                    rootScope.actionWipDeal($scope.dataItem, 'Hold');
                });
            }

            $scope.openUnHoldDialog = function () {
                kendo.confirm("<h4>Would you like to take the deal off hold?</h4><p>This will enable the deal in the Pricing Table and will<br/>enable it to get approved.</p>").then(function () {
                    rootScope.actionWipDeal($scope.dataItem, 'Approve');
                });
            }

        }],
        link: function (scope, element, attr) {
            scope.el = element;
        }
    };
}
