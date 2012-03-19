/**@Class Field_Group 
 * A group of fields that should be displayed and validated together.
 * @param {String} name The name of the group
 * @param {Object} array An array of objects of the Element class.
 */

function Field_Group (name, array)
{
    this.elements = array;
    this.inputs = [];
    this.field_names = [];
    this.div = document.createElement('div');
    $(this.div).addClass('tl form group').hide();
    for (var i = 0; i < array.length; i++)
    {
        this.div.appendChild(array[i].model);
        this.inputs.push(array[i].input);
        this.field_names.push(array[i].name);
    }
}

Field_Group.prototype.add_text = function (text, where, css)
{
    var div = document.createElement('div');
    if (typeof css === "string")
    {
        $(div).addClass(css);
    }
    else if (typeof css === "object")
    {
        $(div).css(css);
    }
    div.innerHTML = text;

    switch(where)
    {
        case "before"   :   $(this.div).prepend(div);
                            break;
        case "after"    :   $(this.div).append(div);
                            break;
    }
}

Field_Group.prototype.prepend_text = function (text, css)
{
    this.add_text(text, "before", css);
}

Field_Group.prototype.append_text = function (text,css)
{
    this.add_text(text, "after", css);
}

