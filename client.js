var app = angular.module('payItForward', []).run(function($rootScope){

})
app.controller('mainCtrl', function($scope, $http) {
  $scope.locations = [];
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, failure)
  } else {
    alert('error finding location')
  }
  function success(position){
    $http({
      url: '/locations/' + position.coords.latitude + '&' + position.coords.longitude,
      type: 'GET',
      dataType: 'json'
    }).success(function(data) {
      console.log(data)
      data.forEach(function(location){$scope.locations.push({address: location.address, name: location.name, distance: (location.$distance/1000).toFixed(2)})})
    })
  }
  function failure(){alert('error finding location')}
});

app.controller('profileCtrl', function($scope, $http){
  $scope.currentProfile = [];
  $(document).on('click', '.profileDiv', function(){
    $http({
      url: '/profile/' + $(this).children()[0].innerText,
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
      $scope.coupons = [];
      data.coupons.forEach(function(coupon){$scope.coupons.push(coupon)});
    })
  })
  $(document).on('click', '.coupon', function(){
    $http({
      url: $('#currentLocation').text() + '/coupon/' + (this).innerText.substring(6, (this).innerText.indexOf(' ')),
      type: 'GET',
      dataType: 'json'
    }).success(function(data){
      $scope.coupons = [];
      console.log(data)
      if(data.receivedCoupon.length>0){alert('You have received: ' + data.receivedCoupon)}else{alert('You are the first to leave a coupon at this location, thanks!')}
      data.coupons.forEach(function(coupon){$scope.coupons.push(coupon)});
    })
  })
})
