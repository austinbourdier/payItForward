if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, failure)
} else {
  alert('error')
}

function success(position){
  $.ajax({
    url: '/',
    type: 'GET',
    data: position
  }).done(function(data){
      console.log('location sent to server')
    })
}

function failure(){
  alert('Could not find your current location')
}
