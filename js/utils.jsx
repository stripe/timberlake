// @flow
import _ from 'underscore';
import d3 from 'd3';
import React from 'react';

export const paddedInt = d3.format('02d');
export const timeFormat = d3.time.format.utc('%a %H:%M:%S');
export const lolhadoop = (s: string) => s.replace(/application|job/, '');

export function numFormat(n: number) {
  return d3.format(',d')(n || 0);
}

export function secondFormat(ms: number) {
  const n = ms / 1000;
  const hour = Math.floor(n / 3600);
  const minute = Math.floor(n % 3600 / 60);
  const second = Math.floor(n % 3600 % 60);
  return `${numFormat(hour)}:${paddedInt(minute)}:${paddedInt(second)}`;
}

export function plural(n: number, s: string) {
  return n === 1 ? s : `${s}s`;
}

export function humanFormat(ms: number) {
  const n = ms / 1000;
  const hour = Math.floor(n / 3600);
  const minute = Math.floor(n % 3600 / 60);
  const second = Math.floor(n % 3600 % 60);
  if (n < 60) {
    return second + plural(second, ' second');
  } else if (n < 3600) {
    return minute + plural(minute, ' minute');
  }
  return `${numFormat(hour) + plural(hour, ' hour')} ${minute}${plural(minute, ' minute')}`;
}


export const ACTIVE_STATES = ['RUNNING', 'ACCEPTED'];
export const FINISHED_STATES = ['SUCCEEDED', 'KILLED', 'FAILED', 'ERROR'];
export const FAILED_STATES = ['FAILED', 'KILLED', 'ERROR'];

export function jobState(job: {state: string}) {
  const {state} = job;
  const label = {
    accepted: 'success',
    succeeded: 'success',
    killed: 'warning',
    failed: 'danger',
    error: 'danger',
    running: 'primary',
  };
  return <span className={`label label-${label[state.toLowerCase()]}`}>{state}</span>;
}

export function cleanJobName(name: string) {
  return name.replace(/\[[A-Z0-9/]+]\s+/, '').replace(/(\w+\.)+(\w+)/, '$1$2');
}

export function cleanJobPath(path: ?string) {
  if (!path) return path;
  return path
    .replace(/hdfs:\/\/\w+(\.\w+)*:\d+/g, '')
    .replace(/,/, ', ');
}

export function jobLabel(jobName: string) {
  // this regex breaks sometimes, but we still use it by default for
  // backcompat
  const oldLabel = /^[^(]+\(([0-9]+)/.exec(jobName);
  if (oldLabel === null) {
    return /\(([0-9]+)/.exec(jobName)[1];
  } else {
    return oldLabel[1];
  }
}

export function sample(arr: Array<any>, limit: number, comparator: () => number) {
  // Sample arr down to size limit using comparator to take the largest value at
  // each step. Works best if arr is already sorted.
  if (arr.length <= limit) return arr;
  const rv = [];
  const sampleSize = arr.length / limit;
  for (let i = 0; i < arr.length / sampleSize; i += 1) {
    const vals = arr.slice(i * sampleSize, (i + 1) * sampleSize);
    if (vals.length !== 0) {
      rv.push(_.max(vals, comparator));
    }
  }
  return rv;
}

export const COLOUR_MAP = 'rgb(91, 192, 222)';
export const COLOUR_REDUCE = '#E86482';
export const COLOUR_SELECTED = 'rgb(100, 232, 130)';
export const COLOUR_HOVER = 'rgb(100, 232, 200)';
