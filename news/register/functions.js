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
const codeRef = firebase.database().ref("CODE/NEWS");

//가입시 소속
var club = "전곽일보 미니기자단 2기"

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        //LOGINED
        user = firebaseUser;

        progAnim(10, "초대 코드 입력 중..");

        var i1 = prompt("초대코드를 입력해주세요 : ").trim().toUpperCase();
        if (i1 != "" && i1 != null) {
            codeRef.child(i1).once('value', (snp) => {
                var dt = snp.val();
                dt = dt==null || dt==undefined ? "" : dt.toString().trim();
                
                if (dt == "" || dt == null) {
                    alert('유효하지 않은 코드입니다.');
                    progAnim(0, "유효하지 않은 코드입니다.");
                } else if (dt.length > 3 && (dt.indexOf(user.uid) == -1)) {
                    alert('이미 등록된 코드입니다.');
                    progAnim(0, "이미 등록된 코드입니다.");
                } else {
                    club = "전곽일보 미니기자단 "+dt+"기";
                    var date = new Date();
                    codeRef.child(i1).set(dt+" / "+user.uid + " / " + date.getTime()).then(() => {
                        progAnim(25, "방송국 이름 설정 중..");

                        //Retrieve User data from DB
                        dbRef.child("USERS_DB").child(user.uid).once('value', function (snp) {
                            var dt = snp.val();

                            var nameInput = "";

                            var tmpNick = "";
                            try{
                                tmpNick = (dt.news.nick == null ) ? "" : dt.news.nick;
                            }catch(e){}

                            if (tmpNick == "") {
                                while (true) {
                                    nameInput = prompt('기자/방송국 이름을 입력해주세요. (이후에 수정 가능)').trim();
                                    if (nameInput != "" && nameInput.length <= 10) {
                                        break;
                                    }
                                    else {
                                        alert('10자 이내로 입력해주세요.');
                                    }
                                }
                            }

                            progAnim(45, "기타 설정 진행 중..");
                            dbRef.child("USERS_DB").child(user.uid).child('auth').set('news').then(() => {
                                progAnim(65, "기타 설정 진행 중..");

                                if (nameInput != "") {
                                    dbRef.child("USERS_DB").child(user.uid).child('news').set({ desc: club, nick: nameInput });
                                }

                                // 전의 기수가 계속하는 경우
                                if(dt.news.desc && dt.news.desc != club){
                                    dbRef.child("USERS_DB").child(user.uid).child('news').child('desc').set(club);
                                }

                                firebase.database().ref('ADMIN/news').child(user.uid).once('value', (snp) => {
                                    var snpp = "";
                                    try{
                                        snpp = (snp.val() == null) ? "" : snp.val();
                                    }catch(e){}
                                    
                                    if (snpp == "") {
                                        while (true) {
                                            nameInput = prompt('실명을 입력해주세요.\n(실명은 공개되지 않습니다. 실명이 입력되지 않는 경우 서비스 이용이 제재될 수 있습니다.)').trim();
                                            if (nameInput != "" && nameInput.length <= 30) {
                                                break;
                                            }
                                        }
                                        //remove all special characters from nameInput
                                        nameInput = nameInput.replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
                                        firebase.database().ref('ADMIN/news').child(user.uid).set(nameInput + '/' + club).then(() => {
                                            progAnim(100, "완료되었습니다.");
                                        });

                                    } else if(snpp.indexOf(club) == -1){
                                        // 전 기수인 경우
                                        firebase.database().ref('ADMIN/news').child(user.uid).set(snpp + '/' + club).then(() => {
                                            progAnim(100, "완료되었습니다.");
                                        });
                                    } else {
                                        progAnim(100, "완료되었습니다.");
                                    }
                                })

                            });
                        });

                    });

                }
            });

        } else {
            progAnim(0, '잘못된 코드입니다.');
        }
    } else {
        //LOGOUT
        alert('먼저 전곽일보에 회원가입해 주세요.');
        window.location.href = "https://jshs.munzii.com/login?fw=news-register";
    }
});


var prog = 1;
var width = 0;
let anim = setInterval(frame, 10);
function progAnim(progress, desc) {
    $('#desc').html(desc);
    prog = progress;
    if(progress == 0){
        $('#prg').hide();
    }
}
function frame() {
    if (width == 100) {
        clearInterval(anim);
        setTimeout(function () {
            window.location.href = "https://jshs.munzii.com/news/";
        }, 1000);
    } else {
        if (width < prog) {
            width++;
            $('#prg').val(width);
        }
    }
}