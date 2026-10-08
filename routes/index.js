var express = require('express');
var router = express.Router();
const { connectToDB, ObjectId } = require('../utils/db'); //activate later

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Handle Event Form */
router.post('/event/add', async function(req, res, next) {
  const db = await connectToDB();
  try{
    req.body.eventTitle = req.body.eventTitle.trim();
    req.body.eventDescription = req.body.eventDescription.trim();
    req.body.eventDate = new Date(req.body.eventDate);
    const result = await db.collection('events').insertOne(req.body);
    res.status(200).json({ message: 'Event added successfully', eventId: result.insertedId });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Error adding event' });
  }
});

/* Display all Events */
router.get('/events', async function (req, res) {
    const db = await connectToDB();
    try {
        let results = await db.collection("events").find().toArray();
        res.render('events', { events: results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* Display a single Event */
router.get('/event/detail/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("events").findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render('event', { event: result });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a single Event
router.post('/event/delete/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("events").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Event deleted" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
