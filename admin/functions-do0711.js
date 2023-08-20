// Your web app's Firebase configuration
var config_jshsnews = {
  apiKey: "AIzaSyBFOeMptZokqs9sv6s2opCPuJAb3rLVbtI",
  authDomain: "jshs-news.firebaseapp.com",
  projectId: "jshs-news",
  storageBucket: "jshs-news.appspot.com",
  messagingSenderId: "350427065203",
  appId: "1:350427065203:web:c24368db10667532fd7306",
};
// Initialize Firebase
firebase.initializeApp(config_jshsnews);

const auth = firebase.auth();
var jnewsDB = firebase.database();
const jshsDoc = firebase.firestore();
const jshsRef = jnewsDB.ref("MAIN");

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    //초기화 작업
    try {
      var noticeDoc = jshsDoc.doc("jshs/SETTINGS/PAGE/Notice");
      noticeDoc.get().then((doc) => {
        if (doc.exists) {
          var data = doc.data();
          var noticeCnt = 1;
          [data.chn1, data.chn2, data.chn3, data.chn4, data.chn5].forEach(
            (noti) => {
              var content, url;
              try {
                content = noti.content;
                url = noti.url;
              } catch (e) {}

              if (content != null && content != "") {
                // Add notice to array
                $("#noticeDesc" + noticeCnt).val(content);
                $("#noticeLink" + noticeCnt).val(url);
              }
              noticeCnt++;
            }
          );
        }
      });
    } catch (e) {}
    try {
      var emergencyDoc = jshsDoc.doc("jshs/SETTINGS/PAGE/EmergencyAd");
      emergencyDoc.get().then((doc) => {
        if (doc.exists) {
          var dt = doc.data();
          var content = dt.content;
          var url = dt.url;
          if (content != null && content != "") {
            $("#emergencyLink").val(url);
            $("#emergencyDesc").val(content);
          }
        }
      });
    } catch (e) {}
    try {
      var eventDoc = jshsDoc.doc("jshs/SETTINGS/PAGE/Event");
      eventDoc.get().then((doc) => {
        if (doc.exists) {
          var ev = doc.data();
          var evCnt = 1;
          [ev.e1, ev.e2, ev.e3, ev.e4, ev.e5].forEach((evTmp) => {
            try {
              var titleE = evTmp.title;
              var descE = evTmp.desc;
              var btnE = evTmp.btn;
              var linkE = evTmp.link;
              var modeE = evTmp.mode;
              var mediaE = evTmp.media;

              $("#eventTitle" + evCnt).val(titleE);
              $("#eventDesc" + evCnt).val(descE);
              $("#eventBtn" + evCnt).val(btnE);
              $("#eventLink" + evCnt).val(linkE);
              $("#eventMode" + evCnt).val(modeE);
              $("#eventMedia" + evCnt).val(mediaE);
            } catch (e) {}

            evCnt++;
          });
        }
      });
    } catch (e) {}
    try {
      jshsRef.child("poem/INFO").once("value", (snp) => {
        var vltmp = snp.val();
        $("#poemDesc1").val(vltmp.p1);
        $("#poemDesc2").val(vltmp.p2);
        $("#poemDesc3").val(vltmp.p3);
      });
    } catch (e) {}
    try {
      var adDoc = jshsDoc.doc("jshs/SETTINGS/PAGE/Ad");
      adDoc.get().then((doc) => {
        if (doc.exists) {
          // ad -- img, bgc, link
          var adData = doc.data();
          if (adData.img != "" && adData.img != null) {
            $("#adImgDesc").val(adData.img);
            $("#adBgcDesc").val(adData.bgc);
            $("#adLinkDesc").val(adData.link);
          }
        }
      });
    } catch (e) {}
    try {
      var videoDoc = jshsDoc.doc("jshs/SETTINGS/PAGE/Video");
      videoDoc.get().then((doc) => {
        if (doc.exists) {
          var vdData = doc.data();
          if (vdData.content != "" && vdData.content != null) {
            $("#videoLink").val(vdData.content);
            $("#videoTitle").val(vdData.title);
          }
        }
      });
    } catch (e) {}

    var AUTH_CHECK = [
      "Ad",
      "EmergencyAd",
      "Event",
      "Market",
      "Notice",
      "Poem",
      "Video",
    ];
    AUTH_CHECK.forEach((AUTH_CHECK_DOMAIN) => {
      var adminDoc = jshsDoc.doc(
        "jshs/ADMIN_AUTH/" + AUTH_CHECK_DOMAIN + "/" + auth.getUid()
      );
      adminDoc.get().then((doc) => {
        if (doc.exists) {
          var vdData = doc.data();
          if (vdData.uid == auth.getUid()) {
            $("#" + AUTH_CHECK_DOMAIN + "Container").show();
          }
        }
      });
    });
  } else {
    $(".widgets").hide();
    window.location.href = "https://jshs.munzii.com/login?fw=admin";
  }
});

function saveEvent() {
  var eventDoc = jshsDoc.doc("jshs/SETTINGS/PAGE/Event");
  var eventTitle = [5],
    eventDesc = [5],
    eventBtn = [5],
    eventLink = [5],
    eventMode = [5],
    eventMedia = [5];
  for (var i = 0; i < 5; i++) {
    eventTitle[i] = $("#eventTitle" + (i + 1)).val();
    eventDesc[i] = $("#eventDesc" + (i + 1)).val();
    eventBtn[i] = $("#eventBtn" + (i + 1)).val();
    eventLink[i] = $("#eventLink" + (i + 1)).val();
    eventMode[i] = $("#eventMode" + (i + 1)).val();
    eventMedia[i] = $("#eventMedia" + (i + 1)).val();
  }

  eventDoc
    .set({
      e1: {
        title: eventTitle[0],
        desc: eventDesc[0],
        btn: eventBtn[0],
        link: eventLink[0],
        mode: eventMode[0],
        media: eventMedia[0],
      },
      e2: {
        title: eventTitle[1],
        desc: eventDesc[1],
        btn: eventBtn[1],
        link: eventLink[1],
        mode: eventMode[1],
        media: eventMedia[1],
      },
      e3: {
        title: eventTitle[2],
        desc: eventDesc[2],
        btn: eventBtn[2],
        link: eventLink[2],
        mode: eventMode[2],
        media: eventMedia[2],
      },
      e4: {
        title: eventTitle[3],
        desc: eventDesc[3],
        btn: eventBtn[3],
        link: eventLink[3],
        mode: eventMode[3],
        media: eventMedia[3],
      },
      e5: {
        title: eventTitle[4],
        desc: eventDesc[4],
        btn: eventBtn[4],
        link: eventLink[4],
        mode: eventMode[4],
        media: eventMedia[4],
      },
    })
    .then(() => {
      alert("완료되었습니다.");
    });
}

function saveNotice() {
  var noticeDoc = jshsDoc.doc("jshs/SETTINGS/PAGE/Notice");
  var noticeDesc = [5],
    noticeUrl = [5];
  for (var i = 0; i < 5; i++) {
    noticeDesc[i] = $("#noticeDesc" + (i + 1)).val();
    noticeUrl[i] = $("#noticeLink" + (i + 1)).val();
  }

  noticeDoc.set({
    chn1: { content: noticeDesc[0], url: noticeUrl[0] },
    chn2: { content: noticeDesc[1], url: noticeUrl[1] },
    chn3: { content: noticeDesc[2], url: noticeUrl[2] },
    chn4: { content: noticeDesc[3], url: noticeUrl[3] },
    chn5: { content: noticeDesc[4], url: noticeUrl[4] },
  });
}

function saveEmergency() {
  var emergencyDoc = jshsDoc.doc("jshs/SETTINGS/PAGE/EmergencyAd");
  var desc = $("#emergencyDesc").val();
  var url = $("#emergencyLink").val();

  var c = !(desc == "" || url == "");
  if (!c) {
    c = confirm("빈칸이 있습니다. 계속하시겠습니까?");
  }
  if (c) {
    emergencyDoc
      .set({
        content: desc,
        url: url,
      })
      .then(() => {
        alert("완료되었습니다.");
      });
  }
}

function savePoem() {
  var p1 = $("#poemDesc1").val();
  var p2 = $("#poemDesc2").val();
  var p3 = $("#poemDesc3").val();
  if (p1 == "" || p2 == "" || p3 == "") {
    alert("빈칸이 있으면 안됩니다.");
  } else {
    var dttemp = new Date();
    jshsRef
      .child("poem/INFO")
      .set({
        p1: p1,
        p2: p2,
        p3: p3,
        id: dttemp.getTime(),
      })
      .then(() => {
        jshsRef
          .child("poem/TAG/" + dttemp.getTime())
          .set(p1 + p2 + p3)
          .then(() => {
            alert("완료되었습니다.");
          });
      });
  }
}

function saveAd() {
  var adDoc = jshsDoc.doc("jshs/SETTINGS/PAGE/Ad");

  var img = $("#adImgDesc").val();
  var bgc = $("#adBgcDesc").val();
  var link = $("#adLinkDesc").val();

  if (img == "" || bgc == "" || link == "") {
    alert("빈칸이 있으면 안됩니다.");
  } else {
    adDoc
      .set({
        img: img,
        bgc: bgc,
        link: link,
      })
      .then(() => {
        alert("완료되었습니다.");
      });
  }
}

function saveVideo() {
  var videoDoc = jshsDoc.doc("jshs/SETTINGS/PAGE/Video");

  var link = $("#videoLink").val();
  var title = $("#videoTitle").val();

  if (link == "" || title == "") {
    alert("빈칸이 있으면 안됩니다.");
  } else {
    videoDoc
      .set({
        content: link,
        title: title,
      })
      .then(() => {
        alert("완료되었습니다.");
      });
  }
}

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
