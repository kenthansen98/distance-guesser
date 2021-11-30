import { City, Game } from ".prisma/client";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";

interface Props {
    game: Game & {
        startCities: City[];
        endCities: City[];
    };
    geojson: {
        type: string;
        properties: {};
        geometry: {
            type: string;
            coordinates: any;
        };
    }
}

const DynamicMap = dynamic(() => import("../../components/Map"), {
    ssr: false,
});

const Game: React.FC<Props> = ({ game, geojson }) => {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [round, setRound] = useState(0);
    const midpoint = [
        (game.startCities[round].lat + game.endCities[round].lat) / 2,
        (game.startCities[round].long + game.endCities[round].long) / 2,
    ];

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
            <DynamicMap lat={midpoint[0]} long={midpoint[1]} route={geojson} />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const game = await prisma.game.findUnique({
        where: { id: typeof params.id === "string" ? params.id : params.id[0] },
        include: {
            startCities: {
                select: {
                    name: true,
                    lat: true,
                    long: true,
                    population: true,
                },
            },
            endCities: {
                select: {
                    name: true,
                    lat: true,
                    long: true,
                    population: true,
                },
            },
        },
    });

    const curTripType: String = `mapbox/${
        game.tripTypes[Math.floor(Math.random() * game.tripTypes.length)]
    }`;
    const directionsEnpoint = `https://api.mapbox.com/directions/v5/${curTripType}/${game.startCities[0].long},${game.startCities[0].lat};${game.endCities[0].long},${game.endCities[0].lat}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPS_API}`;
    const directionRes = await fetch(directionsEnpoint);
    const dirJson = await directionRes.json();
    const route = dirJson.routes[0].geometry.coordinates;
    const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

    return {
        props: {
            game,
            geojson
        },
    };
};

export default Game;
