import { useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log(username, password); // debug

      const res = await API.post("/api/auth/login", {
        username: username,
        password: password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard"); 
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;