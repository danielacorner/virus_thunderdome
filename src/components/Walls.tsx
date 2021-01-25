import React from "react";
import { useStore } from "../store";
import { Plane } from "./Shapes/Plane";
// const colors = niceColors[17];
const colors = ["#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900"];

export const CEILING_HEIGHT_MULTIPLIER = 4;

// https://www.npmjs.com/package/nice-color-palettes
// https://raw.githubusercontent.com/Jam3/nice-color-palettes/HEAD/visualize/1000.png
// const palette = niceColors[6]; // e.g. => [ "#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900" ]
export function Walls() {
	const worldRadius = useStore((state) => state.worldRadius);
	const ceilingHeight = worldRadius * CEILING_HEIGHT_MULTIPLIER;
	const walls = [
		{
			name: "in front",
			width: worldRadius * 2,
			height: ceilingHeight,
			rotation: [0 * Math.PI, 0, 0],
			color: colors[1],
			position: [0, ceilingHeight / 2 - worldRadius, -worldRadius],
		},
		{
			name: "behind",
			width: worldRadius * 2,
			height: ceilingHeight,
			rotation: [0, -1 * Math.PI, 0],
			color: colors[1],
			position: [0, ceilingHeight / 2 - worldRadius, worldRadius],
		},
		{
			name: "left",
			width: worldRadius * 2,
			height: ceilingHeight,
			rotation: [0, 0.5 * Math.PI, 0],
			color: colors[1],
			position: [-worldRadius, ceilingHeight / 2 - worldRadius, 0],
		},
		{
			name: "right",
			width: worldRadius * 2,
			height: ceilingHeight,
			rotation: [0, -0.5 * Math.PI, 0],
			color: colors[2],
			position: [worldRadius, ceilingHeight / 2 - worldRadius, 0],
		},
		{
			name: "floor",
			width: worldRadius * 2,
			height: worldRadius * 2,
			rotation: [-0.5 * Math.PI, 0, 0],
			color: colors[1],
			position: [0, -worldRadius, 0],
		},
		{
			name: "ceiling",
			width: worldRadius * 2,
			height: worldRadius * 2,
			rotation: [0.5 * Math.PI, 0, 0],
			color: colors[1],
			position: [0, ceilingHeight - worldRadius, 0],
		},
	];

	return (
		<>
			{walls.map((props, idx) => (
				<Plane {...props} key={idx} />
			))}
		</>
	);
}
