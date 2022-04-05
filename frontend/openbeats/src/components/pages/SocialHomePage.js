import { useState } from "react";
import NewPostForm from "../newPostForm/NewPostForm";
import Playlist from "../playlist/Playlist";
import PostList from "../postList/PostList";
import TrendingList from "../trendingList/TrendingList";
import classes from "./SocialHomePage.module.css";

const SocialHomePage = () => {

  const [refresh, setRefresh] = useState(0);
  const refreshPosts = () => {
    setRefresh((prev) => prev + 1);
  };

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
          <PostList uriParam="getPosts" refresh={refresh} />
        </div>
        <div className={classes.rightpane}>
          <div className={classes.splitScreen}>
            <div className={classes.topPane}>
              <TrendingList/>
            </div>
            <div className={classes.bottomPane}>
              Newly Released/ Announcements
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SocialHomePage;
