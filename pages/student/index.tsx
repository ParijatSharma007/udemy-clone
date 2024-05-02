import { getAllvideos } from '@/api/supabase'
import { Card, CardActionArea, CardContent, CardMedia, Grid, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Header from '@/layout/Header/Header'
import { secondsToHms } from '@/lib/helper/baseToImg'
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

const index = () => {
  const router = useRouter()
  const {data} = useQuery({
    queryKey : ["all-videos"],
    queryFn : getAllvideos
  })
  console.log(data, "videos");
  return (
    <>
       <Header />  
      <Box sx={{ marginTop: "2rem" ,backgroundColor:"cadetblue"}}>
        <Grid
          container
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 5 }}
          columns={{ xs: 4, md: 12 }}
        >
           {data?.map((item) => (
           <Grid item xs={3}>
           <Card style={{padding:"5px" ,margin:"0.5rem"}} onClick={() => router.push(`/videoplayer/${item.id}`)}>
             <CardActionArea>
               <CardMedia
                 component="img"
                 alt=""
                 height="140"
                 style={{borderRadius:"5px",position: "absolute"}}
                 image={item.thumbnail_url ?? ""} 
               />
               <IconButton
                      style={{ 
                        color: "white",
                        position: "relative",
                        margin: "3rem 2.5rem 3rem 7rem",
                      }}
                    >
                      <PlayCircleIcon fontSize="large"/>
                    </IconButton>
               <CardContent style={{backgroundColor:"#b3b3b3",borderRadius:"5px",marginTop:"1px"}}>
               <Typography variant="body2" color="textSecondary" component="p">
                   Title: {item.title}
                 </Typography>
                 <Typography variant="body2" color="textSecondary" component="p">
                   Description: {item.description}
                 </Typography>
                 <Typography variant="body2" color="textSecondary" component="p">
                   Duration: {secondsToHms(item.duration)}
                 </Typography>
                 <Typography variant="body2" color="textSecondary" component="p">
                   By : {item.creator_name}
                 </Typography>
               </CardContent>
             </CardActionArea>
           </Card>
         </Grid>
          ))}
        </Grid>
      </Box>
  </>
  )
}

export default index

