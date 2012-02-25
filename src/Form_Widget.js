function form_widget (method, handler, /*optional*/no_overlay, /*required if setting no_overlay to true*/element)
//The form widget class by default creates forms in a lightbox style overlay, which requires the overlay class
//(turnleftllc.com/api/tl_overlay.js)
//
// When instantiating, method is either 'POST' or 'GET'.
// Handler is the form handler URL (php, python, cgi, and so forth).
// no_overlay can be set to true if you wish to render the form in the same layer as the rest of your content
// element is only required if no_overlay is set to true, and should be the element in which you wish the form to appear.
//
// example:
//     var widget = new form_widget('POST', 'scripts/contact.php', true, '#contact_form');
{
    //renders in an overlay unless this is explicitly set to true.
    if (!no_overlay === true)
    {
        this.overlay = new Overlay();
        this.element = this.overlay.div;
    }
    else
    {
        this.element = element;
    }
    this.method = method;
    this.handler = handler;
    this.fields = []; // stores the form fields added after instantiation
    this.groups = []; // stores the groups of form fields, if this method is used
    this.validation_timeout = 500; // default validation timeout (passed into instances of the validator class)
    this.field_instructions = {}; //stores instructions for the fields
    this.swap_char_map = {
        '_x_'     :   'd'           //Will attempt to swap fields with 'key' with fields with 'value' on field focus (useful for password fields)
    };
    this.valid = { // validators go here!
        email   :   new Validator(function(value) {
            //validates the structure of an email address
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
        day_in_month    :   new Validator(function(value) {
            //validates whether an input is a day of the month
                                var val = parseInt(value,10); //Field values will be strings by default
                                return (typeof val === "number"  && val < 32);
                            }),
        currency        :   new Validator(function(value) {
            //validates whether a string can be considered currency
                                var pattern = /^\$?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/;
                                var test_result = pattern.test(value);
                                if (test_result)
                                {
                                    var replace = /[$,]/g;
                                    var output = value.replace(replace, '');
                                    return [true, output];
                                }
                                else
                                {
                                    return pattern.test(test_result);
                                }
                            }),
        percentage      :   new Validator(function(value) {
            //validates a field to see whether it can be parsed as a percentage
                                var percent = /^[0-9]{0,2}\.{0,1}[0-9]{0,2}%{0,1}/; 
                                var decimal = /^(\.(\d*))/;
                                var output;
                                if (decimal.test(value))
                                {
                                    as_float = parseFloat(value,10);
                                    if (as_float > 1)
                                    {
                                        return [true, as_float/100];
                                    }
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
        password        :   new Validator(function(value) {
            //validates a field to see if it's a valid password
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

form_widget.prototype.show_progress = function ()
{
    var group = this.groups[this.progress.current-1];
    var names = group.field_names; //Each of the field names in the group.
    var all = {};
    var show_progress_button = true;
    var i;
    for (i = 0; i < names.length; i++)
    {// for each field name in the list of names
        var n = names[i];   
        var elements = [];  //create an array to hold the location of this field in this.fields[]
        for (var j = 0; j < this.fields.length; j++)
        {
            if (this.fields[j].name === n)
            {
                elements.push(j); //store the location of the field in this.fields[]
            }
        }
        for (var k = 0; k < elements.length; k++)
        {//for each field index in elements
            if (this.fields[k].valid === true) //if the field has been marked as valid
            {
                all[n] = true;
                break;
            }
            else
            {
                all[n] = false;
            }
        }
    }
    for (var m = 0; m < names.length; m++)
    {//for everything we've already done
        if (! all[m])
        {//if it's not true, we cannot progress
            show_progress_button = false;
            break;
        }
    }
    if (show_progress_button === true)
    {
        $(this.progress.button).show();
    }
};

form_widget.prototype.validate = function (field,type)
// on-the-fly validation of a field
{
    this.valid[type].validate(field);
};

form_widget.prototype.add_field = function (type, name, value, /*optional => */css_class, valid_as, required)
// adds a field into the form widget.
// example:
//     widget.add_field("text", "email_address", "Your eMail Address", "form_email_field", "email");
// note that "dropdown" and "radio" require an array of options as their value paramter 
// (see Form create_radio_button method)
{ 
    var test;
    if (typeof valid_as !== "undefined")
    {
        test = this.valid[type].validate;
    }

    var field = new Element(type,name,value,css_class,test,this.show_progress,required);

    this.fields.push(field);
};

form_widget.prototype.grouping = function( group_id, fields) 
// Using grouping will allow you to process methods for individual groups of fields, instead of talking
// to the entire form all at once. In order to group two fields together, they must already be in this.fields[]
// example:
// widget.add_field("text", "email_address", "Your eMail Address", false, "email");
// widget.add_field("text", "first_name", "Your First Name");
// widget.grouping("part_one", ["email_address", "first_name"]);
{
    var name;
    var index;
    var field;
    var group = [];             // Holds the actual field objects gathered from this.fields,
                                // identified by the name in fields[]
    for (name in fields)
    {
      if (typeof fields[name] === "string")
      {
          for (field in this.fields)
          {
              if (typeof this.fields[field] ===  'object')
              {
                  index = this.field_index(fields[name]);
                  group.push(this.fields[index]);
              }
          }
      }
    }
    this.groups.push(new Field_Group(group_id, group));
};

form_widget.prototype.progress_button = function (element)
// if using the grouping method, you must have a progress button. This is where you set it.
// The element parameter can be an id, an id-string (beginning with '#'), or an element itself.
// <div id='progress_button'></div>
// valid:
//     widget.progress_button('progress_button');
//     widget.progress_button('#progress_button');
//     widget.progress_button(document.getElementById('progress_button'));
//     widget.progress_button(jQuery('#progress_button'));
// This way, you don't have to keep track of how you're passing this around, even though you should
// always know what you're passing.
{
    this.progress.button = this.format_element(element);
};

form_widget.prototype.enable_progress_button = function ()
// private method which binds click functionality to the progress bar
// warns the developer in the console if this is called before a progress bar is set.
// It'll help with debugging, just in case you forget. 
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
    $(this.progress.button).hide();
};

form_widget.prototype.name_swap = function (str)
// Iterates through the swap_char_map property, searching for instances of the keys, replacing them with the keyed values.
// Returns after the first match, otherwise, returns the string in its original form.
{
    var ch;
    for (ch in this.swap_char_map)
    {
        if (typeof this.swap_char_map[ch] === 'string')
        {
            var pattern = new RegExp(ch);
            if (pattern.test(str))
            {
                return str.replace(pattern, this.swap_char_map[ch]);
            }
        }
    }
    return str;
};

form_widget.prototype.create_form = function (/*optional =>*/form_name, css_class)
// After setting all of the form information, adding fields, groups, etc., you call this method 
// to build the form and append it to your document.
//
// var widget = new form_widget('POST', 'handler.php');
// widget.add_field('text', 'first_name', 'Your First Name');
// widget.add_field('text', 'last_name', 'Your Last Name');
// widget.add_field('submit', 'submit', 'Register');
// widget.create_form();
// widget.set_ajax(true, function() {widget.overlay.fade();});
// 
// The above example creates a form which fades in an overlay, shadowing the main page content,
// takes the user's first and last name, and sends it to the handler.php script via an ajax post, fading
// the form out upon completion.
{
    var _self_ = this;
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
        this.enable_progress_button();
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
        var name = this.name;
        var swap = _self_.name_swap(name);
        $(this).remove();
        $('input[name='+swap+']').show().focus();
        return false;
    });
};

form_widget.prototype.format_element = function (el)
// takes an argument, determines whether it's a DOM object or a string, and
// returns it as a DOM object, otherwise, returns the object unchanged..
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
};

form_widget.prototype.set_ajax = function(bool, success_callback)
// sets whether a form should be submitted asynchronously.
// REQUIRES the ajaxSubmit plugin found here: http://jquery.malsup.com/form/
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
// Private method that extends the progress bar, changes the form content to that of the next content group,
// and animates it all. 
// Does not need to be called implicitly. Called by default when the progress button is clicked.
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
// A private method that starts the progress bar. Called during the create_form method.
{
    var start = this.progress.start;
    $(this.progress.bar).css({"width" : start+"%"});
};

form_widget.prototype.add_instructions = function (field, text)
// Allows the addition of instructions to a form field. Instructions are shown when a field has focus.
// example:
//     widget.add_field('password', user_pw, /*it's annoying to put values in password fields*/, "");
//     widget.add_instructions('password', 'Please enter the password you created when registering.');
{
    this.field_instructions[field] = text;
};

form_widget.prototype.field_index = function (field)
{
    for (var i = 0; i < this.fields.length; i++)
    {
        if (this.fields[i].model.name === field)
        {
            return i;
        }
    }
    return undefined;
};

form_widget.prototype.add_text = function (field, text)
{
    var index = this.field_index(field);
    var div = document.createElement('div');
    div.innerHTML = text;
    div.appendChild(this.fields[index]);
    div.name = this.fields[index].name;
    $(div).addClass('form flavor');
    this.fields[index] = div;
};

form_widget.prototype.set_instructions = function (element)
// Sets the DOM object in which the instructions should appear. 
// continuing the above example:
//     widget.set_instructions('#instructions');
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
