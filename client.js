if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, failure)
} else {
  alert('error')
}

function success(position){
  $.ajax({
    url: '/locations',
    type: 'GET',
    dataType: 'json'
  }).success(function(data){
    console.log('hi')
    alert('hi')
      console.log(data)
    })
}

function failure(){
  alert('Could not find your current location')
}
