import Link from "next/link";
import { useRouter } from "next/router";
import { GoHomeFill } from "react-icons/go";
import { MdAddBox, MdExplore } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { useSelector } from "react-redux";

export default function BottomNav() {
  const router = useRouter();
  const user = useSelector((state) => state.user); // get user from store

  // Fungsi untuk memeriksa apakah path aktif
  const isActive = (path) => router.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 transition-transform translate-y-0 sm:translate-y-full">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium pt-0.5">
        <Link
          href="/"
          className="inline-flex flex-col items-center justify-center px-5 group">
          <GoHomeFill
            className={`w-7 h-7 mb-1 ${
              isActive("/")
                ? " text-blue-800"
                : "text-gray-500 group-hover:text-blue-800"
            }`}
          />
          <span
            className={`text-sm ${
              isActive("/")
                ? "text-blue-800"
                : "text-gray-500 group-hover:text-blue-800"
            }`}>
            Home
          </span>
        </Link>
        <Link
          href="/explore"
          className="inline-flex flex-col items-center justify-center px-5 group">
          <MdExplore
            className={`w-7 h-7 mb-1 ${
              isActive("/explore")
                ? " text-blue-800"
                : "text-gray-500 group-hover:text-blue-800"
            }`}
          />
          <span
            className={`text-sm ${
              isActive("/explore")
                ? "text-blue-800"
                : "text-gray-500 group-hover:text-blue-800"
            }`}>
            Explore
          </span>
        </Link>
        <Link
          href="/create"
          className="inline-flex flex-col items-center justify-center px-5 group">
          <MdAddBox
            className={`w-7 h-7 mb-1 ${
              isActive("/create")
                ? " text-blue-800"
                : "text-gray-500 group-hover:text-blue-800"
            }`}
          />
          <span
            className={`text-sm ${
              isActive("/create")
                ? "text-blue-800"
                : "text-gray-500 group-hover:text-blue-800"
            }`}>
            Create
          </span>
        </Link>
        <Link
          href="/stories"
          className="inline-flex flex-col items-center justify-center px-5 group">
          <RiRefreshFill
            className={`w-7 h-7 mb-1 ${
              isActive("/stories")
                ? " text-blue-800"
                : "text-gray-500 group-hover:text-blue-800"
            }`}
          />
          <span
            className={`text-sm ${
              isActive("/stories")
                ? "text-blue-800"
                : "text-gray-500 group-hover:text-blue-800"
            }`}>
            Stories
          </span>
        </Link>
        <Link
          href="/profile"
          className="inline-flex flex-col items-center justify-center px-5 group">
          <img
            className={`rounded-full w-7 h-7 mb-1 ${
              isActive("/profile")
                ? "border-2 border-blue-800"
                : "group-hover:border-blue-800"
            }`}
            src={
              user.user ? user.user.profilePictureUrl : "/images/profile.jpg"
            }
            alt="Profile Picture"
          />
          <span
            className={`text-sm ${
              isActive("/profile")
                ? "text-blue-800"
                : "text-gray-500 group-hover:text-blue-800"
            }`}>
            Profile
          </span>
        </Link>
      </div>
    </div>
  );
}
