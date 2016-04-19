'use strict';

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const authService = require('../services/auth-service');
const configService = require('../services/config-service');
const router = express.Router();


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

function addLocalRoutes() {
  router.get(
    '/login',
    passport.authenticate('local', {
      failureFlash: true
    }),
    (req, res) => res.redirect('/')
  );
  router.get(
    '/failed',
    (req, res) => res.status(401).json({error: 'Could not authenticate with cash counter'})
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

function addGoogleRoutes() {
  router.get(
    '/google/login',
    passport.authenticate('google', {
      scope: [
        'profile',
        'email'
      ]
    })
  );
  router.get(
    '/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/auth/google/failed'
    }),
    (req, res) => res.redirect('/')
  );
  router.get(
    '/google/failed',
    (req, res) => res.status(401).json({error: 'Could not authenticate with google'})
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

function addFacebookRoutes() {
  router.get(
    '/facebook/login',
    passport.authenticate('facebook', {scope: 'email'})
  );
  router.get(
    '/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/auth/facebook/failed'
    }),
    (req, res) => res.redirect('/')
  );
  router.get(
    '/facebook/failed',
    (req, res) => res.status(401).json({error: 'Could not authenticate with facebook'})
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

function addGitHubRoutes() {
  router.get(
    '/github/login',
    passport.authenticate('github', {scope: 'email'})
  );
  router.get(
    '/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/auth/github/failed'
    }),
    (req, res) => res.redirect('/')
  );
  router.get(
    '/github/failed',
    (req, res) => res.status(401).json({error: 'Could not authenticate with github'})
  );
}

function addStrategies() {
  addLocalStrategy();
  addGoogleStrategy();
  addFacebookStrategy();
  addGitHubStrategy();
}

function addRoutes() {
  addLocalRoutes();
  addGoogleRoutes();
  addFacebookRoutes();
  addGitHubRoutes();
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });
}

serdeUser();
addStrategies();
addRoutes();

module.exports = router;
