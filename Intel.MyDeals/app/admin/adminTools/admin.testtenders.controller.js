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

        $scope.testTendersData.CNTRCT_SF_ID = '50130000000X14c';
        $scope.testTendersData.CNTRCT_CUST = 'Dell';
        $scope.testTendersData.END_CUST = 'Facebook';
        $scope.testTendersData.START_DT = '02/28/2020';
        $scope.testTendersData.END_DT = '02/28/2020';
        $scope.testTendersData.GEO = 'EMEA';
        $scope.testTendersData.DEAL_SF_ID = '001i000001AWbWu';
        $scope.testTendersData.ECAP = '100';
        $scope.testTendersData.VOLUME = '300';
        $scope.testTendersData.DEAL_ID = '543212';
        $scope.testTendersData.PROD_IDs = 'Intel® Xeon® Processor E7-8870 v4';

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
                            'Id': $scope.testTendersData.CNTRCT_SF_ID,
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
                                    'Id': $scope.testTendersData.DEAL_SF_ID,
                                    'Name': $scope.testTendersData.PROD_IDs,
                                    'Core_Product_Name_EPM_ID__c': '192283'
                                },
                                'Pricing_Competetor_Product__c': {
                                    'Id': '',
                                    'Name': ''
                                },
                                'Pricing_Performance_Metric__c': [
                                    {
                                        'Id': $scope.testTendersData.DEAL_SF_ID,
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