import { getVoteOptions } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import Image from 'next/image';
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

	return (
		<div className="h-screen w-screen flex flex-col justify-center items-center select-none">
			<div className="text-2xl text-center mb">Which Pokémon is the Roundest?</div>
			<div className="p-4" />
			<div className="border rounded p-8 flex-col md:flex-row  flex justify-between items-center">
				{!pokemon1.isLoading && !pokemon2.isLoading && pokemon1.data && pokemon2.data && (
					<>
						<PokemonListings pokemon={pokemon1.data} vote={() => voteForRoundest(firstId)}></PokemonListings>
						<div className="p-8 ">Vs</div>
						<PokemonListings pokemon={pokemon2.data} vote={() => voteForRoundest(secondId)} />
					</>
				)}
			</div>
		</div>
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
		<div className="w-64 h-64 max-w-2xl flex flex-col items-center">
			<Image width={250} height={250} src={props.pokemon.spriteUrl!} alt={props.pokemon.name} />
			<div className="text-xl text-center  capitalize pb-2 mt-[-1.2rem]">{props.pokemon.name}</div>
			<button onClick={() => props.vote()} className="bg-white text-gray-700 px-1 py-2 rounded-md hover:ring-4 mt-1">
				Rounder
			</button>
		</div>
	);
};
