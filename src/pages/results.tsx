import type { FC, ReactNode } from 'react';
import { useRef } from 'react';
import type { GetStaticProps } from 'next';
import { prisma } from '@/backend/utils/prisma';
import type { AsyncReturnType } from '@/utils/inferType';
import Image from 'next/image';

// we seprate query to database because we can infer the type of it
// and make a typesafe page
const getPokemonsByOrder = async () => {
	return await prisma.pokemon.findMany({
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

function isInViewport(element: HTMLDivElement) {
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

// Show pokemon component
const PokemonListings: FC<{ pokemon: returnedPokemon[number] }> = (props) => {
	const barRef = useRef<HTMLDivElement>(null);

	const animate = () => {
		if (barRef.current) {
			if (isInViewport(barRef.current)) {
				barRef.current.style.width = calcPercent(props.pokemon) + '%';
			}
		}
	};

	if (typeof document !== 'undefined') {
		document.addEventListener('scroll', animate);
	}

	return (
		<>
			<div className="relative flex  p-2 items-center justify-between border-b bg-violet-500/70">
				<div className="flex items-center z-10">
					<Image width={64} height={64} layout="fixed" src={props.pokemon.spriteUrl} alt={props.pokemon.name} />
					<p className="capitalize ml-2">{props.pokemon.name}</p>
				</div>
				<div className="p-2 z-10">{calcPercent(props.pokemon).toFixed(2)}%</div>
				<div
					ref={barRef}
					className="absolute z-0 w-0 transition-all duration-[2500ms] left-0 top-0 h-full bg-violet-700/60"
				/>
			</div>
		</>
	);
};

// results page
const Results: FC<{ pokemons: returnedPokemon; children?: ReactNode }> = ({ pokemons }) => {
	console.log('hello');

	return (
		<div className="flex flex-col items-center">
			<h1 className="p-4 text-4xl pb-8">Results</h1>
			<div id="resultBox" className="border w-full max-w-2xl">
				{pokemons
					?.sort((a, b) => calcPercent(b) - calcPercent(a))
					.map((pokemon, idx) => {
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

export default Results;
