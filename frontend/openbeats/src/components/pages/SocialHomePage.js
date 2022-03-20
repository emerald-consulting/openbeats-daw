import SocialPost from "../socialPost/SocialPost";
import classes from "./SocialHomePage.module.css";

const SocialHomePage = () => {
  return (
    <div className={classes.container} >
      <div className="p-5">

      <div className={classes.leftpane}>
        <div className={classes.splitScreen}>
          <div className={classes.topPane}>POST Form</div>
          <div className={classes.bottomPane}>PLay List</div>
        </div>
      </div>
      <div className={classes.middlepane}>
        {
          [1,2,3,4,5].map(() =>(
            <div>
              <SocialPost/>
            {/* <img
            src="https://cdn.theatlantic.com/media/img/photo/2018/10/images-of-the-season-fall-is-in-the/f02_RTX6EJJJ-1/original.jpg"
            style={{ height: "200px", width: "50%" }}
          /> */}
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
