import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';

const Home: NextPage = () => {
	const { data, isLoading } = trpc.useQuery(['hello', { text: 'alireza' }]);

	if (isLoading) return <div>Loading...</div>;
	if (data) return <div>{data.greeting}</div>;

	return (
		<div className="h-screen w-screen flex flex-col justify-center items-center">
			<div className="text-2xl text-center mb">Wich Pokémon is the Roundest?</div>
			<div className="p-4" />
			<div className="border rounded p-8 flex justify-between items-center">
				<div className="bg-red-200 w-16 h-16 max-w-2xl"></div>
				<div className="p-8 ">Vs</div>
				<div className="bg-red-200 w-16 h-16"></div>
			</div>
		</div>
	);
};

export default Home;
