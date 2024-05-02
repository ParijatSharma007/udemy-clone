import assest from "@/json/assest";
import styled from "@emotion/styled";
import Image from "next/image";
import React from "react";
import Container from "@mui/material/Container";
import { Box } from "@mui/system";
import Link from "next/link";
import { List, ListItem } from "@mui/material";
import path from "path";
import { useRouter } from "next/router";

const FooterWrap = styled(Box)`
  padding: 25px 0;
  .ftr-list {
    display: flex;
    align-items: center;
    padding: 0;
    @media (max-width: 1199px) {
      justify-content: center;
      margin: 8px 0;
      flex-wrap: wrap;
    }
    li {
      width: auto;
      margin-right: 35px;
      @media (max-width: 899px) {
        margin: 0 17px;
      }
      &:last-child {
        margin-right: 0;

        @media (max-width: 899px) {
          margin-right: 17px;
        }
      }
      a {
        font-weight: 400;
        font-size: 15px;
        color: var(--color3A4950);
        text-transform: capitalize;
        &:hover {
          color: var(--black);
        }
        &.active{
          color: var(--black);
        }
      }
    }
  }
  .ftr-logo {
    margin-right: 28px;
    line-height: 0;
    @media (max-width: 1199px) {
      max-width: 180px;
      margin: 0 auto;
    }
  }
  .social-list {
    display: flex;
    align-items: center;
    padding: 0;
    margin-left: 50px;
    @media (max-width: 1199px) {
      justify-content: center;
      margin-left: 0px;
      margin-bottom: 15px;
    }
    li {
      width: auto;
      margin-right: 20px;
      
      &:last-child {
        margin-right: 0;
      }
      img {
        &:hover {
          filter: brightness(0);
        }
        @media (max-width: 991px) {
          width: 20px;
          height: 10px;
        }
      }
    }
  }

  .copy {
    margin-left: auto;

    font-size: 14px;
    color: var(--color3A4950);

    a {
      color: var(--color3A4950);
      &:hover {
        color: var(--black);
      }
    }
  }
  .ftr-wrapper {
    display: flex;
    align-items: center;
    @media (max-width: 1199px) {
      display: block;
      text-align: center;
    }
  }
`;

const navItems = [
  {
    name: "home",
    route: "/",
  },
  {
    name: "About",
    route: "/about",
  },

];



const Footer = () => {
  const navItems = [
    {
      name: "home",
      route: "/",
    },
    {
      name: "About",
      route: "/about",
    },

  ];
  const router = useRouter();
  return (
    <>
      <FooterWrap>
        <Container fixed>
          <Box className="ftr-wrapper">
  

            <List className="ftr-list">
              {navItems.map((item: any, index: number) => (
                <ListItem disablePadding>
                  <Link href={item?.route} key={item.name} className={router.pathname === item.route ? "active" : ""}>
                    {item?.name}
                  </Link>
                </ListItem>
              ))}
            </List>
 
   
          </Box>
        </Container>
      </FooterWrap>
    </>
  );
};

export default Footer;
