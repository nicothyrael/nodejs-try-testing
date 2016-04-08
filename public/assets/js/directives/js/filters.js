/**
 * Directive used to include the filters inside a CGS-Report page.
 * <cgs-filters filters="activeFilters" datasource="filtersDatasource" with-include-switch></cgs-filters>
 * ** MUST ** be used inside a controller with a quickFixServicesFilters instance.
 */
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
