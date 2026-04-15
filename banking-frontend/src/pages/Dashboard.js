import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; 
import {
  getAccounts,
  deposit,
  withdraw,
  deleteAccount,
  addAccount,
  getTransactionHistory, 
} from "../services/accountService";

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]); // New state for history
  const [view, setView] = useState("menu"); // "menu", "list", "create", "history"
  const [newName, setNewName] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const [selectedAccountName, setSelectedAccountName] = useState("");

  const navigate = useNavigate();
  const currentUser = localStorage.getItem("username") || "User";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      loadAccounts();
    }
  }, [navigate]);

  const loadAccounts = async () => {
    try {
      const res = await getAccounts();
      setAccounts(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // --- Transaction Logic ---

  const handleDeposit = async (id) => {
    const amount = prompt("Enter amount to deposit (₹):");
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    try {
      await deposit(id, parseFloat(amount));
      alert("Deposit successful!");
      loadAccounts();
    } catch (err) {
      alert("Deposit failed.");
    }
  };

  const handleWithdraw = async (id) => {
    const amount = prompt("Enter amount to withdraw (₹):");
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    try {
      await withdraw(id, parseFloat(amount));
      alert("Withdrawal successful!");
      loadAccounts();
    } catch (err) {
      alert("Withdrawal failed. Check balance.");
    }
  };

  const handleViewHistory = async (id, name) => {
    try {
      const res = await getTransactionHistory(id);
      setTransactions(res.data);
      setSelectedAccountName(name);
      setView("history");
    } catch (err) {
      alert("Could not load transaction history.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await deleteAccount(id);
        alert("Account deleted.");
        loadAccounts();
      } catch (err) {
        alert("Could not delete account.");
      }
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!newName || !newBalance) return alert("Please fill all fields");
    try {
      await addAccount({ accountHolderName: newName, balance: parseFloat(newBalance) });
      alert("Account Created Successfully!");
      setNewName("");
      setNewBalance("");
      setView("menu");
      loadAccounts();
    } catch (err) {
      alert("Failed to create account.");
    }
  };

  // --- UI Components ---

  const Header = () => (
    <div className="header">
      <h2 style={{ margin: 0 }}>🏦 Guru Bank</h2>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );

  const WelcomeMenu = () => (
    <div className="menu-container">
      <h1 className="menu-title">Welcome, {currentUser}!</h1>
      <p className="menu-subtitle">What would you like to manage today?</p>
      <div className="btn-group">
        <button onClick={() => setView("list")} className="btn-action bg-blue">
          🔍 View All Accounts
        </button>
        <button onClick={() => setView("create")} className="btn-action bg-green">
          ➕ Create New Account
        </button>
      </div>
    </div>
  );

  const CreateForm = () => (
    <div className="form-wrapper">
      <button onClick={() => setView("menu")} className="btn-back">⬅ Back to Menu</button>
      <h2 style={{ marginTop: "30px", color: "#2c3e50" }}>Open New Account</h2>
      <form onSubmit={handleAddAccount} className="account-form">
        <input 
          className="input-field" 
          placeholder="Account Holder Name" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
        />
        <input 
          className="input-field" 
          type="number" 
          placeholder="Initial Deposit (₹)" 
          value={newBalance} 
          onChange={(e) => setNewBalance(e.target.value)} 
        />
        <button type="submit" className="btn-action bg-green">Confirm & Open</button>
      </form>
    </div>
  );

  const HistoryTable = () => (
    <div className="list-container">
      <div className="list-inner">
        <button onClick={() => setView("list")} className="btn-back">⬅ Back to Accounts</button>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#2c3e50" }}>
          History for {selectedAccountName}
        </h2>
        <div className="history-card">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Closing Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td className={tx.type === 'DEPOSIT' ? 'type-deposit' : 'type-withdraw'}>
                    {tx.type}
                  </td>
                  <td>₹{tx.amount.toLocaleString()}</td>
                  <td>₹{tx.postBalance.toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AccountList = () => (
    <div className="list-container">
      <div className="list-inner">
        <button onClick={() => setView("menu")} className="btn-back">⬅ Back to Menu</button>
        <h2 style={{ textAlign: "center", marginBottom: "40px", color: "#2c3e50" }}>Your Registered Accounts</h2>
        <div className="card-grid">
          {accounts.map((acc) => (
            <div key={acc.id} className="account-card">
              <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>👤 {acc.accountHolderName}</h3>
              <p style={{ margin: "5px 0", color: "#95a5a6" }}>ID: {acc.id}</p>
              <p className="balance-text">₹{acc.balance.toLocaleString()}</p>
              <div className="card-actions">
                <button onClick={() => handleDeposit(acc.id)} className="btn-op bg-blue">Deposit</button>
                <button onClick={() => handleWithdraw(acc.id)} className="btn-op bg-orange">Withdraw</button>
                <button onClick={() => handleViewHistory(acc.id, acc.accountHolderName)} className="btn-op bg-green">History</button>
                <button onClick={() => handleDelete(acc.id)} className="btn-op bg-red">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <Header />
      {view === "menu" && <WelcomeMenu />}
      {view === "create" && <CreateForm />}
      {view === "list" && <AccountList />}
      {view === "history" && <HistoryTable />}
    </div>
  );
}

export default Dashboard;