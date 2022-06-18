import * as trpc from '@trpc/server';
import { z } from 'zod';
import { prisma } from '@/backend/utils/prisma'
import { getVoteOptions } from '@/utils/getRandomPokemon';

export const appRouter = trpc
    .router()
    .query('get-pokemon-pair', {
        async resolve() {
            const [first, second] = getVoteOptions()
            const pokemons = await prisma.pokemon.findMany({ where: { id: { in: [first, second] } } })

            if (pokemons.length !== 2) throw new Error('Lol, there is not pokemon')

            return { firstPokemon: pokemons[0], secondPokemon: pokemons[1] }
        },
    }).mutation('cast-vote', {
        input: z.object({
            votedFor: z.number(),
            votedAgainst: z.number()
        }),
        async resolve({ input }) {
            const voteInDb = await prisma.vote.create({
                data: {
                    votedAgainstId: input.votedAgainst,
                    votedForId: input.votedFor
                }
            })
            return { success: true, vote: voteInDb }
        }
    })

// export type definition of API
export type AppRouter = typeof appRouter;

