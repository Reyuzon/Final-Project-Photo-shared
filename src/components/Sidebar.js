import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { GoHomeFill } from "react-icons/go";
import { MdAddBox, MdExplore } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import { logoutUser } from "@/services/authService";
import { deleteCookie } from "cookies-next";

export default function Sidebar() {
  const router = useRouter();
  const user = useSelector((state) => state.user); // get user from store

  const [showMore, setShowMore] = useState(false);

  // Fungsi untuk memeriksa apakah path aktif
  const isActive = (path) => router.pathname === path;

  const handleLogout = async () => {
    try {
      const reponse = await logoutUser();
      deleteCookie("token");
      router.replace("/login");
    } catch (err) {
      toast.error("Something went wrong, please try again");
    }
  };

  return (
    <>
      <aside
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar">
        <div className="h-full p-4 overflow-y-auto border-r-2">
          <Image
            alt="Logo Icon"
            src="/images/logo.svg"
            width={280}
            height={280}
            className="mx-auto w-1/2"
          />
          <ul className="space-y-2 font-medium h-[80vh] relative">
            <li>
              <Link
                href="/"
                className={`flex items-center p-3 ${
                  isActive("/")
                    ? "text-blue-800 bg-blue-200"
                    : "hover:bg-blue-100"
                } rounded-xl group`}>
                <GoHomeFill
                  className={`flex-shrink-0 w-7 h-7 ${
                    isActive("/") ? "text-blue-800" : "text-gray-500"
                  } transition duration-75 `}
                />
                <span
                  className={`flex-1 ms-3 whitespace-nowrap ${
                    isActive("/") ? "text-blue-800" : "text-gray-600"
                  }`}>
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/explore"
                className={`flex items-center p-3 ${
                  isActive("/explore")
                    ? "text-blue-800 bg-blue-200"
                    : "hover:bg-blue-100"
                } rounded-xl group`}>
                <MdExplore
                  className={`flex-shrink-0 w-7 h-7 ${
                    isActive("/explore") ? "text-blue-800" : "text-gray-500"
                  } transition duration-75 `}
                />
                <span
                  className={`flex-1 ms-3 whitespace-nowrap ${
                    isActive("/explore") ? "text-blue-800" : "text-gray-600"
                  }`}>
                  Explore
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/create"
                className={`flex items-center p-3 ${
                  isActive("/create")
                    ? "text-blue-800 bg-blue-200"
                    : "hover:bg-blue-100"
                } rounded-xl group`}>
                <MdAddBox
                  className={`flex-shrink-0 w-7 h-7 ${
                    isActive("/create") ? "text-blue-800" : "text-gray-500"
                  } transition duration-75 `}
                />
                <span
                  className={`flex-1 ms-3 whitespace-nowrap ${
                    isActive("/create") ? "text-blue-800" : "text-gray-600"
                  }`}>
                  Create
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/stories"
                className={`flex items-center p-3 ${
                  isActive("/stories")
                    ? "text-blue-800 bg-blue-200"
                    : "hover:bg-blue-100"
                } rounded-xl group`}>
                <RiRefreshFill
                  className={`flex-shrink-0 w-7 h-7 ${
                    isActive("/stories") ? "text-blue-800" : "text-gray-500"
                  } transition duration-75 `}
                />
                <span
                  className={`flex-1 ms-3 whitespace-nowrap ${
                    isActive("/stories") ? "text-blue-800" : "text-gray-600"
                  }`}>
                  Stories
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={`flex items-center p-3 ${
                  isActive("/profile")
                    ? "text-blue-800 bg-blue-200"
                    : "hover:bg-blue-100"
                } rounded-xl group`}>
                <img
                  className={`rounded-full w-7 h-7 ${
                    isActive("/profile")
                      ? "border-2 border-blue-800"
                      : "border-[0.5px] border-slate-400"
                  }`}
                  src={
                    user.user
                      ? user.user.profilePictureUrl
                      : "/images/profile.jpg"
                  }
                  alt="Profile Picture"
                />
                <span
                  className={`flex-1 ms-3 whitespace-nowrap ${
                    isActive("/profile") ? "text-blue-800" : "text-gray-600"
                  }`}>
                  Profile
                </span>
              </Link>
            </li>
            <li className="absolute bottom-0 w-full">
              <div className="relative">
                {showMore && (
                  <div className="z-10 absolute bottom-[115%] w-full bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="multiLevelDropdownButton">
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                          Earnings
                        </a>
                      </li>
                      <li>
                        <div
                          onClick={handleLogout}
                          className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                          Log Out
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
                <div
                  className="flex items-center p-3 cursor-pointer hover:bg-blue-100 rounded-xl group"
                  onClick={() => setShowMore(!showMore)}>
                  <GiHamburgerMenu className="flex-shrink-0 w-7 h-7 text-gray-500 transition duration-75" />
                  <span className="flex-1 ms-3 whitespace-nowrap text-gray-600">
                    More
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
