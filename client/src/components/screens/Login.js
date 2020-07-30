import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";
const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const LoginData = async () => {
    try {
      const response = await fetch("/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      if (response) {
        const jsonResponse = await response.json();
        if (jsonResponse.error)
          M.toast({
            html: jsonResponse.error,
            classes: "#ef5350 red lighten-1"
          });
        else {
          localStorage.setItem("jwt", jsonResponse.token);
          localStorage.setItem("user", JSON.stringify(jsonResponse.user));
          dispatch({ type: "USER", payload: jsonResponse.user });
          M.toast({
            html: "Signed in Successfully!",
            classes: "#4caf50 green"
          });
          history.push("/");
        }
      } else console.log("No response received!");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #42a5f5 blue lighten-1"
          onClick={() => LoginData()}
        >
          Login
        </button>
        <h5>
          <Link to="/signup">Don't have an Account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Login;
