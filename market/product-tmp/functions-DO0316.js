//////////////////////페이지 로딩 후 초기화 작업///////////////////////
var firebaseConfig = {
    apiKey: "AIzaSyBFOeMptZokqs9sv6s2opCPuJAb3rLVbtI",
    authDomain: "jshs-news.firebaseapp.com",
    databaseURL: "https://jshs-news-default-rtdb.firebaseio.com",
    projectId: "jshs-news",
    storageBucket: "jshs-news.appspot.com",
    messagingSenderId: "350427065203",
    appId: "1:350427065203:web:59fcf1ff2fdd1c6afd7306"
  };
  // Initialize Firebase

var jnews = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const mRef = firebase.database().ref("MARKET");


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        //초기화 작업
        var getInfo = firebase.database().ref('MARKET/user').child(user.uid);
        getInfo.once('value', (snp) => {
            var vl = snp.val()
            try {
                var tmpName = vl.name;
                if (tmpName == null) { tmpName = '' }
            } catch (e) {
                var tmpName = '';
            }

            if (tmpName == "") {
                $('#logoutedA').show();
                $('#loginedA').hide();
                localStorage.setItem('loginTmp', '')
                alert('배푸는 민족을 계속 이용하기 위해서는 별도의 인증이 필요합니다.');
                window.location.href = 'https://jshs.munzii.com/market/login';
            }
            else {
                $('#loginInfo').html(tmpName);
                $('#logoutedA').hide();
                $('#loginedA').show();
                localStorage.setItem('loginTmp', tmpName)

                initId = vl.grade + "" + vl.class + "" + vl.num + " " + vl.name;
                commentNICK = initId;
            }
        })
    } else {
        $('#logoutedA').show();
        $('#loginedA').hide();
        localStorage.setItem('loginTmp', '')

        $('#fc-input-div').hide()
    }
});
$(window).load(() => {
    var tmK = localStorage.getItem('loginTmp');
    if (tmK == '') {
        $('#logoutedA').show();
        $('#loginedA').hide();
    } else {
        $('#loginInfo').html(tmK);
        $('#logoutedA').hide();
        $('#loginedA').show();
    }
})


var zzimed;
var pid;
$(window).load(function () {
    var url_string = window.location.href;
    var url = new URL(url_string);
    pid = url.searchParams.get("pid");
    if (pid == "" || pid == null) {
        $('#productNone').fadeIn()
    } else {
        var productInfo = firebase.database().ref('MARKET/product/' + pid);
        productInfo.once('value', (snp) => {
            var vl = snp.val();

            var pnameTmp = '';
            try {
                pnameTmp = vl.pname;
                if (pnameTmp == null) {
                    pnameTmp = '';
                }
            } catch (e) {
                $('#productNone').fadeIn()
            }

            if (pnameTmp == '') {
                $('#productNone').fadeIn()
            } else {
                var status = '나눔중';
                var heartSt = 'heart_empty';
                var badgeSt = 'success';
                var dt = new Date();
                if (vl.sold != 0) {
                    status = '나눔 완료';
                    badgeSt = 'secondary';
                    zzimed = true;
                } else if (dt.getTime() - parseInt(vl.zzim.time) < 86400000) {
                    status = vl.zzim.user.name + '님이 찜!'
                    heartSt = 'heart_filled';
                    badgeSt = 'info';
                    zzimed = true;
                }

                $('.item-pic').attr('src', vl.img);
                $('.item-title').html(vl.pname)
                $('.badge').addClass('badge-' + badgeSt);
                $('.badge').html(status);
                $('.item-desc').html(vl.desc);
                $('.item-seller').html(vl.user.gcn + ' ' + vl.user.name);
                $('.item-date').html(vl.date);

                if (zzimed) {
                    $('#zzimBtn').css('background-color', '#444')
                    $('#zzimBtnImg').attr('src', '../src/heart_filled_btn.png');
                    $('#controlsDiv').css('background', 'linear-gradient(90deg, #444 0%, #444 50%, grey 50%, grey 100%)')
                }
                $('#productInfo').fadeIn();

                if (vl.user.uid == auth.getUid()) {
                    if (vl.sold == 1) {
                        $('#adminTools').html('<a href="javascript:deleteProd()" style=" color:rgb(255, 73, 73) !important;">삭제</a> · <a href="javascript:finishProd(0)" style="color:rgb(49, 49, 49) !important;">나눔 중으로 표시</a>');
                    } else {
                        $('#adminTools').html('<a href="javascript:deleteProd()" style=" color:rgb(255, 73, 73) !important;">삭제</a> · <a href="javascript:finishProd(1)" style="color:rgb(49, 49, 49) !important;">나눔 완료로 표시</a>');
                    }
                    $('#adminTools').show();
                }

                doFIRECOM();
            }
        });

    }
});

function commentShow() {
    $('#commentsDiv').slideToggle();
}
function zzim() {
    var dt = new Date();
    if (!zzimed) {
        if (confirm('상품을 찜하시겠습니까?\n취소는 불가능합니다.')) {
            mRef.child('product').child(pid).once('value', (snp) => {
                var vl = snp.val();
                if (vl.sold != null) {
                    if (vl.sold == 1) {
                        alert('나눔이 완료된 상품입니다.')
                    } else if (dt.getTime() - parseInt(vl.zzim.time) < 86400000) {
                        alert(vl.zzim.user.name + '님이 찜한 상품입니다.')
                    } else {
                        var getInfo = firebase.database().ref('MARKET/user').child(auth.getUid());
                        getInfo.once('value', (snp) => {
                            var vls = snp.val();
                            mRef.child('product').child(pid).child('zzim').set({
                                time: dt.getTime(),
                                user: {
                                    gcn: vls.grade + "" + vls.class + "" + vls.num,
                                    name: vls.name,
                                    uid: auth.getUid()
                                }
                            }).then(() => {
                                alert('상품을 찜했습니다!');
                                history.go(0);
                            });
                        });
                    }
                }
            });
        }
    }
}

function deleteProd() {
    mRef.child('product').child(pid).once('value', (snp) => {
        var vl = snp.val();
        if (vl.user.uid == auth.getUid()) {
            if (confirm('정말로 상품을 삭제하시겠습니까?\n취소는 불가합니다.')) {
                mRef.child('product').child(pid).remove().then(function () {
                    mRef.child('board/0').child(pid).remove().then(function () {
                        mRef.child('board').child(vl.category).child(pid).remove().then(function () {
                            mRef.child('user').child(auth.getUid()).child('product').child(pid).remove().then(function () {
                                alert('삭제되었습니다.');
                                window.location.href = 'https://jshs.munzii.com/market'
                            });
                        });
                    });
                });
            }
        }
    });

}
function finishProd(mod) {
    mRef.child('product').child(pid).once('value', (snp) => {
        var vl = snp.val();
        if (vl.user.uid == auth.getUid()) {
            if (mod == 1) {
                if (confirm('나눔 완료로 표시하겠습니까?')) {
                    mRef.child('product').child(pid).child('sold').set(1).then(function () {
                        alert('완료되었습니다.');
                        history.go(0);
                    });
                }
            }else{
                if (confirm('나눔 중인 상태로 표시하겠습니까?')) {
                    mRef.child('product').child(pid).child('sold').set(0).then(function () {
                        alert('완료되었습니다.');
                        history.go(0);
                    });
                }

            }
        }
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
var initId = ""; // <--- 사용할 아이디
var initPicUrl = localStorage.getItem('profilePic'); // <--- 사용할 프로필 사진 링크
if (initPicUrl == null || initPicUrl == "") {
    initPicUrl = "https://jshs.munzii.com/market/src/basicProfile.jpg";
}

var commentNICK = '';
var commentPIC = 'https://jshs.munzii.com/market/src/basicProfile.jpg';



// ------------------------------------- //
//              DO NOT TOUCH             //
// ------------------------------------- //



var firecomCommentBoxHTML = `
<div id="fc-input-div" class="row">
  <div class="col-2 col-sm-2 col-md-2 col-lg-1 fc-input-pic-div">
    <img class="rounded" id="fc-input-pic" src="` + initPicUrl + `">
  </div>
  <div class="col-8 col-sm-8 col-md-9 col-lg-10">
    <span contenteditable="true" ondragenter="event.preventDefault(); event.dataTransfer.dropEffect = 'none'" ondragover="event.preventDefault(); event.dataTransfer.dropEffect = 'none'" class="form-control" id="fc-input-text" rows="2" placeholder="댓글을 입력해주세요."></span>
  </div>
  <div class="col-2 col-sm-2 col-md-1 col-lg-1" style="padding:0;">
    <button type="button" class="btn btn-secondary" id="fc-input-submit">▶</button>
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
function handlePaste(e) {
    var clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('text/plain');
    pastedDataHTML = clipboardData.getData('text/html');
    // Do whatever with pasteddata
    if (pastedDataHTML.includes("<img")) {
        var tmp1 = pastedDataHTML.split("<img")[1].split("src=")[1];
        var tmp2 = String(tmp1).split("'")[1];
        var tmp3 = String(tmp1).split('"')[1];
        console.log(tmp2 + " /// " + tmp3);
        var pattern = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');
        if (!pattern.test(tmp2) || tmp2 == null) {
            if (!pattern.test(tmp3) || tmp3 == null) {
                document.execCommand("insertHTML", false, pastedData);
            } else {
                document.execCommand("insertHTML", false, `<img src='` + tmp3 + `' class="fc-comment-img">`);
                // alert(tmp3);
            }
        } else {
            alert(tmp2)
        }
    } else {
        document.execCommand("insertHTML", false, pastedData);
    }

}

function doFIRECOM() {
    if ($('#fireComBlock').length) {
        var cb = $('#fireComBlock');
        //초기설정
        cb.html(firecomCommentBoxHTML);
        //const commentTag = $("#fireComBlock").data("comment-tag");
        const firecomCommentRef = firebase.database().ref("jshs/market/comments").child(pid);

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
        document.getElementById('fc-input-text').addEventListener('paste', handlePaste);

        const firecomAuth = firebase.auth();
        function submitFIRECOM() {
            try {
                var currentFirecomEmail = firecomAuth.currentUser.email;
            } catch (e) { }

            if (currentFirecomEmail != null && currentFirecomEmail != "") {
                var contentT = $('#fc-input-text').html().trim().split('<img').join('FIRECOM_IMGTEMP');
                contentT = contentT.trim().split('<usertag').join('FIRECOM_TAGTEMP');
                contentT = contentT.trim().split('</usertag').join('FIRECOM_TAGTEMP2');
                var contentTT = contentT.trim().split('<').join('&lt;');
                var beforeContent = $('#fc-input-text').html().trim();
                $('#fc-input-text').html("");
                if (contentTT == "") {
                    alert('댓글을 입력한 후에 등록할 수 있습니다.');
                    event.preventDefault();
                } else {

                    //댓글 보내기
                    var hide = false;

                    var tagContent = beforeContent.split('<usertag contenteditable="false" class="userTag badge badge-info p-2 m-1" value="');
                    var parsedTagContent = "";
                    tagContent.forEach(function (item, index) {
                        if (index != 0) {
                            parsedTagContent += item.split('">')[0] + "|" + item.split('">')[1].split("</")[0] + ",";
                        }
                    });
                    var tmpTagArr = parsedTagContent.split(',');
                    tmpTagArr.pop();
                    tmpTagArr.forEach(function (item, index) {
                        //pushNotification(item.split('|')[0], "<b>" + commentNICK + "</b>님이 회원님을 태그했습니다.", commentPIC, window.location.href, null)
                    });
                    var dateNow = new Date();
                    var key = dateNow.getTime() + "-" + Math.floor((Math.random() * 100));
                    firecomCommentRef.child(key).set({
                        id: initId,
                        picUrl: initPicUrl,
                        date: dateNow.getTime(),
                        content: contentTT,
                        uid: auth.getUid(),
                        hide: hide
                    }).then(function () {
                        $('#fc-input-text').html("");
                        fcCallback(commentNICK, commentPIC);
                    });
                }
            } else {
                alert('로그인 후에 댓글을 입력하실 수 있습니다.');
            }
        }
    }


}
function tagUser(email, nick) {
    if (nick == "undefined" || nick == "" || email == "undefined" || email == "") {
        // alert("태그가 불가능합니다. (업데이트 전의 댓글)");
    } else {
        var tagData = `&nbsp;<usertag contenteditable="false" class="userTag badge badge-info p-2 m-1" value="` + email + `">` + nick + `</usertag>&nbsp;`;
        $('#fc-input-text').append(tagData);
    }
}
function fcCallback(nick, pic) {

}



////////////////////////조회수////////////////////////////////

var dt = new Date();
var yy = dt.getFullYear();
var mm = dt.getMonth() + 1;
mm = mm < 10 ? '0' + mm : mm;
var dd = dt.getDate();
dd = dd < 10 ? '0' + dd : dd;
var rawDate = yy.toString() + mm.toString() + dd.toString();

//전체 조회수
mRef.child('history').child("check").once('value', function (snapshot) {
    var num = 0;
    if (snapshot.val() !== null && snapshot.val() != "") {
        num = snapshot.val().num;
    }
    document.getElementById('totalView').innerHTML = num + 1;
    mRef.child('history').child("check").set({
        num: num + 1
    });
});

//오늘 조회수
mRef.child('history').child("checkToday/" + rawDate).once('value', function (snapshot) {
    var num = 0;
    if (snapshot.val() !== null && snapshot.val() != "") {
        num = snapshot.val().num;
    }
    document.getElementById('todayView').innerHTML = num + 1;
    mRef.child('history').child("checkToday/" + rawDate).set({
        num: num + 1
    });
});