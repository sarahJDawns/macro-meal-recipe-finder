require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const fetch = require("node-fetch-npm");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

const apiKey = process.env.API_KEY;
const PORT = process.env.PORT || 2121;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});

app.use(limiter);

app.use(cors());

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => res.render("index", { apiKey }));

app.get("/api/search", async (req, res) => {
  const { maxCalories, maxCarbs, maxFat, minProtein } = req.query;

  const url = `https://api.spoonacular.com/recipes/complexSearch?number=2&addRecipeInformation=true&instructionsRequired=true&apiKey=${apiKey}&maxCarbs=${maxCarbs}&minProtein=${minProtein}&maxCalories=${maxCalories}&maxFat=${maxFat}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.send(data);
  } catch (err) {
    res.status(500).send("Error fetching data from API");
  }
});

app.get("/views/index.ejs", (req, res) => {
  console.log("Index page requested");
  res.sendFile(__dirname + "/views/index.ejs");
});

app.get("/public/css/main.css", (req, res) => {
  console.log("Style sheet requested");
  res.sendFile(__dirname + "/public/css/main.css");
});

app.get("/images/favicon.svg", (req, res) => {
  console.log("Image requested");
  res.sendFile("/images/favicon.svg");
});

app.get("/public/js/main.js", (req, res) => {
  console.log("Main script requested");
  res.sendFile(__dirname + "/public/js/main.js");
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running, ${PORT}, better go catch it!`);
});
