/** Stateless CLI argument helpers for the public core/config.ts facade. */

export type CliArgReader = (name: string, alias?: string) => string | undefined;

/** Build a CLI reader over one captured argv snapshot. */
export function createCliArgReader(args: readonly string[]): CliArgReader {
  return (name: string, alias?: string): string | undefined => {
    const names = [name, alias].filter(Boolean) as string[];
    for (let index = 0; index < args.length; index += 1) {
      const arg = args[index];
      for (const flag of names) {
        if (arg === flag) return args[index + 1];
        if (arg.startsWith(`${flag}=`)) return arg.slice(flag.length + 1);
      }
    }
    return undefined;
  };
}
