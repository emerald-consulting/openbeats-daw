import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../../utils/constants";
import SocialPost from "../socialPost/SocialPost";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingOverlay from "react-loading-overlay";
import { Facebook } from 'react-spinners-css';
import classes from "../pages/SocialHomePage.module.css"

const PostList = ({ uriParam, refresh }) => {
  const [posts, setPosts] = useState([]);
  const [refreshNumber, setRefreshNumber] = useState(0);
  const [morePostsExist, setMorePostsExist] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  let token = localStorage.getItem("auth-token");

  useEffect(() => {
    getPosts();
  }, [refreshNumber, uriParam]);

  useEffect(() => {
    if (refreshNumber == 0) {
      getPosts();
    } else {
      setRefreshNumber(0);
    }
  }, [refresh]);

  const getPosts = async () => {
    const res = await axios.get(url + "/" + uriParam + "/" + refreshNumber, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setPosts((prevPosts) => {
      if (refreshNumber == 0) {
        return [...res.data.content];
      }
      return [...prevPosts, ...res.data.content];
    });
    setMorePostsExist(!res.data.last);
    if (isLoading) {
      setIsLoading(false);
      console.log("making it false");
    }
  };

  const nextHandler = () => {
    setRefreshNumber((prev) => prev + 1);
  };

  const refreshHandler = () => {
    setRefreshNumber(0);
  };

  const removePost = (postId) => {
    setPosts(posts.filter(i => i.postId !== postId));
  }

  const updatePost = (post) => {
    const allPosts = [...posts];
    const updatedPost = allPosts.find(i => i.postId === post.postId);
    updatedPost.description = post.description;
    updatedPost.title = post.title;
    updatedPost.genre = post.genre;
    updatedPost.pictureFileName = post.pictureFileName;
    updatedPost.trackFileName = post.trackFileName;
    setPosts(allPosts);
  }

  return (
    <LoadingOverlay active={isLoading} spinner={<Facebook color="#10b981"/>}>
      <div div="scrollablePosts">
        <InfiniteScroll
          height={"75vh"}
          dataLength={posts.length}
          next={nextHandler}
          hasMore={morePostsExist}
          loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          refreshFunction={refreshHandler}
          pullDownToRefresh
          pullDownToRefreshThreshold={30}
          pullDownToRefreshContent={
            <h3 style={{ textAlign: "center" }}>
              &#8595; Pull down to refresh
            </h3>
          }
          releaseToRefreshContent={
            <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
          }
        >
          <div
            style={{
              height: "20px",
              width: "100%",
              clear: "both",
              cursor: "grabbing",
            }}
          ></div>
          {posts.map((p) => (
            <SocialPost key={p.postId} details={p} removePost={removePost} updatePost={updatePost} />
          ))}
        </InfiniteScroll>
      </div>
    </LoadingOverlay>
  );
};

export default PostList;
