if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, failure)
} else {
  alert('error')
}

function success(position){
  $.ajax({
    url: '/',
    type: 'POST',
    data: position,
    success: console.log('success'),
    failure: console.log('failure')
  })
}

function failure(){
  alert('Could not find your current location')
}
