(function(){
  angular.module('modal', [])
    .factory('openModal', ['$http', '$templateCache', '$q', function($http, $templateCache, $q) {
      return function(templateUrl) {
        return $q.when($templateCache.get(templateUrl) || $http.get(templateUrl, {cache: true})
          .then(function(res) { return res.data; }))
          .then(function(template) {
            return template;
          });
      };
    }])
    .directive('modal', ['openModal', '$compile', '$rootScope', function(modal, $compile, $rootScope) {
      return{
        link: function(scope, el, attrs, controller) {
          scope.modal = {
            open: function() {
              scope.modalTemplate = modal(attrs.modal);
            }
          };
        }
      };
    }])
    .directive('modalContainer', ['$compile', function($compile) {
      return {
        link: function(scope, el) {
          scope.$watch('modalTemplate', function(template) {
            if(angular.isDefined(template)) {
              el.html('');
              el.append(template);
              $compile(el.contents())(scope);

              var modal = el.modal();
            }
          });
        }
      };
    }]);
})();