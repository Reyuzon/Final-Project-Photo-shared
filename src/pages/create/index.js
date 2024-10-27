import { withAuth } from "@/lib/withAuth";
import { createPost } from "@/services/postService";
import { uploadImage } from "@/services/uploadService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { BiSolidImageAdd } from "react-icons/bi";

export default function CreatePage({ user }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [file, setFile] = useState();
  const [caption, setCaption] = useState("");

  const handleUploadFile = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const handleChangeCaption = (e) => {
    setCaption(e.target.value);
  };

  const { mutate: mutatePost } = useMutation({
    mutationFn: createPost,
    onSuccess: (res) => {
      toast.dismiss();
      toast.success("Successfully posted!");
      queryClient.refetchQueries({ queryKey: [`${user.id}_posts`] });
      router.push("/profile");
    },
    onError: (err) => {
      toast.dismiss();
      toast.error("Terjadi kesalahan pada server");
      console.log(err);
    },
  });

  const { mutate: mutateFile } = useMutation({
    mutationFn: uploadImage,
    onSuccess: (res) => {
      mutatePost({
        imageUrl: res.data.url,
        caption,
      });
    },
    onError: (err) => {
      toast.dismiss();
      toast.error("Terjadi kesalahan pada server");
      console.log(err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.loading("Loading...");
    mutateFile(file);
  };

  const handleReset = () => {
    setFile(null);
    setCaption("");
  };

  return (
    <Fragment>
      <div className="flex items-center gap-4 text-blue-800">
        <BiSolidImageAdd className="text-5xl" />
        <h1 className="font-semibold text-2xl">Create Post</h1>
      </div>

      <form className="mx-auto mt-8" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="photo"
            className="block mb-2 font-medium text-gray-900 dark:text-white">
            Add Photo
          </label>
          <div className="flex items-center justify-center w-full">
            {file ? (
              <img
                className="border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                src={URL.createObjectURL(file)}
                alt="Uploaded"
              />
            ) : (
              <label
                htmlFor="photo"
                className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="photo"
                  type="file"
                  className="hidden"
                  onChange={handleUploadFile}
                />
              </label>
            )}
          </div>
        </div>
        <div className="mb-5">
          <label
            htmlFor="caption"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Add Caption
          </label>
          <input
            type="text"
            id="caption"
            onChange={handleChangeCaption}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Submit
          </button>
          <button
            type="reset"
            onClick={handleReset}
            className="text-white bg-gray-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Cancel
          </button>
        </div>
      </form>
    </Fragment>
  );
}

export const getServerSideProps = withAuth(async (context, user) => {
  return {
    props: {
      user,
    },
  };
});
