import NewPostForm from "../newPostForm/NewPostForm";
import Playlist from "../playlist/Playlist";
import PostList from "../postList/PostList";
import classes from "./SocialHomePage.module.css";
import Profile from "../profile/Profile"
import { useState } from "react";
import Announcements from "../announcements/Announcements";

const ProfilePage = () => {
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
              <NewPostForm refreshPosts={refreshPosts}/>
            </div>
            <div className={classes.bottomPane}><Playlist/></div>
          </div>
        </div>
        
        <div className={classes.middlepane}>
          <Profile/>
        </div>
        <div className={classes.rightpane}>
          <div className={classes.splitScreen}>
            <div className={classes.topPane}>Suggestions</div>
            <div className={classes.bottomPane}>
              <Announcements refresh={refresh}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
