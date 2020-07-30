import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/user/${userid}`, {
          headers: {
            "x-auth-token": localStorage.getItem("jwt")
          }
        });
        const jsonResponse = await response.json();
        setProfile(jsonResponse);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const followUser = async () => {
    try {
      const response = await fetch("/follow", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          followId: userid
        })
      });
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      dispatch({
        type: "UPDATE",
        payload: {
          following: jsonResponse.following,
          followers: jsonResponse.followers
        }
      });
      localStorage.setItem("user", JSON.stringify(jsonResponse));
      setProfile(prevState => {
        return {
          ...prevState,
          user: {
            ...prevState.user,
            followers: [...prevState.user.followers, jsonResponse._id]
          }
        };
      });
    } catch (err) {
      console.log(err);
    }
  };
  const unFollowUser = async () => {
    try {
      const response = await fetch("/unfollow", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          unfollowId: userid
        })
      });
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      dispatch({
        type: "UPDATE",
        payload: {
          following: jsonResponse.following,
          followers: jsonResponse.followers
        }
      });
      localStorage.setItem("user", JSON.stringify(jsonResponse));
      setProfile(prevState => {
        const newFollowers = prevState.user.followers.filter(
          follower => follower !== jsonResponse._id
        );
        return {
          ...prevState,
          user: {
            ...prevState.user,
            followers: newFollowers
          }
        };
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {userProfile && state ? (
        <div className="profile-page">
          <div className="profile-header-part">
            <div>
              <img className="profile-img" src={userProfile.pic} alt="" />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <div className="profile-info">
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user.following.length} following</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
              </div>
              {userProfile.user.followers.includes(state._id) ? (
                <button
                  className="btn waves-effect waves-light #42a5f5 blue lighten-1 profile-follow"
                  onClick={() => unFollowUser()}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light #42a5f5 blue lighten-1 profile-follow"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map(pic => {
              return (
                <div key={pic.id} className="item">
                  <img src={pic.photo} alt="" />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <h2 className="text-center">loading...</h2>
      )}
    </>
  );
};

export default Profile;
