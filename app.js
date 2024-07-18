const express=require('express')
const connection=require('./dbService');
const app=express();
const cors=require('cors');
const dotenv=require('dotenv');
dotenv.config();
app.use(cors());

// data can be send in json format
app.use(express.json());
//we are not sending any foreign data
app.use(express.urlencoded({extended:false}));


// create new data
app.post('/insert',(request,response)=>{

})

// read
app.get('/getAll',(request,response)=>{
    console.log('test');
})

// update


// delete


// starting the local server by getting port no. from env file
app.listen(process.env.PORT, ()=>console.log('app is running'));