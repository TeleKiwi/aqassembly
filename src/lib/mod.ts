// https://stackoverflow.com/a/17323608
// This was added to allow negative numbers to be properly modulo-ed, which is useful for tests.

export function mod(number: number, modulo: number) {
  return ((number % modulo) + modulo) % modulo;
}
