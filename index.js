var express = require('express')
var low = require('lowdb')
var app = express()
var port = 4000
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('db.json') 
var session = require('express-session')
db = low(adapter)
db.defaults({ Prod: [] ,Sessions:[]}).write()
app.set('view engine', 'pug');
app.set('views', './views');
var Sessionmiddleware  = require('./middleware/middlewared')
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    cookie: { maxAge: 60000 }})
);
app.use(Sessionmiddleware);
app.get('/product', function(req, res) {
	var page = parseInt(req.query.page) || 1;
	var perpage = 8;
	var start = (page-1)*perpage;
	var begin =(page*perpage);
	var drop=(page-1)*perpage;
	res.render('producted',{
		Prod : db.get('Prod').drop(drop).take(perpage).value()
	}
)})
app.get('/add/cart/:ProductID', function(req, res) {
	var ProductID = req.params.ProductID;
	var sessionId = req.sessionID;
	db.get('Sessions').push({
		 	sessionId : sessionId
	}).write()
	// if (req.session.views) {
 //   		req.session.views++
	// 	db.get('Sessions')
	// 	.find({c : ProductID})
	// 	.set('CART',req.session.views)
	// 	.write();
 // 	}else{
 // 		req.session.views = 1
 //   		db.get('Sessions').push({
	// 	 	CART : req.session.views,
	// 	 	c : ProductID
	// 	}).write()
 // 	}
 	db.get('Sessions')
		.find({sessionId : sessionId})
		.set(ProductID,req.session.views=1)
		.write();	
 	console.log(req.session.views);
	res.redirect('/product');
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))