const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const sessions=require('express-session');
const request = require('request');
const app=express();
var btoa = require('btoa');
var session;
var respdata;
//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//set session config
app.use(sessions({
	secret:'sunnydodhiya',
	resave:false,
	saveUninitialized: true
}));
//set static path
app.use(express.static(path.join(__dirname,'public')));

//set your view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.get('/',function(resquest,response){

	response.render("index",{invalid:false});
});


app.get('/fail',function(req,res){
	res.render("index",{invalid:true});
})

//make user loggin
app.get('/dashboard',function(req,res){
	console.log("das");
	var temp={};
	console.log(typeof session);
	if( typeof session !='undefined' && session.active){
		getAllData(res);
		
		


	}else{
		res.render("index",{invalid:false});
	}

	
})

//call for login
app.post('/login',function(req,res){
	//console.log(req);
	var username=req.body.username;
	var password=req.body.password;


	if(username.length ==0 || password.length==0){
		res.redirect('/fail');
	}else{
		console.log(btoa(username+":"+password),username,password);
		//res.send(btoa(username+":"+password));
		session=req.session;
		checkUser(username,password,res);
	}	
});

//get all mapping
app.get('/api/allmapping',function(req,response){

	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings';
	request.get({
		url:url,
		method:'GET',
		headers:{
			'Content-Type': 'application/json',
      		"Authorization": "Basic " +session.btoa
		}
	}, (error,res)=>{
		if(error){
			response.send("Server down");
			console.log(error);
		}else{
			if(res.body && res.body=="Unauthorized"){
				response.redirect('/fail');
			}else{
				respdata=[];
				var body=JSON.parse(res.body);
				for(var number in body ){
					var data=body[number]
					var nos=parseInt(number)+1;
					var temp={
						no:nos,
						id:data.id,
						jabberAddress:data.jabberAddress,
						externalAddress:data.externalAddress
					}
					respdata.push(temp);
				}
			
				response.json({mapping:respdata});	
			}
			
		}
	});


})




function getAllData(response){
	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings';
	request.get({
		url:url,
		method:'GET',
		headers:{
			'Content-Type': 'application/json',
      		"Authorization": "Basic " +session.btoa
		}
	}, (error,res)=>{
		if(error){
			response.send("Server down");
			console.log(error);
		}else{
			if(res.body && res.body=="Unauthorized"){
				response.redirect('/fail');
			}else{
				respdata=[];
				var body=JSON.parse(res.body);
				for(var number in body ){
					var data=body[number]
					var nos=(parseInt(number)+1);
					var temp={
						no:nos,
						id:data.id,
						jabberAddress:data.jabberAddress,
						externalAddress:data.externalAddress
					}
					respdata.push(temp);
				}
				
				response.render('dashboard',{mapping:respdata});	
			}
			
		}
	});	
}


function checkUser(username,password,response){
	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings';
	request.get({
		url:url,
		method:'GET',
		headers:{
			'Content-Type': 'application/json',
      		"Authorization": "Basic " +btoa(username+":"+password)
		}
	}, (error,res)=>{
		if(error){
			response.send("Server down");
			console.log(error);
		}else{
			if(res.body && res.body=="Unauthorized"){
				response.redirect('/fail');
			}else{
				respdata=[];
				var body=JSON.parse(res.body);
				for(var number in body ){
					var data=body[number]
					var nos=(parseInt(number)+1);
					console.log(nos,number, typeof number);
					var temp={
						no:nos,
						id:data.id,
						jabberAddress:data.jabberAddress,
						externalAddress:data.externalAddress
					}
					respdata.push(temp);
				}
				session.username=username;
				session.active=true;
				session.user=btoa(username+":"+password);
				session.btoa=btoa(username+":"+password);
				console.log("this is btoa-->",session.btoa);
				console.log("<----------------------->",respdata);
				response.redirect('/dashboard');	
			}
			
		}
	});	
}




//create mapping
app.post('/mapping/add',(req,response)=>{
	console.log("I am in mapping");
	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings';
	var data={
			  "jabberAddress": req.body.jabberAddress,
			  "domain": "mydomain.com",
			  "externalAddress": req.body.externalAddress
			}

	if(!checkSession(req)){
		response.redirect('/fail');
	}else{

		request.post({
			url:url,
			body:data,
			headers:{
			'Content-Type': 'application/json',
      		"Authorization": "Basic " +session.btoa
			},
			method:"POST",
			json:true

		},(error,res)=>{
			if(error){
				response.send("server down");
				console.log(error);
			}else{
				var temp=res.body;
				console.log(res.body);
				if(res.statusCode == 200){
					response.json(temp);	
				}else{
					response.json({error:res.body})
				}
				
			}
		});

	}

});


//delete mapping
app.post('/mapping/delete',(req,response)=>{
	console.log("I am in mapping");
	var data=req.body.id;
	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings/'+data;
	
	if(!checkSession(req)){
		response.redirect('/fail');
	}else{
		console.log(url)
		request.delete({
			url:url,
			headers:{
			'Content-Type': 'application/json',
      		"Authorization": "Basic " +session.btoa
			},
			method:"DELETE"

		},(error,res)=>{
			if(error){
				res.send("server down");
				console.log(error);
			}else{
				var temp=res.body;
				console.log(res);
				response.json(temp);
			}
		});

	}

});


//edit mapping
app.post('/mapping/edit',(req,response)=>{

	var url = 'https://cloud.restcomm.com/xmpp/xmppMappings/'+req.body.id;
	
	var data={
			  "jabberAddress": req.body.jabberAddress,
			  "domain": "mydomain.com",
			  "externalAddress": req.body.externalAddress
			}

	if(!checkSession(req)){
		response.redirect('/fail');
	}else{

		request.put({
			url:url,
			body:data,
			headers:{
			'Content-Type': 'application/json',
      		"Authorization": "Basic " +session.btoa
			},
			method:"put",
			json:true

		},(error,res)=>{
			if(error){
				response.send("server down");
				console.log(error);
			}else{
				var temp=res.body;
				console.log(res.body);
				if(res.statusCode == 200){
					response.json(temp);	
				}else{
					response.json({error:res.body})
				}
				
			}
		});

	}

});


function checkSession(request){
	if(typeof session !='undefined' && session.active){
		return true;
	}else{
		return false;
	}
}


app.post('/*',function(req,res){
	res.redirect('/');
})

app.get('/*',function(req,res){
	res.redirect('/');
})

app.listen(2000,function(){
	console.log("server started at 3000");
})

