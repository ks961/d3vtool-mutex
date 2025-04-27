# Mutex

This library allows you to use concept of mutex for shared in-memory resource in asynchronous environment.

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

### Concurrent Async Data Fetching with Updates to a in-memory Shared Resource

```ts
import Mutex from '@d3vtool/mutex';

const mutex = new Mutex();
const resource: any[] = [];

await Promise.all([
  (async () => {
    const res = await fetch("some-api-endpoint/");
    const data = await res.json();

    const release = await mutex.acquire();

    resource.push({ source: "fetch1", data });

    release();
  })(),

  (async () => {
    const res = await fetch("some-api-endpoint/");
    const data = await res.json();

    const release = await mutex.acquire();

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