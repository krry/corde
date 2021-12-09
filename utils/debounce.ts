// stolen from underscore then modified for typescript
export const debounce = (
	func: () => void,
	wait = 618,
	immediate = false
): (() => void) => {
	let timeout
	return (...args) => {
		clearTimeout(timeout)
		timeout = setTimeout(function () {
			timeout = null
			if (!immediate) func.apply(this, ...args)
		}, wait)
		if (immediate && !timeout) func.apply(this, ...args)
	}
}
