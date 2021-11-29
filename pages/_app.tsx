import "tailwindcss/tailwind.css";
import { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

const MyApp = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) => {
    return (
        <SessionProvider session={session}>
            <Head>
                <link
                    href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css"
                    rel="stylesheet"
                />
            </Head>
            <Component {...pageProps} />
        </SessionProvider>
    );
};

export default MyApp;
