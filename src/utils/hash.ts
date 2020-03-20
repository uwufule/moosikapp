interface IHashFunc {
  (h: number, c: any, i: number, s: string): number;
}

const func: IHashFunc = (h, c, i, s) => (h << 5) - h + s.charCodeAt(i);

const hash = (str: string): string => [].reduce.call(str, func, 0).toString(36);

export default hash;
