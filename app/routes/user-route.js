'use strict';

const express = require('express');
const router = express.Router();
const userService = require('../services/user-service');
const lang = require('../facade/lang');

router.post('/', (req, res) => {
  const newUser = req.body;
  userService.insert(newUser).subscribe((result) => {
    res.status(201).json(result);
  }, (err) => {
    if (err === 'USER.ERROR.MISSING_REQUIRED_FIELD') {
      res.status(400).json('USER.ERROR.MISSING_REQUIRED_FIELD');
    } else {
      res.status(500).json(err);
    }
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  userService.getById(id).subscribe((result) => {
    if (lang.isBlank(result)) {
      res.status(404).end();
    } else {
      res.status(200).json(result);
    }
  }, (err) => {
    res.status(500).json(err);
  });
});

module.exports = router;
