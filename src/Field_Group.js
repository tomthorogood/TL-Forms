/**@Class Field_Group 
 * A group of fields that should be displayed and validated together.
 * @param {String} name The name of the group
 * @param {Object} array An array of objects of the Element class.
 */

function Field_Group (name, array)
{
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

