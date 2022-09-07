const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const signup = require("./routes/signup");
const login = require("./routes/login");
const post = require("./routes/post");
const user = require("./routes/user");

dotenv.config({ path:"./.env" });

app.use(cors());
app.use(express.json());

// connecting to mongodb
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('connected to mongodb')).catch(error => console.log(error))

app.use("/api", signup);
app.use("/api", login);
app.use("/api", post);
app.use("/api", user);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
