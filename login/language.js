$.lang = {};
//언어 추가할 시에 채팅 새로 만들때에 서버 메세지 추가해주기
$.lang.ko = {
    'LV0': '베타테스터<br><span class="levelDesc"전곽일보에 오신 것을 환영합니다.</span>',
    'LV1': '신규 회원',
    'LV2': '정규 회원',
    'LV3': 'VIP',
    'LV4': '관리자 <a href="https://jshs.munzii.com/admin" class="badge">콘솔로 이동</a>',
    1: '로그인',
    2: '아이디를 입력하세요.',
    3: '아이디',
    4: '비밀번호를 입력하세요.',
    5: '비밀번호',
    6: '아이디 또는 비밀번호가 일치하지 않습니다.',
    7: '아직 전곽일보 회원이 아니신가요?',
    8: '다음',
    9: '회원가입',
    10: '비밀번호 확인',
    11: '닉네임',
    12: '오류가 생겼습니다. 잠시 후에 다시 시도해 주십시오.',
    13: '계정',
    14: '레벨',
    15: '언어',
    16: '프로필',
    17: '로그아웃',
    18: '모든 정보를 입력해 주세요.',
    19: '비밀번호가 일치하지 않습니다.',
    20: '올바른 이메일 주소를 입력해 주세요.',
    21: '비밀번호는 6~100자입니다.',
    22: '닉네임은 2-10자입니다.',
    23: '사용중인 아이디 주소입니다.',
    24: '이미 가입된 이메일입니다.',
    25: '프로필 사진의 크기는 최대 5MB 입니다.\n파일의 크기가 크지 않음에도 오류가 발생한다면 로그아웃 후 다시 로그인해 주세요.',
    26: '로그인 후에 시도해 주세요.',
    27: '이메일',
    28: '아이디는 4~20자입니다.',
    29: '이메일 인증 후에 바꿀 수 있습니다.',
    30: '이메일 인증하기',
    31: '이메일을 전송했습니다. 이메일의 받은 메세지함에서 인증을 완료해 주세요.'
};

$.lang.en = {
    'LV0': 'Beta Tester<br><span class="levelDesc">WELCOME to JNEWS.</span>',
    'LV1': 'New Member',
    'LV2': 'Regular Member',
    'LV3': 'VIP',
    'LV4': 'Admin <a href="https://jshs.munzii.com/admin" class="badge">Go to console</a>',
    1: 'Login',
    2: 'Input your ID',
    3: 'ID',
    4: 'Input your Password',
    5: 'Password',
    6: "Your ID or Password doesn't match.",
    7: 'New to JNews?',
    8: 'Continue',
    9: 'Sign Up',
    10: 'Password Check',
    11: 'Nick',
    12: 'An error occured. Please try later.',
    13: 'Account',
    14: 'Level',
    15: 'Language',
    16: 'Profile',
    17: 'Logout',
    18: 'Input all information.',
    19: "Password doesn't match",
    20: 'Please input a verifiable email.',
    21: 'Passwords are allowed to be 6~100 letters.',
    22: 'Nicknames are allowed to be 2~10 letters.',
    23: 'ID is already used.',
    24: 'Email is already used.',
    25: 'Profile picture should be less than 5mb.\nPlease login again if this occurs even though the picture is appropriate.',
    26: 'Retry after login.',
    27: 'Email',
    28: 'ID is allowed to be 4~20 letters.',
    29: 'Verify your email to use this feature.',
    30: 'Verify your email',
    31: 'Please check your email inbox to verify this account.'
};

/**
* setLanguage 
* use $.lang[currentLanguage][languageNumber]
*/
var nowLang;
var saveLang = localStorage.getItem(localStorage.getItem("id") + "lang");

if (saveLang != "" && saveLang != null) {
    setLanguage(saveLang);
} else {
    setLanguage("en");
}
function setLanguage(currentLanguage) {
    $(".language").removeClass("languageSelect");
    $("." + currentLanguage).addClass("languageSelect");

    nowLang = currentLanguage;
    $('[data-langNum]').each(function () {
        var $this = $(this);
        if ($(this).hasClass("ph")) {
            document.getElementById(this.id).placeholder = $.lang[currentLanguage][$this.data('langnum')];
        } else {
            $this.html($.lang[currentLanguage][$this.data('langnum')]);
        }
    });

    var user = firebase.auth().currentUser
    if(user != null){
        dbRef.child('USERS_DB').child(user.email.split('.').join('|')).child('lang').set(currentLanguage);
    }
}
function glang(langnum) {
    var getty = $.lang[nowLang][langnum];
    return getty;
}
// 언어 변경
$('.language').click(function () {
    var lang = $(this).data('lang');

    localStorage.setItem(localStorage.getItem("id") + "lang", lang);
    nowLang = lang;
    setLanguage(lang);
    var id = localStorage.getItem("id");
    if (id != "" && id != null) {
        dbRef.child(id + "/lang").set(lang);
    }
    history.go(0);

});