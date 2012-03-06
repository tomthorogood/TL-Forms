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

// Tests to see if fields in the group are valid.
// If all fields are valid, the button is displayed.


// Params:
//      group   :   a Field_Group object
//      button  :   a DOM Object
function allow_progress (group, button)
{
    console.debug('running show_progress');
    var progress = false;
    var cluster_validity = {};
    var previous_cluster;

    for (var e = 0; e < group.elements.length; e++)
    {
        element = group.elements[e];

        if (e === 0)
        {
            previous_cluster = element.name;
        }

        // If the current element name is different from the one before it,
        // we are done with the previous cluster.
        else if (previous_cluster !== element.name)
        {
            // If the previous cluster is false, then not all clusters
            // can be valid, and there is no reason to continue this test.
            if (!cluster_validity[previous_cluster])
            {
                break;
            }

            // Otherwise, we have no further need to continue testing
            // the previous cluster, so we can ignore it in the future.
            else
            {
                previous_cluster = element.name;
            }
        }

        // If this cluster has not yet been tested...
        if (typeof cluster_validity[element.name] === "undefined")
        {
            cluster_validity[element.name] = element.valid;
        }

        // If it has already been determined that at least one 
        // field in this custer is valid, we do not need
        // to continue testing this field.
        else if (cluster_validity[element.name] === true)
        {
            continue;
        }
        else
        {
            cluster.validity[element.name] = element.valid;
        }

        // If we're on the last loop, all previous tests have passed.
        // Therefore, we only need to check whether this last loop is true.
        // That will determine the final result.
        if (e === group.elements.length-1)
        {
            switch(cluster.validity[element.name])
            {
                case true   :   $(button).show();
                                break;
                default     :   $(button).hide();
                                break;
            }
        }
    }
}

