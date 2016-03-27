"use strict";

export class Utils {


  public static uidGen(len: number): string {
    const buf: string[] = [];
    const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charlen: number = chars.length;

    for (let i: number = 0; i < len; ++i) {
      buf.push(chars[Utils.getRandomInt(0, charlen - 1)]);
    }

    return buf.join("");
  }

  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
