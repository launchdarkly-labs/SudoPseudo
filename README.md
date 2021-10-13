# Sudo Pseudo

#### A storybook addon to view pseudo classes in your stories

This Storybook addon allows you to test pseudo classes using class names without having to rewrite your existing stylesheets. Currently it supports:

- focus-visible
- focus
- active
- hover

## Getting Started

1. Install this plugin
2. Add `sudo-pseudo` to your `main.js` file for storybook.
3. Now you can configure any component to show a pseudo state using class names like `className: "pseudo-hover"` or `className: "pseudo-focus"`

### Development scripts

- `yarn start` runs babel in watch mode and starts Storybook
- `yarn build` build and package your addon code
