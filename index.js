const express = require('express');
const cors = require("cors");
const app=express();
const port=process.env.PORT || 5000;
require("dotenv").config();

const { MongoClient, ServerApiVersion ,ObjectId} = require("mongodb");
app.use(cors());
app.use(express.json());
//connection


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsxv4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try{
    await client.connect();

    const collection = client.db("notes-tracker").collection("notes");
    //Get all data
    // Get api:http://localhost:5000/notes
    //data format:
    //     {
    //     "name":"Effat ara",
    //     "text":"mid term"
    //     }
    app.get("/notes", async (req, res) => {
      const q = req.query;
      console.log(q);
      const cursor = collection.find(q);
      const result = await cursor.toArray();

      res.send(result);
    });

    //Post note
    //post api(insert data):http://localhost:5000/note
    app.post("/note", async (req, res) => {
      const data = req.body;
      const result = await collection.insertOne(data);
      console.log(data);
      res.send(result);
    });

    //update notes
    //update api:http://localhost:5000/note/627e26d3fec013dd4a339314
    app.put("/note/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: data.name,
          text: data.text,
        },
      };
      const result = await collection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    //delete notes
    //delete api:http://localhost:5000/note/627e26d3fec013dd4a339314

    app.delete("/note/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await collection.deleteOne(filter);
      res.send(result);
    });
    console.log("database connected");
  }
  catch{

  }
}

run().catch(console.dir);










// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsxv4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });
// async function run() {
//   try{
//     await client.connect();
    
//     const collection = client.db("notes-tracker").collection("notes");
    
//     console.log("database connected");

//   }
//   catch{

//   }
// }

// run().catch(console.dir);




app.get('/',(req,res)=>{
  res.send("Server is running");
})

app.listen(port,()=>{
  console.log("Listening to port",port);
})