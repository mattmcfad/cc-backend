'use strict';

const restify = require('restify');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const authService = require('../services/auth-service');
const configService = require('../services/config-service');


function serdeUser() {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
}

function addLocalStrategy() {
  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, (email, password, done) =>
      authService.authenticateLocal(email, password)
        .then(user => done(null, user))
        .catch(err => done(null, false, err))
    )
  );
}

function addGoogleStrategy() {
  passport.use(
    new GoogleStrategy({
        clientID: configService.getGoogleClientId(),
        clientSecret: configService.getGoogleClientSecret(),
        callbackURL: 'http://localhost:3010/auth/google/callback'
      }, (accessToken, refreshToken, profile, done) => {
        authService.authenticateGoogle(
          profile.id,
          profile.name.givenName,
          profile.name.familyName
        ).then(
          user => done(null, user.toObject())
        ).catch(err => done(null, false, err));
      }
    )
  );
}

function addFacebookStrategy() {
  passport.use(
    new FacebookStrategy({
      clientID: configService.getFacebookClientId(),
      clientSecret: configService.getFacebookClientSecrect(),
      callbackURL: "http://localhost:3010/auth/facebook/callback"
    }, (accessToken, refreshToken, profile, done) => {
      const names = profile.displayName.split(/\s/);
      authService.authenticateFacebook(
        profile.id,
        names[0],
        names[1]
      ).then(
        user => done(null, user.toObject())
      ).catch(err => done(null, false, err));
    })
  );
}

function addGitHubStrategy() {
  passport.use(
    new GitHubStrategy({
      clientID: configService.getGitHubClientId(),
      clientSecret: configService.getGitHubClientSecrect(),
      callbackURL: "http://localhost:3010/auth/github/callback"
    }, (accessToken, refreshToken, profile, done) => {
      const names = profile.displayName.split(/\s/);
      authService.authenticateGitHub(
        profile.id,
        names[0],
        names[1]
      ).then(
        user => done(null, user.toObject())
      ).catch(err => done(null, false, err));
    })
  );
}

function addStrategies() {
  addLocalStrategy();
  addGoogleStrategy();
  addFacebookStrategy();
  addGitHubStrategy();
}

function addLocalRoutes(server, prefix) {
  server.get(
    prefix + '/login',
    passport.authenticate('local', {
      failureFlash: true
    }),
    (req, res, next) => res.redirect('/', next)
  );
  server.get(
    prefix + '/failed',
    (req, res, next) => {
      return next(new restify.errors.InvalidCredentialsError('AUTH.ERRORS.CASH_COUNTER'));
    }
  );
}

function addGoogleRoutes(server, prefix) {
  server.get(
    prefix + '/google/login',
    passport.authenticate('google', {
      scope: [
        'profile',
        'email'
      ]
    })
  );
  server.get(
    prefix + '/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/auth/google/failed'
    }),
    (req, res, next) => res.redirect('/', next)
  );
  server.get(
    prefix + '/google/failed',
    (req, res, next) => {
      return next(new restify.errors.InvalidCredentialsError('AUTH.ERRORS.GOOGLE'));
    }
  );
}

function addFacebookRoutes(server, prefix) {
  server.get(
    prefix + '/facebook/login',
    passport.authenticate('facebook', {scope: 'email'})
  );
  server.get(
    prefix + '/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/auth/facebook/failed'
    }),
    (req, res, next) => res.redirect('/', next)
  );
  server.get(
    prefix + '/facebook/failed',
    (req, res, next) => {
      return next(new restify.errors.InvalidCredentialsError('AUTH.ERRORS.FACEBOOK'));
    }
  );
}

function addGitHubRoutes(server, prefix) {
  server.get(
    prefix + '/github/login',
    passport.authenticate('github', {scope: 'email'})
  );
  server.get(
    prefix + '/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/auth/github/failed'
    }),
    (req, res, next) => res.redirect('/', next)
  );
  server.get(
    prefix + '/github/failed',
    (req, res, next) => {
      return next(new restify.errors.InvalidCredentialsError('AUTH.ERRORS.GIT_HUB'));
    }
  );
}

function addRoutes(server, prefix) {
  addLocalRoutes(server, prefix);
  addGoogleRoutes(server, prefix);
  addFacebookRoutes(server, prefix);
  addGitHubRoutes(server, prefix);
  server.get(prefix + '/logout', (req, res, next) => {
    req.logout();
    res.redirect('/', next);
  });
}

function authenticate(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send(401);
  return next();
}

serdeUser();
addStrategies();

module.exports = {
  addRoutes,
  authenticate
};
