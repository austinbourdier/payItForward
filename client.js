if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position){success(position)}, failure())
} else {
  alert('error')
}

function success(position){
  alert('success')
}

function failure(){
  alert('failure')
}
