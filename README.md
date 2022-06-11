### introduction

### 


#### install node
EJS:
NODEMAILER:
EXPRESS:
NODE_FETCH:


>
    npm i express ejs nodemailer node-fetch
    npm install node-fetch@2
>

#### Nodejs Single thread event loop

>
    ....
>


#### create front end page for make and login and approve system

file:home.ejs

>

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <form method ="post" >

            <label className="form-label" htmlFor="id">ID:</label><br>
            <input name="id" placeholder="ID here!!" required ><br>

            <label className="form-label" htmlFor="Password">Password  : </label><br>
            <input name="password" type="password" placeholder="passsword"   required><br>
            <label for ="Approved"> <!-- Radial type input -->
                <input id ="Approved" type ="radio" name="approvedSystem" value="Approved" checked>Approved <!-- checked == default selected-->
            </label>
            <label for="Not-Approved">
                <input id ="Not-Approved" type ="radio" name="approvedSystem" value="Not-Approved">Not-Approved
            </label><br>
    
            <button >SUBMIT</button>
        </form>
    </body>
    </html>

>


#### create login and approve system

mock up 3 user as file: userpassword for simulation

file:userpassword.json

>

    {
    "data1": [
        {
        "username": "kittipot1",
        "password": "123",
        "data": "Approved"
        },
        {
        "username": "kittipot2",
        "password": "321",
        "data": "Empty"
        },
        {
        "username": "kittipot3",
        "password": "213",
        "data": "Empty"
        }
    ]
    }

>


#### create simple webserver

file: server.js

>
    const express = require('express');
    const server = express();
    server.listen(12000);

    const fetch =require('node-fetch')
    const nodemailer = require("nodemailer");


    var readVerbPost =express.urlencoded({extended:false}) 
    var ejs = require("ejs")
    server.use(express.static(__dirname + '/public'));
    server.engine("html",ejs.renderFile)


    server.get(["/data"],test)
    server.get(["/home"],showApprovePage)
    server.post(["/home"],readVerbPost,UpdateStatus)
>

#### fetch data from API and find min,max,avg of value
#### Slice data into 200 and send out to as API


test with real api data

>

    async function test(req,res){

    // fetch data api
    const response =  await fetch('http://3.1.189.234:8091/data/ttntest');
    const data =  await response.json();
    console.log(data.length);



    //find min max 
    var minData = data.reduce( (acc, cur )=> ((acc.data < cur.data)? acc : cur) );
    console.log ('min =', JSON.stringify(minData) );
    var maxData=  data.reduce( (acc, cur )=> ((acc.data > cur.data)? acc : cur) );
    console.log ('max =', JSON.stringify(maxData) );

    //find avg
    var Avg_JSO = data.reduce( (acc, cur, idx, arr )=> {
        let
        sum = acc.data + cur.data,
        no = idx +1;
        if (no === arr.length) { sum = sum / no };
        return {  'data': sum }
    });
    console.log ('Avg =', JSON.stringify(Avg_JSO) );



    //slice data 
    var resultSlice = separateArray(data, 200)



    res.send(JSON.stringify(resultSlice))



    }

    // //  Divided Array 200 unit (test with 200 unit)
    function separateArray(arr, size) {
        var bufferArray = [];
        for (var i = 0; i < arr.length; i += size) {
            var sliceArray = arr.slice(i, i + size);
            bufferArray.push(sliceArray);
        }
        return bufferArray;
    }

>

#### render ejs file

>

    ///approve systerm 
    function showApprovePage(request,response){
        response.render('home.ejs')
    }

>

result with min/max/avg data

>
   ....
>



result of sending api as 200 array json

>
    .....
>



file server.js

function get body messege and compare value

>
    .....
>

send an email to notify after approve all 3 people

>
    .....
>

result of send an email

>
    .....
>


next for challenging 

<ol>
    <li> make an webpage for hr to write message and send an email for  </li>
</ol>

