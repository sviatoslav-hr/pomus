# Pomus

Pomus (pomodoro-focus) is a simple but configurable pomodoro timer for deep and focused work.
[Try it out](https://sviatoslav-hr.github.io/pomus/)

## Developing

Install dependencies:
```sh
pnpm install
```

Start a development server:
```sh
pnpm dev
```

Or start the server and open the app in a new browser tab
```sh
pnpm dev --open
```

## Building

Build a production version of the app:

```sh
pnpm build
```

You can preview the production build with `pnpm preview`.

The app uses static adapter since it doesn't need any server stuff and can be pre-rendered completely.
