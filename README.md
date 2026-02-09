# Cache Playground

A comprehensive HTTP cache testing environment designed to demonstrate and test various cache control headers and behaviors. This playground helps developers understand how different cache headers affect browser and server caching behavior.

## Features

- **Multiple Cache Scenarios**: Test 8 different cache control strategies through interactive endpoints
- **Visual Benchmarking**: Compare response times and cache behavior in real-time
- **Interactive UI**: Click buttons to test each cache strategy and see results

### Cache Strategies Tested

1. **no-store** - Prevents caching entirely
2. **no-cache** - Stores but revalidates before use
3. **immutable** - Never revalidates, even on refresh
4. **stale-while-revalidate** - Serves stale content while updating
5. **must-revalidate** - Must check with server when stale
6. **private** - Only caches on client, not CDNs
7. **vary-ua** - Varies cache based on User-Agent
8. **last-modified** - Uses time-based revalidation

## Project Layout

```
cache-playground/
├── index.html - Frontend interface for testing and visualizing cache behavior
├── index.ts - Backend server implementing different cache strategies
├── package.json - Project dependencies and scripts
├── tsconfig.json - TypeScript configuration
└── README.md - Project documentation
```

## Getting Started

### Prerequisites

- Node.js and npm (or Bun runtime recommended for development)

### Installation

```bash
bun install
```

### Running the Playground

```bash
bun run index.ts
```

Then open `http://localhost:3000` in your browser to start testing cache behaviors.

## API Endpoints

All endpoints serve dynamic content with current timestamp. Clicking buttons in the UI sends requests and measures response times.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT (see LICENSE file)
