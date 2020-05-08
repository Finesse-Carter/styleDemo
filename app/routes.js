module.exports = function (app, passport, db, multer, ObjectId) {
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
  var upload = multer({ storage: storage }); //upload img to destination 'storage'

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });
  app.get('/gallery', isLoggedIn, function (req, res) {
    let uId = ObjectId(req.session.passport.user)   //uId = unique id from passport
    if (req.user.local.email) {
      // db.collection('messages').find().toArray((err, result) => {

      db.collection('posts').find().toArray((err, result) => {
        console.log(result, 'this is fun');

        if (err) return console.log(err)
        res.render('gallery.ejs', {
          user: req.user,
          // messages: result,
          posts: result   //post = result from DB
        })
      })
    }

  });
 
 
  app.get('/single', isLoggedIn, function (req, res) {
    res.render('single.ejs');
  });
  app.get('/contact', isLoggedIn, function (req, res) {
    res.render('contact.ejs');
  });
  app.get('/about', isLoggedIn, function (req, res) {
    res.render('about.ejs');
  });
  app.get('/single', isLoggedIn, function (req, res) {
    res.render('single.ejs');
  });

  app.get('/fits', isLoggedIn, function (req, res) {
    console.log(req.body);
    let uId = ObjectId(req.session.passport.user)
    if (req.user.local.email) {
      db.collection('posts').find({ 'posterId': uId }).toArray((err, result) => {
        console.log("pics" + result);
        res.render('fits.ejs', {
          user: req.user,
          posts: result,
        })
      })
    }

  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {

    let uId = ObjectId(req.session.passport.user)   //uId = unique id from passport
    // let images = [
    //   "public\\images\\defaultImgs\\34e5d299d5373b03309152bf20fbc766.jpg",
    //   'public\\images\\defaultImgs\\94cb42de8ebbd882789e492f4f0de123.jpg',
    //   'public\\images\\defaultImgs\\3781c13dc34f9ebf027a856069398f92.jpg',
    //   'public\\images\\defaultImgs\\img01ff.jpg',
    //   'public\\images\\defaultImgs\\Travis-Scott-Highest-In-The-Room-Tee-Tie-Dye.jpg'
    // ]

    let images = [
      "public/images/defaultImgs/34e5d299d5373b03309152bf20fbc766.jpg",
      'public/images/defaultImgs/94cb42de8ebbd882789e492f4f0de123.jpg',
      'public/images/defaultImgs/3781c13dc34f9ebf027a856069398f92.jpg',
      'public/images/defaultImgs/img01ff.jpg',
      'public/images/defaultImgs/Travis-Scott-Highest-In-The-Room-Tee-Tie-Dye.jpg'
    ]
    let names = [
      "defaultImgs/34e5d299d5373b03309152bf20fbc766.jpg",
      'defaultImgs/94cb42de8ebbd882789e492f4f0de123.jpg',
      'defaultImgs/3781c13dc34f9ebf027a856069398f92.jpg',
      'defaultImgs/img01ff.jpg',
      'defaultImgs/Travis-Scott-Highest-In-The-Room-Tee-Tie-Dye.jpg'
    ]

    let caption;
    let clothing;
    let title;

    images.forEach((image, index) => {

      var colorThief = new ColorThief();
      let primeColor = colorThief.getColor(image);

      let primeColorObj = {}
      primeColor.forEach((element, index) => {
        if (index === 0) {
          primeColorObj.r = element
        } else if (index === 1) {
          primeColorObj.g = element
        } else {
          primeColorObj.b = element
        }

      });

      let colorPalette = colorThief.getPalette(image, 8);
      let newColorPalette = colorPalette;
      let colorRGBPalette = []

      newColorPalette.forEach(element => {

        let colorContainer = {}
        let colorMatches = element.map((element, index) => {
          if (index === 0) {
            colorContainer.r = element
          } else if (index === 1) {
            colorContainer.g = element
          } else {
            colorContainer.b = element
          }
        })

        colorRGBPalette.push(colorContainer);

      });
      colorRGBPalette.push(primeColorObj);

      let newResultArray;



      db.collection('posts').find({ 'posterId': uId }).toArray((err, result) => {

        if (result.length === 0) {

          newResultArray = result.filter((post) => check(post.imgPath))

          console.log(newResultArray, "first result")

          function check(post) {
            console.log(post, 'post post post');

            let result;

            var str = post;
            var n = str.search("defaultImgs");

            if (n > 0) {
              result = true;
            } else if (n === 0) {
              result = false;
            } else {
              result = false;
            }
            return result
          }
          if (newResultArray.length === 5) {
            console.log('no need to create')

          } else {

            ('create')

            if (images[index] === 0) {

              clothing = 'test'
              title = 'test'
              caption = 'test'

            } else if (images[index] === 1) {

              clothing = 'test'
              title = 'test'
              caption = 'test'

            }

            db.collection('posts').save({
              posterId: uId,
              caption: caption,
              likes: 0,
              imgPath: images[index],
              imgUrl: "images/" + names[index],
              color: primeColorObj,
              colors: colorRGBPalette,
              clothing: clothing,
              shareFeed: req.body.shareFeed,
              title: title,
              classIfLiked: ""
            })
          }
        } else {
          /// do nothing
        }
      })
      console.log(newResultArray, "filtered results")
    })
    if (req.user.local.email) {
      console.log(req.user.local.email, 'hey i am here');

      setTimeout(function () {
        db.collection('posts').find({ 'posterId': uId }).sort({ '_id': -1 }).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user: req.user,
            messages: result,
            posts: result   //post = result from DB
          })
        })
      }, 3000);
    }
  });

  app.get('/profile/fits/:outFit', isLoggedIn, function (req, res) {
    let uId = ObjectId(req.session.passport.user);
    var outFitId = ObjectId(req.params.outFit);
    db.collection('posts').findOne({ "_id": outFitId }, (err1, targeOutFit) => {
      if (err1) return console.log(err1)
      let newColorArray = targeOutFit.colors
      db.collection('posts').find({ "posterId": uId }).toArray((err, allOutFits) => {
        if (err) return console.log(err)

        let myFilter = function (outFit) {
          return (
            (outFit._id.toString() !== outFitId.toString()) &&
            ((targeOutFit.clothing === null) || (targeOutFit.clothing !== outFit.clothing)))
        }
        let filteredOutTargetOutfit = allOutFits.filter(myFilter)

        let matchingOutFits = color.match(newColorArray, filteredOutTargetOutfit);
        res.render('fits.ejs', {
          target: targeOutFit,
          posts: matchingOutFits
        })
      })
    })
  });

  app.post('/fits', isLoggedIn, (req, res) => {
    let uId = ObjectId(req.session.passport.user) // uId === the individual

    db.collection('posts').findOne({ _id: ObjectId(req.body._id) }, (err, result) => {
      if (err) return console.log(err)
      res.render('fits.ejs', {
        user: req.user,
        post: result,
      })
    })
  });

  //Create Post =========================================================================
  app.post('/qpPost', isLoggedIn, upload.single('file-to-upload'), (req, res, next) => {

    /*This is the form where you can upload your images, write your tittles and captions.
This form also grabs the color plattet from each image after upload.
And then saves all the information to the data base.
*/

    console.log(req.file.path, 'filepath')
    let uId = ObjectId(req.session.passport.user) // uId === the individual
    var colorThief = new ColorThief();
    let primeColor = colorThief.getColor(req.file.path);
    let primeColorObj = {}
    primeColor.forEach((element, index) => {
      if (index === 0) {
        primeColorObj.r = element
      } else if (index === 1) {
        primeColorObj.g = element
      } else {
        primeColorObj.b = element
      }

    });
    let colorPalette = colorThief.getPalette(req.file.path, 8);
    let newColorPalette = colorPalette
    let colorRGBPalette = []

    newColorPalette.forEach(element => {
      // { r:255, g: 200, b: 55 }
      let colorContainer = {}
      let colorMatches = element.map((element, index) => {
        if (index === 0) {
          colorContainer.r = element
        } else if (index === 1) {
          colorContainer.g = element
        } else {
          colorContainer.b = element
        }
      })
      colorRGBPalette.push(colorContainer);
    });
    colorRGBPalette.push(primeColorObj);

    db.collection('posts').save({
      posterId: uId,
      caption: req.body.caption,
      likes: 0,
      liked: '',
      imgPath: req.file.path,
      imgUrl: "images/uploads/" + req.file.filename,
      color: primeColorObj,
      colors: colorRGBPalette,
      clothing: req.body.clothing,
      shareFeed: req.body.shareFeed,
      title: req.body.title,
      classIfLiked: ""
    },
      (err, result) => {
        if (err) return console.log(err)

        res.redirect('/profile')
      })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
  // likes===========================================================================

  app.put('/profile', (req, res) => {
    db.collection('posts')
      .findOneAndUpdate({ _id: ObjectId(req.body._id) }, {

        $set: {
          liked: req.body.liked

        },
        $inc: {
          likes: req.body.likes
        }
      }, {
        sort: { _id: -1 },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.put('/gallery', (req, res) => {

    db.collection('posts')
      .findOneAndUpdate({ _id: ObjectId(req.body._id) }, {

        $set: {
          liked: req.body.liked

        },
        $inc: {
          likes: req.body.likes
        }
      }, {
        sort: { _id: -1 },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.delete('/posts', isLoggedIn, (req, res) => {
    let uId = ObjectId(req.session.passport.user)
    console.log(uId + 'uId')
    console.log(ObjectId(req.body._id) + ' (req.body._id)')
    db.collection('posts').findOneAndDelete({
      _id: ObjectId(req.body._id),
      posterId: uId
    }, (err, result) => {
      console.log(result)
      if (err) return res.send(500, err)
      if (result.value === null) {
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
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {   //Next???
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  }
};
