/**
 * Created by doremonsun on 4/25/17.
 */
const Nightmare = require('nightmare')
const nightmare = Nightmare({show: true})
const fs = require('fs')
const entities = require("entities");
const address = 'http://emojipedia.org/flags/'
nightmare
    .goto(address)
    .evaluate(function () {
        let nodeList = document.querySelectorAll('.content .emoji-list li ');
        let result = [];
        for (let i = 0; i < nodeList.length; i++) {
            let selector = nodeList[i];
            let title = selector.firstElementChild.childNodes[1].textContent
            let content = selector.firstElementChild.childNodes[0].innerHTML
            result.push({title: title, content: content})
        }
        return result;
    })
    .end()
    .then(function (result) {
        let file = fs.createWriteStream('../data/flags.html');
        file.on('error', function (err) {
            console.error(err.message);
        });
        result.forEach(function (item) {
                file.write('<span class="emoticon" title="' + item.title + '"> '
                    + entities.encodeHTML(item.content) + ' </span>' + '\n');
            }
        );
        file.end();
    })
    .catch(function (error) {
        console.error(error.message);
    });
