angular.module('example-app', ['modal']);

var MainController = function($scope) {
  $scope.world = 'World';
  $scope.name = '';

  $scope.$watch('name', function(val) {
    console.log('name changed', val);
  });

  $scope.overlayClose2 = function() {
    if ($scope.name == '') {
      alert('name must be filled out');
      return;
    }

    $scope.overlayClose();
  };

};
