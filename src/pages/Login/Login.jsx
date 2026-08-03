import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Email is required").email("Please enter a valid email address (containing @)"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters long"),
});

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const result = loginSchema.safeParse({ username, password });
    
    if (!result.success) {
      const errMsg = result.error.errors[0].message;
      setErrors({ form: errMsg });
      return;
    }

    setErrors({});

    // Simulate successful login and navigate to the dashboard page
    navigate("/home");
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

        <button type="submit">Login</button>

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;