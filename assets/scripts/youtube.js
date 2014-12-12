
// $(function(){
//     var htmlString  = '<ul id="videoslisting" class="split-2">';
    
//     // var ytapiurl    = 'http://gdata.youtube.com/feeds/api/users/UC47KabRQUTCDIFRnvYcTi3A/uploads?alt=json&max-results=10';
//     // var ytapiurl    = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PLd9HIwJD5brDyO3_kNz_AOtBoQu4VSSkf&key=AIzaSyCE189cfev_E-nJQze9Cpu6lmGI2pkwb38'

//     $.getJSON("https://www.googleapis.com/youtube/v3/playlistItems", {
          
          
//           playlistId: "PLd9HIwJD5brDyO3_kNz_AOtBoQu4VSSkf",
//           part: "snippet,status,contentDetails",
//           key: "AIzaSyCE189cfev_E-nJQze9Cpu6lmGI2pkwb38"
//         },  function(data) {
//           // console.log(data)
//           $.each(data.items, function(i, item) {
//             var info     = item.snippet,
//                 videoId  = info.resourceId['videoId'],
//                   title  = info['title'];

//             $.getJSON("https://www.googleapis.com/youtube/v3/videos", {
//               id: videoId,
//               part: "snippet",
//               key: "AIzaSyCE189cfev_E-nJQze9Cpu6lmGI2pkwb38"
//             }, function(data) {
//               console.log(data);
//               author = data.items[0].snippet.channelTitle;
//             });
//             htmlString +='<li><div class="video-responsive">';
//             htmlString +='<iframe width="560" height="315" src="//www.youtube.com/embed/' + videoId + '?&showinfo=0" frameborder="0" allowfullscreen></iframe></div>';
//             htmlString +='<a href="#" target="_blank">' + title + '</a>';
//             htmlString +='<div class="meta"><p>by <a href="#">' + author + ' </a> - date - numviews views</p></li>'
//           });
//           $('#videos').html(htmlString + "</ul>");
//         });
  
//     // $.getJSON(ytapiurl, function(data) {
//     //   $.each(data.feed.entry, function(i, item) {                                
//     //     var title    = item['title']['$t'];
//         // var videoid  = item['id']['$t'];
//         // var video  = videoid.substr(videoid.lastIndexOf('/') + 1);
      
//         // var pubdate  = item['published']['$t'];
//         // var fulldate = new Date(pubdate).toLocaleDateString();
      
//         // var thumbimg = item['media$group']['media$thumbnail'][0]['url'];
//         // var tinyimg1 = item['media$group']['media$thumbnail'][1]['url'];
//         // var tinyimg2 = item['media$group']['media$thumbnail'][2]['url'];
//         // var tinyimg3 = item['media$group']['media$thumbnail'][3]['url'];
      
//         // var vlink    = item['media$group']['media$content'][0]['url'];
//         // var ytlink   = item['media$group']['media$player'][0]['url'];
//         // var numviews = item['yt$statistics']['viewCount'];
//         // var numcomms = item['gd$comments']['gd$feedLink']['countHint'];

//         // console.log(video);
      
//         // htmlString +='<li><div class="video-responsive">';
//         // htmlString +='<iframe width="560" height="315" src="//www.youtube.com/embed/' + video + '?list=PLd9HIwJD5brDyO3_kNz_AOtBoQu4VSSkf" frameborder="0" allowfullscreen></iframe></div>';
//         // htmlString +='<a href="' + ytlink + '" target="_blank">' + title + '</a>';
//         // htmlString +='<div class="meta"><p>by <a href="#">Artist Name</a> - ' + fulldate + ' - ' + commafy(numviews) + ' views</p></li>'
//         // htmlString +='<div class="videothumb"><a href="' + ytlink + '" target="_blank"><img src="' + thumbimg + '" width="480" height="360"></a></div>';
//         // htmlString +='<div class="meta"><p>Published on <strong>' + fulldate + '</strong></p><p>Total views: <strong>' + commafy(numviews) + '</strong></p><p>Total comments: <strong>'+ numcomms +'</strong></p><p><a href="'+ ytlink +'" class="external" target="_blank">View on YouTube</a></p><p><a href="'+ vlink +'" class="external" target="_blank">View in Fullscreen</a></p><p><strong>Alternate Thumbnails</strong>:<br><img src="'+ tinyimg1 +'"> <img src="' + tinyimg2 + '"> <img src="'+ tinyimg3 +'"></p></div></li>';
//       // }); // end each loop
    
//       // $('#videos').html(htmlString + "</ul>");
//     // }); // end json parsing
  
//   // commafy function source
//   // http://stackoverflow.com/a/6785438/477958
//   // function commafy( arg ) {
//   //  arg += '';
//   //  var num = arg.split('.'); 
//   //  if (typeof num[0] !== 'undefined'){
//   //     var int = num[0];
//   //     if (int.length > 3){
//   //        int     = int.split('').reverse().join('');
//   //        int     = int.replace(/(\d{3})/g, "$1,");
//   //        int     = int.split('').reverse().join('')
//   //     }
//   //  }
//   //  if (typeof num[1] !== 'undefined'){
//   //     var dec = num[1];
//   //     if (dec.length > 4){
//   //        dec     = dec.replace(/(\d{3})/g, "$1 ");
//   //     }
//   //  }

//   //  return (typeof num[0] !== 'undefined'?int:'') 
//   //       + (typeof num[1] !== 'undefined'?'.'+dec:'');
//   // }
// });

var apiKey = 'AIzaSyCE189cfev_E-nJQze9Cpu6lmGI2pkwb38',
  videoTemplate = null,
  $container = null,
  embedUrl = 'http://www.youtube.com/embed/{videoId}',
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

Date.prototype.format=function(){
  return this.getDate() + "-" + months[this.getMonth()] + "-" + this.getFullYear();
}

function load() {
  gapi.client.setApiKey(apiKey);
  gapi.client.load('youtube', 'v3', function() {
    videoTemplate = $('#tmplVideoItem').html();
    $container = $('#divPlaylistContainer');
    var playlistRequest = {
    playlistId: 'PLd9HIwJD5brDyO3_kNz_AOtBoQu4VSSkf',
    part: 'snippet',
    maxResults: 4
  };
  
  var playlistQuery = gapi.client.youtube.playlistItems.list(playlistRequest);
  playlistQuery.execute(function(response) {
    $container.html('');
    var videoIds =[];
        for(var item in response.items) {
          videoIds.push(response.items[item].snippet.resourceId.videoId);
        }

        if(videoIds.length > 0){
            var videoDetailsRequest = {
              part:'snippet,statistics',
              id:videoIds.join(',')
            }

            var videosQuery = gapi.client.youtube.videos.list(videoDetailsRequest);
            videosQuery.execute(function(response) {
              for(item in response.items) {
                item = response.items[item];
                $container.append(videoTemplate.replace(/{videoSrc}/g, embedUrl.replace('{videoId}', item.id))
                  .replace(/{title}/g,item.snippet.title)
                  .replace(/{channelTitle}/g, item.snippet.channelTitle)
                  .replace(/{publishedAt}/g, (new Date(item.snippet.publishedAt)).format())
                  .replace(/{viewCount}/g, item.statistics.viewCount));
              }
            });
        }
      });
  });
}