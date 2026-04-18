const express=require('express');
require('dotenv').config();
const {MongoClient}=require('mongodb');
const PORT=process.env.PORT;
const app=express();
app.use(express.static('public'));
app.use(express.json());

const URL=process.env.MONGODB_URI;
const mongoClient=new MongoClient(URL);
(
    async()=>{
        try{
            await mongoClient.connect();
            app.locals.collection=mongoClient.db('productdb').collection('products');
            app.listen(PORT);
            console.log('Server starting.....');

        }
        catch(err){
            return console.log(err);

        }
    }

)();
app.get('/api/products',async(req,res)=>{
    const collection=req.app.locals.collection;
    try{
        const products=await collection.find({}).toArray();
        res.send(products);

    }
    catch(err){
           console.log(err);
        res.sendStatus(500);
    }

});
app.post('/api/products',async(req,res)=>{
    if(!req.body) return res.sendStatus(400);
    const productName=req.body.name;
    const prosductPrice=req.body.price;
    const product={name:productName,price:prosductPrice};

    const collection=req.app.locals.collection;
    try{
        await collection.insertOne(product);
        res.send(product)

    }
    catch(err){
        console.log(err);
        res.sendStatus(500);

    }

});

process.on('SIGINT',async()=>{
    await mongoClient.close();
    process.exit();

});