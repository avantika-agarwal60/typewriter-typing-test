# Typewriter-typing-test

It is a typing speed test website with an attempt at looking aesthetic with typewriter visuals

## Live Website Link
[Typewriter-typing-test](https://avantika-agarwal60.github.io/typewriter-typing-test/)

## Run Locally
```bash
git clone https://github.com/avantika-agarwal60/typewriter-typing-test.git
cd typewriter-typing-test
npm install
npm run build
```
Then serve the folder with a local server (like vs code Live Server extension) and open index.html. Opening the file directly won't work, because the page loads a module script and fetches data.

While developing, `npm run watch` rebuilds `dist/something.js` every time you save.
 
## Features
- Live stats
- Click on the stats to switch units between WPM and CPS
- Random Passage fetched from API on every load (short story paragraphs- Aesop's Fables)
- Typewriter graphic whose keys press down as you type
- Click and carriage-return bell sounds
- Shows a message if the passage can't be loaded, instead of hanging on "Loading passage..."
- The page scrolls so the active line stays just above the typewriter
  ( The passage takes a few seconds to load on the first run since it the API is on a free Render host that sleeps when idle )
  <img width="854" height="480" alt="screen-capture-5_vBhJcUho (online-video-cutter com)" src="https://github.com/user-attachments/assets/7d02bdbd-14ee-4578-9f41-c4cddca1a4c4" />

- Shows a message if the passage can't be loaded, instead of hanging on "Loading passage..."

## Tech
- TypeScript, compiled to plain JavaScript
- HTML and CSS, with no framework
- zod for validating API data
- HTML Audio elements for sound effects, using a pool of 8 so fast typing can overlap clicks
- Vitest (unit tests) and Playwright (browser tests)
- GitHub Actions to run the tests on every push

zod is bundled into `dist/something.js` by esbuild, so there is no CDN dependency and the page works offline. `npm run typecheck` runs TypeScript's checker without emitting files.

## Stats
It has 7 statistics that are calculated as you type, for now- 
- Instantaneous WPM
- Instantaneous CPS
- Average WPM
- Average CPS
- Normalized WPM (takes errors into account- undoing errors doesn't improve it)
- Normalized CPS (again, like above)
- Accuracy (again, fixing errors won't improve it)

Formulae for the stats (you can check the stats.ts file for this)- 
```javascript
InstantaneousCPS=(logInstTime - logStartTime)!=0?(1000/(logInstTime - logStartTime)): currentCPS;
//basically the time between two characters
InstantaneousWPM= (currentCPS*60/5);

avgCPS= (1000*(interval)/(totalTimeElapsed));
avgWPM= (1000*60*(interval)/(totalTimeElapsed*5));
//intervals are the number of keystroke gaps less than 2 secs

accuracy= (interval-incorrect)/interval*100;
normalizedWPM= avgWPM*accuracy/100;
normalizedCPS= avgCPS*accuracy/100;
```

- gaps longer than two seconds do not harm your average stats but do count towards the instantaneous stats

## Testing
```bash
npm test            # unit tests (Vitest) for the stats calculations
npm run test:e2e    # builds, then runs the browser tests (Playwright)
npm run typecheck   # TypeScript type check
```
Before running the browser tests for the first time, install the browser: `npx playwright install chromium`.

The browser tests mock the story API, so they don't depend on the network, and they cover:
- characters being marked correct or wrong as you type
- backspace clearing the marking and moving the caret back
- error handling when the API fails, returns a 500 or sends data in the wrong shape

The same checks run automatically on every push through GitHub Actions.

## Visuals
<img width="854" height="480" alt="screen-capture-5_3LklTGwL (online-video-cutter com)" src="https://github.com/user-attachments/assets/6704973d-e9da-480d-b962-5fd8c9c7e030" />

- Has some basic typewriter key press sounds at very slightly differing random pitches
- the typical bell and carriage sound at every new line
- the default load has only one line visible for the sake of aesthetic purposes but seeing how that may affect the typing speed, scrolling it up before you start typing is a valid way to use the test
- I considered adding animations to have the page move towards one side as you type as it would in a typewriter but figured that would probably significantly slow down a user so decided against it

## Project Structure
```
├── index.html
├── home.css
├── src/
│   ├── something.ts     # main app
│   ├── stats.ts         # stats calculations (unit tested)
│   └── stats.test.ts
├── tests/               # Playwright browser tests
├── dist/                # build output and audio files
├── playwright.config.ts
└── .github/workflows/   # CI
```
## Deployment
The site is hosted on GitHub Pages straight from the `main` branch. Pages doesn't run a build step, so the compiled `dist/something.js` is committed to the repo and served as is.


## Credits
- Stories: [Short Stories API](https://shortstories-api.onrender.com/)
- Sound effects: Mixkit [carriage return sound](https://assets.mixkit.co/active_storage/sfx/1368/1368.wav), [key click sound](https://assets.mixkit.co/active_storage/sfx/1119/1119.wav)
- Fonts: Special Elite and Courier Prime, from Google Fonts
