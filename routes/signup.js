const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Validate=require('../validtation/signupValidation')

router.post("/signup", async (req, res) => {
  const { fullname, username, email, password } = req.body;
  const newUser = new User({
    fullname,
    username,
    email,
    password,
  });

  const error=Validate(req.body);
  if(error){
    res.status(400).json(error.details[0].message)
  }
  const existedUser = await User.findOne({ email });

  try {
    if(existedUser) return res.status(400).json('user already registered');
    const salt=await bcrypt.genSalt(12);
    newUser.password=await bcrypt.hash(newUser.password,salt)
    const user=await newUser.save();
    res.status(200).json(user)
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
