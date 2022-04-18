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
            className="text-white text-7xl "
            style={{ position: "absolute", top: "80%", width: "100%", textAlign:"center", fontWeight: "900" }}
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
