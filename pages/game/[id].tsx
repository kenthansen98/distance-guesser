import { City, Game } from ".prisma/client";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";

interface Props {
    game: Game & {
        startCity: City;
        endCity: City;
    };
}

const DynamicMap = dynamic(() => import("../../components/Map"), {
    ssr: false,
});

const Game: React.FC<Props> = ({ game }) => {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const midpoint = [
        (game.startCity.lat + game.endCity.lat) / 2,
        (game.startCity.long + game.endCity.long) / 2,
    ];
    console.log(game);

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

    if (!session) {
        return (
            <Layout>
                <div className="container mx-auto h-screen flex">
                    <div className="bg-white shadow-2xl m-auto p-4 w-64 h-36 rounded-md flex flex-col">
                        <div className="font-semibold text-red-600">
                            You need to be authenticated to create a new game.
                        </div>
                        <Link href="/">
                            <a className=" bg-gradient-to-r from-blue-800 to-green-800 text-lg font-bold m-auto p-2 text-white rounded-md shadow-sm transition hover:scale-105">
                                Go to home
                            </a>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <div>
            <DynamicMap lat={midpoint[0]} long={midpoint[1]} />
            <div>text</div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const game = await prisma.game.findUnique({
        where: { id: typeof params.id === "string" ? params.id : params.id[0] },
        include: {
            startCity: {
                select: {
                    name: true,
                    lat: true,
                    long: true,
                    population: true,
                },
            },
            endCity: {
                select: {
                    name: true,
                    lat: true,
                    long: true,
                    population: true,
                },
            },
        },
    });

    return {
        props: {
            game,
        },
    };
};

export default Game;
