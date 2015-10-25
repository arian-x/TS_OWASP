$(document).ready(function () {
    var $searchBtn = $("#searchBtn") ;
    var $searchField = $("#searchField") ;
    var $searchStatus = $("#searchStatus") ;

    var $userName = $("#userName") ;
    var $password = $("#password") ;
    var $loginBtn = $("#loginBtn") ;

    $loginBtn.click(function () {
        $.post("/login" , {user : $userName.val() , pass : $password.val() } , function (data) {
            console.log(data) ;

        })  ;
    }) ;
    var renderIndexTable = function () {

    } ;


    $searchBtn.click(function () {
        var value = $searchField.val() ;
        $searchStatus.html("You Searched for : " + value ) ;
    });



}) ;