function tinyMCEPackage( selector, container_elem, destroy) {
	if ( destroy )
	{
		tinymce.remove();
		return null;
	}

	tinymce.init({
		selector : selector,
		ui_container : container_elem,
	  	theme : 'modern',
	  	plugins : [
			'link lists advlist charmap code image wordcount'
	  	],
	});
}