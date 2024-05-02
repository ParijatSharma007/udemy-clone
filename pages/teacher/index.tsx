import * as React from "react";
import Button from "@mui/material/Button";
import { secondsToHms } from "@/lib/helper/baseToImg";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import { deleteVideo, getTeacherVideos, videoUpload } from "@/api/supabase";
import { videoDetailsInterface } from "@/interface/common.interface";
import * as yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import { useIsMutating, useQuery } from "@tanstack/react-query";
import { queryClient } from "pages/_app";
import Header from "@/layout/Header/Header";
import Uploadpreview from "@/components/Uploadpreview/Uploadpreview";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { toast } from "sonner";

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  border: "2px solid #d24dff",
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Uploadschema = yup.object({
  video: yup.mixed().required(),
  title: yup.string().required(),
});

export default function teacher() {
  const router = useRouter();
  //modal
  // const [openmodal, setOpenmodal] = React.useState(false);
  // const handleOpenModal = () => setOpenmodal(true);
  // const handleCloseModal = () => setOpenmodal(false);
  // //
  const [videouploadStatus, setVideoUploadStatus] = React.useState<boolean>(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["TeacherVideo"],
    queryFn: getTeacherVideos,
  });
  console.log(data, "from usequeerry");

  const isUploadingVideo = useIsMutating({ mutationKey: ["video-upload"] })

  console.log(isUploadingVideo, "Uploading...");

  React.useEffect(() => {
    if(isUploadingVideo !== 0){
      // toast("uploading")
      // handleOpenModal()
      setVideoUploadStatus(true)
    }else{
      if(videouploadStatus){
        // toast("Video Uploaded")
        // handleCloseModal()
        setVideoUploadStatus(false)
      }
    }
  }, [isUploadingVideo])

  return (
    <>
      <Header />
      <Box sx={{ textAlign: "center" }}>
        <Uploadpreview />
      </Box>
      <Box
        sx={{
          marginTop: "1rem",
          padding: "1rem",
          backgroundColor: "cadetblue",
        }}
      >
        {isLoading ? (
          <CircularProgress style={{ marginLeft: "48%" }} />
        ) : (
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 5 }}
            columns={{ xs: 4, md: 12 }}
          >
            {data?.videosData?.map((item: videoDetailsInterface) => (
              <Grid item xs={3}>
                <Card style={{ padding: "5px" }}>
                  <CardActionArea
                    onClick={() => router.push(`/videoplayer/${item.id}`)}
                  >
                    <CardMedia
                      component="img"
                      alt=""
                      height="140"
                      style={{ borderRadius: "5px", position: "absolute" }}
                      image={item.thumbnail_url ?? ""}
                    />
                    <IconButton
                      style={{
                        
                        color: "white",
                        position: "relative",
                        margin: "3rem 2.5rem 3rem 7rem",
                      }}
                      // onClick={() => router.push(`/videoplayer/${item.id}`)}
                    >
                      <PlayCircleIcon fontSize="large"/>
                    </IconButton>
                    <CardContent
                      style={{
                        backgroundColor: "#b3b3b3",
                        borderRadius: "5px",
                        marginTop: "1px",
                      }}
                    >
                      <Grid container>
                        <Grid item xs={8}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            Title: {item.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            Description: {item.description}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            Duration :{secondsToHms(item.duration)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            By : {item.creator_name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                  {
                    <Grid
                      item
                      xs={4}
                      justifyContent="space-between"
                      sx={{ color: "darkred" }}
                    >
                      <CardActions>
                         <Button
                          style={{ color: "white",backgroundColor:"darkred",width:"16rem",}}
                          onClick={async () => {
                            const error = await deleteVideo(item.id);
                            if (!error) {
                              queryClient.invalidateQueries({
                                queryKey: ["TeacherVideo"],
                              });
                            }
                          }}
                        >
                          <Typography
                            style={{ color: "white", fontSize: "14px" }}
                          >
                            Delete{" "}
                          </Typography>
                          <DeleteIcon />
                        </Button>
                        
                        
                      </CardActions>
                    </Grid>
                  }
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      
      </Box>
    </>
  );
}
