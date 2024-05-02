import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { HeaderWrap } from "@/styles/StyledComponents/HeaderWrapper";
import { Container } from "@mui/system";
import { useRouter } from "next/router";
import { getUserInfo, supabase, userLogout } from "@/api/supabase";
import { Button } from "@mui/material";
import { parseCookies } from "nookies";
import { userInfo } from "os";
import { logout, setLoginData } from "@/reduxtoolkit/slices/userSlice";

// const CustomButton = dynamic(() => import("@/ui/Buttons/CustomButton"));

const drawerWidth = 240;

function Header() {
  const navItems = [
    {
      name: "Clinical studies",
      route: "javascript:void(0)",
    },
    {
      name: "The science",
      route: "javascript:void(0)",
    },
    {
      name: "Shop",
      route: "javascript:void(0)",
    },
    {
      name: "Contact us",
      route: "javascript:void(0)",
    },
  ];

  const [userSession, setUserSession] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { userData, isLoggedIn } = useAppSelector((state) => state.userSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [islogged, setIslogged] = React.useState(false);
  const token = parseCookies().token;
  const role = parseCookies().role
  React.useEffect(() => {
    if (token) {
      setIslogged(true);
    }
  }, [token]);

 

  React.useEffect(() => {
    const checkUserLogin = async() => {
      console.log(isLoggedIn )
    if(!isLoggedIn){
      console.log("weldfbjik")
        const {data} = await getUserInfo()
        if (!data?.length) {
          await userLogout()
          dispatch(logout())
        }else{
          if(!userData){
            dispatch(setLoginData(data[0]))
          }
        }
      }
    }
    checkUserLogin()
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
    </Box>
  );
  const handlelogout=async()=>{
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      await supabase.removeAllChannels()
      await userLogout();
      router.push("/"); 
  }

  const handleRedirect = () => {
    const indexpath = `/${role}`
    if(router.pathname !== "/" || router.pathname !== indexpath){
      console.log(router.pathname, `/${role}`);
      router.push(`/${role}`)
    }
  }

  return (
    <HeaderWrap sx={{ display: "flex" }} className="main_head">
      <AppBar
        component="nav"
        position="static"
        elevation={0}
        className="headerContainer"
      >
        <Container fixed>
          <Toolbar>
            <Typography style={{fontSize:"20px" , fontWeight:600, cursor: "pointer"}} onClick = {handleRedirect}>Welcome to Academy</Typography>
            {islogged ? (
              <Box
                sx={{ display: { xs: "none", sm: "block" } }}
                className="navbar"
              >
                <Button
                  onClick={handlelogout}
                >
                  {" "}
                  Logout
                </Button>
              </Box>
            ) : (
              <Box
                sx={{ display: { xs: "none", sm: "block" } }}
                className="navbar"
                flexDirection={"row"}
              >
                <Button onClick={() => router.push("/auth/login")}>
                  {" "}
                  Login
                </Button>
                <Button onClick={() => router.push("/auth/signup")}>
                  {" "}
                  Signup
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Toolbar />
    </HeaderWrap>
  );
}

const HeaderMemo = React.memo(Header, () => {return true})
export default HeaderMemo


