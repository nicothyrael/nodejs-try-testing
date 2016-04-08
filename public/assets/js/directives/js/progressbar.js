var classBarFinished = "progress-bar-success";

angular.module('quickFixModule.progressbar', [])
    .directive('cgsProgressbar', function($parse, $interval) {

        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                options: '=',
                model: '=ngModel',
                fnDone: '&'
            },
            link: watchModel,
            templateUrl: '/assets/js/directives/templates/progressbar.html'
        };

        function watchModel(scope, element, attrs) {
            scope.$watch("model", function(state) {
                if (!isNaN(state)) {
                    updateProgressBar(scope, state, element, attrs);
                }
                if (state == 'loading') {
                    initializeProgressBar(scope, element, attrs);
                }
                if (state == 'ready') {
                    var innerBar = element.find(".progress-bar");
                    innerBar.width(attrs.barWidth);
                }
            });
        }

        function updateProgressBar(scope, state, element, attrs) {
            scope.percentage = Math.round(state * 10) / 10;
            var innerBar = element.find(".progress-bar");
            innerBar.width(attrs.barWidth * (state / 100));
            if (state >= 85) {
                setBarColorToGreen(innerBar);
            }
        }

        function initializeProgressBar(scope, element, attrs) {
            // Update the text
            timerProgressText = createProgressTextTimer(scope, element, attrs);
            // Start the progress bar animation
            createProgressBarTimer(scope, element, attrs, timerProgressText);
        }

        function createProgressBarTimer(scope, element, attrs) {
            var innerBar = element.find(".progress-bar");

            var barTimer = $interval(function() {
                if (scope.percentage < 95 && scope.model == 'loading') {
                    var remaining = attrs.barWidth - innerBar.width();
                    innerBar.width(innerBar.width() + remaining / 6);
                } else {
                    $interval.cancel(barTimer);
                }
            }, attrs.durationMs / 3);
        }

        function createProgressTextTimer(scope, element, attrs, timerProgressText) {
            var innerBar = element.find(".progress-bar");

            var textTimer = $interval(function() {
                // Update the text and stop at 95% if the data is not ready
                if (scope.percentage < 95 || scope.model == 'ready') {
                    scope.percentage = Math.round(innerBar.width() / attrs.barWidth * 100);
                }

                // Turn green above 85%
                if (scope.percentage >= 85) {
                    setBarColorToGreen(innerBar);
                }

                // Reset the progressbar & call the callback function
                if (scope.percentage >= 96) {
                    scope.percentage = 0;
                    resetProgressBar(innerBar, textTimer);

                    scope.fnDone();
                }

            }, 50);
        }

        function setBarColorToGreen(bar) {
            if (!bar.hasClass(classBarFinished)) {
                bar.addClass(classBarFinished);
            }
        }

        function resetProgressBar(bar, textTimer) {
            bar.removeClass(classBarFinished);
            bar.width(0);
            $interval.cancel(textTimer);
        }
    });
