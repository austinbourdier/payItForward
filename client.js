if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, failure)
} else {
  alert('error')
}

function success(position){
  $.ajax({
    url: '/locations',
    type: 'GET',
    dataType: 'jsonp'
  }).done(function(data){
      console.log(data)
    })
}

function failure(){
  alert('Could not find your current location')
}
