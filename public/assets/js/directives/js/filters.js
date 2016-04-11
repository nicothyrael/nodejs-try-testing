
angular.module('quickFixModule.filters', [])
    .directive('cgsFilters', function($timeout) {

        return {
            restrict: 'E',
            scope: {
                filters: '=filters',
                datasource: '=datasource'
            },
            link: watchModel,
            templateUrl: '/assets/js/directives/templates/filters.html'
        };

        function watchModel(scope, element, attrs) {
            if ("withIncludeSwitch" in attrs) {
                scope.withIncludeSwitch = true;
            }

            scope.removeFilter = function (filterId) {
                return scope.$parent.removeFilter(filterId);
            };
        }
    });
