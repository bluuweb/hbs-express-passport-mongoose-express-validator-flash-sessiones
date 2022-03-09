console.log("hola estoy aquí soy frontend");

document.addEventListener("click", (e) => {
    if (e.target.dataset.short) {
        const url = `${window.location.origin}/${e.target.dataset.short}`;

        navigator.clipboard
            .writeText(url)
            .then(() => {
                console.log("Text copied to clipboard...");
            })
            .catch((err) => {
                console.log("Something went wrong", err);
            });
    }
});
