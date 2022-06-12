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



// fetch
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

//Divided Array 200 unit (test with 200 unit)
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
        auth: { // ข้อมูลการเข้าสู่ระบบ
        user: 'kittipot.singh@hotmail.com', // email user ของเรา
        pass: 'Sing0813713472'// email password
        }
    });
    // nodemailer
    let info = await transporter.sendMail({
    from: '"kittipot:)" <kittipot.singh@hotmail.com>', // sender email
    to: 'kittipot.singh4g@gmail.com,59010123@kmitl.ac.th,napat.s@swiftdynamics.co.th', //, more than 1 (Comma)
    subject: 'Notification', // titel
    text: 'Hello world?', // plain text body
    html: '<b>Notification Test</b>' // html body
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


