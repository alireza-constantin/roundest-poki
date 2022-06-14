import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';
import '../styles/global.css';
import Link from 'next/link';
import Image from 'next/image';

import { withTRPC } from '@trpc/next';
import type { AppType } from 'next/dist/shared/lib/utils';
import type { AppRouter } from '@/backend/router';

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<div className="h-screen w-full">
			<div className="text-center">
				<Link href={'/'}>
					<a>
						<Image src={'/pokemon-logo.png'} alt="pokemon logo" width={250} height={200} />
					</a>
				</Link>
			</div>
			<Component {...pageProps} />
		</div>
	);
};

function getBaseUrl() {
	if (process.browser) return '';
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

	return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		const url = `${getBaseUrl()}/api/trpc`;
		return {
			url,
		};
	},
	ssr: false,
})(MyApp);
