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


var subject = ['전곽일보', '학교생활/학생회', '과학/기술', 'IT/게임', '디자인/뷰티', '자연/동물', '정치/경제/법률', '연예/엔터', '스포츠/건강', '기타']

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
    var newsCnt = 0;
    var newsDB = jshsRef.child('NEWS');

    var updateNews = newsDB.orderByChild('arrange').on('value', function (snapshot) {
        snapshot.forEach((snp) => {
            var dt = snp.val();
            var date = new Date();
            date.setTime(dt.date);
            var dateFormatted = getFormatDate(date, 0);


            if (newsCnt == 0) {
                $('#headCover').attr('src', dt.cover);
                $('#headTitle').html(dt.title);
                $('#headAuthor').html(dt.author);
                $('#headDate').html(dateFormatted);
                $('#headLink').attr('href', 'https://jshs.munzii.com/news/article?id=' + dt.date)
            }
            else if (newsCnt >= 1 && newsCnt <= 3) {
                var htmlItem = returnRecentListHTML(dt.title, dt.author, dateFormatted, dt.cover, 'https://jshs.munzii.com/news/article?id=' + dt.date);
                // if(newsCnt != 3) htmlItem += "<hr>"
                $('#recentList').append(htmlItem);
            }


            var content = dt.desc.replace(/<[^>]*>/g, "");
            content = spliceText(content, 100);
            var htmlItem2 = returnListHTML(dt.title, content, dt.author, dateFormatted, dt.cover, subject[dt.subject], 'https://jshs.munzii.com/news/article?id=' + dt.date);

            $('#newsListSection').append(htmlItem2);

            newsCnt++;
            $('#allContainer').show();
        });
    });
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

function returnListHTML(title, summary, author, date, cover, subject, url) {
    var htmlTemp = `
    <a href="`+ url + `">
    <div class="row">
        <div class="col-sm-4 grid-margin">
            <div class="position-relative">
            <div class="rotate-img">
                <img src="`+ cover + `" class="img-fluid">
            </div>
            <div class="badge-positioned">
                <span class="badge badge-danger font-weight-bold">#`+ subject + `</span>
            </div>
            </div>
        </div>
        <div class="col-sm-8  grid-margin">
            <h2 class="mb-2 font-weight-600">
            `+ title + `
            </h2>
            <div class="fs-13 mb-2">
            <span class="mr-2">`+ author + ` 기자 </span>` + date + `
            </div>
            <p class="mb-0">
            `+ summary + `
            </p>
        </div>
    </div>
    </a>
    `;
    return htmlTemp;
}

function returnRecentListHTML(title, author, date, cover, url) {
    var htmlTemp = `
    <a href="`+ url + `">
    <div class="recentListItem d-flex pt-3 pb-4 align-items-center justify-content-between">
        <div class="pr-3">
            <h5>`+ title + `</h5>
            <div class="fs-12">
            <span class="mr-2">`+ author + ` 기자 </span>` + date + `
            </div>
        </div>
        <div class="rotate-img">
            <img src="`+ cover + `" class="img-fluid img-lg">
        </div>
    </div>
    </a>
    `;
    return htmlTemp;
}

function spliceText(text, length) {
    var returnText = text;
    if (text.length > length) {
        returnText = text.slice(0, length);
        returnText += "...";
    }
    return returnText;
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
