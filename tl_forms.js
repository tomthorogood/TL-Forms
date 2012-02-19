/*  TL Forms is a library which allows the easy creation, embedding, and validation of forms
    using JavaScript and jQuery.
    Copyright (C) 2012  Tom A. Thorogood, Turn Left, LLC [www.turnleftllc.com]

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//.........ADDING FUNCTIONALITY FOR CONVERTING OPTIONS TO TITLE CASE .........

/* 
 * To Title Case 2.0.1 â€“ http://individed.com/code/to-title-case/
 * Copyright Â© 2008â€“2012 David Gouch. Licensed under the MIT License. 
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


/*..............................

The Parse() and Form() classes grant the ability to create form elements.

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
    field.value = value || undefined;
    if (typeof style === "string")
    {
        $(field).addClass(style);
    }
    return field;
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
    return field;
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
    return button;
};
    
Form.prototype.create_fake_button = function (name, value, style)
// Creates a span element made to look like a button. I truly cannot remember
// why I did this?
{
    var fake = document.createElement('span');
    if (typeof style ==="string")
    {
        $(fake).addClass(style);
    }
    if (typeof name === "string")
    {
        fake.name = name;
    }
    fake.innerHTML = value;
    return fake;
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
    return file_upload;
};

Form.prototype.create_link_button = function (value, href, style)
// Creates an anchor tag that behaves like a button. Much
// like the fake button, I don't really know what I did this.
// It was long ago.
{
    var link = document.createElement('a');
    if (typeof href === "undefined")
    {
        href = "#";
    }
    link.href = href;
    if (typeof style === "string")
    {
        $(link).addClass(style);
    }
    link.innerHTML = value;

    return link;
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
    return textarea;
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


/*.............................................
The validator() class allows live field validation.
*/

function validator (against, /*optional => */delay, valid_css, invalid_css)
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
        $(element).keyup(function() {
            $(element).keydown(function(event) {
                if (event.keyCode !== 9)
                {
                    clearTimeout(timer);
                }
            });
            if (element.value.length > 0)
            {
                timer = setTimeout(function() {
                    var valid = _self.test(element.value);
                    switch(typeof valid)
                    {
                        case "object"   :   _self.set_text[element.name] = valid[1].toString();
                                            valid = valid[0];
                        case "boolean"  :   var css = valid ? _self.css.valid : _self.css.invalid;
                                            break;
                        default         :   valid = true; //Don't punish the user if the programmer doesn't know what they're doing!
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
    };
}

function form_widget (method, handler, /*optional*/no_overlay, /*required if setting no_overlay to true*/element)
{
    if (!no_overlay === true)
    {
        this.overlay = new Overlay();
        this.element = this.overlay.div
    }
    else
    {
        this.element = element;
    }
    this.form = new Form();
    this.method = method;
    this.handler = handler;
    this.fields = [];
    this.groups = [];
    this.validation_timeout = 500;
    this.field_instructions = {};
    this.valid = {
        email   :   new validator(function(value) {
                        var pattern = /[A-Za-z0-9%._\-]*@[A-Zz-z0-9\-]*\.[a-zA-Z0-9]{2,4}/gi;
                        var valid;
                        var message;
                        if (pattern.test(value))
                        {
                            valid = true;
                        }
                        switch (valid)
                        {
                            case true       :   return true;
                            case false      :   return [false, "That email address already exists in our system."];
                            default         :   return false;
                        }
                    }),
        day_in_month    :   new validator(function(value) {
                                return (typeof value === "number" && value < 32);
                            }),
        currency        :   new validator(function(value) {
                                var pattern = /^\$?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/;                            
                                if (pattern.test(value))
                                {
                                    var replace = /[$,]/g;
                                    var output = value.replace(replace, '');
                                    return [true, output];
                                }
                                else
                                {
                                    return pattern.test(value);
                                }
                            }),
        match           :   new validator(function(value) {
                                var compare = document.getElementsByName("password1");
                                if (compare.length > 0)
                                {
                                    return value === $(compare[0]).val();
                                }
                                else
                                {
                                    return true;
                                }
                            }),
        percentage      :   new validator(function(value) {
                                var percent = /^[0-9]{0,2}\.{0,1}[0-9]{0,2}%{0,1}/; 
                                var decimal = /^(\.(\d*))/;
                                if (decimal.test(value))
                                {
                                    return true;
                                }
                                else if (percent.test(value))
                                {
                                    var output = parseInt(value.replace(/\%/g,""),10);
                                    output /= 100;
                                    return [true, output];
                                }
                                else
                                {
                                    return false;
                                }
                            }),
        password        :   new validator(function(value) {
                                var bad_chars = /\\\/\(\)\{\};/g;
                                var min_length = 6;
                                if (!bad_chars.test(value))
                                {
                                    if (value.length >= min_length)
                                    {
                                        return true;
                                    }
                                    else
                                    {
                                        return false;
                                    }
                                }
                                else
                                {
                                    return false;
                                }
                            })


    };
}

form_widget.prototype.validate = function (field,type)
{
    this.valid[type].validate(field);
};

form_widget.prototype.add_field = function (type, name, value, css_class, valid_as)
{
    var field;
    switch(type)
    {
        case 'text'     :       field = this.form.create_text_field(name, value, css_class);
                                break;
        case 'hidden'   :       field = this.form.create_hidden_field(name, value);
                                break;
        case 'password' :       field = this.form.create_password_field(name, value, css_class);
                                break;
        case "dropdown" :       field = this.form.create_dropdown_menu(name,value,css_class);
                                break;
        case 'submit'   :       field = this.form.create_submit_button(name, value, css_class);
                                break;
        case 'radio'    :       field = this.form.create_radio_button(name, value, css_class);
    }
    
    if (typeof valid_as !== "undefined")
    {
        this.validate(field, valid_as);
    }
    this.fields.push(field);
};

form_widget.prototype.grouping = function( group_id, fields) 
// Using grouping will allow you to process methods for individual groups of fields, instead of talking
// to the entire form all at once. In order to group two fields together, they must already be in this.fields[]
{
    var field;
    var name;
    var div = document.createElement('div');
    $(div).addClass("form group");
    if (typeof group_id === "string")
    {
        div.id = group_id;
    }
    else
    {
        console.warn("You have given an invalid argument to 'group_id' in form_widget.grouping");
        console.debug(group_id);
    }
    for (name in fields)
    {
      if (typeof fields[name] === "string")
      {
        for (field in this.fields)
        {
            if (typeof this.fields[field] !== "undefined")
            {
                if (this.fields[field].name === fields[name])
                {
                    div.appendChild(this.fields[field]);
                    $(div).hide();
                }
            }
        }
      }
    }
    this.groups.push(div);
};

form_widget.prototype.progress_button = function (element)
{
    this.progress.button = this.format_element(element);
};

form_widget.prototype.enable_progress_button = function ()
{
    var _self_ = this;
    $(_self_.progress.button).click(function() {
        $(_self_.groups[_self_.group]).hide('slide', {direction : "left"}, 250, function() {
            _self_.group ++;
            $(_self_.groups[_self_.group]).show('slide', {direction: "right"}, 250);
            if (typeof _self_.progress.bar !== "undefined")
            {
                _self_._progress();
            }
        });
    });
};

form_widget.prototype.create_form = function (form_name, css_class)
{
    var field;
    var form = document.createElement('form');
    if (typeof form_name !== "undefined")
    {
        form.id = form_name;
    }
    if (typeof css_class !== "undefined")
    {
        form.className = css_class;
    }
    form.setAttribute('method', this.method);
    form.setAttribute('action', this.handler);
    if (this.groups.length === 0)
    {
        for (field in this.fields)
        {
            var f = this.fields[field];
            if (typeof f === "object")
            {
                form.appendChild(f);
            }
        }
    }
    else
    {
        for (var group in this.groups)
        {
            var g = this.groups[group];
            if (typeof g === "object")
            {
                form.appendChild(g);
            }
        }
        this.group = 0;
        $(this.groups[this.group]).show('slide', {direction: "right"}, 250);
        if (typeof this.progress.button === "undefined")
        {
            console.warn("You have not set a progress button! Users will not be able to use this form! Just call widget.progress_button('element_name')");
        }
        else
        {
            this.enable_progress_button();
        }
        if (this.progress.end === 0)
        {
            this.progress.end = this.groups.length;
        }
        this.initialize_progress();
    }


    $('input[type=text]', form).one('focus', function() { $(this).val('');});
    this.element.appendChild(form);
    $('.swap.focus').hide();
    $('.swap.default').one('focus',function() {
        var name = $(this).attr('name');
        $('input[name='+name.replace('x','d')+']').show().focus();
        $(this).remove();
    });
};

form_widget.prototype.format_element = function (el)
{
    if (typeof el === "object")
    {
        return el;
    }
    if (el[0] !== "#")
    {
        el = "#"+el;
    }
    return $(el);
}

form_widget.prototype.set_ajax = function(bool, success_callback)
{
    if (bool === true)
    {
        $('form', this.element).submit(function() {
            var options = {success  :   success_callback};
            $(this).ajaxSubmit(options);
            return false;
        });
    }
    else
    {
        $('form', this.element).unbind('submit');
    }
};

form_widget.prototype.track_progress = function ( parent_bar, animated_bar )
// Adding a progress bar will make a pretty animated bar as one progresses through the form. 
// Everyone loves progress bars!
// You can even set bar start/end manually to cover multiple pages of your form.
// => widget.progress.start = 6;
// => widget.progress.end = 24;
// 
{
    this.progress = {
        container   :   parent_bar,
        bar         :   animated_bar,
        speed       :   250,        // Animation speed in ms
        tracking    :   true,
        start       :   0,
        current     :   1,
        end         :   0           // This property will be set upon calling the create_form() method, unless it is set explicitly.
    };
};

form_widget.prototype._progress = function ()
{
    var PERCENT = 100;
    this.progress.current ++;
    var speed = this.progress.speed;
    var percent_complete = Math.floor( (this.progress.current / this.progress.end) * PERCENT  );
    $(this.progress.bar).animate({"width" : percent_complete+"%"}, speed);
    if (this.group === this.groups.length - 1)
    {
        $(this.progress.button).hide();
    }
    $(this.instructions).hide('slide', {direction: 'left'}, 150);
};

form_widget.prototype.initialize_progress = function ()
{
    var start = this.progress.start;
    $(this.progress.bar).css({"width" : start+"%"});
};

form_widget.prototype.add_instructions = function (field, text)
{
    this.field_instructions[field] = text;
};

form_widget.prototype.set_instructions = function (element)
{
    var _self = this;
    // Attempts to detrmine the state of the instructions div based on what was based into the method.
    // Before continuing, element must be set to a DOM object which jQuery can manipulate.
    if (typeof element === "string")
    {
        if (typeof document.getElementById(element.replace(/#/,"")) === "undefined")
        {
            this.instructions = document.createElement('div');
            this.instructions.id = element.replace(/#/,"");
            element = this.instructions;
        }
        else
        {
            element = document.getElementById(element.replace(/#/,""));
            this.instructions = element;
        }
    }
    if (this.groups.length === 0)
    {
        var field;
        $.each(this.fields, function(e,obj) {
            $(obj).focus(function() {
                var  name = $(obj).attr('name');
                $(element).hide('slide', {direction: 'left'},150,function() {
                    $(this).empty().text(_self.field_instructions[name]);
                    $(this).show('slide', {direction: 'right'},150);
                });
            });
        });
    }
    else
    {
        var group;
        for (group in this.groups)
        {
            $(this.groups[group]).children().each(function () {
                $(this).focus(function() {
                    var name = this.name;
                    $(element).hide('slide',{direction:'left'},150,function() {
                        $(this).empty().html(_self.field_instructions[name]);
                        $(this).show('slide',{direction:'right'},150);
                    });
                });
            });
        }
    }
};
