import { useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);

    try {
      const res = await API.post("/api/auth/login", {
        username: username,
        password: password,
      });

      // Store token for API calls
      localStorage.setItem("token", res.data.token);
      
      // Store username to show "Welcome to Dashboard, [Name]"
      localStorage.setItem("username", username);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={loginCardStyle}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "50px", margin: "0" }}>🏦</h1>
          <h2 style={{ color: "#2c3e50", margin: "10px 0" }}>Secure Login</h2>
          <p style={{ color: "#7f8c8d" }}>Enter your credentials to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input
              style={inputStyle}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={loginButtonStyle(loading)}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Styles ---
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f4f7f6",
  fontFamily: "Arial, sans-serif",
};

const loginCardStyle = {
  backgroundColor: "#fff",
  padding: "40px",
  borderRadius: "15px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "400px",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#34495e",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "16px",
  outline: "none",
};

const loginButtonStyle = (loading) => ({
  backgroundColor: loading ? "#bdc3c7" : "#3498db",
  color: "white",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: loading ? "not-allowed" : "pointer",
  marginTop: "10px",
  transition: "background-color 0.3s",
});

export default Login;