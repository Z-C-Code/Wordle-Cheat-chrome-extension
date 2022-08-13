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
        if (!result) {
            document.getElementById("on-wordle").style.display = "none"
            document.getElementById("not-on-wordle").style.display = "block"
            return;
        }
        word = JSON.parse(result).solution
        document.getElementById("answer").innerHTML = word;
        difine()
    });
}

// DIFINE
function difine() {
    const key = "5b488502-ab32-4454-8424-d8abe79e2aaf";
    fetch('https://www.dictionaryapi.com/api/v3/references/learners/json/' + word + '?key=' + key)
    .then(res => res.json())
    .then(data => document.getElementById("def").innerHTML = (data[0]["shortdef"][0]))
}

// AUTO SOLVE
document.getElementById("solve").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
        word.split("").forEach(letter => {
            chrome.scripting.executeScript({
                target: { tabId: tab[0].id, allFrames: true }, func: (key) => {
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: key }))
                }, args: [letter]
            });
        });
        chrome.scripting.executeScript({
            target: { tabId: tab[0].id, allFrames: true }, func: () => {
                window.dispatchEvent(new KeyboardEvent("keydown", { key: `Enter` }))
            }
        })
    })
})