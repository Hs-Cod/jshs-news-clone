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
const jshsDoc = jnews.firestore();


$(window).load(() => {
    //Animation on Scroll
    AOS.init();

    $.get('https://www.cloudflare.com/cdn-cgi/trace', function (data) {
        var userIP = data.split('ip=')[1].split('\n')[0];

        var dt = new Date();
        var urlHistory = jshsDoc.doc('jshs/HISTORY/URL/TIMETRAVEL');

        var linkData = {};
        linkData[dt.getTime()] = userIP;

        urlHistory.get().then((doc) => {
            if (doc.exists) {
                urlHistory.update(linkData);
            } else {
                urlHistory.set(linkData);
            }
        })
    });
});