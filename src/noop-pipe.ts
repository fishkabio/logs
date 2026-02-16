import {LogLevel, LogPipe} from './console-overrides';

/**
 * Creates a log pipe that does nothing.
 * Used to reduce boilerplate in client's code.
 */
export function createNoopPipe(): LogPipe<unknown[]> {
    return (_: LogLevel, ...args: Array<unknown>): Array<unknown> => args;
}
