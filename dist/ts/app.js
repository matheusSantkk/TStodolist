"use strict";
class User {
    constructor(email, senha) {
        this.email = email;
        this.senha = senha;
        this.todos = [];
    }
}
const COLORS = { success: "green", error: "red" };
function getAppUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveAppUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}
function showMessage(resEl, message, color) {
    resEl.innerHTML = `<span style="color:${color}">${message}</span>`;
}
function validateInputs(email, senha, resEl) {
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
    const emailInput = document.querySelector("#email");
    const senhaInput = document.querySelector("#senha");
    const loginBtn = document.querySelector("#loginBtn");
    const registerBtn = document.querySelector("#registerBtn");
    const res = document.querySelector("#res");
    if (!emailInput || !senhaInput || !loginBtn || !registerBtn || !res)
        return;
    const lastEmail = localStorage.getItem("lastEmail");
    if (lastEmail)
        emailInput.value = lastEmail;
    loginBtn.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        if (!validateInputs(email, senha, res))
            return;
        const users = getAppUsers();
        const user = users.find(u => u.email === email);
        if (!user)
            showMessage(res, "E-mail não cadastrado!", COLORS.error);
        else if (user.senha !== senha)
            showMessage(res, "Senha incorreta!", COLORS.error);
        else {
            localStorage.setItem("lastEmail", user.email);
            showMessage(res, "Login realizado! Redirecionando...", COLORS.success);
            setTimeout(() => window.location.href = "dashboard.html", 1000);
        }
    });
    registerBtn.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        if (!validateInputs(email, senha, res))
            return;
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
