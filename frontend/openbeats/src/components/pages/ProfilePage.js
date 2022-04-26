import NewPostForm from "../newPostForm/NewPostForm";
import Playlist from "../playlist/Playlist";
// import classes from "./SocialHomePage.module.css";
import classes from "./ProfilePage.module.css";
import classes from "./SocialHomePage.module.css";
// import classes from "./ProfilePage.module.css";
>>>>>>> 92e7548 (Responsive navbar, inbox, notFound, about pages)
import Profile from "../profile/Profile";
import { useState, useEffect, useContext } from "react";
import { url } from "../../utils/constants";
import axios from "axios";
import { useParams } from "react-router-dom";
import Announcements from "../announcements/Announcements";
import { UserContext } from "../../model/user-context/UserContext";
import TrendingList from "../trendingList/TrendingList";

const ProfilePage = () => {
  const [state, dispatch] = useContext(UserContext);
  const params = useParams();
  const userName = state.user.username;
  const username = params.username;

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
    const res = await axios.post(url + "/follow/" + username, null, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
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

  useEffect(() => {
    getFollowing();
    getFollowed();
  }, [follow]);

  return (
    <div className={classes.container}>
      {/* <div className="p-5"> */}
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
            isCurrentUser={userName === username}
            followUser={followUser}
            unfollowUser={unfollowUser}
            isFollowing={follow}
            followingList={followingList}
            followersList={followersList}
            username={username}
          />
        </div>
        <div className={classes.rightpane}>
          <div className={classes.splitScreen}>
            <div className={classes.topPane}>
            <TrendingList refresh={refresh} />
            </div>
            <div className={classes.bottomPane}>
              <Announcements refresh={refresh} username={username} />
            </div>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};
export default ProfilePage;
