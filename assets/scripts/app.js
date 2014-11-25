// populates select options by pulling list names
var data;

// Limited Run Api call

var populateProducts = function() {
  $.getJSON('http://anyorigin.com/dev/get?url=http%3A//bricklanerecords.limitedrun.com/e1/categories/iska-dhaaf/products.json&callback=?', function(data){
    data = data.contents;
    var storeUrl = "http://bricklanerecords.limitedrun.com";
    var productName, productImg, productUrl;
    for (var i = 0; i < data.products.length; i ++) {
      productName = data.products[i].name;
      productUrl = storeUrl + data.products[i].url;
      productImg = data.products[i].images[0].v300;
      $(".albums").append(
        "<li>" + 
          "<img src=" + productImg + ">" +
          "<h3>" + productName + "</h3>" +
          "<a href=" + productUrl + ">Buy</a>" +
        "</li>");
    }
  });
};



window.fbAsyncInit = function() {
  FB.init({
    appId      : '364098737081685',
    xfbml      : true,
    version    : 'v2.1'
  });

  FB.api('/297011833657627/feed?access_token=364098737081685|5HVcEhU-v7k3DmBM-O50hFvynj8', 'get', function(response) {
    if (!response || response.error) {
      console.log(response.error);
    } else {
      console.log(response.data);

        for (var i =0; i < 5; i++) {
          $('#wall').append( "<li>" + response.data[i].message + "</li>");
        };
    }
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));



$(document).ready(function(){
  // nav toggle
  $('.main-nav-toggle').on('click', function() {
    $('body').toggleClass('main-nav-active');
  });
  // add body class if hero exists
  if ($('.hero').length) {
    $('body').addClass('has-hero');
  }
});
/*********************************************************************
*  #### Twitter Post Fetcher v12.0 ####
*  Coded by Jason Mayes 2013. A present to all the developers out there.
*  www.jasonmayes.com
*  Please keep this disclaimer with my code if you use it. Thanks. :-)
*  Got feedback or questions, ask here:
*  http://www.jasonmayes.com/projects/twitterApi/
*  Github: https://github.com/jasonmayes/Twitter-Post-Fetcher
*  Updates will be posted to this site.
*********************************************************************/
var twitterFetcher = function() {
  var domNode = '';
  var maxTweets = 20;
  var parseLinks = true;
  var queue = [];
  var inProgress = false;
  var printTime = true;
  var printUser = true;
  var formatterFunction = null;
  var supportsClassName = true;
  var showRts = true;
  var customCallbackFunction = null;
  var showInteractionLinks = true;
  var showImages = false;
  var lang = 'en';

  function handleTweets(tweets){
    if (customCallbackFunction === null) {
      var x = tweets.length;
      var n = 0;
      var element = document.getElementById(domNode);
      var html = '<ul>';
      while(n < x) {
        html += '<li>' + tweets[n] + '</li>';
        n++;
      }
      html += '</ul>';
      element.innerHTML = html;
    } else {
      customCallbackFunction(tweets);
    }
  }

  function strip(data) {
    return data.replace(/<b[^>]*>(.*?)<\/b>/gi, function(a,s){return s;})
        .replace(/class=".*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi,
        '');
  }

  function getElementsByClassName (node, classname) {
    var a = [];
    var regex = new RegExp('(^| )' + classname + '( |$)');
    var elems = node.getElementsByTagName('*');
    for (var i = 0, j = elems.length; i < j; i++) {
        if(regex.test(elems[i].className)){
          a.push(elems[i]);
        }
    }
    return a;
  }

  function extractImageUrl(image_data) {
    if (image_data !== undefined) {
      var data_src = image_data.innerHTML.match(/data-srcset="([A-z0-9%_\.-]+)/i)[0];
      return decodeURIComponent(data_src).split('"')[1];
    }
  }

  return {
    fetch: function(config) {
      if (config.maxTweets === undefined) {
        config.maxTweets = 20;
      }
      if (config.enableLinks === undefined) {
        config.enableLinks = true;
      }
      if (config.showUser === undefined) {
        config.showUser = true;
      }
      if (config.showTime === undefined) {
        config.showTime = true;
      }
      if (config.dateFunction === undefined) {
        config.dateFunction = 'default';
      }
      if (config.showRetweet === undefined) {
        config.showRetweet = true;
      }
      if (config.customCallback === undefined) {
        config.customCallback = null;
      }
      if (config.showInteraction === undefined) {
        config.showInteraction = true;
      }
      if (config.showImages === undefined) {
        config.showImages = false;
      }

      if (inProgress) {
        queue.push(config);
      } else {
        inProgress = true;

        domNode = config.domId;
        maxTweets = config.maxTweets;
        parseLinks = config.enableLinks;
        printUser = config.showUser;
        printTime = config.showTime;
        showRts = config.showRetweet;
        formatterFunction = config.dateFunction;
        customCallbackFunction = config.customCallback;
        showInteractionLinks = config.showInteraction;
        showImages = config.showImages;

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//cdn.syndication.twimg.com/widgets/timelines/' +
            config.id + '?&lang=' + (config.lang || lang) + '&callback=twitterFetcher.callback&' +
            'suppress_response_codes=true&rnd=' + Math.random();
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    },

    callback: function(data) {
      var div = document.createElement('div');
      div.innerHTML = data.body;
      if (typeof(div.getElementsByClassName) === 'undefined') {
         supportsClassName = false;
      }

      var tweets = [];
      var names = [];
      var handles = [];
      var urls = [];
      var times = [];
      var images = [];
      var rts = [];
      var tids = [];
      var x = 0;

      if (supportsClassName) {
        var tmp = div.getElementsByClassName('tweet');
        while (x < tmp.length) {
          if (tmp[x].getElementsByClassName('retweet-credit').length > 0) {
            rts.push(true);
          } else {
            rts.push(false);
          }
          if (!rts[x] || rts[x] && showRts) {
            tweets.push(tmp[x].getElementsByClassName('e-entry-title')[0]);
            tids.push(tmp[x].getAttribute('data-tweet-id'));
            names.push(tmp[x].getElementsByClassName('full-name')[0]);
            handles.push(tmp[x].getElementsByClassName('p-nickname')[0]);
            urls.push(getElementsByClassName(tmp[x], 'profile')[0]);
            times.push(tmp[x].getElementsByClassName('dt-updated')[0]);
            if (tmp[x].getElementsByClassName('inline-media')[0] !== undefined) {
              images.push(tmp[x].getElementsByClassName('inline-media')[0]);
            } else {
              images.push(undefined);
            }
          }
          x++;
        }
      } else {
        var tmp = getElementsByClassName(div, 'tweet');
        while (x < tmp.length) {
          tweets.push(getElementsByClassName(tmp[x], 'e-entry-title')[0]);
          tids.push(tmp[x].getAttribute('data-tweet-id'));
          names.push(getElementsByClassName(tmp[x], 'full-name')[0]);
          handles.push(getElementsByClassName(tmp[x], 'p-nickname')[0]);
          urls.push(getElementsByClassName(tmp[x], 'profile')[0]);
          times.push(getElementsByClassName(tmp[x], 'dt-updated')[0]);
          if (getElementsByClassName(tmp[x], 'inline-media')[0] !== undefined) {
            images.push(getElementsByClassName(tmp[x], 'inline-media')[0]);
          } else {
            images.push(undefined);
          }

          if (getElementsByClassName(tmp[x], 'retweet-credit').length > 0) {
            rts.push(true);
          } else {
            rts.push(false);
          }
          x++;
        }
      }

      if (tweets.length > maxTweets) {
        tweets.splice(maxTweets, (tweets.length - maxTweets));
        names.splice(maxTweets, (names.length - maxTweets));
        handles.splice(maxTweets, (handles.length - maxTweets));
        urls.splice(maxTweets, (urls.length - maxTweets)).href;
        times.splice(maxTweets, (times.length - maxTweets));
        rts.splice(maxTweets, (rts.length - maxTweets));
        images.splice(maxTweets, (images.length - maxTweets));
      }

      console.log(urls[0]);

      var arrayTweets = [];
      var x = tweets.length;
      var n = 0;
      while(n < x) {
        if (typeof(formatterFunction) !== 'string') {
          var newDate = new Date(times[n].getAttribute('datetime')
              .replace(/-/g,'/').replace('T', ' ').split('+')[0]);
          var dateString = formatterFunction(newDate);
          times[n].setAttribute('aria-label', dateString);

          if (tweets[n].innerText) {
            // IE hack.
            if (supportsClassName) {
              times[n].innerText = dateString;
            } else {
              var h = document.createElement('p');
              var t = document.createTextNode(dateString);
              h.appendChild(t);
              h.setAttribute('aria-label', dateString);
              times[n] = h;
            }
          } else {
            times[n].textContent = dateString;
          }
        }
        var op = '';
        if (parseLinks) {
          if (printUser) {
            op += '<div class="user"><span class="full-name">' + strip(names[n].innerHTML) + '</span><a href='+ urls[n].getAttribute('href') +' target="_blank">' + strip(handles[n].innerHTML) +
                '</a></div>';
          }
          op += '<p class="tweet">' + strip(tweets[n].innerHTML) + '</p>';
          if (printTime) {
            op += '<p class="timePosted">' +
                times[n].getAttribute('aria-label') + '</p>';
          }
        } else {
          if (tweets[n].innerText) {
            if (printUser) {
              op += '<strong class="user">' + names[n].innerText + '</strong>';
            }
            op += '<p class="tweet">' +  tweets[n].innerText + '</p>';
            if (printTime) {
              op += '<p class="timePosted">' + times[n].innerText + '</p>';
            }

          } else {
            if (printUser) {
              op += '<strong class="user">' + names[n].textContent + '</strong>';
            }
            op += '<p class="tweet">' +  tweets[n].textContent + '</p>';
            if (printTime) {
              op += '<p class="timePosted">' + times[n].textContent + '</p>';
            }
          }
        }
        if (showInteractionLinks) {
          op += '<p class="interact"><a href="https://twitter.com/intent/' +
              'tweet?in_reply_to=' + tids[n] + '" class="twitter_reply_icon">' +
              'Reply</a><a href="https://twitter.com/intent/retweet?tweet_id=' +
              tids[n] + '" class="twitter_retweet_icon">Retweet</a>' +
              '<a href="https://twitter.com/intent/favorite?tweet_id=' +
              tids[n] + '" class="twitter_fav_icon">Favorite</a></p>';
        }

        if (showImages && images[n] !== undefined) {
          op += '<div class="media">' +
              '<img src="' + extractImageUrl(images[n]) + '" alt="Image from tweet" />' +
              '</div>';
        }

        arrayTweets.push(op);
        n++;
      }
      handleTweets(arrayTweets);
      inProgress = false;

      if (queue.length > 0) {
        twitterFetcher.fetch(queue[0]);
        queue.splice(0,1);
      }
    }
  }
}();

$(function(){
    var htmlString  = '<ul id="videoslisting">';
    var ytapiurl    = 'http://gdata.youtube.com/feeds/api/users/UC47KabRQUTCDIFRnvYcTi3A/uploads?alt=json&max-results=10';
  
    $.getJSON(ytapiurl, function(data) {
      $.each(data.feed.entry, function(i, item) {                                
        var title    = item['title']['$t'];
        var videoid  = item['id']['$t'];
        var video  = videoid.substr(videoid.lastIndexOf('/') + 1);
      
        var pubdate  = item['published']['$t'];
        var fulldate = new Date(pubdate).toLocaleDateString();
      
        var thumbimg = item['media$group']['media$thumbnail'][0]['url'];
        var tinyimg1 = item['media$group']['media$thumbnail'][1]['url'];
        var tinyimg2 = item['media$group']['media$thumbnail'][2]['url'];
        var tinyimg3 = item['media$group']['media$thumbnail'][3]['url'];
      
        var vlink    = item['media$group']['media$content'][0]['url'];
        var ytlink   = item['media$group']['media$player'][0]['url'];
        var numviews = item['yt$statistics']['viewCount'];
        var numcomms = item['gd$comments']['gd$feedLink']['countHint'];

        console.log(video);
      
        htmlString +='<li class="clearfix"><h2>' + title + '</h2>';
        htmlString +='<iframe width="560" height="315" src="//www.youtube.com/embed/' + video +'?list=UU47KabRQUTCDIFRnvYcTi3A" frameborder="0" allowfullscreen></iframe>';
        // htmlString +='<div class="videothumb"><a href="' + ytlink + '" target="_blank"><img src="' + thumbimg + '" width="480" height="360"></a></div>';
        // htmlString +='<div class="meta"><p>Published on <strong>' + fulldate + '</strong></p><p>Total views: <strong>' + commafy(numviews) + '</strong></p><p>Total comments: <strong>'+ numcomms +'</strong></p><p><a href="'+ ytlink +'" class="external" target="_blank">View on YouTube</a></p><p><a href="'+ vlink +'" class="external" target="_blank">View in Fullscreen</a></p><p><strong>Alternate Thumbnails</strong>:<br><img src="'+ tinyimg1 +'"> <img src="' + tinyimg2 + '"> <img src="'+ tinyimg3 +'"></p></div></li>';
      }); // end each loop
    
      $('#videos').html(htmlString + "</ul>");
    }); // end json parsing
  
  // commafy function source
  // http://stackoverflow.com/a/6785438/477958
  function commafy( arg ) {
   arg += '';
   var num = arg.split('.'); 
   if (typeof num[0] !== 'undefined'){
      var int = num[0];
      if (int.length > 3){
         int     = int.split('').reverse().join('');
         int     = int.replace(/(\d{3})/g, "$1,");
         int     = int.split('').reverse().join('')
      }
   }
   if (typeof num[1] !== 'undefined'){
      var dec = num[1];
      if (dec.length > 4){
         dec     = dec.replace(/(\d{3})/g, "$1 ");
      }
   }

   return (typeof num[0] !== 'undefined'?int:'') 
        + (typeof num[1] !== 'undefined'?'.'+dec:'');
  }
});
