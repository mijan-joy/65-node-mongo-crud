const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

//user : dbuser1
// password : dMt6sCPAvtWbn0bt



const { CLIENT_RENEG_WINDOW } = require('tls');
const uri = "mongodb+srv://dbuser1:dMt6sCPAvtWbn0bt@cluster0.mfti4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
 try{
         // Connect the client to the server
         await client.connect();
         const usersCollection = client.db("foodExpress").collection("user");

         // get the users
        app.get('/user', async(req, res) => {
            const query = {};
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })
        //update user
        app.get('/user/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await usersCollection.findOne(query);
            res.send(result);
        })

         // Post user:  add new users 
          app.post('/user', async(req, res) => {
            const newUser = req.body;
            console.log('Adding new user', newUser);
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
         });

         // PUt user: update user
         app.put('/user/:id', async(req, res) =>{
            const id = req.params.id;
            const updateUser = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email,
                }
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result);

         })

         // delete user
            app.delete('/user/:id', async(req, res) => {
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const result = await usersCollection.deleteOne(query);
                res.send(result);

            });
         
 }
 finally{
      // Ensures that the client will close when you finish/error
    // await client.close();
 }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('running my Node crud server');
});

app.listen(port, () => {
    console.log('CRUD Server is running on port')
});