import classes from "./SocialPost.module.css";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";


const SocialPost = (props) => {
  return (
    <Card style={{ width: "65%", padding: "5px" }}>
      <Card.Body>
        <IconButton sx={{ p: 0 }}>
          <Avatar alt="Harry" src="/static/images/avatar/2.jpg" />
          <strong className={classes.username}>Ryan Dills</strong> <span className="ml-2">@ryandills</span>
        </IconButton>
        <br/>



        <Card.Text>
          Some quick example text to build on the title and make up the bulk of
          the post's content.
        </Card.Text>
      </Card.Body>
      <Card.Img
        variant="top"
        src="https://cdn.theatlantic.com/media/img/photo/2018/10/images-of-the-season-fall-is-in-the/f02_RTX6EJJJ-1/original.jpg"
      />
    </Card>
  );
};

export default SocialPost;
