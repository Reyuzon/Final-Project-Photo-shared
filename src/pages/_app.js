
import MainLayout from "@/layouts/MainLayout";
import store from "@/store";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Rubik } from "next/font/google";

import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
});
const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <div className={`font-rubik ${rubik.variable}`}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Provider store={store}>
          <Toaster position="top-center" reverseOrder={false} />
          <MainLayout>
      <Component {...pageProps} />
    </MainLayout>

        </Provider>
      </QueryClientProvider>
    </div>
  );
}
