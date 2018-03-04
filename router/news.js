var express=require('express');
var router=express.Router();
var Connpool=require('../models/Connpool');

router.get('/',function(req,res,next){
    loginsession=req.session.loginsession;
    pool=Connpool();
    pool.getConnection(function(err,conn){
        var nid=req.query.id;
        console.log(nid)
        sql='select title,content,createtime,category from admin where nid=?';
        param=[nid];
        conn.query(sql,param,function(err,rs){
            //console.log(rs);
            res.render('news/index',{loginsession:loginsession,rs:rs[0]});
        })
    });

});



module.exports=router;