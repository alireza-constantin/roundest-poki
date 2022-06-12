import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';
import '../styles/global.css';

import { withTRPC } from '@trpc/next';
import type { AppType } from 'next/dist/shared/lib/utils';
import type { AppRouter } from '@/backend/router';

const MyApp: AppType = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};

export default withTRPC<AppRouter>({
	config({ ctx }) {
		const url = process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}/api/trpc`
			: 'http://localhost:3000/api/trpc';

		return {
			url,
		};
	},
	ssr: false,
})(MyApp);
