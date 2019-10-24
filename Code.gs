function update() {
  importMAP();
  updateRoster();
}

function importMAP() {

  //get data
  var source = SpreadsheetApp.openById("1ylKDXYyh3fYYeSrCCAXHJlsFrwtzI3a4Nh3ZdBWu4sQ"); //network map tracker ID (source of data set)
  var sourceSheet = source.getSheetByName("MAP Data - All Grades"); //get sheet with all kids data 
  var roster = sourceSheet.getRange("A:BA").getValues(); //store all data for network
  var data = [roster[3]]; //set up array with headings to fill with specific school data
  
  //get destination - with school specific
  var destination = SpreadsheetApp.getActive(); // get current workbook
  var destHelper = destination.getSheetByName("Helper"); //get helper tab
  var school = destHelper.getRange("A1").getValue(); //get school name from cell
  
  //loop through data set and only push data for specific school to data array
  for (var i = 4; i < roster.length; i++) {
    if(roster[i][1] == school) {
      data.push(roster[i]);
    }
  }
  
  destHelper.getRange("D:BD").clear(); //clear out destination tab
  destHelper.getRange("D1:BD" + data.length).setValues(data); //paste data
  
}

function updateRoster() {
  var ss = SpreadsheetApp.getActiveSpreadsheet() // get active spreadsheet
  var update = ss.getSheetByName('Helper'); // get helper tab - has full roster of school
  var roster = ss.getSheetByName('Roster'); // get roster for reading intervention 
  
  var rowNum = update.getRange(2,2).getValue(); //see what row to start adding to the intervention roster for (uses a cell that counts how many kids are on the list)
  var numAdd = update.getRange(2,1).getValue(); //see how many kids need to be added (uses a cell that counts how many are in a list of "missing from roster" - filter function)
  var addition = update.getRange(4,1,numAdd,1).getValues(); //get student numbers for kids who need to be added
  
  //only add if there are actually kids who need to be added
  if(numAdd>3) {
    roster.getRange(rowNum,2,numAdd,1).setValues(addition); //add the student numbers to the roster (in the second column)
  
    //remove any filter that exists
    var currentFilter = roster.getFilter();
    if ( currentFilter !== null) {
       roster.getFilter().remove();
    }
 
    //sort sheet correctly so that names are in alphabetical order
    var range = roster.getRange(3,1,roster.getLastRow()-2,roster.getLastColumn());
    range.sort(3);
    range.sort(4);
  }
  
}