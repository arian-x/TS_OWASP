$(document).ready(function () {

    var url  ="/" ;
    var id = "" ;
    var user = "arian" ;
    var csrf = null ; 

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

    var $mail = $("#email") ;
    var $safeMail = $("#safeEmail") ;

    var $tsAlert = $("#tsAlert") ;

    var getCSRF = function () {
        $.get("/getCSRFToken"  ,function (data) {
            csrf = data.csrf ; 
            $("#csrf").val(csrf);
        })
    }

    getCSRF();

    $loginBtn.click(function () {
        $.post(url + "login" , { user : $userName.val() , pass : $password.val() }).done(function (data, status) {
            id = data.sessionId ;
            $link.html("show user info : " + url + "user?id=" + id ) ;
            $link.removeClass('hide') ;
        });
    }) ;

    var renderComments = function () {
        $.get("/comment" , function (data) {
            $comments.empty() ; 
            for ( var i = 0 ; i < data.length ; i++ ) {
                $comments.append("<tr><td>" + data[i].body + "</td></tr>") ; 
            } 
        })
    } ;

    $link.click(function() {
        $.get(url + "user?id=" + id , function (data) {
            console.log(data) ; 
            $("#info").html(JSON.stringify(data)) ; 
        })
    }) ;

    $addComment.click(function () {
        $.post(url + "comment" , { comment : $commentBody.val() , csrf : csrf } , function (data , status , x ) {
            if ( url.length > 1  ) {
                if ( data.status ) {

                }
                else {
                    $tsAlert.addClass('show').html('Attack Detected ! ') ;
                    setTimeout(function () {
                        $tsAlert.removeClass('show')
                    } , 3000 ) ;
                }
            }
            renderComments();
        })
    }) ;

    $("#unsafeAddComment").click(function () {
        $tsAlert.addClass('show').html('CSRF Not Recognized') ;
        setTimeout(function () {
            $tsAlert.removeClass('show')
        } , 3000 ) ;
    })

    $mail.click(function () {
        $.get('/getEmail?user=' + user  , function (data) {
            $("#mailInfo").html(JSON.stringify(data)) ;
        })
    }) ;

    $safeMail.click(function () {
        $.get("/safe/getEmail?user=" + user , function (data) {
            $("#mailInfo").html(JSON.stringify(data)) ;
        })
    }) ;

    renderComments() ;

    $searchBtn.click(function () {
        var value = $searchField.val() ;
        $searchStatus.html("You Searched for : " + value ) ;
    }) ;




}) ;