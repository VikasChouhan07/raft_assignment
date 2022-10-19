const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const swig = require("swig");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", swig.renderFile);
const csvToJson = require("convert-csv-to-json");
const { filter } = require("./helper/filterCsv");
const { response } = require("express");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp/csv/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  },
});
const upload = multer({ storage: storage });

// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  try {
    res.render("index", {
      title: "Assignment",
    });
  } catch (err) {
    console.log(err);
  }
});

app.post(
  "/upload",
  upload.fields([
    { name: "author", maxCount: 1 },
    { name: "book", maxCount: 1 },
    { name: "magazines", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      filter(req.files.book[0].path);
      filter(req.files.author[0].path);
      filter(req.files.magazines[0].path);
      console.log(req.files.book[0].path);
      let json = csvToJson.getJsonFromCsv(req.files.book[0].path);
      const books = csvToJson.getJsonFromCsv(req.files.book[0].path);
      const magazines = csvToJson.getJsonFromCsv(req.files.magazines[0].path);
      const author = csvToJson.getJsonFromCsv(req.files.author[0].path);
      res.render("response", {
        books,
        magazines,
        author,
      });
    } catch (err) {
      console.log(err);
    }
  }
);
app.get("/book/:isbn", async (req, res) => {
  try {
    const bookPath = "tmp/csv/book";
    const books = csvToJson.getJsonFromCsv(bookPath);
    let bookData = await books.find((book) => {
      if (req.params.isbn == book.isbn) return book;
    });
    console.log(bookData);
    console.log("here");
    if (bookData) return res.end(JSON.stringify(bookData));
    else return res.status(400).json("Not found!");
  } catch (err) {
    console.log(err);
  }
});

app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(
    `Assignment services application listening at http://localhost:${port}`
  );
});
