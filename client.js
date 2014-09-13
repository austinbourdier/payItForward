if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition())
} else {
  alert('error')
}
function showPosition(position) {
   console.log(position)
}
