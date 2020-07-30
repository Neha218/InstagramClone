import React, { Component, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

const Modal = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const history = useHistory();
  useEffect(() => {
    if (url) {
      fetch("/updateprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          name,
          email,
          password,
          pic: url
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            M.toast({
              html: data.error,
              classes: "#ef5350 red lighten-1"
            });
          } else {
            M.toast({
              html: "Profile Updated Successfully!",
              classes: "#4caf50 green"
            });
            history.push("/profile");
          }
        });
    }
  }, [url]);

  useEffect(() => {
    const options = {
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissible: false,
      startingTop: "4%",
      endingTop: "10%"
    };
    M.Modal.init(this.Modal, options);

    // let instance = M.Modal.getInstance(this.Modal);
    // instance.open();
    // instance.close();
    // instance.destroy();
  }, []);

  const UpdateProfileData = async () => {
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "InstagramClone");
      data.append("cloud_name", "nbcloud");
      var response = await fetch(
        "https://api.cloudinary.com/v1_1/nbcloud/image/upload",
        {
          method: "POST",
          body: data
        }
      );

      if (response) {
        const jsonResponse = await response.json();
        setUrl(jsonResponse.url);
      } else console.log("No response received!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <a
        className="waves-effect waves-light btn #90caf9 blue lighten-3 modal-trigger profile-img-update"
        data-target="modal1"
      >
        Update
      </a>

      <div
        ref={Modal => {
          this.Modal = Modal;
        }}
        id="modal1"
        className="modal"
      >
        {/* If you want Bottom Sheet Modal then add 
                        bottom-sheet class to the "modal" div
                        If you want Fixed Footer Modal then add
                        modal-fixed-footer to the "modal" div*/}
        <div className="modal-content">
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

          <div className="file-field input-field">
            <div className="btn #90caf9 blue lighten-3">
              <span>Upload</span>
              <input type="file" onChange={e => setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
              <input
                className="file-path validate"
                type="text"
                placeholder="Upload"
              />
            </div>
          </div>
          <button
            className="btn waves-effect waves-light #42a5f5 blue lighten-1"
            onClick={() => UpdateProfileData()}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
