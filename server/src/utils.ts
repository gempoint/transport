import chalk from "chalk";
import { execSync } from "child_process";

export const commitId = () => {
  return "gh"
}

/**
 * Translates seconds into human readable format of seconds, minutes, hours, days, and years
 * 
 * @param  {number} seconds The number of seconds to be processed
 * @return {string}         The phrase describing the amount of time
 */
export function forHumans(seconds: number) {
  var levels = [
    [Math.floor(seconds / 31536000), 'years'],
    [Math.floor((seconds % 31536000) / 86400), 'days'],
    [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
    [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
    [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
  ];
  var returntext = '';

  for (var i = 0, max = levels.length; i < max; i++) {
    if (levels[i][0] === 0) continue;
    // @ts-ignore
    returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length - 1) : levels[i][1]);
  };
  return returntext.trim();
}

export interface Response<T> {
  ok: boolean
  msg: string | null
  data: T
}

export const ok = <T>(x: T, msg: string | null = null): Response<T> => {
  return {
    ok: true,
    msg,
    data: x
  }
}

export const error = <T>(msg: string, data: T): Response<T> => {
  return {
    ok: false,
    msg,
    data
  }
}

export const red = (x: string) => console.log(chalk.red(x))
