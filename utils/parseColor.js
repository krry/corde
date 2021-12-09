function parseColor(input) {
	if (input.substr(0, 1) == '#') {
		var collen = (input.length - 1) / 3;
		var fact = [17, 1, 0.062272][collen - 1];
		return [
			Math.round(parseInt(input.substr(1, collen), 16) * fact),
			Math.round(parseInt(input.substr(1 + collen, collen), 16) * fact),
			Math.round(parseInt(input.substr(1 + 2 * collen, collen), 16) * fact),
		];
	} else
		return input
			.split('(')[1]
			.split(')')[0]
			.split(',')
			.map(x => +x);
}
