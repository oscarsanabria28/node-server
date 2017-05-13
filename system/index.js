const express           = require('express');
const router            = express.Router();
const DatabaseConnector = require('../lib/DatabaseConnector');
const path              = require('path');
//module to get ip's user
const requestIp = require('request-ip');
var globalProducts="";
router.get('/', (req,res)=>{
	res.send('Response by router in node');
});

router.get('/login/:email/:pass', (req,res)=>{
	
	var conn = DatabaseConnector.getDatabaseConnection();
	console.log('email: '+req.params.email+' pass: '+req.params.pass);

	var user=req.params.email;
	var pass=req.params.pass;
	
	conn.findInCollection('user',{mail:user,pass:pass},(cursor)=>{
		
		cursor.toArray((err,doc)=>{
				
			if(doc[0] == null){
					cursor.close();
					conn.close();
					//When user is not found we send 0
					console.log("not found 0");
					res.send("0");
				
			}else{
				
				
				cursor.close();
				 /*************** InsertLog
					start of variables for insert log
				 ***************/
				var ip_req = requestIp.getClientIp(req);
				var agent_req = req.get('User-Agent'); 

				var d = new Date();
				var year= d.getFullYear();
				var month= d.getMonth()+1;
				var day= d.getDate();
				//console.log(day+"/"+month+"/"+year+" ip: "+ip_req+" agent: "+agent_req);

				/***************
					end of variables for insert log
				 ***************/
				 //insert log
				conn.insertLog('user_log_spring',{user:user, day:day, month:month, year:year , ip_req:ip_req,agent_req:agent_req,date:d,typeRequest:"Login" });


				conn.close();
				/***********************************************************/
				
				console.log("found 1");
				//When user is found we send 1
				res.send(doc[0].saldo+"");
					
			}
		});			
	});
});

router.get('/newUser/:name/:email/:pass', (req,res)=>{
	console.log("creating user");
	var conn = DatabaseConnector.getDatabaseConnection();
	var name=req.params.name;
	var mail=req.params.email;
	var pass=req.params.pass;


	conn.insertLog('user',{user:name, pass:pass, mail:mail,saldo:10000});

	/*************** InsertLog
		start of variables for insert log
	 ***************/
	var ip_req = requestIp.getClientIp(req);
	var agent_req = req.get('User-Agent'); 

	var d = new Date();
	var year= d.getFullYear();
	var month= d.getMonth()+1;
	var day= d.getDate();
	//console.log(day+"/"+month+"/"+year+" ip: "+ip_req+" agent: "+agent_req);

	/***************
		end of variables for insert log
	 ***************/
	 //insert log
	conn.insertLog('user_log_spring',{user:mail, day:day, month:month, year:year , ip_req:ip_req,agent_req:agent_req,date:d,typeRequest:"Create User" });
	conn.close();



	res.send("1");

});

router.get('/updatePass/:name/:pass', (req,res)=>{
	console.log("updating password");
	var conn = DatabaseConnector.getDatabaseConnection();
	var name=req.params.name;
	var pass=req.params.pass;

	conn.updateCollection('user',{user:name}, {$set: {pass: pass}});



	/*************** InsertLog
		start of variables for insert log
	 ***************/
	var ip_req = requestIp.getClientIp(req);
	var agent_req = req.get('User-Agent'); 

	var d = new Date();
	var year= d.getFullYear();
	var month= d.getMonth()+1;
	var day= d.getDate();
	//console.log(day+"/"+month+"/"+year+" ip: "+ip_req+" agent: "+agent_req);

	/***************
		end of variables for insert log
	 ***************/
	 //insert log
	conn.insertLog('user_log_spring',{user:user, day:day, month:month, year:year , ip_req:ip_req,agent_req:agent_req,date:d,typeRequest:"Update Password" });
	conn.close();



	res.send("1");

});

router.get('/selectProducts/:user', (req,res)=>{
	//console.log("selecting products");
	var user=req.params.user;
	var conn = DatabaseConnector.getDatabaseConnection();

	conn.findInCollection('products',{},(cursor)=>{
		
		cursor.toArray((err,doc)=>{
				
			if(doc[0] == null){
					cursor.close();
					conn.close();
					//When user is not found we send 0
					console.log("found any products");
					res.send("0");
				
			}else{
				
				
				cursor.close();
				 /*************** InsertLog
					start of variables for insert log
				 ***************/
				var ip_req = requestIp.getClientIp(req);
				var agent_req = req.get('User-Agent'); 

				var d = new Date();
				var year= d.getFullYear();
				var month= d.getMonth()+1;
				var day= d.getDate();
				//console.log(day+"/"+month+"/"+year+" ip: "+ip_req+" agent: "+agent_req);

				/***************
					end of variables for insert log
				 ***************/
				 //insert log
				 var tReq='Select Products';
				conn.insertLog('user_log_spring',{user:user, day:day, month:month, year:year , ip_req:ip_req,agent_req:agent_req,date:d,typeRequest:tReq });


				conn.close();
				var return_products="<div class='grid' >";
				/***********************************************************/
				for (var i = 0; i < doc.length; i++) {
					return_products = return_products + "<div class='element-item col-md-4  "+doc[i].id_categoria+"' data-category='"+doc[i].id_categoria+"'> "+
					"	<a href='javascript:void(0)'>" +
					"	<div class='w3-card-4 test' style='width:100%;max-width:300px;' id='"+doc[i].id_producto+"' onclick='AgregarProducto(this)' > " +
					"	  <img src='images/"+doc[i].imagen+"' alt='Avatar' style='width:100%;opacity:0.85;height:200px;'> " +
					"	  <div class='w3-container'> " +
					"	  <h4><b>"+doc[i].nombre_producto+"</b></h4>     " +
					"	  <p>$"+doc[i].costo+"</p>     " +
					"	  </div> " +
					"	</div>" + 
					"	</a> " +
					"	</div>";
						
				}
				return_products = return_products+ "</div>";
				var productsJson = JSON.stringify(doc);
				console.log("found products 2 ");
				//When user is found we send 1
				res.send(return_products);
					
				
			}
			
		});
			
		
	});

});


router.get('/confirmPurchase/:products', (req,res)=>{
	console.log("confirm Products");
	globalProducts=req.params.products;
	//var conn = DatabaseConnector.getDatabaseConnection();
	console.log("gp: "+globalProducts);
	//var split_prods = products.split("=");
	res.send("1");
	
});

router.get('/bringUserInfo/:email', (req,res)=>{
	
	var conn = DatabaseConnector.getDatabaseConnection();
	console.log('email to search: '+req.params.email);

	var user=req.params.email;
	var pass=req.params.pass;
	
	conn.findInCollection('user',{mail:user},(cursor)=>{
		
		cursor.toArray((err,doc)=>{
				
			if(doc[0] == null){
					cursor.close();
					conn.close();
					//When user is not found we send 0
					console.log("bring user info not found 0");
					res.send("0");
				
			}else{
				
				
				cursor.close();
				 /*************** InsertLog
					start of variables for insert log
				 ***************/
				var ip_req = requestIp.getClientIp(req);
				var agent_req = req.get('User-Agent'); 

				var d = new Date();
				var year= d.getFullYear();
				var month= d.getMonth()+1;
				var day= d.getDate();
				//console.log(day+"/"+month+"/"+year+" ip: "+ip_req+" agent: "+agent_req);

				/***************
					end of variables for insert log
				 ***************/
				 //insert log
				conn.insertLog('user_log_spring',{user:user, day:day, month:month, year:year , ip_req:ip_req,agent_req:agent_req,date:d,typeRequest:"Bring Info to Edit" });


				conn.close();
				/***********************************************************/
				var str=doc[0].user+"="+doc[0].pass;

				console.log("Info found: "+str);
				//When user is found we send 1
				res.send(str);
					
			}
		});			
	});
});


router.get('/editUser/:name/:email/:pass', (req,res)=>{
	
	var conn = DatabaseConnector.getDatabaseConnection();
	var name=req.params.name;
	var mail=req.params.email;
	var pass=req.params.pass;

	console.log("edit user: "+mail+" nn: "+name+" np: "+pass);

	conn.updateCollection('user',{mail:mail}, {$set: {pass: pass,user: name}});

	/*************** InsertLog
		start of variables for insert log
	 ***************/
	var ip_req = requestIp.getClientIp(req);
	var agent_req = req.get('User-Agent'); 

	var d = new Date();
	var year= d.getFullYear();
	var month= d.getMonth()+1;
	var day= d.getDate();
	//console.log(day+"/"+month+"/"+year+" ip: "+ip_req+" agent: "+agent_req);

	/***************
		end of variables for insert log
	 ***************/
	 //insert log
	conn.insertLog('user_log_spring',{user:mail, day:day, month:month, year:year , ip_req:ip_req,agent_req:agent_req,date:d,typeRequest:"Edit User" });
	conn.close();



	res.send("1");

});

router.get('/updateMoney/:email/:newBalance', (req,res)=>{
	
	var conn = DatabaseConnector.getDatabaseConnection();
	var balance=req.params.newBalance;
	var mail=req.params.email;

	console.log("new balance: "+balance);

	conn.updateCollection('user',{mail:mail}, {$set: {saldo: balance}});

	/*************** InsertLog
		start of variables for insert log
	 ***************/
	var ip_req = requestIp.getClientIp(req);
	var agent_req = req.get('User-Agent'); 

	var d = new Date();
	var year= d.getFullYear();
	var month= d.getMonth()+1;
	var day= d.getDate();
	//console.log(day+"/"+month+"/"+year+" ip: "+ip_req+" agent: "+agent_req);

	/***************
		end of variables for insert log
	 ***************/
	 //insert log
	conn.insertLog('user_log_spring',{user:mail, day:day, month:month, year:year , ip_req:ip_req,agent_req:agent_req,date:d,typeRequest:"Edit User" });
	conn.close();



	res.send("1");

});

router.get('/insertPurchase/:email/:total', (req,res)=>{
	console.log("insert purchasing");
	var conn = DatabaseConnector.getDatabaseConnection();
	var mail=req.params.email;
	var total=req.params.total;


	

	/*************** InsertLog
		start of variables for insert log
	 ***************/
	var ip_req = requestIp.getClientIp(req);
	var agent_req = req.get('User-Agent'); 

	var d = new Date();
	var year= d.getFullYear();
	var month= d.getMonth()+1;
	var day= d.getDate();
	//console.log(day+"/"+month+"/"+year+" ip: "+ip_req+" agent: "+agent_req);

	/***************
		end of variables for insert log
	 ***************/
	 //insert log
	conn.insertLog('purchase',{mail:mail, total:total,day:day, month:month, year:year, date:d});
	conn.insertLog('user_log_spring',{user:mail, day:day, month:month, year:year , ip_req:ip_req,agent_req:agent_req,date:d,typeRequest:"Insert Purchase" });
	conn.close();



	res.send("1");

});

router.get('/selectPurchaseByUser/:user', (req,res)=>{
	//console.log("selecting products");
	var user=req.params.user;
	var conn = DatabaseConnector.getDatabaseConnection();

	var ip_req = requestIp.getClientIp(req);
				var agent_req = req.get('User-Agent'); 

	var d = new Date();
	var year= d.getFullYear();
	var month= d.getMonth()+1;
	var day= d.getDate();
	//console.log(day+"/"+month+"/"+year+" ip: "+ip_req+" agent: "+agent_req);

	/***************
					end of variables for insert log
				 ***************/
				 //insert log
	 var tReq='Select Purchase By User';
	conn.insertLog('user_log_spring',{user:user, day:day, month:month, year:year , ip_req:ip_req,agent_req:agent_req,date:d,typeRequest:tReq });


	conn.findInCollection('purchase',{mail:user},(cursor)=>{
		
		cursor.toArray((err,doc)=>{
				
			if(doc[0] == null){
					cursor.close();
					conn.close();
					//When user is not found we send 0
					console.log("found any purchases");
					res.send("0");
				
			}else{
				
				
				cursor.close();
				 /*************** InsertLog
					start of variables for insert log
				 ***************/

				conn.close();
				var return_products="<div class='grid' >";
				/***********************************************************/
				for (var i = 0; i < doc.length; i++) {
					return_products = return_products + "<div class='element-item col-md-4  "+doc[i].id_categoria+"' data-category='"+doc[i].id_categoria+"'> "+
					"	<a href='javascript:void(0)'>" +
					"	<div class='w3-card-4 test' style='width:100%;max-width:300px;' id='"+doc[i].id_producto+"' onclick='AgregarProducto(this)' > " +
					"	  <img src='images/"+doc[i].imagen+"' alt='Avatar' style='width:100%;opacity:0.85;height:200px;'> " +
					"	  <div class='w3-container'> " +
					"	  <h4><b>"+doc[i].nombre_producto+"</b></h4>     " +
					"	  <p>$"+doc[i].costo+"</p>     " +
					"	  </div> " +
					"	</div>" + 
					"	</a> " +
					"	</div>";
						
				}
				return_products = return_products+ "</div>";
				var productsJson = JSON.stringify(doc);
				console.log("found products 2 ");
				//When user is found we send 1
				res.send(productsJson);
					
				
			}
			
		});
			
		
	});

});

module.exports = router;








