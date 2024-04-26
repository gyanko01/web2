const express = require('express');
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
const dotenv = require('dotenv');
const http = require('http');
const url = require('url');


const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;
//const mongoUri = "mongodb+srv://gerganayankova:n09uUMwJUn2fOy7L@cluster0.fem1v2s.mongodb.net/?tls=true";

app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine' , 'pug');

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/home.html');
});

app.post('/process' , async (req, res) => {
    console.log("Received query:", req.body.query);
    const input = req.body.query;
    const isZip = !isNaN(input[0]); // checks if the first character is digit

   try{
    const client = new MongoClient(mongoUri,{tls: true});
    await client.connect();
    console.log("Connected successfully to Mongo DB");

    const db = client.db('zips');
    const collection = db.collection('places');

    let query = isZip ?{zips: input} : {place: input};
    console.log("Database query:", query); // Log the query object
    const placeData = await collection.findOne(query);
    console.log("Query result:", placeData); // Log the result of the query

    client.close();

    if(placeData){
        res.render('process', {placeName: placeData.place, zips: placeData.zips.join(', ') });
    }else{
        res.render('process', {placeName :"No results found", zips: "" });
    }
}catch(err){
    console.log('Database connection error', err);
    res.status(500).send('Error connecting to database');
}

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

   



