import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

const servicebase = createClient(supabaseUrl ?? "", serviceKey ?? "")

export const amdinUserData = async() => {
    const {data, error} = await servicebase.from("Users").select()
    console.log(data, "service user");
    return{
      data,
      error
    }
  }