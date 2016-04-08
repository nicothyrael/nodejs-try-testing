angular.module('quickFixModule.quickFixCommonService', [])
    .factory('quickFixCommonService', function($http, $rootScope) {

        var defaultTimeout = 1000000;
        var service = {};
        service.getTables = function(environment) {
            console.log("QuickFix Frontend Services get Tables.............");
            return $http({
                method: 'get',
                url: '/shared/getTables?environment=' + environment
            });
        };

        /**
         * @param environment
         * @returns : List of Tags
         */
        service.getColumns = function(environment, tableName) {

            console.log("QuickFix Frontend Services get Table Columns............");
            return $http({
                method: 'get',
                url: '/shared/getTableColumns?environment=' + environment + '&table=' + tableName
            });
        };
        return service;
    });



