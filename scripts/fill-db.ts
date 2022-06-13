import { prisma } from '@/backend/utils/prisma'
import { PokemonClient } from 'pokenode-ts';

const fillDB = async () => {

    const pokemonApi = new PokemonClient()
    const allPokemons = await pokemonApi.listPokemons(0, 493)
    const formattedPokemon = allPokemons.results.map((p, idx) => ({
        id: idx + 1,
        name: p.name,
        spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idx + 1}.png`
    }))

    const createPokemons = await prisma.pokemon.createMany({
        data: formattedPokemon
    })



    console.log('Creation?', createPokemons)
}

fillDB()