// // populates select options by pulling list names
// var data;

// // Limited Run Api call

// var populateProducts = function() {
//   $.getJSON('http://anyorigin.com/dev/get?url=http%3A//bricklanerecords.limitedrun.com/e1/categories/iska-dhaaf/products.json&callback=?', function(data){
//     data = data.contents;
//     var storeUrl = "http://bricklanerecords.limitedrun.com";
//     var productName, productImg, productUrl;
//     for (var i = 0; i < data.products.length; i ++) {
//       productName = data.products[i].name;
//       productUrl = storeUrl + data.products[i].url;
//       productImg = data.products[i].images[0].v300;
//       $(".albums").append(
//         "<li>" + 
//           "<img src=" + productImg + ">" +
//           "<h3>" + productName + "</h3>" +
//           "<a href=" + productUrl + ">Buy</a>" +
//         "</li>");
//     }
//   });
// };

// window.fbAsyncInit = function() {
//   FB.init({
//     appId      : '364098737081685',
//     xfbml      : true,
//     version    : 'v2.1'
//   });

//   FB.api('/297011833657627/feed?access_token=364098737081685|5HVcEhU-v7k3DmBM-O50hFvynj8', 'get', function(response) {
//     if (!response || response.error) {
//       console.log(response.error);
//     } else {
//       console.log(response.data);

//         for (var i =0; i < 5; i++) {
//           $('#wall').append( "<li>" + response.data[i].message + "</li>");
//         };
//     }
//   });
// };

// (function(d, s, id){
//    var js, fjs = d.getElementsByTagName(s)[0];
//    if (d.getElementById(id)) {return;}
//    js = d.createElement(s); js.id = id;
//    js.src = "//connect.facebook.net/en_US/sdk.js";
//    fjs.parentNode.insertBefore(js, fjs);
//  }(document, 'script', 'facebook-jssdk'));


var twitterFeed = {
  "id": '515595862995525633',
  "domId": '',
  "maxTweets": 4,
  "enableLinks": true,
  "showUser": true,
  "showTime": true,
  "dateFunction": '',
  "showRetweet": false,
  "customCallback": handleTweets,
  "showInteraction": false
};

var twitterPage = {
  "id": '515595862995525633',
  "domId": '',
  "maxTweets": 20,
  "enableLinks": true,
  "showUser": true,
  "showTime": true,
  "dateFunction": '',
  "showRetweet": false,
  "customCallback": handleTweets,
  "showInteraction": false
};

function handleTweets(tweets){
  console.log
    var x = tweets.length;
    var n = 0;
    var element = document.getElementById('tweets');
    var html = '';
    while(n < x) {
      html += '<li>' + tweets[n] + '</li>';
      n++;
    }
    element.innerHTML = html;
}


$(document).ready(function(){
  // nav toggle
  $('.main-nav-toggle').on('click', function() {
    $('body').toggleClass('main-nav-active');
  });
  // add body class if hero exists
  if ($('.hero').length) {
    $('body').addClass('has-hero');
  }

  // view more check
  $('.view-more .left').each(function() {
    // items to show initially, update alongside variable in scss/modules/_view-more.scss
    var viewMore = 1,
        count = $('> *', this).length;
    if (count > viewMore) {
      $(this).closest('.view-more').after('<div class="view-more-item"><p><a class="item-title view-more-link">View more</a></p></div>');
    }
  });

  // view more link
  $('.view-more-item').on('click', function() {
    var container = $(this).prev('.split-2');
    console.log(container);
    $(container).addClass('is-open');
    $(this).remove();
    
    // $('> *', container).show();
  });
  // item thumbs
  $('.item-thumbs a').on('click', function() {
    var image = $(this).html(),
        section = $(this).closest('.section'),
        target = $('.item-image-shop', section);
    $(target).html(image);
  });
  // drop-down toggle
  $('.drop-down-toggle').on('click', function() {
    $(this).closest('.drop-down').toggleClass('drop-down-active');
  });
  // drop-down close if clicked outside
  $(document).on('click', function(e) {
    var container = $('.drop-down');
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      container.removeClass('drop-down-active');
    }
  });

  // Pull in Brick x Brick List from Twitter
  if($('body').is('.home')) {
    twitterFetcher.fetch(twitterFeed);
  }

  if($('body').is('.tweets')) {
    twitterFetcher.fetch(twitterPage);
  }

  // redirects

  $('a[href="/releases"]').click(function(){
    console.log("click");
     window.location.href='http://bricklanerecords.limitedrun.com/releases';
     return false;
  })

});
