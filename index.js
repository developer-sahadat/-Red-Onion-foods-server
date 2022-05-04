const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://redOnionFood:5Z6jatHTF2p2XZRu@cluster0.ds9li.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  console.log("database connected");
  try {
    await client.connect();
    const foodCollection = client.db("redOnionFood").collection("food");
    //read  get api
    app.get("/food", async (req, res) => {
      const query = {};
      const cursor = foodCollection.find(query);
      const foodData = await cursor.toArray();
      res.send(foodData);
    });

    // create post api star here
    app.post("/food", async (req, res) => {
      const query = req.body;
      const result = await foodCollection.insertOne(query);
      res.send(result);
    });

    // delete get api
    app.delete("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await foodCollection.deleteOne(query);
      res.send(result);
    });

    // put start here api
    app.put("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: query,
      };

      const result = await foodCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // single product api

    app.get("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const food = await foodCollection.findOne(query);
      res.send(food);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (reg, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log("this is port", port);
});
