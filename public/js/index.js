//搜索栏
$('.search').focus(function(){
	$(this).removeClass('search')
});
$('.search').blur(function(){
	$(this).addClass('search')
});

//----------------------------------------个人信息显示-------------------------------//
$('.person').mouseover(function(){
    $(this).addClass('person-bg');
    $('.mask-menu').css('display','block')


});
$('.person').mouseout(function(){
    $(this).removeClass('person-bg');
    var time=setTimeout(function(){
        $('.mask-menu').css('display','none')
    },300);
    $('.mask-menu').mouseover(function(){
        clearTimeout(time);
        $('.mask-menu').css('display','block')
    });
    $('.mask-menu').mouseout(function(){

        $('.mask-menu').css('display','none')
    })
});
//----------------------------------------个人信息显示END-------------------------------//

var mySwiper = new Swiper ('.swiper-container', {
    direction: 'horizontal',
    loop: true,

    // 如果需要分页器
    pagination: {
        el: '.swiper-pagination',
    },

    // 如果需要前进后退按钮
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // 如果需要滚动条
    scrollbar: {
        el: '.swiper-scrollbar',
    },
})