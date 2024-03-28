import express from "express";
import cors from "cors";
import fs from "fs";
import period from "./data.json";
import data2023 from "./uniqueData2.json";
import * as cheerio from "cheerio";
const app = express();

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/getPeriod", async (req, res) => {
  console.log("getPeriod", req.body);
  fs.writeFile("data.json", JSON.stringify(req.body.periods), (err) => {
    if (err) {
      console.log(err);
    }
  });
  return res.send("getPeriod");
});

app.post("/aiDetails", (req, res) => {
  //   console.log("aiDetails", req.body);
  const data = JSON.parse(req.body.data);
  //   console.log(data);
  fs.writeFile(req.body.period + ".json", JSON.stringify(data), (err) => {
    console.log(err);
  });
  return res.send({
    period:
      period[
        period.findIndex(
          (x) => x.toLowerCase() === req.body.period.toLowerCase()
        ) - 1
      ],
  });
});

app.get("/getAIdetails", (req, res) => {
  const data = data2023[0];
  return res.send(data);
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.post("/addAiDetails", async (req, res) => {
  console.log("addAiDetails", req.body.data.title);
  let index = (data2023 as any).findIndex(
    (data) => data.aiId === req.body.data.aiId
  );
  console.log(index);
  fs.appendFile(
    "fullDetail4.json",
    JSON.stringify({ ...req.body.data, ...data2023[index] }),
    (err) => {
      //   console.log(err);
    }
  );
  let flag = 0;
  while (flag == 0) {
    const res = await fetch(
      "https://theresanaiforthat.com/ai/" +
        data2023[index + 1].title.split(" ").join("-")
    );
    if (res.status == 200) {
      const html = await res.text();
      const $ = cheerio.load(html);

      // extract the title
      const title = $("head > title").text();
      if (title === "There's An AI For That (TAAFT) - The #1 AI Aggregator") {
        ++index;
      } else {
        flag = 1;
      }
    } else {
      console.log(
        "error",
        res.status,
        data2023[index + 1].title.split(" ").join("-")
      );
      if (res.status == 429) {
        await delay(10000);
      } else {
        ++index;
      }
    }
  }
  return res.send({ ...data2023[index + 1], index: index + 1 });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
