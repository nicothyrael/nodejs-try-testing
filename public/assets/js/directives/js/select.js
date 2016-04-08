angular.module('quickFixModule.select', [])
    .controller()
    .directive('cgsSelect', function($parse, $interval) {

        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                options: '=',
                model: '=ngModel',
                datasource: '=datasource'
            },
            link: watchModel,
            templateUrl: '/assets/js/directives/templates/select.html'
        };

        function watchModel(scope, element, attrs) {
            scope.id = attrs.ngId;

            /*
             * Update when datasource.current is changed
             */
            scope.$watch("datasource.Current", function(options) {

                $('#' + scope.id).replaceWith('<div id=' + scope.id + ' class="cgs-dropdown">' +
                '<select id="select-' + scope.id + '" class="selectpicker"></select>' +
                '</div>');

                angular.forEach(options, function(option) {
                    var htmlContent = "<option data-content='" + option.value + "' value='" + option.value + "'></option>";

                    if (option.text == null) {
                        if (option.subValue == null) {
                            htmlContent = "<option data-content='" + option.value + "' value='" + option.value + "'></option>";
                        } else {
                            htmlContent = "<option data-subtext='" + option.subValue + "'>" + option.value + "</option>";
                        }
                    } else {
                        if (option.subValue == null) {
                            htmlContent = "<option data-content='" + option.text + "' value='" + option.value + "'>" + option.text + "</option>";
                        } else {
                            htmlContent = "<option data-subtext='" + option.subValue + "' value='" + option.value + "'>" + option.text + "</option>";
                        }
                    }

                    $('#select-' + scope.id).append(htmlContent);
                });

                // If there are already selected values in model, apply them to select element
                if (typeof scope.model === "object") {
                    if (Array.isArray(scope.model)) {
                        for (var i = 0; i < scope.model.length; i++) {
                            $('#select-' + scope.id + " > option[value='" + scope.model[i] + "']").prop("selected", true);
                        }
                    }
                }

                $('#select-' + scope.id).selectpicker('refresh');

                /*
                 * Update the model on value change
                 */
                $('#select-' + scope.id).on('change', function() {
                    scope.model = $('#select-' + scope.id).selectpicker('val');
                    scope.$apply();
                });
            });

        }
    });
