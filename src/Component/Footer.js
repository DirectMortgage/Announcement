import * as React from "react";
// import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
// import Grow from '@material-ui/core/Grow';
// import Paper from '@material-ui/core/Paper';
// import Popper from '@material-ui/core/Popper';
// import MenuItem from '@material-ui/core/MenuItem';
// import MenuList from '@material-ui/core/MenuList';
import { handleAPI, handleSaveWindowSize } from "./CommonFunctions";
//import $ from 'jquery'
//import '../styles/commonCSS.css';
//import {sessionID} from "../config.js";
//import SessionID from '../config.js'
import { Button } from "@mui/material";
import { Grow } from "@mui/material";
import { Paper } from "@mui/material";
import { Popper } from "@mui/material";
import { MenuItem } from "@mui/material";
import { MenuList } from "@mui/material";

function Footer(props) {
  const [open, setOpen] = React.useState(false);
  const { SessionId, Type } = props;
  const anchorRef = React.useRef(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }
  const queryStringToObject = (queryString) => {
    if (!queryString) queryString = window.location.href;
    queryString = queryString.split("?")[1];
    const params = new URLSearchParams(queryString),
      result = {};
    for (const [key, value] of params) {
      result[key] = value.replace("#", "");
    }
    return result;
  };

  const Close = (e) => {
    window.opener = null;
    window.open("", "_self");
    window.close();
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className="footer">
      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          style={{
            textTransform: "none",
            marginLeft: "5px",
            float: "left",
            marginTop: "5px",
            backgroundColor: "#428bca",
            borderRadius: "unset",
          }}
          variant="contained"
          color="primary"
          size="small"
        >
          Menu
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
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
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem
                      onClick={() =>
                        handleSaveWindowSize({
                          Type,
                          SessionId,
                          Flag: 1,
                          callBack: handleToggle,
                        })
                      }
                    >
                      Save Window Size and Position
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        {/* <Button style={{textTransform: "none", marginTop:"5px",backgroundColor: "#428bca"}} variant='contained' color='primary' size="small" onClick={(e)=> Close(e)}>Close</Button> */}
      </div>
    </div>
  );
}

export default Footer;
