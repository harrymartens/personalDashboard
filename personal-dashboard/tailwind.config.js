/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
		animation: {
			marquee: 'marquee 10s linear infinite',
		  },
		  keyframes: {
			marquee: {
			  '0%': { transform: 'translateX(0)' },
			  '100%': { transform: 'translateX(-500%)' },
			},
		  },
		minHeight:{
			'506':'506px'
		},
  		colors: {
  			dark: '#1A1C20',
  			light: '#EEF5F5',
  			yellow: '#FBD356',
			yellow_light: '#FDEAAF',
  			red: '#FC3F29',
			red_light: '#FCB7B2',
  			blue: '#35A7FF',
  			grey: '#BEDFE2',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			heading: [
  				'Outfit'
  			],
			LED: [
				'LED'
			]

  		},
  		fontWeight: {
  			light: '200',
  			regular: '400',
  			semibold: '600',
  			bold: '700'
  		},
  		fontSize: {
  			sml: '1rem',
  			med: '1.25rem',
  			lrg: '1.5rem',
  			xlrg: '2rem'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

