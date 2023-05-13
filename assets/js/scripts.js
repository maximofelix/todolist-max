// Seleção de elementos
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const editForm = document.getElementById("edit-form");
const editInput = document.getElementById("edit-input");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const toolbar = document.getElementById("areatoolbar");

// Funções
// filtro = pessoas.find((pes) => pes.login.contains(pessoa.login));
// const index = pessoas.findIndex((pes) => pes.login ==  login);
// window.location.href = "../";
//const query = window.location.search;
//const param = new URLSearchParams(query);
//const _login = param.get('login');
function generate_uuidv4() {
    var dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function( c ) {
       var rnd = Math.random() * 16;//random number in range 0 to 16
       rnd = (dt + rnd)%16 | 0;
       dt = Math.floor(dt/16);
       return (c === 'x' ? rnd : (rnd & 0x3 | 0x8)).toString(16);
    });
 }

class Tarefa {
    constructor(titulo) {
        this.id = generate_uuidv4(), 
        this.titulo = titulo;
        this.dtCadastro = Date.now(),
        this.dtLimite = null,
        this.dtInicio = null,
        this.dtEntrega = null,
        this.concluida = false;
    }
    // Status 1:Aberta, 2:Concluida, 3:Cancelada, 5:Atrasada
}

const saveTodo = (tarefa) => {
    
    const task = new Tarefa(tarefa);
    const tasks = JSON.parse(localStorage.getItem("todolistmax")) || [];
    tasks.push(task);
    localStorage.setItem("todolistmax", JSON.stringify(tasks))
    return task;
}

const removeTodo = (tarefaId) => {
    const tasks = JSON.parse(localStorage.getItem("todolistmax")) || [];
    const novatasks = tasks.filter(t => (t.id != tarefaId));
    localStorage.setItem("todolistmax", JSON.stringify(novatasks))
}

const carregarItens = () => {
    const tasks = JSON.parse(localStorage.getItem("todolistmax")) || [];
    tasks.forEach(task => {
        carregarItemNaGrade(task)
    });
}

const carregarItemNaGrade = (tarefa) => {     
    const todo = document.createElement("div")
    todo.classList.add("todo")
    if (tarefa.concluida){
        todo.classList.add("done")
    }

    const todoTitle = document.createElement("h3")
    todoTitle.innerText = tarefa.titulo
    todoTitle.name  = 'h3-task-titulo'
    todo.appendChild(todoTitle)

    const todoId = document.createElement('input')
    todoId.type = 'text'
    todoId.value = tarefa.id
    todoId.name = 'hid-id'
    todo.appendChild(todoId)

    const doneBtn = document.createElement('button')
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)
    
    const editBtn = document.createElement('button')
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)
    
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add("remove-todo")
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn)

    todoList.appendChild(todo)
    todoInput.value = ""
    todoInput.focus()
}

const toggleForms = () =>{
    editForm.classList.toggle('hide')
    todoForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
    toolbar.classList.toggle('hide')
}

// Eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = todoInput.value;
    if (inputValue){
        const task = saveTodo(inputValue);
        carregarItemNaGrade(task)
    }
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoId;
    let todoTitle;

    console.log(targetEl)
    console.log(parentEl)
    if (parentEl && parentEl.querySelector('h3')){
        todoTitle = parentEl.querySelector('h3')
        console.log(todoTitle.innerText)
        todoId = parentEl.querySelector('input')
        console.log(todoId.value)

    }

    if (targetEl.classList.contains('finish-todo')) {
        parentEl.classList.toggle('done');
    }

    if (targetEl.classList.contains('remove-todo')){
        removeTodo(todoId)
        parentEl.remove();
    }

    if (targetEl.classList.contains('edit-todo')){
        toggleForms();
    }
});

cancelEditBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    toggleForms()
});