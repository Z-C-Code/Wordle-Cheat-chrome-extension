// Word needs to be global
var word;

// Create the URL with the date in it
function getUrl() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const url = `https://www.nytimes.com/svc/wordle/v2/${year}-${month}-${day}.json`;
    return url;
}

// Fetch that URL and get the solution
fetch(getUrl())
    .then(res => {
        if (res.status !== 200) {
        throw new Error("Request failed with status " + res.status);
        }
        return res.json();
    })
    .then(data => {
        word = data.solution;
        document.getElementById("answer").innerHTML = word;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("on-wordle").style.display = "none";
        document.getElementById("not-on-wordle").style.display = "block";
    });

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