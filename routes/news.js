const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const { createNewsEntry } = require('../repositories/entriesRepository');

const { findEntryById } = require('../repositories/entriesRepository');

const entries = require('../controller/entries')

//GET the news from the entries model
router.get('', (req, res) => {
  entries
    .find()
    .then((response) => res.status(200).send(response))
    .catch((err) => console.log(err));
});

router.get('/:oid', async function (req, res) {
  const requestedID = req.params.oid;
  const requestedEntry = await findEntryById(requestedID);

  return res.status(200).json({ ok: true, entry: requestedEntry });
});

router.post(
  '/',
  body('name').isString().notEmpty().trim().escape(),
  body('content').isString().notEmpty().trim().escape(),
  body('image').isString().notEmpty(),
  body('categoryId').isInt().notEmpty(),

  async function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ ok: false, errors: errors.array() });
    }

    const data = req.body;
    await createNewsEntry(data);

    return res.status(201).json({ ok: true, msg: 'Created successfully' });
  }
);

module.exports = router;