import React, {useEffect} from 'react';
import {useAppSelector} from '../../app/hooks';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) =>
{
	const appTheme = useAppSelector((state) => state.appTheme);

	useEffect(() =>
	{
		document.documentElement.setAttribute('data-theme', appTheme);
	}, [appTheme]);

	return <>{children}</>;
};