



//Obtenemos las respuestas del formulario
function getRespuestas(e){
  const respuestaenviada=e.response
  const respuestas=respuestaenviada.getItemResponses()
  let res=[]
  respuestas.forEach(respuesta=>{
    res.push(respuesta.getResponse())
  })
  return res
}

//creamos un evento en google calendar usando servicio avansado de Google Calendar API
function createEvent(e) {
  var res= getRespuestas(e)
  var calendarId = 'primary'; 
  var diferencia= restarfechas(res[1]+"")
  
  if(res[2]>=6&&res[2]<=12){
    var num=res[2]-1;
    Logger.log(num)
    var start = getRelativeDate(diferencia, num);
    var end = getRelativeDate(diferencia, num+1);
  }
  else{
    if(res[2]>=1&&res[2]<=6){
    var num=res[2]-1+12;
    Logger.log(num)
    var start = getRelativeDate(diferencia, num);
    var end = getRelativeDate(diferencia, num+1);
    }
  }
  Logger.log(res)
  var event = {
    summary: 'Asesoria Cloud Computing',
    location: 'Universidad Francisco de Paula Santander',
    description: res[0],
    start: {
      dateTime: start.toISOString()
    },
    end: {
      dateTime: end.toISOString()
    },
    attendees: [
      {email: res[0]+""}
    ],
    // Red background. Use Calendar.Colors.get() for the full list.
    colorId: 11
  };
  event = Calendar.Events.insert(event, calendarId);
  Logger.log('Event ID: ' + event.id);
}

/**
 * Helper function to get a new Date object relative to the current date.
 * @param {number} daysOffset The number of days in the future for the new date.
 * @param {number} hour The hour of the day for the new date, in the time zone
 *     of the script.
 * @return {Date} The new date.
 */
function getRelativeDate(daysOffset, hour) {
  var date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour+1);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function restarfechas(fecha){
  var date =new Date();
  var date2 =formatearfecha(fecha)
var difference= Math.abs(date2-date);
days = Math.ceil(difference/(1000 * 3600 * 24))
  return days
}


function formatearfecha(fecha){
let datos=fecha.split("/",3)
let date=new Date(datos[2]+"/"+datos[1]+"/"+datos[0]);
return date
}



