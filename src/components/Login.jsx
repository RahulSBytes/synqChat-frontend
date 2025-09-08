import { Camera, Eye, EyeOff, File, KeyRound, Mail, User } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import useMeta from '../hooks/useMeta';
import axios from 'axios'
import { useAuthStore } from '../store/authStore.js';
import { server } from '../constants/config.js';


function Login() {

  useMeta({ title: "login", description: "this is the login page" })

  const [isAlreadyUser, setIsAlreadyUser] = useState(false);
  const signupForm = useForm();
  const loginForm = useForm();

  const [passSeen, setPassSeen] = useState(false);
  const avatar = signupForm.watch("avatar");

  const { user, userExists } = useAuthStore()

  const handleLogin = async (param) => {
    try {
      const { data } = await axios.post(`${server}/api/v1/auth/login`, param, {
        withCredentials: true  // This tells browser to accept cookies if not added cookies won't be added
      });

      useAuthStore.getState().userExists(data.savedUserData)
    } catch (err) {
      console.log("error sending data from axios :: ", err)
    }
  }

  const handleSignup = async (param) => {
    const { bio, username, fullName, password, email, avatar } = param;
    const formData = new FormData()
    // Add text fields
    formData.append('bio', bio)
    formData.append('email', email)
    formData.append('fullName', fullName)
    formData.append('password', password)
    formData.append('username', username)
    formData.append('avatar', avatar[0]) 

    const { data } = await axios.post(`${server}/api/v1/auth/register`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("result from signup :: ", data);
  }

  return (
    <section className='w-screen h-screen flex justify-center items-center'>
      {
        isAlreadyUser ? <> <form
          onSubmit={loginForm.handleSubmit(handleLogin)}
          className="login-form justify-center items-center flex flex-col w-2/3 max-w-[400px] m-auto gap-8 p-8"
        >
          <h2 className="text-2xl font-semibold">Login</h2>

          {/* Username */}
          <label className="input validator w-full flex items-center gap-2">
            <User size={16} strokeWidth={1} />
            <input
              type="text"
              placeholder="Username"
              className="focus:outline-none flex-1"
              {...loginForm.register("username", {
                required: "Username is required",
              })}
            />
          </label>
          {loginForm.formState.errors.username && (
            <p className="text-red-500 text-sm">{loginForm.formState.errors.username.message}</p>
          )}

          {/* Password */}
          <label className="input validator w-full flex items-center gap-2">
            <KeyRound size={16} strokeWidth={1} />
            <input
              type={passSeen ? "text" : "password"}
              placeholder="Password"
              className="focus:outline-none flex-1"
              {...loginForm.register("password", {
                required: "Password is required"
              })}
            />
            <span className='cursor-pointer' onClick={() => setPassSeen(prev => !prev)}>
              {passSeen ? <EyeOff size={16} strokeWidth={1} /> : <Eye size={16} strokeWidth={1} />}
            </span>
          </label>
          {loginForm.formState.errors.password && (
            <p className="text-red-500 text-sm">{loginForm.formState.errors.password.message}</p>
          )}

          {/* Submit */}
          <button type="submit" className="btn btn-active w-full">
            Login
          </button>

          <p className="text-sm">
            Don't have an account?{" "}
            <span
              className="underline cursor-pointer text-blue-600"
              onClick={() => setIsAlreadyUser((prev) => !prev)}
            >
              Sign up
            </span>
          </p>
        </form>

        </> :

          // the signin form

          <form
            onSubmit={signupForm.handleSubmit(handleSignup)}
            className="login-form justify-center items-center flex flex-col w-2/3 max-w-[400px] m-auto gap-6 p-8"
          >
            <h2 className="text-2xl font-semibold">Sign up</h2>

            {/* Avatar Upload */}
            <div className="relative">
              <img
                className="bg-zinc-400 w-24 h-24 rounded-full object-cover"
                src={
                  avatar && avatar[0]
                    ? URL.createObjectURL(avatar[0])
                    : "/unknown.jpg"
                }
              />
              <label
                htmlFor="avatar"
                className="absolute right-0 bottom-0 bg-zinc-900 h-6 w-6 flex justify-center items-center rounded-full cursor-pointer"
              >
                <Camera size={16} strokeWidth={1.5} className="text-white" />
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                className="hidden"
                {...signupForm.register("avatar", {
                  validate: (value) => {
                    if (value?.length && value[0].size > 2 * 1024 * 1024)
                      return "The file size must be less than 2MB"
                  }
                })}
              />

            </div>
            {signupForm.formState.errors.avatar && <p className="text-red-500 text-sm">{signupForm.formState.errors.avatar.message}</p>}

            {/* Username */}
            <label className="input validator w-full flex items-center gap-2">
              <User size={16} strokeWidth={1} />
              <input
                type="text"
                placeholder="Full name"
                className="focus:outline-none flex-1"
                {...signupForm.register("fullName", {
                  required: "fullname is required",
                  maxLength: { value: 30, message: "Max 30 characters" },
                })}
              />
            </label>
            {signupForm.formState.errors.fullName && <p className="text-red-500 text-sm">{signupForm.formState.errors.fullName.message}</p>} {/* Fixed: FullName to fullName */}


            {/* Username */}
            <label className="input validator w-full flex items-center gap-2">
              <User size={16} strokeWidth={1} />
              <input
                type="text"
                placeholder="Username"
                className="focus:outline-none flex-1"
                {...signupForm.register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "At least 3 characters" },
                  maxLength: { value: 30, message: "Max 30 characters" },
                  pattern: {
                    value: /^[A-Za-z][A-Za-z0-9-]*$/,
                    message: "Only letters, numbers or dash"
                  }
                })}
              />
            </label>
            {signupForm.formState.errors.username && <p className="text-red-500 text-sm">{signupForm.formState.errors.username.message}</p>}

            {/* Bio */}
            <label className="input w-full flex items-center gap-2">
              <File size={16} strokeWidth={1} />
              <input
                type="text"
                placeholder="Bio"
                className="grow focus:outline-none"
                {...signupForm.register("bio")}
              />
            </label>

            {/* Email */}
            <label className="input validator w-full flex items-center gap-2">
              <Mail size={16} strokeWidth={1} />
              <input
                type="email"
                placeholder="example@email.com"
                className="focus:outline-none flex-1"
                {...signupForm.register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" }
                })}
              />
            </label>
            {signupForm.formState.errors.email && <p className="text-red-500 text-sm">{signupForm.formState.errors.email.message}</p>}

            {/* Password */}
            <label className="input validator w-full flex items-center gap-2">
              <KeyRound size={16} strokeWidth={1} />
              <input
                type={passSeen ? "text" : "password"}
                placeholder="Password"
                className="focus:outline-none flex-1"
                {...signupForm.register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message: "Must include number, lowercase, uppercase"
                  }
                })}
              />
              <span className='cursor-pointer' onClick={() => setPassSeen(prev => !prev)}>
                {passSeen ? <EyeOff size={16} strokeWidth={1} /> : <Eye size={16} strokeWidth={1} />}
              </span>
            </label>
            {signupForm.formState.errors.password && <p className="text-red-500 text-sm">{signupForm.formState.errors.password.message}</p>}

            {/* Submit */}
            <button type="submit" className="btn btn-active w-full">signup</button>

            <p className="text-sm">
              Already have an account?{" "}
              <span
                className="underline cursor-pointer text-blue-600"
                onClick={() => setIsAlreadyUser(prev => !prev)}
              >
                Log in
              </span>
            </p>
          </form>
      }
    </section>
  )
}

export default Login