import {Trans, useTransContext} from '@mbarzda/solid-i18next';
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
                <h3 style="margin: 1px"><Trans key="languages"/></h3>
                <span className="material-symbols-outlined hide" onClick={() => setHide(!hide())}>hide</span>
            </div>
            <hr style="width: 100%"></hr>
            <div className="controls">
                <label><Trans key="language-text"/></label>
                <button className={isActive('en')} onClick={() => changeLanguage('en')}>
                    <Trans key="english"/>
                </button>
                <button className={isActive('de')} onClick={() => changeLanguage('de')}>
                    <Trans key="german"/>
                </button>
            </div>
        </div>
    )
}

export default LanguageMenu;