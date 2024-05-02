import { userLogin } from "@/api/supabase";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Cookies, { parseCookies, setCookie } from "nookies";
import Wrapper from "@/layout/wrapper/Wrapper";
import Header from "@/layout/Header/Header";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { setLoginData } from "@/reduxtoolkit/slices/userSlice";

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().trim().required("Password is required"),
});

export type LoginSchemaFormData = {
  email: string;
  password: string;
  deviceToken?: string | null;
};



const index = () => {
  const [error, setError] = React.useState<string | null>(null)
  const [isLoader,setIsloader]=React.useState(false)
  const router = useRouter();
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaFormData>({
    resolver : yupResolver(schema)
  });

  const onSubmit = async (data: LoginSchemaFormData) => {
    setIsloader(true)
    const { data: userData, error } = await userLogin({
      email: data.email,
      password: data.password,
    });
    setIsloader(false)

    // sessionStorage.setItem("user", JSON.stringify(data?.email));
    // sessionStorage.setItem("loginstatus", "true");
    if (!error && userData) {
      dispatch(setLoginData(userData[0]))
      setCookie(null, "role", userData[0].role, {path : "/"})
      router.push(`/${userData[0].role}`);
    } else {
      setError("Wrong Credentials")
    }
  };

  // useEffect(() => {
  //   if(parseCookies().token){
  //     router.push("/")
  //   }
  // }, [])

  return (
    <>
    <Header />
    <Box className="loginbox">
      <form onSubmit={handleSubmit(onSubmit)} className="loginForm">
        <Typography variant="h5">Login</Typography>
        <TextField
          inputProps={{style:{color:"black"}}}
          {...register("email")}
          label="Email"
          type="email"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
         inputProps={{style:{color:"black"}}}
          {...register("password")}
          label="password"
          type="password"
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        {isLoader? <CircularProgress /> : (" ")}
        {error ?? <p style={{color:"red"}}>{error
        }</p>}
        <Box className="buttonlogpage">
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#7a9abb" }}
          >
            Login
          </Button>
          <Button
            href={"/auth/signup"}
            variant="contained"
            style={{ backgroundColor: " #87CEEB" }}
          >
            Sign Up
          </Button>
        </Box>
      </form>
    </Box>
    </>
  );
};

export default index;