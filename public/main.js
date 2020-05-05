var deletePic = document.getElementsByClassName('deletePic')

function nav() {
  document.querySelector('.side').style.display = "block";
}

// likes================================================
var likes = document.getElementsByClassName("likes");
// This is the heart icon

Array.from(likes).forEach(function (element) {
  element.addEventListener('click', function () {

    const _id = element.getAttribute('data-id');
   
    const likes = element.getAttribute("data-likes");

    if (element.classList.contains('liked')) {
      element.classList.remove('liked')
      fetch('profile', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

          '_id': _id,
          'likes': -1,
          'liked': ''
        })
      })

        .then((response) => {

          window.location.reload(true)
        })
        .catch((error) => {
          console.error('error', error);
        });

    } else {
      element.classList.add('liked')
      fetch('profile', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

          '_id': _id,
          'likes': 1,
          'liked': 'liked'
        })
      })

        .then((response) => {
    
          window.location.reload(true)
        })
        .catch((error) => {
          console.error('error', error);
        });
    }
  })
});
//===========================================
// This is the delete icon

Array.from(deletePic).forEach(function (element) {
  element.addEventListener('click', function () {
    console.log('THIS DELETE BUTTON WORKS')
    const _id = element.getAttribute('data-id');
    console.log(_id);
    fetch('posts', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        '_id': _id,
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});
