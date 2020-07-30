import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
// import { stat } from "fs";
import M from "materialize-css";

const Profile = () => {
  const [pics, setPics] = useState([]);
  const [image, setImage] = useState("");
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/myposts  ", {
          headers: {
            "x-auth-token": localStorage.getItem("jwt")
          }
        });
        const jsonResponse = await response.json();
        setPics(jsonResponse.myPosts);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [pics]);

  useEffect(() => {
    if (image) {
      async function update() {
        try {
          const data = new FormData();
          data.append("file", image);
          data.append("upload_preset", "InstagramClone");
          data.append("cloud_name", "nbcloud");
          const response = await fetch(
            "https://api.cloudinary.com/v1_1/nbcloud/image/upload",
            {
              method: "POST",
              body: data
            }
          );

          if (response) {
            var jsonResponse = await response.json();
            const response1 = await fetch("/updateprofile", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem("jwt")
              },
              body: JSON.stringify({
                pic: jsonResponse.url
              })
            });
            if (response1) {
              const jsonResponse1 = await response1.json();
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: jsonResponse1.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: jsonResponse1.pic });
              console.log(state);
              console.log("jsonResponse1: ", jsonResponse1);
            } else console.log("No response received!");
          } else console.log("No response received!");
        } catch (err) {
          console.log(err);
        }
      }
      update();
    }
  }, [image]);
  const updatePic = file => {
    setImage(file);
  };
  const deletePost = async postId => {
    try {
      const response = await fetch(`/deletepost/${postId}`, {
        method: "delete",
        headers: {
          "x-auth-token": localStorage.getItem("jwt")
        }
      });
      const jsonResponse = await response.json();
      const newPics = pics.filter(pic => {
        return pic._id !== jsonResponse._id;
      });
      setPics(newPics);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {state ? (
        <div className="profile-page">
          <div className="profile-header">
            <div className="profile-details">
              <img className="profile-img" src={state.pic} />
              <div>
                <h4>{state.name}</h4>
                <div className="profile-info">
                  <h6>{pics.length} posts</h6>
                  <h6>{state.following.length} following</h6>
                  <h6>{state.followers.length} followers</h6>
                </div>
              </div>
            </div>
            <div className="file-field input-field file">
              <div className="btn #90caf9 blue lighten-3">
                <span>Update Pic</span>
                <input
                  type="file"
                  onChange={e => updatePic(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
          </div>

          <div className="gallery">
            {pics.map(pic => {
              return (
                <div key={pic.id} className="item">
                  <img src={pic.photo} alt="" />
                  <button className="btn" onClick={() => deletePost(pic._id)}>
                    <i className="material-icons">delete</i>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </>
  );
};

export default Profile;
