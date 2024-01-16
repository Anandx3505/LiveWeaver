function run() {
    let htmlCode = document.getElementById("html-code").value;
    let cssCode = document.getElementById("css-code").value;
    let jsCode = document.getElementById("js-code").value;
    let output = document.getElementById("output-iframe");

    output.contentDocument.body.innerHTML = "";

    let scriptElement = output.contentDocument.createElement("script");
    scriptElement.text = jsCode;

    output.contentDocument.body.appendChild(scriptElement);

    output.contentDocument.body.innerHTML += htmlCode + "<style>" + cssCode + "</style>";
}
