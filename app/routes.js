import {isLoggedIn} from './controllers/_utils'

export default (app, passport) => {

  app.get('/', (req, res) => {
    res.locals = {
      title: 'Ayurveda',
      message: 'Account',
    };
    res.render('index.ejs')
  });

  app.get('/profile', isLoggedIn, (req, res) => res.render('profile.ejs', {user: req.user}));

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // app.route('/login')
  //     .get((req, res) => res.render('login.ejs', {message: req.flash('loginMessage')}))
  //     .post(passport.authenticate('local-login', {
  //         successRedirect: '/profile', // redirect to the secure profile section
  //         failureRedirect: '/login', // redirect back to the signup page if there is an error
  //         failureFlash: true // allow flash messages
  //     }));

  app.route('/signup')
    .get((req, res) => res.render('signup.ejs', {message: req.flash('signupMessage')}))
    .post(passport.authenticate('local-signup', {
      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/signup', // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    }));

};

