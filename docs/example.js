/* This example should _NOT_ be used by itself. It is only an
 * example of how to build form widgets with this library.
 */

/* STEP ONE: Create a Widget */

var widget = new Form_Widget(
        'POST'  // How should this form be processed?
        'formHandler.php' // What is processing this form?
        document.getElementById('form_div') // Where will the form go?
        );

/* STEP TWO: Let's add some fields! */

widget.add_field({
    type    :   'text',
    name    :   'first_name',
    valid_as:   'no_digits',
    required:   true,
    value   :   'Your First Name'
    });

/* The above statement will create a text field which already has the value 'Your First Name'. 
 * However, all fields will automatically clear once they take focus. What if the user forgets
 * what they are supposed to type there? No problem. We can add instructions like so:
 */

widget.add_instructions('first_name', 'Enter your first name here.');
/* Now, when a user focuses on this field, instructions will appear in a div you declare later on. */

widget.add_field({
    type    :   'password',
    name    :   'password',
    required:   true
    valid_as:   'valid_password'
    });

/* Please do not include a 'value' for password fields. It just confuses your users! 
 * The Form Widget comes with some validators already built in. The above 'valid_password' is
 * not among them. What do you do?
 * Again. No problem. We simply have to define it like so:
 */

widget.valid.valid_password = new Validator( function(value) {
        var length = value.length > 8 //Let's make sure the password has at least eight charaters.
        var one_uppercase = new RegExp('[A-Z]').test(value) //and at least one uppercase letter
        var one_digit = new RegExp('[0-9]').test(value) // and at least one lowercase letter
        var bad_things = new RegExp('[\/\\;\,\%]').test(value) // and no dangerous SQL characters.
        return length && one_uppercase && one_digit && !bad_things;
});

/* Now, when a field has valid_as set to 'valid_password', it will automatically check and validate
 * against our test as the user types in this field. Depending on your widget setup, it will not 
 * allow the user to continue if required, validated fields come back as invalid.
 * For good measure, let's do one more:
 */

widget.valid.password_match = new Validator( function(value) {
        var other_password = $('input[name=password]').val();
        return value === other_password;
});

widget.add_field({
    type    :   'password',
    name    :   'password_conf',
    required:   true,
    valid_as:   'password_match'
});

/* So, great! But we're going to have a lot of information in this form, and we don't want
 * to bombard the user all at once with a billion fields. Let's break it up a bit!
 * This is done by ambandoning the top-down format entirely by simply using the following
 * statement.
 */
widget.grouping('Name & Password', ['name', 'password', 'pasword_conf']);
/* That's it? That's it.  But it won't do any good if you don't have a way for the user
 * to progress after completing this group.
 */
widget.progress_button( document.getElementById('click_to_continue') );

/* We're also REALLY nice, and want to provide our users with a progress bar that 
 * shows how far along they are. Again, this is accomplished with a single statement.
 */
widget.enable_progress_bar (
        /* The progress bar needs a parent and child element. */
        document.getElementById('progress_bar_parent'),
        document.getElementById('actual_progress_bar')
        );

/* Let's get their email address and most personal secret now: */

widget.add_field({
    type    :   'text',
    name    :   'email_address',
    required:   true,
    valid_as:   'email', /* included in the library! */
    value   :   'Email Address'
    });
widget.add_field({
    type    :   'textarea',
    name    :   'deepest_secret',
    required:   true,
    valid_as:   'value' /*make sure they type _something_. */,
    value   :   'Tell me your deepest secret. You have no choice.'
});

widget.add_instructions('email_address', 'Enter your email address here so we can send you lots of spam!');
widget.add_instructions('deepeset_secret', 'We need to know your deepest secret for blackmail purposes.');
widget.grouping('Spam & Blackmail', ['email_address', 'deepest_secret']);

/* Lastly, we'll need a submit button, plus some flavor text. */
widget.add_field({
    type    :   'submit',
    name    :   'submit_button',
    value   :   'All Done!'
});

var flavor_text = document.createElement('div');
flavor_text.innerHTML = 'Thanks for filling out this form! I hope you enjoy being harrassed for years to come!';

/* This bit is just a tad complicated, and we'll be adding a method to do this in the future: */
widget.grouping('The End', ['submit']); // Nothing unusual here.
$(widget.groups[widget.groups.length-1].model).prepend(flavor_text);
/* That picks the last group's div out of your widget, and prepends the flavor text to be 
 * before the submit button. Breaking it down: 
 *      widget.groups   <-- This is an array of all the groups you've created.
 *      [widget.groups.length-1]    <-- This picks the last element of the array, 
 *                                      the group you just created.
 *      .model  <-- The library refers to HTML elements as models. 
 *      $(...).prepend <-- Uses the jQuery method for prepending information to a DOM element.
 *
 *      Okay, that wasn't so bad.
 * 
 * We're almost done! Now, all we have to do is turn everything on.
 */

widget.set_ajax('true', 'formHandler.php', function () { 
        var i = 0;
        while (i < 1000)
        {
            alert('YOU ARE ALL DONE WITH THAT COOL FORM BRO');
        }
);

/* The above code will submit the form via ajax, and upon success, will send the alert 1000 times.
 * Don't actually use this example, for the love of all that is holy.
 */

widget.set_instructions( document.getElementById('instructions') ); 
/* Make sure to tell the widget where your instructions should go. */

widget.create_form('You can give it a name here if you want, though this is currently unused.');

/* And that's it! Now you have an animated, live validating form.
 * Feel free to ask questions to Tom at:
 * @TAThorogood
 * or github.com/tomthorogood/
 * or tom@tomthorogood.com
 */

