(function () {
    'use strict';
    angular
		.module('app.costtest')
		.controller('iCostProductsController', iCostProductsController)

    iCostProductsController.$inject = ['$uibModal', 'iCostProductService', 'logger', '$scope']

    function iCostProductsController($uibModal, iCostProductService, logger, $scope) {
        var vm = this;

        vm.verticals = [
            { name: "EIA CPU" },
            { name: "LOM" },
            { name: "CS" },
            { name: "EIA CS" },
            { name: "EPSD" },
            { name: "DHG/SPD" },
            { name: "ECG" },
            { name: "PLATFORM_KIT" },
            { name: "NIC" },
            { name: "ECPD EMD" },
            { name: "IA SW/Service" },
            { name: "CPU" },
            { name: "NULL" },
            { name: "NAND (SSD)" },
            { name: "SMART PHONE" },
            { name: "WC" },
            { name: "NAND" },
            { name: "LAD" },
            { name: "FMG" },
            { name: "PCG MISC" },
            { name: "IMC" },
            { name: "Cable Modem" },
            { name: "EIA MISC" },
            { name: "World Ahead" },
            { name: "UPSD" },
            { name: "TCD" },
            { name: "Other" },
        ];

        vm.levels = [
            { name: 'L1' },
            { name: 'L2' },
            { name: 'Exempt' }
        ];

        var data = '{"group": {"operator": "AND","rules": []}}';

        function htmlEntities(str) {
            return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function computed(group) {
            if (!group) return "";
            for (var str = "(", i = 0; i < group.rules.length; i++) {
                i > 0 && (str += " <strong>" + group.operator + "</strong> ");
                str += group.rules[i].group ?
                    computed(group.rules[i].group) :
                    group.rules[i].criteria + " " + htmlEntities(group.rules[i].condition) + " " + group.rules[i].data;
            }

            return str + ")";
        }

        vm.filter = JSON.parse(data);

        $scope.$watch('vm.filter', function (newValue) {
            vm.output = computed(newValue.group);
        }, true);
    }
})();