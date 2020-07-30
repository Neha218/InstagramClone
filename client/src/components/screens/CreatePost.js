import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title,
          body,
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
              html: "Post Created Successfully!",
              classes: "#4caf50 green"
            });
            history.push("/");
          }
        });
    }
  }, [url]);

  const CreatePostData = async () => {
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
    <div className="card input-field createpost-card">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Caption"
        value={body}
        onChange={e => setBody(e.target.value)}
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
            placeholder="Upload one or more files"
          />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #42a5f5 blue lighten-1"
        onClick={() => CreatePostData()}
      >
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
