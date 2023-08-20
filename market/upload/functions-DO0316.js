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
        localStorage.setItem('loginTmp', '');
        alert('로그인 후에 이용해 주세요.')
        window.location.href = 'https://jshs.munzii.com/market/login'
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

const jshsRef = firebase.database().ref("jshs");

var pKey = '';
function addProduct(pname, desc, imgurl, category) {
    var dt = new Date()
    var yy = dt.getFullYear()
    var mm = dt.getMonth() + 1
    var dd = dt.getDate()
    mm = mm < 10 ? '0' + mm : mm
    dd = dd < 10 ? '0' + dd : dd

    pKey = dt.getTime()

    mRef.child('user/' + auth.getUid()).once('value', (snp) => {
        var vl = snp.val()
        mRef.child('product').child(dt.getTime()).set({
            date: yy + '/' + mm + '/' + dd,
            desc: desc,
            img: imgurl,
            pname: pname,
            category: category,
            sold: 0,
            user: {
                gcn: vl.grade + "" + vl.class + "" + vl.num,
                name: vl.name,
                uid: auth.getUid()
            },
            zzim: {
                time: 0,
                user: {
                    gcn: 0000,
                    name: 'none',
                    uid: 'none'
                }
            }
        }).then(() => {
            mRef.child('board').child(0).child(dt.getTime()).set(dt.getTime()).then(() => {
                mRef.child('board').child(category).child(dt.getTime()).set(dt.getTime()).then(() => {
                    mRef.child('user/' + auth.getUid()).child('product').child(dt.getTime()).set(dt.getTime()).then(() => {
                        window.location.replace('https://jshs.munzii.com/market/product/?pid=' + pKey);
                    })
                })
            })
        });
    });
}

var storageRef = firebase.storage().ref();
$(window).load(() => {
    $('#uploadItem').click(() => {
        var pName = $('#pName').val();
        var pDesc = $('#pDesc').val();
        var pImg = $('#pImg').prop('files')[0];
        var dt = new Date();

        try {
            var pGenre = document.querySelector('input:checked').value;
        } catch (e) {
            var pGenre = undefined;
        }

        if (pName == '' || pDesc == '' || pImg == undefined || pGenre == '' || pGenre == undefined) {
            alert('모든 내용을 입력해주세요.')
        } else if (pImg.size > 5242880) {
            alert('사진의 최대 크기는 5MB입니다.');
        } else if (pName.length < 3 || pName.length > 15) {
            alert('상품명을 3~15자로 해주세요.');
        } else if (pDesc.length < 10 || pName.length > 200) {
            alert('상품 설명을 10~200자로 해주세요.');
        } else if (pGenre < 1 || pGenre > 6) {
            alert('올바른 카테고리를 선택해주세요.')
        } else {
            $('body').css('transition', 'all 1s')
            $('body').css('filter', 'blur(20px)')
            $('body').css('pointer-events', 'none')

            storageRef.child('market').child(dt.getTime().toString()).put(pImg).then(function (snapshot) {
                if (snapshot.state != 'success') {
                    alert('업로드를 실패했습니다. 잠시 후 이용해주세요.');
                    history.go(0);
                } else {
                    storageRef.child('market').child(dt.getTime().toString()).getDownloadURL().then(function (url) {
                        addProduct(pName, pDesc, url, pGenre);
                    });
                }
            });
        }
    });
})



function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


// var k = 1;
// for (var i = 1; i < 19; i++) {
//     var knum = i < 10 ? '0' + i.toString() : i.toString();

//     var tmpid = makeid(6)
//     console.log('31' + knum + ' : ' + tmpid);
//     mRef.child('user/CODE_DATABASE').child(tmpid).set({
//         class: 1,
//         expire: '2020',
//         grade: 3,
//         num: knum
//     }).then(() => {
//         console.log(k + '번 FINISHED'); k++
//     })
// }
// var tmpmk = ["4VXIGR","BA3JQ2","1MSLLQ","22YBQY","4X55QD","F1GW5C","X9S14E","2EZ6W9","QFT85C","YN7KCU","JGILI9","Q3R1ZF","1JH8DG","XPJN1H","L3S41S","6B2ZL3","H4LLEM","EQ7PDR","2T6WD8","4NWWM1","T3TTCZ","8L8DN7","6ADRD3","45FFTZ","AU2MB4","NUEU18","9M1I2V","GXMJRS","3RLMWC","VTFI98","Y95UAK","TVUUSS","QDH4QT","CLF8F7","G3DCSV","AB6ZGM","3UUXME","2MI968","PCHNN5","1MCKHJ","MDZ6II","FJ52IV","GELDER","RDRU9G","WKV3R8","19DHNC","TG5VSH","M1G6BT","AZ4JYE","6PVD4S","G7T4G7","C3XE78","WRN6F9","T9Z82U","39BV73","QJQFB8","DGKZ2S","UX7723","MCSXYZ","YKMBS4","AZT6EQ","4CU4Y7","UT473E","WK95J8","X85CAQ","W61133","JSJRDM","GEYNKN","SXTYWT","VCH4NA","JFE81T","9864SM","JPQ9RZ","1YUXAP","N8J1VR","Y3H6LC","S79DIN","E98I9F","QFX1J5","TCXXDI","EBYJJS","7BKQ3R"];

// mRef.child('user/CODE_DATABASE').on('child_added',(snp)=>{
//     var kk = snp.key;
//     if(!tmpmk.includes(kk)){
//         mRef.child('user/CODE_DATABASE').child(kk).remove();
//     }
// })

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