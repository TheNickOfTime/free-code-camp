const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const { post } = require('../Lessons/02 - Basic Node and Express/myApp');

// Basic config ------------------------------------------------------------------------------------
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Mongoose config ---------------------------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI);

const exerciseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  exercises: {
    type: [exerciseSchema],
    required: false,
  }
});
// let Exercise = new mongoose.model('Exercise', exerciseSchema);

let User = new mongoose.model('User', userSchema);


// Functions ---------------------------------------------------------------------------------------

// User functions --------------------------------------------------------------
const getUserByUsername = async (username) => {
  try {
    let query = User.findOne({username: username}, '_id username');
    let result = await query.exec();
    return result;
  } catch(error) {
    console.log(error);
  }
};

const getUserByID = async (id) => {
  try {
    let query = User.findOne({_id: id}, '_id username exercises');
    let result = await query.exec();
    return result;
  } catch(error) {
    console.log(error);
  }
}

const getAllUsers = async () => {
  try {
    let query = User.find({}, '_id username');
    let result = await query.exec();
    return result;
  } catch(error) {
    console.log(error);
  }
}

const saveUser = async (username) => {
  try {
    let newUser = new User({
      username: username,
    });
    let result = await newUser.save();
    let jsonData = await User.findOne(result, '_id username')
    return jsonData;
  } catch(error) {
    console.log(error);
  }
};

// Exercise functions ----------------------------------------------------------
const saveExercise = async (userID, exercise) => {
  try {
    let user = await User.findOne({_id: userID});
    // console.log("Exercises:", user.exercises);
    let update = await User.updateOne({_id: userID}, {exercises: [...user.exercises, exercise]})
    // console.log(update);
    return update;
  }  catch(error) {
    console.log(error);
  }
}


// Routes config -----------------------------------------------------------------------------------

// User routes -----------------------------------------------------------------
app.post('/api/users', async (req, res) => {
  try {
    const postedUsername = req.body.username;
    console.log(`POST reqest for username ${postedUsername}`);
    let existingUser = await getUserByUsername(postedUsername);
    if (!existingUser) {
      console.log(`User '${postedUsername}' does not already exist, creating...`);
      let newUser = await saveUser(postedUsername);
      console.log(`User ${postedUsername} has been created!`);
      res.json(newUser);
    } else {
      res.json(existingUser);
      console.log(`User '${postedUsername}' already exists`);
    }
  } catch(error) {
    console.log(error);
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    console.log(`GET request for all users`);
    res.json(users);
  } catch(error) {
    console.log(error);
  }
});

// Exercise routes -------------------------------------------------------------
app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const userID = req.params._id;
    console.log(`POST request for new exercise entry for a user with ID ${userID}:`);
    console.log("Body:", req.body, " Params:", req.params);
    const isValidUserID = mongoose.isValidObjectId(userID);
    const isValidDate = Date.parse(req.body.date);
    if (isValidUserID) {
      const userData = await getUserByID(userID);
      console.warn(userData);
      const jsonData = {
        username: userData.username,
        description: req.body.description,
        duration: parseInt(req.body.duration),
        date: new Date(isValidDate ? isValidDate : Date.now()).toDateString(),
        // date: (isValidDate ? new Date(isValidDate) : new Date(Date.now())).toDateString(),
        _id: userID,
      }
      await saveExercise(userID, jsonData);
      console.log("Returning EXERCISES", jsonData);
      res.json(jsonData);
    }
  } catch(error) {
    console.log(error);
  }
});

app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    const userID = req.params._id;
    console.log(`GET request for exercise entries log for a user with ID ${userID}:`)
    console.log("Params:", req.params);
    const isValidUserID = mongoose.isValidObjectId(userID);

    if (isValidUserID) {
      // Get data
      const userData = await getUserByID(userID);
      let exerciseData = userData.exercises.map(exercise => { return {
        description: exercise.description,
        duration: parseInt(exercise.duration),
        date: new Date(exercise.date).toDateString(),
      }});

      // Read queries
      const {from, to, limit} = req.query;

      if (from) {
        exerciseData = exerciseData.filter(exercise => new Date(exercise.date) > new Date(from));
      }
      if (to) {
        exerciseData = exerciseData.filter(exercise => new Date(exercise.date) < new Date(to));
      }
      if (limit) {
        exerciseData = exerciseData.filter((exercise, index) => index < limit);
      }

      const jsonData = {
        username: userData.username,
        count: userData.exercises.length,
        _id: userData._id,
        log: exerciseData,
      }
      console.log("Returning LOG", jsonData);
      res.json(jsonData);
    } else {
      console.log("invalid userID");
    }
  } catch(error) {
    console.log(error);
  }
});


// Listener config ---------------------------------------------------------------------------------
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
