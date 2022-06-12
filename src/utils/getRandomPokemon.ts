const MAX_DEX_ID = 493;

const getRandomPokemon = (notThisOne?: number): number => {
    // select range of number
    // to never select zero we add 1 
    const pokedexNumber = Math.floor((Math.random() * MAX_DEX_ID) + 1)

    if (pokedexNumber !== notThisOne) return pokedexNumber;
    return getRandomPokemon(notThisOne)
}

export const getVoteOptions = (): number[] => {
    const first = getRandomPokemon()
    const second = getRandomPokemon(first)
    return [first, second]
}