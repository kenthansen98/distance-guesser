import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const gameId = req.query.id as string;
    const { score } = req.body;
    console.log(score)
    const game = await prisma.game.update({
        where: { id: gameId},
        data: { finalScore: score }
    });

    res.json(game);
};

export default handler;