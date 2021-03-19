window.addEvent('domready', function() {
	/* mapper defines which anchor tags open in either iframe or layer */
	new iframe_selector({
		selectors: {
			'.formrow_optin .poplink': {
				'type': 'iframe'
			},
			'#footer': {
				'type': 'iframe'
			}
		}
	});

	add_pop_iframe_closer_events();

	if(current_page == 'page_pregame') {
		initialize_quiz();
	}

	if(current_page == 'page_reg_half' || current_page == 'page_reg_full'){
		var this_page = current_page.replace('page_','');

		$$('.formrow_title label').addEvent('click', function() {
			$$('.formrow_title label').removeClass('active');
			$(this).addClass('active');
		});

		$$('select').each(function(el) {
			if(el.get('data-value')) {
			  el.set('value', el.get('data-value'));
			}
		});

		if ($$('#optin_layer').length > 0) {
			var optinlayer = new Optin_layer({
				form_id: 'form_'+this_page
			});
		}

		mooli = new Moolidator_Lite({
			'form_id': 'form_'+this_page,
			'debug' : false,
			'submit_button_id': 'submit_'+this_page,
			'rules': moolidator_lite_rules,
			'countries': moolidator_lite_countries
		});
		mooli.addEvents({
			'moolidator_lite_submit': function() {
				if(optinlayer){
					if(optinlayer.test_checkboxes() === false) {
						optinlayer.show();
					} else {
						if(page_submitted === false) {
							page_submitted = true;
							// send misc log before submit
							new Request({
								'url': '/cgi-bin/global.pl?todo=log_misc&ident=optin_layer_consent_both',
								onComplete: function() {
									$('form_'+this_page).submit();
								}
							}).send();
						}
					}
				} else {
					if(page_submitted === false) {
						page_submitted = true;
						$('form_'+this_page).submit();
					}
				}          
                return false;
            }
		});

		mooli.options.rules['default'].wingame_special_agb2 = {};
        mooli.options.rules['default'].wingame_special_agb2 = mooli.options.rules['default'].agb;
		mooli.options.rules['default'].firstname.negative.push(/^Nome$/i);
        mooli.options.rules['default'].lastname.negative.push(/^Cognome$/i);
		mooli.options.rules['default'].city.negative.push(/^LocalitÃ $/i);
		mooli.options.rules.it.street.negative.push(/^Nome via$/i);

	}
});