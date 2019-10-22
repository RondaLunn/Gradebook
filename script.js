/*
Final Project: Create a grade book program without removing or modifying the HTML or CSS provided.
Requirements:
    - You must be able to add an assignment that will be displayed in the container grid.
    - You must be able to remove an assignment that has already been displayed in the container grid.
    - The form should not submit unless all fields have been entered.
Extra Credit:
    - Check for information that has been entered incorrectly, and either alert the user to fix this or properly format the data for the user.
    - Keep separate averages by subject, or try adding weighted grades based on assignment type.
Notes:
    - You may add any new features that you see fit, but ensure that any new changes meet the requirements above.
    - You may only add HTML and CSS if you are implementing new features not required. However, please add comments where these changes have been added in the code. Remember, do not remove or modify any prexisting HTML or CSS.
*/


//=== HTML helper Functions ===
//Provided an HTML id as id, this function will return the value within the HTML element.
function getValue(id) {
    return document.getElementById(id).value;
}

    //Provided a string as val and an HTML id as id, this function will set the value within a specified input element to the string provided.
function setValue(val, id) {
    document.getElementById(id).value = val;
}

    //Provided a string as val and an optional HTML id, this funcion will place the HTML string inside the specified HTML element. If no element is specified, it will default to container.
function updateHTML(val, id = 'container') {
    document.getElementById(id).innerHTML = val;
}

// Grade Book

// Create Grade object
class Grade {
  constructor (id, subject, assignment, score) {
    this.id = id;
    this.subject = subject;
    this.assignment = assignment;
    this.score = score;
  }
};

// Create an array to hold the grades
const data = {
  grades: []
};

addRow = (subject, assignment, score) => {
  let newGrade, ID;

  // Get input from form
  subject = getValue("subject");
  assignment = getValue("assignment");
  score = getValue("score");

  // Check if values are entered and valid
  if (subject && assignment && !isNaN(parseInt(score, 10)) && score >= 0) {
    // Determine ID of grade to add
    if (data.grades.length > 0) {
      ID = data.grades[data.grades.length - 1].id + 1;
    } else {
      ID = 0;
    }

    // Create new Grade object
    newGrade = new Grade(ID, subject, assignment, score);

    // Add new Grade to array of grades
    data.grades.push(newGrade);

    // Update the html to display the grades
    displayGrade(newGrade);

    // Reset fields to blank
    setValue("", "subject")
    setValue("", "assignment")
    setValue("", "score")

    // Alert user if error in input
  } else if (!subject) {
    window.alert("Error: Please Enter a Subject");
  } else if (!assignment) {
    window.alert("Error: Please Enter an Assignment");
  } else if (!score) {
    window.alert("Error: Please Enter a Score");
  } else if (isNaN(parseInt(score, 10)) || score < 0) {
    window.alert(`Error: Please Enter a Valid Score`);
  }

  // Stop html form submission from refreshing
  return false;
}

deleteRow = id => {
  let ids, index;

  // Find the index of the Grade with specified id in the array grades (if items have been deleted, the id may not be same as the index)
  ids = data.grades.map(current => current.id);
  index = ids.indexOf(id);

  // Remove the grade from the array if index is valid
  if (index > -1) {
      data.grades.splice(index, 1);
  }

  // Update the html to display the grades
  removeGrade(id);
}

calculateAverage = () => {
  let gradeTotal = 0;

  // Add up all scores in the grades array if grades is not empty
  if (data.grades.length > 0){
    for (let grade of data.grades) {
      gradeTotal += parseInt(grade.score,10);
    }

    // Divide by the total number of grades and return result (to 2 decimal places)
    return (gradeTotal / data.grades.length).toFixed(2);
  } else {

    // Return 0 if array is empty
    return 0;
  }
}


// UI
displayGrade = grade => {
  let average, html, newHTML, gradeTable, gradeID;

  // Create html to display Grades in the table container. Add new row per Grade
  if (data.grades.length > 0){
  gradeTable = document.getElementById("container").innerHTML;
  } else {
  gradeTable = "";
  }
    html = `<tr id=%id%><td>%subject%</td><td>%assignment%</td><td>%score%<button class="deletebtn" style="margin-left:20px; padding:1px 5px; display:none;">x</button></td></td></tr>`;
    newHTML = html.replace("%id%", grade.id);
    newHTML = newHTML.replace("%subject%", grade.subject);
    newHTML = newHTML.replace("%assignment%", grade.assignment);
    newHTML = newHTML.replace("%score%", grade.score);
    gradeTable = gradeTable.concat(newHTML);

  // Add the new html to the document
  updateHTML(gradeTable);

  // Display the average
  displayAverage();
}

removeGrade = id => {
  let row = document.getElementById(id);
  row.parentNode.removeChild(row);
  // Display the average
  displayAverage();
}

displayAverage = () => {
  // Get and display the average if grades is not empty
  if (data.grades.length > 0) {
    average = calculateAverage();
    document.getElementById("average").style.display = "block";
    updateHTML(average,"gpa");

  } else {

    // Hide average if grades is empty
    document.getElementById("average").style.display = "none";
    updateHTML(average,"gpa");
  }
}

// Initialize
init = () => {
  let userName, delID;

  window.onload = function () {

    // Prompt user for name
    userName = window.prompt("What is your Name?")

    // Change heading to display user name
    document.querySelector("h1").innerHTML = `Grade book for ${userName}`;

    // Add mouseover event listener to each row to show delete button on hover
    document.getElementById("container").addEventListener("mouseover", event => {
      event.target.parentNode.querySelector(".deletebtn").style.display = "inline";
    });

    // Add mouseout event listener to each row to hide delete button on hover
    document.getElementById("container").addEventListener("mouseout", event => {
      event.target.parentNode.querySelector(".deletebtn").style.display = "none";
    });

    // Add event listener to delete a row when
    document.getElementById("container").addEventListener(`click`, event => {
      delID = parseInt(event.target.parentNode.parentNode.id, 10);;
      deleteRow(delID);
    });
  }
}

// Start the program
init();
