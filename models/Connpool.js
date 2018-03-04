var mysql=require('mysql');
module.exports=(function(){
	var pool=mysql.createPool({
		host:'localhost',
		user:'root',
		password:'123456',
		port:'3306',
		database:'news'
	});
	 // pool.on('connection',function (connection){
    //     //connection.query('SET SESSION auto_increment_increment=1')
    // });
	return function(){
		return pool
	}

})();