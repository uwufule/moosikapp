class Hash {
  private int: number;

  public update(data: string): Hash {
    this.int = [].reduce.call(
      data,
      (hash: number, current: string) => (hash << 5) - hash + current.charCodeAt(0),
      0,
    );

    return this;
  }

  public digest(radix: number): string {
    return this.int.toString(radix);
  }
}

const createHash = (): Hash => new Hash();

export default createHash;
