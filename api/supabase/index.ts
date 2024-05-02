import { createClient } from "@supabase/supabase-js";
import {
  Allnotes,
  SupabaseAuth,
  SupabaseAuthLogin,
  SupabaseSignup,
  VideoChatsInterface,
  VideosDetails,
} from "./supabaseInterface";
// import { Cookie } from "@mui/icons-material";
import { setCookie } from "nookies";
import { setToken, setUserId } from "@/lib/auth";
import { decode } from "base64-arraybuffer";
import { queryClient } from "pages/_app";
import eventEmitter from "services/event.emitter";
import { userData } from "@/types/common.type";
import { videoDetailsInterface } from "@/interface/common.interface";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl , supabaseAnonKey , {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});

export const videoUploadController = new AbortController();

export const useUserSignup = () => {
  const userSignUp = async (userInput: SupabaseAuth) => {
    const { data: signupData, error: signUpError } = await supabase.auth.signUp(
      {
        email: userInput.email,
        password: userInput.password,
        options: {
          data: {
            web_role: userInput.role,
            phone: userInput.phone,
          },
        },
      }
    );
    return {
      signupData,
      signUpError,
    };
  };
  const addImageToStorage = async (id: string, file: File | undefined) => {
    if (file) {
      const { data: imageUploadData, error: imageUploadError } =
        await supabase.storage.from("profile").upload(`${id}`, file, {
          contentType: file.type,
        });
      console.log(imageUploadError, "I am error");
      if (!imageUploadError) {
        const { data: imgUrl } = supabase.storage
          .from("profile")
          .getPublicUrl(imageUploadData.path);
        return {
          imageUrl: imgUrl,
          imageUploadError,
        };
      }
    }
    return {
      imageUrl: null,
      imageUploadError: false,
    };
  };

  const addUserToDatabase = async (
    userInput: SupabaseSignup,
    userId: string,
    imgUrl?: string | null
  ) => {
    const { fullname, email, role, phone } = userInput;
    const { data: dataUpload, error: dataUploaderror } = await supabase
      .from("Users")
      .insert([
        {
          role,
          fullname,
          email,
          phone,
          profile_image: imgUrl,
          user_id: userId,
          pending: Boolean(role === "teacher"),
        },
      ]);
    return {
      dataUpload,
      dataUploaderror,
    };
  };

  const userSignup = async (userInput: SupabaseSignup) => {
    const { signupData, signUpError } = await userSignUp({
      email: userInput.email,
      password: userInput.password,
      role: userInput.role,
      phone: userInput.phone,
    });
    if (!signUpError && signupData.session?.access_token) {
      supabase.realtime.setAuth(signupData.session.access_token);
    }

    if (!signUpError && signupData.user?.id && signupData.user?.email) {
      const { imageUrl, imageUploadError } = await addImageToStorage(
        signupData.user.id,
        userInput.profileImage
      );
      if (signupData.session?.user && !imageUploadError) {
        const {} = await addUserToDatabase(
          userInput,
          signupData.session.user.id,
          imageUrl?.publicUrl
        );
        setCookie(null, "token", signupData.session.refresh_token, {
          path: "/",
        });
        setCookie(null, "role", userInput.role, { path: "/" });
        setUserId(signupData.session.user.id);
        setToken(signupData.session.refresh_token);

        return {
          success: !Boolean(signUpError),
          role: userInput.role,
          accessToken: signupData.session?.access_token,
          refreshToken: signupData.session?.refresh_token,
          userId: signupData.session?.user.id,
          imgUrl: imageUrl,
        };
      }
    }

    return {
      success: !Boolean(signUpError),
      role: userInput.role,
      accessToken: signupData.session?.access_token,
      refreshToken: signupData.session?.refresh_token,
      userId: signupData.session?.user.id,
      imgUrl: null,
    };
  };

  return { userSignup, addImageToStorage };
};

export const userLogin = async (userInput: SupabaseAuthLogin) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: userInput.email,
    password: userInput.password,
  });
  if (!error && typeof data.session?.access_token === "string") {
    console.log(data.session.access_token, "token");
    supabase.realtime.setAuth(data.session.access_token);
    setCookie(null, "token", data.session.refresh_token, { path: "/" });
    setUserId(data.session.user.id);
    setToken(data.session.refresh_token);
    console.log(data);
    const { data: userData, error } = await supabase
      .from("Users")
      .select()
      .eq("user_id", data.session.user.id);
    if (userData) setCookie(null, "role", userData[0].role, { path: "/" });
    return {
      data: userData,
      error,
    };
  }
  return {
    data: null,
    error,
  };
};

export const userLogout = async () => {
  document.cookie = "token" + "=; expires=Thu, 01-Jan-70 00:00:01 GMT;";
  document.cookie = "role" + "=; expires=Thu, 01-Jan-70 00:00:01 GMT;";
  setUserId(null);
  setToken(null);
  sessionStorage.clear();
  queryClient.removeQueries();
  const { error } = await supabase.auth.signOut();
  
};

export const InitialChecking = async (token: string | undefined | null) => {
  if (token) {
    // supabase.realtime.setAuth(token);
  }
};

export async function videoUpload({
  title,
  video,
  thumbnail,
  duration,
  description,
}: {
  title: string;
  video: File;
  thumbnail: string;
  duration: number;
  description: string;
}) {
  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select();
  if (userData && !userError) {
    const { id, role, fullname, profile_image } = userData[0];
    const uploadVideo = async () => {
      const { data: videoUploadData, error: videoUploadError } =
        await supabase.storage
          .from("videos")
          .upload(`${fullname}${Math.random()}${Date()}`, video, {
            contentType: video.type,
          });
      // console.log(videoUploadError, "I am videoerror");
      if (!videoUploadError) {
        const { data: videoUrl } = supabase.storage
          .from("videos")
          .getPublicUrl(videoUploadData.path);
        return {
          videoUrl: videoUrl,
          videoUploadError,
        };
      }
      return {
        videoUrl: null,
        videoUploadError,
      };
    };

    const uploadThumbnail = async (name: string) => {
      const base64 = thumbnail.split("base64,")[1];
      const { data: thumbnailData, error: thumbnailError } =
        await supabase.storage.from("thumbnail").upload(name, decode(base64), {
          contentType: "image/png",
        });
      if (!thumbnailError) {
        const { data: thumbnailUrl } = supabase.storage
          .from("thumbnail")
          .getPublicUrl(thumbnailData.path);
        return {
          thumbnailUrl: thumbnailUrl,
          thumbnailError,
        };
      }
      return {
        thumbnailUrl: null,
        thumbnailError,
      };
    };

    const addVideoToDatabase = async (
      video_url: string,
      thumbnailUrl: string
    ) => {
      const { data: dataUpload, error: dataUploaderror } = await supabase
        .from("videos")
        .insert([
          {
            creator_name: fullname,
            creator_id: id,
            creator_img_url: profile_image,
            video_url,
            thumbnail_url: thumbnailUrl,
            title,
            duration: Math.ceil(duration)-1,
            description,
          },
        ])
        .abortSignal(videoUploadController.signal);
      console.log(dataUploaderror, "dataupload error");
      return {
        dataUpload,
        dataUploaderror,
      };
    };
    const { videoUrl, videoUploadError } = await uploadVideo();

    if (!videoUploadError) {
      const { thumbnailUrl, thumbnailError } = await uploadThumbnail(
        id + Date()
      );
      if (!thumbnailError) {
        await addVideoToDatabase(videoUrl.publicUrl, thumbnailUrl.publicUrl);
        eventEmitter.emit("listenUpload", false)
      }
    }
  }
}

export const getTeacherVideos = async () => {
  const { data: creator_id, error: verificationError } = await supabase
    .from("Users")
    .select("id");
  if (!verificationError && creator_id[0]?.id) {
    const { data: videosData, error } = await supabase
      .from("videos")
      .select()
      .eq("creator_id", creator_id[0].id);
    return {
      videosData,
      error,
    };
  }
  return {
    videosData: null,
    error: true,
  };
};

// export const getAllVideos = async () => {
//   const { data, error } = await supabase.from("videos").select();
//   return {
//     data,
//     error,
//   };
// };

export const getVideoDetails = async (id: string) => {
  const { data, error } = await supabase
    .from("videos")
    .select()
    .eq("id", id)
    .returns<VideosDetails[]>();
  return {
    data: data && data[0],
    error,
  };
};

export const getUserInfo = async () => {
  const { data, error } = await supabase.from("Users").select().returns<userData[]>();
  return {
    data,
    error,
  };
};


export const allNotes = async (video_id: string | string[] | undefined) => {
  const { data, error } = await getUserInfo();
  if (!error && data !== null && data.length) {
    const id = data[0].id;
    const { data: addedNotes, error: addedNotesError } = await supabase
      .from("notes")
      .select()
      .eq("student_id", id)
      .eq("video_id", video_id)
      .returns<Allnotes[]>();
    return {
      addedNotes : addedNotes?.reverse(),
      addedNotesError,
    };
  }
  return {
    addedNotes: null,
    addedNotesError: true,
  };
};

export const addNote = async ({
  video_id,
  note,
  pauseTime,
}: {
  video_id: string;
  note: string;
  pauseTime: number;
}) => {
  const { data, error } = await getUserInfo();
  if (!error && data !== null) {
    const id = data[0].id;
    const student_img_url = data[0].profile_image;
    await supabase.from("notes").insert([
      {
        student_id: id,
        video_id,
        note,
        pause_time: pauseTime.toString(),
        student_img_url,
      },
    ]);
  }
};

export const getAllvideos = async () => {
  const { data: videos, error } = await supabase
    .from("videos")
    .select()
    .returns<VideosDetails[]>();
  return videos;
};

export const deleteVideo = async (id: string) => {
  const { error } = await supabase.from("videos").delete().eq("id", id);
  return error
};

export const getVideoLiveChats = async(id : string | string[] | undefined) => {
  const {data, error} = await supabase.from("livechat").select().eq("video_id", id).returns<VideoChatsInterface[]>()
  return{
    chats : data,
    error
  }
}

export const postVideoChat = async(userInput : {
  message : string,
  video_id : string,
  messager_id : string,
  messager_img_url ?: any 
}) => {
  const {error} = await supabase.from("livechat").insert({
    ...userInput
  })
  return error
}
