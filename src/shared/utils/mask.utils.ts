export class MaskUtils {
  /**
   * Converts the input value to a string.
   * @param {string | number | null | undefined} value - The value to be converted to a string.
   * @returns {string} - The string representation of the input value.
   */
  private toString(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  }

  /**
   * Removes all non-digit characters from the input.
   *
   * @param {string | number | null | undefined} value - The value to be processed.
   * @returns {string} - The string containing only digits.
   */
  private digits(value: string | number | null | undefined): string {
    return this.toString(value).replace(/\D/g, '');
  }

  /**
   * Formats phone number.
   *
   * @param {string | number | null | undefined} value - The value to be formatted.
   * @returns {string} - The formatted phone number.
   */
  formatPhone(value: string | number | null | undefined): string {
    const v = this.digits(value).slice(0, 11);

    if (!v) return '';

    if (v.length <= 2) return `(${v}`;
    if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length <= 10)
      return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;

    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  }
}
