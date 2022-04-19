import NewPostForm from "../newPostForm/NewPostForm";
import Playlist from "../playlist/Playlist";
import classes from "./ProfilePage.module.css";
import Profile from "../profile/Profile";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { url } from "../../utils/constants";
import axios from "axios";
import { useParams } from "react-router-dom";
import Announcements from "../announcements/Announcements";

const ProfilePage = () => {
  const location = useLocation();
  const params = useParams();
  // const authorId = location.state?.userid;
  const eId = location.state?.emailId;
  const username = params.username;
  const loggedInUserEmailId = localStorage.getItem("emailId");
 
  let token = localStorage.getItem("auth-token");
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [follow, setFollow] = useState(false);
  const refreshPosts = () => {
    setRefresh((prev) => prev + 1);
  };

  const isFollowing = async () => {
    const res = await axios.get(url + "/followers/" + username, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setFollow(res.data);
  };

  const getFollowing = async () => {
    const res = await axios.get(url + "/getFollowing/" + username, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    const ar = res.data;
    setFollowingList(ar);
  };

  const getFollowed = async () => {
    const res = await axios.get(url + "/getFollowers/" + username, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    const ar = res.data;
    setFollowersList(ar);
  };

  const followUser = async () => {
    const res = await axios.post(
      url + "/follow/" + username,null,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          Authorization: "Bearer " + token,
        },
      }
    );
    setFollow(true);
  };

  const unfollowUser = async () => {
    const res = await axios.put(url + "/unfollow/" + username, null, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setFollow(false);
  };

  useEffect(() => {
    isFollowing();
    getFollowing();
    getFollowed();
  }, []);

  return (
    <div className={classes.container}>
      <div className="p-5">
        <div className={classes.leftpane}>
          <div className={classes.splitScreen}>
            <div className={classes.topPane}>
              <NewPostForm refreshPosts={refreshPosts} />
            </div>
            <div className={classes.bottomPane}>
              <Playlist />
            </div>
          </div>
        </div>

        <div className={classes.middlepane}>
          <Profile
            isCurrentUser={eId === loggedInUserEmailId}
            followUser={followUser}
            unfollowUser={unfollowUser}
            isFollowing={follow}
            followingList={followingList}
            followersList={followersList}
            username={username}
          />
        </div>
        <div className={classes.rightPane}>
          <div className={classes.splitScreen}>
            <div className={classes.topPane}>Suggestions</div>
            <div className={classes.bottomPane}>
              <Announcements refresh={refresh} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
