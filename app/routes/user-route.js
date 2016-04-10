'use strict';

const express = require('express');
const router = express.Router();
const userProvider = require('../providers/user-provider');

router.post('/', (req, res) => {
  const newUser = req.body;
  userProvider.insert(newUser, (err) => {
    res.status(201).json(err);
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  userProvider.getById(id, (err) => {
    res.status(200).json(err);
  })
});

module.exports = router;
