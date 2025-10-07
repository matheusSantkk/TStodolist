interface Todo {
    id: string;
    title: string;
    priority: "alta" | "media" | "baixa";
    done: boolean;
}

interface UserWithTodos {
    email: string;
    senha: string;
    todos: Todo[];
}

function getUsers(): UserWithTodos[] {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users: UserWithTodos[]): void {
    localStorage.setItem("users", JSON.stringify(users));
}

function getLoggedUser(): UserWithTodos {
    const lastEmail = localStorage.getItem("lastEmail");
    const user = getUsers().find(u => u.email === lastEmail);
    if (!user) {
        window.location.href = "index.html";
        throw new Error("Usuário não encontrado.");
    }
    return user;
}

function updateLoggedUser(updatedUser: UserWithTodos): void {
    const users = getUsers();
    const index = users.findIndex(u => u.email === updatedUser.email);
    if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const user = getLoggedUser();

    const welcomeEl = document.getElementById("welcome") as HTMLHeadingElement;
    const userEmailEl = document.getElementById("userEmail") as HTMLParagraphElement;
    const logoutBtn = document.getElementById("logout") as HTMLButtonElement;
    const todoForm = document.getElementById("todoForm") as HTMLFormElement;
    const todoTitleInput = document.getElementById("todoTitle") as HTMLInputElement;
    const todoPrioritySelect = document.getElementById("todoPriority") as HTMLSelectElement;
    const todoListEl = document.getElementById("todoList") as HTMLUListElement;

    welcomeEl.textContent = `Bem-vindo`;
    userEmailEl.textContent = `Seu e-mail cadastrado é: ${user.email}`;

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("lastEmail");
        window.location.href = "index.html";
    });

    function getPriorityEmoji(priority: "alta" | "media" | "baixa") {
        switch(priority) {
            case "alta": return "🔴 Alta";
            case "media": return "🟡 Média";
            case "baixa": return "🟢 Baixa";
        }
    }

    function renderTodos() {
        todoListEl.innerHTML = "";

        const sortedTodos = [...user.todos].sort(
            (a, b) => ({ alta: 1, media: 2, baixa: 3 }[a.priority] - { alta: 1, media: 2, baixa: 3 }[b.priority])
        );

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
        const priority = todoPrioritySelect.value as "alta" | "media" | "baixa";
        if (!title) return;

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
