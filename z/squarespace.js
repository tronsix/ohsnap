<style>
img{
    max-width: 100%;
    height: auto;
}
#image-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}
.image-div {
  max-width: 350px;
}
</style>
<script>
// Make request to server for images
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       // document.getElementById("demo").innerHTML = xhttp.responseText;
       console.log(xhttp.response)
       console.log(typeof xhttp.response)
       var json = JSON.parse(xhttp.response)
       var images = json.images
       var div = document.createElement('div')
       div.id = 'image-container'
       document.getElementById('container-content').style.padding = 0
       document.getElementById('container-content').appendChild(div)

       for (var i = 0; i < images.length; i++) {
          var image = document.createElement('img')
          image.src = images[i]

          var a = document.createElement('a')
          a.href = images[i]
          a.style.cursor = 'pointer'
          a.appendChild(image)
          var imgDiv = document.createElement('div')
          imgDiv.className = 'image-div'
          imgDiv.appendChild(a)
          document.getElementById('image-container').appendChild(imgDiv)
       }
    }
};
xhttp.open("GET", "https://nameless-fortress-95164.herokuapp.com/photos", true);
xhttp.send();
</script>


