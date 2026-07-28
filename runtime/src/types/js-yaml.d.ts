declare module "js-yaml" {
  export interface DumpOptions {
    lineWidth?: number;
    noRefs?: boolean;
  }

  export function load(input: string): unknown;
  export function dump(input: unknown, options?: DumpOptions): string;
}
