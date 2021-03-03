$(document).ready(()=>{
  $('#navburger').click(function(){
    $(this).toggleClass('is-active');
    $('#navmenu').toggleClass('is-active');
  });
  $('.notification').click(function(){
    $(this).remove();
  });
  $('.modal_trigger').click(function(){
    var v = $(this).attr('data-target');
    $('#'+v).addClass('is-active');
  });
});
