// https://stackoverflow.com/a/17323608

export function mod(number: number, modulo: number) {
  return ((number % modulo) + modulo) % modulo;
}