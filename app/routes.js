module.exports = function(app, passport, db, multer, ObjectId) {
  var ColorThief = require('color-thief');
var color = require('../public/color.js')
  // Image Upload Code =========================================================================
  // Make a Var for the storing of imgs => multer.(multer Method?)
  var storage = multer.diskStorage({

    destination: (req, file, cb) => {    //What is cb? ... Maybe filepath
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + ".png")  // cb filepath and timestamp with date and filetype
    }
  });
  var upload = multer({storage: storage}); //upload img to destination 'storage'

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });
  app.get('/gallery',isLoggedIn, function(req, res) {
    let uId = ObjectId(req.session.passport.user)   //uId = unique id from passport
    if(req.user.local.email){
      // db.collection('messages').find().toArray((err, result) => {

        db.collection('posts').find().toArray((err, result) => {
console.log(result,'this is fun');

          if (err) return console.log(err)
          res.render('gallery.ejs', {
            user: req.user,
            // messages: result,
            posts: result   //post = result from DB
          })
        })
      // })
    }

  });
  app.get('/blog',isLoggedIn, function(req, res) {
    res.render('blog.ejs');
  });
  app.get('/single', isLoggedIn, function(req, res) {
    res.render('single.ejs');
  });
  app.get('/contact',isLoggedIn, function(req, res) {
    res.render('contact.ejs');
  });
  app.get('/about', isLoggedIn, function(req, res) {
    res.render('about.ejs');
  });
  app.get('/single',isLoggedIn, function(req, res) {
    res.render('single.ejs');
  });



  app.get('/fits', isLoggedIn, function(req, res) {
    console.log(req.body);
    let uId = ObjectId(req.session.passport.user)
    if(req.user.local.email){
      db.collection('posts').find({'posterId': uId}).toArray((err, result) => {
     console.log("pics" + result);
        res.render('fits.ejs', {
        user: req.user,
        posts: result,
      })
    })
    }

  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    // console.log(req.user.local.email)
    // console.log(chromatism);
    let uId = ObjectId(req.session.passport.user)   //uId = unique id from passport
    if(req.user.local.email){
      db.collection('messages').find().toArray((err, result) => {

        db.collection('posts').find({'posterId': uId}).toArray((err, result) => {

          if (err) return console.log(err)
          res.render('profile.ejs', {
            user: req.user,
            messages: result,
            posts: result   //post = result from DB
          })
        })
      })
    }
  });


  app.get('/profile/fits/:outFit', isLoggedIn, function(req, res) {

    let uId = ObjectId(req.session.passport.user);
    var outFitId = ObjectId(req.params.outFit);


    db.collection('posts').findOne({"_id": outFitId}, (err1, targeOutFit) => {
      if (err1) return console.log(err1)
      // console.log(targeOutFit, 'this is matching outFits');
      let newColorArray = targeOutFit.colors
// console.log(newColorArray,' neww color ar');

db.collection('posts').find({"posterId": uId}).toArray((err, allOutFits) => {
        if (err) return console.log(err)
        // console.log(allOutFits,"its not raining");
          // this is chromatism
        let matchingOutFits = color.match(newColorArray,allOutFits);
        res.render('fits.ejs',{
          target: targeOutFit,
          posts: matchingOutFits

      })
    })
    })
});

  app.post('/fits', isLoggedIn, (req, res) => {
    let uId = ObjectId(req.session.passport.user) // uId === the individual

 db.collection('posts').findOne({_id: ObjectId(req.body._id)},(err, result) => {
          //console.log(result)
          // console.log(req)
          if (err) return console.log(err)
          res.render('fits.ejs', {
            user: req.user,
            post: result,
          })

    })
  });

  // FEED PAGE =========================
  app.get('/feed', isLoggedIn, function(req, res) {
    db.collection('posts').find().toArray((err, result) => {  //Find all posts then turn to array
      if (err) return console.log(err)
      res.render('feed.ejs', {   //render /feed
        user : req.user,
        posts: result
      })
    })
  });

  // INDIVIDUAL POST PAGE =========================
  app.get('/post/:zebra', isLoggedIn,  function(req, res) {  //  /:zebra = query param
    let postId = ObjectId(req.params.zebra)   // postId = the queryParam unique number
    console.log(postId);
    db.collection('posts').find({_id: postId}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('post.ejs', {
        posts: result
      })
    })
  });

  //Create Post =========================================================================
  app.post('/qpPost', isLoggedIn, upload.single('file-to-upload'), (req, res, next) => {  //one picture to post   //next????
    let uId = ObjectId(req.session.passport.user) // uId === the individual
    var colorThief = new ColorThief();
    let primeColor = colorThief.getColor(req.file.path);

    let primeColorObj = {}
    primeColor.forEach((element,index)=> {
      if(index===0){
        primeColorObj.r=element
      }else if(index===1){
        primeColorObj.g=element
      }else{
        primeColorObj.b=element
      }

    });
    let colorPalette = colorThief.getPalette( req.file.path, 8);
    let newColorPalette = colorPalette
    let colorRGBPalette =[]

    newColorPalette.forEach(element => {
      // { r:255, g: 200, b: 55 }
      let colorContainer = {}
      let colorMatches =element.map((element,index)=>{
        if(index===0){
          colorContainer.r=element
        }else if(index===1){
    colorContainer.g=element
        }else{
          colorContainer.b=element
        }
      })

      colorRGBPalette.push(colorContainer);

    });
    colorRGBPalette.push(primeColorObj);
    //+++++++++++++

//+++++++++++++++
    db.collection('posts').save({
      posterId: uId,
      caption: req.body.caption,
      likes: 0,
      imgPath: req.file.path,
      imgUrl: "images/uploads/"+ req.file.filename,
      color: primeColorObj,
      colors: colorRGBPalette,
      clothing: req.body.clothing,
      shareFeed: req.body.shareFeed,
      title: req.body.title,
      classIfLiked: ""
    },
    (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/messages', (req, res) => {
    db.collection('messages').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
      if (err) return console.log(err)
      console.log('MESSAGES SAVED TO DATABAS')
      res.redirect('/profile')
    })
  })
  app.put('/messages', (req, res) => {
    db.collection('messages')
    .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
      $set: {

        thumbUp:req.body.thumbUp + 1
        //thumbDown:req.body.thumbDown - 1
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })
  app.put('/thumbdown', (req, res) => {
    db.collection('messages')
    .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
      $set: {
        thumbUp:req.body.thumbUp - 1
        //thumbDown:req.body.thumbDown - 1

      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })
  app.delete('/messages', (req, res) => {
    db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  app.delete('/posts', isLoggedIn, (req, res) => {
    let uId = ObjectId(req.session.passport.user)
    console.log(uId+'uId')
    console.log(ObjectId(req.body._id) +' (req.body._id)')
    db.collection('posts').findOneAndDelete({
      _id: ObjectId(req.body._id),
      posterId: uId
    }, (err, result) => {
      console.log(result)
      if (err) return res.send(500, err)
      if(result.value === null){
        res.send(404, "not found")
        return
      };
      res.send('Message deleted!')
    })
  })





  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });
  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {   //Next???
    if (req.isAuthenticated()){
      return next();
    }

    res.redirect('/');
  }
};
