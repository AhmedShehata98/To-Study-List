const appearanceToggle  = document.querySelector(".toggle"),
  appearancePannel      = document.querySelector(".appearance"),
  boxColor              = document.querySelectorAll(".color-container span"),
  swicthMode            = document.querySelector(".appearance .mode-container h3"),
  swicthModeIco         = document.querySelector(".appearance .mode-container > :first-child"),
  timeSpanHours         = document.querySelector(".time .hours"),
  timeSpanMinus         = document.querySelector(".time .minutes"),
  clender               = document.querySelector(".timeAndCalender .calender .date"),
  tasksProgress         = document.querySelector(".main-bar"),
  taskPersentValue      = document.querySelector(".persent-value"),
  ulTasksList           = document.querySelector(".todo-items"),
  inputNewTask          = document.querySelector("#newTaskInput"),
  buttonNewTaskSend     = document.querySelector(".sendBtn");

var swithedDone = false;
var LocalStorage = JSON.parse(window.localStorage.getItem("task"));
var TasksList = []; //to store tasks object inside

if (window.localStorage.getItem("Task") !== null) {
  let BackedupData = JSON.parse(getDataFrom('Task'))
  TasksList = BackedupData 
  createElementFrom(TasksList);
}

if (window.localStorage.getItem("changedColor") !== null) {

  document.documentElement.style.setProperty("--main-clr", window.localStorage.getItem("changedColor"));
}

if (window.localStorage.getItem("swithedDone") !== null) {
  if (window.localStorage.getItem("swithedDone") === 'true') {
    swithedDone = true
  }else{
    
    swithedDone = false
  }
  
}

// Events
// 
// 
buttonNewTaskSend.addEventListener("click", () => {
  GetValueFromInput();
});


inputNewTask.addEventListener('keyup',(e)=>{
  if(e.code == 'Enter' || e.code == "NumpadEnter"){
    GetValueFromInput()
  }
})

appearanceToggle.addEventListener('click',(e) => {
  appearancePannel.classList.toggle("active");
});


// Function Calling
// 
// 
incrementProgressBar();
setOtherTheme();
innerDateAndTimeIn(clender, timeSpanHours, timeSpanMinus);



// Functions Creation
// 
// 
function GetValueFromInput(){
  if (inputNewTask.value === "") {
    //
  } else {
    HandlingValeFrom(inputNewTask);
    saveDataFrom("Task", JSON.stringify(TasksList));
    incrementProgressBar();
  }
}

function HandlingValeFrom(input) {
  // getting task informations
  var taskObj = {
    id: Date.now(),
    date: dateFormat(new Date()),
    taskFinished: false,
    taskWait: false,
    taskContent: input.value,
  };

  TasksList.push(taskObj);
  input.value = "";
  createElementFrom(TasksList);
}


function createElementFrom(tasksListArr){
  
  ulTasksList.innerHTML = '';
    for(let i=0 ; i < tasksListArr.length ; i++)
      {
        let listItem    = document.createElement('li'),
            statusIcon  = document.createElement('ion-icon'),
            ancher      = document.createElement('a'),
            dateText        = document.createElement('span'),
            statChangeDiv = document.createElement('div'),
            statChangeFinish = document.createElement('ion-icon'),
            statChangeWait = document.createElement('ion-icon'),
            statChangeClear = document.createElement('ion-icon');
            

            listItem.setAttribute('data-ID',tasksListArr[i].id)
            statusIcon.classname = 'statusIcon';
            dateText.className = 'date'
            statChangeDiv.className = "selection-stat";
            statChangeFinish.className = "finish";
            statChangeWait.className = "wait";
            statChangeClear.className = "clear";
            statChangeFinish.setAttribute('name',"checkbox")
            statChangeWait.setAttribute('name','time') 
            statChangeClear.setAttribute('name','trash')



            // append
            listItem.appendChild(statusIcon);
            listItem.appendChild(ancher);
            ancher.appendChild(document.createTextNode(tasksListArr[i].taskContent))
            listItem.appendChild(dateText);
            dateText.appendChild(document.createTextNode(tasksListArr[i].date))
            listItem.appendChild(statChangeDiv)
            statChangeDiv.appendChild(statChangeFinish)
            statChangeDiv.appendChild(statChangeWait)
            statChangeDiv.appendChild(statChangeClear)

            ulTasksList.appendChild(listItem);


          // Behavior if task is finished
            if(tasksListArr[i].taskFinished == true){
              tasksListArr[i].taskWait = false ;
              listItem.classList.remove('Waiting') ;
              listItem.classList.add("TaskFinished") ;
              statusIcon.setAttribute('name','checkmark')
            }else{
              listItem.classList.contains("TaskFinished") ? listItem.classList.remove("TaskFinished") : false ;
              statusIcon.setAttribute('name','close-circle')
            }
          // Behavior if task is in understudy
            if(tasksListArr[i].taskWait == true ){
              tasksListArr[i].taskFinished = false ;
              listItem.classList.remove("TaskFinished")
              listItem.classList.add('Waiting');
              statusIcon.setAttribute('name','hourglass') ;
            }else{
              listItem.classList.contains('Waiting') ? listItem.classList.remove('Waiting') : false
              statusIcon.setAttribute('name','close-circle')
            }



            // Buttons Events
            statChangeFinish.addEventListener('click',(e)=>{
              if (tasksListArr[i].taskFinished == false) {
                tasksListArr[i].taskFinished = true ;
                createElementFrom(TasksList) ;
                saveDataFrom('Task',JSON.stringify(TasksList)) ;
              }else{
                tasksListArr[i].taskFinished = false ;
                createElementFrom(TasksList);
                saveDataFrom('Task',JSON.stringify(TasksList)) ;
              }

            })

            statChangeWait.addEventListener('click', ()=>{
              if(tasksListArr[i].taskWait == false){
                tasksListArr[i].taskWait = true ;
                createElementFrom(tasksListArr) ;
                saveDataFrom('Task',JSON.stringify(TasksList));
              }else{
                tasksListArr[i].taskWait =false ;
                createElementFrom(tasksListArr) ;
                saveDataFrom('Task',JSON.stringify(TasksList)) ;
              }
            })

            statChangeClear.addEventListener('click',(e)=>{
              TasksList.splice(tasksListArr.indexOf(tasksListArr[i]),1) ;
              createElementFrom(tasksListArr);
              saveDataFrom('Task',JSON.stringify(tasksListArr)) ;
            })
      }
}

function dateFormat(date) {
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  if (day <= 10) {
      day = "0" + day
  }
  if (month <= 10) {
      month = "0" + month
  }
  return `${day}/ ${month}/ ${year}`;
}

function innerDateAndTimeIn(...args){
  setInterval(() => {
    var generateLocalDate = new Date();

    var date = dateFormat(generateLocalDate)
    args[0].textContent = date;

    var hour = generateLocalDate.getHours();
    if (hour <= 10) {
      hour = "0" + hour;
    }else{
      args[1].textContent = hour
    }

    var min = generateLocalDate.getMinutes();
    if (min <= 10) {
      min = '0'+min;
    }else{
      args[2].textContent = min
    }

    
    
  }, 1000);


}


function saveDataFrom(inputKey, InputValue) {
  if (inputKey !== "" && InputValue !== "") {
    window.localStorage.setItem(inputKey, InputValue);
  }
}

function getDataFrom(inputKey) {
  return window.localStorage.getItem(inputKey);
}

function incrementProgressBar(){
    tasksProgress.style.width = `${ulTasksList.childNodes.length}%`;
    taskPersentValue.textContent = `${ulTasksList.childNodes.length}%`;
}

function GetSavedClasses(){
  if(window.localStorage.getItem("finishedStudyClass") !== null){
    liTask.className = "finishedStudy";
  }
  if(window.localStorage.getItem("StudyClass") !== null){
    liTask.className = "study";
  }
}


function removeElementfromStorage(ElementID) {
  for (let i = 0; i < TasksList.length; i++) {
    if (TasksList[i].id == ElementID) {
      TasksList.splice(TasksList[i],1)
      saveDataFrom("task", JSON.stringify(TasksList));
    }
  }
}

function setOtherTheme(){

boxColor.forEach(box =>{
  box.addEventListener('click',(e)=>{
    var colorHex   = e.target.getAttribute("data-clr");
    document.documentElement.style.setProperty('--main-clr',colorHex);
    saveDataFrom("changedColor", colorHex);
  })
})


swicthMode.addEventListener('click',()=>{
  document.body.classList.toggle("mainColorActive");

  if (document.body.classList.contains("mainColorActive")) {
    // So it is dark mode now
    swicthModeIco.setAttribute("name", "sunny-outline");
    swicthModeIco.style.color = "yellow";
    swithedDone = true;
    saveDataFrom("swithedDone", swithedDone);
  } else {
    // So we is in light mode

    swicthModeIco.setAttribute("name", "moon-outline");
    swicthModeIco.style.color = "#4c3f91";
    swithedDone = false;
    saveDataFrom("swithedDone", swithedDone);
  }
  })
  
  if (swithedDone == true) {
    document.body.classList.add("mainColorActive");
  }else{
    document.body.classList.remove("mainColorActive");
  
  }
}

