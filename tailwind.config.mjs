import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'primary': {
					'50': '#f2f7fb',
					'100': '#e7f0f8',
					'200': '#d3e2f2',
					'300': '#b9cfe8',
					'400': '#9cb6dd',
					'500': '#839dd1',
					'600': '#6a7fc1',
					'700': '#6374ae',
					'800': '#4a5989',
					'900': '#414e6e',
					'950': '#262c40',
				},
				'accent': {
					'50': '#fffbea',
					'100': '#fff2c5',
					'200': '#ffe585',
					'300': '#ffd146',
					'400': '#ffbc1b',
					'500': '#ff9800',
					'600': '#e27100',
					'700': '#bb4c02',
					'800': '#983a08',
					'900': '#7c300b',
					'950': '#481700',
				},
			}
		},
		// 如果需要与「吐槽大王部落格」同款的圆体字体，你可以：
		// 1. 取消注释下面的 fontFamily 配置
		// 2. 增加来自 Google Fonts 的 Varela Round 字体
		// 3. 增加来自 https://github.com/Warren2060/ChillRound 的「寒蝉全圆体」
		/*fontFamily: {
			sans: ["'Varela Round'", '"ChillRoundF"', "'-apple-system'", "'Microsoft YaHei'", "sans-serif"]
		}*/
	},
	plugins: [
		typography
	],
}
