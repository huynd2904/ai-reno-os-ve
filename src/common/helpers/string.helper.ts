export class StringHelper {
  private static readonly chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  /**
   * Sinh chuỗi ngẫu nhiên với độ dài cho trước.
   * @param length Độ dài chuỗi muốn sinh ra (mặc định 32)
   * @returns Chuỗi ngẫu nhiên gồm chữ hoa, chữ thường và số
   */
  static randomString(length = 32): string {
    let result = '';
    const charsLength = this.chars.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charsLength);
      result += this.chars[randomIndex];
    }

    return result;
  }
}
