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