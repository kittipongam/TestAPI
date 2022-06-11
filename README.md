


-------------------



#### install node
EJS:
NODEMAILER:
EXPRESS:
NODE_FETCH:


>
    npm i express ejs nodemailer node-fetch
    npm install node-fetch@2
>



#### 
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

#### 
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



    ////////////////////////// fetch
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

    var fs = require('fs');
    let rawdata = fs.readFileSync('userpassword.json');
    let obj= JSON.parse(rawdata);
    //console.log(obj.data1.length);
    //console.log(obj.data[0]);

    // check here
    async function UpdateStatus(request,response){
        var f = request.body["id"]  || ""
        var e = request.body["password"]  || ""
        var g = request.body["approvedSystem"]  || ""
        console.log(f,e,g)
        //console.log(obj.data1.data)
        // const k = "kittipot432";
        // const p = "12365";
        //if(obj.some(x => x.username === f ) && obj.some(y => y.password === e ) ){console.log('PASS')}
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
        // เริ่มทำการส่งอีเมล
        let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <kittipot.singh@hotmail.com>', // อีเมลผู้ส่ง
        to: 'kittipot.singh4g@gmail.com', // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: 'Hello ✔', // หัวข้ออีเมล
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

#### next for challenging 

<ol>
    <li> make an webpage for hr to write message and send an email for  </li>
</ol>