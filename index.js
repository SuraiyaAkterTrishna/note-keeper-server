const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fhof7sw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("note-keeper").collection("notes");
    const archivesCollection = client.db("note-keeper").collection("archives");
    const trashCollection = client.db("note-keeper").collection("trash");
// CREATE------------------------------------------------------------->
    // create note
    app.post("/notes", async (req, res) => {
      const addNote = req.body;
      const result = await notesCollection.insertOne(addNote);
      res.send(result);
    });

    // create archives
    app.post("/archives", async (req, res) => {
      const addNote = req.body;
      const result = await archivesCollection.insertOne(addNote);
      res.send(result);
    });

    // create Trash
    app.post("/trash", async (req, res) => {
      const addNote = req.body;
      const result = await trashCollection.insertOne(addNote);
      res.send(result);
    });
// GET-----------------------------------------------------------> 
    // get notes
    app.get("/notes", async (req, res) => {
      const query = {};
      const cursor = notesCollection.find(query);
      const notes = await cursor.toArray();
      res.send(notes);
    });

    // get archives
    app.get("/archives", async (req, res) => {
      const query = {};
      const cursor = archivesCollection.find(query);
      const notes = await cursor.toArray();
      res.send(notes);
    });

    // get Trash
    app.get("/trash", async (req, res) => {
      const query = {};
      const cursor = trashCollection.find(query);
      const notes = await cursor.toArray();
      res.send(notes);
    });
// DELETE------------------------------------------------------->
    // delete data from notes collection
    app.delete("/notes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      console.log(query);
      const result = await notesCollection.deleteOne(query);
      res.send(result);
    });
    // delete data from archive collection
    app.delete("/archives/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await archivesCollection.deleteOne(query);
      res.send(result);
    });
    // delete data from archive collection
    app.delete("/trash/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await trashCollection.deleteOne(query);
      res.send(result);
    });
    
  } finally {

  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from backend");
});

app.listen(port, () => {
  console.log(`Note Keeper listening on port ${port}`);
});
