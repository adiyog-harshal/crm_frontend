import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
  username: z.string().min(1, "Email is required").email("Please enter a valid email address (containing @)"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters long"),
});


const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const result = await login(username, password);

      console.log("LOGIN SUCCESS:", result);

      if (result) {
        navigate("/home");
      }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    console.error("BACKEND ERROR:", error.response?.data);
  
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="brand-subtitle">Adiyog CRM</div>
        
        {errors.form && <div className="form-error-banner">{errors.form}</div>}

        <div className="input-group">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="username"
            placeholder="Enter Email"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.form) setErrors({});
            }}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.form) setErrors({});
            }}
            required
          />
        </div>

        <button 
          type="submit"
          className="login-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loader"></span>
              Logging in....
            </>
          ) : (
            "Login"
          )
        }
          
        </button>

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;