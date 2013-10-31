
/*!
 * angular-overlay - A simple modal directive
 * v0.1.0
 * http://github.com/firstandthird/angular-overlay/
 * copyright First + Third 2013
 * MIT License
*/
(function(){
  angular.module('modal', [])
    .factory('overlayTemplate', ['$http', '$templateCache', '$q', function($http, $templateCache, $q) {
      return function(templateUrl) {
        return $q.when($templateCache.get(templateUrl) || $http.get(templateUrl, {cache: true})
          .then(function(res) { return res.data; }))
          .then(function(template) {
            return template;
          });
      };
    }])
    .directive('overlay', ['overlayTemplate', '$compile', '$document', '$parse', function(overlayTemplate, $compile, $document, $parse) {
      return {
        link: function(scope, el, attrs) {
          scope.overlayTemplate = overlayTemplate(attrs.overlay);

          var container;
          var options = $parse(attrs.overlayOptions)() || {};

          if(!$document.find('#overlayContainer').length) {
            $document.find('body').append('<div id="overlayContainer" style="display:none"></div>');
          }

          container = $document.find('#overlayContainer');

          el.bind('click', function() {
            scope.overlay = container.overlay(options).data('overlay');
          });
          scope.overlayClose = function() {
            scope.overlay.hide();
          };

          scope.$watch('overlayTemplate', function(template) {
            if(!angular.isDefined(template)) return;

            container.html('');
            container.append(template);
            $compile(container.contents())(scope);
          });
        }
      };
    }]);
})();
