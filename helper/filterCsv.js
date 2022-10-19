const fs = require("fs");
const filter = (filePath) => {
  try {
    let splitString = fs.readFileSync(filePath);
    splitString = splitString.toString().split("null-");
    splitString = splitString.join("");
    fs.writeFileSync(filePath,splitString);
    return splitString;
  } catch (err) {
    console.log(err)
  }
};
module.exports = {
  filter,
};
