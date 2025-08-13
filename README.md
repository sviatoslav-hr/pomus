# Pomus

Pomus (pomodoro-focus) is a simple but configurable pomodoro timer for deep and focused work.

## Developing

Install dependencies with `pnpm install`, start a development server:

```sh
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev --open
```

## Building

To create a production version of your app:

```sh
pnpm build
```

You can preview the production build with `pnpm preview`.

The app uses static adapter since it doesn't need any server stuff and can be pre-rendered completely.
