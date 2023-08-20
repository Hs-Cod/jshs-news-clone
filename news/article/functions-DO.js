//////////////////////페이지 로딩 후 초기화 작업///////////////////////
var config_jshsnews = {
    apiKey: "AIzaSyBFOeMptZokqs9sv6s2opCPuJAb3rLVbtI",
    authDomain: "jshs-news.firebaseapp.com",
    projectId: "jshs-news",
    storageBucket: "jshs-news.appspot.com",
    messagingSenderId: "350427065203",
    appId: "1:350427065203:web:c24368db10667532fd7306"
};

var jnews = firebase.initializeApp(config_jshsnews, "jshs-news");
var jnewsDB = jnews.database();
const jshsDoc = jnews.firestore();
const jshsRef = jnewsDB.ref('MAIN');

//------------------------( Date Preset )------------------------//

// parsedDate="2018.08.29"
// parsedDate2="2018-08-29"
// rawDate="20180829"
// day="4"

var today = new Date();
var month = today.getMonth() + 1;
var year = today.getFullYear();
var day = today.getDay();
var date = today.getDate();
if (month < 10) {
    month = "0" + month;
}
if (date < 10) {
    date = "0" + date;
}
var parsedDate = year + "." + month + "." + date;
var parsedDate2 = year + "-" + month + "-" + date;
var rawDate = year + "" + month + "" + date;

var subject = ['전곽일보', '학교생활/학생회', '과학/기술', 'IT/게임', '디자인/뷰티', '자연/동물', '정치/경제/법률', '연예/엔터', '스포츠/건강', '기타']

$(window).ready(() => {
    initializePage();
    updateNews();

    if (mode_DEVELOP) {
        console.log('Develop MODE');
    } else {
        //전체 조회수
        var historyDoc = jshsDoc.doc('jshs/NEWS');
        var historyTodayDoc = jshsDoc.doc('jshs/NEWS/today/' + parsedDate2);

        historyDoc.get().then((doc) => {
            var data = doc.data();
            if (data.total == null) {
                historyDoc.set({ 'total': 1 });
            } else {
                historyDoc.set({ 'total': data.total + 1 });
            }
            document.getElementById('totalView').innerHTML = data.total + 1;
        });
        //오늘 조회수

        historyTodayDoc.get().then((doc) => {
            if (doc.exists) {
                var data = doc.data();
                if (data.cnt == null) {
                    historyTodayDoc.set({ 'cnt': 1 });
                } else {
                    historyTodayDoc.set({ 'cnt': data.cnt + 1 });
                }
                document.getElementById('todayView').innerHTML = data.cnt + 1;
            } else {
                historyTodayDoc.set({ 'cnt': 1 });
                document.getElementById('todayView').innerHTML = "첫 손님";
            }
        });
    }

});

function updateNews() {
    var newsDB = jshsRef.child('NEWS');
    var updateNews = newsDB.child(-getParam('id')).once('value', function (snp) {

        var dt = snp.val();

        try {
            if (dt.date == null || dt.date == "") {
                alert('존재하지 않는 게시물입니다.');
                history.go(-1);
            }
        } catch (e) {
            alert('존재하지 않는 게시물입니다.');
            history.go(-1);
        }

        var date = new Date();
        date.setTime(dt.date);

        var dateFormatted = getFormatDate(date, 0);

        $('#articleTitle').html(dt.title);
        document.title = dt.title+' | 전곽투데이'
        $('#articleAuthor').html(dt.author + ' 기자');
        $('#articleDate').html(dateFormatted + ' 작성');
        $('#articleContent').html(dt.desc);


        var count = jnewsDB.ref('COUNTS').child('NEWS').child(getParam('id')).once('value', function (snp) {
            var dtt = snp.val();

            var views = 1;
            var likes = 0;
            try {
                views += dtt.views;
                likes += dtt.likes;
            } catch (e) {
                views = 1;
                likes = 0;
            }
            $('#articleView').html('조회 ' + views)
            $('#likeBtn').html(heartEmpty + likes)
            jnewsDB.ref('COUNTS').child('NEWS').child(getParam('id')).child('views').set(views);
            if(likes == 0){
                jnewsDB.ref('COUNTS').child('NEWS').child(getParam('id')).child('likes').set(0);
            }

        });


        $('#article').append('<div id="fireComBlock" data-comment-tag="' + getParam('id') + '"></div>');
        $('#article').show();
        doFIRECOM();

    });
}

var likeit = false;
var heartEmpty = `<svg class="mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="20" height="20"
viewBox="0 0 172 172"
style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#e74c3c"><path d="M51.6,24.08c-24.65781,0 -44.72,20.06219 -44.72,44.72c0,50.78031 57.43188,75.84125 76.97,92.1275l2.15,1.8275l2.15,-1.8275c19.53813,-16.28625 76.97,-41.34719 76.97,-92.1275c0,-24.65781 -20.06219,-44.72 -44.72,-44.72c-13.94812,0 -26.20312,6.62469 -34.4,16.6625c-8.19687,-10.03781 -20.45187,-16.6625 -34.4,-16.6625zM51.6,30.96c13.19563,0 24.725,6.7725 31.4975,16.985l2.9025,4.3l2.9025,-4.3c6.7725,-10.2125 18.30188,-16.985 31.4975,-16.985c20.93563,0 37.84,16.90438 37.84,37.84c0,44.37063 -49.5575,67.33531 -72.24,85.2475c-22.6825,-17.91219 -72.24,-40.87687 -72.24,-85.2475c0,-20.93562 16.90438,-37.84 37.84,-37.84z"></path></g></g></svg>`;
var heartFilled = `<svg class="mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="20" height="20"
viewBox="0 0 172 172"
style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#e74c3c"><path d="M86,162.71469l-2.20375,-1.8275c-4.17906,-3.49375 -9.83625,-7.28312 -16.39375,-11.66375c-25.54469,-17.10594 -60.5225,-40.51406 -60.5225,-80.42344c0,-24.65781 20.06219,-44.72 44.72,-44.72c13.39719,0 25.94781,5.96625 34.4,16.16531c8.45219,-10.19906 21.00281,-16.16531 34.4,-16.16531c24.65781,0 44.72,20.06219 44.72,44.72c0,39.90938 -34.97781,63.3175 -60.5225,80.42344c-6.5575,4.38063 -12.21469,8.17 -16.39375,11.66375z"></path></g></g></svg>`;
function likeArticle() {
    if (!likeit) {
        likeit = true;

        jnewsDB.ref('COUNTS').child('NEWS').child(getParam('id')).child('likes').once('value', function (snp) {
            var dt = snp.val();
            $('#likeBtn').html(heartFilled + (dt + 1))
            jnewsDB.ref('COUNTS').child('NEWS').child(getParam('id')).child('likes').set(dt+1);
        });
    }
}

function initializePage() {
    var dt = new Date();
    var yyyy = dt.getFullYear();
    var mm = dt.getMonth() + 1;
    var dd = dt.getDate();
    mm = (mm < 10) ? '0' + mm.toString() : mm.toString();
    dd = (dd < 10) ? '0' + dd.toString() : dd.toString();
    $('#todayWidget').html(yyyy + "년 " + mm + "월 " + dd + "일")
}

function getFormatDate(date, type) {
    var year = date.getFullYear()
    var month = 1 + date.getMonth()
    month = month >= 10 ? month.toString() : '0' + month
    var day = date.getDate()
    day = day >= 10 ? day.toString() : '0' + day

    if (type == 0) return year + '-' + month + '-' + day;
    if (type == 1) return year + '' + month + '' + day;
}

function getParam(sname) {

    var params = location.search.substr(location.search.indexOf("?") + 1);

    var sval = "";

    params = params.split("&");

    for (var i = 0; i < params.length; i++) {

        temp = params[i].split("=");

        if ([temp[0]] == sname) { sval = temp[1]; }

    }

    return sval;

}




////////////////////////////
updateNewsWidget();
function updateNewsWidget(){
    $('#newsList').append('<a href="https://jshs.munzii.com/news/"><div>메인으로</div></a>');
    var newsDB = jshsRef.child('NEWS');
    var updateNews = newsDB.orderByChild('arrange').limitToFirst(3).on('child_added', function (snp) {
        var dt = snp.val();
        var date = new Date();
        date.setTime(dt.date);
        var dateFormatted = getFormatDate(date,0);
        
        $('#newsList').append('<a href="https://jshs.munzii.com/news/article?id='+dt.date+'"><div>'+dt.title+'<span class="author">'+dt.author+' 기자  '+dateFormatted+'</span></div></a>');
        
    });
}


// ------------------------------------- //
//              INFORMATION              //
// ------------------------------------- //
// ┌───────────────────────────────────┐ //
// │                                   │ //
// │        [FIRECom API 1.0]          │ //
// │                                   │ //
// │        DEVELOPED BY. HUZI         │ //
// │            2018-11-06             │ //
// │     *All Firebase components      │ //
// │      must be made and initi-      │ //
// │      alized.                      │ //
// │     *모든 파이어베이스 설정이       │ //
// │      초기화되어 있어야합니다.       │ //
// │                                   │ //
// │     *This API is available by     │ //
// │      by adding an id to a div     │ //
// │      "fireComBlock".              │ //
// │     *"fireComBlock" 아이디를 추    │ //
// │       가하여 사용하실 수 있습니     │ //
// │       다.                         │ //
// │                                   │ //
// │     *There should be a data-com   │ //
// │      ment-tag property with a     │ //
// │      special id.                  │ //
// │     *data-comment-tag 에 각 컴     │ //
// │      포넌트를 인식할 수 있는 id     │ //
// │      값을 넣어 주세요.             │ //
// │                                   │ //
// │     *This app uses bootstrap 4.   │ //
// │     *이 앱은 부트스트랩 4를 필요    │ //
// │      로 합니다.                    │ //
// │                                   │ //
// └───────────────────────────────────┘ //

//초기 설정값

var initId = "사용자" + (Math.floor(Math.random() * 1000)); // <--- 사용할 아이디
var initPicUrl = "https://jshs.munzii.com/market/src/basicProfile.jpg";


var commentNICK = initId;
var commentPIC = 'https://jshs.munzii.com/market/src/basicProfile.jpg';



// ------------------------------------- //
//              DO NOT TOUCH             //
// ------------------------------------- //



var firecomCommentBoxHTML = `
<div id="fc-input-div" class="row">
  <div class="col-2 col-sm-2 col-md-2 col-lg-1 fc-input-pic-div">
    <img class="rounded" id="fc-input-pic" src="` + initPicUrl + `">
  </div>
  <div class="col-10 col-sm-10 col-md-10 col-lg-11">
    <textarea class="form-control" id="fc-input-text" rows="2" placeholder="댓글을 입력해주세요."></textarea>
  </div>

</div>
<hr>
<div id="fc-list">
</div>
    `;

//     var firecomCommentBoxHTML = `
// <div id="fc-input-div" class="row">
//   <div class="col-2 col-sm-2 col-md-2 col-lg-1 fc-input-pic-div">
//     <img class="rounded" id="fc-input-pic" src="` + initPicUrl + `">
//   </div>
//   <div class="col-8 col-sm-8 col-md-9 col-lg-10">
//     <textarea class="form-control" id="fc-input-text" rows="2" placeholder="댓글을 입력해주세요."></textarea>
//   </div>
//   <div class="col-2 col-sm-2 col-md-1 col-lg-1" style="padding:0;">
//     <button type="button" class="btn btn-secondary" id="fc-input-submit">등록</button>
//   </div>
// </div>
// <hr>
// <div id="fc-list">
// </div>
//     `;


function firecomCommentHTMLReturn(id, pictureUrl, date, content, email, hide) {
    var contentR = content.split('FIRECOM_IMGTEMP').join('<img');
    contentR = contentR.split('FIRECOM_TAGTEMP2').join('</usertag');
    contentR = contentR.split('FIRECOM_TAGTEMP').join('<usertag');

    var result;
    if (hide) {
        result = `
        <div class="fc-list-item row">
          <div class="col-2 col-sm-2 col-md-2 col-lg-1 fc-list-item-pic-div">
            <img class="rounded fc-list-item-pic" src="` + "https://jshs.munzii.com/market/src/basicProfile.jpg" + `">
          </div>
          <div class="col-10 col-sm-10 col-md-10 col-lg-11 fc-list-item-content">
            <div class="fc-list-item-id">비공개<span class="fc-list-item-date"><small>` + date + `</small></span></div>
            <div class="fc-list-item-text">` + contentR + `</div>
          </div>
        </div>
      `;
    } else {
        result = `
        <div class="fc-list-item row">
          <div class="col-2 col-sm-2 col-md-2 col-lg-1 fc-list-item-pic-div">
            <img class="rounded fc-list-item-pic" src="` + pictureUrl + `">
          </div>
          <div class="col-10 col-sm-10 col-md-10 col-lg-11 fc-list-item-content">
            <div class="fc-list-item-id"><a href="javascript:tagUser('`+ email + `','` + id.split(" <span")[0] + `')">` + id + `</a><span class="fc-list-item-date"><small>` + date + `</small></span></div>
            <div class="fc-list-item-text">` + contentR + `</div>
          </div>
        </div>
      `;
    }
    return result;
}

var firecomCommentRef;
function doFIRECOM() {
    if ($('#fireComBlock').length) {
        var cb = $('#fireComBlock');
        //초기설정
        cb.html(firecomCommentBoxHTML);
        const commentTag = $("#fireComBlock").data("comment-tag");
        firecomCommentRef = jnewsDB.ref("COMMENTS/NEWS").child(commentTag);

        //댓글 추가
        firecomCommentRef.on('child_added', function (snapshot) {
            var comVal = snapshot.val();
            var dateRaw = new Date();
            dateRaw.setTime(comVal.date);
            var date = dateRaw.toLocaleString();

            //비공개
            var hide = false;
            if (comVal.hide == true) {
                hide = true;
            }
            $("#fc-list").html(firecomCommentHTMLReturn(comVal.id, comVal.picUrl, date, comVal.content, comVal.email, hide) + $('#fc-list').html());
        });


        $('#fc-input-submit').click(function () {
            submitFIRECOM();
        });
        $('#fc-input-text').keypress(function (e) {
            if (e.keyCode == 13) {
                if (!event.shiftKey) {
                    submitFIRECOM();
                }
            }
        });
    }
}

function submitFIRECOM() {
    try {
        var contentTT = $('#fc-input-text').val();
        if (contentTT == "" || contentTT.length > 500) {
            alert('댓글을 500자 이내로 입력해주세요.');
            event.preventDefault();
        } else {
            //댓글 보내기
            var hide = false;

            var dateNow = new Date();
            var key = dateNow.getTime() + "-" + Math.floor((Math.random() * 100));
            firecomCommentRef.child(key).set({
                id: initId,
                picUrl: initPicUrl,
                date: dateNow.getTime(),
                content: contentTT,
                hide: hide
            }).then(function () {
                $('#fc-input-text').val("");
                fcCallback(commentNICK, commentPIC);
            });
        }
    } catch (e) { }
}
function tagUser(email, nick) {
}
function fcCallback(nick, pic) {

}
