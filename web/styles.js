function changeTheStylingOfCheckboxesWhenClicked() {
    const checkboxes = document.querySelectorAll('.checkbox-element');

    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const parent = this.closest('.checkbox-container');
            if (this.checked) {
                parent.classList.add('checked-javascript');
            } else {
                parent.classList.remove('checked-javascript');
            }
        });
    });

}



//starting all style modules
changeTheStylingOfCheckboxesWhenClicked()