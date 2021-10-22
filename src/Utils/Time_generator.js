export const generatorTime = ()=>{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hour = today.getHours();
    var minute = today.getMinutes()<10?"0"+today.getMinutes():today.getMinutes()
    var ap = today.getHours()>=12?"PM":"AM"
    today = hour+':'+minute+ap+' '+ dd + '/' + mm + '/' + yyyy;
    return today
  }
  