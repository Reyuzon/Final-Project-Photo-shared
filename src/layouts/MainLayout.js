import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { initializeTheme } from "@/slice/themeSlice";
import BottomNav from "@/components/BottomNav";
import Post from "@/components/Post";
import Sidebar from "@/components/Sidebar";

const MainLayout = ({ children }) => {
  const router = useRouter();
  const { p } = router.query;

  const noNavbarRoutes = ["/login", "/signup"];
  const { isDarkMode } = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);
  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      {!noNavbarRoutes.includes(router.pathname) ? (
        <Fragment>
          <Sidebar />
          <main>
            <div className="p-4 sm:ml-64">
              <div className="p-4">
                {children}
                {p && (
                  <div className="w-full h-full z-[9999] fixed overflow-hidden bg-black/50 top-0 left-0 p-0 md:p-4">
                    <Post id={p} />
                  </div>
                )}
              </div>
            </div>
          </main>
          <BottomNav />
        </Fragment>
      ) : (
        { children }
      )}
    </div>
  );
};

export default MainLayout;
