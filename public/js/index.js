$(document).ready(()=>{
  $('#navburger').click(function(){
    $(this).toggleClass('is-active');
    $('#navmenu').toggleClass('is-active');
  });
  $('.delete').click(function(){
    $(this).closest('.notification').remove();
  });
  $('.modal_trigger').click(function(){
    var v = $(this).attr('data-target');
    $('#'+v).addClass('is-active');
  });
});
