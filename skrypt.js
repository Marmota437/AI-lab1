let map = L.map('map').setView([53.430127, 14.564802], 18);
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");
    rasterMap.width = canvas.width;
    rasterMap.height = canvas.height;
    rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);
    // console.log(rasterMap.width, rasterMap.height);

    const rows = 4;
    const cols = 4;
    const pieceW = 150;
    const pieceH = 150;

    const pieces = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tmp = document.createElement('canvas');
            tmp.width = pieceW;
            tmp.height = pieceH;
            const tctx = tmp.getContext('2d');

            tctx.drawImage(
                canvas,
                c * pieceW, r * pieceH, pieceW, pieceH,
                0, 0, pieceW, pieceH
            );

            pieces.push({ row: r, col: c, imgSrc: tmp.toDataURL() });
        }
    }

    pieces.sort(() => Math.random() - 0.5);

    for (let i = 0; i < pieces.length; i++) {
        const el = document.getElementById(`draggable-item-${i + 1}`);
        el.innerHTML = '';
        const img = document.createElement('img');
        img.src = pieces[i].imgSrc;
        el.appendChild(img);
        el.dataset.row = pieces[i].row;
        el.dataset.col = pieces[i].col;
    }

    });
});

function scatterItems(items) {
    if (!items || items.length === 0) return;
    const mapEl = document.getElementById('map');
    const mapRect = mapEl ? mapEl.getBoundingClientRect() : { bottom: 0 };
    const margin = 12;
    const pieceSize = 75;

    const minTop = Math.min(window.innerHeight - pieceSize - margin, Math.max(mapRect.bottom + margin, 60));
    const maxTop = Math.max(minTop, window.innerHeight - pieceSize - margin);
    const minLeft = margin;
    const maxLeft = Math.max(margin, window.innerWidth - pieceSize - margin);

    for (const item of items) {
        item.style.position = 'fixed';
        const left = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
        const top = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
        item.style.left = left + 'px';
        item.style.top = top + 'px';
        item.style.margin = '0';
        item.style.zIndex = '500';
    }
}

document.getElementById("getLocation").addEventListener("click", function(event) {

    navigator.geolocation.getCurrentPosition(position => {
        //console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});

function animateToTarget(item, target) {
    const itemRect = item.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const body = document.body;

    const orig = {
        position: item.style.position || '',
        left: item.style.left || '',
        top: item.style.top || '',
        width: item.style.width || '',
        height: item.style.height || '',
        transition: item.style.transition || '',
        zIndex: item.style.zIndex || '',
        margin: item.style.margin || '',
        transform: item.style.transform || ''
    };

    item.style.position = 'fixed';
    item.style.left = itemRect.left + 'px';
    item.style.top = itemRect.top + 'px';
    item.style.width = itemRect.width + 'px';
    item.style.height = itemRect.height + 'px';
    item.style.margin = '0';
    item.style.zIndex = '1000';
    item.style.transition = 'left 300ms ease, top 300ms ease, transform 300ms ease, width 300ms ease, height 300ms ease';

    body.appendChild(item);

    const finalLeft = targetRect.left;
    const finalTop = targetRect.top;
    const finalWidth = targetRect.width;
    const finalHeight = targetRect.height;

    requestAnimationFrame(() => {
        item.style.left = finalLeft + 'px';
        item.style.top = finalTop + 'px';
        item.style.width = finalWidth + 'px';
        item.style.height = finalHeight + 'px';
        item.style.transform = 'scale(1)';
    });

    setTimeout(() => {
        target.appendChild(item);

        item.style.position = 'absolute';
        item.style.left = '0';
        item.style.top = '0';
        item.style.width = '100%';
        item.style.height = '100%';
        item.style.margin = '0';
        item.style.transition = orig.transition;
        item.style.zIndex = '1';
        item.style.transform = orig.transform;

        if (placedPieces.size === 16) {
            const grid = document.getElementById('puzzle-grid');
            grid.style.gap = '0px';
            const targets = document.querySelectorAll('.drag-target');
            targets.forEach(target => {
                target.style.border = 'none';
            });
            alert("Brawo! Ułożyłeś mapę!");
            placedPieces.clear();
            dropedCounter = 0;
        }
    }, 350);
}

 let dropedCounter = 0;
 let placedPieces = new Set();
 let items = document.querySelectorAll('.item');
 let currentDragged = null;
        for (let item of items) {
            item.addEventListener("dragstart", function(event) {
                this.style.border = "5px dashed #D8D8FF";
                event.dataTransfer.setData("text", this.id);
                currentDragged = this;
            });

            item.addEventListener("dragend", function(event) {
                this.style.borderWidth = "0";
            });
        }

        let candrop = 0;
        let targets = document.querySelectorAll(".drag-target");
        for (let target of targets) {
            const index = parseInt(target.id.split('-')[2]);
            target.dataset.row = Math.floor((index - 1) / 4);
            target.dataset.col = (index - 1) % 4;
            target.addEventListener("dragenter", function (event) {
                if (currentDragged && currentDragged.dataset.row == this.dataset.row && currentDragged.dataset.col == this.dataset.col) {
                    this.style.border = "2px solid #7FE9D9";
                    candrop = 1;
                } else {
                    this.style.border = "2px dashed #E97F7F";
                    candrop = 0;
                }
            });
            target.addEventListener("dragleave", function (event) {
                this.style.border = "2px dashed #7f7fe9";
            });
            target.addEventListener("dragover", function (event) {
                event.preventDefault();
            });


            target.addEventListener("drop", function (event) {
                if (candrop === 0) {
                    this.style.border = "2px dashed #7f7fe9";
                    return;
                }
                let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
                if (!placedPieces.has(myElement.id)) {
                    placedPieces.add(myElement.id);
                    dropedCounter = placedPieces.size;
                }
                animateToTarget(myElement, this);
                this.style.border = "2px dashed #7f7fe9";
                //console.log(dropedCounter);
            }, false);
            
        }