var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
var thumbDown = document.getElementsByClassName("fa-thumbs-down")
var deletePic = document.getElementsByClassName('deletePic')
Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});
Array.from(thumbDown).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('thumbdown', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp':thumbUp
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});
Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});



Array.from(deletePic).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log('THIS DELETE BUTTON WORKS')
        const caption = this.parentNode.childNodes[1].innerText
        console.log(caption)
        const info = this.parentNode.childNodes
        console.log(info)
        const likes = this.parentNode.childNodes[5].innerText
        console.log(likes)
        const imgPath = this.parentNode.childNodes[3].pathname
        const deleteButton = this.parentNode.childNodes[9]
        const _id = this.parentNode.childNodes[12].previousSibling.dataset.id
        console.log(_id)
        console.log(imgPath + ' imgPath')
        fetch('posts', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'imgPath': imgPath,
            'caption': caption,
            'likes': Number(likes),
            '_id': _id,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

// deletePic.addEventListener('click', function(){
  // console.log('DELETE BUTTON')
  // const imgPath = this.parentNode.parentNode.childNodes[3].src
  // // const _id = this.parentNode.parentNode.getAttribute("data-id")
  //  console.log(this.parentNode.parentNode)
  // const caption = this.parentNode.parentNode.childNodes[5].innerText
  // const likes = this.parentNode.parentNode.childNodes[7].innerText //
//    fetch('deltePictures', {
//     method: 'delete',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       'imgPath': imgPath,
//     })
//   }).then(function (response) {
//     if(response.ok === false){
//       alert("delete failed")
//       return
//     }else{
//     const postElement = element.closest("li")
//     postElement.remove()
//   //  window.location.reload()
//     }
//   })
//   //maybe?
//   .then(data => {
//     console.log(data)
//     window.location.reload(true)
//   })
// });