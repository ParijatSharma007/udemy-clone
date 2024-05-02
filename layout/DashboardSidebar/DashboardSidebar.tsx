/* eslint-disable no-use-before-define */
/* eslint-disable react/no-array-index-key */
/* eslint-disable mui-path-imports/mui-path-imports */

import assest from "@/json/assest";
import { primaryColors } from "@/themes/_muiPalette";
import FileIcon1 from "@/ui/Icons/FileIcon1";
import LogoutIcon from "@/ui/Icons/LogoutIcon";
import styled from "@emotion/styled";
import { Box, BoxProps, Button, List, ListItem } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

const commonpath = "/service-provider";
const navItems = [
  {
    name: "Dashboard",
    route: `${commonpath}/dashboard`,
    icon: <FileIcon1 />
  },
  {
    name: "My Vehicles",
    route: `${commonpath}/my-vehicles`,
    icon: <FileIcon1 />
  },
  {
    name: "Rental Rides",
    route: `${commonpath}/rental-rides`,
    icon: <FileIcon1 />
  },
  {
    name: "Messages",
    route: `${commonpath}/messages`,
    icon: <FileIcon1 />
  },
  {
    name: "My Profile",
    route: `${commonpath}/profile`,
    icon: <FileIcon1 />
  }
];

interface sidebarProps extends BoxProps {}

const DashboardSidebar: React.FC<sidebarProps & BoxProps> = ({ ...props }) => {
  const logoRef = useRef<HTMLDivElement>(null);
  const LogoutRef = useRef<HTMLDivElement>(null);

  const [getLogoSecHeight, setGetLogoSecHeight] = useState<number>(0);
  const [getLogoutSecheight, setGetLogoutSecheight] = useState<number>(0);

  useEffect(() => {
    if (logoRef.current && LogoutRef.current) {
      setGetLogoSecHeight(logoRef.current.clientHeight);
      setGetLogoutSecheight(LogoutRef.current.clientHeight);
    }
  }, [logoRef.current, logoRef.current]);

  const router = useRouter();

  return (
    <DashboardSidebarWrapper
      logoutSecHeight={getLogoutSecheight}
      listHeight={getLogoSecHeight}
      {...props}
    >
      <Box className="logo_sec" ref={logoRef}>
        <Link href={`${commonpath}/dashboard`}>
          <Image src={assest?.logo_img} alt="logo" width={175} height={30} />
        </Link>
      </Box>
      <List disablePadding className="sidebar_menu">
        {navItems?.map((data, index) => (
          <ListItem
            disablePadding
            key={index}
            className={router.pathname === data?.route ? "active" : ""}
          >
            <Button href={data?.route} startIcon={data?.icon}>
              {data?.name}
            </Button>
          </ListItem>
        ))}
      </List>
      <Box className="logout_block" ref={LogoutRef}>
        <Button href={`${commonpath}/dashboard`} startIcon={<LogoutIcon />}>
          Logout
        </Button>
      </Box>
    </DashboardSidebarWrapper>
  );
};

export default DashboardSidebar;

export const DashboardSidebarWrapper = styled(Box, {
  shouldForwardProp: (data) => data !== "listHeight"
})<{
  listHeight: number | undefined;
  logoutSecHeight: number | undefined;
}>`
  width: 237px;
  flex-basis: 237px;
  position: fixed;
  left: 20px;
  top: 20px;
  height: calc(100vh - 40px);
  overflow-y: auto;
  z-index: 5;
  background-color: ${primaryColors?.primary};
  border-radius: 20px;
  .logo_sec {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 25px 20px 45px;
    a {
      display: inline-block;
    }
  }
  .sidebar_menu {
    padding: 0 20px;
    height: calc(
      100vh -
        (
          ${({ listHeight }) => `${listHeight}px`} + 40px +
            (${({ logoutSecHeight }) => `${logoutSecHeight}px`})
        )
    );
    overflow-y: auto;
    margin-bottom: ${({ logoutSecHeight }) => `${logoutSecHeight}px`};
    li {
      a {
        font-family: "Roboto";
        font-weight: 500;
        font-size: 14px;
        line-height: 1.5;
        color: ${primaryColors?.white};
        width: 100%;
        justify-content: flex-start;
        padding: 19.5px 20px;
        background: ${primaryColors?.primary};
        border-radius: 10px;
        .MuiButton-startIcon {
          margin-left: 0px;
          margin-right: 12px;
        }
        &:hover {
          background: rgba(120, 64, 137, 0.6);
        }
      }
      &.active {
        a {
          background: rgba(120, 64, 137, 0.6);
        }
      }
    }
  }
  .logout_block {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: ${primaryColors?.primary};
    width: 100%;
    padding: 20px 20px 50px 20px;
    z-index: 3;
    a {
      font-family: "Roboto";
      font-weight: 500;
      font-size: 14px;
      line-height: 1.5;
      color: ${primaryColors?.white};
      width: 100%;
      justify-content: flex-start;
      padding: 19.5px 20px;
      background: ${primaryColors?.primary};
      border-radius: 10px;
      .MuiButton-startIcon {
        margin-left: 0px;
        margin-right: 12px;
      }
      &:hover {
        background: rgba(120, 64, 137, 0.6);
      }
    }
  }
`;
