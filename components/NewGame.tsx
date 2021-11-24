import Link from "next/link";
import { useState } from "react";
import NumRoundsSelect from "./NumRoundsSelect";
import TravelTypeSelect from "./TravelTypeSelect";

type TripType = "driving" | "transit" | "walking" | "cycling";

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

    return (
        <div className=" bg-white shadow-2xl w-1/2 h-72 m-auto rounded-lg p-8 flex flex-col">
            <h1 className="font-bold text-lg mx-auto">Start a new game</h1>
            <TravelTypeSelect onChange={onChange} />
            <NumRoundsSelect
                onChange={(event) => setNumRounds(Number(event.target.value))}
            />
            <Link href="">
                <a className=" bg-gradient-to-r from-blue-800 to-green-800 text-lg font-bold m-auto mt-5 p-2 text-white rounded-md shadow-sm transition hover:scale-105">
                    Start Game
                </a>
            </Link>
        </div>
    );
};

export default NewGame;
