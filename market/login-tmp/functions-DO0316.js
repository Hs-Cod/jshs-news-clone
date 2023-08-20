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
    // $('#spaceDiv').hide();
    if (user) {
        var uid = user.uid
        mRef.child('user/' + uid).once('value', (snp) => {
            $('#loginDiv').hide();
            var vl = snp.val()
            try {
                var tmpName = vl.name;
                if (tmpName == null) { tmpName = '' }
            } catch (e) {
                var tmpName = '';
            }

            if (tmpName == "") {
                $('#signinDiv').fadeIn();
            }
            else {
                $('#infoName').val(vl.name)
                $('#infoGcn').val(vl.grade + "" + vl.class + "" + vl.num)
                $('#infoDiv').fadeIn();
                if(vl.product == null){
                    $('#myList').append(`<br><span class='myListItem'>나눔 중인 상품이 없습니다.</span></a>`);
                }else{
                    $.each(vl.product, function (key, value) {
                        mRef.child('product').child(value).once('value', (snp2) => {
                            var vls = snp2.val();
                            var status = '';
                            if(vls.sold == 0){
                                status=' [나눔중]'
                            }else{
                                status=' [나눔완료]'
                            }
                            $('#myList').append(`<br><a href="https://jshs.munzii.com/market/product/?pid=`+value+`"><span class='myListItem'>`+vls.pname+status+`</span></a>`);
                        })
                    })
                }
            }
        });
    } else {
        localStorage.setItem('loginTmp', '')
        $('#loginDiv').fadeIn();
        $('#signinDiv').hide();
        $('#infoDiv').hide();
    }
});



function logout() {
    firebase.auth().signOut();
}

function signin() {
    var si_name = $('#signinName').val().trim();
    var si_code = $('#signinCode').val().trim();
    if (si_name == '' || si_code == '') {
        alert('빈칸이 있으면 안됩니다.');
    } else if (si_name.length > 10) {
        alert('이름은 1~10자만 가능합니다.');
    } else if (si_code.length != 6) {
        alert('유효하지 않은 인증 코드입니다.');
    } else {
        mRef.child('user/CODE_DATABASE').child(si_code).once('value', (snp) => {
            var vl = snp.val();
            var dt = new Date()
            if (vl.grade == '' || vl.grade == null || vl.expire != dt.getFullYear()) {
                alert('유효하지 않은 인증 코드입니다.');
            } else {
                mRef.child('user').child(auth.getUid()).set({
                    grade: vl.grade,
                    class: vl.class,
                    num: vl.num,
                    name: si_name
                }).then(() => {
                    alert('배푸는 민족의 회원이 되신 것을 축하드립니다!')
                    history.go(0)
                });
            }
        })
    }

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



