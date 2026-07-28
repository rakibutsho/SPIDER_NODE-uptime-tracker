import {
  Bitcount_Grid_Single,
  Gravitas_One,
  Lobster_Two,
  Open_Sans,
  Playfair_Display,
  Roboto,
  Rowdies,
} from "next/font/google";

export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

export const bitcount = Bitcount_Grid_Single({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bitcount",
});

export const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lobster",
});

export const gravitas = Gravitas_One({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-gravitas"
})

export const rowdies = Rowdies({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-rowdies"
})

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});