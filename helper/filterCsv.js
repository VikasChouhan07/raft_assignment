const fs = require("fs");
const csvToJson = require("convert-csv-to-json");
const addAuthors = (filePath, authorDataPath) => {
  try {
    let fileData = csvToJson.getJsonFromCsv(filePath);
    const authors = csvToJson.getJsonFromCsv(authorDataPath);
    fileData.forEach((file, index) => {
      let totalAuthors = file.authors.split(",");
      for (let j = 0; j < totalAuthors.length; j++) {
        authors.find((obj) => {
          if (totalAuthors[j].split("-")[1] == obj.email.split("-")[1]) {
            if (j == 0) {
              fileData[index].authors = [];
              fileData[index]["emails"] = [];
            }
            fileData[index].authors.push(`${obj.firstname} ${obj.lastname}`);
            fileData[index].emails.push(totalAuthors[j].split("-")[1]);
          }
        });
      }
    });
    return fileData;
  } catch (err) {
    console.log(err);
  }
};
const getPossibleMoves = (posA, posB) => {
  let placesItCanMove = [];
  let X = [2, 1, -1, -2, -2, -1, 1, 2];
  let Y = [1, 2, 2, 1, -1, -2, -2, -1];
  let m = 8;
  let n = 8;
  for (let i = 0; i < 8; i++) {
    let x = posA + X[i];
    let y = posB + Y[i];

    if (x >= 0 && y >= 0 && x < n && y < m) placesItCanMove.push(x + "," + y);
  }
  console.log(placesItCanMove);
  return placesItCanMove;
};

module.exports = {
  addAuthors,
  getPossibleMoves,
};
