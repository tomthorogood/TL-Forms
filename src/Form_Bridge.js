//................
// TL-Forms
//  Form Bridge
//      This is an abstraction layer that bridges the Element class to the Form class,
//      so that if the Form class changes, the Element class does not have to be altered.

function Form_Bridge ()
{
    this.creator = new Form();
}

Form_Bridge.prototype.create_text_field = function (name,value,css)
{
    return this.creator.create_text_field(name,value,css);
};

Form_Bridge.prototype.create_hidden_field = function (name,value)
{
    return this.creator.create_hidden_field(name,value);
};

Form_Bridge.prototype.create_dropdown_menu = function (name,values,css)
{
    return this.creator.create_dropdown_menu(name,values,css);
};

Form_Bridge.prototype.create_submit_button = function (name, value, css)
{
    return this.creator.create_submit_button (name,value,css);
};

Form_Bridge.prototype.create_radio_button = function (name,value,css)
{
    return this.creator.create_radio_button(name,value,css);
};

Form_Bridge.prototype.create_textarea = function (name,value,css)
{
    return this.creator.create_textarea(name,value,css);
};
