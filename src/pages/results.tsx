import type { FC, ReactNode } from 'react';
import type { GetStaticProps } from 'next';
import { prisma } from '@/backend/utils/prisma';
import type { AsyncReturnType } from '@/utils/inferType';
import Image from 'next/image';

// we seprate query to database because we can infer the type of it
// and make a typesafe page
const getPokemonsByOrder = async () => {
	return await prisma.pokemon.findMany({
		orderBy: {
			VotesFor: { _count: 'desc' },
		},
		select: {
			id: true,
			name: true,
			spriteUrl: true,
			_count: {
				select: {
					VotesFor: true,
					VotesAgainst: true,
				},
			},
		},
	});
};

// inferring the return type
type returnedPokemon = AsyncReturnType<typeof getPokemonsByOrder>;

// calculating percent of positive votes
const calcPercent = (pokemon: returnedPokemon[number]) => {
	const { VotesFor, VotesAgainst } = pokemon._count;
	if (VotesFor + VotesAgainst === 0) return 0;

	return (VotesFor / (VotesAgainst + VotesFor)) * 100;
};

// Show pokemon component
const PokemonListings: FC<{ pokemon: returnedPokemon[number] }> = (props) => {
	return (
		<div className="flex p-2 items-center justify-between border-b">
			<div className="flex items-center">
				<Image width={64} height={64} layout="fixed" src={props.pokemon.spriteUrl} alt={props.pokemon.name} />
				<p className="capitalize ml-2">{props.pokemon.name}</p>
			</div>
			<div className="p-2">{calcPercent(props.pokemon)}%</div>
		</div>
	);
};

// results page
const results: FC<{ pokemons: returnedPokemon; children?: ReactNode }> = ({ pokemons }) => {
	return (
		<div className="flex flex-col items-center">
			<h1 className="p-4 text-2xl pb-8">Results</h1>
			<div className="border w-full max-w-2xl">
				{pokemons?.map((pokemon, idx) => {
					return <PokemonListings key={idx} pokemon={pokemon} />;
				})}
			</div>
		</div>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	const orderedPokemon = await getPokemonsByOrder();
	return {
		props: { pokemons: orderedPokemon },
		revalidate: 60,
	};
};

export default results;
