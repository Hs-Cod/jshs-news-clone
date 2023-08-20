//Firebase Object initialize
var config_jshsnews = {
    apiKey: "AIzaSyBFOeMptZokqs9sv6s2opCPuJAb3rLVbtI",
    authDomain: "jshs-news.firebaseapp.com",
    projectId: "jshs-news",
    storageBucket: "jshs-news.appspot.com",
    messagingSenderId: "350427065203",
    appId: "1:350427065203:web:c24368db10667532fd7306"
};
firebase.initializeApp(config_jshsnews);

//Global variables
const jnewsDB = firebase.database();
const auth = firebase.auth();
const dbRef = firebase.database().ref("USERS");
var user;

var totalNews = 0;
var totalLikes = 0;


//----------------------( AuthChanged : Login In/Out )----------------------//
// LOGIN State change listner
var GIJA = "";
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        //LOGINED
        user = firebaseUser;

        //Retrieve User data from DB
        dbRef.child("USERS_DB").child(user.uid).once('value', function (snp) {
            var dt = snp.val();

            //Check authority - news
            var tempIndex = -1;
            try{
                tempIndex = dt.auth.indexOf("news");
            }catch(e){}
            if (tempIndex > -1) {
                //Nickname, Description, etc
                $('#nick').html(dt.news.nick);
                GIJA = dt.news.nick;
                $('#desc').html(dt.news.desc);

                $('#accountImg').attr('src', user.photoURL);
                $('#news').show();

                //Retrieve temporarily saved news
                try{
                    $('#newTitle').val(dt.news.save.title);
                }catch(e){} 
                try{
                    $('#newDesc').html(dt.news.save.desc);
                }catch(e){} 
                try{
                    var filesImsi = dt.news.save.files;
                    if(filesImsi != null && filesImsi != ""){
                        $.each(filesImsi, function(key, value){
                            $('#attach').append('<img src="' + value + '">');
                        })
                        attachmentArr = filesImsi;
                    }
                }catch(e){}

                //Retrieve all news created by author
                $.each(dt.news.articles, function (key, value) {
                    firebase.database().ref("MAIN").child('NEWS').child(-key).once('value', function (snpp) {
                        var sval = snpp.val();

                        //Add to news list
                        $('#newsContainer').prepend(previewNewsHTML(sval.cover, sval.title, sval.desc, sval.views, sval.likes, sval.formated_date, snpp.key));
                        $('#noNews').hide();

                        //Total News & total likes count
                        totalNews++;
                        totalLikes += sval.likes;
                        $('#totalNews').html(totalNews);
                        $('#totalLike').html(totalLikes);
                    });
                });

            } else {
                //if no authority
                alert("미니 기자단만 접속할 수 있습니다.")
                history.go(-1);
            }
        });
    } else {
        //LOGOUT
        window.location.href = "https://jshs.munzii.com/login?fw=news-admin"
    }
});

//Logout button click handler
$("#logout").click(function () {
    localStorage.clear();
    auth.signOut();
});

//----------------------( Return HTML Item )----------------------//
//Template for Preview : on list
function previewNewsHTML(cover, title, desc, views, likes, date, id) {
    var COVERHTML = '';
    if (cover != "") {
        COVERHTML = `<img class="newsImage" src="` + cover + `">`
    }
    var HTMLRAW = `
    <div class="card news">
        <table>
            <tr>
                <td width="90">`+ COVERHTML + `</td>
                <td>    
                    <a href="javascript:openit(`+ id + `)">
                        <span class="newsHeadline">`+ title + `</span><br>
                        <span class="newsDesc">`+ desc.replace( /(<([^>]+)>)/ig, '') + `
                        </span>
                    </a>
                </td>
            </tr>
        </table>
        <table class="newsTools">
            <tr>
                <td class="newsToolsDesc">
                    조회수 <span class="viewDesc">`+ views + `</span> | 좋아요 <span class="likeDesc">` + likes + `</span> | <a href="javascript:fixit(` + id + `)">수정</a> | <a href="javascript:deleteit(` + id + `)">삭제</a>
                </td>
                <td class="dateDesc">`+ date + `</td>
            </tr>
        </table>
    </div>
    `;
    return HTMLRAW;
}

//Template for Showing whole news : when clicked
function showNewsHTML(title, desc, views, likes, date, id) {
    var HTMLRAW = `
    <div class="card news">
    <a href="javascript:closeit()"><img class="exit_btn" src="exit.png"> </a>
    <span class="newsHeadlineReal">`+ title + `</span><hr>
    <span class="newsDescReal">`+ desc + `</span><br><br>
    <table class="newsTools">
        <tr>
            <td class="newsToolsDesc">
                조회수 <span class="viewDesc">`+ views + `</span> | 좋아요 <span class="likeDesc">` + likes + `</span> | <a href="javascript:fixit(` + id + `)">수정</a> | <a href="javascript:deleteit(` + id + `)">삭제</a>
            </td>
            <td class="dateDesc">`+ date + `</td>
        </tr>
    </table>
    `;
    return HTMLRAW;
}

//----------------------( News Functions )----------------------//
//Preview list handler : Open news when click
function openit(id) {
    firebase.database().ref("MAIN").child('NEWS').child(id).once('value', function (snpp) {
        var sval = snpp.val();
        $('#articleContainer').html(showNewsHTML(sval.title, sval.desc, sval.views, sval.likes, sval.formated_date, snpp.key));
        $('#newsContainer').fadeOut();
        $('#articleContainer').fadeIn();
    });
}

//News fix handler : DEVELOPING
function fixit(id) {
    // alert(id + " 수정");
    alert('지원하지 않는 기능입니다.')
}

//News delete handler
function deleteit(id) {
    if(confirm('정말로 삭제하시겠습니까?')){
        var articleRef = firebase.database().ref("MAIN/NEWS/" + id);
        var articleUserRef = firebase.database().ref("USERS/USERS_DB/" + auth.getUid() + "/news/articles/"+ id);

        //Delete news from news list
        articleRef.remove().then(function(){
            //Delete news from user DB
            articleUserRef.remove().then(function(){
                alert('삭제되었습니다.');
                history.go(0);
            })
        })
    }

}

//News close handler
function closeit() {
    $('#articleContainer').fadeOut();
    $('#newsContainer').fadeIn();

}


//----------------------( Make new News )----------------------//

//Make news button
function makeNews() {
    $('#newArticle').fadeToggle();
}
//Add attachment to news
function addAttachment() {
    $('#addAttachInput').click();
}

//Attachemtn array containg list of links
var attachmentArr = [];
document.getElementById('addAttachInput').addEventListener('change', function (e) {
    $('html').css({ 'filter': 'blur(10px)', 'pointer-events': 'none' });

    var file = e.target.files[0];
    var dt = new Date();
    var dtid = dt.getTime().toString();

    //Get file and upload to firebas storage
    var storageRef = firebase.storage().ref("news/" + auth.getUid()).child(-dtid);
    var task = storageRef.put(file);
    task.on('state_changed',
        function progress(snapshot) { },
        function error(err) {
            //Check error when over 10MB
            alert('10MB 이하의 파일만 첨부할 수 있습니다.');
            $('html').css({ 'filter': 'blur(0px)', 'pointer-events': 'initial' });
        },
        function complete(snp) {
            storageRef.getDownloadURL().then(function (downloadURL) {
                //Get file url and add to list
                $('#attach').append('<img src="' + downloadURL + '">');
                attachmentArr.push(downloadURL);
                $('html').css({ 'filter': 'blur(0px)', 'pointer-events': 'initial' });
            });
        }
    );

});

//Remove temporarily saved article
function removeSaveArticle(){
    if(confirm('임시 저장되어 있는 기사를 삭제하시겠습니까?')){
        var saveRef = firebase.database().ref("USERS/USERS_DB/" + auth.getUid() + "/news/save");
        saveRef.remove().then(function(){
            alert('삭제되었습니다.');
            history.go(0);
        });
    }
}

//Save article temporarily
function saveArticle(noticeit) {
    var saveRef = firebase.database().ref("USERS/USERS_DB/" + auth.getUid() + "/news/save");
    saveRef.set({
        title: $('#newTitle').val().trim(),
        desc: $('#newDesc').html().trim(),
        files: attachmentArr
    }).then(function () {
        if(noticeit){
            //Push notification if needed
            alert('임시 저장되었습니다.')
        }
    })
}

//Submit news to DB
function postArticle() {
    if (confirm('기사를 등록하시겠습니까? (이전의 임시 저장된 기사는 삭제됩니다.)')) {
        
        //Remove all html elements : block XSS
        var title = $('#newTitle').val().trim().split('<').join('&lt;').split('>').join('&gt;');
        var desc = $('#newDesc').html().trim();
        
        //get rid of html elements..
        desc = desc.split('<img').join('IMSI:IMGTAG').split('><imgend></imgend>').join('IMSI:IMGCLOSETAG');
        desc = desc.split('<br>').join('IMSI:BRTAG');
        desc = desc.split('<div>').join('IMSI:DIVTAG').split('</div>').join('IMSI:DIVCLOSETAG');
        desc = desc.split('<').join('&lt;').split('>').join('&gt;');
        desc = desc.split('IMSI:IMGTAG').join('<img').split('IMSI:IMGCLOSETAG').join('>')
                .split('IMSI:DIVTAG').join('<div>').split('IMSI:DIVCLOSETAG').join('</div>')
                .split('IMSI:BRTAG').join('<br>');

        //get category
        var category = $('input[name="category"]:checked').val();


        //Check if all information isn't blank
        if(title == "" || desc == ""){
            alert('제목과 본문을 입력해 주세요.')
        }else if(category == ""){
            alert('분류를 선택해 주세요.')
        }
        else{
            //Save it temporarily in case of error
            saveArticle(false);
            
            var dt = new Date();
            var articleId = dt.getTime();
            var articleRef = firebase.database().ref("MAIN/NEWS/" + articleId);
            var articleUserRef = firebase.database().ref("USERS/USERS_DB/" + auth.getUid() + "/news/articles/"+ articleId);
            
            //Set cover img to first attachment : if none -> basic cover
            var coverImg = attachmentArr[0];
            if(coverImg == "" || coverImg == null){
                coverImg = "https://jshs.munzii.com/news/cover.png"; 
            }
            
            //Save article to news list
            articleRef.set({
                author : GIJA,
                cover : coverImg,
                date : articleId,
                formated_date : formatDate(articleId,'/'),
                title : title,
                desc : desc,
                subject : category,
                uid : auth.getUid(),
                files : attachmentArr
            }).then(function(){
                //Save article to user DB
                articleUserRef.set(title).then(function(){
                    //Remove temporarily saved news after upload success
                    var saveRef = firebase.database().ref("USERS/USERS_DB/" + auth.getUid() + "/news/save");
                    saveRef.remove().then(function(){
                        alert('완료 되었습니다.');
                        history.go(0);
                    });
                });
            })

        }
    }
}

//Check for markup on #newDesc area
$("#newDesc").on("propertychange change keyup paste input", function () {
    var currentVal = $(this).html();
    var changed = false;
    if (currentVal.indexOf('{') != -1) {
        for (var i = 0; i < attachmentArr.length; i++) {
            //Add img to #newDesc area when image markup found
            if (currentVal.indexOf('{사진' + (i + 1) + '}') != -1) {
                changed = true;
                currentVal = currentVal.split('{사진' + (i + 1) + '}').join('<br><img src="' + attachmentArr[i] + '"><imgend></imgend><br>');
            }
        }
        if (changed) {
            //Change content to processed html
            $(this).html(currentVal)
        }
    }
});

$("#newDesc").on("paste", function(e){
    //Paste plain text
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand("insertHTML", false, text);
});

//Return formatted date : ex) when formatter = "-" -> returns 2021-01-01
function formatDate(time, formatter){
    var dt = new Date();
    dt.setTime(time);
    var yyyy = dt.getFullYear();
    var mm = dt.getMonth()+1;
    mm = (mm<10)? '0'+mm.toString() : mm.toString();
    var dd = dt.getDate();
    dd = (dd<10)? '0'+dd.toString() : dd.toString();
    return (yyyy + formatter + mm + formatter + dd);
}