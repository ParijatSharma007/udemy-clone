/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-use-before-define */
import assest from "@/json/assest";
import { primaryColors } from "@/themes/_muiPalette";
import DownIcon from "@/ui/Icons/DownIcon";
import NotificationBellIcon from "@/ui/Icons/NotificationBellIcon";
import styled from "@emotion/styled";
// eslint-disable-next-line mui-path-imports/mui-path-imports
import {
  Box,
  BoxProps,
  Button,
  Menu,
  MenuItem,
  Stack,
  Typography
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export const DashboardHeaderStyled = styled(Box)`
  position: fixed;
  right: 20px;
  top: 20px;
  width: calc(100% - 307px);
  padding: 0 0 30px;
  .header_title {
    h1 {
      font-weight: 600;
      font-size: 23px;
      color: ${primaryColors?.color060606};
    }
  }
  .notification_icon {
    width: 47px;
    height: 42px;
    background: ${primaryColors?.primary_600};
    border-radius: 5px;
    min-width: auto;
    padding: 0;
    margin-right: 12px;
    .is_active {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      &::after {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 100%;
        background-color: ${primaryColors?.primary};
        position: absolute;
        right: 0;
        top: 1px;
        z-index: 1;
      }
    }
  }
  .avatar_block {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar_btn {
    padding: 5px 12px;
    border-radius: 5px;
    border: 1px solid ${primaryColors?.primary};
    i {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 100%;
      overflow: hidden;
      border: 1px solid ${primaryColors?.primary};
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    p {
      font-family: "Roboto";
      font-weight: 500;
      font-size: 15px;
      line-height: 1.5;
      text-transform: capitalize;
      color: ${primaryColors?.color060606};
    }
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 12px;
    }
  }
`;

interface headerProps extends BoxProps {
  headerHeightCallBack: (data: number) => void;
  headerTitle: string;
}
const DashboardHeader: React.FC<headerProps & BoxProps> = ({
  headerHeightCallBack,
  headerTitle,
  ...props
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const avatarBlockRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number | undefined>(0);
  const [avatarMenuWidth, setAvatarMenuWidth] = useState<number | undefined>(0);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (avatarBlockRef.current) {
      setAvatarMenuWidth(avatarBlockRef.current?.clientWidth);
      const adjustWidth = () => {
        setAvatarMenuWidth(avatarBlockRef.current?.clientWidth);
      };

      window.addEventListener("resize", adjustWidth);

      return () => {
        window.removeEventListener("resize", adjustWidth);
      };
    }
  }, [avatarBlockRef.current]);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current?.clientHeight);
      const adjustHeight = () => {
        setHeaderHeight(headerRef.current?.clientHeight);
      };

      window.addEventListener("resize", adjustHeight);

      return () => {
        window.removeEventListener("resize", adjustHeight);
      };
    }
  }, [headerRef.current]);

  useEffect(() => {
    if (headerHeight) {
      headerHeightCallBack(headerHeight);
    }
  }, [headerHeight]);

  return (
    <DashboardHeaderStyled ref={headerRef} {...props}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box className="header_title">
          <Typography variant="h1">{headerTitle}</Typography>
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          className="header_options"
          ref={avatarBlockRef}
        >
          <Button className="notification_icon" disableRipple>
            <Typography variant="caption" className="is_active">
              <NotificationBellIcon IconColor={primaryColors?.color060606} />
            </Typography>
          </Button>

          <Box className="avatar_block">
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              className="avatar_btn"
              disableRipple
            >
              <Typography component="i" className="avatar_image">
                <Image
                  src={assest?.logo}
                  alt="avatar image"
                  width={30}
                  height={30}
                />
              </Typography>
              <Typography>Howard</Typography>
              <Typography variant="caption">
                <DownIcon />
              </Typography>
            </Button>
            <AvatarMenu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button"
              }}
              avatarMenuWidth={avatarMenuWidth}
            >
              <MenuItem onClick={handleClose}>become a consumer</MenuItem>
              <MenuItem onClick={handleClose}>My Profile </MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </AvatarMenu>
          </Box>
        </Stack>
      </Stack>
    </DashboardHeaderStyled>
  );
};

export default DashboardHeader;

export const AvatarMenu = styled(Menu, {
  shouldForwardProp: (data) => data !== "avatarMenuWidth"
})<{ avatarMenuWidth: number | undefined }>`
  .MuiPaper-root {
    width: ${({ avatarMenuWidth }) => `${avatarMenuWidth}px`};
    background: ${primaryColors?.white};
    box-shadow: 0px 3px 28px -6px rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    ul {
      padding: 17px 17px;
      li {
        font-family: "Roboto";
        font-weight: 400;
        font-size: 15px;
        line-height: 1.5;
        text-transform: capitalize !important;
        color: ${primaryColors?.color2F3240};
        padding: 9px 0;
        &:first-child {
          padding-top: 0px;
        }
        &:last-child {
          padding-bottom: 0px;
        }
        &:hover {
          background-color: transparent;
          color: ${primaryColors?.primary};
        }
      }
    }
  }
`;
