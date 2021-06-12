# @webdesserts/app-scripts

`app-scripts` is a set of scripts that I use to build my personal websites right now. In short, it's a stripped down version of `react-scripts` that uses some of the main plugins from `react-dev-utils`, but ultimately caters to a my particular use-cases. Some of the features include:

- Production builds by default. Development builds with `--debug`
- Caters to the following tech:
  - React
  - Typescript
  - styled-components
  - svgr

> **Warning**: this project is primarily for my personal use. Feel free to file issues, but I don't make any gaurantees that I'll get to them. Instead, I would encourage you to fork this repository and make your own personal set of scripts!

## Getting Started

To get up and running run the following

```bash
npm install --save-dev @webdesserts/app-scripts
```
..._or_ if you're using `yarn`

```bash
yarn add --dev @webdesserts/app-scripts
```

...and then add the following to your `package.json`

```json
"scripts": {
  "build": "app-scripts build",
  "dev": "app-scripts dev",
  "watch": "app-scripts watch"
}
```

From here you'll want to ensure you've done the following:

- Add an `index.html` to the `public/` folder.
- Add a `index.ts` (or `.js`) to the `src/` folder.
- Add a `.tsconfig.json` with the following contents:
  ```json
  { "extends": "./node_modules/@webdesserts/app-scripts" }
  ```

As I use these scripts more and more, I may end up automating the above steps, but for now you'll have to do everything manually.

If you ever want to see a list of the available scripts you can run `yarn app-scripts`.

## Special Thanks

- `create-react-app` team.