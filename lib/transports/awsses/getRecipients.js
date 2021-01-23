var assign = require('object-assign');

var processAddress = require('../../util/processAddress');

function getRecipients(to) {
    var recipients = [];
    (Array.isArray(to) ? to : [to]).forEach(function (i) {
        var rcpt = processAddress(i);
        if (!rcpt.email) return;
        recipients.push(rcpt.email);
    });

    return recipients;
};

module.exports = getRecipients;
