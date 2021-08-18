// return promise
export function copyToClipboard(textToCopy) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(textToCopy);
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand("copy") ? res() : rej();
            textArea.remove();
        });
    }
}


export function toTitleCase () {
    return this.valueOf().toLowerCase()
    .replace(this.valueOf()[0], this.valueOf()[0].toUpperCase());
}

export function parseUnixTimestamp(unix_timestamp) {
    const date = new Date(unix_timestamp * 1000)
    return date
}