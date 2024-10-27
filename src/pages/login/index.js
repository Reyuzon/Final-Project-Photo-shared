import React from "react";
import { withoutAuth } from "@/lib/withoutAuth";
import { loginSchema } from "@/schema/loginSchema";
import { loginUser } from "@/services/authService";
import { setUser } from "@/slice/userSlice";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { mutate: loginMutate } = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      toast.dismiss();
      setCookie("token", res.data.token);
      dispatch(setUser(res.data.user));
      router.replace("/");
      toast.success("Login Success");
    },
    onError: () => {
      toast.dismiss();
      toast.error("Username or Password is incorrect");
    },
  });

  const handleLogin = async (values) => {
    toast.loading("Loading...");
    loginMutate(values);
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={loginSchema}
      onSubmit={handleLogin}>
      <Form className="max-w-sm mx-auto border px-7 py-10 my-5 rounded-md shadow">
        <Image
          alt="Logo Icon"
          src="/images/logo.svg"
          width={280}
          height={280}
          className="mx-auto w-1/2"
        />
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900">
            Email
          </label>
          <Field
            type="email"
            id="email"
            name="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          <ErrorMessage
            name="email"
            component="p"
            className="mt-2 text-xs text-red-600"
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900">
            Your password
          </label>
          <Field
            type="password"
            id="password"
            name="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          <ErrorMessage
            name="password"
            component="p"
            className="mt-2 text-xs text-red-600"
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
          Submit
        </button>
        <div className="mt-3 text-sm">
          <span>Don’t have an account?&nbsp;</span>
          <Link href="/signup" className="text-blue-800 font-semibold">
            Sign Up
          </Link>
        </div>
      </Form>
    </Formik>
  );
}

export const getServerSideProps = withoutAuth(async (context) => {
  // Get props khusus jika diperlukan untuk halaman login
  return {
    props: {}, // tambahkan props sesuai kebutuhan
  };
});
