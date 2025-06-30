// useOrientation.tsx
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

/**
 * Returns true if the screen is in portrait mode
 */
const isPortrait = () => {
	const dim = Dimensions.get('window');
	return dim.height >= dim.width;
};

/**
 * A React Hook which updates when the orientation changes
 * @returns whether the user is in 'PORTRAIT' or 'LANDSCAPE'
 */

export const deviceOrientation = () => {
	// State to hold the connection status
	const [orientation, setOrientation] = useState(isPortrait() ? 'PORTRAIT' : 'LANDSCAPE');
	const [width, setWidth] = useState(Dimensions.get('window').width)
	const [height, setHeight] = useState(Dimensions.get('window').height)


	useEffect(() => {
		const callback = () => {
			setOrientation(isPortrait() ? 'PORTRAIT' : 'LANDSCAPE');
			setWidth(Dimensions.get('window').width)
			setHeight(Dimensions.get('window').height)
		}
		Dimensions.addEventListener('change', callback);

		return () => {
			Dimensions.removeEventListener('change', callback);
		};
	}, []);

	return { orientation, width, height };
}

