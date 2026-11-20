# Typewriter-typing-test

It is a typing speed test website with an attempt at looking aesthetic with typewriter visuals

## Live Website Link
[Typewriter-typing-test](https://avantika-agarwal60.github.io/typewriter-typing-test/)

## Run Locally
```bash
git clone https://github.com/avantika-agarwal60/typewriter-typing-test.git
cd typewriter-typing-test
npm install
npx tsc
```
Then serve the folder with a local server (e.g. the VS Code Live Server extension) and open index.html. Opening the file directly won’t work.
 
## Features
- Live stats
- Click on the stats to switch units between WPM and CPS
- Random Passage fetched from API on every load (short story paragraphs- Aesop's Fables)
- Typewriter graphic whose keys press down as you type
- Click and carriage-return bell sounds
- The page scrolls so the active line stays just above the typewriter

## Tech
- TypeScript, compiled to plain JavaScript
- HTML and CSS, with no framework
- zod for validating API data
- HTML Audio elements for sound effects, using a pool of 8 so fast typing can overlap clicks

(zod is loaded in the browser straight from a CDN so it'll show an error when you run npx tsc. The compiled JS will run fine but if you want to change that use a bundler)

## Stats
It has 7 statistics that are calculated as you type, for now- 
- Instantaneous WPM
- Instantaneous CPS
- Average WPM
- Average CPS
- Normalized WPM (takes errors into account- undoing errors doesn't improve it)
- Normalized CPS (again, like above)
- Accuracy (again, fixing errors won't improve it)

Formulae for the stats- 
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

## Visuals
- Has some basic typewriter key press sounds at very slightly differing random pitches
- the typical bell and carriage sound at every new line
- the default load has only one line visible for the sake of aesthetic purposes but seeing how that may affect the typing speed, scrolling it up before you start typing is a valid way to use the test
- I considered adding animations to have the page move towards one side as you type as it would in a typewriter but figured that would probably significantly slow down a user so decided against it

## Credits
- Stories: [Short Stories API](https://shortstories-api.onrender.com/)
- Sound effects: Mixkit [carriage return sound](https://assets.mixkit.co/active_storage/sfx/1368/1368.wav), [key click sound](https://assets.mixkit.co/active_storage/sfx/1119/1119.wav)
- Fonts: Special Elite and Courier Prime, from Google Fonts
