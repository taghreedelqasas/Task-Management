// ---------------- VARIABLES ----------------
const MembersInput = document.getElementById("inputNames");
const namesAlert = document.getElementById("teamAlert");
const layout = document.getElementById("layout");
const createBtn = document.getElementById("createBoard");
const userContainer = document.getElementById("usersArea");
const tasksInput = document.getElementById("tasks");
const addBtn = document.getElementById("addTask");
const taskBoxContainer = document.getElementById("taskBoxContainer");
const noTasks = document.getElementById("noTasks");
const tasksNum = document.getElementById("tasksNum") ; 


let namesArr = [];
let draggedItem = null;
let dragOriginUser = null;
let TaskArr = [] ;


// ---------------- CREATE USERS ----------------
createBtn.addEventListener("click", function() {
  const names = MembersInput.value;
  if (!names) return;
  namesArr = names.split(",").map(n => n.trim());
  namesAlert.classList.add("d-none");
  layout.classList.add("d-none");

  namesArr.forEach(name => {
     
    const boxContainer = `
      <div class="col-md-3 userInfo px-1">
        <div class="bg-white px-2 rounded-3 py-3">
          <div class="memberName border-bottom-1 bottomBorder d-flex justify-content-between align-items-center">
            <h4 class="w-auto fs-6">
              <span><i class="fa-solid fa-user px-2 user"></i></span>${name}
            </h4>
            <h5    class="userNumbertasks   userNumber  w-auto px-2 text-white rounded-5">0</h5>
          </div>
          <div  id="memberTasks" class="memberTasks py-2   ">
              <div class="d-flex  emptyTaskContainer   justify-content-center  align-items-center  ">
               <p class="text-muted">No Tasks assigned</p>
              </div>
         
          </div>
        </div>
      </div>
    `;
    userContainer.innerHTML += boxContainer;
  });
});

// ---------------- ADD TASK ----------------
addBtn.addEventListener("click", function() {
  const taskValue = tasksInput.value.trim();
   
  if (!taskValue) return;
  
  const taskBox = document.createElement("div");
  taskBox.className = "taskBox my-3  ps-3  pe-1    rounded-3  py-2  ";
  taskBox.setAttribute("draggable", "true");
  taskBox.innerHTML = `
    <div class="d-flex justify-content-between  align-items-center">
      <p class="taskName  mb-0">${taskValue}</p>
      <button class="btn deleteBtn ">
        <i class="fa-solid fa-x text-white rounded-circle p-2 fs-6 bg-danger"></i>
      </button>
    </div>
  `;

  // hide noTasks if visible
  noTasks.classList.add("d-none");
  taskBoxContainer.appendChild(taskBox);
  TaskArr.push(taskValue) ;
  tasksInput.value = "";
console.log(TaskArr);
tasksNum.innerText=TaskArr.length ; 

  // ---------------- DELETE TASK ----------------
  const deleteBtn = taskBox.querySelector(".deleteBtn");
  const taskText = taskBox.querySelector(".taskName").innerText;
  deleteBtn.addEventListener("click", function() {
    taskBox.remove();

   const index = TaskArr.indexOf(taskText) ;
   if (index > -1) {
    TaskArr.splice(index, 1);
  }
    tasksNum.innerText=TaskArr.length ;

    if (taskBoxContainer.children.length === 0) {
      noTasks.classList.remove("d-none");
    }
  });

  // ---------------- DRAG START ----------------
  taskBox.addEventListener("dragstart", function(e) {
    // Prevent dragging finished tasks
    const selectElement = taskBox.querySelector(".selectBox");
    if (selectElement && selectElement.value === "Finished") {
      e.preventDefault();
      return;
    }
    draggedItem = taskBox;
    dragOriginUser = taskBox.closest(".userInfo");
  });
});

// ---------------- DRAG & DROP ----------------
function allowDrop(e) {
  e.preventDefault();
}

// allow dropping on main list and user tasks
taskBoxContainer.addEventListener("dragover", allowDrop);
userContainer.addEventListener("dragover", allowDrop);

// drop on main list
taskBoxContainer.addEventListener("drop", function(e) {
  e.preventDefault();
  if (draggedItem) {
    const originUserInfo = draggedItem.closest(".userInfo");
    if (originUserInfo) {
      const originCount = originUserInfo.querySelector(".userNumber");
      if (originCount) {
        originCount.innerText = Math.max(0, parseInt(originCount.innerText) - 1);
      }
      const originTasks = originUserInfo.querySelector(".memberTasks");
      if (originTasks && !originTasks.querySelector(".taskBox")) {
        originTasks.innerHTML = '<p class="text-muted">No Tasks assigned</p>';
      }
    }
    
    // Add task back to TaskArr if it was removed
    const taskName = draggedItem.querySelector(".taskName")?.innerText;
    if (taskName && !TaskArr.includes(taskName)) {
      TaskArr.push(taskName);
    }
    
    // Remove select if it exists (since it's back in main list)
    const selectDiv = draggedItem.querySelector("div:has(> select)");
    if (selectDiv) {
      selectDiv.remove();
    }
    
    // Reset background color
    draggedItem.style.backgroundColor = "white";
    draggedItem.classList.remove("draggedstyle");
    
    tasksNum.innerText = TaskArr.length;
     
    taskBoxContainer.appendChild(draggedItem);
    draggedItem = null;
    dragOriginUser = null;
  }
});

// drop on user tasks
userContainer.addEventListener("drop", function(e) {
   
  e.preventDefault();
  const memberBox = e.target.closest(".memberTasks");
  if (!memberBox) return;
  
  memberBox.style.background="white" ;
  memberBox.style.border ="none" ; 
  console.log("dropped...... ");
  
  if (memberBox && draggedItem) {
    // Check if task is finished - prevent moving finished tasks
    const selectElement = draggedItem.querySelector(".selectBox");
    if (selectElement && selectElement.value === "Finished") {
      alert("Cannot move finished tasks to another user!");
      return;
    }
    
    const placeholder = memberBox.querySelector("div.emptyTaskContainer");
    if (placeholder) placeholder.remove();

    const targetUserInfo = memberBox.closest(".userInfo");
    const originUserInfo = draggedItem.closest(".userInfo");
    
    if (originUserInfo && originUserInfo !== targetUserInfo) {
      const originCount = originUserInfo.querySelector(".userNumber");
      if (originCount) {
        originCount.innerText = Math.max(0, parseInt(originCount.innerText) - 1);
      }
      const originTasks = originUserInfo.querySelector(".memberTasks");
      if (originTasks && !originTasks.querySelector(".taskBox")) {
        originTasks.innerHTML = '<p class="text-muted">No Tasks assigned</p>';
      }
    }

    console.log(draggedItem);
    
    // Get the task name from the dragged item and remove it from TaskArr
    const taskName = draggedItem.querySelector(".taskName")?.innerText;
    if (taskName) {
      const draggedIndex = TaskArr.indexOf(taskName);
      if (draggedIndex > -1) {
        TaskArr.splice(draggedIndex, 1);
      }
    }
    
    tasksNum.innerText = TaskArr.length;
    
    if (!draggedItem.querySelector("select")) {
      const selectBox = `
        <div>
          <select class="selectBox">
            <option selected>Not Started</option>
            <option>Ongoing</option>
            <option>Finished</option>
          </select>
        </div>
      `;
      draggedItem.insertAdjacentHTML("beforeend", selectBox);
      
      const selectItem = draggedItem.querySelector(".selectBox");
      
      // Set initial color
      draggedItem.style.backgroundColor = "#FED0C7";
      
      // Add change listener
      selectItem.addEventListener("change", function() {
        const taskBox = this.closest(".taskBox");
        if (!taskBox) return;
        
        if (this.value === "Not Started") {
          taskBox.style.backgroundColor = "#FED0C7";
        } else if (this.value === "Ongoing") {
          taskBox.style.backgroundColor = "#b5ccef";
        } else if (this.value === "Finished") {
          taskBox.style.backgroundColor = "#C1E1C1";
        }
      });
    }


    draggedItem.classList.add("draggedstyle");
    memberBox.appendChild(draggedItem);

    if (targetUserInfo && originUserInfo !== targetUserInfo) {
      const userNumber = targetUserInfo.querySelector(".userNumber");
      if (userNumber) {
        userNumber.innerText = parseInt(userNumber.innerText) + 1;
      }
    }
    
    draggedItem = null;
    dragOriginUser = null;
  }
});

userContainer.addEventListener("dragleave", function(e){
  const memberBox = e.target.closest(".memberTasks");
  if (memberBox) {
    memberBox.style.background = "white";
    memberBox.style.border = "none";
    // memberBox.style.height = "200px" ; 
  }
});      //drag leave
// Drag Enter 
userContainer.addEventListener("dragenter",function(e){
  e.preventDefault() ; 
  const memberBox = e.target.closest(".memberTasks");
    memberBox.style.background="#CFDCE6" ;
  memberBox.style.border ="1px dashed  blue" ; 
    console.log("enter....... ");
 
}) 