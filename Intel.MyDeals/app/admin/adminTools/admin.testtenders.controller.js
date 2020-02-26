(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('TestTendersController', TestTendersController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    TestTendersController.$inject = ['adminTools','$scope', 'logger'];

    function TestTendersController(adminTools,$scope, logger) {
        var vm = this;
        $scope.testTendersData = {};

        $scope.ExcutetestTendersData = function () {
            var JsonObj = {
                'header': {
                    'source_system': 'pricing_tenders',
                    'target_system': 'mydeals',
                    'action': 'create',
                    'xid': '152547827hdhdh'
                },
                'recordDetails': {
                    'SBQQ__Quote__c': {
                        'Id': $scope.testTendersData.CNTRCT_SF_ID,
                        'Name': 'Q-02446',
                        'Pricing_Folio_ID_Nm__c': '',
                        'SBQQ__Account__c': {
                            'Id': $scope.testTendersData.CNTRCT_ID,
                            'Name': $scope.testTendersData.CNTRCT_CUST,
                            'Core_CIM_ID__c': ''
                        },
                        'Pricing_Deal_Type_Nm__c': 'ECAP',
                        'Pricing_Customer_Nm__c': $scope.testTendersData.END_CUST,
                        'Pricing_Project_Name_Nm__c': 'FMH',
                        'Pricing_ShipmentStDate_Dt__c': $scope.testTendersData.START_DT,
                        'Pricing_ShipmentEndDate_Dt__c': $scope.testTendersData.END_DT,
                        'Pricing_Server_Deal_Type_Nm__c': 'HPC',
                        'Pricing_Region_Nm__c': $scope.testTendersData.GEO,
                        'SBQQ__QuoteLine__c': [
                            {
                                'Id': $scope.testTendersData.DEAL_SF_ID,
                                'Name': 'QL-0200061',
                                'Pricing_Deal_RFQ_Status_Nm__c': '',
                                'Pricing_ECAP_Price__c': $scope.testTendersData.ECAP,
                                'Pricing_Meet_Comp_Price_Amt__c': '90',
                                'Pricing_Unit_Qty__c': $scope.testTendersData.VOLUME,
                                'Pricing_Deal_RFQ_Id__c': $scope.testTendersData.DEAL_ID,
                                'Pricing_Status_Nm__c': '',
                                'SBQQ__Product__c': {
                                    'Id': '001i000001AWbWu',
                                    'Name': $scope.testTendersData.PROD_IDs,
                                    'Core_Product_Name_EPM_ID__c': '192283'
                                },
                                'Pricing_Competetor_Product__c': {
                                    'Id': '',
                                    'Name': ''
                                },
                                'Pricing_Performance_Metric__c': [
                                    {
                                        'Id': '001i000001AWbWu',
                                        'Name': 'PM-000010',
                                        'Pricing_Performance_Metric_Nm__c': 'SpecInt',
                                        'Pricing_Intel_SKU_Performance_Nbr__c': '10',
                                        'Pricing_Comp_SKU_Performance_Nbr__c': '9',
                                        'Pricing_Weighting_Pct__c': '100'
                                    }
                                ]
                            }
                        ],
                        'Pricing_Comments__c': [
                            {
                                'Id': '',
                                'Name': '',
                                'Pricing_Question__c': '',
                                'Pricing_Answer__c': ''
                            }
                        ]
                    }
                }
            }
            var jsonDataPacket = angular.toJson(JsonObj);
            adminTools.ExecutePostTest(jsonDataPacket).then(function (response) {
                logger.success("Post Test executed succesfully");
            });

        }
    }
})();