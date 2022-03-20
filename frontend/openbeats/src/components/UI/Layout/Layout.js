import { Fragment } from "react/cjs/react.production.min";
import FooterPlayer from "../../footerPlayer/FooterPlayer";
import MainHeader from "../../header/MainHeader";
import classes from "./Layout.module.css";
import { useSelector } from "react-redux";

const Layout = (props) => {
  const user = useSelector(_state => _state.user);
  const isUserLoggedin = user.emailId.trim().length > 0;

  return (
    <Fragment >
        <MainHeader />
      <main className={classes.main} >{props.children}</main>
      {isUserLoggedin && <FooterPlayer />}
    </Fragment>
  );
};

export default Layout;
