'use strict';

const express = require('express');
const router = express.Router();
const userService = require('../services/user-service');
const lamb = require('lamb');


router.post('/', (req, res) =>
  userService.insert(req.body).then(
    (result) => res.status(201).json(result)
  ).catch(err =>
    (err === 'USER.ERROR.EMPTY_USER' ||
    err === 'USER.ERROR.MULTIPLE_KEYS' ||
    err === 'USER.ERROR.FIRST_NAME_MAX_LENGTH' ||
    err === 'USER.ERROR.LAST_NAME_MAX_LENGTH') ?
    res.status(400).json(err) : res.status(500).json(err)
  )
);

router.get('/:id', (req, res) =>
  userService.findById(req.params.id).then(
    result =>
      lamb.isNil(result) ? res.status(404).end() : res.status(200).json(result)
  ).catch(err =>
    res.status(500).json(err)
  )
);

module.exports = router;
