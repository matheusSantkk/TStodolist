class User {
    email: string;
    senha: string;
    todos: Todo[];

    constructor(email: string, senha: string) {
        this.email = email;
        this.senha = senha;
        this.todos = [];
    }
}

interface Todo {
    id: string;
    title: string;
    priority: "alta" | "media" | "baixa";
    done: boolean;
}

const COLORS = { success: "green" as const, error: "red" as const };

function getAppUsers(): User[] {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveAppUsers(users: User[]): void {
    localStorage.setItem("users", JSON.stringify(users));
}

function showMessage(resEl: HTMLDivElement, message: string, color: "red" | "green") {
    resEl.innerHTML = `<span style="color:${color}">${message}</span>`;
}

function validateInputs(email: string, senha: string, resEl: HTMLDivElement) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!email || !senha) {
        showMessage(resEl, "E-mail ou senha não podem estar vazios!", COLORS.error);
        return false;
    }
    if (!emailRegex.test(email)) {
        showMessage(resEl, "Digite um e-mail válido terminando em .com!", COLORS.error);
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.querySelector<HTMLInputElement>("#email");
    const senhaInput = document.querySelector<HTMLInputElement>("#senha");
    const loginBtn = document.querySelector<HTMLButtonElement>("#loginBtn");
    const registerBtn = document.querySelector<HTMLButtonElement>("#registerBtn");
    const res = document.querySelector<HTMLDivElement>("#res");
    if (!emailInput || !senhaInput || !loginBtn || !registerBtn || !res) return;

    const lastEmail = localStorage.getItem("lastEmail");
    if (lastEmail) emailInput.value = lastEmail;

    loginBtn.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        if (!validateInputs(email, senha, res)) return;

        const users = getAppUsers();
        const user = users.find(u => u.email === email);

        if (!user) showMessage(res, "E-mail não cadastrado!", COLORS.error);
        else if (user.senha !== senha) showMessage(res, "Senha incorreta!", COLORS.error);
        else {
            localStorage.setItem("lastEmail", user.email);
            showMessage(res, "Login realizado! Redirecionando...", COLORS.success);
            setTimeout(() => window.location.href = "dashboard.html", 1000);
        }
    });

    registerBtn.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        if (!validateInputs(email, senha, res)) return;

        const users = getAppUsers();
        if (users.some(u => u.email === email)) {
            showMessage(res, "E-mail já cadastrado!", COLORS.error);
            return;
        }

        const newUser = new User(email, senha);
        users.push(newUser);
        saveAppUsers(users);

        localStorage.setItem("lastEmail", newUser.email);
        showMessage(res, "Cadastro realizado! Redirecionando...", COLORS.success);
        setTimeout(() => window.location.href = "dashboard.html", 1000);
    });
});
