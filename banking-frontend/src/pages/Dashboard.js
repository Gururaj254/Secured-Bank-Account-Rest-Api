import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAccounts,
  deposit,
  withdraw,
  deleteAccount,
  addAccount,
} from "../services/accountService";

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [view, setView] = useState("menu"); // "menu", "list", "create"
  const [newName, setNewName] = useState("");
  const [newBalance, setNewBalance] = useState("");
  
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

  // --- Transaction Logic (The missing functions) ---

  const handleDeposit = async (id) => {
    const amount = prompt("Enter amount to deposit (₹):");
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    try {
      await deposit(id, parseFloat(amount));
      alert("Deposit successful!");
      loadAccounts();
    } catch (err) {
      alert("Deposit failed. Check backend.");
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
    <div style={headerStyle}>
      <h2 style={{ margin: 0 }}>🏦 Guru Bank</h2>
      <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
    </div>
  );

  const WelcomeMenu = () => (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1 style={{ color: "#2c3e50", fontSize: "36px" }}>Welcome, {currentUser}!</h1>
      <p style={{ color: "#7f8c8d", fontSize: "18px", marginBottom: "40px" }}>
        What would you like to manage today?
      </p>
      <div style={{ display: "flex", gap: "25px", justifyContent: "center" }}>
        <button onClick={() => setView("list")} style={actionBtnStyle("#3498db")}>
          🔍 View All Accounts
        </button>
        <button onClick={() => setView("create")} style={actionBtnStyle("#2ecc71")}>
          ➕ Create New Account
        </button>
      </div>
    </div>
  );

  const CreateForm = () => (
    <div style={formContainerStyle}>
      <button onClick={() => setView("menu")} style={backBtnStyle}>⬅ Back to Menu</button>
      <h2 style={{ marginTop: "30px", color: "#2c3e50" }}>Open New Account</h2>
      <form onSubmit={handleAddAccount} style={formStyle}>
        <input 
          style={inputStyle} 
          placeholder="Account Holder Name" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
        />
        <input 
          style={inputStyle} 
          type="number" 
          placeholder="Initial Deposit (₹)" 
          value={newBalance} 
          onChange={(e) => setNewBalance(e.target.value)} 
        />
        <button type="submit" style={actionBtnStyle("#2ecc71")}>Confirm & Open</button>
      </form>
    </div>
  );

  const AccountList = () => (
    <div style={{ padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <button onClick={() => setView("menu")} style={backBtnStyle}>⬅ Back to Menu</button>
        <h2 style={{ textAlign: "center", marginBottom: "40px", color: "#2c3e50" }}>Your Registered Accounts</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
          {accounts.map((acc) => (
            <div key={acc.id} style={cardStyle}>
              <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>👤 {acc.accountHolderName}</h3>
              <p style={{ margin: "5px 0", color: "#95a5a6" }}>ID: {acc.id}</p>
              <p style={{ margin: "10px 0", fontSize: "22px", color: "#27ae60", fontWeight: "bold" }}>
                ₹{acc.balance.toLocaleString()}
              </p>
              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button onClick={() => handleDeposit(acc.id)} style={opBtnStyle("#3498db")}>Deposit</button>
                <button onClick={() => handleWithdraw(acc.id)} style={opBtnStyle("#f39c12")}>Withdraw</button>
                <button onClick={() => handleDelete(acc.id)} style={opBtnStyle("#e74c3c")}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Header />
      {view === "menu" && <WelcomeMenu />}
      {view === "create" && <CreateForm />}
      {view === "list" && <AccountList />}
    </div>
  );
}

// --- Styles (Same as before) ---
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 40px", backgroundColor: "#2c3e50", color: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" };
const logoutBtnStyle = { backgroundColor: "transparent", border: "1px solid #ecf0f1", color: "white", padding: "6px 15px", borderRadius: "5px", cursor: "pointer" };
const formContainerStyle = { maxWidth: "450px", margin: "60px auto", padding: "20px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "15px", backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.05)" };
const actionBtnStyle = (bgColor) => ({ backgroundColor: bgColor, color: "white", border: "none", padding: "18px 35px", borderRadius: "10px", cursor: "pointer", fontSize: "17px", fontWeight: "bold", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" });
const backBtnStyle = { background: "none", border: "1px solid #95a5a6", color: "#7f8c8d", padding: "8px 15px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", fontSize: "16px" };
const cardStyle = { border: "none", borderRadius: "15px", padding: "25px", width: "320px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", backgroundColor: "white" };
const opBtnStyle = (bg) => ({ backgroundColor: bg, color: "white", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", flex: 1, fontWeight: "600", fontSize: "14px" });

export default Dashboard;