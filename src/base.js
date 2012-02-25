if (typeof navigator !== "undefined")
{
    var IE_MODE = navigator.appName === "Microsoft Internet Explorer";
}
//.........ADDING FUNCTIONALITY FOR CONVERTING OPTIONS TO TITLE CASE .........

/* 
 * To Title Case 2.0.1 â€“ http://individed.com/code/to-title-case/
 * Copyright Â© 2008â€“2012 David Gouch. Licensed under the MIT License. 
 */

/** Returns a string in title case.
 * @returns string, with the first letter of each word capitalized.
 */
String.prototype.toTitleCase = function () {
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;

  return this.replace(/([^\W_]+[^\s\-]*) */g, function (match, p1, index, title) {
    if (index > 0 && index + p1.length !== title.length &&
      p1.search(smallWords) > -1 && title.charAt(index - 2) !== ":" && 
      title.charAt(index - 1).search(/[^\s\-]/) < 0) {
      return match.toLowerCase();
    }

    if (p1.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
};
//.....END INSERTED SCRIPT......

/**@function Parse
 * @param {String} any string
 * @return {object} a list of parsed strings separated by the '::' delimiter.
 */
function Parse (string)
//Enables embedding of separate values or select options into dropdown,radio, and checkboxes.
// create_radio_button("sandwich", ["1::Peanut Butter & Jelly::Selected", "2::Grilled Cheese"]);
// would result in <input type="radio", value="1" checked/><span>Peanut Butter & Jelly</span>
// and so on...
{
    if (/::/.test(string))
    {
        return string.split(/::/g);
    }
    return [string,string];
}

