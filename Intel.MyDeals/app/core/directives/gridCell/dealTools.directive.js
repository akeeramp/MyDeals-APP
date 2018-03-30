angular
    .module('app.core')
    .directive('dealTools', dealTools);

dealTools.$inject = ['$timeout', 'logger', 'objsetService', 'dataService', '$rootScope', '$compile', '$templateRequest', 'colorDictionary'];

function dealTools($timeout, logger, objsetService, dataService, $rootScope, $compile, $templateRequest, colorDictionary) {
    return {
        scope: {
            dataItem: '=ngModel',
            isEditable: '@isEditable',
            isCommentEnabled: '<?',
            isFileAttachmentEnabled: '<?',
            isQuoteLetterEnabled: '<?',
            isDeleteEnabled: '<?'
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
            $scope.fileUploading = false;
            $scope.objTypeSid = 5; //WIP deals
            $scope.assignVal = function (field, defval) {
                var item = $scope[field];
                return (item === undefined || item === null) ? defval : item;
            }

            $scope.isCommentEnabled = $scope.assignVal("isCommentEnabled", true);
            $scope.isFileAttachmentEnabled = $scope.assignVal("isFileAttachmentEnabled", true);
            $scope.isQuoteLetterEnabled = $scope.assignVal("isQuoteLetterEnabled", true);
            $scope.isDeleteEnabled = $scope.assignVal("isDeleteEnabled", true);

            if ($scope.dataItem.OBJ_SET_TYPE_CD !== 'ECAP' && $scope.dataItem.OBJ_SET_TYPE_CD !== 'KIT') $scope.isQuoteLetterEnabled = false;

            //var prntRoot = $scope.$parent.$parent.$parent.$parent.$parent.$parent.$parent;
            var rootScope = $scope.$parent;
            if (!$scope.$parent.contractData) {
                rootScope = $scope.$parent.$parent.$parent.$parent.$parent;
            }
            $scope.rootScope = rootScope;

            $scope.C_DELETE_ATTACHMENTS = ($scope.dataItem.HAS_TRACKER === "1") ? false: rootScope.canDeleteAttachment($scope.dataItem.PS_WF_STG_CD);
          
            if ($scope.rootScope.C_DEL_DEALS === false) {
                $scope.isDeleteEnabled = false;
            }

            $scope.stgOneChar = function () {
                return gridUtils.stgOneChar($scope.dataItem);
            }

            $scope.stgFullTitleChar = function () {
                return gridUtils.stgFullTitleChar($scope.dataItem);
            }

            $scope.notesDialogShow = function () {
            }

            $scope.attachmentsDialogShow = function () {
                this.$angular_scope.attachmentsDlgShown = true;
            }

            $scope.fileUploadOptions = { saveUrl: '/FileAttachments/Save', autoUpload: false };

            $scope.filePostAddParams = function (e) {
                $scope.fileUploading = true;
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
                $scope.fileUploading = false;
                if (uploadErrorCount > 0) {
                    logger.error("Unable to upload " + uploadErrorCount + " attachment(s).", null, "Upload failed");
                }

                // Refresh the Existing Attachments grid to reflect the newly uploaded attachments(s).
                if (uploadSuccessCount > 0) {
                    logger.success("Successfully uploaded " + uploadSuccessCount + " attachment(s).", null, "Upload successful");

                    $scope.attachmentsDataSource.read();
                    //$scope.attachmentsGridOptions.dataSource.transport.read($scope.optionCallback);

                    // Notify that attachments were removed so that the state of the paper-clip icon can be updated accordingly.
                    $rootScope.$broadcast('attachments-changed');
                }
            }


            // HOLD Items
            $scope.getHoldValue = function (dataItem) {
                if (dataItem.WF_STG_CD === 'Active') return 'NoShowHold';

                if (dataItem._actionsPS === undefined) dataItem._actionsPS = {};
                if (dataItem.WF_STG_CD === 'Hold') {
                    if (!!dataItem._actionsPS.Hold) return 'TakeOffHold'; // !! = If it exists - If deal is on hold and I can hold from hold stage...
                    else return 'CantRemoveHold';
                }
                else {
                    if ((!!dataItem._actionsPS.Hold && dataItem._actionsPS.Hold === true) && dataItem.WF_STG_CD !== 'Cancelled') return 'CanHold';
                    else return 'NoHold';
                }
            }
            $scope.holdItems = {
                "NoShowHold": { // The rest of this item don't really matter since it is bypassing drawing all togeather, but....
                    "icon": "fa fa-hand-paper-o",
                    "title": "Unable to place a hold on the deal at this stageXX",
                    "style": { color: "#e7e7e8" }
                },
                "NoHold": {
                    "icon": "fa fa-hand-paper-o",
                    "title": "Unable to place a hold on the deal at this stageXX",
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
                if (!$scope.rootScope.C_HOLD_DEALS) {
                    return "";
                } else {
                    return $scope.holdItems[$scope.getHoldValue(dataItem)].title;
                }
            };
            $scope.getHoldStyle = function (dataItem) {
                if (!$scope.rootScope.C_HOLD_DEALS) {
                    return { color: "#dddddd" };
                } else {
                    return $scope.holdItems[$scope.getHoldValue(dataItem)].style;
                }

            };
            $scope.clkHoldIcon = function (dataItem) {
                if (!$scope.rootScope.C_HOLD_DEALS) return;
                var hVal = $scope.getHoldValue(dataItem);
                var ids = $scope.getLinkedHoldIds(dataItem);
                if (hVal === "CanHold") $scope.openHoldDialog(ids);
                if (hVal === "TakeOffHold") $scope.openUnHoldDialog(ids);
            }

            $scope.getLinkedHoldIds = function (model) {
                var ids = [];
                if (model.isLinked !== undefined && model.isLinked) {
                    var curHoldStatus = model._actionsPS.Hold === undefined ? false : model._actionsPS.Hold;
                    var data = $scope.el.closest(".k-grid").data("kendoGrid").dataSource.data();
                    for (var v = 0; v < data.length; v++) {
                        var dataItem = data[v];
                        if (dataItem.isLinked !== undefined && dataItem.isLinked) {
                            if (dataItem._actionsPS === undefined) dataItem._actionsPS = {};
                            if (dataItem._actionsPS.Hold !== undefined && dataItem._actionsPS.Hold === curHoldStatus && (dataItem.WF_STG_CD === model.WF_STG_CD)) {
                                ids.push({
                                    DC_ID: dataItem["DC_ID"],
                                    WF_STG_CD: dataItem["WF_STG_CD"]
                                });
                            }
                        }
                    }
                } else {
                    ids.push({
                        DC_ID: model["DC_ID"],
                        WF_STG_CD: model["WF_STG_CD"]
                    });
                }
                return ids;
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
                $scope.attachmentsDataSource.read();
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
                requestEnd: function (e) {
                    var view = e.response;

                    $scope.attachmentCount = (view === null || view === undefined) ? 0 : view.length;
                    console.log($scope.attachmentCount);

                    $scope.dataItem.HAS_ATTACHED_FILES = $scope.attachmentCount > 0 ? "1" : "0";
                    rootScope.saveCell($scope.dataItem, "HAS_ATTACHED_FILES");

                    $scope.initComplete = true;
                    kendo.ui.progress($("#attachmentsGrid"), false);
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
                                    $rootScope.$broadcast('data-item-changed', 'NOTES', $scope.dataItem, scope.el);
                                }
                            }
                        }
                    ]
                });

                $scope.dialog.data("kendoDialog").open();
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
         
            $scope.getLinkedIds = function (model) {
                var ids = [];
                if (model.isLinked !== undefined && model.isLinked) {
                    var data = $scope.el.closest(".k-grid").data("kendoGrid").dataSource.data();
                    for (var v = 0; v < data.length; v++) {
                        var dataItem = data[v];
                        if (dataItem.isLinked !== undefined && dataItem.isLinked) {
                            ids.push(dataItem["DC_ID"]);
                        }
                    }
                }
                return ids;
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
                if ($scope.getLinkedIds($scope.dataItem).length > 1) {
                    kendo.alert("<h4>Unable to Delete</h4><p>You cannot delete multiple deals.  Please uncheck all deals before trying to delete.</p>");
                    return;
                }
                kendo.confirm("<h4>Would you like to delete the deal?</h4><p>This will remove the deal from the Pricing Editor also.</p>").then(function () {
                    rootScope.deletePricingTableRow($scope.dataItem);
                });
            }

            $scope.openCancelDialog = function () {
                if ($scope.getLinkedIds($scope.dataItem).length > 1) {
                    kendo.alert("<h4>Unable to Delete</h4><p>You cannot cancel multiple deals.  Please uncheck all deals before trying to cancel.</p>");
                    return;
                }
                kendo.confirm("<h4>Would you like to cancel this deal?</h4><p>This will set the deal stage to Canceled.</p>").then(function () {
                    rootScope.actionWipDeal($scope.dataItem, 'Cancel'); 
                });
            }

            $scope.openRollBackDialog = function () {
                if ($scope.getLinkedIds($scope.dataItem).length > 1) {
                    kendo.alert("<h4>Unable to Delete</h4><p>You cannot rollback multiple deals.  Please uncheck all deals before trying to rollback.</p>");
                    return;
                }
                kendo.confirm("<h4>Would you like to undo this deals current re-deal action?</h4><p>This will remove the deal edits from the Pricing Editor also.</p>").then(function () {
                    rootScope.rollbackPricingTableRow($scope.dataItem);
                });
            }

            $scope.openHoldDialog = function (ids) {
                var dealTxt = ids.length > 0 ? "deals" : "deal";
                kendo.confirm("<h4>Would you like to place the " + dealTxt + " on hold?</h4><p>This will keep the " + dealTxt + " in the Pricing Table, but it will not get<br/>promoted to active or get a tracker number for payment.</p>").then(function () {
                    $scope.actionHoldWipDeals({
                        Hold: ids
                    });
                });
            }

            $scope.openUnHoldDialog = function (ids) {
                var dealTxt = ids.length > 0 ? "deals" : "deal";
                kendo.confirm("<h4>Would you like to take the " + dealTxt + " off hold?</h4><p>This will enable the " + dealTxt + " in the Pricing Table and will<br/>enable it to get approved.</p>").then(function () {
                    $scope.actionHoldWipDeals({
                        Approve: ids
                    });
                });
            }

            $scope.actionHoldWipDeals = function (data) {
                $rootScope.$broadcast('busy', "Updating Deals", "Updating hold status of Deals.");
                objsetService.actionWipDeals($scope.rootScope.contractData.CUST_MBR_SID, $scope.rootScope.contractData.DC_ID, data).then(
                    function (returnData) {
                        //debugger;
                        $rootScope.$broadcast('SyncHiddenItems', returnData, data);
                        $rootScope.$broadcast('busy', "", "");
                    },
                    function (result) {
                        $rootScope.$broadcast('busy', "", "");
                        //debugger;
                    }
                );
            }

            $scope.showQuote = function (dataItem) {
                return dataItem.WF_STG_CD !== 'Cancelled' && dataItem.BID_STATUS !== 'Lost' && (dataItem.WF_STG_CD === 'Active' || dataItem.PS_WF_STG_CD === 'Pending' || dataItem.HAS_TRACKER === '1');
            }

            // US87523 - Strategy Stage / Deal Status Clarity - This is very hack-ish coding by a JS newbie.
            // Taken from Phil's absolutely awesome other color-coding areas in other JS files...  Had to hijack local function getStageBgColorStyle(stgFullTitleChar()) to get the right stage though.
            $scope.getStageBgColorStyle = function (c) {
                return { backgroundColor: $scope.getColorStage(c) };
            }
            $scope.getColor = function (k, c) {
                if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
                    return colorDictionary[k][c];
                }
                return "#aaaaaa";
            }
            $scope.getColorStage = function (d) {
                if (!d) d = "Draft";
                return $scope.getColor('stage', d);
            }

            $scope.downloadQuoteLetter = function () {
                rootScope.downloadQuoteLetter($scope.dataItem.CUST_MBR_SID, $scope.objTypeSid, $scope.dataItem.DC_ID);
            }

        }],
        link: function (scope, element, attr) {
            scope.el = element;
        }
    };
}
