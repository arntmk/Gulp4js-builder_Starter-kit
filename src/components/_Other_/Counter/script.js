/* ____________________________________________ */
// ===Number counter===

function numCounter(selector, number, time, step) {
	const counter = document.querySelector(selector);

	let res = 0;

	const allTime = Math.round(time / (number / step));

	const interval = setInterval(() => {
		res += step;

		if (res === number) {
			clearInterval(interval);
		}
		counter.innerHTML = res;
	}, allTime);
}

// ДАННАЯ ФУНКЦИЯ МОЖЕТ БЫТЬ ВЫЗВАННА НЕОГРАНИЧЕНОЕ КОЛИЧЕСТВО РАЗ

// Первий аргумент - селектор, куда будем выводить результат #num or .num
// Втарой аргумент - конечное значение которое будет показано на странице.
// Третий аргумент - время анимации (милисекунды)
// Четвертый аргумент - шаг анимации (например добавляем по 1 или по 18 или по 180)

numCounter('#num1', 600, 2000, 10);
