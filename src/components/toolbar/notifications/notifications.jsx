import React, { useState } from 'react';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';

const ITEM_HEIGHT = 60;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  console.log(notifications);

  const handleClick = (event) => {
    const fetchNotifications = () => {
      axios({
        url: 'http://localhost:5000/fetch_notification',
        params: {},
      }).then((res) => {
        console.log(res);
        if (res.data.result) {
          console.log('setting notifications');
          setNotifications(res.data.result);
        }
      });
    };

    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearNotifications = () => {
    console.log('clear notifications');
    const clearNotifications = () => {
      axios({
        url: 'http://localhost:5000/clear_notifications',
        params: {},
      }).then((res) => {
        console.log(res);
      });
    };

    clearNotifications();
    setNotifications([]);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <NotificationsIcon style={{ color: 'rgba(224, 224, 224, 0.74)' }} />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '50ch',
          },
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => {
            let notifMessage = null;
            if (notification.type === 'like') {
              notifMessage = `@${notification.sender} liked your post - '${notification.image_id}'`;
            } else if (notification.type === 'comment') {
              notifMessage = `@${notification.sender} commented on your post - '${notification.image_id}'`;
            } else if (notification.type === 'posted') {
              notifMessage = `@${notification.sender} has uploaded a new post - '${notification.image_id}'`;
            } else if (notification.type === 'purchased') {
              notifMessage = `@${notification.sender} has purchased your photo - '${notification.image_id}'`;
            } else {
              notifMessage = `@${notification.sender} started following you`;
            }
            if (index === 0) {
              return (
                <div key={index}>
                  <MenuItem
                    key={index}
                    onClick={handleClearNotifications}
                    style={{ fontWeight: 'bold' }}
                  >
                    Clear Notifications
                  </MenuItem>
                  <MenuItem key={index + 1} onClick={handleClose}>
                    <div>{notifMessage}</div>
                  </MenuItem>
                </div>
              );
            }
            return (
              <MenuItem key={index + 1} onClick={handleClose}>
                <div>{notifMessage}</div>
              </MenuItem>
            );
          })
        ) : (
          <MenuItem onClick={handleClose}>
            No Notifications at this time
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
