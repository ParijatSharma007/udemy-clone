import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
// const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Paper,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { addNote, allNotes, getVideoDetails, getVideoLiveChats, supabase } from "@/api/supabase";
import MuiModalWrapper from "@/ui/Modal/MuiModalWrapper";
import Header from "@/layout/Header/Header";
import ReactPlayer from "react-player";
import { parseCookies } from "nookies";
import Footer from "@/layout/Footer/Footer";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { VideosDetails } from "@/api/supabase/supabaseInterface";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "pages/_app";
import Chatbox from "@/components/chatbox/Chatbox";
interface Data {
  url: string;
}
export interface Note {
  id: string;
  created_at: string;
  video_id: string;
  note: string;
  pause_time: number;
  student_id: string;
  student_img_url: any;
}
const VideoPlayer = () => {
  const router = useRouter();

  const { slug } = router.query;
  const [result, setResult] = React.useState<VideosDetails | null>(null);
  const [pauseTime, setPauseTime] = useState<number | null>(null);
  const [paused, setPaused] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [open, setOpen] = useState(false);
  const [hasWindow, setHasWindow] = useState<boolean>(false);
  const [role, setRole] = useState<"teacher" | "student" | null>(null);
  React.useEffect(() => {
    if (window) {
      setHasWindow(true);
      // supabase.removeAllChannels();
      const userRole = parseCookies().role;
      if (userRole === "teacher" || userRole === "student") {
        setRole(userRole);
      }
    }
  }, []);
  // fetched video details
  React.useEffect(() => {
    const fetchData = async () => {
      if (slug) {
        try {
          const videoDetails = await getVideoDetails(slug as string);
          if (videoDetails.data) setResult({ ...videoDetails.data });
        } catch (error) {
          console.error("Error fetching video details:", error);
        }
      }
    };
    fetchData();
  }, [slug]);

  useEffect(()=>{
    if(typeof slug === "string"){
      const channel =supabase.channel(`${slug} livechat`)
      .on("postgres_changes",{
        event: 'INSERT',
        schema: 'public',
        table : "livechat"
      }, handleNewChat).subscribe()

      return () => {channel.unsubscribe()}
    }
  })

  const handleNewChat = async() => {
    queryClient.invalidateQueries({queryKey : [`chats-${slug}`]})
  }

  //student get all notes,pause time marked on video

  const { data: notes } = useQuery({
    queryKey: ["allnotes"],
    queryFn: () => allNotes(slug),
    enabled: Boolean(typeof slug === "string"),
  });
  //adding notes postreq
  const handlePause = async () => {
    onClose();
    if (typeof pauseTime === "number" && typeof slug === "string") {
      await addNote({
        video_id: slug,
        note: newNote,
        pauseTime,
      });
      queryClient.invalidateQueries({queryKey : ["allnotes"]})
    }
  };
  //dialog box open and video plays after comment added
  const handleComment = () => {
    setOpen(true);
    setPaused(false);
    setPauseTime(playerRef?.current?.getCurrentTime() || 0);
    setPauseTime(playerRef?.current?.getCurrentTime() || 0);
  };
  //video plays onclose
  const onClose = () => {
    setOpen((prev) => !prev);
    setPaused(true);
  };
  //getting the current time
  const timeUpdate = () => {
    setPauseTime(playerRef?.current?.getCurrentTime() || 0);
  };
  //Main time Calculation
  const MainTime = (string: any, pad: any, length: number) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  };
  //paused get time and update pause time
  const handleTime = (e: any) => {
    setPauseTime(pauseTime);
    timeUpdate();
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const {data : chatData} = useQuery({
    queryKey : [`chats-${slug}`],
    queryFn : () => getVideoLiveChats(slug),
    enabled : Boolean(slug)
  })

  const openChat = Boolean(anchorEl);
  const playerRef = useRef<ReactPlayer>(null);

  {
    return (
      hasWindow && (
        <>
          <Header />
          <div style={{ backgroundColor: "cadetblue" }}>
            <Grid
              container
              direction="row"
              // justifyContent="center"
              // alignItems="center"
              columns={{ xs: 4, md: 12 }}
            >
              <Grid item xs={12} md={8} sm={12} lg={8}>
                <Paper
                  elevation={3}
                  style={{
                    margin: "0.5rem",
                    border: "2px solid white",
                    backgroundColor: "#2d5986",
                  }}
                >
                  <ReactPlayer
                    ref={playerRef}
                    id="video"
                    onDuration={(duration) => {
                      console.log(duration);
                    }}
                    onBufferEnd={() => {
                      setPaused(true);
                    }}
                    style={{ margin: "auto" }}
                    height={"30rem"}
                    width={"52rem"}
                    url={result?.video_url}
                    playing={paused}
                    onPause={handleTime as () => void}
                    controls={true}
                    light={false}
                    pip={true}
                  />
                </Paper>
              </Grid>

              {role === "student" && (
                <Grid item xs={12} md={4} sm={12} lg={4}>
                  <Card
                    style={{
                      overflowY: "auto",
                      border: "2px solid white",
                      color: "black",
                      backgroundColor: "#472C4C",
                      height: "30rem",
                      margin: "0.5rem",
                    }}
                  >
                    <Paper
                      style={{
                        color: "white",
                        fontSize: "1.5rem",
                        textAlign: "center",
                        backgroundColor: "#2d5986",
                        height: "3rem",
                        // border: "1px solid white",
                      }}
                      elevation={3}
                    >
                      <Typography
                        style={{
                          fontSize: "larger",
                          fontFamily: "sans-serif",
                          color: "blanchedalmond",
                        }}
                      >
                        Your Notes Here
                      </Typography>
                    </Paper>
                    <Grid
                      container
                      justifyContent="center"
                      style={{ marginTop: "5px" }}
                    >
                      {role === "student" && (
                        <Button
                          onClick={handleComment}
                          style={{
                            color: "white",
                            backgroundColor: "#2d5986",
                            borderRadius: "10px",
                          }}
                        >
                          Add Comment
                        </Button>
                      )}
                    </Grid>
                    {notes?.addedNotes?.map((item) => {
                      const minutes = Math.floor(item.pause_time / 60);
                      const seconds = Math.floor(
                        item.pause_time - minutes * 60
                      );
                      const pauseTime: any =
                        MainTime(minutes, "0", 2) +
                        ":" +
                        MainTime(seconds, "0", 2);

                      return (
                        <Box key={item.id}>
                          <Typography
                            style={{
                              border: "1px solid white",
                              borderRadius: "8px",
                              margin: "0.5rem",
                              fontSize: "small",
                              fontWeight: "600",
                              color: "white",
                              padding: "5px 0 0 5px",
                              wordBreak: "break-all",
                            }}
                          >
                            Note: {item.note}
                            <Typography
                              style={{
                                color: "black",
                                // border: "1px solid black",
                                textAlign: "center",
                                borderRadius: "20px",
                                margin: "0rem 1rem 0.5rem 20rem",
                                padding: "2px",
                                backgroundColor: "white",
                                fontSize: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                console.log(item.pause_time, "tiime");
                                setPaused(false);
                                playerRef.current?.seekTo(
                                  item.pause_time,
                                  "seconds"
                                );
                              }}
                            >
                              {pauseTime}
                            </Typography>
                          </Typography>
                        </Box>
                      );
                    })}
                  </Card>
                </Grid>
              )}
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              style={{ margin: "0.5rem" }}
            >
              <Grid item xs={3}>
                <Paper
                  elevation={3}
                  style={{
                    marginRight: "0.5rem",
                    color: "black",
                    padding: "0.6rem",
                    borderBottom: "1px solid white",
                    borderLeft: "1px solid white",
                    fontWeight: 500,
                  }}
                >
                  The Choto Programmer
                </Paper>
              </Grid>

              <Grid xs={2}>
                <Button
                  style={{
                    color: "white",
                    padding: "0.5rem",

                    backgroundColor: "black",
                  }}
                >
                  Subscribe
                </Button>

                <IconButton aria-label="notifications">
                  <NotificationsIcon style={{ color: "darkred" }} />
                </IconButton>
              </Grid>
            </Grid>
            <Typography
              style={{
                color: "white",

                borderBottom: "1px solid white",
                fontWeight: 500,
              }}
            >
              Description: A YouTube video description is the newNote below your
              videos. It helps viewers find your content, know what your video
            </Typography>

            <Button
              style={{
                color: "white",
                backgroundColor: "black",
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: "999", // optional: to ensure it appears above other content
              }}
              type="button"
              onClick={handleClick}
            >
              Live chat
            </Button>
            <Popper
              open={openChat}
              anchorEl={anchorEl}
              sx={{ justifyContent: "flex-end" }}
            >
              <Chatbox chatArray={chatData?.chats} video_id={slug} />
            </Popper>
          </div>
          <Footer />
          <MuiModalWrapper
            title="Enter Your Comment: "
            open={open}
            onClose={onClose}
          >
            <Grid
              container
              direction={"column"}
              alignItems={"center"}
              columnGap={6}
            >
              <Grid>
                {" "}
                <TextField
                  InputProps={{ style: { color: "black" } }}
                  placeholder="Enter Comment"
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </Grid>
              <Grid>
                <Button
                  style={{
                    color: "white",
                    backgroundColor: "Green",
                    marginTop: 4,
                  }}
                  onClick={handlePause}
                >
                  Save Comment
                </Button>
              </Grid>
            </Grid>
          </MuiModalWrapper>
        </>
      )
    );
  }
};

export default VideoPlayer;
