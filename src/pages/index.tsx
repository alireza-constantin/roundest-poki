import { getVoteOptions } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';

const Home: NextPage = () => {
	const [ids, setIds] = useState(() => getVoteOptions());

	const [first, second] = ids;

	const pokemon1 = trpc.useQuery(['get-pokemon-by-id', { id: first }]);
	const pokemon2 = trpc.useQuery(['get-pokemon-by-id', { id: second }]);

	if (pokemon1.isLoading || pokemon2.isLoading) return <div>...loading</div>;

	return (
		<div className="h-screen w-screen flex flex-col justify-center items-center">
			<div className="text-2xl text-center mb">Wich Pokémon is the Roundest?</div>
			<div className="p-4" />
			<div className="border rounded p-8 flex-col md:flex-row  flex justify-between items-center">
				<div className="w-64 h-64 max-w-2xl flex flex-col">
					<Image width={250} height={250} src={pokemon1.data?.sprites.front_default!} alt={pokemon1.data?.name} />
					<div className="text-xl text-center capitalize pb-2">{pokemon1.data?.name}</div>
				</div>
				<div className="p-8 ">Vs</div>
				<div className="w-64 h-64  flex flex-col">
					<Image width={250} height={250} src={pokemon2.data?.sprites.front_default!} alt={pokemon2.data?.name} />
					<div className="text-xl text-center capitalize pb-2">{pokemon2.data?.name}</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
