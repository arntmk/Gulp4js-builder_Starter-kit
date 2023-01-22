// Custom Select

setSelectHover();

function setSelectHover(selector = 'select') {
	let selects = document.querySelectorAll(selector);
	selects.forEach((select) => {
		let selectWrap = select.parentNode.closest('.select-wrap');
		// wrap select element if not previously wrapped
		if (!selectWrap) {
			selectWrap = document.createElement('div');
			selectWrap.classList.add('select-wrap');
			select.parentNode.insertBefore(selectWrap, select);
			selectWrap.appendChild(select);
		}
		// set expanded height according to options
		let size = select.querySelectorAll('option').length;

		// adjust height on resize
		const getSelectHeight = () => {
			selectWrap.style.height = 'auto';
			let selectHeight = select.getBoundingClientRect();
			selectWrap.style.height = selectHeight.height + 'px';
		};
		getSelectHeight(select);
		window.addEventListener('resize', (e) => {
			getSelectHeight(select);
		});

		/**
		 * focus and click events will coincide
		 * adding a delay via setTimeout() enables the handling of
		 * clicks events after the select is focused
		 */
		let hasFocus = false;
		select.addEventListener('focus', (e) => {
			select.setAttribute('size', size);
			setTimeout(() => {
				hasFocus = true;
			}, 150);
		});

		// close select if already expanded via focus event
		select.addEventListener('click', (e) => {
			if (hasFocus) {
				select.blur();
				hasFocus = false;
			}
		});

		// close select if selection was set via keyboard controls
		select.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				select.removeAttribute('size');
				select.blur();
			}
		});

		// collapse select
		select.addEventListener('blur', (e) => {
			select.removeAttribute('size');
			hasFocus = false;
		});
	});
}
