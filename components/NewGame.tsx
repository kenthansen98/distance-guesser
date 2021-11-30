import { Game } from ".prisma/client";
import Router from "next/router";
import React, { useState } from "react";
import NumRoundsSelect from "./NumRoundsSelect";
import TravelTypeSelect from "./TravelTypeSelect";

type TripType = "driving" | "walking" | "cycling";

const NewGame = () => {
    const [tripTypes, setTripTypes] = useState<TripType[]>([]);
    const [numRounds, setNumRounds] = useState<number>(1);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.checked
            ? setTripTypes(tripTypes.concat(event.target.value as TripType))
            : setTripTypes(
                  tripTypes.filter((type) => type !== event.target.value)
              );
    };

    const onSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = { tripTypes, numRounds };
            const response = await fetch("api/new-game", {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const newGame: Game = await response.json();
            await Router.push(`/game/${newGame.id}`);
        } catch(error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white shadow-2xl w-1/2 h-72 m-auto rounded-lg p-8">
            <h1 className="font-bold text-lg mx-auto">Start a new game</h1>
            <form className="flex flex-col">
                <TravelTypeSelect onChange={onChange} />
                <NumRoundsSelect
                    onChange={(event) =>
                        setNumRounds(Number(event.target.value))
                    }
                />
                <button
                    disabled={tripTypes.length === 0}
                    type="submit"
                    value="start"
                    className="bg-gradient-to-r from-blue-800 to-green-800 text-lg font-bold m-auto mt-5 p-2 text-white rounded-md shadow-sm transition hover:scale-105 disabled:opacity-50"
                    onClick={onSubmit}
                >
                    Start Game
                </button>
            </form>
        </div>
    );
};

export default NewGame;
