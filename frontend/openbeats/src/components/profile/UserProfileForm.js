import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import "./Profile.module.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            left: 530,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) =>
  createStyles({
    disabledButton: {
      backgroundColor: "green",
      color: "black",
      // width:"180px",
      // height:"30px"
    },
  })
);

export default function UserProfileForm(props) {
  const classes = useStyles();
  return (
    <div>
      <BootstrapDialog
        onClose={props.handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={props.handleClose}
        >
          My Profile
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="outlined-required"
                label="User Name"
                name="username"
                defaultValue={props.user.username}
                onChange={props.handleInputChange}
                helperText={props.existUser ? <div style={{color:"red"}}>Username already exists</div> : ""}
              />
              <TextField
                id="outlined-disabled"
                label="First Name"
                name="firstName"
                defaultValue={props.user.firstName}
                onChange={props.handleInputChange}
              />
              <TextField
                id="outlined-disabled"
                label="Last Name"
                name="lastName"
                defaultValue={props.user.lastName}
                onChange={props.handleInputChange}
              />
              <TextField
                disabled
                id="outlined-disabled"
                label="Email"
                name="emailId"
                defaultValue={props.user.emailId}
                onChange={props.handleInputChange}
              />
              <TextField
                multiline
                id="outlined-multiline-flexible"
                label="Bio"
                name="bio"
                defaultValue={props.user.bio}
                onChange={props.handleInputChange}
              />
            </div>

            <Button
              onClick={props.upgradeUser}
              // className="p-2 text-w bg-gr3 hover:bg-gr2 font-bold rounded"
              disabled={props.user.subscriptionType === "paid" ? true : false}
              // classes={{ disabled: classes.disabledButton }}
              className={classes.disabledButton}
            >
              Upgrade to Premium
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.updateUser}>
            Update Profile
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
