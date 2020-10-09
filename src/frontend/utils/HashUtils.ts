class HashUtils {
  public static genHash = (data: string, radix: number = 16) => {
    return Array.from(data)
      .reduce((hashInt, char) => (hashInt << 5) - hashInt + char.charCodeAt(0), 0)
      .toString(radix);
  };
}

export default HashUtils;
