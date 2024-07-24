var magma_is_capturing = false;
var magma_is_displayed = false;
var magma_data_page_blob = null;
var magma_data_positions = [];
var magma_data_positions_blob = null;

function magma_blob_download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

function magma_capture_download (){
    magma_blob_download(magma_data_positions_blob, 'positions.json');
    magma_blob_download(magma_data_page_blob, 'page_capture.jpg');
}

function magma_display_build() {
    magma_is_displayed = true;
    const link_icons = document.createElement("link");
    link_icons.rel = "stylesheet";
    link_icons.href = "https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css";
    document.head.appendChild(link_icons);

    const magma_container = document.createElement("div");
    const magma_action_button = document.createElement("div");
    const magma_body = document.createElement("div");
    const magma_counter = document.createElement("div");
    magma_container.id = "magma_container";
    magma_action_button.id = "magma_action_button";
    magma_body.id = "magma_body";
    magma_counter.id = "magma_counter";

    magma_container.style.cssText = `
        position: fixed;
        bottom: 16px;
        right: 16px;
        background-color: rgba(255, 255, 255, 1);
        outline: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        display: flex;
        flex-direction: row;
        font-family: 'Arial', sans-serif, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        z-index: 9999;
        overflow: hidden;
        transition: 0.3s ease;
    `;
    magma_body.style.cssText = `
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 9998;
        border: 2px solid transparent;
        transition: 0.3s ease;
        pointer-events: none;
    `;
    magma_counter.style.cssText = `
        background-color: rgba(0, 0, 0, 0);
        color: rgba(0, 0, 0, 0.75);
        font-size: 12px;
        border: none;
        padding: 4px 8px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
    `;

    [magma_action_button].forEach(button => {
        button.style.cssText = `
            background-color: rgba(0, 0, 0, 0);
            color: rgba(0, 0, 0, 0.75);
            font-size: 12px;
            border: none;
            padding: 4px 8px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
            transition: 0.3s ease;
        `;
        button.addEventListener("mouseover", function() {
            button.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        });
        button.addEventListener("mouseout", function() {
            button.style.backgroundColor = "rgba(0, 0, 0, 0)";
        });
    });

    magma_action_button.addEventListener("click", function() {
        magma_capture_toggle();
    });

    document.body.appendChild(magma_container);
    document.body.appendChild(magma_body);
    magma_container.appendChild(magma_action_button);
    magma_container.appendChild(magma_counter);
    magma_display_show();
}

function magma_capture_toggle() {
    if (magma_is_capturing) {
        magma_display_show();
        magma_capture_stop();
    } else {
        magma_display_hide();
        magma_capture_start();
    }
    magma_is_capturing = !magma_is_capturing;
}

function magma_display_show() {
    const magma_container = document.getElementById("magma_container");
    const magma_action_button = document.getElementById("magma_action_button");
    const magma_body = document.getElementById("magma_body");
    const magma_counter = document.getElementById("magma_counter");
    magma_container.style.opacity = 1;
    magma_action_button.innerHTML = `Start capture<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="height: 14px; width: 14px"><path fill="orangered" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>`;
    magma_body.style.borderColor = "transparent";
    magma_counter.style.display = "none";
    magma_counter.innerText = "";
}

function magma_display_hide() {
    const magma_container = document.getElementById("magma_container");
    const magma_action_button = document.getElementById("magma_action_button");
    const magma_body = document.getElementById("magma_body");
    const magma_counter = document.getElementById("magma_counter");
    magma_container.style.opacity = 0.25;
    magma_action_button.innerHTML = `Stop capture<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="height: 14px; width: 14px"><path fill="rgba(0,0,0,0.75)" d="M3,3V21H21V3" /></svg>`;
    magma_body.style.borderColor = "orangered";
    magma_counter.style.display = "flex";
    magma_counter.innerText = "";
}

function magma_capture_start() {
    console.log("Magma capture started");

    if (magma_is_displayed) {
        const magma_container = document.getElementById("magma_container");
        const magma_body = document.getElementById("magma_body");

        magma_container.style.display = "none";
        magma_body.style.display = "none";
    }

    magma_data_positions = [{
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
    }];

    html2canvas(document.body).then(canvas => {
        canvas.toBlob(blob => {
            magma_data_page_blob = blob;
        }, 'image/jpeg');

        if (magma_is_displayed) {
            magma_container.style.display = "flex";
            magma_body.style.display = "block";
        }
    });

    let i = 1;
    document.addEventListener('mousemove', (event) => {
        magma_data_positions.push({ x: event.pageX, y: event.pageY });
        if (magma_is_displayed) {
            const magma_counter = document.getElementById("magma_counter");
            magma_counter.innerText = `Capturing: ${i}`;
        }
        i++;
    });
}

function magma_capture_stop() {
    console.log("Magma capture stopped");
    
    magma_data_positions_blob = new Blob([JSON.stringify(magma_data_positions)], { type: 'application/json' });
    magma_capture_download();

    magma_data_positions = [];
    magma_data_page_blob = null;
    magma_data_positions_blob = null;
}

window.addEventListener('resize', (event) => {
    if (magma_is_capturing) {
        magma_capture_stop();
        magma_capture_start();
    }
});

window.addEventListener('beforeunload', (event) => {
    if (magma_is_capturing) {
        magma_capture_stop();
    }
});
