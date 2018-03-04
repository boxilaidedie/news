var express=require('express');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
var swig = require('swig');
var session = require('express-session');
var cookieParser=require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser({uploadDir:'./temp'}));

app.engine('html',swig.renderFile);//模板引擎swig
app.set('views','./views');

app.set('view engine','html');
swig.setDefaults({cache:false});

app.use(express.static(path.join(__dirname,'public')));

app.use(cookieParser('recommand 128 bytes random string'));
app.use(session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 20 * 60 * 1000 }, //cookie生存周期20*60秒
    resave: true,  //cookie之间的请求规则,假设每次登陆，就算会话存在也重新保存一次
    saveUninitialized: true //强制保存未初始化的会话到存储器
}));


app.use('/',require('./router/main'));
app.use('/news',require('./router/news'));
app.use('/admin',require('./router/admin'));

app.listen(8000,'addr:localhost,port:8000');

