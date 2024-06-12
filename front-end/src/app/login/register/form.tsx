"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { TosModal } from "@/components/forms";
import { Input } from "@/components/ui/input";
import CreateUser from "@/functions/mutations/create-user";

interface IFormInput {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
  terms: boolean;
}

export default function CreateAccount() {
  const {
    register,
    watch,
    getValues,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  React.useEffect(() => {
    setError("confirmPassword", {
      type: "manual",
      message: "Passwords do not match",
    });
  }, [getValues("password"), getValues("confirmPassword")]);

  const onSubmit = async (formData: IFormInput) => {
    try {
      await CreateUser(formData);
      void Swal.fire({
        title: "Account Created",
        text: "Your account has been created. Please login.",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        window.location.href = "/login";
      });
    } catch (error) {
      void Swal.fire({
        title: "Error",
        text: "Something went wrong. Please contact the administrator.",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Ok",
        cancelButtonText: "Try Again",
      }).then((result) => {
        if (result.isConfirmed) {
          redirect("/");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          location.reload();
        }
      });
    }
  };
  return (
    <div className="bg-gray-100 p-4 shadow-lg drop-shadow-md">
      <h2 className="basis-full text-center text-4xl font-bold">
        {" "}
        Create an account
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label htmlFor="name">Name</label>
          <Input
            className="text-black"
            {...register("name")}
            type="text"
            required
            placeholder="First and Last name"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email">Email Address</label>
          <Input
            className="text-black"
            {...register("email")}
            required
            type="email"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <Input
            {...register("password", {
              required: true,
              minLength: 5,
            })}
            id="password"
            type="password"
            placeholder="********"
            className="text-black"
          />
          {errors?.password?.type === "required" && (
            <p className="font-bold text-red-600">This field is required</p>
          )}
          {errors?.password?.type === "minLength" && (
            <p className="font-bold text-red-600">
              password cannot less than 5 characters
            </p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <Input
            className="text-black"
            type="password"
            {...register("confirmPassword")}
            placeholder="********"
          />
          {watch("confirmPassword") !== watch("password") &&
          getValues("confirmPassword") ? (
            <p className="font-bold text-red-600">passwords do not match</p>
          ) : null}
        </div>
        <div></div>
        <div>
          <input type="checkbox" {...register("terms")} required />
          <label htmlFor="terms" className="m-2 inline">
            I agree to the{" "}
            <strong className="">
              {" "}
              <TosModal />
            </strong>
          </label>
        </div>
        <div></div>
        <button
          className="sm:text-md mt-5 rounded-md bg-primary p-1 text-center text-sm text-white shadow-md drop-shadow-md transition-all duration-75 ease-in-out hover:scale-105 hover:bg-purple-700 dark:bg-secondary sm:p-2 sm:hover:translate-x-1 sm:hover:translate-y-1"
          type="submit"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
