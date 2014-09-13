if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position){console.log(position)})
} else {
  alert('error')
}
