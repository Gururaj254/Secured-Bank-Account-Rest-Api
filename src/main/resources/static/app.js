const BASE_URL = "http://localhost:8080/api/accounts";

// Load all accounts on page load
window.onload = loadAccounts;

function loadAccounts() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("accountTable");
            table.innerHTML = "";
            data.forEach(acc => {
                table.innerHTML += `
                    <tr>
                        <td>${acc.id}</td>
                        <td>${acc.accountHolderName}</td>
                        <td>₹ ${acc.balance}</td>
                        <td>
                            <button class="danger" onclick="deleteAccount(${acc.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
            });
        });
}

function createAccount() {
    const name = document.getElementById("name").value;
    const balance = document.getElementById("balance").value;

    fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            accountHolderName: name,
            balance: balance
        })
    }).then(() => {
        loadAccounts();
        alert("Account Created Successfully");
    });
}

function deposit() {
    const id = document.getElementById("accId").value;
    const amount = document.getElementById("amount").value;

    fetch(`${BASE_URL}/${id}/deposit?amount=${amount}`, {
        method: "PUT"
    }).then(() => {
        loadAccounts();
        alert("Amount Deposited");
    });
}

function withdraw() {
    const id = document.getElementById("accId").value;
    const amount = document.getElementById("amount").value;

    fetch(`${BASE_URL}/${id}/withdraw?amount=${amount}`, {
        method: "PUT"
    }).then(() => {
        loadAccounts();
        alert("Amount Withdrawn");
    });
}

function deleteAccount(id) {
    fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    }).then(() => {
        loadAccounts();
        alert("Account Deleted");
    });
}
