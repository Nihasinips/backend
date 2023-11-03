const express = require("express");
const cors= require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/user");
const DeliveryModel = require('./models/delivery');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Add this line for JWT
const app = express();
const PORT = 3001;

const dbUrl = "mongodb+srv://Nihasini:dud166pqZgKJV77c@cluster0.kzer7lm.mongodb.net/Book?retryWrites=true&w=majority";
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbUrl, connectionParams).then(() => {
  console.info("Connected to the DB");
}).catch((e) => {
  console.log("Error: ", e);
});
app.use(cors());
app.use(express.json()); // Enable JSON request body parsing

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    const userModel = new UserModel({
      name: firstName + ' ' + lastName,
      username,
      email,
      password,
    });

    await userModel.save();
    res.status(201).json({ message: 'Registration Successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

app.post('/delivery', async (req, res) => {
  try {
    const {
      doorNo,
      address,
      city,
      landmark,
      state,
      country,
      mobileNumber,
      pincode,
    } = req.body;

    if (!doorNo || !address || !city || !landmark || !state || !country || !mobileNumber || !pincode) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    const deliveryModel = new DeliveryModel({
      doorNo,
      address,
      city,
      landmark,
      state,
      country,
      mobileNumber,
      pincode,
    });

    await deliveryModel.save();
    res.status(201).json({ message: 'Delivery information saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while saving delivery information' });
  }
});


app.post('/coachlog', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // const passwordMatch = await bcrypt.compare(password, user.password);
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
