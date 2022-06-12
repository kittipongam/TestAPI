# INTRODUCTION
THIS TEST IS FROM SWIFT DYNAMIC <br>
<img src="https://user-images.githubusercontent.com/104770048/173200656-b413e5a3-e599-4820-82bb-432985033d11.png" alt="test backend">

## SINGLE THREAD ENVENT LOOP MODEL PRINCIPLE


<img src="https://user-images.githubusercontent.com/104770048/173200501-966c978c-70a2-45c0-9b4d-318d88438f92.png" alt="">

<ul>
    <li>  Client send request to Web Server      </li>
    <li>  Node JS internally maintain a limited thread pool services to client request</li>
    <li>  Node JS receives request and place in to Event Queue      </li>
    <li>  Node JS web server has component Event Loop to receive request and process which uses Single Thread Only and its main point  </li>
    <li>  Event Loop check any client request placed in event Queue  </li>
</ul>

<p> if client request "DOES NOT" require any Blocking IO operation then process everthing and send it back </p>
<p> if client requires some Blocking IO operation  </p>
<ol>
    <li>checks thread available from internal thread pool</li>
    <li>Pick up one thread and assign this to client request</li>
    <li>that thread is responsible for taking that request, process, perform Blocking IO and prepare to send back to event loop</li>
    <li>Event loop: send that response to respective Client</li>
</ol>

>
    *** Blocking IO operation : such as interacting with database, File system, External Service
>



## install node

EJS: <br>
NODEMAILER: <br>
EXPRESS: <br>
NODE_FETCH: <br>


>
    npm i express ejs nodemailer node-fetch@2
>



## RENDER FILE FOR LOGIN AND APPROVE SYSTEM

file: home.ejs

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

## MOCK UP 3 USERS 

file: userpassword.json <br>
- create json file to simulation for account, password and approve data for 3 users

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

## CREATE SIMPLE SERVER


file: server.js <br>

// Create simple server

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

// Fetch data from API and find min/max/avg  <br>
// Slice data into 200 rang and sent out as API <br>


>

    //fetch
    async function test(req,res){

    // fetch data api
    const response =  await fetch('http://3.1.189.234:8091/data/ttntest');
    const data =  await response.json();
    //console.log(data.length);



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

     //  Divided Array 200 unit (test with 200 unit)
    function separateArray(arr, size) {
        var bufferArray = [];
        for (var i = 0; i < arr.length; i += size) {
            var sliceArray = arr.slice(i, i + size);
            bufferArray.push(sliceArray);
        }
        return bufferArray;
    }


    ///approve systerm 
    function showApprovePage(request,response){
        response.render('home.ejs')
    }

>

// Read file from userpassword.json as mock up 3 users <br>
// Receive data from home.ejs as user, password and Approve status <br>
// if 3 user receive status Approve, Email wil be sent to Notify <<br>>


>
    var fs = require('fs');
    let rawdata = fs.readFileSync('userpassword.json');
    let obj= JSON.parse(rawdata);

    // check here
    async function UpdateStatus(request,response){
        var f = request.body["id"]  || ""
        var e = request.body["password"]  || ""
        var g = request.body["approvedSystem"]  || ""
        console.log(f,e,g)
 
     
        for(var i =0; i<obj.data1.length;i++){
            if(obj.data1[i].username == f && obj.data1[i].password == e){
                //console.log('ok')
                obj.data1[i].data = g
                console.log(i)
                fs.writeFileSync('userpassword.json', JSON.stringify(obj, null, 2));  
            }
            if(!(obj.data1.some(b => b.data == 'Empty'))){
            // node mailer OKAY
        let transporter = nodemailer.createTransport({
            service: 'hotmail',
            secure: false, // true for 465, false for other ports
            auth: { 
            user: 'kittipot.singh@hotmail.com', // email user
            pass: '************'// email password
            }
        });
        // start send email
        let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <kittipot.singh@hotmail.com>', // sender email
        to: 'kittipot.singh4g@gmail.com', // 
        subject: 'Hello ✔', // title
        text: 'Hello world?', // plain text body
        html: '<b>Notification</b>' // html body
        });
        console.log('Message sent: %s', info.messageId);
                obj.data1[0].data = 'Empty'
                obj.data1[1].data = 'Empty'
                obj.data1[2].data = 'Empty'
                fs.writeFileSync('userpassword.json', JSON.stringify(obj, null, 2)); 
            }       
        }
        response.render('home.ejs')
    }

>

## RESULT

### Result of finding min/max/avg value
Can see through console log or we can push,shift array through API that we can send out but for now let see trough console log  

<img src="https://user-images.githubusercontent.com/104770048/173199485-5a48260c-384a-4697-a1b9-508c10d8b692.png" alt="minmaxavg">


### Result of sending API data slice into 200

localhost:12000/data <br>
-- here is the result of data that we have slice into 200 array and sent it out throught API <br>
<img src="https://user-images.githubusercontent.com/104770048/173199583-4e6337d8-c3d3-494b-aa65-e352b09a5fe5.png" alt="resultofAPI200">


### Result of sending Email notification to Receiver 
localhost:12000/home

<ol>
    <li>  First input user and password and check at Approve or Not Approve <br>
        <img src="https://user-images.githubusercontent.com/104770048/173199655-c2fa2c33-e975-441f-9fce-7c87ca836ea5.png" alt ="">
    </li>
    <li>  If we enter with correct user and password and Approve status Email will be sent as we config as sender and reciever <br>
        <img src="https://user-images.githubusercontent.com/104770048/173199718-217105ed-1fac-42df-b345-086dde68f1fa.png" alt="statuApprove">
    </li>
    <li>  After all 3 user aprrove all status will be clear as Empty like a reset <br>
    <img = src="https://user-images.githubusercontent.com/104770048/173199799-8c8ef153-b0de-4a99-9df8-5566f8df89bf.png" alt="emailsent"><br>
    <img = src="https://user-images.githubusercontent.com/104770048/173199886-c0b8e4c6-abb3-402a-9fb5-142128a896d1.png" alt="statusReset"><br>     
    </li>   
</ol>

#### next for challenging 

<ol>
    <li> make an web - page for hr to write message and send an email for  </li>
</ol>
