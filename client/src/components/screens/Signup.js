import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const SignupData = async () => {
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
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
          M.toast({ html: jsonResponse.msg, classes: "#4caf50 green" });
          history.push("/login");
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
          placeholder="name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
          onClick={() => SignupData()}
        >
          Signup
        </button>
        <h5>
          <Link to="/login">Already have an Account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
