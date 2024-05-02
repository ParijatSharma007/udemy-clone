import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "pages/_app";
import {
  getTeacherVideos,
  videoUpload,
  videoUploadController,
} from "@/api/supabase";
import { videoDetailsInterface } from "@/interface/common.interface";
import { VideoToFrames, VideoToFramesMethod } from "../videoPlayer/videoframes";
import {
  Box,
  CardMedia,
  CircularProgress,
  Grid,
  Input,
  Modal,
  TextField,
} from "@mui/material";
import { boolean } from "yup";
import ReactPlayer from "react-player";
import eventEmitter from "services/event.emitter";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiPaper-root": {
    width: "70%",
    maxWidth: "none", 
  },
}));
const modalstyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Uploadpreview() {
  const [open, setOpen] = React.useState(false);
  const [thumbnail, setThambail] = React.useState<Array<any> | null>([]);
  const [file, setFile] = React.useState<File | null>();
  const [title, setTitle] = React.useState<string>("");
  const [isloading, setIsloading] = React.useState<boolean>(false);
  const [duration, setDuration] = React.useState<number | null>(null);
  const [description, setDescription] = React.useState<string | null>("");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleAbort = () => {
    setIsloading(false);
    videoUploadController.abort();
  };
  const handleClear = () => {
    const fileInputElement = document.getElementById(
      "file-input"
    ) as HTMLInputElement;
    if (fileInputElement?.value) {
      fileInputElement.value = "";
    }
    setTitle("");
    setDescription("");
    setThambail([]);
    setFile(null);
    setDuration(null);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["video-upload"],
    mutationFn: videoUpload,
  });
  //function

  const onSubmit = async () => {
    if (title && file && thumbnail?.length && duration && description) {
      setIsloading(true);

      eventEmitter.emit("listenUploading", true);

      await mutateAsync({
        title,
        thumbnail: thumbnail[0],
        video: file,
        duration,
        description,
      });
      await queryClient.invalidateQueries({ queryKey: ["TeacherVideo"] });
      eventEmitter.emit("listenUpload", true);
      setIsloading(false);
      handleClear();
      setOpen(false);
    }
  };
  const handletitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    console.log(description);
  };

  const handleChange = async (e: any) => {
    setDuration(null);
    setFile(e.target.files[0]);
    if (e.target.files.length) {
      console.log(e.target.files[0]);
      const [file] = e.target.files;
      const fileUrl = URL.createObjectURL(file);
      const frames = await VideoToFrames.getFrames(
        fileUrl,
        1,
        VideoToFramesMethod.totalFrames
      );
      setThambail(frames);
    } else {
      setThambail(null);
      setDuration(null);
    }
  };
  ///end

  return (
    <React.Fragment>
      <Button
        style={{ color: "Green", fontSize: "3rem" }}
        component={"form"}
        variant="outlined"
        onClick={handleClickOpen}
      >
        Upload Video
      </Button>
      <BootstrapDialog
        onClose={handleClear}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, fontSize: "20px", color: "black" }}
          id="customized-dialog-title"
        >
          Details
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleClear}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon onClick={() => setOpen(false)} />
        </IconButton>
        <DialogContent dividers>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              style={{ color: "Green", fontSize: "2rem" }}
              component={"form"}
            >
              Upload Video
            </Typography>

            <Grid container>
              <Grid
                item
                xs={8}
                container
                style={{ backgroundColor: "", padding: "3rem" }}
                direction="column"
              >
                <TextField
                  id="file-input"
                  InputProps={{ style: { color: "black" } }}
                  inputProps={{ accept: "video/mp4" }}
                  style={{ marginBottom: "2rem" }}
                  type="file"
                  onChange={handleChange}
                />
                <TextField
                  placeholder="Title"
                  value={title}
                  InputProps={{ style: { color: "black" } }}
                  style={{ marginBottom: "2rem" }}
                  type="text"
                  onChange={handletitle}
                />
                <TextField
                  value={description}
                  placeholder="Description"
                  InputProps={{ style: { color: "black" } }}
                  style={{ marginBottom: "2rem" }}
                  type="text"
                  onChange={handleDescription}
                />
              </Grid>
              <Grid
                item
                xs={4}
                style={{
                  border: "2px solid #b3b3b3",
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                <div style={{ margin: "auto", maxWidth: "15rem" }}>
                  <Typography>Preview</Typography>
                  {thumbnail && file && (
                    <Box>
                      <img
                        style={{
                          width: "100%",
                          height: "auto",
                          margin: "auto",
                        }}
                        src={thumbnail[0]}
                        alt=""
                      />
                      {!duration && (
                        <ReactPlayer
                          height={1}
                          width={1}
                          url={URL.createObjectURL(file)}
                          playing={true}
                          muted
                          light={Boolean(duration)}
                          onDuration={(duration) => {
                            console.log(duration, "time duration");
                            setDuration(duration);
                          }}
                        />
                      )}
                    </Box>
                  )}
                </div>

                <Grid>
                  <Grid>{isloading ? <CircularProgress /> : null}</Grid>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ textAlign: "center" }}>
              {!isloading ? (
                <Box>
                  <Button
                    onClick={handleClear}
                    style={{
                      backgroundColor: "darkred",
                      color: "white",
                      margin: 4,
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    style={{ backgroundColor: "green", color: "white" }}
                    type="button"
                    onClick={onSubmit}
                  >
                    Submit
                  </Button>
                </Box>
              ) : (
                <Button
                  onClick={handleAbort}
                  style={{
                    backgroundColor: "darkred",
                    color: "white",
                    margin: 4,
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
