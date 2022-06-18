import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { inferQueryResponse } from './api/trpc/[trpc]';

const Home: NextPage = () => {
	const {
		data: pokemonPair,
		refetch,
		isLoading,
	} = trpc.useQuery(['get-pokemon-pair'], {
		refetchInterval: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	const voteMutation = trpc.useMutation(['cast-vote']);

	const voteForRoundest = (selected: number) => {
		if (!pokemonPair) return;

		if (selected === pokemonPair?.firstPokemon.id) {
			voteMutation.mutate({ votedFor: pokemonPair.firstPokemon.id, votedAgainst: pokemonPair.secondPokemon.id });
		} else {
			voteMutation.mutate({ votedFor: pokemonPair.secondPokemon.id, votedAgainst: pokemonPair.firstPokemon.id });
		}

		refetch();
	};

	const isPokeLoading = voteMutation.isLoading || isLoading;

	return (
		<>
			<div className="flex flex-col gap-16 justify-between items-center select-none">
				<div className="text-3xl font-bold text-center mb">Which Pokémon is the Roundest?</div>
				<div className="w-full md:w-2/3 lg:w-3/6 p-8 flex-row  flex justify-between items-center animate-fade-in">
					{pokemonPair && (
						<>
							<PokemonListings
								pokemon={pokemonPair.firstPokemon}
								vote={() => voteForRoundest(pokemonPair.firstPokemon.id)}
								disabled={isPokeLoading}
							></PokemonListings>
							<div className="p-8 font-extrabold text-2xl">Vs</div>
							<PokemonListings
								pokemon={pokemonPair.secondPokemon}
								vote={() => voteForRoundest(pokemonPair.secondPokemon.id)}
								disabled={isPokeLoading}
							/>
						</>
					)}
					{!pokemonPair && <Loader />}
				</div>
				<div className="flex items-center pb-4">
					<div className="pr-4 flex items-center gap-2">
						<Image className="invert" src={'/github.svg'} width={20} height={20} alt="github icon" />
						<Link href={'https://github.com/alireza-constantin/roundest-poki'}>
							<a target="_blank">Github</a>
						</Link>
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

type PokemonFromServer = inferQueryResponse<'get-pokemon-pair'>['firstPokemon'];

const Loader = () => {
	return (
		<div className="flex items-center justify-between w-full">
			<Image className="w-64 h-72 max-w-2xl" width={250} height={285} src={'/rings.svg'} alt="spinner" />
			<div>Vs</div>
			<Image className="w-64 h-72 max-w-2xl" width={250} height={285} src={'/rings.svg'} alt="spinner" />
		</div>
	);
};

const PokemonListings = (props: { pokemon: PokemonFromServer; disabled: boolean; vote: () => void }): JSX.Element => {
	return (
		<div className={`w-64 h-auto max-w-2xl flex flex-col items-center ${props.disabled && 'opacity-0'} `}>
			<Image quality={100} width={250} height={250} src={props.pokemon.spriteUrl!} alt={props.pokemon.name} />
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
