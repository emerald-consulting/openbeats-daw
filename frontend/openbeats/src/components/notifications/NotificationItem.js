import { ClickAwayListener, Grow, Paper, Popper } from "@mui/material";
import React, { Component } from "react";
/*import axios from "axios";*/
import "./Notifications.module.css";
/*import Notifications from "@mui/icons-material/Notifications";
 */

export const NotificationItem = (props) => {
  return (
    <Popper
      open={props.open}
      anchorEl={props.anchorRef.current}
      role={undefined}
      placement="bottom-start"
      transition
      disablePortal
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === "bottom-start" ? "left top" : "left bottom",
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={props.handleClose}>
              {/* <MenuList
              autoFocusItem={props.open}
              id="composition-menu"
              aria-labelledby="composition-button"
              onKeyDown={props.handleListKeyDown}
            > */}
              {/* <MenuItem onClick={props.handleClose}>Profile</MenuItem>
                  <MenuItem onClick={props.handleClose}>My account</MenuItem>
                  <MenuItem onClick={props.handleClose}>Logout</MenuItem> */}
              <div className="notify_item">
                {/* <div className="notify_img">
                  <img
                    src="image.png"
                    alt="profile_pic"
                    style={{ width: "50px" }}
                  />
                </div> */}
                <div className="notify_info">
                  {/* {props.notifications.map((not) => { */}
                  <p>
                    <span>
                      {props.notifications[0]?.notifyByUserId}{" "}
                      {props.notifications[0]?.content}
                    </span>
                  </p>
                  ;
                  {/* <span className="notify_time">
                    {props.notifications[0].content}
                  </span> */}
                  ;{/* })} */}
                </div>
              </div>
              {/* </MenuList> */}
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
