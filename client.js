var app = angular.module('payItForward', []).run(function($rootScope){

})
app.controller('mainCtrl', function($scope, $http) {
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
      $('#main').text(data);
    })
  }
  function failure(){
    console.log('failed')
  }
});

