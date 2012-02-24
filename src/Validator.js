/*.............................................
The validator() class allows live field validation.
*/
function Validator (against, /*optional => */delay, valid_css, invalid_css)
/* against needs to be a function that takes a value, and returns a value in one of the following formats:
 * bool (true/false), array [bool, message]
 * delay defaults to 650ms, but can be set by passing something in here.
 * valid_css defaults to a teal background with white text, and represents the appearance of a form field when 
 * it has been validated. It can be set here.
 * invalid_css defaults to a red background with white text, and represents the appearance of a form field
 * when it has been tested and failed the validation.
 * Example instantiation for a validator which tests to see if a number is between 1 and 10:
 * var num_1_to_10 = new validator ( function(value) {
                                              return /[0-9]{1,2}/g.test(value);
                                   });
*/
{
    this.delay = delay || 650;
    this.css = {
        valid   :   valid_css || {"background-color" : "#00afad","color" : "#fff"},
        invalid :   invalid_css || {"background-color" : "#811", "color" : "#fff"}
    };
    this.test = against;
    this.set_text = {};
    this.validate = function (element)
    { // Validates fields after an x ms delay, where x is this.delay; 
      // after testing, animates the field to the valid or invalid css.
        var _self = this;
        var timer;
        var valid;
        if (element.type.toLowerCase() === "radio")
        {
            $(element).change(function() {
                element = typeof element === "string" ? $(element) : element;
                valid = _self.test(element.value);
                valid = typeof valid === "object" ? valid[0] : valid; 
                element.valid = valid;
                var c = element.valid === true ? _self.css.valid : _self.css.invalid;
                $(element).css(c);
            });
        }
        else
        {
            $(element).keyup(function() {
                $(element).keydown(function(event) {
                    if (event.keyCode !== 9)
                    {
                        clearTimeout(timer);
                    }
                });
                if (typeof element.value !== 'undefined' && element.value.length > 0)
                {
                    timer = setTimeout(function() {
                        valid = _self.test(element.value);
                        switch(typeof valid)
                        {
                            case "object"   :   _self.set_text[element.name] = valid[1].toString();
                                                valid = valid[0];
                                                //Do not put a break here! This cascades on purpose! 
                            case "boolean"  :   var css = valid ? _self.css.valid : _self.css.invalid;
                                                element.valid = valid;
                                                break;
                            default         :   valid = true; //Don't punish the user if the programmer doesn't know what they're doing!
                                                element.valid = valid;
                        }
                        switch(typeof element)
                        {
                            case "string"   :   element = element[0] === "#" ? element : "#"+element;
                            case "object"   :   $(element).animate(css, 250, function() {
                                                    if (typeof _self.set_text[element.name] === "string")
                                                    {
                                                        $(element).val(_self.set_text[element.name]);
                                                        delete _self.set_text[element.name];
                                                    }
                                                });
                                                return;
                            case "undefined" :  return valid;
                        }
                    }, _self.delay);
                }
            });
        }
    };
}

