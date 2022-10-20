const fs = require("fs");
const csvToJson = require("convert-csv-to-json");
const filter = (filePath, authorDataPath,type) => {
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
module.exports = {
  filter,
};
