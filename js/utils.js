function trim(value, length) {
    return value.length > length
        ? value.substring(0, length - 3) + "..."
        : value;
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

String.prototype.toMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var minutes = Math.floor(sec_num / 60);
    var seconds = sec_num - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}

Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};

function checkEmptyCover(image, title) {
    const imageLocal = ko.unwrap(image); // We don't know if it's observable or not
    const titleLocal = ko.unwrap(title);
    return imageLocal || `https://api.adorable.io/avatars/180/${titleLocal}.png`;
}

function checkEmptyArtist(image, name) {
    const imageLocal = ko.unwrap(image); // We don't know if it's observable or not
    const nameLocal = ko.unwrap(name);
    return imageLocal || `https://api.adorable.io/avatars/180/${nameLocal}.png`;
}

function showLoader() {
    var blurDiv = document.createElement("div");
    blurDiv.id = "blurDiv";
    blurDiv.style.cssText = "position:absolute; top:0; right:0; width:" + screen.width + "px; height:" + screen.height + "px; background-color: #000000; opacity:0.5; filter:alpha(opacity=50)";
 
    document.getElementsByTagName("body")[0].appendChild(blurDiv);
    $('.loader').show();
}

function hideLoader() {
    var blurDiv = document.getElementById("blurDiv");
    blurDiv.parentNode.removeChild(blurDiv);
    $('.loader').hide();
}