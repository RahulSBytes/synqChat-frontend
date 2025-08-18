import { Camera, Eye, EyeOff, File, KeyRound, Mail, User } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import useMeta from '../hooks/useMeta';


function Login() {

useMeta({title:"login", description:"this is the login page"})

  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const [passSeen, setPassSeen] = useState(true);

  const avatar = watch("avatar");

  const handleLogin = (data) => {
    console.log(data);
  }

  const handleSignup = (data) => {
    console.log(data);
  }

 

  return (
    <section className='w-screen h-screen flex justify-center items-center'>
      {
        isLogin ? <> <form
          onSubmit={handleSubmit(handleLogin)}
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
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Must be at least 3 characters" },
                maxLength: { value: 30, message: "Cannot exceed 30 characters" },
                pattern: {
                  value: /^[A-Za-z][A-Za-z0-9-]*$/,
                  message: "Only letters and numbers are allowed"
                }
              })}
            />
          </label>
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}

          {/* Password */}
          <label className="input validator w-full flex items-center gap-2">
            <KeyRound size={16} strokeWidth={1} />
            <input
              type={passSeen ? "password" : "text"}
              placeholder="Password"
              className="focus:outline-none flex-1"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                pattern: {
                  value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                  message: "Must include number, lowercase, uppercase"
                }
              })}
            />
            <span className='cursor-pointer' onClick={() => setPassSeen(prev => !prev)}>
              {passSeen ? <Eye size={16} strokeWidth={1} /> : <EyeOff size={16} strokeWidth={1} />}
            </span>
          </label>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* Submit */}
          <button type="submit" className="btn btn-active w-full">
            Submit
          </button>

          <p className="text-sm">
            Already have an account?{" "}
            <span
              className="underline cursor-pointer text-blue-600"
              onClick={() => setIsLogin((prev) => !prev)}
            >
              Sign in
            </span>
          </p>
        </form>

        </> :

          // the sign in form

          <form
            onSubmit={handleSubmit(handleSignup)}
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
                    : "/image.png"
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
                {...register("avatar", {
                  validate: (value) => {
                    if (value.length && value[0].size > 2 * 1024 * 1024)
                      return "The file size must be less then 1MB"
                  }
                })}
              />

            </div>
            {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar.message}</p>}

            {/* Username */}
            <label className="input validator w-full flex items-center gap-2">
              <User size={16} strokeWidth={1} />
              <input
                type="text"
                placeholder="Username"
                className="focus:outline-none flex-1"
                {...register("username", {
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
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

            {/* Bio */}
            <label className="input w-full flex items-center gap-2">
              <File size={16} strokeWidth={1} />
              <input
                type="text"
                placeholder="Bio"
                className="grow focus:outline-none"
                {...register("bio")}
              />
            </label>

            {/* Email */}
            <label className="input validator w-full flex items-center gap-2">
              <Mail size={16} strokeWidth={1} />
              <input
                type="email"
                placeholder="example@email.com"
                className="focus:outline-none flex-1"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" }
                })}
              />
            </label>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            {/* Password */}
            <label className="input validator w-full flex items-center gap-2">
              <KeyRound size={16} strokeWidth={1} />
              <input
                type={passSeen ? "password" : "text"}
                placeholder="Password"
                className="focus:outline-none flex-1"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message: "Must include number, lowercase, uppercase"
                  }
                })}
              />
              <span className='cursor-pointer' onClick={() => setPassSeen(prev => !prev)}>
                {passSeen ? <Eye size={16} strokeWidth={1} /> : <EyeOff size={16} strokeWidth={1} />}
              </span>
            </label>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            {/* Submit */}
            <button type="submit" className="btn btn-active w-full">Submit</button>

            <p className="text-sm">
              Already have an account?{" "}
              <span
                className="underline cursor-pointer text-blue-600"
                onClick={() => setIsLogin(prev => !prev)}
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