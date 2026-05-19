/* web/_FRAMEWORK_WP/wp-content/uploads/common/wlmd-intake-func-v4.6.js
APPLY DIRECTIVES FOR JOTFORM.
 */
/* uniformly control debug output */

const wid_key = {
    'fname': 'fullName[first]',
    'lname': 'fullName[last]',
    'email': 'email',
    'phone': 'phoneNumber[full]',
    'shipping_state': 'usState',
    'address': 'address', /* address is array with addr_line1, etc */
    'zip': 'zipcode'
};

const non_default_fields = [
    'formID',
    'jsExecutionTracker',
    'submitSource',
    'buildDate',
    'tracking_unid',
    '__parentURL',
    'rootdomain',
    'today[month]',
    'today[day]',
    'today[year]',
    'age',
    'calculation',
    'simple_spc',
    'uniqueId'
];

window.userStartedFilling = false;
window.max_step = 0;
window.recordQueue = {};
window.trackingInfo = {
    "loop": 0,
    "ready": 0,
    "started": 0,
    "finished": 0,
    "codeset": 0, // when dynamicly set this goes to 1
    "unid": "",
};

function goToCheckout(sku) {
    var data = getStoredWID();
    if(!data) {
        data = {};
    }
    const steps = getVariable('steps');
    var urlParams = new URLSearchParams(window.location.search); //get all parameters
    let unid = urlParams.get("uniqueId");
    if(unid) {
        setWID('uniqueId',unid);
        data['uniqueId'] = unid;
    }
    data['product'] = sku;
    proceedToCheckout(steps.checkout, data);
    console.log('ran proceedToCheckout');
}

function addUrlWidKeys() {
    var mydata = parseQueryString(window.location.search); //get all parameters
    //console.log(urlParams);
    for(var key in wid_key) {
        let fieldname = wid_key[key];
        let fieldvalue = datapointInArray(fieldname,mydata);
        //console.log('check key ' + key + ",fieldName:" + fieldname + " , = " + JSON.stringify(fieldvalue));
        if(fieldvalue) {
            elog('add from urlParams: ' + fieldname + '=' + fieldvalue);
            let jsonData = {
                "unid": window.trackingInfo['unid'],
                "name": fieldname,
                "q_name": fieldname+"^url",
                "value": fieldvalue,
                "max_step": window.max_step??1,
                "url": window.location.href
            };
            setWID(jsonData['name'], formatValueWID(jsonData['name'], jsonData['value']));
            addToRecordQueue(jsonData['q_name'],jsonData);
        }
    }
}

/**
 * Parses a URL search string and converts it to a nested object
 * Handles bracket notation for nested objects and arrays
 *
 * Examples:
 * - "name=John&age=30" → { name: "John", age: "30" }
 * - "address[city]=NYC&address[state]=NY" → { address: { city: "NYC", state: "NY" } }
 * - "tags[0]=web&tags[1]=dev" → { tags: ["web", "dev"] }
 * - "user[profile][name]=John&user[profile][age]=30" → { user: { profile: { name: "John", age: "30" } } }
 *
 * @param {string} searchString - URL search string (with or without leading ?)
 * @returns {object} Parsed object with nested structure
 */
function parseQueryString(searchString) {
    // Remove leading ? if present
    const cleanString = searchString.replace(/^\?/, '');
    // Return empty object if no query string
    if (!cleanString) {
        return {};
    }
    const result = {};
    // Split into key-value pairs
    const pairs = cleanString.split('&');
    pairs.forEach(pair => {
        // Split on first = only (values might contain =)
        const equalIndex = pair.indexOf('=');
        if (equalIndex === -1) {
            // Handle keys without values (treat as empty string)
            const key = decodeURIComponent(pair);
            setNestedValue(result, key, '');
            return;
        }
        const key = decodeURIComponent(pair.substring(0, equalIndex));
        const value = decodeURIComponent(pair.substring(equalIndex + 1));
        setNestedValue(result, key, value);
    });
    return result;
}

/**
 * Sets a nested value in an object using bracket notation
 * @param {object} obj - Target object
 * @param {string} key - Key with possible bracket notation
 * @param {string} value - Value to set
 */
function setNestedValue(obj, key, value) {
    // Parse the key to extract path segments
    const segments = parseKey(key);
    let current = obj;
    // Navigate/create nested structure
    for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];
        const nextSegment = segments[i + 1];

        // Determine if next level should be array or object
        const isNextArray = /^\d+$/.test(nextSegment);

        if (!(segment in current)) {
            // Create new level
            current[segment] = isNextArray ? [] : {};
        } else if (isNextArray && !Array.isArray(current[segment])) {
            // Convert existing object to array if needed
            current[segment] = [];
        } else if (!isNextArray && Array.isArray(current[segment])) {
            // Convert existing array to object if needed
            current[segment] = {};
        }
        current = current[segment];
    }
    // Set the final value
    const lastSegment = segments[segments.length - 1];
    if (Array.isArray(current)) {
        const index = parseInt(lastSegment, 10);
        current[index] = value;
    } else {
        current[lastSegment] = value;
    }
}

/**
 * Parses a key with bracket notation into segments
 * @param {string} key - Key like "address[city]" or "tags[0]"
 * @returns {string[]} Array of key segments
 */
function parseKey(key) {
    const segments = [];
    let current = '';
    let inBrackets = false;
    for (let i = 0; i < key.length; i++) {
        const char = key[i];
        if (char === '[') {
            if (current) {
                segments.push(current);
                current = '';
            }
            inBrackets = true;
        } else if (char === ']') {
            if (current || inBrackets) {
                segments.push(current);
                current = '';
            }
            inBrackets = false;
        } else {
            current += char;
        }
    }
    if (current) {
        segments.push(current);
    }
    return segments;
}
function datapointInArray(nkey,data) {
    //console.log('dpia:',nkey,data);
    const pkey = parseKey(nkey);
    if(pkey.length === 1) {
        return data[nkey]??"";
    } else if(pkey.length > 1) {
        return datapointInArray(pkey[1],data[pkey[0]]??[]);
    } else {
        console.warn('datapointInArray:');
        console.warn('nkey',nkey,'pkey',pkey);
        return "";
    }
}

// function addUrlWidKeys() {
//     var urlParams = new URLSearchParams(window.location.search); //get all parameters
//     //console.log(urlParams);
//     for(var key in wid_key) {
//         let fieldname = wid_key[key];
//         let fieldvalue = urlParams.get(fieldname);
//         //console.log('check key ' + key + ",fieldName:" + fieldname + " , = " + fieldvalue);
//         if(fieldvalue) {
//             elog('add from urlParams: ' + fieldname + '=' + fieldvalue);
//             let jsonData = {
//                 "unid": window.trackingInfo['unid'],
//                 "name": fieldname,
//                 "q_name": fieldname+"^url",
//                 "value": fieldvalue,
//                 "max_step": window.max_step??1,
//                 "url": window.location.href
//             };
//
//             setWID(jsonData['name'], formatValueWID(jsonData['name'], jsonData['value']));
//             addToRecordQueue(jsonData['q_name'],jsonData);
//        }
//     }
// }


function checkDebug() {
    if(window.be_quiet === false) { // if it exists and is false, always debug
        return true;
    }
    if(window.checkDebugValue === false) {
        return false;
    } else if(window.checkDebugValue) {
        return true;
    }
    const search = new URLSearchParams(window.location.search);
    if( search.get("elog") === "1" ) {
        window.checkDebugValue = true;
    } else {
        window.checkDebugValue = false;
    }
    return window.checkDebugValue;
}
function elog(message,force) {
    if(force) {
        console.log(message);
        return;
    }
    if(checkDebug()) {
        console.log(message);
    }
}

// setter/getter for session data container
function getStoredWID() {
    if(window.WlmdIntakeData) {
        return window.WlmdIntakeData;
    }
    var tmp = {};

    try {
        tmp = JSON.parse(getCookie('WlmdIntakeData'));
    } catch(e) {
        tmp = {};
        //console.warn('parsing cookie ' + getCookie('WlmdIntakeData'));
    }
    //alert(tmp);
    if(!tmp) {
        tmp = {};
    }
    window.WlmdIntakeData=tmp;
    return tmp;
}
function setWID(key,value) {
    if(!key) {
        return;
    }
    var data = getStoredWID();
    if(!data) {
        data = {};
    }
    data[key] = value;
    if(Array.isArray(value)) {
        let tmp = JSON.stringify(value);
        if(tmp.length > 120) {
            data[key] = "[long array]";
        }
    } else {
        if (value.length > 120) {
            data[key] = value.substring(0, 120);
        }
    }
    if(key == "forced_unid") {
        elog('setWID forced_unid:' + value);
        data['uniqueId'] = value;
    }
    setCookie('WlmdIntakeData',JSON.stringify(data),1);
}
function getWID(key) {
    data = getStoredWID();
    //elog('getWid ' + key + ', stored:');
    // elog(data);
    // if(key == 'email') {
    //     alert(JSON.stringify(data));
    // }
    if(!data) {
        console.log('no WlmdIntakeData');
        return "";
    }
    return data[key]??data['__' + key]??"";

}

function showIntakeFormModal() {
    // Get the modal
    var modal = document.getElementById("myModal-mdl");
    // modal.style.display = "block";
    modal.style.transform = "translateY(0px)";
    modal.style.opacity = "1";
    //modal.style.height="auto";
    document.getElementById("intake_placement").style.height="auto";
    document.getElementById("myModal-mdl").style.height="100%";
    document.getElementsByTagName("body")[0].classList.add("ovhidden");
}
function showIntakeFormInline(smooth=true) {
    var hiddenForm = document.querySelector('.hidden-form');
    try {
        hiddenForm.style.display = 'block';

        if(smooth) {
            //console.log('scrollIntoView smooth');
            hiddenForm.scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            //console.log('scrollIntoView regular');

            hiddenForm.scrollIntoView({});
        }
    } catch(e) {
        console.warn('hidden-form scrollIntoView error', e);
    }
}

function closeFormModal() {
    const span = document.getElementsByClassName("close-mdl")[0];
    const modal = document.getElementById('myModal-mdl');
    const body = document.getElementsByTagName('body')[0];
    if(span) {
        elog('add the closeFormModal ...');
        span.onclick = function() {
            //modal.style.opacity = "0";
            modal.style.height="0px;";
            modal.style.transform = "translateY(-2999px)";
            body.classList.remove("ovhidden");
        }
    }
}
function closeFormInline() {
    return closeFormModal();
}

/* should this page attempt to autopop/launch? */
function isLaunchOp () {
    var rv = false;
    var step;
    var urlParams = new URLSearchParams(window.location.search); //get all parameters
    var operation = operationToRun();

    if(operation === "startintake") {
        step = 1;
    } else if(operation === "step_3" || operation === "products" || operation === "reselect") {
        step = 3;
    } else if(operation === "step_2") {
        step = 2;
    } else if(operation === "step_1") {
        step = 1;
    }
    //elog('step: ' + step);
    if(urlParams.get("product")) {
        setWID('product',urlParams.get("product"));
    }

    if(!step) {
        step = urlParams.get("step"); //extract the step parameter - this will return NULL if step isnt a parameter
    }
    if (step && (parseInt(step) > 0) ) {
        rv = true;
    }
    return rv;
}
function makeRandString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
function getEverflowTrackingCookie() {
    return getCookie('efcid');
}
function getTrackingCookie() {
    return getCookie('wlmd_tracking_unid');
}
function forceTrackingCookie(newval) {
    if( ! newval) {
        newval = makeRandString(10);
    }
    wlmdSetCookie('wlmd_tracking_unid', newval, 1); // fairly short cookie.
    return newval;
}

function clickTrackingOperations() {
    window.trackingInfo['loop']++;
    elog('START clickTrackingOperations loop ' + window.trackingInfo['loop']);

    // console.log('trackingInfo',window.trackingInfo,"end");
    //elog('clickTrackingOperations3');

    if((window.trackingInfo['loop'] > 15) || (typeof window.tracking_ready !== "function")) {
        window.trackingInfo['finished'] = 1;
        tracking_start();
        window.trackingInfo['unid'] = forceTrackingCookie(false);
        window.trackingInfo['codeset'] = 1;
        //window.trackingCode = trackingInfo['unid'];
        //window.hasTrackingCode = true;
        elog('clickTrackingOperations loop>15. stop trying');
        return;
    }
    elog('clickTrackingOperations cont. loop ' + window.trackingInfo['loop']);

    if(window.trackingInfo['started']) {
        elog('--ti-started');
        if(window.trackingInfo['finished'] || tracking_finished()) {
            elog('--ti-FINISHED, so wrap it up and forceTrackingCookie');
            window.trackingInfo['finished']=1;
            // trackingInfo['unid']="ddd"
            window.trackingInfo['codeset'] = 1;
            forceTrackingCookie(window.trackingInfo['unid']); // fairly short cookie.
            return;
            //window.trackingCode = trackingInfo['unid'];
            //window.hasTrackingCode = true;
        }
    } else if(window.trackingInfo['ready'] || tracking_ready()) {
        elog('--ti-ready');
        window.trackingInfo['ready'] = 1;
        tracking_start();
        window.trackingInfo['started'] = 1;
    }
    elog('ctop-loop ' + window.trackingInfo['loop']);
    setTimeout(clickTrackingOperations,200);

}

function tracking_finished() {
    if(window.trackingInfo['unid']) {
        return true;
    }
    return false;
}

function updateJotform_when_ready() {
    try {
        clearTimeout(window.ujsto);
    } catch (e) {
        // noop
    }

    if (!window.trackingInfo['codeset']) {
        //elog("..updateJotform_when_ready - not codeset yet. retry");
        //console.log(window.trackingInfo);
        window.ujsto = setTimeout(updateJotform_when_ready, 200);
    } else if (!window.jotformIsReady) {
        elog("..updateJotform_when_ready - !jotformIsReady. retry");
        window.ujsto = setTimeout(updateJotform_when_ready, 200);
    } else if (!window.jotform_id) {
        elog("..updateJotform_when_ready - no jotform_id yet. retry");
        window.ujsto = setTimeout(updateJotform_when_ready, 200);
    } else {
        elog("updateJotform_when_ready - codeset && jotformIsReady - JOTFORM_ID:" + window.jotform_id);
        updateJotform(window.jotform_id, window.trackingInfo['unid']);
        pollJotform();
        handleJotformReadyCustomFunction();
    }
}

function handleJotformReadyCustomFunction() {
    if(typeof window.custom_form_ready === "function") {
        return custom_form_ready();
    } else {
        console.log("No custom_form_ready found");
    }
}

function isJotformLoaded() {
    //var form_element_id = "JotformIframe-" + window.jotform_id;
    var form_element_id = window.jotform_id;
    var elem = document.getElementById(form_element_id);
    if(!elem) {
        elog('isJotformLoaded: no elem found with id ' + form_element_id);
        return false;
    }
    if(elem.style.height === "1px") {
        elog('isJotformLoaded: height 1px');
        return false;
    }
    return true;
}

function pollJotform() {
    try {
        clearTimeout(window.pjsto);
    } catch (e) {
        // noop
    }
    var answer = isJotformLoaded();
    if(answer) {
        elog('jotform IS loaded.');
    } else {
        elog("pollJotform gave false, retry in 1s");
        window.pjsto = setTimeout(pollJotform, 1000);
    }
}

function uniqueIdFieldOfIframe(ifr) {
    return fieldOfIFrame("uniqueId",ifr);
}
function callerFieldOfIframe(ifr) {
    var ret = fieldOfIFrame("__caller",ifr);
    if(ret) {
        return ret;
    }
    ret = fieldOfIFrame("caller_page",ifr);
    return ret;
}
function forcedUniqueIdFieldOfIframe(ifr) {
    return fieldOfIFrame("forced_unid",ifr);
}
function trackingFieldOfIframe(ifr) {
    return fieldOfIFrame("tracking_unid",ifr);
}
function trackingArgsFieldOfIframe(ifr) {
    return fieldOfIFrame("__tracking_args",ifr);
}


function fieldOfIFrame(name_ends, ifr) {
    //var ifr = window.IFR;
    var ifrDoc = ifr.contentDocument || ifr.contentWindow.document;
    if(!ifrDoc) {
        elog('ERROR no ifr.contentDocument?',1);
        return;
    }
    var theForm = ifrDoc.forms[0];
    if(!theForm) {
        elog('ERROR! in trackingFieldOfIframe, no ifrDoc.forms[0]',1);
        return null;
    }
    var elem = returnElementEndingIn(theForm, name_ends );
    if(elem) {
        return elem;
    }

    elog("didnt find " + name_ends + ", returning null.");
    return null;
}

function updateJotform(jotform_id, unid) {

    var iframe_id = jotform_id;

    var ifr = window.document.getElementById(iframe_id);
    elog("updateJotform(" + jotform_id + ")");

    if( (ifr === null) || (typeof ifr !== "object") ) {
        console.error("No ifr object found in updateJotform. This should NEVER happen.");
        return;
    }
    window.jotform_id = jotform_id;
    elog('Now Setting in updateJotform:' + window.jotform_id);
    ifr.sandbox = "allow-forms allow-popups allow-scripts allow-top-navigation allow-same-origin";
    window.IFR=ifr;
    //alert('DONE WITH updateJotform');
    setupIntakeTracking();
}

function setupIntakeTracking() {
    var ifr = window.IFR;
    elog('setupIntakeTracking()');
    if(!window.trackingInfo['codeset']) {
        elog('sit.not codeset yet',1);
        return setTimeout(setupIntakeTracking,100);

    }
    var ifrDoc = ifr.contentDocument || ifr.contentWindow.document;
    if(!ifrDoc) {
        elog('ERROR no ifr.contentDocument?',1);
        return;
    }
    var theForm = ifrDoc.forms[0];
    if(!theForm) {
        elog('woah! no ifrDoc.forms[0]',0);
        return setTimeout(setupIntakeTracking,500);
    }
    // functional start here:
    if(window.trackingInfo['codeset']) { // this really should be true.
        elog("sit.set UNID=" + window.trackingInfo['unid']);
        addToRecordQueue('unid', window.trackingInfo['unid']);
        try {
            trackingFieldOfIframe(ifr).value = window.trackingInfo['unid'];
        } catch(e) {
            try {
                uniqueIdFieldOfIframe(ifr).value = window.trackingInfo['unid'];
                console.warn("using uniqueIdFieldOfIframe, trackingFieldOfIframe not found.");
            } catch(e) {
                console.warn("trackingFieldOfIframe not found?");
            }
        }
        try { callerFieldOfIframe(ifr).value = urlNoHash(); } catch(e) { console.warn('no caller field'); }

        if(typeof(window.checkoutTrackingStringSite) == 'function') {
            const myname='checkoutTrackingStringSite';
            const myvalue = checkoutTrackingStringSite();
            addToRecordQueue(myname,myvalue);
            try {
                trackingArgsFieldOfIframe(ifr).value = myvalue;
                setWID(myname, myvalue);
                elog(myname + "=" + myvalue + " set in trackArgs field");
            } catch(e) {
                console.warn(e);
            }

        }
    }

    var urlParams = new URLSearchParams(window.location.search); //get all parameters
    var tuid = urlParams.get("uniqueId");
    if(tuid) {
        elog('set order-gen-uid:' + tuid, 1);
        window.forced_uniqueId = tuid;
    } else {
        //elog('NO urlParams.get(uniqueId)',1);
        //console.log(urlParams);
    }

    var tmpfield=null;
    if(window.forced_uniqueId) {
        elog("sit.FORCE unid to " + window.forced_uniqueId,1);

        tmpfield = forcedUniqueIdFieldOfIframe(ifr);
        if(tmpfield) {
            console.log('found forcedField');
            tmpfield.value = window.forced_uniqueId;
        } else {
            console.log('DID NOT found forcedField');
        }
        tmpfield = uniqueIdFieldOfIframe(ifr);
        if(tmpfield) {
            tmpfield.value = window.forced_uniqueId;
            console.log('found unid Field and set to jotform uniqueId field to ' + window.forced_uniqueId);
        } else {
            console.log('DID NOT found unid Field in jotform');
        }

    }
    activateFormEvents(ifr);
    if(window.page_presets) {
        for (const key in window.page_presets) {
            elog('setting page_preset ' + key + '=' + page_presets[key]);
            setJotformField(key, page_presets[key]);
        }
    }
    elog("setupIntakeTracking finished");
}

function urlNoHash() {
    const w = window.location;
    return w.origin + w.pathname + w.search;
}

function returnElementByName(form, name) {
    var elems = form.elements;
    var element;
    for( element of elems) {
        if(element.name === name) {
            return element;
        }
    }
    return null;
}
function returnElementEndingIn(form, ending) {
    var elems = form.elements; //getElements();
    var element;
    var i1,i2;

    for( element of elems) {
        i2 = element.name.length;
        i1 = i2 - ending.length;
        if(element.name.toString().substring(i1,i2) === ending) {
            return element;
        }
    }
    return null;
}

async function logIntakeCompletion(data) {

    const url = 'https://api.whitelabelmd.com/webhook/intake-completed-px/' + directives['site_id'] + '/';


    const rv = await postData(url, data).then((data) => {
        elog(data);
        if(data['status'] == "success" || data['status'] == "OK") {
            // ok
        } else {
            console.warn('log failure: ' + JSON.stringify(data));
            return false;
        }
        return true;
    });
    return rv;
}

async function postData(url = "", data = {}, more_headers= {}) {
    // Default options are marked with *
    more_headers['Content-Type'] = "application/json";
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: more_headers,
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}


function formatValueWID(name, value) {
    if(name === "usState" || name === "state") {
        value = returnStateCode(value);
    } else if(name === "phone" || name === "phoneNumber") {
        value = value.replace(/\D/g,'');

    }
    return value;
}


function betterName(origName) {
    // elog('betterName ' + origName)
    const qname_regex = /^q[0-9]+_(.*)$/;
    const MATCHES = origName.match(qname_regex);
    if(MATCHES && (MATCHES.length > 1) && MATCHES[1]) {
        return MATCHES[1];
    } else {
        return origName;
    }
}


// function questionsByName() {
//     var ifr = window.IFR;
//     if(!window.formQuestionsByName) {
//         var tmp = ifr.contentDocument.getElementsByTagName("form")[0].elements;
//         var better = "";
//         window.formQuestionsByName = {};
//         for(var q in tmp) {
//             better = betterName(q.name);
//             if(!better) {
//                 elog('QWN-no betterName from q:' + q.name);
//             }
//             if(!window.formQuestionsByName[betterName]) {
//                 window.formQuestionsByName[betterName] = [];
//                 window.formQuestionsByName[betterName].push(tmp);
//             }
//         }
//     }
//     return window.formQuestionsByName;
//
// }

function setJotformField(name, value) {
    var field = fieldOfIFrame(name, window.IFR);
    if(field) { field.value = value; }
    //alert(field);
}


function makeListenerField(name_type) { // you can just pass the raw name.
    elog('makeListenerField(' + name_type + ')');
    const myArray = name_type.split(".");
    const origName = myArray[0];
    if(!origName) {
        return;
    }
    const fieldName = betterName(origName);

    if(myArray.length === 1) {
        myArray[1] = "change";
        if ( (fieldName === "phoneNumber[full]") || (fieldName === "phoneNumber")) {
            elog('fieldName ' + fieldName + ' , so blur event');
            myArray[1] = "blur";
        }
    } else {
        elog('passed in change type on ' + name_type + ': ' + myArray[1]);
    }
    const eventName = myArray[1];

    const FIELDS = document.getElementById(window.jotform_id).contentDocument.querySelectorAll('[name="' + origName + '"]');

    if(!FIELDS || !FIELDS[0]) {
        console.log('makeListener, no field for ' + name_type);
    }

    var skip_field_prepends = [
        "__timer",
        "__next"
    ];
    for(var formField of FIELDS) {
        //elog(fieldName + ': ' + formField.name + '(' + formField.id + ')');
        recordDefaultValue(formField, fieldName);
        formField.addEventListener(eventName, function () {
            const bettername = fieldName;

            for (let i = 0; i < skip_field_prepends.length; i++) {
                let matchval = skip_field_prepends[i];
                if(bettername.substring(0,matchval.length) == matchval) {
                    //elog('EH--SKIP on ' + bettername);
                    return false;
                } else {
                    //elog( 'EH--not skip on ' + bettername + ' vs ' + matchval);
                }
            }

            elog('-- event ' + eventName + ' found on ' + bettername);
            if (this.value && this.value !== "0") {
                window.userStartedFilling = true;
            } else if (window.userStartedFilling) {
                // ok
            } else {
                return false;
            }

            if (!window.directives || !window.directives['flag_record_wlmd_leads']) {
                elog("No flag_record_wlmd_leads");
                return false;
            }
            if (!window.directives['site_id']) {
                console.warn('NO WLMD_SITE_ID?');
                return false;
            }
            var value = this.value;
            if(this.type == "checkbox" && !this.checked) {
                value = "";
            }
            const jsonData = {
                "unid": window.trackingInfo['unid'],
                "name": bettername,
                "q_name": this.name+"^"+this.id,
                "value": value,
                "max_step": window.max_step,
                "url": window.location.href
            };

            setWID(jsonData['name'], formatValueWID(jsonData['name'], jsonData['value']));

            if (!jsonData['value'] && !(window.started_filling)) {
                elog("No value for " + bettername + " so no record");
                return false;
            }

            window.started_filling = true;
            addToRecordQueue(jsonData['q_name'],jsonData);
        });
    }
}
function recordDefaultValue(formField, bettername) {
    if (!window.directives || !window.directives['flag_record_wlmd_leads']) {
        elog("recordDefaultValue - No flag_record_wlmd_leads");
        return false;
    }
    if (!window.directives['site_id']) {
        console.warn('recordDefaultValue - NO WLMD_SITE_ID?');
        return false;
    }
    if(non_default_fields.includes(bettername)) {
        //console.log("skip non_default_field " + bettername);
        return false;
    }

    var value = formField.value;
    if(formField.type == "checkbox" && !formField.checked) {
        value = "";
    }
    if(formField.type == "radio" && !formField.checked) {
        value = "";
    }
    if(!value) {
        return false;
    }
    elog('RDV: ' + bettername + ', ' + formField.type + ' => ' + value);
    elog(formField);

    const jsonData = {
        "unid": window.trackingInfo['unid'],
        "name": bettername,

        "q_name": "" + formField.name+"^_default-"+formField.id,
        "value": value,
        "max_step": 0,
        "url": window.location.href
    };
    var extv = getWID(jsonData['name']);
    if(extv !== formatValueWID(jsonData['name'], jsonData['value'])) {
        setWID(jsonData['name'], formatValueWID(jsonData['name'], jsonData['value']));
        addToRecordQueue(jsonData['q_name'],jsonData);
        elog('added default with ' + JSON.stringify(jsonData));
    } else {
        elog('SKIP logging default ' + jsonData['name'] + ', matching extv ' + extv);
    }
}

function addToRecordQueue(key,value) {
    window.recordQueue[key] = value;
}

function postQueuedData() {
    if(!window.directives || !window.directives['site_id']) return false;
    var url = 'https://api.whitelabelmd.com/webhook/form-fill/' + window.directives['site_id'] + '/' + window.jotform_id + '/';
    const records = [];
    const tmp = JSON.parse(JSON.stringify(window.recordQueue));
    for(var key in tmp) {
        elog("--pushing recordQueue " + key + ": " + JSON.stringify(window.recordQueue[key]));
        records.push(window.recordQueue[key]);
        delete(window.recordQueue[key]);
    }
    if(records.length) {
        elog('postData ' + records.length + ' records to url=' + url);
        postData(url, records).then((data) => {
            if(data['status'] == "success" || data['status'] == "OK") {
                // ok
            } else {
                console.warn('log failure: ' + JSON.stringify(data));
                return false;
            }
            return true;
        });
    } else {
        elog('no push no records');
    }
}

setInterval(postQueuedData,1000);

function returnStateCode(string) {
    const regex = /\b[A-Z][A-Z]\b/g;
    const found = string.match(regex);
    if(found) {
        return found[0];
    }
    return string;
}
function isHidden(el) {
    var style = window.getComputedStyle(el);
    //return (style.display === 'none')
    return (el.offsetParent === null) || (style.display === 'none')
}
function pad(num, size) {
    num = num.toString();
    while (num.length < size) {

        num = "0" + num;
    }
    return num;
}


function questionText(elem, step) {
    var text;
    if(elem.closest("jfCard-question")) {
        text = questionTextCardStyle(elem,step);
    } else {
        text = questionTextFormStyle(elem,step);
    }
    text = pad(step,2) +': ' + text.trim();
    elog('questionText returns: ' + text);
    return text;
}

function questionTextCardStyle(elem,step) {
    var text ='';
    var spot = elem.closest("jfCard-question");
    var labels = spot.getElementsByTagName('label');

    for (var question of labels) {
        if(isHidden(question)) {
            //elog('hidden part');
        } else {
            text += question.innerText + " ";
        }
    }
    labels = spot.getElementsByTagName('p');
    for (var question of labels) {
        if(!isHidden(question)) {
            text += question.innerText + " ";
        }
    }
    labels = spot.getElementsByTagName('span');
    for (var question of labels) {
        if(!isHidden(question)) {
            text += question.innerText + " ";
        }
    }
    return text;
}

function questionTextFormStyle(elem, step) {
    var text = '';
    var spot = elem.closest(".form-section");
    var labels = spot.getElementsByTagName('label');

    for (var question of labels) {
        if(!isHidden(question)) {
            text += question.innerText + " ";
        }
    }
    labels = spot.getElementsByTagName('span');
    for (var question of labels) {
        if(!isHidden(question)) {
            text += question.innerText + " ";
        }
    }
    return text;
}

function resetQuestionTimer() {
    window.QuestionTime = Date.now();
}
function questionTimer() {
    return (Date.now() - window.QuestionTime);
}


function trackButtonClick(jsForm, mystep, totalsteps, action) {
    var anon = function () {
        // declaring the number of erros on the page

        window.ExploreElement = this;
        var numOfErrors = jsForm.contentDocument.getElementsByClassName('form-error-message').length;
        var params = {
            //'part': window.mystage,
            'my_step': mystep,
            'total_steps': totalsteps,
            'question': questionText(this, mystep),
            'time_on': questionTimer(),
            'status':'init',
            'action': 'next'
        };

        if (numOfErrors !== 0) {
            elog(`${action} button on page ${mystep} was clicked but there were ${numOfErrors} error(s) on the page so the user couldn't proceed.`)
            params['status'] = 'error';
            callGA(params);
        } else {
            elog(`${action} button on page ${mystep} was clicked and the user proceeded successfully`)
            params['status'] = 'success';
            if(mystep > window.max_step) {
                window.max_step = mystep;
            }
            callGA(params);
            if(window.custom_step_tracking) { custom_step_tracking(params); }

            resetQuestionTimer();
        }
    };

    return anon;
}

function activateFormEvents(jsForm) {
    // declaring the next, back and submit buttons
    var questions = jsForm.contentDocument.getElementsByTagName("form")[0].elements;
    var backButtons = jsForm.contentDocument.getElementsByClassName("form-pagebreak-back") //arr
    var nextButtons = jsForm.contentDocument.getElementsByClassName("form-pagebreak-next") //arr
    var nextCards = jsForm.contentDocument.getElementsByClassName("forNext");
    var submitButtons = jsForm.contentDocument.getElementsByClassName("form-submit-button") //arr

    var offset=0;
    // listening for next button clicks
    var totalSteps = nextButtons.length+submitButtons.length + nextCards.length+ 1;
    elog('totalSteps: ' + totalSteps);

    for (let i = 0; i < nextCards.length; i++) {
        nextCards[i].addEventListener("click",
            trackButtonClick(jsForm, offset+1, totalSteps,'next'),
            false);
        offset++;
    }
    elog('after nextCards, offset=' + offset);

    for (let i = 0; i < nextButtons.length; i++) {
        nextButtons[i].addEventListener("click",
            trackButtonClick(jsForm, offset+1, totalSteps,'next'),
            false);
        offset++;
    }
    elog('after nextButtons, offset=' + offset);
    // listening for submit  button clicks
    for (let i = 0; i < submitButtons.length; i++) {
        submitButtons[i].addEventListener("click",
            trackButtonClick(jsForm, offset+1, totalSteps,'submit'),
            false);
        offset++;
    }
    elog('after submitButtons, offset=' + offset);
    // listening for back button clicks
    for (let i = 0; i < backButtons.length; i++) {
        backButtons[i].addEventListener("click",
            trackButtonClick(jsForm, i+1, totalSteps,'back'),
            false);
    }
    elog('after backButtons(' + backButtons.length + '), offset=' + offset);

    resetQuestionTimer();
    if(window.directives && window.directives['site_id']) {
        // use site for a listener
        //var myArr = jsForm.contentDocument.getElementsByTagName("form")[0].elements
        if(!window.jotform_id) {
            window.jotform_id = getVariable("steps")['step_1']??"";
            elog("SET NEW window.jotform_id: " + window.jotform_id);
        }
        for (let i = 0; i < questions.length; i++) {
            try {
                if(questions[i].name) {
                    makeListenerField(questions[i].name);
                }
            } catch(e) {
                console.log('ERROR making question ' + i, questions[i]);
                console.error(e.message);
            }
        }
    } else {
        elog('no directives-site_id');
    }

}

function doPageFormOnload() {

    var iframe_id = window.jotform_id;
    var ifr = window.document.getElementById(iframe_id);
    elog('doPageFormOnload() called, ifr=' + ifr);
    if( (ifr === null) || (typeof ifr !== "object") ) {
        elog("doPageFormOnload: no ifr yet with id:" + iframe_id);

        window.LOOP_ATTEMPTS++;
        if(window.LOOP_ATTEMPTS > 100) {
            console.error("This page was never able to see id " + iframe_id + " and is giving up trying. Marking ready even though it actually probably failed.");
            window.jotformIsReady = true;
            return;
        } else {
            return setTimeout(doPageFormOnload, 200);
        }
    }
    elog("got pageform in doPageOnload: " + ifr);
    window.jotformIsReady = true;
}



function advanceForm(formId, data) {
    var value;
    var datastr = '';
    const form_server = window.directives['form_server']??'https://forms.whitelabelmd.com';
    const embed_prepend = window.directives['embed_add_args']??'';
    elog('advanceForm ' + formId);
    //alert(formId);
    for (var key in data) {
        value = data[key];
        if(key == "uniqueId" && window.forced_uniqueId) {
            value = window.forced_uniqueId;
        }
        datastr += '&' + escape(key) + '=' + escape(value);
    }
    window.jotform_id = formId;
    console.log(window.directives['embed_add_args']);

    var newSrc = `${form_server}/${formId}/?${embed_prepend}&domain=`
        + urlNoHash() + datastr;

    elog("advanceForm to next step newSrc: " + newSrc, 1);
    var parentElement = document.getElementById("intake_placement");
    var prior_iframe = parentElement.querySelector('iframe');

    var new_iframe = document.createElement('iframe');
    new_iframe.id = formId
    new_iframe.name = formId
    new_iframe.src = newSrc
    window.jotform_id = formId;

    parentElement.removeChild(prior_iframe);
    parentElement.appendChild(new_iframe);

    window.pageAdvanced = true;

    showIntakeForm(false);
}



function nextStep(formId,uniqueId) {
    const form_server = window.directives['form_server']??'https://forms.whitelabelmd.com';
    const embed_prepend = window.directives['embed_add_args']??'';

    var newSrc = `${form_server}/${formId}/?${embed_prepend}&domain=`
        + urlNoHash()
        + "&uniqueId=" + escape(uniqueId) + "&";
    elog("Advance to next step newSrc: " + newSrc, 1);
    var prior_iframe = document.getElementsByTagName("iframe")[0];
    var parentElement = document.getElementById("intake_placement");
    var new_iframe = document.createElement('iframe');
    new_iframe.id = formId
    new_iframe.name = formId
    new_iframe.src = newSrc
    window.jotform_id = formId;

    parentElement.removeChild(prior_iframe);
    parentElement.appendChild(new_iframe);

    window.pageAdvanced = true;

    showIntakeForm(false);
}

function removeAnyHash() {
    if(location.href.toString() !== "" ) {
        location.hash="";
    }
}

function autoProductStep(formId, data) {

    elog('autoProductStep ' + formId);
    elog(data);
    const product = data['product'];
    const domain = urlNoHash();
    const uniqueId = data['uniqueId'];
    if(!product) {
        console.warn("ERROR, no product in " + JSON.stringify(data));
    }
    /*
    $record = [
               'form_id' => $args['form_id'],
               'intake_id' => '',
               'tracking_unid' => $data['unid'],
               'url'   => $data['domain'],
               'q_name' => "submission",
               'name' => "submission",
               'value' => json_encode($data['submission']),
           ];
     */
    if(window.directives && window.directives['site_id']) {
        elog('postData url=' + url);
        const jsonData = {
            "unid": window.trackingInfo['unid'],
            "domain": domain,
            "submission": {
                "uniqueId":uniqueId,
                "domain":domain,
                "sku":product
            }
        };

        setWID(jsonData['name'],formatValueWID(jsonData['name'], jsonData['value']));

        elog('+++doing the post');
        var url = 'https://api.whitelabelmd.com/answers/' + window.wlmd_site_id + '/' + formId + '/submission';


        postData(url, [jsonData]).then((data) => {
            window.started_filling = true;
            elog(data); // JSON data parsed by `data.json()` call
            elog(response.json());
            return response.json();
        });

    } else {
        elog("WARNING: no wlmd_site_id? directives:",1);
        elog(window.directives,1);
    }
    //alert('about to allow checkout');
}


function calculateCheckoutUrl(LINKS,data) {
    var url;
    const product = data['product'];
    if(!product) {
        elog('NO LINKS[product] for ' + product);
        elog(LINKS);
        data['error_sku'] = "NO_SKU_PASSED";
        data['error_url'] = window.location.href;

        data['error'] = 'No product / sku passed to calculateCheckoutUrl';
        url = Object.values(LINKS)[0];
        console.warn('ERROR, no product passed. Error was logged and user sent to first available link: ' + url);
    } else if(LINKS[product]) {
        elog('LINKS[product]');
        elog(LINKS[product]);
        url = LINKS[product];
    } else {
        elog('NO LINKS[product] for ' + product);
        elog(LINKS);
        data['error_sku'] = product;
        data['error_url'] = window.location.href;

        data['error'] = 'No link for product ' + product;
        url = Object.values(LINKS)[0];
        console.warn('ERROR, checkout link is not set for sku ' + product + ', error was logged and user sent to first available link: ' + url);
        //return false;
    }
    if(!url) {
        elog("NO URL FROM LINKS:" + product);
        elog(LINKS);
    }
    elog(url + ', data=' + JSON.stringify(data));
    url = addArgsToCheckout(url,data);
    return url;
    //alert(url);
}

function calculateReceiptUrl(data) {

    const url = addArgsToOPU(window.directives['order_processing_url'],data);

    elog('calculateReceiptUrl AFTER REPLACE url=' + url);
    return url;
}

async function proceedToCheckout(LINKS,data) {
    url = calculateCheckoutUrl(LINKS,data);
    elog('calculateCheckoutUrl AFTER REPLACE url=' + url);
    data['next_step'] = 'checkout';
    data['next_url'] = url;
    const response = await logIntakeCompletion(data);
    //alert('proceedToCheckout GOT logIntake RESPONSE ' + JSON.stringify(response));
    window.location.href = url;
}

async function proceedToReceipt(data) {
    const url = calculateReceiptUrl(data);
    data['next_step'] = 'receipt';
    data['next_url'] = url;
    const response = await logIntakeCompletion(data);
    //alert('proceedToReceipt GOT RESPONSE ' + JSON.stringify(response));
    window.location.href = url;
}

function addArgsToCheckout(url,data) {
    elog('addArgsToCheckout fired');
    if(window.directives && window.directives['default_checkout_args']) {
        if(url.indexOf("?") >= 0) {
            url += "&" + window.directives['default_checkout_args'];
        } else {
            url += "?" + window.directives['default_checkout_args'];
        }
    }
    if(typeof window.checkoutTrackingString == 'function') {
        elog('--found checkoutTrackingString function.');
        const tracking_str = checkoutTrackingString();
        elog('checkoutTrackingString() returned ' + tracking_str);
        if(url.indexOf("?") >= 0) {
            url += '&' + tracking_str;
        } else {
            url += '?' + tracking_str;
        }
        elog('--added str ' + tracking_str + ', url is now ' + url);
    } else {
        elog('--NO checkoutTrackingString function found.');

    }
    const parts = window.top.location.href.split("#");
    var rpage = parts[0];
    url = url.replace("{product}",data['product']??"");
    url = url.replace("{uniqueId}",data['uniqueId']??"");
    url = url.replace("{cdata}",compiledUserdata(data));
    url = url.replace("{rpage}", escape(rpage));
    return url;
}

function compiledUserdata(ovrdata) {

    var  cstr = '';
    const mydata = {};
    for(var key in wid_key) {
        if( (typeof(ovrdata) !== "undefined")
            && (typeof ovrdata[key] !== "undefined")
            && ovrdata[key]
        ) {
            elog('key ' + key + ' in overdata:' + ovrdata[key] );
            mydata[key] = ovrdata[key];
        } else if(wid_key[key] && getWID(wid_key[key])) {
            mydata[key] = getWID(wid_key[key]);
            elog('key ' + key + ' in wid_key[key]' + mydata[key]);
        } else {
            elog('no, key ' + key);
            //elog(data);
        }
    }
    cstr = objectToQueryString(mydata);

    if(typeof window.siteAdditionalUserData == "function") {
        cstr += '&' + window.siteAdditionalUserData();
        elog('siteAdditional so cstr is now: ', JSON.stringify(cstr));
    }
    if(cstr) {
        // cstr = cstr.substring(0,cstr.length-1);
        return(btoa(cstr));
    }
    return '';
}

/**
 * Converts a nested object back to a query string with bracket notation
 * This is the reverse operation of parseQueryString
 *
 * Examples:
 * - { name: "John", age: "30" } → "name=John&age=30"
 * - { address: { city: "NYC", state: "NY" } } → "address[city]=NYC&address[state]=NY"
 * - { tags: ["web", "dev"] } → "tags[0]=web&tags[1]=dev"
 *
 * @param {object} obj - Object to serialize
 * @param {string} prefix - Internal prefix for recursion (leave empty for top-level)
 * @returns {string} Query string with bracket notation
 */
function objectToQueryString(obj, prefix = '') {
    const pairs = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const encodedKey = prefix ?
                `${prefix}[${encodeURIComponent(key)}]` :
                encodeURIComponent(key);

            if (value === null || value === undefined) {
                // Skip null/undefined values
                continue;
            } else if (Array.isArray(value)) {
                // Handle arrays
                value.forEach((item, index) => {
                    const arrayKey = `${encodedKey}[${index}]`;
                    if (typeof item === 'object' && item !== null) {
                        pairs.push(objectToQueryString(item, arrayKey));
                    } else {
                        pairs.push(`${arrayKey}=${encodeURIComponent(String(item))}`);
                    }
                });
            } else if (typeof value === 'object') {
                // Handle nested objects
                pairs.push(objectToQueryString(value, encodedKey));
            } else {
                // Handle primitive values
                pairs.push(`${encodedKey}=${encodeURIComponent(String(value))}`);
            }
        }
    }

    return pairs.filter(pair => pair).join('&');
}



function userSelectedProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get("product")) {
        return urlParams.get("product");
    }
    if(wid_key['product'] && getWID(wid_key['product'])) {
        return getWID(wid_key['product']);
    }
    return "";
}

function operationToRun() {
    var operation;

    var parts = window.location.hash.split("#").pop().split("|");
    elog(window.location.hash);
    if(parts[0]) {
        operation = parts[0].replace(/^#+/, "");
        elog(operation);
    }

    if(!operation) {
        const urlParams = new URLSearchParams(window.location.search);
        operation = urlParams.get("op");
    }
    return operation;
}

function handleFormHashControl() {
    // var hashes = window.location.hash.split("#");
    // var parts = hashes.pop().split("|");
    var operation = operationToRun();
    const steps = getVariable('steps');
    elog('in handleFormHashControl, ' + operation);
    if(!operation) {
        //alert('no operation found');
        removeAnyHash();
        return false;
    }
    var parts = window.location.hash.split("#").pop().split("|");

    const data = {
        "uniqueId":parts[1],
        "product":parts[2]??"",
        "intake_state":parts[3]??"",
        "client_ip": window.client_ip
    };
    if(window.directives['sku_append']) {
        if(data["product"]) {
            elog("Append to data[product]");
            data["product"] += "" + window.directives['sku_append']??"";
            elog(data["product"]);
        }
    }
    //alert('handleFormHashControl, about to continue with operation ' + operation);

    if (operation === "step_2") {
        window.mystage='2';

        //nextStep(steps.step2,parts[1]);
        advanceForm(steps.step2, data);
        removeAnyHash();
        myLaunch();
        return true;
    } else if(operation === "step_3") {
        window.mystage='3';
        var usp = userSelectedProduct();
        if(!usp && window.directives && (window.directives['external_product_selection']??false) )  {
            usp = 'EXTERNAL';
        }

        if(usp) {
            setWID('product',usp);
            data['product'] = usp;
            autoProductStep(steps.step3,data);
            proceedToCheckout(steps.checkout, data);
            return true;
        }
        advanceForm(steps.step3, data);
        removeAnyHash();
        myLaunch();
        return true;
        // } else if(operation === "reselect") {
        //     // no product checking.
        //
        //     window.mystage='3';
        //     //alert('RESELECT ADVANCE');
        //     advanceForm(steps.step3, data);
        //     removeAnyHash();
        //     myLaunch();
        //     return true;
    } else if(operation === "checkout") {
        window.mystage='3';


        proceedToCheckout(steps['checkout'], data);
        return true;
    } else if(operation === "complete") {
        window.mystage='4';
        proceedToReceipt(data);
    }
    return false;
}

// have some global storage.
window.wlmdvar = {};
function setVariable(name,value) {
    window.wlmdvar[name] = value;
}
function getVariable(name) {
    if(window.wlmdvar[name]) {
        return window.wlmdvar[name];
    } else if(window[name]) {
        return window[name];
    }
    return false;
}


window.handleLaunches_sto = false;
function handleLaunches() {
    try {
        if(window.handleLaunches_sto) {
            clearTimeout(window.handleLaunches_sto);
        }
    } catch(e) {
        console.warn('handleLaunches warning.');
        console.warn(e);
    }
    if(!window.jotformIsReady) {
        //console.log('waiting for jir');
        const steps = getVariable('steps');
        if((typeof steps !== 'undefined') && steps && !steps['step1']) {
            elog('--handleLaunches - No step1 form to load so stop trying.');
        } else {
            window.handleLaunches_sto = setTimeout(handleLaunches, 100);
            return;
        }
    }
    elog('handleLaunches called.');
    if(isLaunchOp()) {
        //elog("LINE 462 isLaunchOp is true");
        if (typeof window.myLaunch === "function") {
            elog("myLaunch function exists to handle launch.");
            myLaunch();
        } else {
            elog("no myLaunch function so nothing to do");
        }
        //console.log('Finished isLaunchOp()');
        //removeAnyHash();
    } else {
        //console.log('no isLaunchOp.');
    }
    elog(' EOF handleLaunches.');

}

function getPageJotformIframe() {
    var frames = document.getElementsByTagName("iframe");
    var frameid;
    var iframe = false;
    for (var i = 0; i < frames.length; i++) {
        frameid = frames[i].id;
        if(frameid.toLowerCase().substring(0,7) === "jotform") {
            iframe = frames[i];
            elog("Found iframe through tagname called jotform: " + frameid);
            break;
        } else if(frameid === window.jotform_id) {
            iframe = frames[i];
            elog("Found iframe through tagname matching id:" + frameid);
            break;
        } else {
            elog("Not for frame index# " + i + ", id=" + frameid);
        }
    }
    return iframe;
}

window.addEventListener("hashchange", function () {
    elog("hashchange event");
    if(handleFormHashControl()) {
        // ok
    } else {
        elog("hashchange, so handleLaunches");
        handleLaunches(); // elog("LINE 471 isLaunchOp is false");
        elog("hashchange listener triggered, but no hashchange or launch op.");
    }
});


handleLaunches();

// some handlers for the jotform iframe embed, including permitting cross domain from them.

window.handleIFrameMessage = function(e) {

    if (typeof e.data === "object") { return; }
    var args = e.data.split(":");
    if (args.length > 2) {
        //iframe = window.document.getElementById("JotFormIframe-" + args[(args.length - 1)]);
        iframe = window.document.getElementById(args[(args.length - 1)]);
    } else {
        iframe = window.document.getElementById("JotFormIFrame");
    }

    if ( (iframe === null) || (typeof iframe !== "object")) {
        iframe = getPageJotformIframe();
    }
    if ( (iframe === null) || (typeof iframe !== "object")) {
        elog("Failed to pull an iframe got type: " + (typeof iframe));
        elog("ERROR in handleIFrameMessage - No iframe to handle args: " + JSON.stringify(args));
        return;
    }
    switch (args[0]) {
        case "scrollIntoView":
            iframe.scrollIntoView("");
            break;
        case "setHeight":
            iframe.style.height = args[1] + "px";
            if (!isNaN(args[1]) && parseInt(iframe.style.minHeight) > parseInt(args[1])) {
                iframe.style.minHeight = args[1] + "px";
            }
            break;
        case "collapseErrorPage":
            if (iframe.clientHeight > window.innerHeight) {
                iframe.style.height = window.innerHeight + "px";
            }
            break;
        case "reloadPage":
            window.location.reload();
            break;
        case "loadScript":
            if( !window.isPermitted(e.origin, ["jotform.com", "jotform.pro"]) ) {
                elog("Origin not permitted:" + e.origin);
                break;
            }
            var src = args[1];
            if (args.length > 3) {
                src = args[1] + ":" + args[2];
            }
            var script = document.createElement("script");
            script.src = src;
            script.type = "text/javascript";
            document.body.appendChild(script);
            break;
        case "exitFullscreen":
            if      (window.document.exitFullscreen)        window.document.exitFullscreen();
            else if (window.document.mozCancelFullScreen)   window.document.mozCancelFullScreen();
            else if (window.document.mozCancelFullscreen)   window.document.mozCancelFullScreen();
            else if (window.document.webkitExitFullscreen)  window.document.webkitExitFullscreen();
            else if (window.document.msExitFullscreen)      window.document.msExitFullscreen();
            break;
    }
    // var isJotForm = (e.origin.indexOf("jotform") > -1) || (e.origin.indexOf("forms.whitelabelmd.com") > -1);
    var isJotForm = true;
    //elog("isJotForm?" + isJotForm + " from e.origin:" + e.origin);

    if(isJotForm && ("contentWindow" in iframe) && ("postMessage" in iframe.contentWindow)) {
        var urls = {"docurl":encodeURIComponent(document.URL),"referrer":encodeURIComponent(document.referrer)};
        iframe.contentWindow.postMessage(JSON.stringify({"type":"urls","value":urls}), "*");
    } else {
        //elog("DEBUG failure at handleIFrameMessage");
        elog("1395: " + iframe["contentWindow"]??false);
        elog( typeof iframe["contentWindow"].postMessage);
        elog( typeof iframe.contentWindow);
        elog( e.origin);
        //elog(iframe["contentWindow"]["postMessage"]??false);

    }
};
window.isPermitted = function(originUrl, whitelisted_domains) {
    var url = document.createElement("a");
    url.href = originUrl;
    var hostname = url.hostname;
    var result = false;
    if( typeof hostname !== "undefined" ) {
        whitelisted_domains.forEach(function(element) {
            if( hostname.slice((-1 * element.length - 1)) === ".".concat(element) ||  hostname === element ) {
                result = true;
            }
        });
        return result;
    }
};
if (window.addEventListener) {
    window.addEventListener("message", handleIFrameMessage, false);
} else if (window.attachEvent) {
    window.attachEvent("onmessage", handleIFrameMessage);
}

// the main GA function that's called in all events
/*
var params = {
                'part': window.mystage,
                'my_step': i+1,
                'total_steps': nextButtons.length+1,
                'status':'init',
                'action': 'next'
            };
 */

function actionIsFirstTime(part, status, action, step) {
    const stamp = part + '-' + status + '-' +action + '-' +step;
    if(!window.steps_tracked) {
        window.steps_tracked = {};
    }
    if(window.steps_tracked[stamp]) {
        // ok
    } else {
        window.steps_tracked[stamp] = 1;
        return true;
    }
    return false;
}

function callGA(params) {
    if(!window.directives || !window.directives['flag_ga_track_questions']) {
        elog('callGA ga_track_questions not on. PARAMS:');
        elog(params);
        return false;
    }
    try {
        if( (params['action'] === 'back') ||
            (params['status'] === 'error') ||
            actionIsFirstTime(params['part'], params['status'], params['action'], params['my_step'])
        ) {
            var sent = {
                'event': 'callGA',
                //'part': params['part'],
                'action': params['action'],
                'my_step': params['my_step'],
                'total_steps': params['total_steps'],
                'status': params['status'],
                'time_on': params['time_on'],
                'question': params['question'].substring(0,100),
                'client_ip': window.client_ip??'0.0.0.0'
            }
            if(window.dataLayer) {
                dataLayer.push(sent);
                elog('callGA sent:');
                elog(sent);
            } else {
                elog('callGA no dataLayer but would have sent:');
                elog(sent);
            }

        } else {
            elog('callGA no dataLayer.push - not-first-time: ' + params['part'] + ', '  + params['status'] + ', ' + params['action'] + ', '+ params['my_step']);
        }
    } catch(e) {
        console.warn('callGA Error running dataLayer.push');
        console.warn(e);
        return false;
    }
    return true;
}

function wlmdSetCookieTldMonths(name, value, months) {
    var myDate = new Date();
    myDate.setMonth(myDate.getMonth() + months);
    var dom = window.location.hostname;
    dom = dom.substring(dom.lastIndexOf(".", dom.lastIndexOf(".") - 1) + 1);
    document.cookie = name + '=' + JSON.stringify(value) + ';expires=' + myDate
        + ';domain=' + dom + ';path=/';
}

function getCookie(cname) { // improved 2024-01-25
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function wlmdSetCookie(name, value, daysToLive) {
    // Encode value in order to escape semicolons, commas, and whitespace
    var cookie = name + "=" + encodeURIComponent(value) + ";path=/";

    if (typeof daysToLive === "number") {
        // daysToLive = 0;
        /* Sets the max-age attribute so that the cookie expires
         after the specified number of days */
        cookie += "; max-age=" + (daysToLive * 24 * 60 * 60);
    }
    document.cookie = cookie;
}
function setCookie(name,value,daysToLive){
    return wlmdSetCookie(name, value, daysToLive);
}
function myLaunch() {

    //handleFormHashControl();

    if(!window.jotformIsReady) {
        elog('in myLaunch, jotform not ready yet');
        return setTimeout('myLaunch',100);
    }
    //console.log('try showIntakeForm()');

    //showIntakeForm(false);
    elog("got jir. try myBtn-mdl.click()");


    try { document.getElementById("myBtn-mdl").click(); }
    catch(e) {
        console.warn("couldnot myBtn-mdl click:",e);
    }
}
function domLoadedModal() { /* addListener function */
    //alert('started domLoadedModal');
    var body = document.getElementsByTagName('body')[0];

    // Get the modal
    var modal = document.getElementById('myModal-mdl');

    // Get the button that opens the modal
    // var btn = document.getElementById('myBtn-mdl');
    // When the user clicks on the button, open the modal
    // btn.onclick = function() {
    //}
    // Get the <span> element that closes the modal

    var mbtn = document.getElementsByClassName('mybtnmdl');

    var callModal = function() {
        elog('..did callModal');
        modal.style.transform = 'translateY(0px)';
        // modal.style.opacity = '1';
        modal.style.height='auto';
        body.classList.add('ovhidden');
        setTimeout('showIntakeForm', 100);

    };

    for (var i = 0; i < mbtn.length; i++) {
        mbtn[i].addEventListener('click', callModal, false);
    }

    /* check for a launch op, possible start at later step */
    if(handleFormHashControl()) {
        elog('dom load handleFormHashControl() returned true.');
    } else if(isLaunchOp()) {
        elog('isLaunchOp is true so do myLaunch');
        myLaunch();
    }
    if(document.getElementById("myBtn-mdl")) {
        document.getElementById("myBtn-mdl").onclick = function () {
            showIntakeForm();
            //document.getElementById("intake_form_area").style.display="block";
        };
    }

}

function domLoadedIntake() {
    // Find all elements with class 'show-form'
    var showFormButtons = document.querySelectorAll('.show-form');

    // Find the form with class 'hidden-form'
    var hiddenForm = document.querySelector('.hidden-form');

    // Find the element with class 'close-form'
    var closeFormButton = document.querySelector('.close-form');

    // Loop through the NodeList and attach a click event listener to each element
    showFormButtons.forEach(function(showFormButton) {
        showFormButton.addEventListener('click', function() {
            // When the button is clicked, show the form
            showIntakeForm();
        });
    });

    // Attach a click event listener to the element with class 'close-form'
    if(closeFormButton) {
        closeFormButton.addEventListener('click', function() {
            // When the element is clicked, hide the form
            hiddenForm.style.display = 'none';
        });
    }
}