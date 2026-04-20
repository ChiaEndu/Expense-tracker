const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const date = document.getElementById("date");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addTransaction(e) {
  e.preventDefault();

  if (text.value === "" || amount.value === "") return;

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    date: date.value || new Date().toLocaleDateString()
  };

  transactions.push(transaction);
  saveTransactions();
  updateUI();

  text.value = "";
  amount.value = "";
  date.value = "";
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveTransactions();
  updateUI();
}

function updateUI() {
  list.innerHTML = "";

  transactions.forEach(addToDOM);

  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const inc = amounts
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);
  const exp = (
    amounts
      .filter(val => val < 0)
      .reduce((acc, val) => acc + val, 0) * -1
  ).toFixed(2);

  balance.textContent = `$${total}`;
  income.textContent = `+$${inc}`;
  expense.textContent = `-$${exp}`;
}

function addToDOM(transaction) {
  const li = document.createElement("li");

  li.classList.add(transaction.amount > 0 ? "plus" : "minus");

  li.innerHTML = `
    ${transaction.text} 
    <span>${transaction.date}</span>
    <span>${transaction.amount > 0 ? "+" : "-"}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(li);
}

updateUI();

form.addEventListener("submit", addTransaction);