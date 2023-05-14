let todoEditId = 0;
// Seleção de elementos
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const editForm = document.getElementById("edit-form");
const editInput = document.getElementById("edit-input");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const toolbar = document.getElementById("areatoolbar");
const searchInput = document.getElementById("search-input");
const filtrarSelect = document.getElementById("filter-select");

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

const obterTodoList =() => {
    let tasks = JSON.parse(localStorage.getItem("todolistmax")) || [];
    return tasks;
}

const marcarTodo = (todoId) => {
    const tasks = obterTodoList();
    let objIndex = tasks.findIndex(obj => obj.id == todoId); // todoEditId));
    tasks[objIndex].concluida = !tasks[objIndex].concluida
    localStorage.setItem("todolistmax", JSON.stringify(tasks))

    // //let tasks = obterTodoList();
    // const tasks = JSON.parse(localStorage.getItem("todolistmax")) || [];
    // console.log('obterTodo > ' + tasks)
    // let task = tasks.filter(o => o.id == todoId);
    
    

     return tasks[objIndex];
}

const saveTodoAdd = (tarefa) => {
    const task = new Tarefa(tarefa);
    const tasks = obterTodoList();
    tasks.push(task);
    localStorage.setItem("todolistmax", JSON.stringify(tasks))
    return task;
}

const saveTodoEdit = (tarefa) => {
    const tasks = obterTodoList();
    let objIndex = tasks.findIndex(obj => obj.id == tarefa.id); // todoEditId));

    // console.log(tarefa.id);
    // console.log(objIndex);

   tasks[objIndex].titulo= tarefa.titulo
   tasks[objIndex].concluida= tarefa.concluida
   localStorage.setItem("todolistmax", JSON.stringify(tasks))
    return tasks[objIndex];

    // const tasks = obterTodoList();
    // const tasksNova = tasks.filter(t => t.id != todoEditId);
    // let taskEdit = tasks.filter(t => t.id == todoEditId);
    // taskEdit.titulo = task.titulo;
    // taskEdit.concluida = task.concluida;
    // tasksNova.push(task);
    // localStorage.setItem("todolistmax", JSON.stringify(tasksNova))
    // return taskEdit;
}

const removeTodo = (tarefaId) => {
    const tasks = obterTodoList()
    const novatasks = tasks.filter(t => (t.id != tarefaId));
    localStorage.setItem("todolistmax", JSON.stringify(novatasks))
}

const limparGrid = () => {
    let itens = todoList.querySelectorAll('div');
    let tam = itens.length;
    while (tam > 0){
        itens[tam-1].remove();
        tam--;
    }
}

// const filtrarItens = (termo) => {
//     limparGrid();
//     const tasks = obterTodoList();
//     let filtro = tasks.filter(function (str) { return str.titulo.includes(termo); });


//     console.log(filtro.length)
//     filtro.forEach(task => {
//         carregarItemNaGrade(task)
//     });
// }

const carregarItens = () => {
    limparGrid();
    let tasks = obterTodoList();

    // Filtrar por texto digitado
    if (searchInput.value != ''){
        tasks = tasks.filter(function (str) { return str.titulo.includes(searchInput.value); });
    }

    // Filtrar pelo select de completo
    const filtro = filtrarSelect.options[filtrarSelect.selectedIndex];
    console.log('filtro.value...: ' + filtro.value)
    console.log('filtro.text....: ' + filtro.text)
    switch (filtro.value){
        case 'all':
            console.log('todos')
            break;
        case 'done':
            console.log('feitos')
            tasks = tasks.filter(item => item.concluida)
            break;
        case 'todo':
            console.log('A fazer');
            tasks = tasks.filter(item => !item.concluida)
            break;
    }
    console.log('filtrado.: ' + tasks.length);
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
    todoId.type = 'hidden'
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
        const task = saveTodoAdd(inputValue);
        carregarItens()
    }
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let task = new Tarefa(editInput.value)
    task.id = todoEditId;
    task = saveTodoEdit(task)
    carregarItens();
    toggleForms()
});

document.addEventListener("click", (e) => {
    e.preventDefault();
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoId;
    let todoTitle;

    if (parentEl && parentEl.querySelector('h3')){
        todoTitle = parentEl.querySelector('h3')
        todoId = parentEl.querySelector('input')
    }

    if (targetEl.classList.contains('finish-todo')) {
        marcarTodo(todoId.value);
        carregarItens();
    }

    if (targetEl.classList.contains('remove-todo')){
        removeTodo(todoId.value)
        carregarItens();
    }

    if (targetEl.classList.contains('edit-todo')){
        todoEditId = todoId.value;
        editInput.value = todoTitle.innerText;
        toggleForms();
    }
});

cancelEditBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    toggleForms()
});

toolbar.addEventListener("submit", (e) =>{
    e.preventDefault();
    carregarItens();
    //filtrarItens(searchInput.value)
})