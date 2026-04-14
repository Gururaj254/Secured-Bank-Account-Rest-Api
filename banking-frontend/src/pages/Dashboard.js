import { useEffect, useState } from "react";
import {
  getAccounts,
  deposit,
  withdraw,
  deleteAccount,
} from "../services/accountService";

function Dashboard() {
  const [accounts, setAccounts] = useState([]);

  const loadAccounts = async () => {
    try {
      const res = await getAccounts();
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleDeposit = async (id) => {
    const amount = prompt("Enter amount:");
    if (!amount) return;
    await deposit(id, amount);
    loadAccounts();
  };

  const handleWithdraw = async (id) => {
    const amount = prompt("Enter amount:");
    if (!amount) return;
    await withdraw(id, amount);
    loadAccounts();
  };

  const handleDelete = async (id) => {
    await deleteAccount(id);
    loadAccounts();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>🏦 Bank Accounts</h2>

      {accounts.map((acc) => (
        <div
          key={acc.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            margin: "15px auto",
            width: "350px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* Holder Name */}
          <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
            👤 {acc.name}
          </h3>

          {/* Account ID */}
          <p style={{ margin: "5px 0" }}>
            <b>Account ID:</b> {acc.id}
          </p>

          {/* Balance */}
          <p style={{ margin: "5px 0", fontSize: "18px", color: "green" }}>
            <b>Balance:</b> ₹{acc.balance}
          </p>

          {/* Buttons */}
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => handleDeposit(acc.id)}>Deposit</button>
            <button onClick={() => handleWithdraw(acc.id)} style={{ marginLeft: "5px" }}>
              Withdraw
            </button>
            <button onClick={() => handleDelete(acc.id)} style={{ marginLeft: "5px", color: "red" }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;