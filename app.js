const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const url = require(__dirname + "/url.js");

const mongoose = require("mongoose");

//connect to mongoose
mongoose.connect(url.getURL(), {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

let deleteDaily = [];
let deleteHome = [];
let deleteWork = [];
let deleteSecret = [];

//Models
const Daily = mongoose.model('Daily', {
  name: String
});

const Home = mongoose.model("Home", {
  name: String
});

const Work = mongoose.model("Work", {
  name: String
});

const Secret = mongoose.model("Secret", {
  name: String
});

// sample of inserting process to database item.save().then(() => console.log(  def +" added to database..."));

//Home route
app.get("/", function(req, res) {
  Daily.find(function(err, dailyList) {
    if (!err) {
      const today = date.getDate();
      res.render("index", {
        listName: "Daily List",
        date: today,
        list: dailyList
      });
    }
  });
});

app.post("/", function(req, res) {
  const userItem = req.body.newItem;

  const item = new Daily({
    name: userItem
  });

  item.save().then(() => console.log(item + " added to database..."));
  res.redirect("/");
});

app.get("/home", function(req, res) {
  Home.find(function(err, homeList) {
    if (!err) {
      const today = date.getDate();
      res.render("lists", {
        listName: "Home List",
        pageUrl: "/home",
        date: today,
        pagesList: homeList
      });
    }
  });
});

app.post("/home", function(req, res) {
  const userItem = req.body.newItem;

  const item = new Home({
    name: userItem
  });

  item.save().then(() => console.log(item + " added to database..."));
  res.redirect("/home");
});

app.get("/work", function(req, res) {
  Work.find(function(err, workList) {
    if (!err) {
      const today = date.getDate();
      res.render("lists", {
        listName: "Work List",
        pageUrl: "/work",
        date: today,
        pagesList: workList
      });
    }
  });
});

app.post("/work", function(req, res) {
  const userItem = req.body.newItem;

  const item = new Work({
    name: userItem
  });

  item.save().then(() => console.log(item + " added to database..."));
  res.redirect("/work");
});


app.get("/secret", function(req, res) {
  Secret.find(function(err, secretList) {
    if (!err) {
      const today = date.getDate();
      res.render("lists", {
        listName: "Secret List",
        pageUrl: "/secret",
        date: today,
        pagesList: secretList
      });
    }
  });
});

app.post("/secret", function(req, res) {
  const userItem = req.body.newItem;

  const item = new Secret({
    name: userItem
  });

  item.save().then(() => console.log(item + " added to database..."));
  res.redirect("/secret");
});

app.post("/delete", function(req, res) {
  const deleteItemID = req.body.checkbox;
  console.log(deleteItemID);
  deleteDaily.push(deleteItemID);
});

app.post("/delete-selections", function(req, res) {
  deleteDaily.forEach(function(id) {
    Daily.deleteOne({
      _id: id
    }, function(err) {
      if (err) return handleError(err);
    });
  })
  deleteDaily = [];
  res.redirect("/");
});

app.post("/pages-delete", function(req, res) {
  let pageUrl = req.body.pageUrl;
  console.log(pageUrl);

  switch (pageUrl) {
    case "/home":
      const deleteHomeItem = req.body.checkbox;
      console.log(deleteHomeItem);
      deleteHome.push(deleteHomeItem);
      break;
    case "/work":
      const deleteWorkItem = req.body.checkbox;
      console.log(deleteWorkItem);
      deleteWork.push(deleteWorkItem);
      break;
    case "/secret":
      const deleteSecretItem = req.body.checkbox;
      console.log(deleteSecretItem);
      deleteSecret.push(deleteSecretItem);
      break;
    default:
    console.log("Something wrong");
  }

  pageUrl="";
});

app.post("/pages-delete-selections", function(req, res) {
  const pageUrl = req.body.removeButton;
  console.log(pageUrl);

  switch (pageUrl) {
    case "/home":
      deleteHome.forEach(function(id) {
        Home.deleteOne({
          _id: id
        }, function(err) {
          if (err) return handleError(err);
        });
      })

      res.redirect("/home");
      break;

    case "/work":
      deleteWork.forEach(function(id) {
        Work.deleteOne({
          _id: id
        }, function(err) {
          if (err) return handleError(err);
        });
      })

      res.redirect("/work");
      break;

    case "/secret":
      deleteSecret.forEach(function(id) {
        Secret.deleteOne({
          _id: id
        }, function(err) {
          if (err) return handleError(err);
        });
      })

      res.redirect("/secret");
      break;

    default:
  }
});

app.get("/clock",function(req,res){
  const today=date.getDate();
  res.render("clock");
});

app.get("/:userurl", function(req, res) {
  res.render("error");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(req, res) {
  console.log("Server has started successfully");
});
