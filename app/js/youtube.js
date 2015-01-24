var apiKey = 'AIzaSyCE189cfev_E-nJQze9Cpu6lmGI2pkwb38',
  videoTemplate = null,
  $container = null,
  embedUrl = 'http://www.youtube.com/embed/{videoId}',
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

Date.prototype.timeSinceNow = function () {
    var seconds = Math.floor((new Date() - this) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

function load(playlistId, container) {
    gapi.client.setApiKey(apiKey);
    gapi.client.load('youtube', 'v3', function () {
        videoTemplate = $('#tmplVideoItem').html();
        $container = $('#' + container);
        var playlistRequest = {
            playlistId: playlistId,
            part: 'snippet',
            maxResults: 50
        };

        var playlistQuery = gapi.client.youtube.playlistItems.list(playlistRequest);
        playlistQuery.execute(function (response) {
            $container.html('');
            var videoIds = [];
            for (var item in response.items) {
                videoIds.push(response.items[item].snippet.resourceId.videoId);
            }

            if (videoIds.length > 0) {
                var videoDetailsRequest = {
                    part: 'snippet,statistics',
                    id: videoIds.join(',')
                }

                var videosQuery = gapi.client.youtube.videos.list(videoDetailsRequest);
                videosQuery.execute(function (response) {
                    for (item in response.items) {
                        item = response.items[item];
                        $container.append(videoTemplate.replace(/{videoSrc}/g, embedUrl.replace('{videoId}', item.id))
                          .replace(/{title}/g, item.snippet.title)
                          .replace(/{channelTitle}/g, item.snippet.channelTitle)
                          .replace(/{publishedAt}/g, (new Date(item.snippet.publishedAt)).timeSinceNow())
                          .replace(/{viewCount}/g, item.statistics.viewCount));
                    }
                });
            }
            else {
                $container.append("no videos currently at this time");
            }
        });
    });
}
