
/*!
 * angular-overlay - A simple modal directive
 * v0.4.0
 * http://github.com/firstandthird/angular-overlay/
 * copyright First + Third 2014
 * MIT License
*/
(function(){
  angular.module('ftOverlay', [])
    .factory('overlayTemplate', ['$http', '$templateCache', '$q', function($http, $templateCache, $q) {
      var promises = {};
      return function(templateUrl) {
        if (promises[templateUrl]) {
          return promises[templateUrl];
        }

        promises[templateUrl] = $http.get(templateUrl)
          .then(function(response) {
            return response.data;
          });

        return promises[templateUrl];
      };
    }])
    .factory('overlay', ['overlayTemplate', '$compile', '$document', '$parse', '$controller', function(overlayTemplate, $compile, $document, $parse, $controller) {
      var $overlay = function(scope, attrs) {
        overlayTemplate(attrs.overlay);
        var controller = attrs.overlayController;

        var container;
        var options = $parse(attrs.overlayOptions)() || {};

        if(!$document.find('#overlayContainer').length) {
          $document.find('body').append('<div id="overlayContainer" style="display:none"></div>');
        }

        container = $document.find('#overlayContainer');

        scope.overlayClose = function() {
          scope.overlay.hide();
        };

        this.open = function() {
          overlayTemplate(attrs.overlay).then(function(template) {
            container.html('');
            container.append(template);
            if (controller) {
              var ctrl = $controller(controller, { $scope: scope });
            }
            $compile(container.contents())(scope);
            scope.overlay = container.overlay(options).data('overlay');
          });
        };
      };

      return $overlay;
    }])
    .directive('overlay', ['overlay', function(overlay) {
      return {
        link: function(scope, el, attrs) {

          var $overlay = new overlay(scope, attrs);

          el.bind('click', function(){
            scope.$apply(function(){
              $overlay.open();
            });
          });
        }
      };
    }]);
})();
