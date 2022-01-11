import { City, Game } from ".prisma/client";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import Router from "next/router";

interface Props {
    game: Game & {
        startCities: City[];
        endCities: City[];
    };
    tripTypes: string[];
    geojsons: {
        type: string;
        properties: {};
        geometry: {
            type: string;
            coordinates: any;
        };
    }[];
    durations: number[];
}

const DynamicMap = dynamic(() => import("../../components/Map"), {
    ssr: false,
});

const Game: React.FC<Props> = ({ game, tripTypes, geojsons, durations }) => {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [round, setRound] = useState(0);
    const [midpoint, setMidpoint] = useState([
        (game.startCities[round].lat + game.endCities[round].lat) / 2,
        (game.startCities[round].long + game.endCities[round].long) / 2,
    ]);
    const [enteringGuess, setEnteringGuess] = useState(false);
    const [hours, setHours] = useState<number | undefined>();
    const [minutes, setMinutes] = useState<number | undefined>();
    const [guessed, setGuessed] = useState(false);
    const [score, setScore] = useState(0);
    const [overallScore, setOverallScore] = useState(0);

    const onEnterGuess = (event: React.SyntheticEvent) => {
        event.preventDefault();
        const guess = hours + minutes / 60;
        const roundScore = Math.ceil(
            100 - Math.abs(guess / durations[round] - 1) * 100
        );
        setScore(roundScore);
        setOverallScore(Math.ceil((overallScore + roundScore) / (round + 1)));
        setGuessed(true);
        setEnteringGuess(false);
    };

    const onNextRound = () => {
        setRound(round + 1);
        setGuessed(false);
        setEnteringGuess(false);
    };

    const onEndGame = async () => {
        const body = { score: overallScore }
        await fetch(`api/game/${game.id}`, {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        await Router.push("/");
    };

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
        <div className="absolute flex flex-col">
            <div className="bg-gray-600 h-screen w-screen z-0 absolute">
                <DynamicMap
                    lat={midpoint[0]}
                    long={midpoint[1]}
                    route={geojsons[round]}
                />
            </div>
            <div className="w-screen flex flex-row justify-between h-1/4">
                <div className="m-10 p-5 bg-white rounded shadow-lg flex flex-col h-full z-10">
                    <h1 className="font-bold text-xl">Round {round + 1}:</h1>
                    <h3 className="font-semibold text-lg text-gray-500">
                        {tripTypes[round]}
                    </h3>
                    <p>
                        {game.startCities[round].name} {"-->"}{" "}
                        {game.endCities[round].name}
                    </p>
                </div>
                <div className="flex">
                    {!guessed && !enteringGuess && (
                        <button
                            className="bg-gradient-to-r from-blue-800 to-green-800 text-lg my-auto mx-10 font-bold p-2 text-white rounded-md shadow-sm transition hover:scale-110 z-10"
                            onClick={() => setEnteringGuess(true)}
                        >
                            Enter Guess
                        </button>
                    )}
                    {enteringGuess && (
                        <div className="m-10 p-5 flex flex-col bg-white shadow-lg rounded z-10">
                            <form className="flex flex-col">
                                <div className="flex flex-row justify-between">
                                    <h2 className="text-lg font-medium self-center">
                                        Enter hours:{" "}
                                    </h2>
                                    <input
                                        className="form-input ring-1 ring-gray-600 focus:ring-2 focus:ring-blue-800 rounded-sm m-3"
                                        type="number"
                                        onChange={(event) =>
                                            setHours(Number(event.target.value))
                                        }
                                    />
                                </div>
                                <div className="flex flex-row justify-between">
                                    <h2 className="text-lg font-medium self-center">
                                        Enter minutes:{" "}
                                    </h2>
                                    <input
                                        className="form-input ring-1 ring-gray-600 focus:ring-2 focus:ring-blue-800 rounded-sm m-3"
                                        type="number"
                                        onChange={(event) =>
                                            setMinutes(
                                                Number(event.target.value)
                                            )
                                        }
                                    />
                                </div>
                                <button
                                    className="bg-gradient-to-r from-blue-800 to-green-800 text-md my-2 mx-auto font-semibold p-2 text-white rounded-md shadow-sm transition hover:scale-105"
                                    onClick={onEnterGuess}
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            {guessed && (
                <div className="w-1/4 top-1/2 left-1/2 bg-white m-auto flex flex-col items-center rounded shadow-lg p-3 z-10">
                    <h2 className="text-lg font-bold m-3">Round Results</h2>
                    <p className="text-md font-semibold mx-2 text-gray-600">
                        You Guessed:{" "}
                    </p>
                    {hours}h {minutes}mins
                    <p className="text-md font-semibold mx-2 text-gray-600">
                        Actual Duration:{" "}
                    </p>
                    {Math.floor(durations[round])}h{" "}
                    {Math.floor(
                        (durations[round] - Math.floor(durations[round])) * 60
                    )}
                    mins
                    <div className="flex flex-row my-3">
                        <p className="text-md font-semibold mx-2 text-gray-600">
                            Score:{" "}
                        </p>
                        {score}
                    </div>
                    <div className="flex flex-row mb-3">
                        <p className="text-md font-semibold mx-2 text-gray-600">
                            Overall Score:{" "}
                        </p>
                        {overallScore}
                    </div>
                    {round < game.numRounds - 1 && (
                        <button
                            className="bg-gradient-to-r from-blue-800 to-green-800 text-md my-2 mx-auto font-semibold p-2 text-white rounded-md shadow-sm transition hover:scale-105"
                            onClick={onNextRound}
                        >
                            Next Round
                        </button>
                    )}
                    {round === game.numRounds - 1 && (
                        <button
                            className="bg-gradient-to-r from-blue-800 to-green-800 text-md my-2 mx-auto font-semibold p-2 text-white rounded-md shadow-sm transition hover:scale-105"
                            onClick={onEndGame}
                        >
                            End Game
                        </button>
                    )}
                </div>
            )}
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

    const tripTypes: string[] = [];
    const geojsons = [];
    let durations: number[] = [];

    for (let i = 0; i < game.startCities.length; i++) {
        const curTripType =
            game.tripTypes[Math.floor(Math.random() * game.tripTypes.length)];
        const curTripTypeString: string = `mapbox/${curTripType}`;
        tripTypes.push(curTripType);
        const directionsEnpoint = `https://api.mapbox.com/directions/v5/${curTripTypeString}/${game.startCities[i].long},${game.startCities[i].lat};${game.endCities[i].long},${game.endCities[i].lat}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPS_API}`;
        const directionRes = await fetch(directionsEnpoint);
        const dirJson = await directionRes.json();
        const duration = dirJson.routes[0].duration / 3600;
        durations.push(duration);
        const route = dirJson.routes[0].geometry.coordinates;
        const geojson = {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: route,
            },
        };
        geojsons.push(geojson);
    }

    return {
        props: {
            game,
            tripTypes,
            geojsons,
            durations,
        },
    };
};

export default Game;
