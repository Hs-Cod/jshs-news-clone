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
// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

$("#formSignup").hide();
$("#form").hide();
$("#formLogined").hide();
clearInputs();


//----------------------( LOGIN )----------------------//

$('#form input').keydown(function (e) {
    if (e.keyCode == 13) { $("#open").click(); }
});
$("#open").click(function () {

    // Get User Input
    var id = $('#idInput').val().trim().toLowerCase();
    var pw = $('#pwInput').val().trim();

    if (id == "") {
        $('#wrongId').height("34px");
        $('#wrongPw').height("0px");
        $('#wrongTry').height("0px");
        $('#idInput').focus();
    } else if (pw == "") {
        $('#wrongId').height("0px");
        $('#wrongPw').height("34px");
        $('#wrongTry').height("0px");
        $('#pwInput').focus();
    } else {
        // Login
        $("#loginLoading").show(500);
        if (isEmail(id)) {
            login(id, pw);
        } else {
            dbRef.child('ID_DB').child(id).once('value', (snp) => {
                var dt = snp.val();
                if (dt == null || dt == "") {
                    loginFail();
                } else {
                    login(dt, pw)
                }
            })
        }
    }
});
function login(email, pw) {
    const promise = auth.signInWithEmailAndPassword(email, pw);
    promise.catch(e => {
        // Login fail
        loginFail();
    });
}
function loginFail() {
    $("#loginLoading").hide(500);
    $('#form').addClass('shake');
    $('#wrongId').height("0px");
    $('#wrongPw').height("0px");
    $('#wrongTry').height("34px");
    $('#pwInput').focus();
    interval = window.setInterval(shake, 2000);
}

//----------------------( SIGNUP )----------------------//

$("#signup").click(function () {
    $("#formSignup").show();
    $("#form").hide();
    clearInputs();
});
$('#formSignup input').keydown(function (e) {
    if (e.keyCode == 13) { $("#signupOpen").click(); }
});
$("#signupOpen").click(function () {
    // Get User Input
    var id = $('#idSignInput').val().trim().toLowerCase();
    var email = $('#emailSignInput').val().trim().toLowerCase();
    var pw = $('#pwSignInput').val().trim();
    var pwcheck = $('#pwcheckSignInput').val().trim();

    if (id == "" || pw == "" || pwcheck == "" || email == "") {
        signUpWarning(glang(18))
    } else if (id.length < 4 || id.length > 20) {
        signUpWarning(glang(28));
        $('#idSignInput').focus();
    } else if (!isEmail(email)) {
        signUpWarning(glang(20));
        $('#emailSignInput').focus();
    } else if (pw != pwcheck) {
        signUpWarning(glang(19));
        $('#pwcheckSignInput').focus();
    } else if (pw.length < 6 || pw.length > 100) {
        signUpWarning(glang(21));
        $('#pwSignInput').focus();
    } else {
        dbRef.child("ID_DB").child(id).once('value', function (snapshot) {
            if (snapshot.val() != null) {
                // if id is used
                signUpWarning(glang(23));
                $('#idSignInput').focus();
            } else {
                // Sign Up process
                var error = false;
                // init language settings
                var lang = localStorage.getItem(localStorage.getItem("id") + "lang");
                if (lang == "" || lang == null) {
                    lang = "en";
                }
                const promise = auth.createUserWithEmailAndPassword(email, pw);
                $("#loginLoading").show(500);
                promise.catch(e => {
                    // if email is used
                    signUpWarning(glang(24));
                    $('#emailSignInput').focus();
                    $("#loginLoading").hide(500);
                    error = true;
                }).then(function () {
                    if (!error) {
                        // save info in USERSDB
                        var user = firebase.auth().currentUser;
                        dbRef.child("USERS_DB").child(user.uid).set({
                            level: 1,
                            lang: lang,
                            id: id
                        }).then(function () {
                            // save info in firebase User
                            user.updateProfile({
                                displayName: id,
                                email: email,
                                photoURL: "https://munzii.com/login/src/basic_profile.png"
                            }).then(function () {
                                // save id info
                                dbRef.child("ID_DB").child(id).set(email).then(function(){
                                    dbRef.child("EMAIL_DB").child(email.split('.').join('|')).set(id).then(function(){
                                        location.reload();
                                    });
                                });
                            });
                        });

                    }
                });
                $('#wrongTrySign').height("0px");
            }
        });
    }
});

function signUpWarning(text) {
    $('#wrongTrySign').height("34px");
    $('#wrongTrySign').text(text);
    $('#formSignup').addClass('shake');
    interval = window.setInterval(shake, 2000);
}

// close btn
$("#closeSignup").click(function () {
    $("#form").show();
    $("#formSignup").hide();
    $("#formLogined").hide();
    clearInputs();
});


//----------------------( AuthChanged )----------------------//
var modeParam = getParam('mode');
if(modeParam == 'full'){
    $('#formLogined').addClass('fullscreen');
}

firebase.auth().onAuthStateChanged(firebaseUser => {
    clearInputs();
    if (firebaseUser) {
        //LOGINED
        $("#loginLoading").hide(500);
        user = firebaseUser;

        var forwardLink = getParam('fw');
        var ishome = getParam('hm');
        if (forwardLink != null && forwardLink != "") {
            if(forwardLink == 'main'){
                window.location.replace("https://jshs.munzii.com");
            }else{
                if (ishome == '0') {
                    window.location.replace(forwardLink.split("-").join('/'));
                } else {
                    window.location.replace("https://jshs.munzii.com/" + forwardLink.split("-").join('/'));
                }
            }

        } else {
            $('#accountNick').html(firebaseUser.displayName);
            $('#accountEmail').html(firebaseUser.email);
            $('#accountProfile').attr('src', firebaseUser.photoURL);

            if(!firebaseUser.emailVerified){
                $('#emailVerification').slideDown();
            }

            dbRef.child("USERS_DB").child(user.uid).once('value', function (snp) {
                var dt = snp.val();
                $('#accountId').html(dt.id);
                $('#accountLevel').html(glang('LV' + dt.level));
                setLanguage(dt.lang)
            });
            $("#formSignup").hide();
            $("#form").hide();
            $("#formLogined").show();
        }
    } else {
        //NOT LOGINED
        $("#form").show();
        $("#formSignup").hide();
        $("#formLogined").hide();
    }
});

//----------------------( Logout )----------------------//

$("#logout").click(function () {
    auth.signOut();
    localStorage.clear();
    window.location.href = "https://jshs.munzii.com/login";
});

//----------------------( Profile )----------------------//

document.getElementById('profileUpload').addEventListener('change', function (e) {
    $("#loginLoading").show(500);
    var file = e.target.files[0];


    if (user.email != "") {
        if (user.emailVerified) {
            var storageRef = firebase.storage().ref("user/" + auth.getUid()).child('profile');
            var task = storageRef.put(file);
            task.on('state_changed',
                function progress(snapshot) { },
                function error(err) {
                    alert(glang(25));
                    console.log(err)
                    location.reload();
                },
                function complete(snp) {
                    storageRef.getDownloadURL().then(function (downloadURL) {
                        user.updateProfile({
                            photoURL: downloadURL
                        }).then(function () {
                            // change success
                            location.reload();
                            $("#loginLoading").hide(500);
                        });
                    });
                }
            );
        } else {
            alert(glang(29))
            $("#loginLoading").hide(500);
        }
    } else {
        alert(glang(26));
        $("#loginLoading").hide(500);
    }
});



//----------------------( Email verification )----------------------//
function emailVerification(){
    user = auth.currentUser;
    if(user){
        user.sendEmailVerification();
        $('#emailVerification').hide();
        alert(glang(31))
    }
}



//----------------------( Functions for use )----------------------//

function isEmail(mail) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail);
}

function clearInputs() {
    $("#idSignInput").val("");
    $("#pwSignInput").val("");
    $("#pwcheckSignInput").val("");
    $("#emailSignInput").val("");
    $("#idInput").val("");
    $("#pwInput").val("");
    $('#wrongTrySign').height("0px");
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

function shake() {
    $('#form, #formSignup').removeClass('shake');
    clearInterval(interval);
}