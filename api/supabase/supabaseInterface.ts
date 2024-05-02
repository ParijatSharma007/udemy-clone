export interface SupabaseAuth {
    email: string,
    password: string,
    role : "teacher" | "student"
    phone : string,
}

export interface SupabaseAuthLogin {
    email: string,
    password: string,

}


export interface SupabaseSignup extends SupabaseAuth{
    fullname : string,
    profileImage ?: File
}

export interface VideoUploadpayload {
    creator_name : string,
    creator_img_url :string,
    creator_id : string,
    file : File
}

// let test : Array<number | string | object>

// test = [2, "ok", {iushdi : 667}]

//     // type Test =  
export interface getallVideos{

        id: string
        created_at: string
        video_url: string
        creator_name: string
        creator_img_url: string
        creator_id: string
        thumbnail_url: string
        title: string
}
export interface VideosDetails{
    id: string,
    video_id : string
    created_at: string
    video_url: string
    creator_name: string
    creator_img_url: string
    creator_id: string
    thumbnail_url: string
    title: string
    duration : number
    description:string
}

export interface Addnotes {
    id: string
    created_at: string
    email: string
    user_id: string
    role: string
    fullname: string
    phone: string
    profile_image: string
    pending: boolean
  }

  export interface Allnotes {
    id: string
    created_at: string
    video_id: string
    note: string
    pause_time: number
    student_id: string
    student_img_url: string
  }

  export interface VideoChatsInterface {
    id : string
    created_at : string
    message : string
    video_id : string
    messager_id : string,
    messager_img_url : string | null
  }
