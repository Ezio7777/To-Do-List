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
  let newI = new Item({
    name: item,
  });

  newI.save();

  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const deleteItem = req.body;

  Item.deleteOne({ _id: deleteItem.checkbox })
    .then(() => {
      console.log("Succesfully Delete");
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect("/");
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
});

const List = mongoose.model("list", listSchema);

app.get("/:customList", (req, res) => {
  let customListName = req.params.customList;

  const defaultlist = new List({
    name: customListName,
    items: intro,
  });

  List.find({ name: customListName })
    .then((found) => {
      console.log(found);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log("Port Started : 3000");
});
