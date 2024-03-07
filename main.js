
// syöttölaatikko
let taskList = document.getElementById('taskList')
let taskForm = document.getElementById('taskForm')

// call addTask function when the submit button is clicked
taskForm.onsubmit = function (event) {
    event.preventDefault()
    addTask()
}

document.addEventListener('mousemove', function (event) {
    let x = event.pageX
    let y = event.pageY
    // console.log(x,y)
    let cursor = document.getElementById('cursor')
    // console.log(cursor)
    // offsets for the cursor to be in the middle of the cursor image
        cursor.style.left = x-0.75 + 'px'
        cursor.style.top = y-1.5 + 'px'
        cursor.style.visibility = 'visible'
})

function addRemoveButton(task) {
    let removeButton = document.createElement('span')
    removeButton.innerHTML = '&#10005;'
    //add onclick event to the removeButton
    removeButton.onclick = function () {
        task.remove()
        /*
        To remove the current task from local storage
        we need to get the saved tasks and the index of the current task
        */
        let tasks = JSON.parse(localStorage.getItem('tasks'))
        let index = tasks.indexOf(task.innerHTML)
        // remove the task from the tasks array by using .splice(index, amount of removable items)
        tasks.splice(index, 1)
        //then we save the remaining tasks back to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }
    removeButton.classList.add('removeButton')
    task.appendChild(removeButton)
}

function createTaskElement(taskText) {
    let newTask = document.createElement('li')
    newTask.innerHTML = taskText
    newTask.addEventListener('click', function () {
        newTask.classList.toggle('completed')
    }) 
    return newTask
}

function addTask() {
    inputvalue = document.getElementById('newTask')
    if (inputvalue.value == '' || inputvalue.value.length < 3) {
        inputvalue.placeholder = 'Please enter a task with at least 3 characters.'
        inputvalue.classList.add('validationError')
        setTimeout(() => {
            inputvalue.classList.remove('validationError')
            inputvalue.placeholder = ''
        }, 2000)
        return
    }

    let newTask = createTaskElement(inputvalue.value)
    taskList.appendChild(newTask, addRemoveButton(newTask))
    console.log(newTask)

    //create tasks constant from local storage value tasks or an empty array
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.push({text:inputvalue.value})
    localStorage.setItem('tasks', JSON.stringify(tasks))

    inputvalue.value = ''
}

// here we load the existing tasks from local storage
window.onload = function () {
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    for (let task of tasks) {
        let newTask = createTaskElement(task.text)
        console.log(newTask)
        taskList.appendChild(newTask, addRemoveButton(newTask))
    }
}