import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/allposts", {
          headers: {
            "x-auth-token": localStorage.getItem("jwt")
          }
        });
        const jsonResponse = await response.json();
        setData(jsonResponse.posts);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);
  const unlikePost = async id => {
    try {
      const response = await fetch("/unlike", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          postId: id
        })
      });
      const jsonResponse = await response.json();
      const newData = data.map(item => {
        if (item._id === jsonResponse._id) return jsonResponse;
        else return item;
      });
      setData(newData);
    } catch (err) {
      console.log(err);
    }
  };
  const likePost = async id => {
    try {
      const response = await fetch("/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          postId: id
        })
      });
      const jsonResponse = await response.json();
      const newData = data.map(item => {
        if (item._id === jsonResponse._id) return jsonResponse;
        else return item;
      });
      setData(newData);
    } catch (err) {
      console.log(err);
    }
  };

  const makeComment = async (text, postId) => {
    try {
      const response = await fetch("/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          text,
          postId
        })
      });
      const jsonResponse = await response.json();
      const newData = data.map(item => {
        if (item._id === jsonResponse._id) return jsonResponse;
        else return item;
      });
      setData(newData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {data ? (
        <div className="home">
          {data.map(post => {
            return (
              <div className="card home-card" key={post._id}>
                <div className="home-card-header">
                  <Link
                    to={
                      post.postedBy._id !== state._id
                        ? "/profile/" + post.postedBy._id
                        : "/profile"
                    }
                  >
                    <img
                      className="home-card-header-img"
                      src={post.postedBy.pic}
                      alt=""
                    />
                  </Link>
                  <h5>
                    <Link
                      to={
                        post.postedBy._id !== state._id
                          ? "/profile/" + post.postedBy._id
                          : "/profile"
                      }
                    >
                      {post.postedBy.name}
                    </Link>
                  </h5>
                </div>
                <div className="card-image">
                  <img src={post.photo} alt="" />
                </div>
                <div className="card-content">
                  {post.likes.includes(state._id) ? (
                    <i
                      className="material-icons"
                      style={{ color: "red" }}
                      onClick={() => {
                        unlikePost(post._id);
                      }}
                    >
                      favorite
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      style={{ color: "red" }}
                      onClick={() => {
                        likePost(post._id);
                      }}
                    >
                      favorite_border
                    </i>
                  )}

                  <h6>{post.likes.length} likes</h6>
                  <h6>{post.title}</h6>
                  <p>{post.body}</p>
                  {post.comments.map(comment => {
                    return (
                      <h6 key={comment._id}>
                        <span style={{ fontWeight: "500" }}>
                          {comment.postedBy.name}{" "}
                        </span>
                        {comment.text}
                      </h6>
                    );
                  })}
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      makeComment(e.target[0].value, post._id);
                      e.target[0].value = "";
                    }}
                  >
                    <input type="text" placeholder="Add a comment" />
                    <button
                      className="btn waves-effect waves-light #42a5f5 blue lighten-1"
                      type="submit"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <h2 className="text-center">loading...</h2>
      )}
    </>
  );
};

export default Home;
