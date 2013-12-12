angular.module('example-app', ['ftOverlay']);

var MainController = function($scope, overlay) {
  $scope.world = 'World';
  $scope.name = '';
  $scope.number = 1;

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

  $scope.inputChanged = function() {
    console.log('changed');
    var message = new overlay($scope, {
      overlay: 'modal/factoryModal.html'
    });
    message.open();
  };

};
