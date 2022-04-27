function traerids(formu) {
  const preguntas= formu.getItems()
  var ids=[]
  preguntas.forEach(pregunta=>{
    ids.push(pregunta.getId().toString())
  })
  return ids
}

function AcatualizarPreguntas() {
  const libro=SpreadsheetApp.getActiveSpreadsheet()
  const hoja=libro.getSheetByName("Horarios")
  const fecha= hoja.getRange(2,1,ultimaFila(1,hoja)-1).getDisplayValues()
  const opcionesFechas=fecha.map(row=>row[0])
  const hora= hoja.getRange(2,2,ultimaFila(2,hoja)-1).getDisplayValues()
  const opcionesHora=hora.map(row=>row[0])
  const formularioDeAsesoria= FormApp.openByUrl("https://docs.google.com/forms/d/1e5GIBHjip6DOSMWABnKbYY77T7AhzHLxRxFrZNRw54Y/edit")
Logger.log(traerids(formularioDeAsesoria))
  const preguntaFecha=formularioDeAsesoria.getItemById(traerids(formularioDeAsesoria)[1])
  preguntaFecha.asListItem().setChoiceValues(opcionesFechas)
  const preguntaHora=formularioDeAsesoria.getItemById(traerids(formularioDeAsesoria)[2])
  preguntaHora.asListItem().setChoiceValues(opcionesHora)
}

function ultimaFila(columna,hoja){
  const ultimaFila=hoja.getMaxRows()
  const rango=hoja.getRange(1,columna,hoja.getMaxRows()).getValues()
  for(i=ultimaFila-1;i>0;i--){
    if(rango[i][0]){
      return i+1
    }
  }
}

function crearPDF(e){
  const idplantilla="16f7rth1daPwvjc1K5u9SVPXtX81AHpoSj4gxrGCT93I"
  const idcarpeta="1bx3-f6V-YI4BLIB5tw6F2AX1T_l1MO__"
  var resp=e.namedValues;
  var fecha=resp["Fecha de asesoría"];
  var hora=resp["Hora"];
  var correo=resp["Correo"];
  var motivo=resp["Motivo Asesoría"];
  var carpeta=DriveApp.getFolderById(idcarpeta)
  var archivodoc=DriveApp.getFileById(idplantilla)
  var copiaArchivo=archivodoc.makeCopy()
  var idcopiaArchivo=copiaArchivo.getId()
  var doc=DocumentApp.openById(idcopiaArchivo)
  var texto=doc.getBody()
  texto.replaceText("%fecha%",fecha)
  texto.replaceText("%correo%",correo)
  texto.replaceText("%motivo%",motivo)
  texto.replaceText("%hora%",hora)
  doc.saveAndClose()

  var blob=copiaArchivo.getBlob()
  var pdf=carpeta.createFile(blob)
  pdf.setName("Notificación reserva asesoría "+ correo+" "+ fecha)

  GmailApp.sendEmail(correo, "Notificación Reserva Asesoria", "Se adjunta un PDF con la reserva de la asesoria", {
    attachments:[pdf]
  })
}

function permisos(){
   DocumentApp.openById("dvc a")
   DriveApp.getFolders()
   GmailApp.getDraft()
}
