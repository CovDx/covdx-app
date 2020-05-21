# CMTA

## Requirements
Node version 14.0.0:
`nvm install 14`

cocoapods:
`sudo gem install cocoapods`

xcode command tools:
`xcode-select --install`


## Build steps
1. Clone 
`git clone https://github.com/CoVDx/covdx-app.git`
2. `npm install nan`
3. `npm install`
4. `npm run build`
5. `npx cap sync`
6. `npx cap open ios`
7. Under Signing & Capabilities, verify team and bundle ID

# Original default Angular CLI readme stuff 
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
