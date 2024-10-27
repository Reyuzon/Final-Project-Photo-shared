import React from "react";
import { signupSchema } from "@/schema/signupSchema";
import { registerUser } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();

  const { mutate: signupMutate } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.push("/login");
      toast.dismiss();
      toast.success("Sign Up Success");
    },
    onError: (err) => {
      toast.dismiss();
      toast.error(err.response.data.message);
    },
  });

  const handleSignUp = (values) => {
    const { fullname, username, email, password, confirmPassword } = values;
    toast.loading("Please wait...");
    signupMutate({
      name: fullname,
      username,
      email,
      password,
      passwordRepeat: confirmPassword,
    });
  };

  return (
    <Formik
      initialValues={{
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={signupSchema}
      onSubmit={handleSignUp}>
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
            htmlFor="fullname"
            className="block mb-2 text-sm font-medium text-gray-900">
            Full Name
          </label>
          <Field
            type="text"
            id="fullname"
            name="fullname"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          <ErrorMessage
            name="fullname"
            component="p"
            className="mt-2 text-xs text-red-600"
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900">
            Username
          </label>
          <Field
            type="text"
            id="username"
            name="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          <ErrorMessage
            name="username"
            component="p"
            className="mt-2 text-xs text-red-600"
          />
        </div>
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
        <div className="mb-5">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium text-gray-900">
            Confirm password
          </label>
          <Field
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          <ErrorMessage
            name="confirmPassword"
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
          <span>Already have an account?&nbsp;</span>
          <Link href="/login" className="text-blue-800 font-semibold">
            Log In
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
