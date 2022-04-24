import React from "react";
import Avatar from "react-avatar-edit";
import './Profile.module.css';

const ProfileImage = (props) => {
  return (
    <div>
      <Avatar
        width={390}
        height={295}
        onCrop={props.onCrop}
        onClose={props.onClose}
        src={props.profileUrl}
      />
      <img src={props.preview} alt="Preview" />
    </div>
  );
};

export default ProfileImage;