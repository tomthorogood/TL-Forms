function Form()
//Constructor for the form class. Since this class contains mostly class methods,
//not much is constructed.
{
    this.parse = {
        value : function(string)
        {//form.parse.value('01::foo::bar') would return '01'
            return Parse(string)[0];
        },
        display : function(string)
        {//form.parse.display('01::foo::bar') would return 'foo'
            return Parse(string)[1];
        },
        selected : function(string)
        {//form.parse.selected('01::foo::bar') would return 'bar'
            return Parse(string)[2];
        }
    };
}

Form.prototype.IE_Compliant = function (element)
{
    //Sometimes IE is a douchebag with input fields.
    //This workaround will wrap tags in a div.
    if (IE_MODE)
    {
        var div = document.createElement('div');
        div.name = element.name;
        div.appendChild(element);
        return div;
    }
    return element;
};

Form.prototype.create_text_field = function (name, value, style)
// Creates an input element with a type of text. 
{
    if (typeof name === "undefined")
    {
        name = "text_field";
    }
    var field = document.createElement('input');
    field.type = "text";
    field.name = name;
    field.value = value || "";
    if (typeof style === "string")
    {
        $(field).addClass(style);
    }
    return this.IE_Compliant(field);
};

Form.prototype.create_dropdown_menu = function (name, values, style, preserve_case)
// Creates a dropdown menu, where the values are passed as an array:
// .create_dropdown_menu("myDropdown", ['Option 1', 'Option 2', 'Option 3'])
// Options will automatically be set to title case unless preserve_case is set to true.
{
    var dropdown = document.createElement('select');
    if (typeof name === "undefined")
    {
        name = "dropdown";
    }
    dropdown.name = name;
    for (var value in values)
    {
        if (typeof value !== "undefined")
        {
            var val = values[value];
            if (!preserve_case || typeof preserve_case === "undefined")
            {
                val = val.replace(/_/g,' ').toTitleCase();
            }
            var option = document.createElement('option');
            option.value = this.parse.value(val); 
            option.innerHTML = this.parse.display(val);
            dropdown.appendChild(option);
        }
    }
    if (typeof style ==="string")
    {
        $(dropdown).addClass(style);
    }
    return dropdown;
};

Form.prototype.create_password_field = function (name, value, style)
// Creates an input field with the type of password
{
    if (typeof name === "undefined")
    {
        name = "password";
    }
    var field = document.createElement('input');
    field.type = "password";
    field.name = name;
    if (typeof value === "string")
    {
        field.value = value;
    }
    if (typeof style === "string")
    {
        $(field).addClass(style);
    }
    return this.IE_Compliant(field);
};

Form.prototype.create_submit_button = function (name, value, style, image)
// Creates an input field of type 'submit' if no image is given
// Otherwise, creates an input field of type 'image'.
{
    var button;
    if (typeof value === "undefined")
    {
        value = "Submit";
    }
    if (typeof image === "undefined")
    {
        button = document.createElement('input');
        button.type = "submit";
        button.value = value;
    }
    else
    {
        button = document.createElement('input');
        button.type = "image";
        button.src = image;
    }
    if (typeof style === "string")
    {
        $(button).addClass(style);
    }
    button.name = name || "submit";
    return this.IE_Compliant(button);
};
    
Form.prototype.create_hidden_field = function (name, value)
// Adds a hidden field into the form for passing information to the 
// form handler without displaying it.
{
    var hidden = document.createElement('input');
    hidden.type = "hidden";
    hidden.name = name;
    hidden.value = value;
    return hidden;
};

Form.prototype.create_file_upload = function (name, style)
// Creates a file upload field.
// Note that it does not handle multiple file selection at this time.
// >>> TODO!
{
    var file_upload = document.createElement('input');
    file_upload.type = "file";
    file_upload.name = name;
    if (typeof style === "string")
    {
        $(file_upload).addClass(style);
    }
    return this.IE_Compliant(file_upload);
};

Form.create_textarea = function (name, value, style)
// Creates a textarea. Surprised?
{
    var textarea = document.createElement('textarea');
    if (typeof name === "undefined")
    {
        name = "textarea";
    }
    if (typeof style === "string")
    {
        $(textarea).addClass(style);
    }
    if (typeof value === "string")
    {
        textarea.innerHTML = value;
    }
    return this.IE_Compliant(textarea);
};

Form.prototype.create_multi_button = function (name, values, style, type)
// Shouldn't be invoked directly. See create_radio_button or create_checkbox
{
    var div = document.createElement('div');
    var value;
    div.name = name;
    for (value in values)
    {
      if (typeof value === "string")
      {
        var d = document.createElement('div');
        var s = document.createElement('span');
        if (typeof style === "string")
        {
            $(d).addClass(style);
        }
        var radio = document.createElement('input');
        if (typeof name === "undefined")
        {
            name = type;
        }
        radio.name = name;
        radio.type = type;
        radio.value = this.parse.value(values[value]);
        if (this.parse.selected(values[value]) === "Selected")
        {
            radio.checked = "checked";
        }
        s.innerHTML = this.parse.display(values[value]);
        d.appendChild(radio);
        d.appendChild(s);
        div.appendChild(d);
      }
    }
    return div;
};

Form.prototype.create_radio_button = function (name, values, style)
//Creates a radio field in the form of <div><input type="radio" ... ><span>...</span></div>
//The div will be named the same name as the radio inputs.
{
    return this.create_multi_button(name, values, style, "radio");
};

Form.prototype.create_checkbox = function (name, values, style)
//Creates a checkbox field in the form of <div><input type="checkbox" ... > <span>...</span></div>
{
    return this.create_multi_button(name, values, style, "checkbox");
};
