var express=require('express');
var router=express.Router();
var multiparty = require('multiparty');
var fs = require('fs');
var Connpool=require('../models/Connpool');
var checksession=require('../models/checksession')
router.get('/',function(req,res,next){
    loginsession=req.session.loginsession;

    if(loginsession==undefined){
        res.send("<script>alert('登录过期请重新登录');window.location.href='/login'</script>");
        return;
    }
    res.render('admin/index');
});

router.get('/edit',function(req,res,next){
    loginsession=req.session.loginsession;
    if(loginsession==undefined){
        res.send("<script>alert('登录过期请重新登录');window.location.href='/login'</script>");
        return;
    }
    res.render('admin/edit')
});

router.post('/edit',function(req,res,next){
    loginsession=req.session.loginsession;
    var form = new multiparty.Form();
    form.uploadDir = "./tmp/";
    form.maxFilesSize = 2 * 1024 * 1024;
    form.parse(req,function(err,fields,files){
        uploadurl='/admin/img/uploadImg/';
        //console.log(files);
        originalFilename = files.files[0].originalFilename;
        tmpPath = files.files[0].path;
        var timestamp=new Date().getTime();
        uploadurl += timestamp+originalFilename;
        newPath= './public'+ uploadurl;
        var fileReadStream = fs.createReadStream(tmpPath);    //创建读流
        var fileWriteStream = fs.createWriteStream(newPath); //创建写流
        fileReadStream.pipe(fileWriteStream); //管道流，边读边写
        fileWriteStream.on('close',function(){
            fs.unlinkSync(tmpPath);    //删除临时文件夹中的图片
        });
        //---------------------------------field-------------------------------------
        //console.log(fields);
        var title=fields.title[0];
        var category=fields.category[0];
        var content=fields.content[0];
        var pool=Connpool();
        var inPath='img/uploadImg/'+ timestamp+originalFilename;
        pool.getConnection(function(err,conn){
            sql='insert into admin (username,title,content,titlepic,checknum,commentnum,category,createtime) values(?,?,?,?,?,?,?,current_timestamp)';
            param=[loginsession.username,title,content,inPath,null,null,category];
            conn.query(sql,param,function(err,rs){
                if(err){
                    console.log('err'+err);
                    return
                }
                res.redirect('/admin');
            });
            conn.release();
        })

    })
});


router.post('/uploadImage', function (req, res) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: 'public/img/upload/'});
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('parse error: ' + err);
        } else {
            //注意imageData仍为文件数组类型
            var imageFile = (files.imageData)[0];
            var uploadedPath = imageFile.path;
            //图片名称为上传时间+图片本名
            var timestamp=new Date().getTime();
            var imageName = timestamp + imageFile.originalFilename;
            var dstPath = 'public/img/upload/' + imageName;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    var result = {};
                    result.status = "success";
                    result.imageUrl = "/img/upload/" + imageName;
                    res.json(result);
                    res.end();
                }
            });
        }
    });
});


router.get('/preview',function(req,res,next){
    longsession=req.session.loginsession;
    if(loginsession==undefined){
        res.send("<script>alert('登录过期请重新登录');window.location.href='/login'</script>");
        return;
    }

   pool=Connpool();
   pool.getConnection(function(err,conn){

       conn.query('select count(*) as count from admin',[],function(err,count){

                var count=count[0].count;
                var page=Number(req.query.page || 1);
                var limit=5;
                var countpage=Math.ceil(count/limit); //总页数;
                page=Math.min(page,countpage); //当page大于countpage时选取countpage传入max中
                page=Math.max(page,1);    //过滤page
                var skip=(page-1)*limit;
                //console.log(skip);
               finds='select title,username,titlepic,createtime,category from admin order by nid desc limit ?,?';
               param=[skip,limit];
               conn.query(finds,param,function(err,rs){
                   //console.log(rs);
                   if(err){
                       console.log('error:'+err);
                   }
                //console.log('page:'+page)

                   res.render('admin/preview',{rs:rs,page:page,count:count,countpage:countpage});
               })


       });

       conn.release();
   })

});


router.get('/delete',function(req,res,next){
    //删除操作
});
router.get('/data',function(req,res,next){
    loginsession=req.session.loginsession;
    if(loginsession==undefined){
        res.send("<script>alert('登录过期请重新登录');window.location.href='/login'</script>");
        return;
    }
    pool=Connpool();
    pool.getConnection(function(err,conn){
        sql='select count(*) count from admin where month(createtime) = month(curdate()) and week(createtime) = week(curdate()) and date_format(createtime, \'%w\')=? and username=?'
        arr=[];
        var weeks=[1,2,3,4,5,6,7];
        if(weeks[0]==1){
            param=[weeks[0],loginsession.username];
            conn.query(sql,param,function(err,count){
                arr.push(count[0].count);
            });
        }
        if(weeks[1]==2){
            param=[weeks[1],loginsession.username];
            conn.query(sql,param,function(err,count){
                arr.push(count[0].count);
            });
        }
        if(weeks[2]==3){
            param=[weeks[2],loginsession.username];
            conn.query(sql,param,function(err,count){
                arr.push(count[0].count);
            });
        }
        if(weeks[3]==4){
            param=[weeks[3],loginsession.username];
            conn.query(sql,param,function(err,count){
                arr.push(count[0].count);
            });
        }
        if(weeks[4]==5){
            param=[weeks[4],loginsession.username];
            conn.query(sql,param,function(err,count){
                arr.push(count[0].count);
            });
        }
        if(weeks[5]==6){
            param=[weeks[5],loginsession.username];
            conn.query(sql,param,function(err,count){
                arr.push(count[0].count);
            });
        }
        if(weeks[6]==7){
            param=[weeks[6],loginsession.username];
            conn.query(sql,param,function(err,count){
                arr.push(count[0].count);
                res.render('admin/data',{arr:arr})
            });
        }

    });

});


module.exports=router;
