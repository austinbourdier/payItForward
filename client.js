if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, failure)
} else {
  alert('error')
}

function success(position){
  console.log(position)
  alert('success')
}

function failure(){
  alert('failure')
}
