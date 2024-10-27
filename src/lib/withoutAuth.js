import { axiosInstance } from "./axios";

export const withoutAuth = (getServerSidePropsFunc) => {
  return async (context) => {
    const { req } = context;
    const token = req.cookies.token || null;

    // Jika token ada (user sudah login), redirect ke halaman dashboard/homepage
    if (token) {
      try {
        // Verifikasi token
        const user = await axiosInstance("/api/v1/user", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        // Redirect ke halaman yang sesuai (dashboard, home, dll.)
        return {
          redirect: {
            destination: "/", // ganti ke halaman yang sesuai
            permanent: false,
          },
        };
      } catch (error) {
        // Jika verifikasi token gagal (misalnya token tidak valid), lanjutkan ke halaman tanpa login
      }
    }

    // Jika tidak ada token atau token tidak valid, jalankan getServerSidePropsFunc
    if (getServerSidePropsFunc) {
      const props = await getServerSidePropsFunc(context);
      return {
        props: {
          ...props.props,
        },
      };
    }

    // Jika tidak ada getServerSidePropsFunc, kembalikan props kosong
    return { props: {} };
  };
};
