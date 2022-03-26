var word = 

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Get the current tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            getlocalData(tabs)
        });
    }
    catch (err) {
    }
});
function getlocalData(tab) {
    chrome.scripting.executeScript({ target: { tabId: tab[0].id, allFrames: true }, func: () => { return localStorage.getItem("nyt-wordle-state") } }, (result) => {
        if (result) {
            result = result[0].result
        }
        if (!result || !JSON.parse(result).solution) {
            document.getElementById("on-wordle").style.display = "none"
            document.getElementById("not-on-wordle").style.display = "block"
            return;
        }
        result = JSON.parse(result)
        answer.innerText = result.solution
        word = result.solution
    });
}

document.getElementById("answer").innerHTML = word;

// DIFINE
const key = "5b488502-ab32-4454-8424-d8abe79e2aaf";
fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${key}`)
    .then(res => res.json())
    .then(data => document.getElementById("def").innerHTML = (data[0]["shortdef"][0]))

// AUTO SOLVE
document.getElementById("solve").addEventListener("click", () => {
    var word_on_screen = document.getElementById("answer").innerText;
    let answer = word_on_screen
    let r = answer.split("")
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
        r.forEach(element => {
            chrome.scripting.executeScript({
                target: { tabId: tab[0].id }, func: (e) => {

                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }))
                }
            });
        });
        r.forEach(element => {
            console.log(element)
            chrome.scripting.executeScript({
                target: { tabId: tab[0].id, allFrames: true }, func: (elm) => {
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: elm }))
                }, args: [element]
            });
        });
        chrome.scripting.executeScript({
            target: { tabId: tab[0].id, allFrames: true }, func: () => {
                window.dispatchEvent(new KeyboardEvent("keydown", { key: `Enter` }))
            }
        })

    })
})