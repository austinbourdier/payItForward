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
  $scope.coupons = [];
  $(document).on('click', '.profile .name', function(){
    $http({
      url: '/profile/' + (this).innerHTML,
      type: 'GET',
      dataType: 'json'
    }).success(function(data) {
      $scope.currentProfile = {
        name: data.location.name,
        address: data.location.address,
        hours: data.location.hours,
        phone: data.location.phone,
        website: data.location.website,
        currentCoupon: data.location.currentCoupon
      }
      data.coupons.forEach(function(coupon){$scope.coupons.push(coupon)});
      console.log(data)
    })
  })
})
