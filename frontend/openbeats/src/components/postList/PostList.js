import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../../utils/constants";
import SocialPost from "../socialPost/SocialPost";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingOverlay from "react-loading-overlay";
import { useSelector } from "react-redux";
import { Facebook } from 'react-spinners-css';
import classes from "../pages/SocialHomePage.module.css"

const PostList = ({ uriParam, refresh, refreshPosts }) => {
  const [posts, setPosts] = useState([]);
  const [refreshNumber, setRefreshNumber] = useState(0);
  const [morePostsExist, setMorePostsExist] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  let token = localStorage.getItem("auth-token");
  const searchText = useSelector(state => state.search.searchText)
  const searchDetails = useSelector(state => state.search)
  const selectedPost = searchDetails.selectedPost;
  const showAllSearchCount = searchDetails.showAllSearchCount;
  const selectedUserId=searchDetails.selectedUserId

  useEffect(() => {
    if (selectedPost && !selectedPost.username) {
      setPosts([selectedPost])
    }
    else {
      getPosts();
    }
  }, [refreshNumber, selectedPost, showAllSearchCount]);

  useEffect(() => {
    if (selectedPost && !selectedPost.username) {
      setPosts([selectedPost])
    }
    else {
      if (refreshNumber == 0) {
        getPosts();
      } else {
        setRefreshNumber(0);
      }
    }
  }, [refresh, selectedPost, showAllSearchCount, uriParam]);

  useEffect(() => {
    getPosts()
  }, [searchText,selectedUserId])

  const getPosts = async () => {
    try {
      let postsUrl = url + "/" + uriParam + "/" + refreshNumber;
      if (showAllSearchCount !== 0) {
        postsUrl = url + "/allSearchPosts/" + searchText;
        setIsLoading(true)
        let searchRes = await axios.get(postsUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            Authorization: "Bearer " + token,
          },
        });
        setPosts(searchRes.data)
        setIsLoading(false);
      }
      else {
        if (searchText) {
          return;
        }
        setIsLoading(true)
        if(selectedUserId){
          postsUrl=`${url}/getPostsByUser/${selectedUserId}/${refreshNumber}`
        }
        const res = await axios.get(postsUrl, {
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
        setIsLoading(false);
      }
    }
    catch (err) {
      setIsLoading(true)
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
    refreshPosts();
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
    refreshPosts();
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
