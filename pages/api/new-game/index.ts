import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { tripTypes, numRounds } = req.body;

    const cities = await prisma.city.findMany();
    const startCity = cities[Math.floor(Math.random() * cities.length)];
    const endCity = cities[Math.floor(Math.random() * cities.length)];

    const result = await prisma.game.create({
        data: {
            tripTypes: tripTypes,
            numRounds: numRounds,
            startCity: { connect: { id: startCity.id } },
            endCity: { connect: { id: endCity.id } },
        },
    });

    res.json(result);
};

export default handler;
