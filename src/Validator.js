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
    // A speed of the validation animation set in milliseconds.
    this.ANIMATION_SPEED = animation_speed || 250;

    // The delay before the validation script runs. If a user continues
    // to type in the field being validated, it will be this.DELAY milliseconds
    // before the validation script runs. 
    this.DELAY = delay || 650;

    // This defaults to teal background and white text for valid input
    // and red background with white text for invalid input
    this.css = {
        valid   :   valid_css || {"background-color" : "#00afad","color" : "#fff"},
        invalid :   invalid_css || {"background-color" : "#811", "color" : "#fff"}
    };

    // This is the actual validation test that is to be run. It is a function that
    // should accept a field value and return a boolean value.
    // It can also return an array of [BOOL, STRING], where the string element
    // represents feedback to the user.
    this.test = against;

    // If the latter return case exists for the test function, this will 
    // temporarily hold the feedback text until it can be appended to the DOM.
    this.set_text = {};

    // This is the beefy part of this class, and is the method that ties everything together.
    // The element parameter needs to be an instance of the Element class. 
    this.validate = function (element, callback)
    { // Validates fields after an x ms DELAY, where x is this.DELAY; 
      // after testing, animates the field to the valid or invalid css.
        var _self_ = this;
        var timer;
        var valid;
        console.debug(element);
        // Because radio buttons are different than other fields, they must be handled
        // differently. This takes care of that.
        if (element.type.toLowerCase() === "radio")
        {
            // Iterates through each of the possible choices of the radio button
            for (var i = 0; i < element.input.length; i++)
            {
                console.debug(element.input[i]);
                // Binds a change event to each of these dom objects.
                $(element.input[i]).change(function() {
                    // Runs an enclosure when any of these are changed. 
                    (function() {

                        console.debug('called!');

                        // The value of the radio button that has just been clicked
                        var value = this.value;

                        // Invokes the test method to determine validity
                        valid = _self_.test(value);

                        // @TODO: this doesn't actually work...
                        // var css = valid ? _self_.css.valid : _self_.css.invalid;

                        // Sets the valid attribute of the actual Element object
                        element.valid = valid;

                        // @TODO: Css for Radio buttons doesn't work yet...
                        // $(element).animate(css,_self_.ANIMATION_SPEED);
                    });
                });
            }
        }
        else
        {
            // Each time a key goes up in the field being tested, start the process
            $(element).keyup(function() {

                // But stop and reset the process if someone types again (unless they are tabbing out of the field)
                $(this).keydown(function(event) {
                    if (event.keyCode !== 9)

                    { //We don't want to annoy people while they are typing.
                        clearTimeout(timer);
                    }
                });

                // If there is something in the field and it's not an empty string...
                if (typeof element.value !== 'undefined' && element.value.length > 0)
                {
                    // Set a timer!
                    timer = setTimeout(function() {

                        // If the timer goes off, test the field value against the validation handler.
                        valid = _self_.test(element.input[0].value);

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

                        // Animate the field for visual feedback.
                        $(element.input[0]).animate(css,_self_.ANIMATION_SPEED,function() {

                            if (typeof _self_.set_text[element.name] === "string")
                            // Check to see if the text of this field is supposed to change in response. If so,
                            {//Change the text if there has been alternate text provided
                                element.input[0].value = _self_.set_text[element.name];
                                delete _self_.set_text[element.name];
                                // make sure we don't accidentally overwrite valid text later.
                            }
                        });
                                
                    }, _self_.DELAY);
                }
            });
        }
        if (typeof callback === "function")
        {
            callback();
        }
    };
}

