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
        transport: {
            read: {
                url: "/api/Employees/GetUsrProfileRole",
                dataType: "json"
            }
        },
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