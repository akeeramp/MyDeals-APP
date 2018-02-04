angular
    .module('app.contract')
    .controller('emailModalCtrl', emailModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

emailModalCtrl.$inject = ['$scope', '$uibModalInstance', 'dataItem'];

function emailModalCtrl($scope, $uibModalInstance, dataItem) {

    $scope.dataItem = dataItem;
    $scope.roles = ["FSE", "GA", "DA", "ALL"];
    $scope.roleFilter = "ALL";
    if (window.usrRole === "FSE") $scope.roleFilter = "GA";
    if (window.usrRole === "GA") $scope.roleFilter = "DA";

    $scope.applyRoleClass = function (item) {
        return $scope.roleFilter === item;
    }

    $scope.getFilter = function () {
        if ($scope.roleFilter === "ALL") {
            return {};
        } else {
            return {
                field: "ROLE_NM",
                operator: "eq",
                value: $scope.roleFilter
            };
        }
    }

    $scope.selectRole = function (item) {
        $scope.roleFilter = item;
        $scope.ds.filter($scope.getFilter());
        $scope.ds.read();
    }

    $scope.ds = new kendo.data.DataSource({
        data: [
            {
                EMP_WWID: "10505693",
                FRST_NM: "Philip",
                LST_NM: "Eckenroth",
                MI: "W",
                EMAIL_ADDR: "philip.w.eckenroth@intel.com",
                IDSID: "PWECKENR",
                ROLE_NM: "DA",
                USR_ACTV_IND: "1"
            },
            {
                EMP_WWID: "10505693",
                FRST_NM: "John",
                LST_NM: "Doe",
                MI: "W",
                EMAIL_ADDR: "philip.w.eckenroth@intel.com",
                IDSID: "PWECKENR",
                ROLE_NM: "SA",
                USR_ACTV_IND: "1"
            },
            {
                EMP_WWID: "10505693",
                FRST_NM: "Jane",
                LST_NM: "Doe",
                MI: "W",
                EMAIL_ADDR: "philip.w.eckenroth@intel.com",
                IDSID: "PWECKENR",
                ROLE_NM: "FSE",
                USR_ACTV_IND: "1"
            },
            {
                EMP_WWID: "10505693",
                FRST_NM: "Michael",
                LST_NM: "Tipping",
                MI: "H",
                EMAIL_ADDR: "michael.h.tipping@intel.com",
                IDSID: "MHTIPPIN",
                ROLE_NM: "LEGAL",
                USR_ACTV_IND: "1"
            }
        ],
        filter: $scope.getFilter()
    });

    $scope.selectOptions = {
        placeholder: "Select email address...",
        dataTextField: "EMAIL_ADDR",
        dataValueField: "EMAIL_ADDR",
        itemTemplate: '<div class="tmpltItem">' +
                        '<div class="fl tmpltIcn"><i class="intelicon-email-message-solid"></i></div>' +
                        '<div class="fl tmpltContract"><div class="tmpltPrimary">#: data.LST_NM #, #: data.FRST_NM #</div><div class="tmpltSecondary">#: data.EMAIL_ADDR #</div></div>' +
                        '<div class="fr tmpltRole">#: data.ROLE_NM #</div>' +
                        '<div class="clearboth"></div>' +
                        '</div>',
        valuePrimitive: true,
        filter: "contains",
        autoBind: false,
        dataSource: $scope.ds
    };
    $scope.selectedIds = [4, 7];

    $scope.editorOptions = {
        tools: [
                "bold",
                "italic",
                "underline",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "justifyFull",
                "insertUnorderedList",
                "insertOrderedList",
                "indent",
                "outdent",
                "unlink",
                "fontSize",
                "foreColor"
        ]

    }

    $scope.disableEmailButton = function () {
        return ($scope.dataItem.to.length === 0 || $scope.dataItem.subject === "" || $scope.dataItem.body === "")
    }

    $scope.sendEmail = function() {
        var url = "/Email/EmailNotification";
        var dataItem = {
            Subject: $scope.dataItem.subject,
            Body: $scope.dataItem.body,
            From: $scope.dataItem.from,
            To: $scope.dataItem.to
        };
        op.ajaxPostAsync(url, dataItem, function(e) {
        }, function (e) {
        });
    }

    $scope.close = function () {
        $uibModalInstance.dismiss();
    };

    $scope.ok = function () {
        $scope.sendEmail();
        $uibModalInstance.dismiss();
    };

}