function checksession(req,res){
    if(loginsession==undefined){
        res.send("<script>alert('登录过期请重新登录');window.location.href='/login'</script>");
        return;
    }
}


module.exports=checksession;