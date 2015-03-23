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

  // redirects

  $('a[href="/releases"]').click(function(){
     window.location.href='http://store.bricklanerecords.com/releases';
     return false;
  })

  $('a[href="/shop"]').click(function(){
     window.location.href='http://store.bricklanerecords.com/';
     return false;
  })

  equalheight = function(container){

  var currentTallest = 0,
       currentRowStart = 0,
       rowDivs = new Array(),
       $el,
       topPosition = 0;
   $(container).each(function() {

     $el = $(this);
     $($el).height('auto')
     topPostion = $el.position().top;

     if (currentRowStart != topPostion) {
       for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
         rowDivs[currentDiv].height(currentTallest);
       }
       rowDivs.length = 0; // empty the array
       currentRowStart = topPostion;
       currentTallest = $el.height();
       rowDivs.push($el);
     } else {
       rowDivs.push($el);
       currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
    }
     for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
       rowDivs[currentDiv].height(currentTallest);
     }
   });
  }

  $(window).load(function() {
    equalheight('.split-2-4 .item');
    equalheight('.split-2 .item');

  });


  $(window).resize(function(){
    equalheight('.split-2-4 .item');
    equalheight('.split-2 .item');
  });

});
