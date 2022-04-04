import NewPostForm from "../newPostForm/NewPostForm";
import Playlist from "../playlist/Playlist";
import PostList from "../postList/PostList";
import classes from "./SocialHomePage.module.css";
import Profile from "../profile/Profile"
const ProfilePage = () => {
  return (
    <div className={classes.container}>
      <div className="p-5">
        <div className={classes.leftpane}>
          <div className={classes.splitScreen}>
            <div className={classes.topPane}>
              <NewPostForm />
            </div>
            <div className={classes.bottomPane}><Playlist/></div>
          </div>
        </div>
        <div className={classes.middlepane}>
          {/* <PostList uriParam="getPosts" /> */}
          <Profile></Profile>
        </div>
        <div className={classes.rightpane}>
          <div className={classes.splitScreen}>
            <div className={classes.topPane}>Suggestions/ Trending</div>
            <div className={classes.bottomPane}>
              Newly Released/ Announcements
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
