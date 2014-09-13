if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success(position), failure())
} else {
  alert('error')
}

function success(position){
  console.log(position)
  alert(position)
}

function failure(){
  console.log('Geolocation not found');
  alert('failed')

}
