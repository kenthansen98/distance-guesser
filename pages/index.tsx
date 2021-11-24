import { signOut, useSession } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";

import Layout from "../components/Layout";
import Login from "../components/Login";
import NewGame from "../components/NewGame";

const Home = () => {
    const { data: session, status } = useSession();
    const loading = status === "loading";

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto h-screen flex">
                    <div className="bg-white shadow-2xl m-auto p-4 w-24 h-16 rounded-md">
                        Loading...
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {session && (
                <button
                    className="bg-gradient-to-r from-blue-300 to-green-300 ring-4 ring-white w-8 h-8 rounded-2xl flex flex-col m-5 fixed justify-center shadow-xl transition hover:scale-110"
                    onClick={() => signOut()}
                >
                    <BiLogOut size="1.5em" />
                </button>
            )}
            <div className="container mx-auto h-screen flex">
                {!session && <Login />}
                {session && <NewGame />}
            </div>
        </Layout>
    );
};

export default Home;
