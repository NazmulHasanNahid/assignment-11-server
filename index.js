const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggpou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// server and mongodb connection
async function run() {
    try {
        await client.connect();
        const database = client.db("Travel");
        const serviceCollection = database.collection("destinations");
        const bookingCollection = database.collection("placeOrders");
        // get api for all data
        app.get("/allbooking", async (req, res) => {
            const cursor = serviceCollection.find({});
            const destinations = await cursor.toArray();
            res.send(destinations);
        });

        //get api for a single data
        app.get("/allbooking/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleBookingInfo = await serviceCollection.findOne(
                query
            );
            
            res.send(singleBookingInfo);
        });

        // Post api
        app.post("/allbooking", async (req, res) => {
            const booking = req.body;
            const result = await serviceCollection.insertOne(booking);
            res.json(result);
        });

        // get api
        app.get("/manageallorder", async (req, res) => {
            const manageorder = await bookingCollection.find({}).toArray();
            res.send(manageorder);
        });

        // get api for place booking
        app.get("/mybooking/:email", async (req, res) => {
            const email = req.params.email;
            const mybooking = await bookingCollection
                .find({ email })
                .toArray();
            res.send(mybooking);
        });

        // delete api 
        app.delete("/mybooking/:id", async (req, res) => {
            const bookingId = req.params.id;
            const query = { _id: ObjectId(bookingId) };
            const deleteBooking = await bookingCollection.deleteOne(query);
            res.json(deleteBooking);
        });

        // update api 
        app.put("/mybooking/:id", async (req, res) => {
            const updateId = req.params.id;
            const updatedStatus = req.body;
            const filter = { _id: ObjectId(updateId) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status,
                },
            };
            const approvedres = await bookingCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.json(approvedres);
        });

        // post api for booking order collection
        app.post("/placebooking", async (req, res) => {
            const placebooking = req.body;
            const result = await bookingCollection.insertOne(placebooking);
            res.json(result);
        });
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server Connected");
});
app.listen(port, () => {
    console.log('webs server ', port);
});














