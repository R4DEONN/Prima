import { useAppDispatch, useAppSelector } from '../app/hooks';
import {resetCode, updateCode} from '../features/code/codeSlice';

export function Controls() {
	const code = useAppSelector((state) => state.code.currentCode);
	const dispatch = useAppDispatch();

	const handleSave = () => {
		localStorage.setItem('savedCode', code);
		alert('Код сохранён!');
	};

	const handleLoad = () => {
		const savedCode = localStorage.getItem('savedCode');
		if (savedCode) dispatch(updateCode(savedCode));
	};

	return (
		<div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
			<button onClick={handleSave}>Сохранить</button>
			<button onClick={handleLoad}>Загрузить</button>
			<button onClick={() => dispatch(resetCode())}>Сбросить</button>
		</div>
	);
}