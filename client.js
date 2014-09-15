var app = angular.module('payItForward', []).run(function($rootScope){

})
app.controller('mainCtrl', function($scope, $http) {
  $scope.locations = [];
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, failure)
  } else {
    alert('error')
  }
  function success(position){
    $http({
      url: '/locations/' + position.coords.latitude + '&' + position.coords.longitude,
      type: 'GET',
      dataType: 'json'
    }).success(function(data) {
      data.forEach(function(location){$scope.locations.push(location)})
      console.log($scope.locations)
    })
  }

  function failure(){
    console.log('failed')
  }
});

app.controller('profileCtrl', function($scope, $http){
  $scope.currentProfile = [];
  $(document).on('click', '.profile .name', function(){
    $http({
      url: '/profile/' + (this).innerHTML,
      type: 'GET',
      dataType: 'json'
    }).success(function(data) {
      $scope.currentProfile = {
        name: data.name,
        address: data.address,
        hours: data.hours,
        phone: data.phone,
        website: data.website,
        currentCoupon: data.currentCoupon
      }
      console.log(data)
    })
  })
})
