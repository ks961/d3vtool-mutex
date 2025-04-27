# Mutex

This library allows you to use concept of mutex in asynchronous environment.

## Installation

You can install the package using npm or yarn:

### npm

```bash
npm install @d3vtool/mutex
```

### yarn

```bash
yarn add @d3vtool/mutex
```

## Usage Example

### Concurrent Async Data Fetching with Sequential Updates to a Shared Resource

```ts
import Mutex from '@d3vtool/mutex';

const mutex = new Mutex();
const resource: any[] = [];

await Promise.all([
  (async () => {
    const release = await mutex.acquire();

    const res = await fetch("some-api-endpoint/");
    const data = await res.json();
    resource.push({ source: "fetch1", data });

    release();
  })(),

  (async () => {
    const release = await mutex.acquire();

    const res = await fetch("some-api-endpoint/");
    const data = await res.json();
    resource.push({ source: "fetch2", data });

    release();
  })()
]);

console.log(resource);
/*
[
  { source: "fetch1", data },
  { source: "fetch2", data }
]
*/
```