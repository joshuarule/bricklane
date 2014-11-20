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
  
});