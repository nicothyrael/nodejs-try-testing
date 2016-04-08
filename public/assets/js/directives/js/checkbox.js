angular.module('quickFixModule.checkbox', [])
    .directive('cgsCheckbox', function($timeout) {

        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },
            link: watchModel,
            template: '<input id="{{ id }}" type="checkbox" data-on-text="{{ onText }}" data-off-text="{{ offText }}" />'
        };

        function watchModel(scope, element, attrs) {
            scope.id = attrs.ngId;
            scope.onText = attrs.onText || $.fn.bootstrapSwitch.defaults.onText;
            scope.offText = attrs.offText || $.fn.bootstrapSwitch.defaults.offText;

            // $timeout to initialize after DOM is parsed by Angular
            // http://stackoverflow.com/a/12243086/1431413
            $timeout(function() {

                // Default value
                if (typeof scope.model === "undefined") scope.model = true;

                // Reference to checkbox element
                var checkbox$ = $('#' + scope.id);

                // Initialize plugin
                checkbox$.bootstrapSwitch({'state': scope.model});

                // When changed is triggered (user changed the switch), change model + apply
                checkbox$.on('switchChange.bootstrapSwitch', function() {
                    scope.$apply(function () {
                        scope.model = checkbox$.bootstrapSwitch('state');
                    });
                });

                // When model is changed externally, change state
                scope.$watch("model", function() {

                    // true: but don't trigger switchChange.bootstrapSwitch event (else we get nasty Angular $digest errors)
                    checkbox$.bootstrapSwitch('state', scope.model, true);
                    // console.log("CHK " + scope.id + " | W_CHG | NewValue: " + scope.model);
                });
            });
        }
    });
