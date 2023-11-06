import {useTransContext} from '@mbarzda/solid-i18next';
import './languageMenu.css';
import {createSignal} from 'solid-js';


const LanguageMenu = ({hide, setHide}) => {
    const [, {changeLanguage, getI18next}] = useTransContext();
    const [language, setLanguage] = createSignal(getI18next().language)

    getI18next().on('languageChanged', () => setLanguage(getI18next().language))

    const isActive = (lang) => language() === lang ? 'active' : '';

    return (
        <div className="card column languages">
            <div className="row">
                <h3 style="margin: 1px">Languages</h3>
                <span className="material-symbols-outlined hide" onClick={() => setHide(!hide())}>hide</span>
            </div>
            <hr style="width: 100%"></hr>
            <div className="controls">
                <label>Pick a language from the below to change the language</label>
                <button className={isActive('en')} onClick={() => changeLanguage('en')}>English</button>
                <button className={isActive('de')} onClick={() => changeLanguage('de')}>German</button>
            </div>
        </div>
    )
}

export default LanguageMenu;