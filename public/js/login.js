$(function(){
    $('button[type=submit]').on('click',function(){
        var username=$('input[name=username]').val();
        var password=$('input[name=password]').val();
        $.ajax({
            url:'/success',
            type:'post',
            dataType:'json',
            data:{'username':username,'password':password},
            success:function(responseDate){
                console.log(responseDate)
                if(responseDate){
                    if(responseDate.code==6){
                        alert('登录成功');
                        window.location.href='/';
                    }
                    if(responseDate.code==7){
                        $('.error').text('');
                        $('.error').text('账户或密码错误');
                        $('input[name=username]').focus(function(){
                            $('.error').text('');
                        });
                    }
                }
            }
        })
    });
});

