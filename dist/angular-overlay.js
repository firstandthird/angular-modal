
/*!
 * angular-overlay - A simple modal directive
 * v0.1.0
 * http://github.com/firstandthird/angular-overlay/
 * copyright First + Third 2013
 * MIT License
*/
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
    .directive('modal', ['openModal', '$compile', '$document', '$parse', function(modal, $compile, $document, $parse) {
      return{
        link: function(scope, el, attrs) {
          scope.modalTemplate = modal(attrs.modal);

          var container;
          var options = $parse(attrs.options)() || {};

          if(!$document.find('#modalContainer').length) {
            $document.find('body').append('<div id="modalContainer" style="display:none"></div>');
          }

          container = $document.find('#modalContainer');

          el.bind('click', function() {
            scope.modal = container.modal(options);
          });

          scope.$watch('modalTemplate', function(template) {
            if(!angular.isDefined(template)) return;

            container.html('');
            container.append(template);
            $compile(container.contents())(scope);
          });
        }
      };
    }]);
})();