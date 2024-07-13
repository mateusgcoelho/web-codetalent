export default class NumberMaskConverterUtils {
  static convertMaskToNumber(value: any): number {
    try {
      return Number(
        value
          .toString()
          .replaceAll('R$', '')
          .replaceAll('.', '')
          .replaceAll(',', '.'),
      );
    } catch {
      return 0;
    }
  }
}
