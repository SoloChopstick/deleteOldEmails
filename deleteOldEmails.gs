//VARIABLES
var DELETE_AFTER_DAYS = 30
var PROCESSING_SIZE = 100

function deleteOldEmails() {
  console.log('Hello World')
  //call to delete old triggers
  removeOldDeleteTriggers()

  var search = 'in:inbox -in:starred -in:important older_than:' + DELETE_AFTER_DAYS +'d'
  var threads = GmailApp.search(search, 0, PROCESSING_SIZE)

  //More than 10 emails to delete, so set new trigger in 1mins
  if (threads.length === PROCESSING_SIZE) {
    console.log('More than 10 emails to delete. Trigger in 1 more minute set.')
    createDeleteMoreTrigger()
  }

  console.log('Checking ' + threads.length + ' threads...')

  var breakPoint = new Date()
  breakPoint.setDate(breakPoint.getDate() - DELETE_AFTER_DAYS)

  //Delete threads that are older than 30 days
  for(var i = 0; i < threads.length; i++) {
    thread = threads[i]
    if (thread.getLastMessageDate() < breakPoint) {
      thread.moveToTrash()
    }
  }
}

//Wrapper
function deleteMore() {
  deleteOldEmails()
}

//Create triggers to delete old emails every week
function createTimeDrivenTrigger() {
  ScriptApp.newTrigger('deleteOldEmails')
  .timeBased()
  .onWeekDay(ScriptApp.WeekDay.FRIDAY)
  .create()
}

//Trigger that executes removesTriggers after 1minute
function createDeleteMoreTrigger() {
  ScriptApp.newTrigger('deleteMore')
  .timeBased()
  .at(new Date((new Date()).getTime() + 1000 * 60))
  .create()
}

//20 trigger limit, so need to delete
function removeOldDeleteTriggers() {
  var triggers = ScriptApp.getProjectTriggers()
  for (var i = 0; i < triggers.length; i++) {
    trigger = triggers[i]
    if (trigger.getHandlerFunction() === 'deleteMore') {
      ScriptApp.deleteTrigger(trigger)
    }
  }
}

//delete all triggers
function deleteAllTriggers() {
  var triggers = ScriptApp.getProjectTriggers()
  for (trigger in triggers) {
    ScriptApp.deleteTrigger(trigger)
  }
}
