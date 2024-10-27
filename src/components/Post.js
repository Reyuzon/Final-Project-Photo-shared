import { createComment, getPostById } from "@/services/postService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import {
  IoChevronBackOutline,
  IoChatbubblesSharp,
  IoSend,
  IoCloseSharp,
} from "react-icons/io5";
import { getCookie, setCookie } from "cookies-next";
import {
  BsSend,
  BsHeartFill,
  BsHeart,
  BsChat,
  BsBookmark,
  BsBookmarkFill,
} from "react-icons/bs";
import Img from "./Img";
import toast from "react-hot-toast";

export default function Post({ id }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const likePosts = getCookie("likePosts")
    ? JSON.parse(getCookie("likePosts"))
    : [];

  const savePosts = getCookie("savePosts")
    ? JSON.parse(getCookie("savePosts"))
    : [];

  const [isLike, setIsLike] = useState(likePosts.includes(id));
  const [isSave, setIsSave] = useState(savePosts.includes(id));

  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["post_" + id],
    queryFn: () => getPostById(id),
  });

  const { mutate: mutateComment } = useMutation({
    mutationFn: createComment,
    onSuccess: (res) => {
      setCommentLoading(false)
      queryClient.refetchQueries({ queryKey: ["post_" + id] });
      setComment("")
    },
    onError: (err) => {
      setCommentLoading(false)
      toast.error("Terjadi kesalahan pada server");
      console.log(err);
    },
  });

  const handleLikePost = () => {
    setIsLike(true);
    setCookie("likePosts", JSON.stringify([...likePosts, id]));
  };

  const handleUnlikePost = () => {
    setIsLike(false);
    setCookie(
      "likePosts",
      JSON.stringify(likePosts.filter((post) => post !== id))
    );
  };

  const handleSavePost = () => {
    setIsSave(true);
    setCookie("savePosts", JSON.stringify([...savePosts, id]));
  };

  const handleUnsavePost = () => {
    setIsSave(false);
    setCookie(
      "savePosts",
      JSON.stringify(savePosts.filter((post) => post !== id))
    );
  };

  const handleClose = () => {
    router.back();
  };

  const handleSendComment = () => {
    setCommentLoading(true)
    mutateComment({
      postId: id,
      comment,
    });
  };

  return (
    <Fragment>
      <div className="overflow-y-auto overflow-x-hidden relative top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 min-h-screen max-h-full md:max-h-[calc(100vh-5rem)]">
        <div className="relative overflow-y-auto p-0 sm:p-4 w-full min-h-screen md:h-max bg-white h-max pt-10 sm:pt-14 pb-14 md:hidden">
          <div className="bg-white w-full h-max p-2 border-b-2 fixed top-0 left-0">
            <IoChevronBackOutline
              className="text-[27px]"
              onClick={handleClose}
            />
            <h1 className="absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2 font-medium text-lg">
              Post
            </h1>
          </div>
          {isLoading ? (
            <div className="flex items-center gap-3 p-4">
              <svg
                className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
            </div>
          ) : (
            <Fragment>
              <div className="flex items-center gap-3 p-4">
                <Img
                  src={
                    data.data.data.user
                      ? data.data.data.user.profilePictureUrl
                      : "/images/profile.jpg"
                  }
                  alt="user profile"
                  className="rounded-full w-9 h-9"
                  fallback={
                    <img
                      src="/images/profile.jpg"
                      className="rounded-full w-9 h-9"
                    />
                  }
                />
                <p>
                  {data.data.data.user
                    ? data.data.data.user.username
                    : "Anonymous"}
                </p>
              </div>
              <img src={data.data.data.imageUrl} alt="" className="w-full" />
              <div className="p-4 pb-5 border-b-2">
                <div className="flex items-center justify-between text-2xl ">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        isLike ? handleUnlikePost() : handleLikePost()
                      }>
                      {isLike ? (
                        <BsHeartFill className="text-red-500" />
                      ) : (
                        <BsHeart />
                      )}
                    </button>
                    <BsChat className="-scale-x-100 -mt-0.5" />
                    <BsSend className="rotate-25" />
                  </div>
                  <button
                    onClick={() =>
                      isSave ? handleUnsavePost() : handleSavePost()
                    }>
                    {isSave ? <BsBookmarkFill /> : <BsBookmark />}
                  </button>
                </div>
                <div className="mt-3">
                  <span className="font-medium">
                    {data.data.data.user
                      ? data.data.data.user.username
                      : "Anonymous"}
                  </span>
                  <span className="whitespace-pre-line">
                    &nbsp;
                    {data.data.data.caption}
                  </span>
                </div>
              </div>
              {data.data.data.comments.length > 0 ? (
                <div className="p-4 flex flex-col gap-3">
                  {data.data.data.comments
                    .slice()
                    .reverse()
                    .map((comment, i) => (
                      <div className="flex gap-2" key={i}>
                        <Img
                          src={comment.user.profilePictureUrl}
                          className="rounded-full w-10 h-10"
                          fallback={
                            <img
                              src="/images/profile.jpg"
                              className="rounded-full w-10 h-10"
                            />
                          }
                        />
                        <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                          <div class="flex items-center space-x-2 rtl:space-x-reverse">
                            <span class="text-sm font-semibold text-gray-900 dark:text-white">
                              {comment.user.username}
                            </span>
                          </div>
                          <p class="text-sm font-normal py-1 text-gray-900 dark:text-white">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center py-3">
                  <IoChatbubblesSharp className="text-6xl text-gray-500" />
                  <div>
                    <p className="font-medium text-lg">Belum ada komentar</p>
                    <p>Jadilah yang pertama mengomentari.</p>
                  </div>
                </div>
              )}
            </Fragment>
          )}
          <div className="bg-white w-full h-max px-2 py-1 border-t-2 fixed bottom-0 left-0 flex gap-2">
            <input
              type="text"
              id="first_name"
              value={comment}
              className="text-gray-900 text-sm border-none focus:border-none focus:ring-0 block w-full p-2.5 dark:placeholder-gray-400 dark:text-white"
              placeholder="Add a comment..."
              required
              onChange={(e) => setComment(e.target.value)}
            />
            {comment.length > 0 && (
              <button
                className="text-2xl text-blue-800"
                onClick={handleSendComment}>
                {commentLoading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  <IoSend />
                )}
              </button>
            )}
          </div>
        </div>
        {!isLoading && (
          <Fragment>
            <div
              className="hidden md:inline-block w-full h-full relative cursor-pointer"
              onClick={handleClose}>
              <IoCloseSharp className="text-white absolute text-4xl right-0 top-2" />
            </div>
            <div className="w-max max-w-[80%] md:h-[85%] lg:max-h-[90%] overflow-hidden fixed top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 bg-white hidden md:grid md:grid-cols-2 rounded">
              <img src={data.data.data.imageUrl} alt="" className="h-full" />
              <div className="bg-white relative pt-16 pb-20 px-4 border-l-2">
                <div className="flex items-center gap-3 p-4 border-b-2 border-l-2 w-1/2 fixed top-0 right-0 bg-white">
                  <Img
                    src={
                      data.data.data.user
                        ? data.data.data.user.profilePictureUrl
                        : "/images/profile.jpg"
                    }
                    alt="user profile"
                    className="rounded-full w-9 h-9"
                    fallback={
                      <img
                        src="/images/profile.jpg"
                        className="rounded-full w-9 h-9"
                      />
                    }
                  />
                  <p>
                    {data.data.data.user
                      ? data.data.data.user.username
                      : "Anonymous"}
                  </p>
                </div>
                <div className="mt-3 flex gap-3">
                  <Img
                    src={
                      data.data.data.user
                        ? data.data.data.user.profilePictureUrl
                        : "/images/profile.jpg"
                    }
                    alt="user profile"
                    className="rounded-full w-9 h-9"
                    fallback={
                      <img
                        src="/images/profile.jpg"
                        className="rounded-full w-9 h-9"
                      />
                    }
                  />
                  <div className="pt-1.5">
                    <span className="font-medium">
                      {data.data.data.user
                        ? data.data.data.user.username
                        : "Anonymous"}
                    </span>
                    <span className="whitespace-pre-line">
                      &nbsp;
                      {data.data.data.caption}
                    </span>
                  </div>
                </div>
                {data.data.data.comments.length > 0 ? (
                  <div className="p-4 flex flex-col gap-3">
                    {data.data.data.comments
                      .slice()
                      .reverse()
                      .map((comment, i) => (
                        <div className="flex gap-2" key={i}>
                          <Img
                            src={comment.user.profilePictureUrl}
                            className="rounded-full w-10 h-10"
                            fallback={
                              <img
                                src="/images/profile.jpg"
                                className="rounded-full w-10 h-10"
                              />
                            }
                          />
                          <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                            <div class="flex items-center space-x-2 rtl:space-x-reverse">
                              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                                {comment.user.username}
                              </span>
                            </div>
                            <p class="text-sm font-normal py-1 text-gray-900 dark:text-white">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center py-3 mt-2">
                    <IoChatbubblesSharp className="text-6xl text-gray-500" />
                    <div>
                      <p className="font-medium text-lg">Belum ada komentar</p>
                      <p>Jadilah yang pertama mengomentari.</p>
                    </div>
                  </div>
                )}
                <div className="fixed bottom-0 right-0 border-t w-1/2 bg-white border-l-2">
                  <div className="flex items-center justify-between text-2xl p-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          isLike ? handleUnlikePost() : handleLikePost()
                        }>
                        {isLike ? (
                          <BsHeartFill className="text-red-500" />
                        ) : (
                          <BsHeart />
                        )}
                      </button>
                      <BsChat className="-scale-x-100 -mt-0.5" />
                      <BsSend className="rotate-25" />
                    </div>
                    <button
                      onClick={() =>
                        isSave ? handleUnsavePost() : handleSavePost()
                      }>
                      {isSave ? <BsBookmarkFill /> : <BsBookmark />}
                    </button>
                  </div>
                  <div className="w-full px-2 py-1 flex items-center gap-2 border-t-2">
                    <input
                      type="text"
                      id="first_name"
                      value={comment}
                      className="text-gray-900 text-sm border-none focus:border-none focus:ring-0 block w-full p-2.5 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Add a comment..."
                      required
                      onChange={(e) => setComment(e.target.value)}
                    />
                    {comment.length > 0 && (
                      <button
                        className="text-2xl text-blue-800"
                        onClick={handleSendComment}>
                        {commentLoading ? (
                          <div role="status">
                            <svg
                              aria-hidden="true"
                              class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <span class="sr-only">Loading...</span>
                          </div>
                        ) : (
                          <IoSend />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
