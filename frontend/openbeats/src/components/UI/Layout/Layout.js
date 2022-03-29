import { Fragment } from "react/cjs/react.production.min";
import FooterPlayer from "../../footerPlayer/FooterPlayer";
import MainHeader from "../../header/MainHeader";
import classes from "./Layout.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../model/user-context/UserContext";
import { setUserEmail, setUserToken } from "../../../model/user/User";
import { url } from "../../../utils/constants";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay";

const Layout = (props) => {
  const user = useSelector((_state) => _state.user);
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  let isUserLoggedin = user.emailId.trim().length > 0;
  let jwtToken = `${user.jwtToken}`;
  const dispatch2 = useDispatch();

  useEffect(() => {
    if (jwtToken && jwtToken !== "undefined") {
      isUserLoggedin = true;
    } else {
      let token = localStorage.getItem("auth-token");
      if (token) {
        let email = localStorage.getItem("emailId");
        getSpotifyUserDetails(token, email);
      }
    }
  }, []);

  async function getSpotifyUserDetails(token, email) {
    console.log("get getSpotifyUserDetails");
    setIsLoading(true);
    await dispatch2(setUserToken(token));
    await dispatch2(setUserEmail(email));
    axios
      .get(url + "/getUserDetails?emailId=" + email, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((response1) => {
        if (response1.data.status === 207) {
        } else if (response1.data) {
          dispatch({
            type: "LOAD_USER",
            payload: response1.data.data,
          });
          console.log(response1.data.data);
        }
        setIsLoading(false);
      });
  }

  return (
    <Fragment>
      <LoadingOverlay active={isLoading} spinner text="Please wait...">
        <MainHeader />
        <main className={classes.main}>{props.children}</main>
        {isUserLoggedin && <FooterPlayer />}
      </LoadingOverlay>
    </Fragment>
  );
};

export default Layout;
