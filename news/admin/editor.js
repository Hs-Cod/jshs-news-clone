
var quill = new Quill('#editor-container', {
    modules: {
      syntax: true,
      toolbar: '#toolbar-container'
    },
    placeholder: '내용을 작성하세요.',
    theme: 'snow'
  });

function addEmbedYoutube(){
    var url = prompt('Youtube URL을 입력해 주세요.')
    if(url != ''){
        var youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

        if(url.match(youtubeRegex)){
            var vid = youtube_parser(url);
            if(vid != false){
                quill.clipboard.dangerouslyPasteHTML(9999, `<br><div><iframe width="560" height="315" src="https://www.youtube.com/embed/`+vid+`" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><br>`);

            }else{
                alert('올바른 링크가 아닙니다.')
            }
        }else{
            alert('올바른 링크가 아닙니다.')
        }
    }
}
function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}


// function imageHandler(image, callback) {
//     var file = image;
//     var dt = new Date();
//     var dtid = dt.getTime().toString();

//     //Get file and upload to firebas storage
//     var storageRef = firebase.storage().ref("news/" + auth.getUid()).child(dtid);
//     var task = storageRef.put(file);
//     task.on('state_changed',
//         function progress(snapshot) { },
//         function error(err) {
//             //Check error when over 10MB
//             alert('10MB 이하의 파일만 첨부할 수 있습니다.');
//             $('html').css({ 'filter': 'blur(0px)', 'pointer-events': 'initial' });
//         },
//         function complete(snp) {
//             storageRef.getDownloadURL().then(function (downloadURL) {
//                 callback(downloadURL);
//             });
//         }
//     );
// }