$(document).ready(function () {

    var url  ="/" ;

    var $isSafe = $("#isSafe") ;

    $isSafe.change(function () {
        if ( $(this).is(":checked") ) {
            url = "/safe/" ;
        }
        else {
            url = "/" ;
        }
    });

    var $searchBtn = $("#searchBtn") ;
    var $searchField = $("#searchField") ;
    var $searchStatus = $("#searchStatus") ;

    var $comments = $("#comments") ;
    var $userName = $("#username") ;
    var $password = $("#password") ;
    var $loginBtn = $("#loginBtn") ;

    var $tsAlert = $("#tsAlert") ;

    $loginBtn.click(function () {
        $.post(url + "login" , { user : $userName.val() , pass : $password.val() } , function (data) {
            console.log(data) ;
        }) ;
    }) ;

    var renderComments = function () {

    } ;


    $searchBtn.click(function () {
        var value = $searchField.val() ;
        $searchStatus.html("You Searched for : " + value ) ;
    }) ;




}) ;