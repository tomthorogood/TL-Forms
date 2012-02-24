var tl_form = new Form();
function Element(type, /*optional >>*/name, value, css_class, test, callback, required)
{
    this.type = type;
    this.callback = callback || function() {return true;};
    this.input = [];
    this.name = name;
    this.validator = typeof test !== "undefined" ? new validator( test, function() {return this.callback()} ) : undefined;
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

    var eles = (this.model.getElementsByTagName(this.tag));
    for (var e in eles)
    {
        this.input.push(eles[e]);
    }
}

