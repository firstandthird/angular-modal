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
