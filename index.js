const express = require("express");
const app = express();
const layout = require("express-ejs-layouts");
const { addData, loadData, duplicate,deleteData,editData } = require("./fungsi");
const { body, validationResult } = require("express-validator");
const flash = require("connect-flash");
const cookie = require("cookie-parser");
const session = require("express-session");

app.set("view engine", "ejs");
app.use(layout);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookie("cat"));
app.use(
  session({
    saveUninitialized: true,
    secret: "cat",
    resave: true,
    cookie: { secure: true,maxAge: 6000 },
  })
);
app.use(flash());

app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    layout: "layouts/main",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Mee",
    layout: "layouts/main",
  });
});

app.get("/data", (req, res) => {
  const datas = loadData();
  const result = validationResult(req);
  const error = result.array();
  const msg = req.flash("s")
  console.log(msg);
  res.render("data", {
    title: "Your Data",
    layout: "layouts/main",
    datas,
    error,
    msg,
  });
});

app.post(
  "/add",
  [
    body("email", "Email is not valid").isEmail(),
    body("phoneNumber", "Use Indonesia Format!!").isMobilePhone("id-ID"),
    body("name").custom((name) => {
      const same = duplicate(name);
      if (same) {
        throw new Error(`Name ${name} is already exist`);
      } else {
        return true;
      }
    }),
  ],
  (req, res) => {
    const datas = loadData();
    const result = validationResult(req);
    const error = result.array();
    if (error.length > 0) {
      res.render("data", {
        title: "Your Data",
        layout: "layouts/main",
        datas,
        error,
        msg:req.flash("s"),
      });
    } else {
      addData(req.body);
      req.flash("s", "Data Berhasil Ditambahkan");
      res.redirect("/data");
    }
  }
);

app.post('/delete',(req,res)=>{
    deleteData(req.body.name)
    req.flash("s","Data Berhasil di hapus")
    res.redirect('/data')
})

app.post('/edit',[body("email", "Email is not valid").isEmail(),
    body("phoneNumber", "Use Indonesia Format!!").isMobilePhone("id-ID"),
    body("name").custom((name ,{req}) => {
      const same = duplicate(name);
      if (req.body.oldName !== name && same ) {
        throw new Error(`Name ${name} is already exist`);
      } else {
        return true;
      }
    }),],(req,res)=>{
        const datas = loadData();
    const result = validationResult(req);
    const error = result.array();
    if (error.length > 0) {
      res.render("data", {
        title: "Your Data",
        layout: "layouts/main",
        datas,
        error,
        msg:req.flash("s"),
      });
    } else {
      editData(req.body);
      req.flash("s", "Data Berhasil Diubah");
      res.redirect("/data");
    }
})

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
