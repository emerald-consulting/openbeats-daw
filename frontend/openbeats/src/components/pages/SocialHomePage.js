import NewPostForm from "../newPostForm/NewPostForm";
import SocialPost from "../socialPost/SocialPost";
import classes from "./SocialHomePage.module.css";

const SocialHomePage = () => {
  return (
    <div className={classes.container} >
      <div className="p-5">

      <div className={classes.leftpane}>
        <div className={classes.splitScreen}>
          <div className={classes.topPane}>
            <NewPostForm/>
          </div>
          <div className={classes.bottomPane}>PLay List</div>
        </div>
      </div>
      <div className={classes.middlepane}>
        {
          [1,2,3,4,5].map(() =>(
            <div>
              <SocialPost/>
          <hr style={{color:'gray'}}/>
          </div>
          ))
        }

      </div>
      <div className={classes.rightpane}>
      <div className={classes.splitScreen}>
          <div className={classes.topPane}>Suggestions/ Trending</div>
          <div className={classes.bottomPane}>Newly Released/ Announcements</div>
        </div>
      </div>
      </div>
    </div>
  );
};
export default SocialHomePage;
