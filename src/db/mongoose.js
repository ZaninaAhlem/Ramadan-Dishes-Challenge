const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://Ahlem:CDgDU6vQhwZEac92@cluster0.dipke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
