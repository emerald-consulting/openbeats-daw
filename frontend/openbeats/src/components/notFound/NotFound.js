import classes from './NotFound.module.css';

const NotFound = () => {
  return (
    <div style={{position:"fixed", width:"100%"}}>
      <div
        style={{
          backgroundColor: "black",
          backgroundSize: "cover",
          height: "40vh",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <div>
        <h1
            className={classes.title}
          >
            <span className="text-emrald-gr">Whoops!</span> Looks like the page can't be found.
          </h1>
        </div>

      </div>
      <div className={`${classes.spacer} ${classes.layer}`}></div>
    </div>
  );
};

export default NotFound;
