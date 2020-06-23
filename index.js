const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client/build")));
const port = process.env.PORT || 5000;

app.post("/highscoresPost", async (req, res) => {
  const uri =
    "fakeUri";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const cl = await client.connect();
  try {
    await cl.db("TimoProjects").collection("PacmanGame").insertOne(req.body);
  } catch (err) {
    console.log(err);
  } finally {
    await cl.close();
  }
});

app.get("/highscoresGet", async (req, res) => {
  console.log("ok");
  const uri =
    "fakeUri";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const cl = await client.connect();
  try {
    let cursor = await cl
      .db("TimoProjects")
      .collection("PacmanGame")
      .find({})
      .sort({ score: -1 });

    let hss = await cursor.toArray();
    res.json(hss);
  } catch (err) {
    console.log(err);
  } finally {
    await cl.close();
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port);

console.log("App is listening on port " + port);
