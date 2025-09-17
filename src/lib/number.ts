export function padNumber(num: number, length = 2): string {
	return num.toString().padStart(length, '0');
}
