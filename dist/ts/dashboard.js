"use strict";
function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}
function getLoggedUser() {
    const lastEmail = localStorage.getItem("lastEmail");
    const user = getUsers().find(u => u.email === lastEmail);
    if (!user) {
        window.location.href = "index.html";
        throw new Error("Usuário não encontrado.");
    }
    return user;
}
function updateLoggedUser(updatedUser) {
    const users = getUsers();
    const index = users.findIndex(u => u.email === updatedUser.email);
    if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const user = getLoggedUser();
    const welcomeEl = document.getElementById("welcome");
    const userEmailEl = document.getElementById("userEmail");
    const logoutBtn = document.getElementById("logout");
    const todoForm = document.getElementById("todoForm");
    const todoTitleInput = document.getElementById("todoTitle");
    const todoPrioritySelect = document.getElementById("todoPriority");
    const todoListEl = document.getElementById("todoList");
    welcomeEl.textContent = `Bem-vindo`;
    userEmailEl.textContent = `Seu e-mail cadastrado é: ${user.email}`;
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("lastEmail");
        window.location.href = "index.html";
    });
    function getPriorityEmoji(priority) {
        switch (priority) {
            case "alta": return "🔴 Alta";
            case "media": return "🟡 Média";
            case "baixa": return "🟢 Baixa";
        }
    }
    function renderTodos() {
        todoListEl.innerHTML = "";
        const sortedTodos = [...user.todos].sort((a, b) => ({ alta: 1, media: 2, baixa: 3 }[a.priority] - { alta: 1, media: 2, baixa: 3 }[b.priority]));
        sortedTodos.forEach(todo => {
            const li = document.createElement("li");
            const span = document.createElement("span");
            span.textContent = `${todo.title} - ${getPriorityEmoji(todo.priority)}`;
            span.style.textDecoration = todo.done ? "line-through" : "none";
            span.style.flexGrow = "1";
            li.appendChild(span);
            li.addEventListener("click", () => {
                todo.done = !todo.done;
                updateLoggedUser(user);
                renderTodos();
            });
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "✖";
            removeBtn.addEventListener("click", e => {
                e.stopPropagation();
                user.todos = user.todos.filter(t => t.id !== todo.id);
                updateLoggedUser(user);
                renderTodos();
            });
            li.appendChild(removeBtn);
            todoListEl.appendChild(li);
        });
    }
    todoForm.addEventListener("submit", e => {
        e.preventDefault();
        const title = todoTitleInput.value.trim();
        const priority = todoPrioritySelect.value;
        if (!title)
            return;
        user.todos.push({ id: Date.now().toString(), title, priority, done: false });
        updateLoggedUser(user);
        renderTodos();
        todoTitleInput.value = "";
        todoPrioritySelect.value = "media";
    });
    todoTitleInput.oninvalid = (e) => {
        e.preventDefault();
        alert("Por favor, preencha o campo da tarefa!");
    };
    renderTodos();
});
