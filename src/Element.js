/**@public tl_form - a Form object.
 */
var tl_form = new Form();

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
    this.type = type;
    this.callback = callback || function() {return true;};
    this.input = [];
    this.name = name;
    this.validator = typeof test !== "undefined" ?  test : undefined;
    this.required = typeof required !== "undefined" ? required : false;
    this.valid = !(typeof this.validator !== "undefined" && this.required === true);
    switch(this.type)
    {
        case 'text'     :       this.model = tl_form.create_text_field(name, value, css_class);
                                this.tag = "input";
                                break;
        case 'hidden'   :       this.model = tl_form.create_hidden_field(name, value);
                                this.tag = "input";
                                break;
        case 'password' :       this.model = tl_form.create_password_field(name, value, css_class);
                                this.tag = "input";
                                break;
        case "dropdown" :       this.model = tl_form.create_dropdown_menu(name,value,css_class);
                                this.tag = "select";
                                break;
        case 'submit'   :       this.model = tl_form.create_submit_button(name, value, css_class);
                                this.tag = "input";
                                break;
        case 'radio'    :       this.model = tl_form.create_radio_button(name, value, css_class);
                                this.tag = "input";
                                break;
        case 'textarea' :       this.model = tl_form.create_textarea(name, value, css_class);
                                this.tag = "textarea";
    }

    var elements = (this.model.getElementsByTagName(this.tag));
    for (var e in elements)
    {
        if (typeof e !== 'undefined')
        {
            this.input.push(elements[e]);
        }
    }
    if (typeof this.test !== "undefined")
    {
        this.validator.validate(this, this.callback);
    }
}

