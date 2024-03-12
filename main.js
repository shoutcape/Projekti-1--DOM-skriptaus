
// syöttölaatikko
let taskList = document.getElementById('taskList')
let taskForm = document.getElementById('taskForm')
let completedTaskList = document.getElementById('completedTaskList')
let currentTaskAmount = document.getElementById('currentTaskAmount')
let completedTaskAmount = document.getElementById('completedTaskAmount')



// call addTask function when the submit button is clicked
taskForm.onsubmit = function (event) {
    event.preventDefault()
    addTask()
}

document.addEventListener('mousemove', function (event) {
    let x = event.clientX
    let y = event.clientY
    let cursor = document.getElementById('cursor')
    // offsets for the cursor to be in the middle of the cursor image
        cursor.style.left = x-0.75 + 'px'
        cursor.style.top = y-1.5 + 'px'
        cursor.style.visibility = 'visible'
})


function addRemoveButton(task) {
    let taskText = task.textContent
    let removeButton = document.createElement('span')
    removeButton.innerHTML = '&#10005;'
    //add onclick event to the removeButton
    removeButton.onclick = function (event) {
        //stopPropagation prevents the activation of the click event on the parent element
        event.stopPropagation()
        /*
        To remove the current task from local storage
        we need to get the saved tasks and the index of the current task
        */
       let tasks = JSON.parse(localStorage.getItem('tasks'))
       let index = tasks.findIndex(task => task.text === taskText)
       // remove the task from the tasks array by using .splice(index, amount of removable items)
       tasks.splice(index, 1)
       //then we save the remaining tasks back to local storage
       localStorage.setItem('tasks', JSON.stringify(tasks))
       task.remove()
       updateTaskCount()
    }
    removeButton.classList.add('removeButton')
    task.appendChild(removeButton)
}

function updateTaskCount() {
    currentTaskAmount.innerHTML = taskList.childElementCount
    completedTaskAmount.innerHTML = completedTaskList.childElementCount

}

function createTaskElement(taskText, completed = false) {
    let newTask = document.createElement('li')
    newTask.innerHTML = taskText
    if (completed) {
        newTask.classList.add('completed')
    }
    newTask.addEventListener('click', function (event) {
        let tempCompleted = newTask.classList.contains('completed')
        if (tempCompleted) {
            taskList.appendChild(newTask)
        } else {
            completedTaskList.appendChild(newTask)
        }
        newTask.classList.toggle('completed')
        updateLocalStorage(event.target, taskText, tempCompleted)
    }) 
    return newTask
}

function addTask() {
    let inputvalue = document.getElementById('newTask')
    if (inputvalue.value == '' || inputvalue.value.length < 3) {
        inputvalue.placeholder = 'Please enter a task with at least 3 characters.'
        inputvalue.classList.add('validationError')
        inputvalue.value = ''
        setTimeout(() => {
            inputvalue.classList.remove('validationError')
            inputvalue.placeholder = ''
        }, 2000)
        return
    }

    let newTask = createTaskElement(inputvalue.value, completed = false)
    taskList.appendChild(newTask, addRemoveButton(newTask))

    //create tasks constant from local storage value tasks or an empty array
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.push({text:inputvalue.value, completed:completed})
    localStorage.setItem('tasks', JSON.stringify(tasks))

    inputvalue.value = ''
    updateTaskCount()
}

function updateLocalStorage(target, taskText, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
    // find the index of the task that was clicked
    let index = tasks.findIndex(task => task.text === taskText)
    // toggle the completed status of the task
    tasks[index].completed = !completed
    // temporarily store the task that was clicked
    let tempTask = tasks[index]
    // remove the original task from the tasks array
    tasks.splice(index, 1)
    // add the updated task back to the tasks array
    tasks.push(tempTask)
    // update the local storage with the updated tasks array
    localStorage.setItem('tasks', JSON.stringify(tasks))
    // here we update the amount of tasks in the task lists
    updateTaskCount()
}

// here we load the existing tasks from local storage on page load
window.onload = function () {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
    for (let task of tasks) {
        let newTask = createTaskElement(task.text , task.completed)
        
        if (task.completed) {
            completedTaskList.appendChild(newTask, addRemoveButton(newTask))
        } else {
            taskList.appendChild(newTask, addRemoveButton(newTask))
        }
        // check the amount of tasks from the child elements of the task lists
        updateTaskCount()
    }
}