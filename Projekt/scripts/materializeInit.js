document.addEventListener('DOMContentLoaded', function() {
    console.log("do the thing");
      var elems = document.querySelectorAll('.collapsible');
      var instances = M.Collapsible.init(elems, {accordion: true});
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {preventScrolling : false});
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
  });