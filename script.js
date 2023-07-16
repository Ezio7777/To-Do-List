const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/own_Modules/date.js");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose
  .connect("mongodb://127.0.0.1:27017/todolist")
  .then(() => {
    console.log("Succesfully Connected to the Mongodb Database");
  })
  .catch(() => {
    console.log("Error Connecting to the Mongodb Database");
  });

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Item name was EMPTY"],
  },
});

const Item = mongoose.model("items", itemSchema);

const intro = new Item({
  name: "Add new Items by clicking + button",
});

app.get("/", function (req, res) {
  let day = date.getDay();

  Item.find().then((foundItem) => {
    if (foundItem.length === 0) {
      Item.insertMany(intro);
      res.redirect("/");
    } else {
      res.render("list", { today: day, newListItems: foundItem });
    }
  });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Port Started");
});
