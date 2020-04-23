var addLikes = document.getElementsByClassName("addLikes");
var addCommets = document.getElementsByClassName("addCommets");

Array.from(addLikes).forEach(function(element) {
      element.addEventListener('click', function(){
        const uId = element.getAttribute('data-id');
        if(element.classList.contains("liked")){
            element.classList.remove("liked")
console.log(element.classList, "classlist");
fetch('heart', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
likes:-1,
posterId: uId,
classIfLiked: ""
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    window.location.reload(true)
  })

        } else{
            element.classList.add("liked")
            fetch('heart', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
            likes: 1,
            posterId: uId,
            classIfLiked: "liked"
                })
              })
              .then(response => {
                if (response.ok) return response.json()
              })
              .then(data => {
                console.log(data)
                window.location.reload(true)
              })
        }
        console.log(likes, "working likes");
    });        // const heart = parseFloat(this.)
        
});