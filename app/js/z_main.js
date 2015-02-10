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

  // redirects

  $('a[href="/releases"]').click(function(){
    console.log("click");
     window.location.href='http://store.bricklanerecords.com/releases';
     return false;
  })

  $('a[href="/shop"]').click(function(){
    console.log("click");
     window.location.href='http://store.bricklanerecords.com/';
     return false;
  })

});
