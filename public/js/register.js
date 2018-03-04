$('.btn-block').on('click',function(e){
    e.preventDefault();
    var username=$('input[name=username]').val();
    var password=$('input[name=password]').val();
    var repassword=$('input[name=repassword]').val();
    var codenum=$('input[name=codenum]').val();
    $.ajax({
        url:'/register',
        type:'post',
        dataType:'json',
        data:{'username':username,'password':password,'repassword':repassword,'codenum':codenum},
        success:function(responseDate){
            //var responseDate=JSON.stringify(responseDate);
            $('.user-error').text('');
            if(responseDate.code==1){
                $('.user-error').text(responseDate.message);
            }
            if(responseDate.code==2){
                $('.user-error').text(responseDate.message);
            }
            if(responseDate.code==3){
                $('.pwd-error').text(responseDate.message);
            }
            if(responseDate.code==6){
                $('.codenum-error').text(responseDate.message);
            }
            if(responseDate.code==7){
                $('.codenum-error').text(responseDate.message);
            }
            if(responseDate.code==4){
                $('.repwd-error').text(responseDate.message);
            }
            if(responseDate.code==0){
                alert('注册成功');
                window.location.href='/'
            }
            $('input[name=username]').blur(function(){
                $('.user-error').text('');
            });
            $('input[name=repassword]').blur(function(){
                $('.repwd-error').text('');
            });

        }

    });
});


$('.codemsg').on('click',function(e){
    e.preventDefault();

    var username=$('input[name=username]').val();
    var reg = /^1[34578][0-9]{9}$/;
    var flag = reg.test(username); //true
    if(!flag){
        alert('请填写正确手机号');
        return;
    }
    if(username==''){
        alert('请填写手机号');
        return;
    }
    $.ajax({
        url:'/codemsg',
        type:'post',
        dataType:'json',
        data:{'username':username},
        success:function(msg){
            console.log(msg);
        }
    });
    $('.codemsg').removeClass('btn-success');
    $('.codemsg').addClass('disabled');
    $('.codemsg').css('border','1px solid grey')
    var time=5;
    var timer=setInterval(function(){
            time--;
        $('.codemsg').text(+ time +'秒后点击获取验证码');
        $('.codemsg').css('width',+ 35 +'%');
        $('.codemsg').css('fontSize',+ 10 +'px');
            if(time==0){
                clearInterval(timer);
                $('.codemsg').removeClass('disabled');
                $('.codemsg').addClass('btn-success');
                $('.codemsg').css('width',+ 25 +'%');
                $('.codemsg').text('点击获取验证码');
            }
    },1000);


});