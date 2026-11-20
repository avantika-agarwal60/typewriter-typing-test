import { z } from "https://esm.sh/zod";

let logStartTime= 0;
let currentWPM = 0;
let currentCPS = 0;
let avgCPS = 0;
let avgWPM = 0;
let totalTimeElapsed=0;
let firstChar: boolean= true;
let interval= 0;
let incorrect= 0;
let charCounter= 0;
let lastCharCounter= 0;
let normalizedWPM= 0;
let normalizedCPS= 0;
let accuracy= 100;
let caretIndex= -1;
let i=0;
let spans: HTMLSpanElement[]= [];
let randomPassageText: string;
const typewriter = document.querySelector<HTMLElement>(".typewriter");
const LINE_GAP = 12;  
const keySound1:HTMLAudioElement= new Audio ("dist/audio/mixkit-hard-typewriter-click-1119.wav");
const keySound2:HTMLAudioElement= new Audio ("dist/audio/mixkit-hard-typewriter-click-1119.wav");
const keySound3:HTMLAudioElement= new Audio ("dist/audio/mixkit-hard-typewriter-click-1119.wav");
const keySound4:HTMLAudioElement= new Audio ("dist/audio/mixkit-hard-typewriter-click-1119.wav");
const keySound5:HTMLAudioElement= new Audio ("dist/audio/mixkit-hard-typewriter-click-1119.wav");
const keySound6:HTMLAudioElement= new Audio ("dist/audio/mixkit-hard-typewriter-click-1119.wav");
const keySound7:HTMLAudioElement= new Audio ("dist/audio/mixkit-hard-typewriter-click-1119.wav");
const keySound8:HTMLAudioElement= new Audio ("dist/audio/mixkit-hard-typewriter-click-1119.wav");
const keysounds:HTMLAudioElement[]=[keySound1,keySound2,keySound3,keySound4,keySound5,keySound6,keySound7,keySound8];
const carriageSound:HTMLAudioElement= new Audio ("dist/audio/mixkit-typewriter-return-bell-1368.wav");


const input=document.getElementById("inp");
if(!(input instanceof HTMLTextAreaElement))
{
    throw new Error ("#inp not found")
}

const currentCPSDisplay= document.getElementById("cps");
if(!(currentCPSDisplay instanceof HTMLParagraphElement))
{
    throw new Error ("#cps not found")
}

const avgCPSDisplay= document.getElementById("avgcps");
if(!(avgCPSDisplay instanceof HTMLParagraphElement))
{
    throw new Error ("#avgcps not found")
}

const currentWPMDisplay= document.getElementById("wpm");
if(!(currentWPMDisplay instanceof HTMLParagraphElement))
{
    throw new Error ("#wpm not found")
}

const avgWPMDisplay= document.getElementById("avgwpm");
if(!(avgWPMDisplay instanceof HTMLParagraphElement))
{
    throw new Error ("#avgwpm not found")
}

const normalizedWPMDisplay= document.getElementById("normalizedwpm");
if(!(normalizedWPMDisplay instanceof HTMLParagraphElement))
{
    throw new Error ("#normalizedwpm not found")
}

const normalizedCPSDisplay= document.getElementById("normalizedcps");
if(!(normalizedCPSDisplay instanceof HTMLParagraphElement))
{
    throw new Error ("#normalizedcps not found")
}

const accuDisplay= document.getElementById("accu");
if(!(accuDisplay instanceof HTMLParagraphElement))
{
    throw new Error ("#accu not found")
}

const passage= document.getElementById("passage");
if(!(passage instanceof HTMLElement))
{
    throw new Error ("#passage not found");
}
const StorySchema= z.object (
{
    _id     : z.string(),  
    title   : z.string(),  
    author  : z.string(), 
    story   : z.string(),   
    moral   : z.string()   
});
type story= z.infer<typeof StorySchema>;
let randomPassage= (async function (): Promise<story> {
const response= await fetch ("https://shortstories-api.onrender.com/");
const data: unknown= await response.json();
return StorySchema.parse(data);
}());

randomPassage.then((resolvedStory)=>{
    passage.textContent= resolvedStory.story;
    randomPassageText= resolvedStory.story;
    for (let i=0; i<randomPassageText.length; i++)
    {
        const span= document.createElement("span");
        span.textContent=randomPassageText.charAt(i);
        spans.push(span);
    }

    passage.replaceChildren(...spans);
    caretIndex = -1;
    setCaret(input.value.length);     
    input.focus();  
});


const changeUnit= ():void =>
{
    if(avgCPSDisplay.checkVisibility() && currentCPSDisplay.checkVisibility())
    {
        avgCPSDisplay.hidden = true;
        currentCPSDisplay.hidden = true;
        avgWPMDisplay.hidden = false;
        currentWPMDisplay.hidden = false;
    }
    else 
    {
        avgCPSDisplay.hidden = false;
        currentCPSDisplay.hidden = false;
        avgWPMDisplay.hidden = true;
        currentWPMDisplay.hidden = true;
    }
}

[avgCPSDisplay, avgWPMDisplay, currentCPSDisplay, currentWPMDisplay].forEach((display)=>
{
    display.addEventListener("click",changeUnit)
})

const changeUnitNormalize= ():void =>
{
    if(normalizedCPSDisplay.checkVisibility())
    {
        normalizedCPSDisplay.hidden= true;
        normalizedWPMDisplay.hidden= false;
    }
    else{
        normalizedCPSDisplay.hidden= false;
        normalizedWPMDisplay.hidden= true;
    }
}


function setCaret(index: number): void {
    spans[caretIndex]?.classList.remove("current");
    spans[index]?.classList.add("current");
    caretIndex = index;  
    const next= spans[index];
    if (!scroll || !next || !typewriter) return;

    const typingLine = typewriter.getBoundingClientRect().top - LINE_GAP;
    const overshoot = next.getBoundingClientRect().bottom - typingLine;

    if (overshoot > 1) {
        window.scrollBy({ top: overshoot, behavior: "smooth" });
        carriageSound.currentTime=0;
    carriageSound.play().catch((err)=> console.error("failed to play carriage sound", err));
}
}

[normalizedCPSDisplay, normalizedWPMDisplay].forEach((unit)=> {unit.addEventListener("click", changeUnitNormalize)})

input.addEventListener("focus",()=>
{
firstChar=true;
});

input.addEventListener("keypress",(event):void=>{
    charCounter= input.value.length;
    if (!event.repeat)
    {
        const logInstTime= performance.now();
        if (!firstChar)
        {
            currentCPS=(logInstTime - logStartTime)!=0?(1000/(logInstTime - logStartTime)): currentCPS;

            currentWPM= (currentCPS*60/5);

            if(logInstTime - logStartTime<=2000)
            {
                totalTimeElapsed+= logInstTime - logStartTime;
                interval++;
                if(totalTimeElapsed>0)
                {
                    avgCPS= (1000*(interval)/(totalTimeElapsed));
                    avgWPM= (1000*60*(interval)/(totalTimeElapsed*5));
                }
            } 
            if(interval>0)
            accuracy= (interval-incorrect)/interval*100;
            normalizedWPM= avgWPM*accuracy/100;
            normalizedCPS= avgCPS*accuracy/100;
        }
            if(charCounter<randomPassageText.length && randomPassageText.charAt(charCounter)!=event.key)
            {
                incorrect++;
                event.preventDefault();
                input.value= input.value.concat(randomPassageText.charAt(charCounter));
                const span= spans[charCounter]
                if(span!=undefined)
                {
                span.className="wrong";
                }
            }
            else
            {
                const span= spans[charCounter]
                if(span!=undefined)
                {
                span.className="correct";
                }
            }
    if(lastCharCounter>charCounter)
    {
        const span= spans[lastCharCounter];
        if(span!=undefined)
        span.className="";
    }
    lastCharCounter=charCounter;
    firstChar=false;
    logStartTime= logInstTime;
    setCaret(charCounter+1);
    }

    currentCPSDisplay.textContent= `CPS: ${(currentCPS).toFixed(1)}`;
    avgCPSDisplay.textContent= `avg CPS: ${(avgCPS).toFixed(1)}`;
    currentWPMDisplay.textContent= `WPM: ${(currentWPM).toFixed(1)}`;
    avgWPMDisplay.textContent= `avg WPM: ${(avgWPM).toFixed(1)}`;
    normalizedWPMDisplay.textContent= `normalized WPM: ${(normalizedWPM).toFixed(1)}`;
    normalizedCPSDisplay.textContent= `normalized CPS: ${(normalizedCPS).toFixed(1)}`;
    accuDisplay.textContent= `accuracy: ${(accuracy).toFixed(1)}%`;

    

});
input.addEventListener("input", (event: Event): void => {
    if (!(event instanceof InputEvent) || !event.inputType.startsWith("delete")) return;

    setCaret(input.value.length);
    for (let i = input.value.length; i < spans.length; i++) {
        const span = spans[i];
        if (span !== undefined) span.classList.remove("wrong","correct");
    }
});
const keyMap = new Map<string, HTMLElement>();
const keysEl = document.getElementById("keys");

for (const row of ["1234567890", "qwertyuiop", "asdfghjkl", "zxcvbnm"]) {
    const rowEl = document.createElement("div");
    rowEl.className = "key-row";
    for (const ch of row) {
        const k = document.createElement("span");
        k.className = "key";
        k.textContent = ch.toUpperCase();
        keyMap.set(ch, k);
        rowEl.append(k);
    }
    keysEl?.append(rowEl);
}
const space = document.getElementById("space");
if (space) keyMap.set(" ", space);

input.addEventListener("keydown", (e) => {
    keyMap.get(e.key.toLowerCase())?.classList.add("down");
    const keysound= keysounds[i];
    if(keysound!=undefined){
    keysound.currentTime=0;
    keysound.playbackRate= 0.95 + Math.random()*0.1;}
    keysound?.play().catch((err)=> console.error("failed to play key sound", err));
    i= i<7? i+1:0;
});
input.addEventListener("keyup",   (e) => keyMap.get(e.key.toLowerCase())?.classList.remove("down"));
input.addEventListener("blur", () => keyMap.forEach((k) => k.classList.remove("down")));