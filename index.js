const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000 ;



// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wwiopku.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{

        const serviceCollection = client.db('dentist').collection('services');
        const reviewCollection = client.db('dentist').collection('reviews');

        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        app.get('/allservices', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        app.post('/services', async(req, res) => {
            const addService = req.body;
            const result = await serviceCollection.insertOne(addService);
            res.send(result);

        });


        app.get('/reviews', async(req, res) => {
            let query = {};
            if(req.query.email){
                query = {
                    userEmail: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/reviews', async(req, res) => {
            const addreviews = req.body;
            const result = await reviewCollection.insertOne(addreviews);
            res.send(result);
        });

        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally{

    }
}

run().catch(error => console.log(error))


app.get('/', (req, res) => {
    res.send('Travel Services is Running')
});

app.listen(port, () => {
    console.log('Listing is port', port);
})