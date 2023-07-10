const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/own_Modules/date.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

let items = [];

app.get("/", function (req, res) {
  let day = date.getDay();
  res.render("list", { today: day, newListItems: items });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Port Started");
});
