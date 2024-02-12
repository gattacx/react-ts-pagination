export const numberToArray = (size: number) => Array.from({ length: size }, (_, i) => i + 1)

export const lengthOfPagination = (pages: number, size: number) => Math.ceil(pages / size)