import { getVoteOptions } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { inferQueryResponse } from './api/trpc/[trpc]';

const Home: NextPage = () => {
	const [ids, updateIds] = useState(() => getVoteOptions());

	const [firstId, secondId] = ids;

	const pokemon1 = trpc.useQuery(['get-pokemon-by-id', { id: firstId }]);
	const pokemon2 = trpc.useQuery(['get-pokemon-by-id', { id: secondId }]);

	const voteMutation = trpc.useMutation(['cast-vote']);

	const voteForRoundest = (selected: number) => {
		if (selected === firstId) {
			voteMutation.mutate({ votedFor: firstId, votedAgainst: secondId });
		} else {
			voteMutation.mutate({ votedFor: secondId, votedAgainst: firstId });
		}
		updateIds(getVoteOptions());
	};

	const isPokemonLoaded = !pokemon1.isLoading && !pokemon2.isLoading && pokemon1.data && pokemon2.data;

	return (
		<>
			<div className="flex flex-col gap-16 justify-between items-center select-none">
				<div className="text-3xl font-bold text-center mb">Which Pokémon is the Roundest?</div>
				<div className="border rounded w-full md:w-2/3 lg:w-3/6 p-8 flex-row  flex justify-between items-center">
					{isPokemonLoaded ? (
						<>
							<PokemonListings pokemon={pokemon1.data} vote={() => voteForRoundest(firstId)}></PokemonListings>
							<div className="p-8 font-extrabold text-2xl">Vs</div>
							<PokemonListings pokemon={pokemon2.data} vote={() => voteForRoundest(secondId)} />
						</>
					) : (
						<div className="flex items-center justify-between w-full">
							<Image className="w-64 h-72 max-w-2xl" width={250} height={285} src={'/rings.svg'} alt="spinner" />
							<div>Vs</div>
							<Image className="w-64 h-72 max-w-2xl" width={250} height={285} src={'/rings.svg'} alt="spinner" />
						</div>
					)}
				</div>
				<div className="flex items-center pb-4">
					<div className="pr-4 flex items-center gap-2">
						<Image className="invert" src={'/github.svg'} width={20} height={20} alt="github icon" />
						<Link href={'https://github.com/alireza-constantin/roundest-poki'}>Github</Link>
					</div>
					{' | '}
					<div className="pl-4 flex items-center gap-2">
						<Image
							className="invert"
							src={'/pokemon-icon.svg'}
							width={20}
							height={20}
							alt="pokemon icon for showing results"
						/>
						<Link href={'/results'}>Results</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;

type PokemonFromServer = inferQueryResponse<'get-pokemon-by-id'>;

const PokemonListings = (props: {
	pokemon: PokemonFromServer;
	children?: ReactNode;
	vote: () => void;
}): JSX.Element => {
	return (
		<div className="w-64 h-auto max-w-2xl flex flex-col items-center">
			<Image width={250} height={250} src={props.pokemon.spriteUrl!} alt={props.pokemon.name} />
			<div className="font-semibold tracking-wider text-base sm:text-xl text-center  capitalize pb-2 md:mt-[-1rem]">
				{props.pokemon.name}
			</div>
			<button
				onClick={() => props.vote()}
				className="bg-white font-bold text-gray-700 px-3 py-1 sm:py-2 text-sm sm:text-lg rounded-md hover:ring-4 mt-2"
			>
				Rounder
			</button>
		</div>
	);
};
