function Form() {
    this.create_text_field = function(name, value, style) {
        if (!name) {
            name = "text_field"
        }
        field = document.createElement('input');
        $(field).attr('type', 'text');
        $(field).attr('name', name);
        if (value) {
            $(field).attr('value', value);
        }
        if (style) {
            $(field).addClass(style);
        }
        return field;
    }

    this.create_dropdown_menu = function (name, values, style) {
        var dropdown = document.createElement('select');
        $(dropdown).attr({"name" : name, "class" : style});
        for (value in values) {
            var option = document.createElement('option');
            $(option).attr('value', values[value]);
            $(option).text(values[value]);
            $(dropdown).append(option);
        }
        return dropdown;
    }

    this.create_password_field = function(name, value, style) {
        if (!name) {
            name="password"
        }
        field=document.createElement('input');
        $(field).attr('type', 'password');
        $(field).attr('name', name);
        if (value) {
            $(field).attr('value', value);
        }
        if (style) {
            $(field).addClass(style)
        }
        return field;
    }

    this.create_button = function(name, value, style, image) {
        var button = document.createElement('input');
        if (!value) {
            value = "Button";
        }
        if (!image) {
            $(button).attr('type', 'button');
        }
        else {
            $(button).attr('type', 'image');
        }
        if (name) {
            $(button).attr('name', name);
        }
        if (style) {
            $(button).attr('class', style);
        }
        return button;
    }

    this.create_submit_button = function(name, value, style, image) {
        if (!value) {
            value = "Submit";
        }
        if (!image) {
            button = document.createElement('input');
            $(button).attr('type', 'submit');
            $(button).attr('value', value);
        }
        else {
            button = document.createElement('input');
            $(button).attr('type', 'image');
            $(button).attr('src', image);
        }
        if (style) {
            $(button).attr('class', style);
            }

        if (name) {
            $(button).attr('name', name)
        }
        $(button).text(value);
        return button;
    }
    this.create_fake_button = function (name, value, style ) {
        var fake = document.createElement('span');
        if (style) {
            $(fake).attr('class', style);
        }
        if (name) {
            $(fake).attr('name', name);
        }
        $(fake).text(value);
        return fake;
    }

    this.create_hidden_field = function (name, value) {
        var hidden = document.createElement('input');
        $(hidden).attr('type', 'hidden');
        $(hidden).attr('name', name);
        $(hidden).attr('value', value);
        return hidden;
    }

    this.create_file_upload = function(name, style) {
        var file_upload = document.createElement('input');
        $(file_upload).attr('type', 'file');
        $(file_upload).attr('name',name);
        if (style) $(file_upload).attr('class', 'style');
        return file_upload;
    }
        

    this.create_link_button = function (value, href, style) {
	    var link = document.createElement('a');
	    if (!href) {
		    href = "#";
	    }
	    $(link).attr('href', href);
	    if (style) {
		    $(link).attr('class', style);
	    }
	    $(link).text(value);
	    return link;
    }

    this.create_textarea = function (name, value, style) {
        var textarea = document.createElement('textarea');
        $(textarea).attr('name', name);
        if (style) $(textarea).attr('class', style);
        $(textarea).text(value);
        return textarea
    }

    this.convert_link_anchor = function ( element) {
        var html = "<a href='" + $(element).attr('href'); 
        if ( ($(element).attr('href').charAt($(element).attr('href').length-1)) != '/') {
            html += "/";
        }
        html+= "' ";
        if ($(element).attr('class')) {
            html += "class='"+$(element).attr('class')+"'";
        }
        html += ">"+$(element).text()+"</a>";
        return html;
    }

    this.convert_input_field = function(element) {
        var html = "<input type='" + $(element).attr('type') + "' ";
        html += "name='" + $(element).attr('name') + "' ";
        if ($(element).attr('value')) {
            html += "value='" + $(element).attr('value') + "' ";
        }
        if ($(element).attr('type') == 'image') {
            html += "src='" + $(element).attr('src') + "' ";
        }
        if ($(element).attr('class')) {
            html += "class='" + $(element).attr('class') + "' ";
        }
        html += "/>";
        return html;
    }            
    this.convert_span = function(element) {
        var html = "<span ";
        if ($(element).attr('name')) {
            html += "name='"+$(element).attr('name')+"' ";
        }
        if ($(element).attr('class')) {
            html += "class='"+$(element).attr('class')+"' ";
        }
        html += ">"+$(element).text()+"</span>";
        return html;
    }

    this.convert_textarea = function(element) {
        var html = "<textarea ";
        html += "name='"+$(element).attr('name')+"' ";
        if ($(element).attr('class')) html += "class='"+$(element).attr('class')+"' ";
        html += ">"+$(element).text()+"</textarea>";
        return html;
    }

    this.convert_dropdown_menu = function(element) {
        var html = "<select name='"+$(element).attr('name')+"' ";
        if ($(element).attr('class') != "") {
            html += " class='"+$(element).attr('class')+"' ";
        }
        html += ">"; 
        var option = new Object;
        option.array = Array();
        $(element).find('option').each(function() {
            option.array.push($(this));
        });
        for (item in option.array) {
            html += "<option value='"+ $(option.array[item]).attr('value') + "'>"+$(option.array[item]).text()+"</option>";
        }
        html += "</select>";
        return html;

    } 
    this.conversion_functions = {
        "INPUT"        :    this.convert_input_field,
        "SPAN"         :    this.convert_span,
        "A"            :    this.convert_link_anchor,
        "SELECT"       :    this.convert_dropdown_menu,
        "TEXTAREA"     :    this.convert_textarea
    }

    this.as_html = function(elements, method, url, is_already_html, is_upload_form) {
        var html = "<form method='" + method + "' action='"+url+"' ";
        if (is_upload_form) {
            html += "enctype='multipart/form-data' ";
        }
        html += ">";
        if (! is_already_html) {
            for (var i = 0; i < elements.length; i++) {
                html += this.conversion_functions[elements[i].nodeName](elements[i])
                    
            }
        }
        else {
            html += elements;
        }

        html += "</form>";
        return html;
    }
}
    
