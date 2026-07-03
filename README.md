# @fishka/logs

Part of [fishka.bio](https://fishka.bio) — free browser-based bioinformatics tools.

Console.log transformation pipes for structured logging in TypeScript.

## Installation

```bash
npm install @fishka/logs
```

## Quick Start

```typescript
import {createJsonStringifyPipe, installConsoleOverride} from '@fishka/logs';

// Install JSON stringify pipe
installConsoleOverride(createJsonStringifyPipe());

// Now all console logs are JSON formatted
console.log('User logged in', {userId: 123, action: 'login'});
// Output: {"message":"User logged in $1","$1":{"userId":123,"action":"login"},"level":"log","timestamp":"2026-02-15T04:30:00.000Z","message_id":"a1b2c3d4-e5f6-7890-abcd-ef1234567890"}
```

## Pipes

### JsonStringifyPipe

Converts console arguments to a JSON string:

```typescript
import {createJsonStringifyPipe, installConsoleOverride} from '@fishka/logs';

installConsoleOverride(createJsonStringifyPipe());

console.log('Hello', {data: 'value'});
// {"message":"Hello $1","$1":{"data":"value"},"level":"log","timestamp":"...","message_id":"..."}
```

### JsonPipe

Converts console arguments to a JSON object (without stringifying):

```typescript
import {createJsonPipe, installConsoleOverride} from '@fishka/logs';

const pipe = createJsonPipe();
installConsoleOverride(pipe);

// Access last message ID
console.log('Test');
console.log(pipe.getLastMessageId()); // "a1b2c3d4-..."

// Set next message ID
pipe.setNextMessageId('custom-id-123');
console.log('Test'); // Uses "custom-id-123" as message_id
```

### LogLevelFilterPipe

Filter logs by level:

```typescript
import {createLogLevelFilterPipe, installConsoleOverride} from '@fishka/logs';

// Exclude debug and trace logs
installConsoleOverride(createLogLevelFilterPipe({
    excludedLogLevels: ['debug', 'trace']
}));

console.debug('This will not appear');
console.log('This will appear');
```

### LogMessageFilterPipe

Filter logs by message content:

```typescript
import {createLogMessageFilterPipe, installConsoleOverride} from '@fishka/logs';

// Exclude messages containing "password"
installConsoleOverride(createLogMessageFilterPipe({
    excludedMessagePatterns: [/password/i]
}));

console.log('User password: secret123'); // Filtered out
console.log('User login: john'); // Allowed
```

### LogCachePipe

Cache recent logs:

```typescript
import {createLogCachePipe, installConsoleOverride} from '@fishka/logs';

const cachePipe = createLogCachePipe({maxCacheSize: 100});
installConsoleOverride(cachePipe);

console.log('Message 1');
console.log('Message 2');

// Access cached logs
console.log(cachePipe.getLogCache()); // Array of recent logs
```

### DateTimePipe

Add timestamps to logs:

```typescript
import {createDateTimePipe, installConsoleOverride} from '@fishka/logs';

installConsoleOverride(createDateTimePipe());

console.log('Event');
// [2026-02-15T04:30:00.000Z] Event
```

## Combining Pipes

Install multiple pipes in order:

```typescript
import {
    createLogLevelFilterPipe,
    createJsonStringifyPipe,
    installConsoleOverrides
} from '@fishka/logs';

installConsoleOverrides(
    createLogLevelFilterPipe({excludedLogLevels: ['debug']}),
    createJsonStringifyPipe()
);
```

## Uninstalling Pipes

```typescript
import {uninstallConsoleOverride, uninstallAllConsoleOverrides} from '@fishka/logs';

// Remove specific pipe
uninstallConsoleOverride(pipe);

// Remove all pipes
uninstallAllConsoleOverrides();
```

## Custom Pipe

Create your own pipe:

```typescript
import {LogPipe, installConsoleOverride} from '@fishka/logs';

const myPipe: LogPipe = (level, ...args) => {
    // Transform arguments
    return args.map(arg => typeof arg === 'string' ? arg.toUpperCase() : arg);
};

installConsoleOverride(myPipe);

console.log('hello'); // HELLO
```

Suppress logs by returning empty array:

```typescript
const suppressPipe: LogPipe = () => [];
```

Change log level by returning object:

```typescript
const upgradePipe: LogPipe = (level, ...args) => ({
    level: 'error', // Upgrade all logs to error
    args
});
```

## License

Apache-2.0
