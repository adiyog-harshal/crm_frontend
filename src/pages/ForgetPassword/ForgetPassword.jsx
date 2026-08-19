import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './ForgetPassword.css'
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const result = forgotPasswordSchema.safeParse({ email });
    
    if (!result.success) {
      const errMsg = result.error.errors[0].message;
      setError(errMsg);
      setSuccess(false);
      return;
    }

    setError("");
    setSuccess(true);
  };

  return (
     <div className="forgot-container"> 
         <form className="forgot-form" onSubmit={handleSubmit}>
             <h2>Forgot Password</h2>
             <p className="description">
                 Enter your email address and we'll send you a password reset link.
             </p>
             {error && <div className="form-error-banner">{error}</div>}
             {success && <div className="success-message">Reset link sent! Please check your inbox.</div>}
             <div className="input-group">
          <label>Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
              if (success) setSuccess(false);
            }}
            required
          />
          </div>
           <button type="submit">Send Reset Link</button>

          <div className="back-login">
            <Link to="/">← Back to Login</Link>
          </div>

         </form>
     </div>
  )
}

export default ForgetPassword;