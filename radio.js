// при загрузке
let id = $("#nav-radio input:checked").val();
$('.block-container > div').hide();
$('.block-container > #block' + id + '').show();

//при изменении
$("#nav-radio").on("change", "input[type=radio]", function () {

  let id = $(this).val();
  $('.block-container > div').hide();
  $('.block-container > #block' + id + '').show();

});