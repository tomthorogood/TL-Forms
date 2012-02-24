function Field_Group (name, array)
{
    this.inputs = [];
    this.field_names = [];
    this.div = document.createElement('div');
    $(this.div).addClass('tl form group');
    for (var i = 0; i < array.length; i++)
    {
        this.div.appendChild(array[i].model);
        this.inputs.push(array[i].input);
        this.field_names.push(array[i].name);
    }
}

