/*.............................................
The validator() class allows live field validation.
*/
function Validator (against, /*optional => */delay, animation_speed, valid_css, invalid_css)
/* against needs to be a function that takes a value, and returns a value in one of the following formats:
 * bool (true/false), array [bool, message]
 * DELAY defaults to 650ms, but can be set by passing something in here.
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
    this.ANIMATION_SPEED = animation_speed || 250;
    this.DELAY = delay || 650;
    this.css = {
        valid   :   valid_css || {"background-color" : "#00afad","color" : "#fff"},
        invalid :   invalid_css || {"background-color" : "#811", "color" : "#fff"}
    };
    this.test = against;
    this.set_text = {};
    this.validate = function (element)
    { // Validates fields after an x ms DELAY, where x is this.DELAY; 
      // after testing, animates the field to the valid or invalid css.
        var _self_ = this;
        var timer;
        var valid;
        if (element.type.toLowerCase() === "radio")
        {
            for (var i = 0; i < element.input.length; i++)
            {
                $(element.input[i]).change(function() {
                    return function() {
                        var value = this.value;
                        valid = _self_.test(value);
                        var css = valid ? _self_.css.valid : _self_.css.invalid;
                        element.valid = valid;
                        $(element).animate(css,_self_.ANIMATION_SPEED);
                    };
                });
            }
        }
        else
        {
            $(element).keyup(function() {
                $(this).keydown(function(event) {
                    if (event.keyCode !== 9)
                    {//Unless the user is tabbing out the field, reset so that we don't annoy them while they're trying to type
                        clearTimeout(timer);
                    }
                });
                if (typeof element.value !== 'undefined' && element.value.length > 0)
                {
                    timer = setTimeout(function() {
                        valid = _self_.test(element.value);
                        switch(typeof valid)
                        {//If an object is returned, we parse the first value of the array as true/false, and the second 
                            //as feedback to the user.
                            case "object"   :   _self_.set_text[element.name] = valid[1].toString();
                                                valid = valid[0];
                                                //Do not put a break here! This cascades on purpose! 
                            case "boolean"  :   var css = valid ? _self_.css.valid : _self_.css.invalid;
                                                element.valid = valid;
                                                break;
                            default         :   valid = true; //Don't punish the user if the programmer doesn't know what they're doing!
                                                element.valid = valid;
                        }
                        $(element.input[0]).animate(css,_self_.ANIMATION_SPEED,function() {
                            if (typeof _self_.set_text[element.name] === "string")
                            {//Change the text if there has been alternate text provided
                                element.input[0].value = _self_.set_text[element.name];
                                delete _self_.set_text[element.name];
                            }
                        });
                                
                    }, _self_.DELAY);
                }
            });
        }
    };
}

