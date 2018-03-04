var express=require('express');
var router=express.Router();
var Connpool=require('../models/Connpool');
var Loginsession=require('../models/session');
var multiparty = require('multiparty');
var checksession=require('../models/checksession');
var SMSClient = require('@alicloud/sms-sdk');
var mysql=require('mysql');
var fs = require('fs');
var responseDate;
router.use(function(req,res,next){
    responseDate={
        code:0,
        message:'',
    }
    next();
});
var count=0
router.get('/',function(req,res,next){
    count++;
    loginsession=req.session.loginsession;
    pool=Connpool();
    pool.getConnection(function(err,conn){
        var page=Number(req.query.page || 1);
        conn.query('select count(*) as count from admin',[],function(err,count){
            var count=count[0].count;
            countpage=Math.ceil((count/4));
            page=Math.min(page,countpage);
            page=Math.max(page,1);
            limit=4*page;

            conn.query('select nid,title,titlepic,createtime,category from admin order by nid limit 0,?',[limit],function(err,rs){
                res.render('main/index',{loginsession:loginsession,rs:rs,page:page});
            });
        })


    });

console.log(count);

});



//登录
router.get('/login',function(req,res,next){
	res.render('main/login');
});

router.post('/success',function(req,res,next){
    var password=req.body['password'];
    var username=req.body['username'];
    pool=Connpool();
    pool.getConnection(function(err,conn){
        querySql='select username,password,id,status,role from user where username=? and password=?';
        param=[username,password];
        conn.query(querySql,param,function(err,rs){
            if(err){
                res.send('error:'+err);
                return
            }
            if(rs.length>0){
                responseDate.code=6;
                responseDate.message='登录成功';
                loginsession=new Loginsession();
                loginsession.username=rs[0].username;
                loginsession.id=rs[0].id;
                loginsession.status=rs[0].status;
                loginsession.role=rs[0].role;
                req.session.loginsession=loginsession;
                responseDate.loginsession=loginsession;
                //console.log(loginsession)
                res.json(responseDate);
            }else{
                responseDate.code=7;
                responseDate.message='账号或密码错误'
                res.json(responseDate);
            }
        });
        conn.release();
    });

});

// 注册
router.get('/reg',function(req,res,next){
	res.render('main/register');
});

//短信验证
router.post('/codemsg',function(req,res,next){
    var username=req.body['username'];
    var accessKeyId = 'LTAIlDZtxjBTWbGH';
    var secretAccessKey = 'XSOIAfNwYiDXUGg6cfqhYjzwwwD7yk';
    var codenum="";
    for(var i=0;i<4;i++){
        codenum+=Math.floor(Math.random()*10);
    }
    req.session.codenum=codenum;
    console.log('存：'+JSON.stringify(req.session));
    next();  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1当取不到session时试试调用next()
//初始化sms_client
    var smsClient = new SMSClient({accessKeyId, secretAccessKey});
//发送短信
    smsClient.sendSMS({
        PhoneNumbers: username,
        SignName: '伯乐新闻网',
        TemplateCode: 'SMS_126265235',
        TemplateParam: '{"code":'+ codenum + '}'
    }).then(function (res) {
        let {Code}=res
        if (Code === 'OK') {
            //处理返回参数
            console.log(res);
        }
    }, function (err) {
        console.log(err);
    })
    res.end();
});

// 注册
router.post('/register',function(req,res,next){
    var username=req.body['username'];
    var password=req.body['password'];
    var repassword=req.body['repassword'];
    var num=req.body['codenum'];
    console.log('取：'+JSON.stringify(req.session.codenum));
    if(req.session.codenum=='undefined'){
        responseDate.code=7;
        responseDate.message='验证码错误';
        res.json(responseDate);
        return;
    }

    if(username==''){
        responseDate.code=1;
        responseDate.message='用户名不能为空';
        res.json(responseDate);
        return;
    }
    if(num==''){
        responseDate.code=6;
        responseDate.message='验证码不能为空';
        res.json(responseDate);
        return;
    }

    if(password == ''){
        responseDate.code=3;
        responseDate.message='密码不能为空';
        res.json(responseDate);
        return;
    }
    if(password!== repassword){
        responseDate.code=4;
        responseDate.message='两次输入密码不一致';
        res.json(responseDate);
        return;
    }

    sql='select username from user where username = ?';
    param=[username];
    pool=Connpool();
    pool.getConnection(function(err,conn){
        conn.query(sql,param,function(err,rs){
            //console.log(rs)
            if(rs.length>0){
                responseDate.code=2;
                responseDate.message='用户名重复';
                res.json(responseDate);
                return
            }
            if(num!=req.session.codenum){
                responseDate.code=7;
                responseDate.message='验证码错误';
                res.json(responseDate);
                return
            }
                addSql='insert into user (username,password,createtime) values(?,?,current_timestamp)';
                param=[username,password];
                // 连接数据库;
                pool=Connpool();
                pool.getConnection(function(err,conn){
                        conn.query(addSql,param,function(err,rs){
                            if(err){
                                res.send('error'+ err);
                            }else{
                                responseDate.message='注册成功';
                                res.json(responseDate);
                            }
                        });
                    conn.release();
                });

        });
        conn.release();
    });



});

// logout注销

router.get('/logout',function(req,res,next){
    req.session.destroy(function(err){
        res.redirect('/')
    });
});




module.exports=router;