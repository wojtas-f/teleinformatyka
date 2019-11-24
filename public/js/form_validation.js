/**
 * Funkcja validateRegisterForm służy do wstępnej walidacji pól formularza rejestracyjnego. Walidator sprawdza zgodność numeru albumu z numerem znajdującym się w adresie email oraz sprawdza czy oba wprowadzane hasła są identyczne
 * @function validateRegisterForm
 * @property {Element} errorDisplay - Element formularza odpowiedzialny za wyświetlanie komunikatów o błedzie
 * @property {Element} album - Numer albumu wprowadzony do formularza
 * @property {Element} email - Adres email wprowadzony do formularza
 * @property {Element} password - Hasło wprowadzone do formularza
 * @property {Element} rep_password - Potwierdzenie hasła wprowadzone do formularza
 */
const validateRegisterForm = () => {
    const errorDisplay = document.getElementById('errorDisplay')
    const album = document.forms['register_form']['album']
    const email = document.forms['register_form']['email']
    const password = document.forms['register_form']['password']
    const rep_password = document.forms['register_form']['rep_password']

    if (album.value.length !== 6) {
        console.log('album')
        errorDisplay.innerText = 'Numer albumu jest niepoprawny'
        return false
    }
    if (!email.value.includes(album.value)) {
        console.log('email')
        errorDisplay.innerText =
            'Numer albumu w adresie email nie zgadza się z wprowadzonym numerem albumu'
        return false
    }
    if (password.value !== rep_password.value) {
        console.log('hasło')
        errorDisplay.innerText = 'Hasła muszą być identyczne'
        return false
    }
    return true
}
