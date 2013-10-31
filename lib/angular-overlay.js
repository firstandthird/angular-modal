(function(){
  angular.module('ftOverlay', [])
    .factory('overlayTemplate', ['$http', '$templateCache', '$q', function($http, $templateCache, $q) {
      return function(templateUrl) {
        var ret = $templateCache.get(templateUrl) || $http.get(templateUrl);
        return $q.when(ret)
          .then(function(template) {
            if (typeof template !== 'string') {
              //return from http call
              template = template.data;
              $templateCache.put(templateUrl, template);
            }
            return template;
          });
      };
    }])
    .directive('overlay', ['overlayTemplate', '$compile', '$document', '$parse', function(overlayTemplate, $compile, $document, $parse) {
      return {
        link: function(scope, el, attrs) {

          overlayTemplate(attrs.overlay);

          var container;
          var options = $parse(attrs.overlayOptions)() || {};

          if(!$document.find('#overlayContainer').length) {
            $document.find('body').append('<div id="overlayContainer" style="display:none"></div>');
          }

          container = $document.find('#overlayContainer');

          el.bind('click', function() {
            scope.$apply(function() {
              overlayTemplate(attrs.overlay).then(function(template) {
                container.html('');
                container.append(template);
                $compile(container.contents())(scope);
                scope.overlay = container.overlay(options).data('overlay');
              });
            });
          });
          scope.overlayClose = function() {
            scope.overlay.hide();
          };

        }
      };
    }]);
})();
