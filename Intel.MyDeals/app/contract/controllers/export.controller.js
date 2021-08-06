(function () {
    'use strict';

angular
    .module('app.contract')
        .controller('exportController', exportController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];


exportController.$inject = ['$scope', '$state', 'objsetService', 'logger', '$timeout', 'dataService', '$compile', 'colorDictionary', '$uibModal'];

function exportController($scope, $state, objsetService, logger, $timeout, dataService, $compile, colorDictionary, $uibModal) {
    kendo.culture("en-US");

    var root = $scope.$parent;	// Access to parent scope
    $scope.root = root;
    $scope.data = {};
    $scope.timelineData = [];
    $scope.loading = true;
    $scope.msg = "Loading Contract Data";

    $scope.showField = function (data, field, tmplt, objType) {
        var val = data[field];
        if (val === undefined || val === null) val = "";
        if (typeof val === 'string') val = val.replace(/,/g, ', ');

        if ($scope.root.templates.ModelTemplates.PRC_TBL_ROW[objType].model.fields[field].type === 'number') {
            var format = $scope.root.templates.ModelTemplates.PRC_TBL_ROW[objType].model.fields[field].format;
            if (format === "{0:c}") format = "c";
            if (format === "{0:n}") format = "n";
            if (format === "{0:d}") format = "d";
            if (val !== "" && !isNaN(val)) {
                val = kendo.toString(parseFloat(val), format);
            }
        }

        return val;
    }
    $scope.showTitle = function (title) {
        return title.replace(/\*/g, '');
    }
    $scope.showObjType = function(objType) {
        if (objType === "KIT") return "Kit";
        if (objType === "ECAP") return "ECAP";
        if (objType === "PROGRAM") return "Program";
        if (objType === "VOL_TIER") return "Volume Tier";
        if (objType === "REV_TIER") return "Rev Tier";
        if (objType === "DENSITY") return "Density Based";
        if (objType === "FLEX") return "Flex Accruals";
        return "";
    }

    $scope.timelineDs = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                url: "api/Timeline/GetObjTimelineDetails",
                type: "POST",
                data: {
                    objSid: $scope.root.contractData.DC_ID,
                    objTypeSid: 1,
                    objTypeIds: [1, 2, 3]
                },
                dataType: "json"
            }
        },
        requestEnd: function (e) {
            $scope.timelineData = e.response;
        }
    });

    $scope.export = function () {
        var htmlBody = [];
        var fname = $scope.root.contractData.displayTitle + ".pdf";
        htmlBody.push(document.getElementById('pdfContent').innerHTML); 
        //var htmlBody = ["<div><b>Jojoba</b> is the one two</div>"]; 
        var blah = dataService.postArrayBufferResponseType('/api/Contracts/v1/HtmlToPdf', htmlBody)
            .then(function (response) {
                var file = new Blob([response.data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                // Work around to avoid being blocked by chrome pop up blocker indicating this is untrusted location - VN
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = fileURL;
                a.download = fname; //"TestMe.pdf";
                a.click();
                //window.open(fileURL, "Quote Letter Preview");
                //logger.success("Successfully generated quote letter preview.");
            }, function (response) {
                logger.error("Unable to generate contract PDF.", response, response.statusText);
            });
    }

    $scope.exportDs = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                url: "/api/Contracts/v1/getExportContract/" + $scope.root.contractData.DC_ID,
                type: "GET",
                dataType: "json"
            }
        },
        requestEnd: function (e) {
            $scope.msg = "Done";
            $scope.data = e.response[0];
            $timeout(function () {
                $scope.loading = false;
            }, 500);
        }
    });

    $scope.timelineDs.read();
    $scope.exportDs.read();

    $timeout(function () {
        $("#approvalDiv").removeClass("active");
        $("#pctDiv").removeClass("active");
        $("#contractReviewDiv").addClass("active");
        $("#dealReviewDiv").removeClass("active");
        $("#historyDiv").removeClass("active");
        $("#overlapDiv").removeClass("active");
        $("#groupExclusionDiv").removeClass("active");
        $("#dealProducts").removeClass("active");
        $scope.$apply();
    }, 50);

}
})();
