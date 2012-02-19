function validator (against, delay, valid_css, invalid_css)
{
    this.delay = delay || 650;
    this.css = {
        valid   :   valid_css || {"background-color" : "#00afad","color" : "#fff"},
        invalid :   invalid_css || {"background-color" : "#811", "color" : "#fff"}
    };
    this.test = against;
    this.set_text = {};
    this.validate = function (element)
    {
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
