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

function Parse (string)
{
    if (/::/.test(string))
    {
        return string.split(/::/g);
    }
    return [string,string];
}


function Form() 
{
    this.parse = {
        value : function(string)
        {
            return Parse(string)[0];
        },
        display : function(string)
        {
            return Parse(string)[1];
        },
        selected : function(string)
        {
            return Parse(string)[2];
        }
    };
}

Form.prototype.create_text_field = function (name, value, style)
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
};

Form.prototype.create_password_field = function (name, value, style)
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
    return button;
};
    
Form.prototype.create_fake_button = function (name, value, style)
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
{
    var hidden = document.createElement('input');
    hidden.type = "hidden";
    hidden.name = name;
    hidden.value = value;
    return hidden;
};

Form.prototype.create_file_upload = function (name, style)
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



Form.create_multi_button = function (name, values, style, type)
{
    var div = document.createElement('div');
    var value;
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

Form.create_radio_button = function (name, values, style)
{
    return this.create_multi_button(name, values, style, "radio");
};

Form.create_checkbox = function (name, values, style)
{
    return this.create_multi_button(name, values, style, "checkbox");
};
