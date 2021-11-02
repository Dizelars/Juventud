'use strict'

/*
 * Плагин CodeMirror 5
 */
import '../css/admin.scss'

document.addEventListener("DOMContentLoaded", ready);
function ready() {
    /*Плагин CodeMirror 5*/
    const textareaContent = document.querySelectorAll('' +
        'textarea#wpcf7-form,' +
        'div[data-name="rg-footer-custom-code"] textarea');
    textareaContent.forEach(function(el) {
        if (el){
            let myCodeMirror = CodeMirror.fromTextArea(el,{
                mode: "text/html",
                lineNumbers: true,
                lineWrapping: true,
                theme: 'base16-dark',
                matchBrackets: true,
            });
        }
    });
}