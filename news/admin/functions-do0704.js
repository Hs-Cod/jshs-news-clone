// Your web app's Firebase configuration
var config_jshsnews = {
    apiKey: "AIzaSyBFOeMptZokqs9sv6s2opCPuJAb3rLVbtI",
    authDomain: "jshs-news.firebaseapp.com",
    projectId: "jshs-news",
    storageBucket: "jshs-news.appspot.com",
    messagingSenderId: "350427065203",
    appId: "1:350427065203:web:c24368db10667532fd7306"
};
// Initialize Firebase
firebase.initializeApp(config_jshsnews);
const jnewsDB = firebase.database();


const auth = firebase.auth();
const dbRef = firebase.database().ref("USERS");
var user;

//----------------------( LOGIN )----------------------//

//----------------------( AuthChanged )----------------------//
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        //LOGINED
        user = firebaseUser;

        dbRef.child("USERS_DB").child(user.uid).once('value', function (snp) {
            var dt = snp.val();

            if (dt.auth.indexOf("news") > -1) {
                $('#nick').html(dt.news.nick);
                $('#desc').html(dt.news.desc);
                $('#totalNews').html(dt.news.total);
                $('#totalLike').html(dt.news.likes);


                $('#accountImg').attr('src', user.photoURL);
                $('#news').show();
                $.each(dt.news.articles, function (key, value) {
                    firebase.database().ref("MAIN").child('NEWS').child(key).once('value', function (snpp) {
                        var sval = snpp.val();
                        $('#newsContainer').append(previewNewsHTML(sval.cover, sval.title, sval.desc, sval.views, sval.likes, sval.date, snpp.key));
                    });
                })
            } else {
                alert("미니 기자단만 접속할 수 있습니다.")
                history.go(-1);
            }
        });
    } else {
        //NOT LOGINED
        window.location.href = "https://jshs.munzii.com/login?fw=news"
    }
});

//----------------------( Logout )----------------------//

$("#logout").click(function () {
    localStorage.clear();
    auth.signOut();
});

function previewNewsHTML(cover, title, desc, views, likes, date, id) {
    var COVERHTML = '';
    if (cover != "") {
        COVERHTML = `<img class="newsImage" src="` + cover + `">`
    }
    var HTMLRAW = `
    <div class="card news">
        <table>
            <tr>
                <td>`+ COVERHTML + `</td>
                <td>    
                    <a href="javascript:openit(`+ id + `)">
                        <span class="newsHeadline">`+ title + `</span><br>
                        <span class="newsDesc">`+ desc + `
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

function showNewsHTML(title, desc, views, likes, date, id) {
    var HTMLRAW = `
    <div class="card news">
    <a href="javascript:closeit()"><img src="exit_colored.png" height="40"> </a>
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

function openit(id) {
    firebase.database().ref("MAIN").child('NEWS').child(id).once('value', function (snpp) {
        var sval = snpp.val();
        $('#articleContainer').html(showNewsHTML(sval.title, sval.desc, sval.views, sval.likes, sval.date, snpp.key));
        $('#newsContainer').fadeOut();
        $('#articleContainer').fadeIn();
    });
}
function fixit(id) {
    alert(id + " 수정");
}
function deleteit(id){
    alert(id + " 삭제");
}
function closeit(){
    $('#articleContainer').fadeOut();
    $('#newsContainer').fadeIn();

}