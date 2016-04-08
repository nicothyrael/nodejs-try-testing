angular.module('quickFixModule.onreadfile', [])
  .directive('onReadFile', function($parse, $interval) {

      return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
          var fn = $parse(attrs.onReadFile);
          element.on('change', function(onChangeEvent) {
            var reader = new FileReader();
            var fileName = null;

            fileName = (onChangeEvent.srcElement || onChangeEvent.target).files[0].name;
            reader.onload = function(onLoadEvent) {
              scope.$apply(function() {
                fn(scope, {$fileContent:fileName+'\t'+onLoadEvent.target.result});
              });
            };

            reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
          });

        }
      };

});
