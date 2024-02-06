export default class EqualValidator {
  public static validate(value: string, valueToCompare: string): boolean {
    return value === valueToCompare;
  }
}