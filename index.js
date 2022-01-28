const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000

// middleWare
app.use(cors())
// for the access userData body data
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.poyqe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect()
        const database = client.db('store_management');
        const cartsCollection = database.collection('carts');
        const medicineCollection = database.collection('medicine');
        const salesExecutive = database.collection('salesExecutive');
        const reviewsCollection = database.collection('reviews');
        const productsCollection = database.collection('products');





        console.log('your store management database running')


        // GET API
        //get all the medicine 
        app.get('/medicine', async (req, res) => {
            const cursor = medicineCollection.find({});
            const medicines = await cursor.toArray();
            // console.log(comments)
            res.json(medicines);
        })
        app.get('/salesExecutives', async (req, res) => {
            const cursor = salesExecutive.find({});
            const salesExecutives = await cursor.toArray();
            // console.log(comments)
            res.json(salesExecutives);
        })

        // POST Api
        // upload a new medicine
        app.post('/medicine', async (req, res) => {
            const medicine = req.body;
            const result = await medicineCollection.insertOne(medicine);
            res.json(result)
            // res.json({message:'sakilhere'})
        })
        app.post('/salesExecutives', async (req, res) => {
            const salesExecutives = req.body;
            const result = await salesExecutive.insertOne(salesExecutives);
            res.json(result)

            // res.json({message:'sakilhere'})
        })

        // PUT API
        // update data
        app.put('/medicines', async (req, res) => {
            const medicineDetails = req.body;
            const filter = { _id: ObjectId(medicineDetails._id) };
            // const options = { upsert: true };
            const { _id, ...rest } = medicineDetails
            const updateDoc = { $set: { ...rest } };
            const result = await medicineCollection.updateOne(filter, updateDoc);
          console.log('here')
            res.json(result);

        })
        app.put('/salesExecutive', async (req, res) => {
            const executiveDetails = req.body;
            const filter = { _id: ObjectId(executiveDetails._id) };
            // const options = { upsert: true };
            const { _id, ...rest } = executiveDetails
            const updateDoc = { $set: { ...rest } };
            const result = await salesExecutive.updateOne(filter, updateDoc);
            res.json(result);

        })

        // Delete Api
        // delete one
        app.delete('/medicine/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await medicineCollection.deleteOne(query);
            res.json(result);
        })
        app.delete('/salesExecutive/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await salesExecutive.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello freaking store management!')
})

app.listen(port, () => {
    console.log(`this freaking app listening http://localhost:${port}`)
})

