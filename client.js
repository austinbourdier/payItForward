if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, failure)
} else {
  alert('error')
}

function success(position){
  $.ajax({
    url: '/locations',
    type: 'GET',
    data: position,
    success: console.log('success'),
    failure: console.log('failure')
  })
}

function failure(){
  alert('Could not find your current location')
}
