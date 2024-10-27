import { axiosInstance } from "./axios";

export const withAuth = (getServerSidePropsFunc) => {
  return async (context) => {
    const { req } = context;
    const token = req.cookies.token || null;

    // Redirect ke halaman login jika token tidak ada
    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // Verifikasi token (pseudocode)
    try {
      const user = await axiosInstance("/api/v1/user", {
        headers: {
          Authorization: "Bearer " + token,
        },
      }); // Fungsi untuk memverifikasi token

      // Jika verifikasi berhasil, teruskan ke halaman tujuan
      if (getServerSidePropsFunc) {
        const props = await getServerSidePropsFunc(context, user);
        return {
          props: {
            ...props.props,
            user: user.data.data, // tambahkan user ke props
          },
        };
      }

      // Jika tidak ada `getServerSidePropsFunc`, hanya kembalikan user
      return {
        props: { user: user.data.data },
      };
    } catch (error) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  };
};
