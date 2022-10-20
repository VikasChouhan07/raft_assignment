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
const { dataObj } = require("./dataStore");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp/csv/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  },
});
const upload = multer({ storage: storage });

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
      const bookData = filter(req.files.book[0].path, req.files.author[0].path);
      const magazinesData = filter(
        req.files.magazines[0].path,
        req.files.author[0].path
      );
      dataObj.books = bookData;
      dataObj.magazines = magazinesData;
      let combinedData = [...dataObj.books, ...dataObj.magazines];
      combinedData.sort((a, b) => {
        if (a.title > b.title) {
          return 1;
        }
        if (b.title > a.title) {
          return -1;
        }
        return 0;
      });

      res.render("response", {
        books: dataObj.books,
        magazines: dataObj.magazines,
        sortedData: combinedData,
      });
    } catch (err) {
      console.log(err);
    }
  }
);
app.get("/book/:isbn", async (req, res) => {
  try {
    const combinedData = [...dataObj.books, ...dataObj.magazines];
    console.log(combinedData);
    const bookData = combinedData.find((book) => {
      if (
        req.params.isbn == book.isbn ||
        req.params.isbn == book.isbn.split("-").join("")
      ) {
        return book;
      }
    });
    if (bookData) return res.status(200).json(bookData);
    else return res.status(400).json("Not found!");
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

app.get("/books_and_magazines/:email", async (req, res) => {
  try {
    const combinedData = [...dataObj.books, ...dataObj.magazines];
    const filteredData = await combinedData.map((obj) => {
      if (obj.emails.includes(req.params.email)) return obj;
    });
    if (filteredData) return res.status(200).json(filteredData);
    else return res.status(400).json("Not found!");
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(
    `Assignment services application listening at http://localhost:${port}`
  );
});
module.exports = app;
