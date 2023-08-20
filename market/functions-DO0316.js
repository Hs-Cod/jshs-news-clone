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
var jnewsDB = jnews.database();



const auth = firebase.auth();

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        //초기화 작업
        var getInfo = jnewsDB.ref('MARKET/user').child(user.uid);
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
            }
            else {
                $('#loginInfo').html(tmpName);
                $('#logoutedA').hide();
                $('#loginedA').show();
                localStorage.setItem('loginTmp', tmpName)
            }
        })
    } else {
        $('#logoutedA').show();
        $('#loginedA').hide();
        localStorage.setItem('loginTmp', '')
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



const mRef = jnewsDB.ref("MARKET");


var cnt = 0;
$(window).load(function () {
    var totalPost = jnewsDB.ref('MARKET/board/0').limitToLast(3);
    var board1 = jnewsDB.ref('MARKET/board/1').limitToLast(3);
    var board2 = jnewsDB.ref('MARKET/board/2').limitToLast(3);
    var board3 = jnewsDB.ref('MARKET/board/3').limitToLast(3);
    var board4 = jnewsDB.ref('MARKET/board/4').limitToLast(3);
    var board5 = jnewsDB.ref('MARKET/board/5').limitToLast(3);
    var board6 = jnewsDB.ref('MARKET/board/6').limitToLast(3);

    totalPost.on('child_added', (snp) => {
        var vl = snp.val();
        $('#board0').append(returnHTML(vl, cnt));
        $('#board0 .noProdDesc').fadeOut();
        loadHtml(vl, cnt);
        cnt++
    });
    board1.on('child_added', (snp) => {
        var vl = snp.val();
        $('#board1').append(returnHTML(vl, cnt));
        $('#board1 .noProdDesc').fadeOut();
        loadHtml(vl, cnt);
        cnt++;
    });
    board2.on('child_added', (snp) => {
        var vl = snp.val();
        $('#board2').append(returnHTML(vl, cnt));
        $('#board2 .noProdDesc').fadeOut();
        loadHtml(vl, cnt);
        cnt++;
    });
    board3.on('child_added', (snp) => {
        var vl = snp.val();
        $('#board3').append(returnHTML(vl, cnt));
        $('#board3 .noProdDesc').fadeOut();
        loadHtml(vl, cnt);
        cnt++;
    });
    board4.on('child_added', (snp) => {
        var vl = snp.val();
        $('#board4').append(returnHTML(vl, cnt));
        $('#board4 .noProdDesc').fadeOut();
        loadHtml(vl, cnt);
        cnt++;
    });
    board5.on('child_added', (snp) => {
        var vl = snp.val();
        $('#board5').append(returnHTML(vl, cnt));
        $('#board5 .noProdDesc').fadeOut();
        loadHtml(vl, cnt);
        cnt++;
    });
    board6.on('child_added', (snp) => {
        var vl = snp.val();
        $('#board6').append(returnHTML(vl, cnt));
        $('#board6 .noProdDesc').fadeOut();
        loadHtml(vl, cnt);
        cnt++;
    });
});


function loadHtml(prodId, cntr) {
    mRef.child('product').child(prodId).once('value', (snp) => {
        var vl = snp.val();
        var status = '나눔중';
        var heartSt = 'heart_empty';
        var badgeSt = 'success';
        var dt = new Date();
        if (vl.sold != 0) {
            status = '나눔 완료';
            badgeSt = 'secondary';
            heartSt = 'heart_filled';
        } else if (dt.getTime() - parseInt(vl.zzim.time) < 86400000) {
            status = vl.zzim.user.name + '님이 찜!'
            heartSt = 'heart_filled';
            badgeSt = 'info';
        }
        var desc = vl.desc.length>50 ? vl.desc.slice(0,50)+'<span style="color:#333;">⋯</span>': vl.desc;
        var htmlRaw2 = `
            <table>
              <tr>
                <th width="300" data-aos="fade-in">
                  <img class="item-pic" src="`+ vl.img + `">
                </th>
                <th width="600">
                  <span data-aos="zoom-in-up" data-aos-delay="100"  class="item-zzim"><a href="javascript:zzim('`+ prodId + `')"><img src="src/` + heartSt + `.png"></a></span>
                  <span data-aos="flip-up" data-aos-delay="200" class="item-title">`+ vl.pname + ` <span class="badge badge-` + badgeSt + `">` + status + `</span>
                  </span>
                  <span data-aos="fade-in" data-aos-delay="300" class="item-desc">`+ desc + `</span>
                  <span data-aos="fade-in" data-aos-delay="400" class="item-seller"><span class="text-secondary">나눔이</span> `+ vl.user.gcn + ` ` + vl.user.name + `</span>
                  <span data-aos="fade-in" data-aos-delay="500" class="item-date"><span class="text-secondary">올린 날짜</span> `+ vl.date + `</span>
                </th>
              </tr>
            </table>
        `;
        $('#prod' + prodId + cntr).html(htmlRaw2);
        $('#prod' + prodId + cntr).fadeIn()
        AOS.init({
            once: true
        });

    });
}
function returnHTML(prodId, cntr) {
    var htmlRaw = `
        <a href="https://jshs.munzii.com/market/product/?pid=`+ prodId + `"><li class="item" style="display:none" id="prod` + prodId + cntr + `"></li></a>
        `;
    return htmlRaw;
}



////////////////////////조회수////////////////////////////////

var dt = new Date();
var yy = dt.getFullYear();
var mm = dt.getMonth() + 1;
mm = mm < 10 ? '0' + mm : mm;
var dd = dt.getDate();
dd = dd < 10 ? '0' + dd : dd;
var rawDate = yy.toString()+mm.toString()+dd.toString();

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