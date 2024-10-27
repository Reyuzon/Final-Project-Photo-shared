import { withAuth } from "@/lib/withAuth";
import { getExplorePost } from "@/services/postService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FaHeart } from "react-icons/fa";
import { Fragment, useEffect } from "react";
import Link from "next/link";
import Img from "@/components/Img";
import { splitArray } from "@/utils/splitArray";

export default function ExplorePage() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["explorePost"],
      queryFn: ({ pageParam }) => getExplorePost(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        // Ambil data dari respons API
        const { currentPage, totalPages } = lastPage.data.data;

        // Jika masih ada halaman berikutnya, return halaman selanjutnya
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
    });

  useEffect(() => {
    const onScroll = async () => {
      const scroll = document.scrollingElement;
      if (scroll) {
        if (
          (scroll.scrollTop + scroll.clientHeight) * 1.2 >=
            scroll.scrollHeight &&
          !isLoading &&
          !isFetchingNextPage &&
          hasNextPage
        ) {
          await fetchNextPage();
        }
      }
    };

    document.addEventListener("scroll", onScroll);

    return () => document.removeEventListener("scroll", onScroll);
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <Fragment>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {splitArray(Array.from({ length: 28 })).map((posts, i) => (
            <div className="grid gap-4" key={i}>
              {posts.map((_, i) => (
                <svg
                  key={i}
                  className="w-full animate-pulse mb-4 h-auto text-gray-200 dark:text-gray-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18">
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              ))}
            </div>
          ))}
        </div>
      ) : (
        data.pages.map((page) => (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {splitArray(page.data.data.posts).map((posts, i) => (
              <div className="grid gap-4" key={i}>
                {posts.map((post, i) => (
                  <Link
                    className="relative group"
                    href={`?p=${post.id}`}
                    key={i}>
                    <Img
                      className="h-auto mx-auto max-w-full rounded-lg"
                      src={post.imageUrl}
                      fallback={
                        <div className="flex items-center justify-center max-w-full h-48 rounded-lg bg-gray-300 dark:bg-gray-700">
                          <svg
                            className="w-10 h-10 text-gray-200 dark:text-gray-600"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 20">
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                          </svg>
                        </div>
                      }
                    />
                    <div className="absolute rounded-lg bg-black/50 h-full w-full top-0 right-0 items-center justify-center gap-3 text-white hidden group-hover:flex">
                      <FaHeart className="text-xl" />
                      <p className="font-medium">{post.totalLikes}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        ))
      )}
      {isFetchingNextPage && (
        <div className="mx-auto">
          <div role="status" className="pb-3 pt-4 text-center">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mx-auto"
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
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
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
