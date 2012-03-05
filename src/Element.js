/**@public this.form_creator.- a Form object.
 */


/**@Class Element
 * Creates an input field element.
 * @param {String} type The field type (text, hidden,password,dropdown,submit,radio,textarea)
 * @param {String} name The name of the field (if not defined, will default to the field type)
 * @param {String} css_class The css-style class of the field
 * @param {Function} object A function which takes a DOM Object as a parameter and tests its value, returning true or false.
 * @param {Function} callback A callback function, taking no parameters and returning no parameters, which will be executed after the test.
 * @param {Boolean} reqired Whether or not the field must be filled out (and valid) before the form is submitted.
 */

function Element(type, /*optional >>*/name, value, css_class, test, callback, required)
{
    // Form_Bridge interacts with a form creation class in order to provide DOM objects.
    this.form_creator = new Form_Bridge();

    // type is whatever kind of field it is. Valid options are (currently):
    // text, hidden, password, dropdown, submit, radio, textarea
    this.type = type;

    // A callback function to be executed once the validator has finished validating the field.
    this.validator_callback = callback || function() {return true;};

    // The actual DOM object. In most cases, this will be a single element array, however
    // for dropdowns and radio buttons, there will be multiple elements in this array.
    this.input = [];

    // the name of the field. Note that this will be exactly the value of the 'name' attribute in the dom object.
    // It is replicated for more efficient accessibility, and also accounts for the fact that multiple DOM objects in,
    // for instance, radio buttons, need to have the same name. 
    this.name = name;

    // This is a validation method, which will get fed into a Validator object.
    this.validator = typeof test !== "undefined" ?  test : undefined;

    // A boolean representing whether or not a valid input of this element is required in order 
    // to progress through the rest of the form.
    this.required = typeof required !== "undefined" ? required : false;

    // A boolean field representing whether or not the input set has been validated.
    // This will be manipulated by the validator.
    this.valid = !(typeof this.validator !== "undefined" && this.required === true);

    // Creates a DOM object, or set of DOM objects wrapped in a div, based on the type passed in.
    // This model is therefor a collection of DOM objects which will model the information on an actual page.
    // This is what is seen by the end user.
    switch(this.type)
    {
        case 'text'     :       this.model = this.form_creator.create_text_field(name, value, css_class);
                                this.tag = "input";
                                break;
        case 'hidden'   :       this.model = this.form_creator.create_hidden_field(name, value);
                                this.tag = "input";
                                break;
        case 'password' :       this.model = this.form_creator.create_password_field(name, value, css_class);
                                this.tag = "input";
                                break;
        case "dropdown" :       this.model = this.form_creator.create_dropdown_menu(name,value,css_class);
                                this.tag = "select";
                                break;
        case 'submit'   :       this.model = this.form_creator.create_submit_button(name, value, css_class);
                                this.tag = "input";
                                break;
        case 'radio'    :       this.model = this.form_creator.create_radio_button(name, value, css_class);
                                this.tag = "input";
                                break;
        case 'textarea' :       this.model = this.form_creator.create_textarea(name, value, css_class);
                                this.tag = "textarea";
    }

    // A local array populated by the DOM elements.
    var elements = (this.model.getElementsByTagName(this.tag));
    for (var i = 0; i < elements.length; i++)
    {
        // Reference these objects in the instance array 'input' 
        // for easy accessing of the physical input objects
        this.input.push(elements[e]);
    }
    if (typeof this.test !== "undefined")
    {
        // Binds validation handlers to the instance of Element that
        // has just been created.
        this.validator.validate(this, this.validator_callback);
    }
}

