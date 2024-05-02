import {
  Box,
  Button,
  Card,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { VideoChatsInterface } from "@/api/supabase/supabaseInterface";
import { postVideoChat, supabase } from "@/api/supabase";
import React, { useEffect } from "react";
import { style } from "@mui/system";
import message from "@/json/messages/message";
export default function Chatbox({
  chatArray,
  video_id,
}: {
  chatArray: VideoChatsInterface[] | null | undefined | [];
  video_id: any;
}) {
  const userDetails = useAppSelector((state) => state.userSlice.userData);
  const messager_id = userDetails?.id;
  const messager_img_url = userDetails?.profile_image;
  console.log(userDetails, "userdetails");
  const [chat, setChat] = React.useState<string>("");
  console.log(chat);
  const handleSendMessage = async () => {
    if (typeof messager_id === "string" && typeof video_id === "string" && chat)
      await postVideoChat({
        messager_id,
        messager_img_url,
        video_id,
        message: chat,
      });
    setChat("");
  };

  return (
    <>
   <Card
      style={{
        overflow: 'hidden', // Hide overflow for the Card
        border: '2px solid Green',
        color: 'black',
        backgroundColor: 'whitesmoke',
        height: '30rem',
        position: 'relative',
      }}
    >
      <Paper
        style={{
          width: '26rem',
          position: 'absolute',
          top: 0,
          left: '48%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '1.5rem',
          textAlign: 'center',
          backgroundColor: 'forestgreen',
          height: '3rem',
          zIndex: 1,
        }}
        elevation={3}
      >
        <Typography
          style={{
            fontSize: 'larger',
            fontFamily: 'sans-serif',
            color: 'white',
          }}
        >
          Live Chat
        </Typography>
      </Paper>

      {/* Scrollable content container */}
      <Box
        style={{
          overflowY: 'auto', // Enable vertical scrolling only
          maxHeight: 'calc(100% - 5rem)', // Adjust the max height to accommodate the header and bottom part
          paddingTop: '3rem', // Offset for the fixed header
          paddingBottom: '6rem', // Offset for the fixed bottom part
        }}
      >
        <Grid
          container
          direction="column"
          justifyContent="flex-end"
          style={{ marginTop: '25px', width: '25rem', padding: '10px' }}
        >
          {chatArray?.map((item, index) => (
            <Box key={index} mb={1}>
              {!Boolean(item.messager_id === messager_id) ? (
                <Grid item xs={12} container alignItems="center" flexWrap="nowrap">
                  <AccountCircleIcon style={{ color: 'green', marginRight: '0.2rem' }} />
                  <Typography
                    style={{
                      color: 'white',
                      borderRadius: '10px',
                      padding: '9px',
                      backgroundColor: 'black',
                      fontSize: '15px',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {item.message}
                  </Typography>
                </Grid>
              ) : (
                <Grid item xs={12} container justifyContent="flex-end" alignItems="center" flexWrap="nowrap">
                  <Typography
                    style={{
                      color: 'black',
                      borderRadius: '20px',
                      padding: '9px',
                      backgroundColor: 'darkgrey',
                      fontSize: '15px',
                      cursor: 'pointer',
                      // overflowWrap: 'break-word',
                      wordBreak:"break-all"
                    }}
                  >
                    {item.message}
                  </Typography>
                  <AccountCircleIcon style={{ color: '#66b3ff', marginRight: '0.5rem' }} />
                </Grid>
              )}
            </Box>
          ))}
        </Grid>
      </Box>

      {/* Bottom part containing TextField and Send Button */}
      <Grid
        container
        
        justifyContent="space-between"
        alignItems="center"
        style={{
          position: 'absolute',
          bottom: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '25rem',
          flexWrap: "nowrap"
        }}
      >
        <TextField
          InputProps={{ style: { color: 'black', width: '20rem' } }}
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          style={{ width: '20rem', backgroundColor: 'white' }}
        
          placeholder="Type your message"
        />
        <Button
          
          style={{ width: '5rem', color: 'white', backgroundColor: 'green',padding:"0.9rem" }}
          onClick={handleSendMessage}
        
        >
          Send
        </Button>
      </Grid>
    </Card>
  
 
  </>
  );
}
