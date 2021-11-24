import Head from "next/head";
import Image from "next/image";

const Layout: React.FC = ({ children }) => {
    return (
        <div>
            <Head>
                <title>Distance Guesser</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="fixed h-screen w-screen overflow-hidden -z-1">
                <Image 
                    alt="Map Background"
                    src="/map.jpg"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
            </div>
            {children}
        </div>
    );
};

export default Layout;
