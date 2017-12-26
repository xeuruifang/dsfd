var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
 //创建连接池  createConnection 只能连接一次
var db = mysql.createPool({
	host:'localhost',
	port:'3306',
	user:'root',
	password:'yu62417..',
	database:'mov'
})
app.set('view engine','ejs') //设置模板引擎为ejs
app.use('/',express.static('public'))
app.get('/',(req,res) => {
	db.query('SELECT * FROM `movie_table` ',function(err,data){
		if(err){
			console.log(err)
		}else{
			console.log(data)
			res.render('index',{
				title:'最新电影推荐',
				movies:data
			})
		}
	})
})

app.get('/detail/:id',function(req,res){
	let id=req.params.id;
	db.query(`SELECT * FROM movie_table WHERE _id=${id}`,function(err,data){
		if(err){
			console.log(err)
		}else{
			res.render('detail',{
		    title:`机械战警详情页:${data[0].title}`,
		    movie:data[0]
	})
		}
	})
	
})
app.get('/admin/list',(req,res) =>{
	res.render("list",{
		title:'后台列表管理页面',
		movies:[{
			_id:1,
			title:'机械战警1',
			director:'何塞帕迪利亚',
			year:'2014',
			country:'美国',
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',			
		},{
			_id:2,
			title:'机械战警2',
			director:'何塞帕迪利亚',
			year:'2014',
			country:'美国',
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',			
		},{
			_id:3,
			title:'机械战警3',
			director:'何塞帕迪利亚',
			year:'2014',
			country:'美国',
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',			
		}]				
	})
})
app.get('/admin/movie',(req,res) =>{
	res.render("movie",{
		title:'添加新电影表单'
	})
})
app.post('/admin/add',(req,res) =>{
	let [_title,_director,_country,_year,_poster,_language,_flash,_summary]= [req.body.title,req.body.director,req.body.country,req.body.year,req.body.poster,req.body.language,req.body.flash,req.body.summary];
	db.query(`INSERT INTO movie_table (title,director,country,year,poster,language,flash,sumary) VALUES ('${_title}','${_director}','${_country}','${_year}','${_poster}','${_language}','${_flash}','${_summary}')`,function(err,data){
		if(err){
			console.log(err)
		}else{
			console.log("添加成功",data)
			res.json({
				status:200,
				msg:'添加成功',
				url:'/admin/list'
			})
		}
	})
})
app.listen(3000)
