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
        schema: {
            parse: function(data) {
                // Example adding a new field to the received data
                // that computes price as price times quantity.
                $.each(data, function(idx, elem) {
                    elem.searchText = elem.LST_NM + ", " + elem.FRST_NM + " " + elem.EMAIL_ADDR;
                });
                return data;
            }
        },
        filter: $scope.getFilter()
    });

    $scope.selectOptions = {
        placeholder: "Select email address...",
        dataTextField: "searchText",
        dataValueField: "searchText",
        itemTemplate: '<div class="tmpltItem">' +
                        '<div class="fl tmpltIcn"><i class="intelicon-email-message-solid"></i></div>' +
                        '<div class="fl tmpltContract"><div class="tmpltPrimary">#: data.LST_NM #, #: data.FRST_NM #</div><div class="tmpltSecondary">#: data.EMAIL_ADDR #</div></div>' +
                        '<div class="fr tmpltRole">#: data.ROLE_NM #</div>' +
                        '<div class="clearboth"></div>' +
                        '</div>',
        tagTemplate: '<div class="tmpltItem">' +
                        '<div class="fl tmpltIcn"><i class="intelicon-email-message-solid"></i></div>' +
                        '<div class="fl tmpltContract"><div class="tmpltPrimary" style="text-align: left;">#: data.LST_NM #, #: data.FRST_NM #</div><div class="tmpltSecondary">#: data.EMAIL_ADDR #</div></div>' +
                        '<div class="clearboth"></div>' +
                        '</div>',
        valuePrimitive: false,
        filter: "contains",
        autoBind: false,
        dataSource: $scope.ds
    };
    $scope.selectedIds = [];

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
        return ($scope.dataItem.to.length === 0 || $scope.dataItem.subject === "" || $scope.dataItem.body === "");
    }

    $scope.sendEmail = function() {
        var url = "/Email/EmailNotification";
        var to = [];
        for (var e = 0; e < $scope.dataItem.to.length; e++) to.push($scope.dataItem.to[e].EMAIL_ADDR);

        var dataItem = {
            Subject: $scope.dataItem.subject,
            Body: $scope.dataItem.body,
            From: $scope.dataItem.from,
            To: to
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