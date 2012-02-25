if(typeof navigator!=="undefined"){var IE_MODE=navigator.appName==="Microsoft Internet Explorer"}String.prototype.toTitleCase=function(){var a=/^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;return this.replace(/([^\W_]+[^\s\-]*) */g,function(c,e,b,d){if(b>0&&b+e.length!==d.length&&e.search(a)>-1&&d.charAt(b-2)!==":"&&d.charAt(b-1).search(/[^\s\-]/)<0){return c.toLowerCase()}if(e.substr(1).search(/[A-Z]|\../)>-1){return c}return c.charAt(0).toUpperCase()+c.substr(1)})};function Parse(a){if(/::/.test(a)){return a.split(/::/g)}return[a,a]}function Form(){this.parse={value:function(a){return Parse(a)[0]},display:function(a){return Parse(a)[1]},selected:function(a){return Parse(a)[2]}}}Form.prototype.IE_Compliant=function(a){if(IE_MODE){var b=document.createElement("div");b.name=a.name;b.appendChild(a);return b}return a};Form.prototype.create_text_field=function(a,c,b){if(typeof a==="undefined"){a="text_field"}var d=document.createElement("input");d.type="text";d.name=a;d.value=c||"";if(typeof b==="string"){$(d).addClass(b)}return this.IE_Compliant(d)};Form.prototype.create_dropdown_menu=function(b,a,d,f){var h=document.createElement("select");if(typeof b==="undefined"){b="dropdown"}h.name=b;for(var e in a){if(typeof e!=="undefined"){var g=a[e];if(!f||typeof f==="undefined"){g=g.replace(/_/g," ").toTitleCase()}var c=document.createElement("option");c.value=this.parse.value(g);c.innerHTML=this.parse.display(g);h.appendChild(c)}}if(typeof d==="string"){$(h).addClass(d)}return h};Form.prototype.create_password_field=function(a,c,b){if(typeof a==="undefined"){a="password"}var d=document.createElement("input");d.type="password";d.name=a;if(typeof c==="string"){d.value=c}if(typeof b==="string"){$(d).addClass(b)}return this.IE_Compliant(d)};Form.prototype.create_submit_button=function(a,d,c,e){var b;if(typeof d==="undefined"){d="Submit"}if(typeof e==="undefined"){b=document.createElement("input");b.type="submit";b.value=d}else{b=document.createElement("input");b.type="image";b.src=e}if(typeof c==="string"){$(b).addClass(c)}b.name=a||"submit";return this.IE_Compliant(b)};Form.prototype.create_hidden_field=function(a,c){var b=document.createElement("input");b.type="hidden";b.name=a;b.value=c;return b};Form.prototype.create_file_upload=function(b,c){var a=document.createElement("input");a.type="file";a.name=b;if(typeof c==="string"){$(a).addClass(c)}return this.IE_Compliant(a)};Form.create_textarea=function(b,d,c){var a=document.createElement("textarea");if(typeof b==="undefined"){b="textarea"}if(typeof c==="string"){$(a).addClass(c)}if(typeof d==="string"){a.innerHTML=d}return this.IE_Compliant(a)};Form.prototype.create_multi_button=function(c,i,b,g){var a=document.createElement("div");var h;a.name=c;for(h in i){if(typeof h==="string"){var f=document.createElement("div");var j=document.createElement("span");if(typeof b==="string"){$(f).addClass(b)}var e=document.createElement("input");if(typeof c==="undefined"){c=g}e.name=c;e.type=g;e.value=this.parse.value(i[h]);if(this.parse.selected(i[h])==="Selected"){e.checked="checked"}j.innerHTML=this.parse.display(i[h]);f.appendChild(e);f.appendChild(j);a.appendChild(f)}}return a};Form.prototype.create_radio_button=function(b,a,c){return this.create_multi_button(b,a,c,"radio")};Form.prototype.create_checkbox=function(b,a,c){return this.create_multi_button(b,a,c,"checkbox")};var tl_form=new Form();function Element(g,b,h,j,d,i,f){this.type=g;this.callback=i||function(){return true};this.input=[];this.name=b;this.validator=typeof d!=="undefined"?new Validator(d,function(){return this.callback()}):undefined;this.required=typeof f!=="undefined"?f:false;this.valid=!(typeof this.validator!=="undefined"&&this.required===true);switch(this.type){case"text":this.model=tl_form.create_text_field(b,h,j);this.tag="input";break;case"hidden":this.model=tl_form.create_hidden_field(b,h);this.tag="input";break;case"password":this.model=tl_form.create_password_field(b,h,j);this.tag="input";break;case"dropdown":this.model=tl_form.create_dropdown_menu(b,h,j);this.tag="select";break;case"submit":this.model=tl_form.create_submit_button(b,h,j);this.tag="input";break;case"radio":this.model=tl_form.create_radio_button(b,h,j);this.tag="input";break;case"textarea":this.model=tl_form.create_textarea(b,h,j);this.tag="textarea"}var a=(this.model.getElementsByTagName(this.tag));for(var c in a){if(typeof c!=="undefined"){this.input.push(a[c])}}}function Field_Group(a,c){this.inputs=[];this.field_names=[];this.div=document.createElement("div");$(this.div).addClass("tl form group");for(var b=0;b<c.length;b++){this.div.appendChild(c[b].model);this.inputs.push(c[b].input);this.field_names.push(c[b].name)}}function Validator(b,a,e,d,c){this.ANIMATION_SPEED=e||250;this.DELAY=a||650;this.css={valid:d||{"background-color":"#00afad",color:"#fff"},invalid:c||{"background-color":"#811",color:"#fff"}};this.test=b;this.set_text={};this.validate=function(h){var f=this;var k;var j;if(h.type.toLowerCase()==="radio"){for(var g=0;g<h.input.length;g++){$(h.input[g]).change(function(){return function(){var l=this.value;j=f.test(l);var i=j?f.css.valid:f.css.invalid;h.valid=j;$(h).animate(i,f.ANIMATION_SPEED)}})}}else{$(h).keyup(function(){$(this).keydown(function(i){if(i.keyCode!==9){clearTimeout(k)}});if(typeof h.value!=="undefined"&&h.value.length>0){k=setTimeout(function(){j=f.test(h.value);switch(typeof j){case"object":f.set_text[h.name]=j[1].toString();j=j[0];case"boolean":var i=j?f.css.valid:f.css.invalid;h.valid=j;break;default:j=true;h.valid=j}$(h.input[0]).animate(i,f.ANIMATION_SPEED,function(){if(typeof f.set_text[h.name]==="string"){h.input[0].value=f.set_text[h.name];delete f.set_text[h.name]}})},f.DELAY)}})}}}function form_widget(d,c,b,a){if(!b===true){this.overlay=new Overlay();this.element=this.overlay.div}else{this.element=a}this.method=d;this.handler=c;this.fields=[];this.groups=[];this.validation_timeout=500;this.field_instructions={};this.swap_char_map={_x_:"d"};this.valid={email:new Validator(function(h){var g=/[A-Za-z0-9%._\-]*@[A-Zz-z0-9\-]*\.[a-zA-Z0-9]{2,4}/gi;var f;var e;if(g.test(h)){f=true}switch(f){case true:return true;case false:return[false,"That email address already exists in our system."];default:return false}}),day_in_month:new Validator(function(e){var f=parseInt(e,10);return(typeof f==="number"&&f<32)}),currency:new Validator(function(h){var g=/^\$?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/;if(g.test(h)){var f=/[$,]/g;var e=h.replace(f,"");return[true,e]}else{return g.test(h)}}),match:new Validator(function(f){var e=document.getElementsByName("password1");if(e.length>0){return f===$(e[0]).val()}else{return true}}),percentage:new Validator(function(h){var g=/^[0-9]{0,2}\.{0,1}[0-9]{0,2}%{0,1}/;var e=/^(\.(\d*))/;if(e.test(h)){return true}else{if(g.test(h)){var f=parseInt(h.replace(/\%/g,""),10);f/=100;return[true,f]}else{return false}}}),password:new Validator(function(f){var e=/\\\/\(\)\{\};/g;var g=6;if(!e.test(f)){if(f.length>=g){return true}else{return false}}else{return false}})}}form_widget.prototype.show_progress=function(){var o=this.groups[this.progress.current-1];var h=o.field_names;var l={};var g=true;var f;for(f=0;f<h.length;f++){var b=h[f];var a=[];for(var e=0;e<this.fields.length;e++){if(this.fields[e].name===b){a.push(e)}}for(var d=0;d<a.length;d++){if(this.fields[d].valid===true){l[b]=true;break}else{l[b]=false}}}for(var c=0;c<h.length;c++){if(!l[c]){g=false;break}}if(g===true){$(this.progress.button).show()}};form_widget.prototype.validate=function(b,a){this.valid[a].validate(b)};form_widget.prototype.add_field=function(b,a,d,c,g,f){var h;if(typeof g!=="undefined"){h=this.valid[b].validate}var e=new Element(b,a,d,c,h,this.show_progress,f);this.fields.push(e)};form_widget.prototype.grouping=function(d,a){var c;var b;var f;var e=[];for(c in a){if(typeof a[c]==="string"){for(f in this.fields){if(typeof this.fields[f]==="object"){b=this.field_index(a[c]);e.push(this.fields[b])}}}}this.groups.push(new Field_Group(d,e))};form_widget.prototype.progress_button=function(a){this.progress.button=this.format_element(a)};form_widget.prototype.enable_progress_button=function(){var a=this;$(a.progress.button).click(function(){$(a.groups[a.group]).hide("slide",{direction:"left"},250,function(){a.group++;$(a.groups[a.group]).show("slide",{direction:"right"},250);if(typeof a.progress.bar!=="undefined"){a._progress()}})});$(this.progress.button).hide()};form_widget.prototype.name_swap=function(c){var a;for(a in this.swap_char_map){if(typeof this.swap_char_map[a]==="string"){var b=new RegExp(a);if(b.test(c)){return c.replace(b,this.swap_char_map[a])}}}return c};form_widget.prototype.create_form=function(b,e){var a=this;var j;var d=document.createElement("form");if(typeof b!=="undefined"){d.id=b}if(typeof e!=="undefined"){d.className=e}d.setAttribute("method",this.method);d.setAttribute("action",this.handler);if(this.groups.length===0){for(j in this.fields){var h=this.fields[j];if(typeof h==="object"){d.appendChild(h)}}}else{for(var i in this.groups){var c=this.groups[i];if(typeof c==="object"){d.appendChild(c)}}this.group=0;$(this.groups[this.group]).show("slide",{direction:"right"},250);this.enable_progress_button();if(this.progress.end===0){this.progress.end=this.groups.length}this.initialize_progress()}$("input[type=text]",d).one("focus",function(){$(this).val("")});this.element.appendChild(d);$(".swap.focus").hide();$(".swap.default").one("focus",function(){var f=this.name;var g=a.name_swap(f);$(this).remove();$("input[name="+g+"]").show().focus();return false})};form_widget.prototype.format_element=function(a){if(typeof a==="object"){return a}if(a[0]!=="#"){a="#"+a}return $(a)};form_widget.prototype.set_ajax=function(a,b){if(a===true){$("form",this.element).submit(function(){var c={success:b};$(this).ajaxSubmit(c);return false})}else{$("form",this.element).unbind("submit")}};form_widget.prototype.track_progress=function(b,a){this.progress={container:b,bar:a,speed:250,tracking:true,start:0,current:1,end:0}};form_widget.prototype._progress=function(){var a=100;this.progress.current++;var c=this.progress.speed;var b=Math.floor((this.progress.current/this.progress.end)*a);$(this.progress.bar).animate({width:b+"%"},c);if(this.group===this.groups.length-1){$(this.progress.button).hide()}$(this.instructions).hide("slide",{direction:"left"},150)};form_widget.prototype.initialize_progress=function(){var a=this.progress.start;$(this.progress.bar).css({width:a+"%"})};form_widget.prototype.add_instructions=function(a,b){this.field_instructions[a]=b};form_widget.prototype.field_index=function(b){for(var a=0;a<this.fields.length;a++){if(this.fields[a].model.name===b){return a}}return undefined};form_widget.prototype.add_text=function(b,c){var a=this.field_index(b);var d=document.createElement("div");d.innerHTML=c;d.appendChild(this.fields[a]);d.name=this.fields[a].name;$(d).addClass("form flavor");this.fields[a]=d};form_widget.prototype.set_instructions=function(b){var a=this;if(typeof b==="string"){if(typeof document.getElementById(b.replace(/#/,""))==="undefined"){this.instructions=document.createElement("div");this.instructions.id=b.replace(/#/,"");b=this.instructions}else{b=document.getElementById(b.replace(/#/,""));this.instructions=b}}if(this.groups.length===0){var d;$.each(this.fields,function(g,f){$(f).focus(function(){var e=$(f).attr("name");$(b).hide("slide",{direction:"left"},150,function(){$(this).empty().text(a.field_instructions[e]);$(this).show("slide",{direction:"right"},150)})})})}else{var c;for(c in this.groups){$(this.groups[c]).children().each(function(){$(this).focus(function(){var e=this.name;$(b).hide("slide",{direction:"left"},150,function(){$(this).empty().html(a.field_instructions[e]);$(this).show("slide",{direction:"right"},150)})})})}}};