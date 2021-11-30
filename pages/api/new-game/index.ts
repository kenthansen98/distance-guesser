import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { tripTypes, numRounds } = req.body;

    const cities = await prisma.city.findMany();
    const startCities = [];
    const endCities = [];
    Array(numRounds).fill(0).forEach((round) => {
        startCities.push(cities[Math.floor(Math.random() * cities.length)]);
        endCities.push(cities[Math.floor(Math.random() * cities.length)]);
    });

    const result = await prisma.game.create({
        data: {
            tripTypes: tripTypes,
            numRounds: numRounds,
            startCities: { connect: startCities.map((city) => ({ id: city.id })) },
            endCities: { connect: endCities.map((city) => ({ id: city.id })) },
        },
    });

    res.json(result);
};

export default handler;
