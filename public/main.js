$(document).ready(function () {

    var url  ="/" ;
    var id = "" ; 

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

    var $link = $("#link") ; 

    var $comments = $("#comments") ;
    var $addComment = $("#addComment") ; 
    var $commentBody = $("#commentBody") ; 

    var $userName = $("#username") ;
    var $password = $("#password") ;
    var $loginBtn = $("#loginBtn") ;

    var $tsAlert = $("#tsAlert") ;

    $loginBtn.click(function () {
        $.post(url + "login" , { user : $userName.val() , pass : $password.val() } , function (data) {
            console.log(data) ;
            id = data.sessionId ; 
            $link.html("show user info : " + url + "user?id=" + id )
            $link.removeClass('hide') ; 
        }) ;
    }) ;

    var renderComments = function () {
        $.get(url + "comment" , function (data) {
            console.log(data) ;
            $comments.empty() ; 
            for ( var i = 0 ; i < data.length ; i++ ) {
                $comments.append("<tr><td>" + data[i].body + "</td></tr>") ; 
            } 
        })
    } ;

    $link.click(function(){
        $.get(url + "user?id=" + id , function (data) {
            console.log(data) ; 
            $("#info").html(JSON.stringify(data)) ; 
        })
    })
   
    $addComment.click(function () {
        $.post(url + "comment" , { comment : $commentBody.val() } , function (data) {
            console.log(data) ;
            renderComments();
        })
    })

    renderComments() ;

    $searchBtn.click(function () {
        var value = $searchField.val() ;
        $searchStatus.html("You Searched for : " + value ) ;
    }) ;




}) ;