function ch() {
    var div = document.getElementById('1');
    if (this.checked)
        div.style.display = 'flex';
    else
        div.style.display = 'none'
}


document.getElementById('checkbox-id').onchange = ch;
