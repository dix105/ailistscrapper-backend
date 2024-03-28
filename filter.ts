import data from "./uniqueData.json";
import fs from "fs";
let uniqueData = data.filter(
  (value, index, self) =>
    self.findIndex(
      (v) => v.title.toLowerCase() === value.title.toLowerCase()
    ) === index
);

fs.writeFile("uniqueData2.json", JSON.stringify(uniqueData), (err) => {
  console.log(err);
});
